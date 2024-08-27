
# 理解 Node.js 模块循环依赖及其影响

## 前言

在 Node.js 中，模块系统是非常重要的一部分。经常会在项目中使用 `require` 语句来引入其他模块。然而，在复杂的项目中，有时会遇到模块之间互相引用的情况，这种现象称为“循环依赖”。循环依赖会导致一些意想不到的问题，例如在模块尚未完全加载时导出空对象 `{}`。本文将详细分析循环依赖的原因、Node.js 如何处理循环依赖，并探讨如何避免或解决这个问题。

## 模块循环依赖的产生

- **Node.js 中的 `require` 机制**

  Node.js 使用 CommonJS 模块规范，其中 `require` 函数用于引入其他模块。每个模块在首次被引入时，会被加载、执行并缓存。`require` 函数会返回该模块的 `module.exports` 对象，这个对象包含了模块对外暴露的接口或内容。

- **循环依赖的定义及常见情况**

  循环依赖是指两个或多个模块互相引用的情况。比如，模块 A 引用了模块 B，而模块 B 又引用了模块 A。这样的引用链条可能会引发循环调用的问题，导致模块无法正确加载。
  
  `Node` 官方文档中有提到此现象：[循环引用](https://nodejs.org/dist/latest-v9.x/docs/api/modules.html#modules_cycles)

**代码示例**：

```js
// a.js
console.log('---- a start ----');
const b = require('./b.js');
exports.done = true;
console.log('---- a end ----');
```

```js
// b.js
console.log('---- b start ----');
const a = require('./a.js');
console.log('in b, a = %j, a.done = %j', a, a.done);
console.log('---- b end ----');
```

```js
// main.js（入口文件）
console.log('---- main start ----');
const a = require('./a');
console.log('in main, a.done = %j', a.done);
console.log('---- main end ----');
```

**运行结果**：

```plaintext
---- main start ----
---- a start ----
---- b start ----
in b, a = {}, a.done = undefined
---- b end ----
---- a end ----
in main, a.done = true
---- main end ----
```

从上面的例子可以看到，由于模块 A 和 B 之间存在循环依赖，模块 B 在加载 A 时得到了一个未完成的 `{}` 对象，导致 `a.done` 的值为 `undefined`。

## **Node.js 模块缓存机制**

**模块的首次加载与缓存**

Node.js 中，模块在第一次被 `require` 时，会被加载并执行，然后 Node.js 会将模块的 `module.exports` 对象缓存起来。如果其他模块再次 `require` 该模块，Node.js 会直接返回缓存的 `module.exports` 对象，而不会重新执行该模块的代码。

**缓存机制与循环依赖**

当模块 A 引用模块 B 时，Node.js 会执行模块 B 的代码。在模块 B 的代码执行过程中，如果它又 `require` 了模块 A，Node.js 会发现模块 A 尚未完成加载，于是会返回一个未完成的 `module.exports` 对象（通常是 `{}`）。这种机制有效地防止了无限循环的 `require` 调用。


## **循环依赖的影响与表现**

**循环依赖导致未完成的 `module.exports` 对象**

在循环依赖的情况下，Node.js 会在模块尚未完成执行时，返回一个未完成的 `module.exports` 对象。由于这个对象还没有完全初始化，它可能是一个空对象 `{}`，也可能缺少部分属性或方法。

**改进后的示例**：

```js
// a.js
console.log('---- a start ----');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('---- a end ----');
```

```js
// b.js
console.log('---- b start ----');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('---- b end ----');
```

```js
// main.js
console.log('---- main start ----');
const a = require('./a');
const b = require('./b');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
console.log('---- main end ----');
```

**运行结果**：

```plaintext
---- main start ----
---- a start ----
---- b start ----
in b, a.done = false
---- b end ----
in a, b.done = true
---- a end ----
in main, a.done = true, b.done = true
```

在这个示例中，由于模块 A 和 B 的导出对象在加载过程中相互依赖，导致在执行模块 A 时，`b.done` 的值是 `true`，而在执行模块 B 时，`a.done` 的值是 `false`。这种行为说明了在循环依赖中，`module.exports` 对象的初始化顺序会影响最终的结果。

## Node.js 的处理机制

- **防止无限循环的必要性**
  
  Node.js 采用了模块缓存和未完成的 `module.exports` 对象机制来防止无限循环的 `require` 调用。如果没有这个机制，两个相互依赖的模块会不断地 `require` 对方，导致堆栈溢出和应用崩溃。

- **未完成 `module.exports` 对象的返回**

  当 Node.js 检测到循环依赖时，它不会等待模块的完整加载，而是立即返回一个当前状态下的 `module.exports` 对象。这通常是一个未完成的对象，可能导致部分属性和方法在另一个模块中不可用。

## ESM（ES Modules）中循环依赖的行为

- **CommonJS 与 ESM 的差异**

  ::: tip
  `Node.js v8.5.0` 开始支持 `ES` （`ECMAScript`）模块规范的，可以通过 `.mjs` 文件扩展名、`package.json` [`"type"`](https://nodejs.cn/api/packages.html#type) 字段、或 [`--input-type`](https://nodejs.cn/api/packages.html#type) 标志告诉 `Node.js` 使用 `ES` 模块加载器。
  
  在这些情况之外，`Node.js` 将使用 `CJS` 模块加载器。 参阅[确定模块系统](https://nodejs.cn/api/packages.html#%E7%A1%AE%E5%AE%9A%E6%A8%A1%E5%9D%97%E7%B3%BB%E7%BB%9F)了解更多详细信息
  :::
  在 Node.js 中，除了 CommonJS 模块系统之外，还支持 ECMAScript Modules (ESM)。ESM 和 CommonJS 在处理循环依赖方面有所不同。由于 ESM 支持静态分析，它能够在模块代码未执行时提前确定导出的内容，从而减少循环依赖的问题。

- **ESM 如何处理循环依赖**

  在 ESM 中，即使模块之间存在循环依赖，编译器也能通过静态分析提前知道模块将要导出的部分内容。虽然在模块代码执行之前，这些内容可能尚未完全初始化，但它们至少是可以被访问的。

**ESM 示例**：

```js
// a.js
console.log('---- a start ----');
import { b } from './b.js';
var a = 'aaa';
function foo() {}
const bar = 'bar';
export { a, foo, bar };
console.log('---- a end ----');
```

```js
// b.js
console.log('---- b start ----');
import * as a from './a.js';
console.log('a: ', a);
console.log('---- b end ----');
```

```js
// main.js
console.log('---- main start ----');
import {} from './a.js';
console.log('---- main end ----');
```

**运行结果**：

```plaintext
---- b start ----
a:  [Module: null prototype] {
  a: undefined,
  bar: <uninitialized>,
  foo: [Function: foo]
}
---- b end ----
---- a start ----
---- a end ----
---- main start ----
---- main end ----
```

从这个结果可以看出，ESM 在模块代码执行之前，可以提前访问到导出的部分内容  。比如，函数 `foo` 已经可以被访问，而 `var` 声明的变量 `a` 在执行之前值为 `undefined`。
`let`、`const` 声明的变量，没有作用域提升，不允许在本模块代码执行之前访问这种提前分析和静态访问的特性。


## 如何避免或解决模块间的循环依赖

- **优化模块设计**：重构模块，使其具有清晰的职责分离，尽量避免模块之间的相互依赖。如果模块 A 和 B 必须互相依赖，考虑将它们的公共逻辑抽取到一个独立的模块 C 中。

- **延迟引用**：在需要时再进行 `require` 调用，而不是在模块加载时立即 `require`。这种方式可以避免模块在初始化时相互依赖。

- **使用 ESM 模块**：如前所述，ESM 模块在处理循环依赖方面更具优势。考虑在项目中使用 ESM 模块规范，尤其是当项目复杂度较高时。


## 总结

循环依赖是 Node.js 模块系统中的一个常见问题，尤其是在大型项目中。理解模块的加载顺序和缓存机制，有助于开发者更好地设计和管理模块依赖。通过优化模块设计、延迟引用或使用 ESM 模块，可以有效地避免和解决循环依赖问题。


## 相关资料

- [Node.js 循环引用](https://nodejs.org/dist/latest-v9.x/docs/api/modules.html#modules_cycles)
- [Node.js 模块系统](https://nodejs.cn/api/modules.html)
- [CommonJS 模块规范](https://nodejs.cn/api/modules.html#commonjs-modules)
- [ES Modules](https://nodejs.cn/api/packages.html)
- [Node.js 启用ES Modules](https://nodejs.cn/api-v16/esm.html#enabling)

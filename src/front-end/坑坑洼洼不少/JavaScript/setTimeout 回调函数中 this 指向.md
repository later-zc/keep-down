
# 理解 setTimeout 回调函数中 this 指向
::: info 前言
在 JavaScript 中，`this` 关键字的指向是一个常见且容易混淆的话题，尤其是在异步编程中使用的 `setTimeout`、`setInterval` 和 `requestAnimationFrame` 函数时。
这些函数的回调函数中的 `this` 在浏览器中通常默认指向 `window` 对象，在 Node.js 中为当前计时器创建返回的 `Timeout` 对象，因为这些函数的回调是在非严格模式下作为普通函数调用的。但这个行为可以通过不同的技术手段来控制。本文将详细解释在这些场景中 `this` 的指向规则及其应对方法。
:::
::: info 本文仅以 `setTimeout` 为例，其他函数的用法类似。
`setTimeout`、`setInterval` 是 JavaScript 中常用的定时器函数，分别用于延时执行和周期性执行回调函数。`requestAnimationFrame` 是一个用于执行高性能动画的方法，系统会在下次重绘之前调用指定的回调函数。
:::

##  setTimeout 中 this 指向
::: tip 
- 回调函数传参形式这里以普通函数为例，箭头函数由于不绑定 this，自然就没有 this，而是从上下文查找 this，就不考虑在内。
  - **全局顶级作用域下 this 指向**
    - **浏览器** 中是否在严格模式下，始终指向 `window`（浏览器中的 globalThis 指向）
    - **Node.js** 中是否在严格模式下，始终指向当前模块对象 `module.exports`，而不是 global（Node.js 中的 globalThis 指向）
  - **普通函数直接调用（形式如：`fn()`）中的 this 指向**
    - **浏览器** 中，严格模式下指向 `undefined`，非严格模式下指向 `window`
    ::: details [MDN 文档中有关描述](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#this)
      - In sloppy mode, function calls like f() would pass the global object as the this value. In strict mode, it is now undefined. When a function was called with call or apply, if the value was a primitive value, this one was boxed into an object (or the global object for undefined and null). In strict mode, the value is passed directly without conversion or replacement.
      - 在草率模式下，像f()这样的函数调用会将全局对象作为this值传递。在严格模式下，它现在是undefined 。当使用call或apply调用函数时，如果该值是原始值，则该值将被装箱到一个对象中（或undefined和null全局对象）。严格模式下，直接传递值，不进行转换或替换。
    :::
    - **Node.js** 中，严格模式下指向 `undefined`，非严格模式下指向 `global`
  :::


### 在 浏览器 环境中
```javascript
setTimeout(function () {
   console.log(this === window) // true（无论是否在严格模式下，结果都是一致）
}, 100)
```
### 在 Node.js 环境中
```javascript
const timer = setTimeout(function () {
   console.log(this === timer) // true（无论是否在严格模式下，结果都是一致）
}, 100)
```

## 改变 setTimeout 中 this 指向

::: warning 
本节讨论内容和代码运行的环境，仅限在浏览器环境中。
:::

```javascript
function MyClass() {
    this.name = "MyClass"
    setTimeout(function() {
        console.log(this.name) // 输出：""（无论是否在严格模式下）// [!code highlight]
    }, 1000)
}

const myClassInstance = new MyClass()
```

上面的例子中，`setTimeout` 内部的回调函数是**以“普通函数”的方式调用**的，因此 `this` 默认指向全局对象 `window`，而不是 `MyClass` 的实例。而 `window` 对象带有一个值为空字符串的 `name` 属性。

**应对方法：**

### 方式一：使用箭头函数
箭头函数不会创建自己的 `this`，而是捕获其所在上下文中的 `this`。

   ```javascript
   function MyClass() {
       this.name = "MyClass";
       setTimeout(() => {
           console.log(this.name); // 输出 "MyClass"
       }, 1000);
   }

   const myClassInstance = new MyClass();
   ```

### 方式二：使用 `.bind()` 方法
可以使用 `.bind()` 方法显式地将 `this` 绑定到回调函数。

   ```javascript
   function MyClass() {
       this.name = "MyClass";
       setTimeout(function() {
           console.log(this.name); // 输出 "MyClass"
       }.bind(this), 1000);
   }

   const myClassInstance = new MyClass();
   ```

### 方式三：传统方法：保存 `this` 的引用
在函数外部将 `this` 赋值给一个变量，然后在回调函数中引用该变量。

   ```javascript
   function MyClass() {
       var self = this; // self 引用了 MyClass 实例
       this.name = "MyClass";
       setTimeout(function() {
           console.log(self.name); // 输出 "MyClass"
       }, 1000);
   }
   
   const myClassInstance = new MyClass();
   ```

## 总结

在 JavaScript 中，`setTimeout`、`setInterval` 和 `requestAnimationFrame` 的回调函数中的 `this` 默认指向浏览器中全局对象 `window`（`Node.js` 中为当前计时器创建返回的 `Timeout` 对象）。
然而，在某些情况下，你可能需要改变 `this` 的指向，以适应你的需求。为了确保 `this` 指向我们期望的对象，常用的解决方案包括使用箭头函数、`.bind()` 方法绑定 `this`，以及在函数外部保存 `this` 的引用。掌握这些方法，可以帮助你避免在异步编程中 `this` 指向错误的问题，从而编写出更为稳定和可维护的代码。

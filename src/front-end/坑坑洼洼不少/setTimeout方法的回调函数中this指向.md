
# 理解JavaScript中setTimeout方法的回调函数中this指向.md
::: info 前言
在 JavaScript 中，`this` 关键字的指向是一个常见且容易混淆的话题，尤其是在异步编程中使用的 `setTimeout`、`setInterval` 和 `requestAnimationFrame` 函数时。
这些函数的回调函数中的 `this` 在浏览器中通常默认指向 `window` 对象，在 Node.js 中为当前计时器创建返回的 `Timeout` 对象，因为这些函数的回调是在非严格模式下作为普通函数调用的。但这个行为可以通过不同的技术手段来控制。本文将详细解释在这些场景中 `this` 的指向规则及其应对方法。
:::
::: tip 本文仅以 `setTimeout` 为例，其他函数的用法类似。
`setTimeout`、`setInterval` 是 JavaScript 中常用的定时器函数，分别用于延时执行和周期性执行回调函数。`requestAnimationFrame` 是一个用于执行高性能动画的方法，系统会在下次重绘之前调用指定的回调函数。
:::
## 1. setTimeout 中 this 指向
这里回调函数传参形式以普通函数为例，箭头函数由于不绑定this，从上下文查找this，这里不做示例。
### 在 浏览器 环境中
```javascript
setTimeout(function () {
   console.log(this === window) // 无论是否处于严格模式下，结果都是 true
}, 100)
```
### 在 Node.js 环境中
```javascript
const timer = setTimeout(function () {
   console.log(this === timer) // 无论是否处于严格模式下，结果都是 true
}, 100)
```

需要注意的是，这些回调函数中的 `this` 默认指向全局对象 `window`。这里用setTimeout举例，另外两个同理。

```javascript
function MyClass() {
    this.name = "MyClass";
    setTimeout(function() {
        console.log(this.name); // 输出 undefined（在严格模式下），或 "MyClass" 外的全局对象的属性（在非严格模式下）
    }, 1000);
}

const myClassInstance = new MyClass();
```

上面的例子中，`setTimeout` 内部的回调函数是**以“普通函数”的方式调用**的，因此 `this` 默认指向全局对象 `window`，而不是 `MyClass` 的实例。类似的情况也会出现在 `setInterval` 中。

**应对方法：**

1. **使用箭头函数：** 箭头函数不会创建自己的 `this`，而是捕获其所在上下文中的 `this`。

   ```javascript
   function MyClass() {
       this.name = "MyClass";
       setTimeout(() => {
           console.log(this.name); // 输出 "MyClass"
       }, 1000);
   }

   const myClassInstance = new MyClass();
   ```

2. **使用 `.bind()` 方法：** 可以使用 `.bind()` 方法显式地将 `this` 绑定到回调函数。

   ```javascript
   function MyClass() {
       this.name = "MyClass";
       setTimeout(function() {
           console.log(this.name); // 输出 "MyClass"
       }.bind(this), 1000);
   }

   const myClassInstance = new MyClass();
   ```

3. **传统方法：保存 `this` 的引用：** 在函数外部将 `this` 赋值给一个变量，然后在回调函数中引用该变量。

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

### 总结

在 JavaScript 中，`setTimeout`、`setInterval` 和 `requestAnimationFrame` 的回调函数中的 `this` 默认指向全局对象 `window`。为了确保 `this` 指向我们期望的对象，常用的解决方案包括使用箭头函数、`.bind()` 方法绑定 `this`，以及在函数外部保存 `this` 的引用。掌握这些方法，可以帮助你避免在异步编程中 `this` 指向错误的问题，从而编写出更为稳定和可维护的代码。

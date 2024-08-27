# JS 引擎解析规则导致的字面量数值调用方法报错


## 前言

在 JavaScript 中，我们可能会遇到直接对数值调用方法时出现语法错误的情况。比如使用 `toFixed()` 方法时，简单的数值如 `1.toFixed(2)` 会导致解析错误。
```js
1.toFixed(2) // Uncaught SyntaxError: Invalid or unexpected token
12.toFixed(2) // Uncaught SyntaxError: Invalid or unexpected token
```
本文将深入分析这个问题的原因，并提供几种有效的解决方案。

## 问题描述

当你尝试在 JavaScript 中直接对数值调用方法时，例如：

```js
1.toFixed(2) // Uncaught SyntaxError: Invalid or unexpected token
12.toFixed(2) // Uncaught SyntaxError: Invalid or unexpected token
```

会引发语法错误。这是因为 **JavaScript 引擎在解析数值时，默认将小数点 `.` 认为是浮点数的一部分，而不是方法调用的标识符**。

## 原因分析

1. **JavaScript 引擎解析规则**： JavaScript 中的数字字面量在没有显式分隔的情况下会被解析为一个整体。当 `1.` 出现时，JavaScript 引擎会将其视为小数的一部分，因此后面的 `toFixed(2)` 就会被误认为是浮点数的一部分，而不是方法调用。

2. **数值字面量的属性访问问题**： JavaScript 中的原始数值（例如 `1`、`12`）本身是不具备属性和方法的，但 JavaScript 引擎会在需要时自动将原始值转换为对应的包装对象，这样你可以调用诸如 `toFixed()` 的方法。然而，如果语法不正确，转换过程就不会触发，导致语法错误。
用 `Number` 构造函数上别的原型方法来验证这一观点：

  ```js
  1.toString() // Uncaught SyntaxError: Invalid or unexpected token
  Number(1).toString() // '1'
  ```

## 解决方法

1. **使用两个点号**：通过在数字后面加上另一个点号，强制 JavaScript 解析为浮点数，随后再调用方法：
    ```js
    1..toFixed(2) // '1.00'
    ```

2. **使用变量**：将数字存储在变量中，再调用方法。这种方式最为直观和安全：
    ```js
    const n = 1;
    n.toFixed(2) // '1.00'
    ```

3. **用括号包裹数值（不推荐）**： 将数值放在括号中，明确其边界，然后再调用方法：
    ```js
    (1).toFixed(2) // '1.00'
    ```
   ::: warning
   - 有些代码格式化工具在保存时可能会去掉这些括号，因此使用时要谨慎。
   - 可以使用 ```(1 * 1.0).toFixed(2)``` 将整数值 `1` 转换为浮点值 `1.0` 的方式来规避，但并不推荐这么做。
   :::

4. **使用 `Number` 包装对象**： 通过 `Number` 构造函数将数值转换为包装对象，再调用方法。这种方式确保了方法调用的安全性：
    ```js
    Number(1).toFixed(2) // '1.00'
    ```
   ::: tip
   通过原始类型的包装类将其包装成对象的形式调用，因为 js 原始值本身是不具备属性和方法的，理论上是不能访问到属性和方法的，
   但是这一个操作 js 引擎内部本身会帮我们用包装类转成对象去处理完成，这里之所以可以解决问题，本质上应该还是因为转成了对象，
   从而让后面那个点 `.` 变成对象的属性访问，从而能被 `js` 引擎正确解析。
   :::

## 结论

在 JavaScript 中直接对数值调用方法时，需要注意 JavaScript 引擎的解析规则。通过正确的语法形式，可以避免因语法错误导致的调用失败。使用上述几种方法，可以有效解决这一问题。掌握这些技巧有助于你在处理 JavaScript 数值时避免常见的陷阱。

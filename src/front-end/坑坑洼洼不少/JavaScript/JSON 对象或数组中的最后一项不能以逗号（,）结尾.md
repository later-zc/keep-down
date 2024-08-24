# JSON 对象或数组中的最后一项不能以逗号（,）结尾


## 示例
```js
// both will throw a SyntaxError
JSON.parse("[1, 2, 3, 4, ]") // VM1901:1 Uncaught SyntaxError: Unexpected token ']', "[1, 2, 3, 4, ]" is not valid JSON
JSON.parse('{"foo" : 1, }') // VM1914:1 Uncaught SyntaxError: Expected double-quoted property name in JSON at position 12


// 去掉对象数组中最后一项的分号：
JSON.parse("[1, 2, 3, 4]")
JSON.parse('{"foo" : 1}')
```
## 原因
JSON 是一种数据交换格式，其语法是严格的。**JSON 的规范明确规定了对象和数组的最后一个元素后面不能有多余的逗号**。
JavaScript 的 `JSON.parse` 方法遵循这一规范，所以在解析不符合规范的 JSON 字符串时会抛出错误。


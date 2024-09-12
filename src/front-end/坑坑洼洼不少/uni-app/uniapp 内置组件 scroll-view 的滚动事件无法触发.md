# 解决 uniapp 内置组件 scroll-view 的滚动事件无法触发
::: info 引言
在使用 uniapp 开发跨平台应用时，经常遇到分页加载更多的需求，有两种方案：
1. **监听 onReachBottom 页面事件**
2. **监听 scroll-view 的滚动事件**。

onReachBottom 页面事件跟滚动区域的页面布局有关，且多端表现有差异，这里不做讨论。
:::

## 解决方案
根据官方文档中的描述，scroll-view 监听滚动事件时，需要满足以下条件：
- 使用竖向滚动时，需要给 `<scroll-view>` 元素一个固定高度，通过 `css` 设置 `height`。
- 使用横向滚动时，需要给`<scroll-view>`添加 `white-space: nowrap;` 样式。



## 总结
我们这里使用的竖向滚动，给scroll-view元素设置固定高度，即可监听滚动事件。



## 相关资料

- [uniapp 内置组件 scroll-view 文档](https://uniapp.dcloud.net.cn/component/scroll-view.html)


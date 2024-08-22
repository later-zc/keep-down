# 跨平台视频播放挑战：解决 iOS 设备上 Event path 属性缺失的问题

## 一. 前言

::: info 背景
在某翻牌 h5 项目中，使用 `video` 标签播放视频，并通过监听 DOM 的原生 `click` 事件来控制视频的暂停。然而，在 iOS 设备上，发现 `event` 对象没有 `path` 属性，导致在点击视频时无法触发暂停功能，而在 Android 设备上则没有此问题。这个问题源于不同设备和浏览器对事件对象属性支持的不一致性。
:::

## 二. iOS 设备上的事件对象问题

`event.path` 属性是一个**非标准的属性**，最初由 Chrome 浏览器引入，用于返回事件路径的数组。然而，由于它不是 W3C 标准的一部分，因此并不被所有浏览器支持。特别是在 iOS 设备上的 Safari 浏览器中，`event.path` 属性不可用，导致依赖该属性的功能在这些设备上无法正常工作。

在现代浏览器中，W3C 标准引入了 `event.composedPath()` 方法，它可以返回事件路径数组，并在大多数浏览器中得到广泛支持。因此，为了兼容 iOS 设备，我们需要在事件处理逻辑中使用标准的 `event.composedPath()` 方法作为替代。

## 三. 解决方案

为了解决 `event.path` 在 iOS 设备上不可用的问题，可以使用以下兼容性处理方法：

```js
element.onClick(event) {
  const ev = window.event || event  // 获取事件对象
  const path = event.path || (event.composedPath && event.composedPath())  // 兼容处理

  console.log(path)
}
```

**代码分析**:

- `const ev = window.event || event`：在某些旧版浏览器中，事件对象可能没有作为参数传递，所以这里通过 `window.event` 进行兼容性处理。
- `const path = event.path || (event.composedPath && event.composedPath())`：首先尝试获取 `event.path`，如果不存在，则尝试使用标准的 `event.composedPath()` 方法。该方法返回一个数组，包含事件发生的路径，并且在大多数现代浏览器中均有良好的支持。

## 四. 代码实现

为了确保视频的暂停功能能够在所有设备上正常工作，我们可以在 `click` 事件处理函数中引入上述兼容性代码。以下是完整的实现代码：

```js
element.onClick(event) {
  // 获取事件对象
  const ev = window.event || event
  
  // 获取事件路径，兼容处理
  const path = event.path || (event.composedPath && event.composedPath())
  
  // 打印路径以供调试
  console.log(path)

  // 在事件路径中找到视频元素并暂停
  path.forEach((element) => {
      if (element.tagName === 'VIDEO') {
          element.pause()
      }
  })
}
```

**工作原理**:

1. `onClick` 事件触发时，首先通过 `window.event || event` 获取事件对象。
2. 通过 `event.path` 或 `event.composedPath()` 获取事件路径。路径是一个数组，包含事件从触发元素到 `document` 的所有节点。
3. 遍历事件路径，找到 `<video>` 元素并调用其 `pause()` 方法，暂停视频播放。

## 五. 改进建议

为了确保代码的兼容性和稳定性，可以考虑以下改进建议：

1. **浏览器兼容性检测**：在实际使用中，可以根据浏览器的特性进行更加细致的兼容性处理。对于老旧浏览器，可以添加更多的检测逻辑，确保代码的健壮性。

2. **性能优化**：在复杂的 DOM 结构中，事件路径可能包含大量节点。为了提高性能，可以在遍历事件路径时添加额外的判断条件，避免不必要的计算。

3. **异常处理**：在实际项目中，建议为事件处理代码添加异常处理机制，确保在出现意外情况时，代码不会导致应用崩溃或用户体验受损。

通过这些改进，可以进一步提升代码在不同设备和浏览器中的表现，为用户提供一致的使用体验。



[引用]: https://blog.csdn.net/qq_39264561/article/details/110084170


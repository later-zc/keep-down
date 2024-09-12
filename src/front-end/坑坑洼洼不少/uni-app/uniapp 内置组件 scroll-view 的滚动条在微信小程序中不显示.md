# 解决 uniapp 内置组件 scroll-view 的滚动条在微信小程序中的不显示的问题
::: info 引言
在使用 uniapp 开发跨平台应用时，可能会遇到滚动条不显示的问题。尤其是在 scroll-view 组件中，由于不同平台对组件属性支持的差异，导致滚动条的显隐控制存在不一致。
:::

## 前言
在使用 `uniapp` 开发微信小程序时，**内置组件 `scroll-view` 的滚动条在微信小程序中不显示**，查看[组件文档](https://uniapp.dcloud.net.cn/component/scroll-view.html#%E5%B1%9E%E6%80%A7%E8%AF%B4%E6%98%8E)，
有个组件属性 `show-scrollbar`：控制是否出现滚动条，默认 `false`，但是却只支持 `App-nvue 2.1.5+` 的环境。

对此感到很奇怪，为什么会不支持微信小程序？ 于是，查看微信小程序的 `scroll-view` 组件，发现也有 `show-scrollbar` 属性，默认 `false`，滚动条显隐控制 (同时开启 `enhanced` 属性后生效。

由此可见，微信小程序是支持滚动条的，但是为什么 `uniapp` 中的 `scroll-view` 不行呢，带着疑惑，去网上查找相关文章，发现一篇：[uniapp scroll-view滚动条不显示](https://blog.csdn.net/LJJONESEED/article/details/123986312)，虽然不是解释上面疑惑的问题，但对于解决当下的需求起了帮助。

  ```css
  /* 以下内容来自文章 */
  
  /* 我是用了scroll-view可以滚动，但是不出现滚动条，vue页面。 */
  /* 在调试中发现是被这个样式影响了 */
  
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
  }
  ```

于是，我在微信小程序中查找，发现微信小程序的控制台中并无显示有该样式。

猜测是微信开发者工具的调试器问题，于是将项目跑在 `Chrome` 浏览器中，果不其然，能找到该样式，从而就定位到问题所在。

## 问题原因分析

通过研究相关文档和实际测试，问题的根源在于 uniapp 的 scroll-view 组件的样式实现不同，导致在一些平台上不显示滚动条。

微信开发者工具会对有些默认样式进行隐藏，这使得调试变得困难，需要在浏览器中进一步确认。


## 解决

解决这一问题的一个简单方法是覆盖 scroll-view 的默认样式，使滚动条显示出来。下面是示例代码：

  ```css
  .scroll-bar {
    /*滚动条整体样式*/
    ::-webkit-scrollbar {
      display: block;
      width: 4px !important;
      height: 4px !important;
      -webkit-appearance: auto !important;
      background-color: #ccc !important;
    }
    /*滚动条上的滚动滑块*/
    /deep/ ::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      /* box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important; */
      background: #ccc !important;
    }
  
    /*滚动条轨道*/
    /deep/ ::-webkit-scrollbar-track {
      /* box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important; */
      /* border-radius: 10px !important; */
      background: #ffffff !important;
    }
  }
  ```
当第三方组件不满足需求时候，与其花大量时间去查资料去试错，不妨可以自己手搓一个。


## 相关资料

- [uniapp 内置组件 scroll-view 文档](https://uniapp.dcloud.net.cn/component/scroll-view.html)
- [微信小程序 scroll-view 组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)
- [相关文章](https://blog.csdn.net/LJJONESEED/article/details/123986312)
- [MDN 中关于::-webkit-scrollbar 的文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar)


# 解决 npm install 时由于 node-sass 依赖导致的 gyp ERR 错误问题

## 前言

在运行 `npm install` 安装依赖时，遇到如下错误：

  <img src="./assets/image-20230524234851521.png" alt="image-20230524234851521" style="zoom:80%;" />

  <img src="./assets/image-20230524234923323.png" alt="image-20230524234923323" style="zoom:80%;" />

在 `ERR` 信息的最顶部，找到了这样的一条关键信息，现在已经可以断定是在导入 `node-sass` 这个依赖时出现的问题：

  ```bash
  npm ERR! path D:\shundian-admin\node_modules\node-sass
  npm ERR! command failed
  ```
这是典型的 `node-gyp` 编译错误，通常在安装 `node-sass` 这类需要编译的模块时出现。



## 问题分析

- **原因一：`Node.js` 与 `node-sass` 版本不兼容**

  `node-sass` 是 Sass 语言的一个 Node.js 绑定，使用 C++ 编写并需要编译。不同的 Node.js 版本会影响到 node-sass 的编译和运行，必须使用兼容的版本：


    ::: details 官方提供的版本兼容表
    | NodeJS  | Supported node-sass version 支持的节点 sass 版本 | Node Module |
    | ------- | ------------------------------------------------ | ----------- |
    | Node 20 | 9.0+                                             | 115         |
    | Node 19 | 8.0+                                             | 111         |
    | Node 18 | 8.0+                                             | 108         |
    | Node 17 | 7.0+, <8.0                                       | 102         |
    | Node 16 | 6.0+                                             | 93          |
    | Node 15 | 5.0+, <7.0                                       | 88          |
    | Node 14 | 4.14+, <9.0                                      | 83          |
    | Node 13 | 4.13+, <5.0                                      | 79          |
    | Node 12 | 4.12+, <8.0                                      | 72          |
    | Node 11 | 4.10+, <5.0                                      | 67          |
    | Node 10 | 4.9+, <6.0                                       | 64          |
    | Node 8  | 4.5.3+, <5.0                                     | 57          |
    | Node <8 | <5.0                                             | <57         |
    :::

  ::: details 扩展知识
  上面这段话的意思是：`node-sass` 是一个 Node.js 模块，它使用了 C++ 编写的代码，因此需要编译成机器码才能在不同的操作系统和 Node.js 版本上运行。

  具体来说：
  
  1. **C++ 扩展模块**：`node-sass` 是一个用于将 Sass 代码编译成 CSS 的工具，而它的底层实现是基于 LibSass（一个用 C++ 实现的 Sass 编译器库）。为了在 Node.js 环境中使用这个 C++ 库，需要将其编译成适合当前操作系统和 Node.js 版本的二进制文件。
  
  2. **针对不同的 Node.js 版本编译**：Node.js 的不同版本可能使用了不同的 V8 引擎（JavaScript 引擎），并且它们的内部 API（Node-API 或 N-API）可能发生变化。因此，`node-sass` 这样的原生模块在不同的 Node.js 版本上需要重新编译，以确保其二进制文件与当前的 Node.js 版本兼容。
  
  在安装 `node-sass` 时，`npm` 或 `yarn` 会自动尝试下载适合当前环境的预编译二进制文件。如果下载失败，或者没有可用的预编译文件，则会在本地机器上进行编译。这也是为什么安装 `node-sass` 可能需要安装编译器和构建工具的原因。
  
  总结来说，这段话强调了 `node-sass` 作为一个 C++ 扩展模块的特性，说明它需要针对不同版本的 Node.js 进行编译，以确保兼容性和正确运行。
  :::

- **原因二：网络问题导致依赖下载失败**

  在中国大陆，由于网络限制，从官方 npm 源下载某些依赖可能会超时或失败。使用国内镜像源可以解决此问题。





## 解决方案

- **解决方案一：调整 `Node.js` 和 `node-sass` 版本**

  1. **检查版本兼容性**：
      ```bash
      node -v
      npm list node-sass
      ```
     查阅 `node-sass` 的最低和最高支持的[版本兼容表](https://github.com/sass/node-sass#node-version-support-policy)
     
  2. **切换 `Node` 版本**：
  
     可以通过使用 [nvm-windows（Windows）](https://github.com/coreybutler/nvm-windows) 或 `nvm（Linux/macOS）` 工具来管理和切换 `Node` 版本。
  
  3. **调整 `node-sass` 版本**：

     根据 `Node.js` 版本修改 `package.json` 中的 `node-sass` 版本，然后重新运行 `npm install`。

   ::: tip
   根据项目中的 `node-sass` 的版本，切换到对应的 `node` 版本，又或者根据 `node` 版本去修改 `package.json` 中对应的 `sass` 版本，这个会不会引起项目其他依赖的兼容问题，自己根据实际情况决定。
   :::

- **解决方案二：使用国内镜像源**

  配置 `npm` 使用国内镜像源：
  ```bash
  npm config set registry https://registry.npmmirror.com
  ```
  我们这里根据 `node-sass` 官方提供的[配置命令](https://github.com/sass/node-sass#install-from-mirror-in-china)：
  ```bash
  npm install -g mirror-config-china --registry=https://registry.npmmirror.com
  ```
  执行官方提供的配置命令之后，会自动修改全局的 `.npmrc` 中的配置会自动加很多配置

     <img src="./assets/image-20230525000808357.png" alt="image-20230525000808357" style="zoom:80%;" />

     <img src="./assets/image-20230525012858800.png" alt="image-20230525012858800" style="zoom:80%;" />

  也可以针对单个项目设置，修改或新增项目目录下的 `.npmrc` 文件，将上面的命令加进去即可。

## 改进建议

**使用 sass 替代 node-sass**： sass 是一个纯 JavaScript 实现的库，无需编译，安装和使用更简便。

## 相关资料

- [解决npm install时，由于node-sass依赖导致的一系列gyp ERR错误](https://tree.moe/deal-with-gyp-err-caused-by-node-sass/)

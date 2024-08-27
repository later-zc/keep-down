# 使用 nvm 管理 Node.js 版本时，npm 安装失败的原因与解决方案

## 前言

某次为了看 `vue2` 源码然后安装依赖时，因为当时电脑 `node14+` 的版本不支持 `pageage.json` 中依赖所使用的 `workspace` 路径时（官网说最低要 `node16+`），
从而导致使用 `npm` 安装依赖失败，网上也有说用 `yarn` 或 `pnpm` 安装去解决。

那咱们就用 `yarn` 去尝试安装，结果在安装依赖时，提示让我选择 `@vue/compiler-sfc` 依赖所需要下载的版本，
然后我去查阅 `vue2` 的仓库，发现 `vue2.7` 以上的版本 `@vue/compiler-sfc` 依赖都是使用 `workspace` 管理，`vue2.6` 就没有使用 `workspace` 来管理依赖，而是指定版本的方式，
所以猜测可能 `2.7` 之后，将这依该赖从主项目中提取出来，放到了 `workspace` 中进行管理。

由于 Vue 2.7 及以上版本需要更高版本的 `Node.js` 来支持 `workspace`，而当时电脑上 `Node.js` 版本较低，无法支持这些新特性。
为了解决这个问题，最终决定使用 `nvm-windows` 来管理 `Node.js` 版本，以便切换到更高版本的 `Node.js` 去安装依赖。

  ```json
  // pageage.json
  "dependencies": {
      "@vue/compiler-sfc": "workspace:*",
  },
  ```

当时电脑上已有 `node14` 的版本，一开始安装 `nvm-windows`，然后提示我是否接管已有的 `node` 版本，我选择接管，然后就导致 `node -v` 出问题（提示找不到该命令）。
然后就通过 `nvm-windows` 下载 `node`，安装 `npm` 时一直失败。



## 问题分析

- **Node.js 版本不兼容导致依赖安装失败**：当使用较低版本的 `Node.js` 时，`package.json` 中使用的 `workspace` 功能无法被识别，导致依赖安装失败。
- **nvm 接管已有 Node.js 版本的冲突问题**：安装 `nvm` 后选择接管已有的 `Node.js` 版本时，可能导致路径配置冲突。这会影响 `npm` 的安装或使用，表现为命令找不到或权限问题。
- **npm 安装失败的可能原因**：由于网络问题、权限问题或路径冲突，`npm` 可能无法正确安装或使用。切换下载源或检查路径配置可以帮助解决这些问题。



## 解决方案

```bash
# 1. 卸载已安装的 Node.js
# 手动删除或使用系统包管理器卸载

# 2. 卸载nvm并重新安装
# 确保没有其他 Node.js 环境干扰

# 3. 使用 nvm 安装所需的 Node.js 版本
nvm install 14.18.1 # 替换为你需要的版本号

# 4. 如果遇到 npm 安装问题，尝试更改下载源（之后，再卸载对应 nvm 中的 node 并重新安装，npm uninstall xxx）
registry=https://registry.npmjs.org/

# 5. 测试 Node.js 和 npm 是否正确安装
node -v
npm -v
```



## 相关资料

- [ChatGPT](https://chat.openai.com/)：用于解决代码问题的 AI 工具
- [Node.js 所有发布版本](https://nodejs.org/dist/index.json)：查看不同版本的发布信息
- [nvm-windows下载](https://github.com/coreybutler/nvm-windows/releases)：下载 nvm 的 windows 版本
- [nvm-windows 文档](https://github.com/coreybutler/nvm-windows#star-star-uninstall-any-pre-existing-node-installations-star-star)：nvm-windows 的使用说明




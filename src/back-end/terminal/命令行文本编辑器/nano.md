# 认识 nano
nano 是一个基于命令行的文本编辑器，旨在提供比 vi 更易上手的编辑体验。它最初是为了模仿 Pico 编辑器而开发，但具有 GPL 协议下更自由的授权方式和更多增强功能。



# 发展简史
**诞生背景**：
> nano 最初由 Chris Allegretta 于 1999 年开发，第一个版本名为 TIP，目的是为 Unix/Linux 用户提供一个简单易用的文本编辑器。

**发展历程**：
  > 后因与同名软件冲突，改名为 nano。

  > 随后被 GNU 接纳，成为官方 GNU 项目。

  > nano 由早期的 Pico 编辑器演变而来，后来成为很多 Linux 发行版默认安装的轻量级编辑器。

**优势**：
> 界面简洁，快捷键易记，适合命令行新手和系统管理员使用。相比 Vim 或 Emacs，上手快但功能相对轻量。

**当前状态**：
> nano 持续更新，支持撤销、语法高亮、多文件编辑等现代功能，深受用户喜爱。



# 安装方式
| 操作系统 | 安装方式                                                                                                                                         | 备注 |
| - |----------------------------------------------------------------------------------------------------------------------------------------------| - |
| Linux | 多数发行版预装，Ubuntu / Debian 默认已内置。<br> 如需手动安装：`sudo apt install nano`                                                                            | 常见发行版一般直接可用 |
| Windows | ① 安装 WSL (Linux 子系统) ，支持完整 Linux nano，命令：`sudo apt install nano`；<br> ② Git Bash 自带 nano，安装 Git 即有；<br> ③ 使用 Cygwin/MinGW 安装，适合纯 Windows 环境； | WSL 提供原生 Linux 体验，Git Bash 常用轻量方案 |
| MacOS | 系统自带 nano（通常版本较旧）<br> 推荐安装最新版：`brew install nano`（需先安装 Homebrew）| macOS 自带版本较旧，功能有限 |                                                                         



# 命令使用


## 启动与退出
| 操作           | 命令 / 快捷键                       | 说明                                                                        |
|--------------|--------------------------------|---------------------------------------------------------------------------|
| 启动 nano      | `nano filename.txt`            | 打开指定文件，文件不存在则创建，不加文件名会打开空白缓冲区                                             |
| 显示版本         | `nano --version` <br>或 `nano -V` | 查看 nano 版本 <br> MacOS 系统预装版的老版 nano 不支持,<br>用 Homebrew 安装的新版 nano(v8.5）支持 |
| 保存文件         | `Ctrl + O` 后按 `回车`             | 写入当前缓冲区到文件                                                                |
| 退出 nano      | `Ctrl + X`                     | 退出编辑，提示保存                                                                 |
| 退出 nano 且不保存 | `Ctrl + X` 后按 `N`              | 不保存直接退出                                                                   |
| 显示帮助菜单       | `Ctrl + G`                     | 查看快捷键帮助                                                                   |
| 取消当前操作模式     | `Ctrl + C`                     | 取消当前操作模式                                                                  |


## 光标移动快捷键
| 操作     | Windows 键盘                                                    | macOS 键盘（常规）                                                                  | 备注                                                |
|---------|---------------------------------------------------------------|-------------------------------------------------------------------------------|---------------------------------------------------|
| 向左 / 右移动 | `← / →` 或 `Ctrl + B / Ctrl + F`                                   | 同 Windows（系统预装版 nano），<br> Homebrew 安装的新版 nano(v8.5）<br>Control + B/F 已改为其他操作 |    |
| 向上 / 下移动 | `↑ / ↓` 或 `Ctrl + P / Ctrl + N`                                   | 同 Windows                                                                     |                                                   |
| 移动到行首  | `Ctrl + A`                                                    | 同 Windows                                                                     |                                                   |
| 移动到行尾  | `Ctrl + E`                                                    | 同 Windows                                                                     |                                                   |
| 跳转到指定行 | `Ctrl + Shift + -` 支持两种写法：<br>`row,column` 或 `row column` | 同 Windows 或 `Control + -` <br> 只支持一种写法：`row,column`                           | macOS 需终端开启 Option 作为 Meta 键<br> row 在前 column 在后 |
| 页面上 / 下翻 | `Ctrl + Y / Ctrl + V` | 同 Windows                                                                     | |


## 编辑操作
| 操作         | Windows 键盘                          | macOS 键盘（Option 作为 Meta）      | 备注                         |
|------------|-------------------------------------|-------------------------------|----------------------------|
| 剪切当前行或选中区域 | `Ctrl + K`                          | `Control (⌃) + K`             | 剪切当前所在整行或选中区域，内容放入缓冲区      |
| 粘贴         | `Ctrl + U`                          | `Control (⌃) + U`             | 粘贴复制或选中的区域                 |
| 撤销         | `Alt + U` 或 `Esc + U`               | `Option (⌥) + U` 或 `Esc + U`  | 新版 nano 支持撤销               |
| 重做         | `Alt + E`  或 `Esc + E`              | `Option (⌥) + E`  或 `Esc + E` | 反向撤销                       |
| 选中区域（标记开始） | `Ctrl + Shift + 6` <br>或 `Ctrl + ^` | `Control (⌃) + Shift + 6`     | 再用方向键扩展选区                  |
| 复制当前行或选中区域 | `Alt + 6` 或 `Esc + 6`               | `Option (⌥) + 6` 或 `Esc + 6`  | MacOS 需终端开启 Option 作为 Meta |
| 插入文件内容     | `Ctrl + R`                          | `Control (⌃) + R`             | 从文件插入                      |
| 删除当前字符     | `Ctrl + D`                          | `Control (⌃) + D`             |                            |


## 查找与替换
| 操作         | Windows 键盘 | macOS 键盘（Option 作为 Meta） | 备注 |
|------------|------------|--------------------------|--|
| 查找文本 | `Ctrl + W` | `Control + W`            | 关键字查找 |
| 查找下一个匹配 | `Alt + W` | `Option + W`             |  |
| 替换文本 | `Ctrl + \` | `Control + \`            | 逐步替换输入文本 |
| 取消查找 | `Ctrl + C` | `Control + C`            |  中止查找 |


## 高级功能
| 功能 | 快捷键 / 命令                    | 说明                          |
|-------|-----------------------------|-----------------------------|
| 同时编辑多个文件 | `nano file1 file2`          | 按顺序编辑多个文件（退出后自动进入下一个文件的编辑）  |
| 显示行号 | `nano -l filename`          | 启动时显示行号                     |
| 禁止自动换行 | `nano -w filename`          | 保持长行不自动换行                   |
| 启动只读模式 | `nano -v filename`          | 只读打开，不允许修改                  |
| 启用语法高亮 | `nano -Y language filename` | 指定语法模式（如 htmL、js）           |
| 添加行号、配置高亮等 | 编辑 `.nanorc` 配置文件           | nano的配置文件，支持个性化设置，需用户手动编辑配置 |


## macOS 专属说明
::: info
macOS 终端默认 Option (⌥) 键不作为 Meta 键（对应 windows下 nano 中的 Alt）。

macOS 用户务必设置 Option 为 Meta，避免`Option + U`（撤销）、`Option + 6`（复制行）等快捷键失效。
:::

**Terminal.app**
> 1. 打开 Terminal
> 2. 菜单栏选择 `Terminal > Settings > Profiles > Keyboard`
> 3. 勾选 ✅ `Use Option as Meta key`

**iTerm2**
> 1. 打开 iTerm2
> 2. 进入 `Preferences > Profiles > Keys`
> 3. 设置 `Left Option key acts as: Meta`

配置完成后，即可使用 `Option + U`（撤销）、`Option + 6`（复制行）等快捷键。











































































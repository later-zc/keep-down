# 踩坑 SSH 主机验证机制时使用回车键而未输入 'yes' 导致失败


## 前言

在使用 Git 通过 SSH 克隆远程仓库时，很多人会因为未正确输入确认信息而导致操作失败。这种情况下，直接按回车键而不是输入 'yes' 是常见的错误。本文将深入分析这一问题的原因，并提供相应的解决方法。

## 问题描述

在你尝试使用 SSH 克隆一个远程仓库时，例如使用以下命令：

```bash
git clone git@gitee.com:xxx/git-test-repository.git
```

你可能会看到以下提示：

```bash
Cloning into 'git-test-repository'...
The authenticity of host 'gitee.com (212.64.63.190)' can't be established.
ED25519 key fingerprint is SHA256:+ULzij2u99B9eWYFTw1Q4ErYG/aepHLbu96PAUCoV88.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

这时，如果你直接按下回车键，而没有输入 'yes'，则会导致以下错误：

```bash
Host key verification failed.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

## 原因分析

1. **SSH 主机验证机制**：SSH 在首次连接到一个新主机时，会提示用户确认主机的身份，以确保连接的安全性。这是为了防止中间人攻击，确保你连接到的确实是你期望的主机。

2. **输入失误**：如果未正确输入 'yes' 确认主机身份，而是直接按回车键，SSH 会中断连接，并不会将该主机的指纹添加到已知主机列表（`~/.ssh/known_hosts`）中。

3. **结果**：因为未确认主机，SSH 无法继续连接到远程仓库，导致克隆操作失败。

## 解决方法

### 方式一：正确处理主机验证提示

- **输入 'yes' 确认**：当提示 `Are you sure you want to continue connecting (yes/no/[fingerprint])?` 时，务必输入 'yes' 并按回车键。这样，SSH 会将该主机添加到 `~/.ssh/known_hosts` 文件中，以便下次连接时无需再次确认。

### 方式二：重试克隆操作

- **重新执行克隆命令**： 如果此前因为按错键导致克隆失败，可以重新执行 `git clone` 命令，并确保在提示时输入 'yes' 进行确认。

### 方式三；检查并更新 `known_hosts` 文件

- **手动修复已知主机文件**： 如果出现多次失败，可以检查 `~/.ssh/known_hosts` 文件，手动删除可能存在的错误条目，然后重新尝试连接。

## 结论

未在 SSH 主机验证提示中输入 'yes' 是导致克隆远程仓库失败的常见问题。通过正确处理这一提示，你可以避免 SSH 连接失败，从而顺利完成 Git 克隆操作。掌握 SSH 主机验证机制和正确的操作方法，有助于更好地管理远程仓库连接问题。

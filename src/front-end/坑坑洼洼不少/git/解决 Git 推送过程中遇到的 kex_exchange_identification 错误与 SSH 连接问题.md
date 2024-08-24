# 解决 Git 推送过程中遇到的 kex_exchange_identification 错误与 SSH 连接问题

## 前言

在一次正常推送代码到 `GitHub` 的过程中，遇到了一个意外的错误信息：

```bash
kex_exchange_identification: connection closed by remote host
connection closed by 20.205.243.166 port 22
fatal: Could not read from remote repository.
Please make sure you have the correct access rights
and the repository exists.
```

这一错误使得推送过程无法继续。本文将深入探讨该错误的成因，并提供解决方案。




## kex_exchange_identification 错误分析

`kex_exchange_identification` 是指在使用 `SSH` 连接远程服务器时，密钥交换阶段发生了识别错误。通常，这种错误与以下原因有关：
  - **SSH 密钥配置错误**：本地 `SSH` 密钥未正确配置或未添加到远程仓库的授权密钥中。
  - **网络问题**：防火墙或网络设置导致 `SSH` 连接中断，特别是对特定端口的限制。 
  - **服务器端配置错误**：服务器端（如 `GitHub`）的 `SSH` 配置出现异常。




## 可能原因分析

猜测在这次推代码之前我有将仓库从私有变成公共可能导致的

尽管将仓库从私有变为公共的操作不会直接导致该错误，但如果在切换过程中修改了 SSH 配置或网络设置，可能会间接引发问题。
更为常见的原因是 `SSH` 密钥未正确配置，或者网络环境对端口 `22` 的访问受限。


## 解决方案

### 步骤一：重新生成并配置 SSH 密钥

::: tip
这里我们采用 `rsa` 非对称加密算法生成密钥，但你也可以使用其他算法。
:::

1. 删除本地 `C:/Users/(你的用户名)/.ssh/id_rsa` 文件和 `id_rsa.pub` 文件。
2. 重新生成 SSH 密钥：
   ```bash
   ssh-keygen -t rsa -C "youremail@xxx.com"
   ```
3. 打开 `C:/Users/(你的用户名)/.ssh/id_rsa.pub` 并复制内容。
4. 在 GitHub 中添加新的 SSH 密钥：转到 `GitHub` 的 `SSH Keys` 设置页面，粘贴并保存公钥。
5. 测试重新推送代码。如果出现类似 "Hi username! You've successfully authenticated" 的信息，说明 SSH 连接成功。

### 步骤二：修改 SSH 配置文件

如果问题仍然存在，可能是网络对 SSH 连接端口（22）的限制导致的。可以通过以下步骤绕过此限制：

1. 打开或创建 `C:/Users/(你的用户名)/.ssh/config` 文件。
2. 添加以下配置：
   ```
   Host github.com
       HostName ssh.github.com
       User git
       Port 443
   ```
3. 保存文件后，重新尝试推送代码。

### 补充说明：使用 VPN 重试

如果问题仍未解决，可能是网络环境的其他限制导致的。此时，可以尝试使用 VPN 切换网络环境后重试。

## 总结

通过**重新生成 SSH 密钥和调整 SSH 配置**，可以有效解决 `kex_exchange_identification` 错误。
在遇到类似问题时，建议首先检查 SSH 配置是否正确，并确认网络连接没有被防火墙等限制。如果问题仍然存在，可以尝试使用 VPN 或联系网络管理员获取进一步帮助。




## 相关资料
- [git pull 遇到 kex_exchange_identification: 连接被远程主机关闭](https://stackoverflow.com/questions/74469777/git-pull-encounters-kex-exchange-identification-connection-closed-by-remote-hos)


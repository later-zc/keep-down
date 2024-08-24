# 解决 Git 克隆远程仓库时 HTTPS 连接被重置的错误


## 前言

在使用 Git 克隆远程仓库时，可能会遇到如下错误：

```bash
git clone https://github.com/coderwhy/hy-react-web-music.git

# 报错：fatal: unable to access 'https://github.com/coderwhy/hy-react-web-music.git/': OpenSSL SSL_connect: Connection was reset in connection to github.com:443
```

这个错误提示表明 Git 在连接 GitHub 的 HTTPS 服务器时发生了 SSL 连接重置的问题。

## 原因

该错误通常发生在以下几种情况：

1. **网络连接问题**：网络不稳定或者存在代理/防火墙干扰。
2. **代理配置问题**：在使用代理时配置不正确或代理服务不稳定。
3. **SSL/TLS 证书问题**：SSL/TLS 证书验证失败（尽管这在这个具体的错误中不常见）。

## 解决方案

### 方式一：配置代理

如果您在使用 VPN 或代理，可能需要在 Git 中配置代理来确保稳定的网络连接。以下是配置代理的方法：

- **设置 HTTP 和 HTTPS 代理**：

  ```bash
  git config --global http.proxy 127.0.0.1:4780
  git config --global https.proxy 127.0.0.1:4780
  ```

  确保端口号（如上例中的 `4780`）与您 VPN 或代理的设置使用的端口一致。

- **取消代理配置**：

  如果代理设置不再需要或需要更改代理设置，可以取消现有配置：

  ```bash
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  ```

- **直接在配置文件中修改**：

  您也可以直接编辑 Git 配置文件以设置代理：

  ```ini
  # C:\Users\<你的用户名>\.gitconfig
  [user]
    name = xxx
    email = xxx
  [http]
    proxy = http://127.0.0.1:4780 # 端口号根据你实际情况来
  ```

### 方式二：检查网络连接

确保网络连接稳定，尝试重新连接网络或切换到其他网络环境（例如，从公司网络切换到家庭网络）。

### 方式三：使用 VPN

在某些情况下，使用 VPN 可能会解决由于地理位置或网络限制导致的连接问题。确保 VPN 正常工作，并配置正确的代理设置。

## 总结

当遇到 Git 克隆远程仓库时的 HTTPS 连接被重置错误时，通常是由于网络连接问题、代理配置不当或 VPN 使用导致的。通过配置正确的代理设置、检查网络连接以及使用 VPN 可以有效解决这一问题。


## 参考资料

- [OpenSSL SSL_connect 连接被重置问题](https://wxler.github.io/2021/02/28/151203/#1-openssl-ssl_connect-connection-was-reset-in-connection-to-githubcom443)
- [Stack Overflow 上的相关讨论](https://stackoverflow.com/questions/49345357/fatal-unable-to-access-https-github-com-xxx-openssl-ssl-connect-ssl-error)



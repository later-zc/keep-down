# 浏览器端口安全限制导致的 ERR_UNSAFE_PORT 错误分析与解决

## 一. 前言
::: info 背景
在测试 `koa` 部署静态资源时，服务监听端口为 `6000`。在 `Google` 浏览器中访问 `localhost:6000` 时，出现 `ERR_UNSAFE_PORT` 错误（其他浏览器也有类似情况），但使用 `Postman` 测试无问题。错误信息如下所示：
:::
<img src="./assets/image-20230215141622397.png" alt="image-20230215141622397" style="zoom: 80%;" />

**以下是相关代码示例**：

  ```js
  const Koa = require('koa')
  const static = require('koa-static')
  
  const app = new Koa()
  
  app.use(static('./uploads')) // 图片 01.png 在 uploads 文件夹下
  
  app.listen(6000, () => {
    console.log('koa server running~')
  })
  ```



## 二. 原因
ERR_UNSAFE_PORT 错误的原因是浏览器出于安全考虑，会阻止对某些端口的访问。浏览器维护了一个端口的黑名单，这些端口被认为可能存在安全风险，通常包括但不限于以下端口：

  ```js
  1,      // tcpmux
  7,      // echo
  9,      // discard
  11,     // systat
  13,     // daytime
  15,     // netstat
  17,     // qotd
  19,     // chargen
  20,     // ftp data
  21,     // ftp access
  22,     // ssh
  23,     // telnet
  25,     // smtp
  37,     // time
  42,     // name
  43,     // nicname
  53,     // domain
  69,     // tftp
  77,     // priv-rjs
  79,     // finger
  87,     // ttylink
  95,     // supdup
  101,    // hostriame
  102,    // iso-tsap
  103,    // gppitnp
  104,    // acr-nema
  109,    // pop2
  110,    // pop3
  111,    // sunrpc
  113,    // auth
  115,    // sftp
  117,    // uucp-path
  119,    // nntp
  123,    // NTP
  135,    // loc-srv /epmap
  137,    // netbios
  139,    // netbios
  143,    // imap2
  161,    // snmp
  179,    // BGP
  389,    // ldap
  427,    // SLP (Also used by Apple Filing Protocol)
  465,    // smtp+ssl
  512,    // print / exec
  513,    // login
  514,    // shell
  515,    // printer
  526,    // tempo
  530,    // courier
  531,    // chat
  532,    // netnews
  540,    // uucp
  548,    // AFP (Apple Filing Protocol)
  554,    // rtsp
  556,    // remotefs
  563,    // nntp+ssl
  587,    // smtp (rfc6409)
  601,    // syslog-conn (rfc3195)
  636,    // ldap+ssl
  993,    // ldap+ssl
  995,    // pop3+ssl
  1719,   // h323gatestat
  1720,   // h323hostcall
  1723,   // pptp
  2049,   // nfs
  3659,   // apple-sasl / PasswordServer
  4045,   // lockd
  5060,   // sip
  5061,   // sips
  6000,   // X11 // [!code highlight]
  6566,   // sane-port
  6665,   // Alternate IRC [Apple addition]
  6666,   // Alternate IRC [Apple addition]
  6667,   // Standard IRC [Apple addition]
  6668,   // Alternate IRC [Apple addition]
  6669,   // Alternate IRC [Apple addition]
  6697,   // IRC + TLS
  10080  // Amanda
  ```
  
  

## 三. 解决方案

- 方式一（推荐）
  - 修改服务监听的端口，避免使用被浏览器默认阻止的端口。
  例如，可以选择常见的非受限端口，如 `8080` 或 `3000`，重新配置服务器的监听端口，并确保应用的配置和客户端请求都指向新的端口。

- 方式二（不推荐）
  - 手动修改浏览器的安全设置以允许访问被阻止的端口。这通常涉及到更改浏览器的配置文件或使用开发者模式启动浏览器。
  此方法不建议作为长期解决方案，因为它可能影响浏览器的安全性并对其他网站产生意外影响。








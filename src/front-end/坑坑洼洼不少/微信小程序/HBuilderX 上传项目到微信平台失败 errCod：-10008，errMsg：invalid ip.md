# HBuilderX 上传项目到微信平台失败 errCod：-10008，errMsg：invalid ip



## 📌 背景说明
::: info
在使用 miniprogram-ci 工具实现**微信小程序上传**，微信官方要求开发者配置上传密钥。为增强安全性，开发者可选择**启用 IP 白名单**功能——只有白名单中的公网 IP 才可进行上传等操作。

但这也引发了常见的“**换网络后上传失败**”的问题。
:::


## ❗ 常见错误现象
**当前公网 IP 不在白名单中：**
> 当你通过如 HBuilderX、CI 脚本或本地命令行使用 miniprogram-ci 进行上传时，如果当前公网 IP 不在白名单中，将会提示如下错误：
```cmd
[HBuilder] 上传项目到微信平台失败
Error: {"errCode":-10008,"errMsg":"invalid ip: 61.142.xxx.xxx, reference: https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html"}
```
这种情况多发生在：
> - 更换了工作地点（如从深圳搬到中山）
> - 更换了运营商或接入不同 Wi-Fi 网络
> - 使用了公司外的笔记本或远程服务器构建上传


## 🔍 问题根源分析
1. **微信小程序上传密钥可在后台生成**：
    > 登录 [微信公众平台](https://mp.weixin.qq.com/wxamp/index/index?lang=zh_CN&token=1134092282) → 管理 → 开发管理 → 开发设置 → 小程序代码上传

2. **一旦开启 IP 白名单**：
    > - 微信服务器会校验发起请求的公网 IP 是否在白名单中；
    > - 不在列表内的请求会被直接拒绝，返回 errCode: -10008。

3. **白名单最多允许设置 20 个公网 IP，支持自动添加当前 IP**。


## ✅ 解决方案
**方法一：更新 IP 白名单**
> 1. 登录 [微信公众平台](https://mp.weixin.qq.com/wxamp/index/index?lang=zh_CN&token=1134092282)
> 2. 进入 开发管理 → 开发设置 → 小程序代码上传
> 3. 找到“上传密钥”区域
> 4. 添加当前公网 IP 到白名单中（支持批量添加）
  
> 🔎当前公网 IP 查询：https://ip.cn 或 https://ipinfo.io

**方法二：关闭 IP 白名单（不推荐）**
> 如果不希望每次换网络都手动添加 IP，可在“开发设置”中关闭「开启 IP 白名单」。

> ⚠️ 风险提示：
> - 一旦上传密钥泄露，将可能被任意人使用上传恶意代码。
> - 不建议团队项目或正式小程序使用此方法。


## 🛠️ 工程建议
| 场景 | 建议做法 |
| - | - |
| 多人协作开发 | 固定上传机器，设定统一出口 IP |
| 经常出差开发者 | 使用 VPN 固定出口或云服务器上传 |
| 自动化构建部署 | 在 CI 环境中配置固定出口地址，或使用代理服务器中转 |
| 密钥管理 | 不要将密钥写入 git 仓库，建议通过环境变量读取 |


## 📚 相关文档
- [微信小程序 - miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)
- [HBuilderX - CLI uni-app发行 - 微信小程序](https://hx.dcloud.net.cn/cli/publish-mp-weixin?id=uploadPrivateKey)


## 总结
- 上传失败通常是由于 IP 白名单限制引起的。
- 更换网络或城市后记得更新白名单。
- 建议通过固定出口 IP + 安全脚本 + 环境变量来管理上传逻辑。

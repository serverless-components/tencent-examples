![](https://i.v2ex.co/31A64dZd.png)

<h2 align="center">
  <b>使用 <a href="https://github.com/serverless/serverless">serverless</a> 快速部署各种应用到<a href="https://cloud.tencent.com/product/sls">腾讯云函数</a></b>
</h2>

<p align="center">
  <span>简体中文</span> |
  <a href="./README_EN.md">English</a>
</p>

## 快速开始

```bash
# 安装 Serverless 命令行工具
$ npm install -g serverless

# 🤞 选择模版并部署
$ serverless
```

<img src="https://i.v2ex.co/wdyWJYPY.gif" height="350" align="center">


## 所有模版

| 模版 | 描述 | 用到的组件
| --- | --- | --- |
| [website-starter](./website-starter) | 快速部署一个静态网站 | [tencent-website](https://github.com/serverless-components/tencent-website) |
| [react-starter](./react-starter) | 快速部署一个 React 应用  | [tencent-website](https://github.com/serverless-components/tencent-website) |
| [vue-starter](./vue-starter) | 快速部署一个 Vue 应用 | [tencent-website](https://github.com/serverless-components/tencent-website) |
| [express-starter](./express-starter) | 快速部署一个 express 应用 | [tencent-express](https://github.com/serverless-components/tencent-express) |
| [koa-starter](./koa-starter) | 快速部署一个 koa 应用 |  [tencent-koa](https://github.com/serverless-components/tencent-koa) |
| [eggjs-starter](./egg-starter) | 快速部署一个 egg.js 应用 | [tencent-egg](https://github.com/serverless-components/tencent-egg) |
| [nextjs-starter](./nextjs-starter) | 快速部署一个 next.js 应用 | [tencent-nextjs](https://github.com/serverless-components/tencent-nextjs) |
| [nuxtjs-starter](./nuxtjs-starter) | 快速部署一个 nuxt.js 应用 | [tencent-nuxtjs](https://github.com/serverless-components/tencent-nuxtjs) |
| [laravel-starter](./laravel-starter) | 快速部署一个 laravel 应用 | [tencent-laravel](https://github.com/serverless-components/tencent-laravel) |
| [flask-starter](./flask-starter) | 快速部署一个 flask 应用 | [tencent-flask](https://github.com/serverless-components/tencent-flask) |
| [springboot-starter](./springboot-starter) | 快速部署一个 springboot 应用 | [tencent-springboot](https://github.com/serverless-components/tencent-springboot) |
| [scf-starter](./scf-starter) | 快速部署一个 [SCF](https://cloud.tencent.com/product/scf) 云函数 | [tencent-scf](https://github.com/serverless-components/tencent-scf) |
| [scf-nodejs](./scf-nodejs) | 快速部署一个 Nodejs 函数 | [tencent-scf](https://github.com/serverless-components/tencent-scf) |
| [scf-go](./scf-go) | 快速部署一个 Go 函数 | [tencent-scf](https://github.com/serverless-components/tencent-scf) |
| [scf-php](./scf-php) | 快速部署一个 PHP 函数 | [tencent-scf](https://github.com/serverless-components/tencent-scf) |
| [scf-python](./scf-python) | 快速部署一个 Python 函数 | [tencent-scf](https://github.com/serverless-components/tencent-scf) |
| [fullstack](./fullstack) | 快速部署一个 fullstack 应用 | [tencent-website](https://github.com/serverless-components/tencent-website) <br> [tencent-express](https://github.com/serverless-components/tencent-express) <br> [tencent-postgresql](https://github.com/serverless-components/tencent-postgresql) <br>  [tencent-vpc](https://github.com/serverless-components/tencent-vpc) |
| [multi-scf-nodejs](./multi-scf-nodejs) | | 部署多事件类型 Nodejs 函数 | [tencent-multi-scf](https://github.com/serverless-components/tencent-multi-scf) |

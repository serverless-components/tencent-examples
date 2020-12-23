# 后端服务

本地开发调试，数据库连接可以先通过 docker 来模拟 MySQL 服务。待业务代码开发调试成功后，再部署到云端 Serverless.

## 本地开发

安装依赖：

```bash
$ npm install
```

启动 Docker Mysql 容器：

```bash
$ npm run docker:up
```

将 `.env.example` 复制为 `.env`，并将 `DB_PASSWORD` 的值修改为 `docker-comopse.yml` 中配置的 `MYSQL_ROOT_PASSWORD` 的值。

本地启动 Express 服务：

```bash
$ npm run dev
```

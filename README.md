# 校园像素生活广场 · uni-app 项目骨架

这是可运行的源码骨架，不是只有文档的旧压缩包。技术方案依据课程要求改为 **uni-app + Vue 3 + JavaScript**，同一套源码构建 H5 和微信小程序。

## 先跑起来

1. 安装 Node.js **22.22.0**；三人统一这个版本（`.nvmrc`），本包也按此版本验证。
2. 解压后用 VS Code 打开 `campus-plaza-starter` 这一层，确保能看到 package.json。
3. 在这个文件夹的终端执行：

```bash
npm ci
npm run dev:h5
```

打开终端显示的地址，默认 `http://localhost:5173`。首次运行无需云账号、数据库或 .env 文件；默认使用虚构的本机演示数据。

微信小程序开发：

```bash
npm run dev:mp-weixin
```

在微信开发者工具中导入 `dist/dev/mp-weixin`，用你们自己的 AppID。`src/manifest.json` 的 `mp-weixin.appid` 需要在实际接入时统一填写；个人工具私有配置不要提交。

## 已经准备好的内容

- 四栋房子的像素广场和走动动画；消息在底部，不是第五栋房子。
- 二手、搭子、失物、技能互助的列表、发布和详情页面；自己的家和他人公开主页。
- 共用内容卡片、空状态、错误提示、导航、个人状态和消息入口。
- 各模块接口调用位置、统一 RPC 请求层和框架无关的业务契约。
- 本机演示：发布、查询、收藏、举报、相近计划推荐、邀请与确认、关联内容的留言和通知。
- 锁定依赖、Git 规则、任务说明、两端构建命令、GitHub 检查和关键业务测试。

## 还没有完成什么

真实微信/H5 登录、数据库、跨用户在线通信、文件存储、服务端权限与事务、真实订阅通知、部署 URL 和审核发布均未接入。框架构建成功不代表已经部署上线。

图片在演示模式下使用本机临时地址，刷新或重启后可能失效；真实模式需接入公共上传。角色走动只是 CSS 场景动画，还没有玩家操作、碰撞或多人移动。

## 目录与三人分工

| 目录 | 用途 | 协调人 |
| --- | --- | --- |
| src/pages/plaza、partner、help | 广场、搭子、技能互助 | A |
| src/pages/market、home、profile | 二手、账号、个人资料 | B |
| src/pages/lost、messages | 失物、留言、消息 | C |
| src/pages/content | 共用发布/详情，修改需同步 | A/B/C 协调 |
| src/services | 模块接口调用，按模块归属 | 对应模块负责人 |
| src/services/transport.js、config | 请求与环境配置 | B 协调 |
| src/components、styles | 共用 UI 和风格 | A 协调 |
| src/mock | 演示实现，正式后端不放这里 | 各模块负责人 |
| docs、tests、.github | 说明、验证与协作 | 全组 |

开始开发请看 [docs/start-here.md](docs/start-here.md)。后端接入看 [docs/backend.md](docs/backend.md)。最终提交看 [docs/deployment.md](docs/deployment.md)。

需求、数据模型、接口、实现边界、验收与协作说明均在 docs/；tasks.csv 是按三人和两周划分的待办表，实际姓名需团队填写。

## 上传 GitHub

将解压后的源码内容放到仓库根目录，不要只上传 zip。首次由一人初始化，另两人 clone 同一个仓库；不要三个人各建一份不同骨架。

```bash
git init
git add .
git commit -m "chore: 初始化校园生活广场 uni-app 骨架"
git branch -M main
git remote add origin <替换为团队仓库地址>
git push -u origin main
```

已有仓库请先 clone，在工作分支放入源码后提 PR，不要对已有目录重新 git init。详见 [docs/collaboration.md](docs/collaboration.md)。

## 检查与构建

```bash
npm run check
npm test
npm run build:h5
npm run build:mp-weixin
```

H5 产物为 `dist/build/h5`；微信产物为 `dist/build/mp-weixin`。产物、node_modules、私有环境文件不提交；package-lock.json 必须提交，队友用 npm ci。

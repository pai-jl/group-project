# 三人协作与 Git 规则

| 代号（请填写姓名） | 主要业务 | 共用服务责任 |
| --- | --- | --- |
| A：待填写 | 广场、搭子、技能互助、规则推荐、邀请 | 组件、样式、导航规则 |
| B：待填写 | 二手、个人空间、公开主页 | 账号、资料、图片上传、收藏、请求层 |
| C：待填写 | 失物、联系留言、消息、通知 | 会话关联、消息权限、举报、订阅通知 |

共用发布和详情在 src/pages/content，不要两个人同时大改。计划先记录 Issue，再分小 PR；复杂改动先约好谁整合。src/mock/engine.js 集中演示实现，三人不要同日分别重写它；真实后端以后按模块拆分。

## 每个任务的流程

```bash
git switch main
git pull --ff-only
git switch -c feat/market-publish
# 修改、验证
git add <改动的文件>
git commit -m "feat(market): 接入商品发布"
git push -u origin feat/market-publish
```

在 GitHub 提 PR，由另一位队友检查接口影响和验收结果后合并。不要直接往 main 推日常功能；仓库管理员需在 GitHub Settings 中实际启用 main 的保护规则，文件本身不会自动开启保护。

PR 合并后切 main 并 pull，再开下一个任务分支。每天至少整合一次，确保 main 能运行。出现冲突先看双方改动并沟通，不要直接选“全部保留我的”。解决后重新执行检查与两端构建。

- 分支：feat/模块-功能、fix/模块-问题；短小任务，避免连续几天不合并。
- 提交前检查 git diff；不要提交 node_modules、dist、令牌、AppSecret 和 .env。
- package.json、package-lock.json、pages.json、manifest.json、请求层改动需提前通知调用方。新增页面由改动者登记路由并检查 tabBar。
- 依赖版本锁定；队友默认 npm ci，新增依赖由一人统一处理，不各自升级。
- 提交信息用 feat/fix/docs/chore；不要只写“修改”或“更新”。

## PR 合并不等于联调完成

必须检查“二手联系→消息→原商品”“失物联系→消息→原失物”“搭子推荐→邀请→对方接受→状态更新”。真实版本使用两台设备、两个账号检查；本机演示只是理解流程。

如果要用 AI 助手，仓库的 AGENTS.md 给出共同约定；AI 修改同样需要读 diff 和检查。

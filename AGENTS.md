# 团队与工具修改约定

- 项目是 uni-app + Vue 3 + JavaScript，同时交付 H5 与微信小程序构建。
- 页面只调用 `src/services/`，不要在页面直接调用 `uni.request` 或操作业务存储。
- 演示存储只允许出现在 `src/mock/`；真实接口失败不能回退为演示成功。
- 修改公共字段、接口、路由、依赖前，先同步 docs/interfaces.md / docs/collaboration.md。
- 广场只有二手、搭子、失物、自己的家四栋房子，消息属于底部栏目。
- 其他人的主页使用 user.listPublicContent，只展示公开发布。
- VITE_ 环境变量会进入前端；不允许提交密钥、私有配置或 node_modules。
- 演示登录、订阅、上传不能假装为真实功能；未实现明确提示。
- 共用文件维护人见 docs/collaboration.md。维护人是负责协调，不是禁止其他人协作。
- 完成改动后运行 check、test 和两端 build；涉及功能还需按 docs/acceptance.md 人工验收。

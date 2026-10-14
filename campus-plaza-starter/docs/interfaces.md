# 接口契约 v0.2

## 调用层约定

页面调用 src/services 中的模块函数，例如 `market.list({ keyword, cursor, pageSize })`。call 内部在 mock/http 模式之间切换。

真实 HTTP 适配建议统一 RPC：`POST <VITE_API_BASE_URL>/rpc`，body 为 `{ method, params }`，登录后带 `Authorization: Bearer <token>`。这是本骨架约定，**还没有实现服务器**。如果后端采用 CloudBase 云函数，在 transport.js 增加云函数适配；页面调用名称和输入结果不变，不要把 CloudBase 环境 ID 当成 HTTP URL。

返回 envelope：`{ code: 'OK', message: '', data, requestId }`。call 成功只返回 data，失败抛 ServiceError，不回退演示数据。错误有 INVALID_ARGUMENT、UNAUTHENTICATED、FORBIDDEN、NOT_FOUND、CONFLICT、SERVICE_UNAVAILABLE；骨架补充 NOT_IMPLEMENTED / NOT_SUPPORTED，明确尚未实现或平台不支持。

列表统一 `{ items: [], nextCursor: null }`，pageSize 默认 20，最多 50；cursor 必须由服务端返回。演示用 offset 字符串，真实数据库可使用不透明 cursor。所有内容 ID 是字符串，详情与修改统一用 `{id}`；plan.getCandidates 使用 `{planId}`。

## 数据基础

contentType 为 plan / help / market / lost_found / event。当前 content/detail 只支持前四项；event 在第二周实现对应入口再开放通知。

内容共有 id/type/ownerId/title/body/category/location/campusId/campusName/images/visibility/status/createdAt；列表和详情附公开 owner 摘要。图片演示为本机临时地址，真实服务需返回可访问图片地址或经授权解析的 fileID，禁止把私人临时地址当永久图片。

Plan 增加 startAt/endAt/capacity/memberIds；Market 增加 priceCents。时间使用 ISO 8601；前端输入和活动日期按北京时间 +08 判断，存储可用 UTC。价格为整数分。

## 常用模块

| 模块 | 输入要点 | data |
| --- | --- | --- |
| auth.login | 真实凭证（B 定义微信与 H5 两种方式） | `{ token, user }`；token 不记录到日志 |
| user.getProfile | `{userId?}`；省略取本人 | 公开 User：id/nickname/campusId/campusName/skillTags/bio |
| user.listPublicContent | `{userId,cursor?,pageSize?}` | 该用户公开发布分页；不包含私有内容 |
| myContent.list | `{contentType?,status?,cursor?,pageSize?}` | 当前用户发布分页；身份取后端会话 |
| plan/help/market/lostFound.list | `{keyword?,category?,ownerId?,status?,cursor?,pageSize?}` | Content 分页 |
| 模块.get | `{id}` | 单条内容与公开作者摘要 |
| 模块.create/update | 内容字段；update 含 id | 保存后的 Content；作者与校区由后端确定 |
| plan.getCandidates | `{planId,cursor?,pageSize?}` | `{items:[{candidatePlanId,ownerId,owner,plan,overlap,reasons}],nextCursor}` |
| invitation.create | `{sourcePlanId,targetPlanId,idempotencyKey}` | Invitation；当前用户拥有 targetPlanId |
| invitation.list | `{cursor?,pageSize?}` | 当前用户发出/收到的邀请分页，附 sender/recipient 公开资料 |
| invitation.respond | `{invitationId,action,idempotencyKey}` | `{invitation,targetPlan}`；action=accept/reject/cancel |
| invitation.cancel | `{invitationId,idempotencyKey}` | 与 respond(cancel) 一致 |
| conversation.open | `{contentType,contentId,peerUserId}` | 会话，含原内容链接和 participantIds |
| conversation.list | `{cursor?,pageSize?}` | 当前用户会话分页 |
| message.list | `{conversationId,cursor?,pageSize?}` | Message 分页，含 sender 摘要，按新到旧排列 |
| message.send | `{conversationId,body,idempotencyKey}` | 保存的 Message |
| notification.list/markRead | 分页 / `{notificationId}` | 通知分页 / 保存的通知 |
| favorite.set/list | `{contentType,contentId,selected}` / 分页 | `{selected}` / 收藏分页 |
| report.create | `{contentType,contentId,reason}` | 举报编号与状态 |

所有预留的方法名称及维护人见 src/contracts/catalog.json；未实现项见 docs/status.md。market.reserve、reservation、upload、event、appraisal 和服务器订阅发送只留调用位置，不伪造成功。

## 推荐与邀请规则

匹配目标计划必须由当前用户拥有、仍有空位且未结束。候选同校区、同类别、北京时间同日、有效时间严格重叠、仍为单人 open 计划，排除本人。返回 overlap 和理由，不返回虚假的成功率。

邀请 targetPlanId 是邀请人自己的计划，sourcePlanId 是被邀请人的单人计划。接收人接受后加入 target，source 关闭并记录 joinedPlanId。真实后端需用事务同时检查权限、容量、来源状态、成员唯一性和幂等。第一版不处理整队合并。

通知与业务结果分开：订阅发送失败不撤销组队。requestSubscription 只在微信端用户点击时申请授权；subscription.send 必须服务端受控，不能任意从前端调用发送模板消息。

## 服务端必须校验

身份来自登录态；不接受前端伪造 ownerId/currentUserId。查看公开与本人内容分开；修改检查作者；会话/消息检查参与者；通知标读检查归属；管理员处理举报需要管理员权限；上传校验类型、大小、归属。演示检查只能辅助理解，不能当作生产安全措施。

# 数据模型与状态

这是后端实现建议，尚未创建任何真实数据库集合。演示的单个本机对象不能直接用作生产数据库架构。

| 实体 | 核心字段 | 关系 / 权限 |
| --- | --- | --- |
| User | id、nickname、campusId、skillTags、bio | 各模块作者共用；公开资料不包含凭证、手机号等私有字段 |
| Plan | id、ownerId、category、startAt、endAt、capacity、status | 关联作者、成员、邀请；检查校区、日期、时间和容量 |
| Membership | planId、userId、status | 正式数据库建议独立记录，planId+userId 唯一 |
| Invitation | id、senderId、recipientId、sourcePlanId、targetPlanId、status | 来源为被邀请人的单人计划，目标为邀请人的计划 |
| MarketPost | id、ownerId、priceCents、status | 图片走公共上传；预约记录后续 Reservation |
| LostFoundPost | id、ownerId、category、location、status | 类别为丢失 / 拾获；作者确认归还 |
| HelpPost | id、ownerId、category、body、status | category 首版为所需技能；后续匹配 User.skillTags |
| Conversation | id、participantIds、contentType、contentId | 同一内容与参与者组合去重；仅参与者访问 |
| Message | id、conversationId、senderId、body、createdAt | 发送者取登录态；会话权限由后端校验 |
| Notification | id、recipientId、contentType、contentId、read | 业务事件去重；本人读写；模板发送与业务事务分开 |
| Favorite / Report | userId、contentType、contentId 等 | 收藏唯一；举报处理管理员专用 |
| Upload | imageId、ownerId、usage、mime、size、status | 校验类型/大小/归属；确认后才能关联业务内容 |

内容通用字段及分页形状见 interfaces.md。MemberIds 数组仅是当前演示实现，不替代正式成员权限表。

状态约定：Plan open/full/closed/completed/expired；Invitation pending/accepted/rejected/cancelled/expired；Market active/reserved/completed/closed；Lost active/returned/closed；Help open/completed/closed。

真实后端的索引建议：校区+类别+状态、作者+时间、会话参与者、conversationId+消息时间、recipientId+通知时间。把容量校验、来源计划关闭和成员写入放在一次事务中；不要让客户端控制状态流转。

# CONTEXT

前端项目：NCDC 前端应聘课题（recruit-frontend）。对接的后端仓库 `ncdcdev/recruit-frontend`（NestJS + TypeORM/SQLite）。

## 术语（Glossary）

- **Page（页面）**：本项目的核心业务对象，在 UI 与前端代码中的规范命名（组件、hooks、路由均以 `Page` 命名，如 `PageList`、`PageEditor`）。对应后端实体 `Content`（字段：`id`, `title`, `body`, `createdAt`, `updatedAt`）。**`Content` 这个名字只允许出现在 API 数据层**（如 `src/api/`），不应泄漏到 UI 层组件或业务逻辑命名中。
- **Untitled Page（无題）**：`title` 为空字符串的 Page，在侧边栏显示占位文案「無題」，样式区别于正常标题（如灰色/斜体）。仍可正常编辑保存。
- **Sidebar（侧边栏）**：展示全部 Page 列表，数据来源即 `GET /content`（没有独立的"侧边栏专用"接口）。排序规则：按 `createdAt` **倒序**（最新创建的在最上面），由前端排序，不依赖后端返回顺序。
- **List Edit Mode（列表编辑模式）**：侧边栏底部「Edit」按钮触发的模式，进入后每个 Page 行出现删除（垃圾桶）图标，底部按钮变为「New page」/「Done」。这是设计稿定义的交互，不是需求文档里字面的「－」按钮，两者指向同一功能（删除页面）。
- **Title Edit / Body Edit（标题编辑 / 正文编辑）**：Page 详情区标题和正文分别拥有独立的编辑态（各自的 Edit → Cancel/Save），对应各自独立的 `PUT /content/:id` 调用（DTO 的 `title`/`body` 均为可选字段，可单独更新其一）。

**标题/正文的长度约束**（1–50 / 10–2000 字符）属于后端已定义的业务规则，非前端自创概念，故不在此重复列为"决策"；具体数值以后端 DTO/entity 为准。

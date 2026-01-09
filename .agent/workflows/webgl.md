---
description: 制作天线3D渲染图
---

# 0. Critical Rules (最高优先级规则)
**ABSOLUTE REQUIREMENT**:
1.  **Language**: You MUST interact, plan, and respond in **Simplified Chinese (简体中文)** ONLY.
    -   Your internal "Chain of Thought" and "Step-by-Step Plan" MUST be in Chinese.
    -   *Exception*: Keep variable names, file names, and code keywords in English.
2.  **Code Architecture**: Do NOT hardcode SEO text. You MUST use the `loader` -> `meta` pattern defined in Phase 3.

# 1. Role & Context
-   **Role**: 精通 React Three Fiber (R3F)、Remix/React Router (v7)、i18n 和 UI/UX 的前端专家。
-   **Input**: Markdown 文档（物理原理与参数）。
-   **References (Strict Pathing)**:
    -   **架构与 SEO**: `app/routes/demos/yagi-antenna.tsx`
    -   **场景与 UI**: `app/components/yagi-antenna-scene.tsx` (重点参考 `ControlsContent`)
    -   **电场逻辑**: `app/components/electric-field-instanced.tsx`
    -   **I18n Files**: `app/locales/common.ts`, `app/locales/demo.ts`, `app/locales/scene.ts`

# 2. Task Checklist

## Phase 1: 核心组件开发 (Core Component)
-   基于 Markdown 创建 3D 组件。
-   **电场与可视化 (核心)**：
    -   必须实现 **方向图 (Radiation Pattern)**。
    -   必须实现 **电波动画 (Radio Waves)**。
    -   **强制隔离**：必须为当前天线创建**独立**的电场代码/实例，严禁复用其他天线配置。
    -   **视觉映射**：若文档提及电场强弱，必须映射为视觉变化（如颜色深浅或透明度）。

## Phase 2: 场景与交互面板 (Scene & Controls)
创建场景文件，并重点实现 **`ControlsContent`** 组件。

### 2.1 必须包含的通用操作 (Mandatory)
`ControlsContent` 中**必须**包含：
1.  **Switch**: 电波动画开关 (Wave Animation)。
2.  **Switch**: 方向图显示开关 (Pattern Visibility)。
3.  **Slider**: 电波传播速度 (Propagation Speed)。

### 2.2 动态评估操作 (Dynamic Evaluation)
**分析 Markdown 理论部分**，若存在特殊物理变量（如“倒V夹角”、“单元间距”），必须将其转化为 `ControlsContent` 中的 Slider 或 Switch。
-   *若无特殊变量*：仅保留 2.1 内容。

### 2.3 UI 完整性
-   包含 **图例 (Legend)** 组件。
-   确保 `ControlsContent` 布局与参考文件一致。

## Phase 3: 国际化与 SEO (I18n & Meta) - **架构级强制要求**
**严禁在 `meta` 中硬编码文本。必须遵循以下 Loader 模式：**

1.  **定义 Loader (Server-Side I18n)**：
    -   在页面文件中导出 `loader`。
    -   使用 `getInstance(context)` 获取 `t`。
    -   **Code Pattern**:
        ```typescript
        export const loader = ({ context }: Route.LoaderArgs) => {
          const { t } = getInstance(context);
          return {
            title: t("demos:[fileName].metaTitle"),
            description: t("demos:[fileName].metaDescription"),
            keywords: t("demos:[fileName].metaKeywords"),
          };
        };
        ```

2.  **定义 Meta (Consume Loader Data)**：
    -   从 `loaderData` 解构数据。
    -   **Code Pattern**:
        ```typescript
        export const meta = ({ loaderData }: Route.MetaArgs) => {
          const { title, description, keywords } = loaderData;
          return [
            { title },
            { name: "description", content: description },
            { property: "og:title", content: title },
            { property: "og:description", content: description },
            { name: "keywords", content: keywords },
          ];
        };
        ```

3.  **写入字典 (Write to Dict)**：
    -   **SEO**: 在 `app/locales/demo.ts` 中新增 `metaTitle`, `metaDescription`, `metaKeywords`。
    -   **UI**: `ControlsContent` 和图例中的文案写入 `app/locales/common.ts` 或 `app/locales/demo.ts`。

## Phase 4: 路由注册 (Registration)
-   在 `app/home.tsx` (或其他入口文件) 中添加入口。
-   在 `app/routes.ts` (或其他路由配置) 中注册路由。

# 3. Acceptance Criteria (验收标准)
1.  [ ] **语言检查**：思考过程和回复是否全为**中文**？
2.  [ ] **视觉核心**：**方向图**和**电波动画**是否已正确渲染且可见？
3.  [ ] **物理表现**：若文档提及强弱，是否通过颜色/透明度体现了**电场强度**？
4.  [ ] **SEO 架构**：是否使用了 `export const loader` 并正确传递数据给 `meta`？
5.  [ ] **UI 检查**：`ControlsContent` 是否包含 3 个基础开关 + 动态分析出的控件？
6.  [ ] **I18n 覆盖**：`app/locales` 下的三个文件是否都新增了对应的 key？
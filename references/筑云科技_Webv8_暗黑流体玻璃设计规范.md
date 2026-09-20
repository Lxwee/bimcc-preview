# 筑云科技 Web v8 暗黑流体玻璃设计规范与开发提示词

**[适用场景]**
当构建筑云科技（BimCC）的后续子页面（如客户案例、产品详情、联系我们等）时，请将本规范作为最高优先级的 Prompt 发送给 AI 助手，以确保与首页（`index_v8.html`）保持 100% 的视觉统一性。

---

## 1. 核心设计语言与基调 (Global Paradigm)
你现在需要为“筑云科技”设计/生成全新的子界面。我们的核心调性是**“重工业架构与未来前沿科技的融合”**。
- **坚决弃用**传统的白色底板或呆板的企业灰后台风格；
- **坚决弃用** Material Design 风格的粗钝投影或波纹交互；
- **核心基调**：深邃流动的星空极光底色（Deep Blue Aurora），配合极致清脆、边界锐利的白框高斯模糊悬浮卡片（Crisp Glassmorphism）。
- **空间与密度**：采用大尺度的张放空间（Macro-scale spacing）配合内部高密度的信息组装（High textual density）。最大内容宽度限定为 `max-w-[1400px]`。

## 2. 全局环境与大底座 (Global Base & Aurora)
- **基底色**： `bg-[#0b1121]` (深邃极夜蓝)。
- **通用 Body 属性**： 
  ```html
  <body class="bg-[#0b1121] text-slate-300 font-sans antialiased selection:bg-brand-500/30 selection:text-white flex flex-col min-h-screen min-w-[320px] overflow-x-hidden">
  ```
- **核心环境光效**：页面往往需要在绝对定位的底层（`z-0`）使用大尺寸、高斯模糊的形体来烘托极光氛围，例如：
  `bg-[#023a78] blur-[120px] mix-blend-screen opacity-60`。所有环境光点一律采用 `mix-blend-screen` 以保证多层光效交叠时的透亮感。

## 3. 文字与排版系统 (Crisp Typography)
**文字是 SaaS 质感的灵魂。**
- **字重红线**：**全站绝对禁止使用 `font-light` (300字重)**。中文的纤细字体在深色模式下会导致严重的阅读障碍。正常文本默认基于 400 (`font-normal`) 或 500 (`font-medium`)。
- **基准字号**：主正文字号上调为 `16px` (`text-[16px]`) 或 `15px` (`text-[15px]`)，辅助说明文字为 `14px`。
- **颜色分层**：
  - **大标题 (H1/H2)**：纯白 `text-white font-bold drop-shadow-md` 等。可适当使用 `tracking-wide` 拉宽间距。
  - **常规正文 (Body)**：`text-slate-300`，行高通常设定为宽松的 `leading-relaxed` 或 `leading-[1.8]`。
  - **暗色或次要文案**：`text-slate-400`。
- **特效文字**：对于关键数字或强调词，可使用 CSS 裁切渐变特效：
  `class="text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-300"`

## 4. 极致玻璃态卡片 (The `glass-card` Spec)
所有的产品模块、数据展示、新闻卡片均应统一下放到封装好的 `.glass-card` 逻辑中，其 Tailwind 组合公式如下：
- **面板材质**：`bg-white/5` 或 `bg-gradient-to-br from-white/[0.08] to-transparent`
- **磨砂效能**：`backdrop-blur-xl` (`blur(24px)`) 或以上的模糊度。
- **发光描边**：`border border-white/10`（在深色基底上勾勒边界的极细白线）。
- **悬停浮动法则 (Hover Physics)**：统一配置弹性的上浮及外发光投影。
  ```html
  <div class="glass-card rounded-[24px] group border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">...</div>
  ```

## 5. 组件与修饰细节 (Micro-details & Components)
- **分割线规则**：所有的区块上下分割线必须采用白色的透明通道，而不是黑色或灰色。标准大段落分割线为 `border-t border-white/5`，如背景较亮可改用 `border-white/10`。
- **图标容器 (Icon Boxes)**：数据背书或卡片中的图标，请使用“渐变底色 + 极细反光描边 + 大圆角”的公式包裹：
  ```html
  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-400 to-indigo-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
    <svg class="w-7 h-7">...</svg>
  </div>
  ```
- **标牌与徽章 (Badges)**：高亮属性标牌可使用彩色微透底色配合细描边，例如资讯分类标签：
  `bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-sm text-[12px] font-medium tracking-wide`

## 6. 排版与区块范式 (Layout & Sectioning)
- **Section Spacing**：页面大区块上下间距通常非常充裕，建议 `py-20` 或 `py-24`。
- **矩阵分布 (Jiguang-style Matrix)**：如果涉及多能力介绍，不要使用传统的均分四宫格，建议使用“不对称拼图网格”系统！例如左侧采用一张高耸横跨纵向两格的大图容器，右侧搭配上下两个窄横幅容器，或者 `grid-cols-3` 的混合插接，形成疏密有致的视觉冲击。

## 7. 秩序传承：Radix 工业级严谨排版底蕴 (Radix Inheritance)
虽然我们全面舍弃了 Radix UI 默认的“全白/亮色表单风格”，但**必须严格继承 Radix 的核心“设计哲学体系”**：
- **微距结构约束**：坚决避免组件内部因随意的 `padding` 或 `margin` 导致的松垮松散。页面的宏观留白可以极大（`py-24`），但微观组件需保持“高密度”（Dense）且“不拥挤”的视觉精装质感（如内部紧密采用 `gap-3` 或 `space-y-4`）。
- **去浮夸阴影论**：不要单靠堆叠厚重的纯黑阴影来区分区块。我们的层级分离依赖：**透明单像素边框 (`border-white/10`)** 与 **毛玻璃模糊梯级** 的精妙组合。
- **冷峻的极客工业感**：按钮与容器边缘清透锐利，拒绝臃肿。保持每一根 1px 的细边框干净、准确地切断视觉，确保信息呈现“Crisp（清脆、利落）”，传递出无可挑剔的顶级企业系统品控感。

---
[Output Requirement] 
接收到本提示词约束后，你输出的所有 HTML 页面必须严格遵守上述颜色组、阴影、透明边距和交互组合。请确保代码是模块化、极简化且基于 TailwindCSS 直接搭建的单文件可用版。

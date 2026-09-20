import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readRequired(relativePath) {
  const filePath = resolve(root, relativePath);
  assert(existsSync(filePath), `Missing required file: ${relativePath}`);
  return readFileSync(filePath, "utf8");
}

const requiredFiles = [
  "index.html",
  "products.html",
  "product-detail.html",
  "solutions.html",
  "solution-detail.html",
  "cases.html",
  "case-detail.html",
  "technology.html",
  "resources.html",
  "about.html",
  "contact.html",
  "styles.css",
  "script.js",
  "README.md",
  "STYLE_DIRECTION.md",
  "CMS_HANDOFF.md",
  "assets/brand/favicon.svg",
  "assets/v8/banner-bimcc.png",
  "assets/v8/banner-fyra.png",
  "assets/v8/aurora-background.png",
  "assets/clients/logo-1.png",
  "assets/clients/logo-10.png",
  "data/site.json",
  "data/home.json",
  "data/products.json",
  "data/solutions.json",
  "data/cases.json",
  "data/page-products.json",
  "data/page-solutions.json",
  "data/page-cases.json",
  "data/page-technology.json",
  "data/page-resources.json",
  "data/page-about.json",
  "data/page-contact.json",
  "data/cms-modules.json",
  "data/seo-map.json",
];

for (const file of requiredFiles) {
  readRequired(file);
}

const html = readRequired("index.html");
const productsPage = readRequired("products.html");
const productDetailPage = readRequired("product-detail.html");
const solutionsPage = readRequired("solutions.html");
const solutionDetailPage = readRequired("solution-detail.html");
const casesPage = readRequired("cases.html");
const caseDetailPage = readRequired("case-detail.html");
const technologyPage = readRequired("technology.html");
const resourcesPage = readRequired("resources.html");
const aboutPage = readRequired("about.html");
const contactPage = readRequired("contact.html");
const css = readRequired("styles.css");
const js = readRequired("script.js");
const site = JSON.parse(readRequired("data/site.json"));
const seoMap = JSON.parse(readRequired("data/seo-map.json"));
const home = JSON.parse(readRequired("data/home.json"));
const solutions = JSON.parse(readRequired("data/solutions.json"));
const cases = JSON.parse(readRequired("data/cases.json"));
const pageProducts = JSON.parse(readRequired("data/page-products.json"));
const pageSolutions = JSON.parse(readRequired("data/page-solutions.json"));
const pageCases = JSON.parse(readRequired("data/page-cases.json"));
const pageTechnology = JSON.parse(readRequired("data/page-technology.json"));
const pageResources = JSON.parse(readRequired("data/page-resources.json"));
const pageAbout = JSON.parse(readRequired("data/page-about.json"));
const pageContact = JSON.parse(readRequired("data/page-contact.json"));
const cmsModules = JSON.parse(readRequired("data/cms-modules.json"));
const handoff = readRequired("CMS_HANDOFF.md");
const readme = readRequired("README.md");
const styleDirection = readRequired("STYLE_DIRECTION.md");
const pageHtmls = [
  html,
  productsPage,
  productDetailPage,
  solutionsPage,
  solutionDetailPage,
  casesPage,
  caseDetailPage,
  technologyPage,
  resourcesPage,
  aboutPage,
  contactPage,
];
const allPages = pageHtmls.join("\n");

const sectionCount = (html.match(/data-home-section=/g) || []).length;
assert(sectionCount === 8, `Expected 8 homepage sections, found ${sectionCount}`);

const cmsModuleCount = (html.match(/data-cms-module=/g) || []).length;
assert(cmsModuleCount === 8, `Expected 8 CMS module markers, found ${cmsModuleCount}`);

const requiredCmsModules = [
  "home-hero-trust",
  "home-pain-solution",
  "home-capability-map",
  "home-product-platforms",
  "home-solution-entry",
  "home-delivery-advantages",
  "home-featured-cases",
  "home-trust-cta",
];

for (const moduleName of requiredCmsModules) {
  assert(html.includes(`data-cms-module="${moduleName}"`), `Missing CMS module marker: ${moduleName}`);
}

assert(Array.isArray(cmsModules) && cmsModules.length === 8, "CMS module data should define 8 homepage modules");

for (const moduleName of requiredCmsModules) {
  const moduleConfig = cmsModules.find((item) => item.id === moduleName);
  assert(moduleConfig, `Missing CMS module data: ${moduleName}`);
  assert(moduleConfig.anchor, `CMS module missing anchor: ${moduleName}`);
  assert(Array.isArray(moduleConfig.fields) && moduleConfig.fields.length > 0, `CMS module missing fields: ${moduleName}`);
  assert(Array.isArray(moduleConfig.sourceData) && moduleConfig.sourceData.length > 0, `CMS module missing source data: ${moduleName}`);
  assert(moduleConfig.productionNote, `CMS module missing production note: ${moduleName}`);
}

const requiredNav = [
  "首页",
  "产品平台",
  "解决方案",
  "客户案例",
  "技术研发",
  "关于我们",
];

for (const item of requiredNav) {
  assert(allPages.includes(`>${item}<`), `Missing nav item: ${item}`);
}

for (const page of pageHtmls) {
  assert(page.includes('href="index.html#home"'), "Every page should expose a 首页 link to the homepage");
  assert(page.includes('href="products.html"'), "Every page should expose the product platform page");
  assert(page.includes('href="solutions.html"'), "Every page should expose the solutions page");
  assert(page.includes('href="cases.html"'), "Every page should expose the cases page");
  assert(page.includes('href="technology.html"'), "Every page should expose the technology page");
  assert(page.includes('href="about.html"'), "Every page should expose the about page");
  assert(page.includes('href="contact.html"'), "Every page should expose the contact page and CTA route");
}

const pageExpectations = [
  [productsPage, "page-products-overview", "products page"],
  [productDetailPage, "page-product-detail-hero", "product detail page"],
  [solutionsPage, "page-solutions-overview", "solutions page"],
  [solutionDetailPage, "page-solution-detail-hero", "solution detail page"],
  [casesPage, "page-cases-overview", "cases page"],
  [caseDetailPage, "page-case-detail-hero", "case detail page"],
  [technologyPage, "page-technology-overview", "technology page"],
  [resourcesPage, "page-resources-overview", "resources page"],
  [aboutPage, "page-about-overview", "about page"],
  [contactPage, "page-contact-conversion", "contact page"],
];

for (const [page, marker, name] of pageExpectations) {
  assert(page.includes(`data-page-module="${marker}"`), `Missing page module marker on ${name}`);
  assert(page.includes("data-content-source"), `Missing content source traceability on ${name}`);
  assert(page.includes("筑云科技"), `Missing brand signal on ${name}`);
  assert(page.includes('data-motion-root="deep-space-product"'), `Missing deep-space motion root marker on ${name}`);
  assert(page.includes('data-reference-style="raycast-reflect-authkit-teddy"'), `Missing reference style marker on ${name}`);
  assert(page.includes("page-signal-map"), `Missing secondary-page signal map on ${name}`);
}

const mixedNavPages = [
  [productsPage, "products page"],
  [solutionsPage, "solutions page"],
  [casesPage, "cases page"],
  [technologyPage, "technology page"],
  [resourcesPage, "resources page"],
  [aboutPage, "about page"],
];

for (const [page, name] of mixedNavPages) {
  assert(!page.includes("page-subnav"), `${name} should not mix same-page anchors with cross-page navigation in a subnav`);
}

assert(productDetailPage.includes("产品平台总览"), "Product detail should expose a clear return path to the product overview");
assert(solutionDetailPage.includes("方案总览"), "Solution detail should expose a clear return path to the solution overview");
assert(caseDetailPage.includes("返回客户案例"), "Case detail should expose a clear return path");
assert(productDetailPage.includes("切换产品"), "Product detail should separate peer product switching from same-page jumps");
assert(solutionDetailPage.includes("切换方案"), "Solution detail should separate peer solution switching from same-page jumps");
assert(productDetailPage.includes("hero-detail-switcher"), "Product switcher should sit in the first hero viewport");
assert(solutionDetailPage.includes("hero-detail-switcher"), "Solution switcher should sit in the first hero viewport");
assert(productDetailPage.includes("data-product-link"), "Product detail should mark peer product links for current-state feedback");
assert(solutionDetailPage.includes("data-solution-link"), "Solution detail should mark peer solution links for current-state feedback");
assert(productDetailPage.includes('data-product-link="smart-command"'), "Product detail should include all product detail destinations in the peer switcher");
assert(productDetailPage.includes('data-product-link="engineering-tech"'), "Product detail should include engineering tech in the peer switcher");
assert(productDetailPage.includes('data-product-link="digital-education"'), "Product detail should include digital education in the peer switcher");
assert(solutionDetailPage.includes('data-solution-link="build-regulation"'), "Solution detail should include the government regulation destination in the peer switcher");
assert(productsPage.includes("查看飞椽 Fyra"), "Product overview should use visitor-facing detail navigation copy");
assert(solutionsPage.includes("查看企业级方案"), "Solutions overview should use visitor-facing solution navigation copy");
assert(productsPage.includes("clickable-card"), "Product overview detail cards should expose full-card click affordance");
assert(solutionsPage.includes("clickable-card"), "Solutions overview detail cards should expose full-card click affordance");
assert(casesPage.includes("查看案例详情"), "Cases overview should use visitor-facing case navigation copy");
assert(casesPage.includes('data-default-case-filter="platform"'), "Cases page should default to a visible selected category");
assert(!allPages.includes("data-case-filter-status"), "Public pages should not show filter result-count system messages");
assert(!casesPage.includes('data-case-filter="all"'), "Cases page should not expose a redundant all filter");
assert(!html.includes('data-case-filter="all"'), "Homepage case filters should not expose a redundant all filter");
assert(!allPages.includes("本页跳转"), "Public pages should not expose internal same-page navigation labels");
assert(!allPages.includes("detail-jumps"), "Detail pages should not show same-page anchor navigation as a tab-like control");
assert(!css.includes(".button-anchor"), "Hero anchor buttons should not use fake dropdown-arrow styling");
assert(!html.includes('data-case-filter="enterprise"'), "Homepage case filters should not use ambiguous enterprise-only categories");
assert(!html.includes('data-case-filter="project"'), "Homepage case filters should not use ambiguous project-only categories");
assert(js.includes("querySelectorAll(selector).forEach"), "Dynamic detail fields should update every matching field, including breadcrumbs and hero titles");
assert(css.includes(".detail-switcher a.is-active"), "Detail switchers should visibly mark the current peer page");
assert(js.includes("defaultCaseFilter"), "Case filters should initialize with a default selected category");
assert(js.includes("clickable-card"), "Clickable cards should route through their primary detail link");
assert(!allPages.includes("采购和管理层关心四件事"), "Technology page should avoid internal buyer-question phrasing");
assert(!allPages.includes("合作前，先看四类证据"), "About page should avoid proposal-style trust headings");
assert(!allPages.includes("电话、微信、服务时间和二维码入口集中展示"), "Contact copy should be visitor-facing");
assert(!allPages.includes("按官网与宣传册可识别项目归类"), "Cases page should avoid source-audit wording in public copy");
assert(!allPages.includes("没有完整图片或成果数据"), "Cases page should avoid exposing internal content limitations");

const caseCategorySets = [...casesPage.matchAll(/data-case-category="([^"]+)"/g)].map((match) =>
  match[1].split(/\s+/).filter(Boolean)
);
assert(caseCategorySets.length >= 80, `Cases page should show a substantial public project index, found ${caseCategorySets.length}`);
const requiredCaseCoverage = {
  platform: 20,
  site: 10,
  bim: 15,
  twin: 6,
  command: 6,
  bimvr: 5,
  rail: 10,
  water: 8,
  infra: 15,
  building: 15,
};
for (const [category, minCount] of Object.entries(requiredCaseCoverage)) {
  const count = caseCategorySets.filter((categories) => categories.includes(category)).length;
  assert(count >= minCount, `Case filter "${category}" needs stronger coverage, found ${count}`);
}

assert(pageProducts.modules.length >= 6, "Product page data should include the expanded module structure");
assert(pageSolutions.solutionLanes.length >= 3, "Solutions page data should include solution lanes");
assert(pageSolutions.rolePaths.length >= 4, "Solutions page data should include role paths");
assert(pageSolutions.industryPaths.length >= 4, "Solutions page data should include industry paths");
assert(pageCases.filters.length >= 10, "Cases page data should include the full public filter set");
assert(pageCases.cases === "完整案例索引见 data/cases.json", "Cases page config should reference the complete case data source");
assert(Array.isArray(cases) && cases.length >= 80, `Case data should include the complete public project index, found ${cases.length}`);
assert(pageTechnology.capabilities.length >= 6, "Technology page data should include technology capabilities");
assert(pageResources.resources.length >= 4, "Resources page data should include resource entries");
assert(pageAbout.trustBlocks.length >= 4, "About page data should include trust blocks");
assert(pageContact.contactCards.length >= 4, "Contact page data should include consultation cards");
assert(contactPage.includes("contact-pathway"), "Contact page should expose a consultation pathway block");
assert(!contactPage.includes("线索损耗"), "Contact page should avoid internal funnel-loss wording");
assert(!/SEO 迁移|CMS 内容池|旧栏目承接策略|301 跳转|CMS 权限/.test(resourcesPage), "Resources page should present public resource content instead of migration implementation notes");

assert(html.includes("预约咨询"), "Missing primary CTA copy");
assert(html.includes('rel="icon"'), "Missing favicon link");
assert(html.includes("80% 大型国央企 / 政府监管客户"), "Missing 80% hero trust metric");
assert(html.includes("1000+ 重点建设项目"), "Missing 1000+ hero trust metric");
assert(html.includes("80+ 专利软著"), "Missing 80+ hero trust metric");
assert(html.includes("100+ 国家级、省部级奖项"), "Missing 100+ hero trust metric");

const heroMatch = html.match(/<section[^>]*class="hero[\s\S]*?<\/section>/);
assert(heroMatch, "Missing hero section");
assert(!heroMatch[0].includes("2014"), "Hero must not include 2014 founding metric");

const visitorReviewMarkers = ["pending", "待复核", "待授权", "待替换"];
assert(
  visitorReviewMarkers.every((marker) => !allPages.includes(marker)),
  "Public prototype pages should not expose internal review status markers"
);
const publicProcessMarkers = [
  "Webv8",
  "资料来源：",
  "正式上线前",
  "案例素材口径",
  "截图脱敏",
  "宣传册口径",
  "待复核",
  "真实平台视觉素材",
  "来自现官网展示",
  "用于呈现",
  "FYRA / INTELLIGENT",
  "可参照官网",
  "视觉素材",
];
assert(
  publicProcessMarkers.every((marker) => !allPages.includes(marker)),
  "Public prototype pages should not expose internal production process labels"
);
assert(
  site.verificationStatus === "pending" || JSON.stringify([home, pageProducts, pageTechnology, pageAbout]).includes("待复核"),
  "Internal data files should retain review status traceability"
);
assert(html.includes("assets/v8/banner-bimcc.png"), "Missing V8 hero platform visual");
assert(html.includes("client-wall"), "Missing customer logo trust wall");
assert(html.includes('data-motion-root="deep-space-product"'), "Missing deep-space motion root marker");
assert(html.includes('data-reference-style="raycast-reflect-authkit-teddy"'), "Missing reference style marker");
assert(html.includes('data-visual-grade="v8-cinematic"'), "Homepage should declare the stronger V8 cinematic visual grade");
assert(html.includes("hero-stage"), "Homepage hero should use a cinematic product stage");
assert(html.includes("product-stage"), "Product section should include a stronger staged product composition");
assert(html.includes("case-spotlight"), "Case section should include a spotlight case composition");
assert(productsPage.includes("product-detail.html?slug=fyra"), "Products overview should link to product detail pages");
assert(solutionsPage.includes("solution-detail.html?slug=enterprise"), "Solutions overview should link to solution detail pages");
assert(casesPage.includes("case-detail.html?slug=gezhouba-platform"), "Cases overview should link to case detail pages");
assert(js.includes("hydrateProductDetail"), "Missing product detail hydration");
assert(js.includes("hydrateSolutionDetail"), "Missing solution detail hydration");
assert(js.includes("hydrateCaseDetail"), "Missing case detail hydration");
assert(html.includes("motion-field"), "Missing quiet animated motion field");
assert(!html.includes("hero-radar"), "Hero should not use a radar layer in the refined direction");
assert(!html.includes("hero-orbit"), "Hero should not stack orbit graphics over the real V8 banner");
assert(!html.includes("visual-system-tray"), "Hero should not stack a system tray over the real V8 banner");
assert(html.includes("hero-visual-caption"), "Hero should keep a restrained material caption under the product visual");
assert((html.match(/assets\/clients\/logo-/g) || []).length >= 10, "Expected at least 10 approved partner logos");
assert((html.match(/wp-content\/uploads/g) || []).length >= 6, "Expected official case image references");
assert(html.includes("023-68682379"), "Missing official contact phone number");
assert(html.includes("18584713100"), "Missing official business contact number");
assert(html.includes("微信同号"), "Missing WeChat consultation wording");
assert(html.includes("周一至周五 9:00-18:00"), "Missing official service time");
assert(html.includes("公众号 / 二维码"), "Missing public account or QR code placeholder");
assert(html.includes('rel="canonical"'), "Missing canonical URL");
assert(html.includes('property="og:title"'), "Missing Open Graph metadata");
assert(html.includes('application/ld+json'), "Missing structured data");
assert(html.includes('data-integration="reserved"'), "Missing reserved form integration flag");
assert(html.includes('name="source_page"'), "Missing form source tracking field");
assert(html.includes('class="form-assurance"'), "Missing form integration assurance status");
assert(html.includes('class="case-meta"'), "Missing case source metadata");
assert(seoMap.strategy === "replace-content-preserve-core-urls", "Missing SEO migration strategy");
assert(seoMap.coreRoutes.some((route) => route.current === "/contact-us/"), "Missing contact URL migration entry");
assert(handoff.includes("最小授权清单"), "Missing CMS handoff authorization checklist");
assert(handoff.includes("表单接入策略"), "Missing form integration handoff notes");
assert(handoff.includes("模块字段映射"), "Missing CMS module field mapping");
assert(handoff.includes("Hero 信任入口"), "Missing Hero CMS field mapping");
assert(handoff.includes("客户案例精选"), "Missing case CMS field mapping");
assert(readme.includes("data-cms-module"), "README should document CMS module markers");
assert(Array.isArray(site.contact.consultationPaths), "Missing structured contact consultation paths");
assert(site.contact.consultationPaths.some((path) => path.type === "telephone"), "Missing telephone consultation path");
assert(site.contact.consultationPaths.some((path) => path.type === "wechat"), "Missing WeChat consultation path");
assert(site.contact.consultationPaths.some((path) => path.type === "qr-source"), "Missing QR material source path");
assert(site.contact.consultationPaths.some((path) => path.type === "form-reserved"), "Missing reserved form integration path");
assert(home.platformShowcase?.image === "assets/v8/banner-fyra.png", "Missing Fyra platform showcase data");
assert(home.platformShowcase?.points?.length === 3, "Fyra platform showcase should include three proof points");
assert(css.includes("heroImageBreath"), "Missing restrained hero image motion");
assert(css.includes("caseMediaDrift"), "Missing restrained case media motion");
assert(solutions.byRole.every((item) => item.fit), "Role solutions should include fit guidance");
assert(solutions.byIndustry.every((item) => item.fit), "Industry solutions should include fit guidance");
assert(cases.every((item) => Array.isArray(item.keywords) && item.keywords.length > 0), "Cases should include capability keywords");
assert(html.includes('role="tablist"'), "Missing solution tablist semantics");
assert(html.includes('aria-labelledby="role-tab"'), "Role solution panel should reference its tab label");
assert(html.includes('aria-labelledby="industry-tab"'), "Industry solution panel should reference its tab label");
assert(html.includes('tabindex="-1"'), "Inactive solution tabs should be removed from tab order");
assert(html.includes('aria-pressed="false"'), "Missing inactive case filter pressed state");
assert(!allPages.includes("进入案例详情页"), "Visitor-facing case links should not use clunky prototype wording");
assert(!allPages.includes("进入飞椽详情页"), "Visitor-facing product links should not use clunky prototype wording");
assert(!allPages.includes("进入企业级详情页"), "Visitor-facing solution links should not use clunky prototype wording");
assert(html.includes('type="tel"'), "Phone field should use tel input type");
assert(html.includes('inputmode="tel"'), "Phone field should declare tel input mode");
assert(!/[\u2014\u2013]/.test(allPages + css + js), "Prototype files must not include long dash characters");
assert(!/(2014 成立|15310232918|杭州分部)/.test(allPages), "Prototype pages must not include outdated trust or contact facts");
assert(css.includes("@media (max-width: 768px)"), "Missing mobile breakpoint");
assert(css.includes("Mobile evidence rails"), "Missing mobile compact evidence rail styles");
assert(css.includes(".motion-field"), "Missing motion field styles");
assert(css.includes(".page-signal-map"), "Missing secondary-page signal map styles");
assert(css.includes(".page-hero-visual figcaption::before"), "Missing secondary-page hero material label accent");
assert(css.includes(".page-hero-visual .page-signal-map"), "Missing secondary-page focused signal map styling");
assert(css.includes(".solution-panel article::before"), "Missing solution card focus material layer");
assert(css.includes(".product-catalog-grid"), "Missing product catalog grid styles");
assert(css.includes(".module-grid"), "Missing product and solution detail module styles");
assert(css.includes(".deliverable-board"), "Missing deliverable board styles");
assert(css.includes(".case-profile-grid"), "Missing case detail profile styles");
assert(css.includes("body::after"), "Missing global material grain layer");
assert(css.includes(".page-hero::before"), "Missing secondary-page hero depth field");
assert(css.includes(".product-platforms::before"), "Missing product module depth field");
assert(css.includes(".platform-visual::after"), "Missing platform visual material overlay");
assert(css.includes(".case-card::before"), "Missing case card material layer");
assert(css.includes("@keyframes mediaCurrent"), "Missing restrained case media motion");
assert(css.includes(".button-primary::before"), "Missing primary button shimmer layer");
assert(css.includes("@keyframes buttonSheen"), "Missing primary button shimmer motion");
assert(css.includes("@keyframes auroraDrift"), "Missing aurora drift motion");
assert(css.includes("@keyframes signalDrift"), "Missing secondary-page signal drift motion");
assert(css.includes("prefers-reduced-motion: reduce"), "Missing reduced motion override");
assert(!js.includes('window.addEventListener("scroll"'), "Scroll-driven animation should not use raw scroll listeners");
assert(styleDirection.includes("Raycast"), "Style direction should capture Raycast reference extraction");
assert(styleDirection.includes("Reflect"), "Style direction should capture Reflect reference extraction");
assert(styleDirection.includes("AuthKit"), "Style direction should capture AuthKit reference extraction");
assert(styleDirection.includes("Scale with Teddy"), "Style direction should capture Scale with Teddy reference extraction");
assert(styleDirection.includes("Motion thesis"), "Style direction should define the motion thesis");
assert(
  /Mobile evidence rails[\s\S]*?\.product-grid,[\s\S]*?\.case-profile-grid[\s\S]*?\{[\s\S]*?grid-auto-flow: column;[\s\S]*?scroll-snap-type: x mandatory;/.test(css),
  "Mobile product, case, route, contact, and detail cards should use horizontal card rails"
);
assert(
  /\.product-card,[\s\S]*?\.case-index-board article\s*\{[\s\S]*?scroll-snap-align: start;/.test(css),
  "Mobile card rails across homepage, secondary pages, and detail pages should include snap alignment"
);
assert(
  /\.case-toolbar\s*\{[\s\S]*?flex-wrap: nowrap;[\s\S]*?overflow-x: auto;/.test(css),
  "Mobile case filters should use a horizontal compact rail"
);
assert(
  /\.case-filter\s*\{[\s\S]*?scroll-snap-align: start;/.test(css),
  "Mobile case filters should snap as compact pills"
);
assert(css.includes("prefers-reduced-motion"), "Missing reduced motion handling");
assert(js.includes("mobileMenu"), "Missing mobile menu behavior hook");
assert(js.includes("solutionTabs"), "Missing solution tab behavior hook");
assert(js.includes("activateSolutionTab"), "Missing reusable solution tab activation behavior");
assert(js.includes("ArrowRight"), "Missing keyboard support for solution tabs");
assert(js.includes("aria-pressed"), "Missing case filter pressed-state behavior");
assert(js.includes("leadForm"), "Missing lead form behavior hook");
assert(js.includes("setFormState"), "Missing reusable lead form state helper");
assert(js.includes("aria-busy"), "Lead form should expose busy state for assistive technology");
assert(js.includes("is-submitting"), "Lead form should expose submitting visual state");

console.log("BIMCC homepage prototype contract checks passed.");

import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/bimcc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reviewDir = resolve(root, "../../.impeccable/review");
mkdirSync(reviewDir, { recursive: true });

const url = process.env.BIMCC_PREVIEW_URL || "http://127.0.0.1:5173";
const baseUrl = url.replace(/\/$/, "");

function resolvePageUrl(path = "") {
  if (!path) return url;
  if (url.startsWith("file://")) {
    const rootUrl = url.endsWith("/") ? url : url.replace(/\/[^/]*$/, "/");
    return new URL(path, rootUrl).href;
  }
  return `${baseUrl}/${path}`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function inspectViewport(page, viewport, screenshotName) {
  await page.setViewportSize(viewport);
  await page.goto(resolvePageUrl(), { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: resolve(reviewDir, screenshotName), fullPage: true });

  return page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const hero = document.querySelector(".hero");
    const heroHeading = document.querySelector(".hero h1");
    const primaryCta = document.querySelector(".hero .button-primary");
    const nav = document.querySelector(".primary-nav");
    const sections = document.querySelectorAll("[data-home-section]");
    const revealItems = document.querySelectorAll(".reveal");
    const productGrid = document.querySelector(".product-grid");
    const caseGrid = document.querySelector(".case-grid");
    const caseToolbar = document.querySelector(".case-toolbar");
    const body = document.body;
    const documentElement = document.documentElement;

    const heroRect = hero?.getBoundingClientRect();
    const headingRect = heroHeading?.getBoundingClientRect();
    const headingStyle = heroHeading ? getComputedStyle(heroHeading) : null;
    const headingLineHeight = headingStyle ? parseFloat(headingStyle.lineHeight) : null;
    const ctaRect = primaryCta?.getBoundingClientRect();
    const navStyle = nav ? getComputedStyle(nav) : null;
    const productGridStyle = productGrid ? getComputedStyle(productGrid) : null;
    const caseGridStyle = caseGrid ? getComputedStyle(caseGrid) : null;
    const caseToolbarStyle = caseToolbar ? getComputedStyle(caseToolbar) : null;
    const hiddenRevealCount = [...revealItems].filter((item) => Number(getComputedStyle(item).opacity) < 0.7).length;

    return {
      sectionCount: sections.length,
      headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
      pageHeight: Math.round(documentElement.scrollHeight),
      scrollWidth: Math.max(body.scrollWidth, documentElement.scrollWidth),
      viewportWidth: window.innerWidth,
      heroTop: heroRect ? Math.round(heroRect.top) : null,
      heroBottom: heroRect ? Math.round(heroRect.bottom) : null,
      heroHeadingLines: headingRect && headingLineHeight ? Number((headingRect.height / headingLineHeight).toFixed(2)) : null,
      ctaVisibleInFirstViewport: ctaRect ? ctaRect.top >= 0 && ctaRect.bottom <= window.innerHeight : false,
      navDisplay: navStyle?.display || null,
      title: document.title,
      hasHero2014: Boolean(hero?.textContent?.includes("2014")),
      hasPendingMarker: document.body.textContent.includes("pending") || document.body.textContent.includes("待复核") || document.body.textContent.includes("待授权"),
      hiddenRevealCount,
      productGridFlow: productGridStyle?.gridAutoFlow || null,
      productGridScrolls: productGrid ? productGrid.scrollWidth > productGrid.clientWidth + 1 : false,
      caseGridFlow: caseGridStyle?.gridAutoFlow || null,
      caseGridScrolls: caseGrid ? caseGrid.scrollWidth > caseGrid.clientWidth + 1 : false,
      caseToolbarWrap: caseToolbarStyle?.flexWrap || null,
      caseToolbarScrolls: caseToolbar ? caseToolbar.scrollWidth > caseToolbar.clientWidth + 1 : false,
    };
  });
}

async function inspectSecondaryPage(page, path, viewport, screenshotName) {
  await page.setViewportSize(viewport);
  await page.goto(resolvePageUrl(path), { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: resolve(reviewDir, screenshotName), fullPage: true });

  return page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const hero = document.querySelector(".page-hero");
    const heroHeading = document.querySelector(".page-hero h1");
    const primaryCta = document.querySelector(".page-hero .button-primary");
    const pageModules = document.querySelectorAll("[data-page-module]");
    const sourceMarkers = document.querySelectorAll("[data-content-source]");
    const contactCardGrid = document.querySelector(".contact-card-grid");
    const contactCardGridStyle = contactCardGrid ? getComputedStyle(contactCardGrid) : null;
    const routeGrid = document.querySelector(".route-grid");
    const routeGridStyle = routeGrid ? getComputedStyle(routeGrid) : null;
    const body = document.body;
    const documentElement = document.documentElement;
    const headingRect = heroHeading?.getBoundingClientRect();
    const headingStyle = heroHeading ? getComputedStyle(heroHeading) : null;
    const headingLineHeight = headingStyle ? parseFloat(headingStyle.lineHeight) : null;
    const ctaRect = primaryCta?.getBoundingClientRect();

    return {
      title: document.title,
      headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
      pageHeight: Math.round(documentElement.scrollHeight),
      scrollWidth: Math.max(body.scrollWidth, documentElement.scrollWidth),
      viewportWidth: window.innerWidth,
      heroExists: Boolean(hero),
      moduleCount: pageModules.length,
      sourceCount: sourceMarkers.length,
      heroHeadingLines: headingRect && headingLineHeight ? Number((headingRect.height / headingLineHeight).toFixed(2)) : null,
      ctaVisibleInFirstViewport: ctaRect ? ctaRect.top >= 0 && ctaRect.bottom <= window.innerHeight : false,
      hasOutdatedFacts: /2014 成立|15310232918|杭州分部/.test(document.body.textContent),
      contactCardGridFlow: contactCardGridStyle?.gridAutoFlow || null,
      contactCardGridColumns: contactCardGridStyle?.gridTemplateColumns || null,
      contactCardGridScrolls: contactCardGrid ? contactCardGrid.scrollWidth > contactCardGrid.clientWidth + 1 : false,
      routeGridFlow: routeGridStyle?.gridAutoFlow || null,
      routeGridColumns: routeGridStyle?.gridTemplateColumns || null,
      routeGridScrolls: routeGrid ? routeGrid.scrollWidth > routeGrid.clientWidth + 1 : false,
    };
  });
}

async function inspectInteractions(page) {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(resolvePageUrl(), { waitUntil: "domcontentloaded" });

  await page.locator('[data-solution-tab="role"]').focus();
  await page.keyboard.press("ArrowRight");
  const tabState = await page.evaluate(() => ({
    activeTab: document.activeElement?.getAttribute("data-solution-tab"),
    industrySelected: document
      .querySelector('[data-solution-tab="industry"]')
      ?.getAttribute("aria-selected"),
    roleTabIndex: document.querySelector('[data-solution-tab="role"]')?.getAttribute("tabindex"),
    industryTabIndex: document.querySelector('[data-solution-tab="industry"]')?.getAttribute("tabindex"),
    industryPanelHidden: document.querySelector('[data-solution-panel="industry"]')?.hidden,
  }));

  await page.locator('[data-case-filter="water"]').click();
  const filterState = await page.evaluate(() => ({
    waterPressed: document.querySelector('[data-case-filter="water"]')?.getAttribute("aria-pressed"),
    visibleCases: [...document.querySelectorAll("[data-case-category]")].filter(
      (card) => !card.classList.contains("is-hidden")
    ).length,
  }));
  await page.locator('[data-case-filter="water"]').click();
  const resetFilterState = await page.evaluate(() => ({
    waterPressed: document.querySelector('[data-case-filter="water"]')?.getAttribute("aria-pressed"),
    visibleCases: [...document.querySelectorAll("[data-case-category]")].filter(
      (card) => !card.classList.contains("is-hidden")
    ).length,
  }));

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(resolvePageUrl(), { waitUntil: "domcontentloaded" });
  await page.locator(".menu-button").click();
  await page.keyboard.press("Escape");
  const menuState = await page.evaluate(() => ({
    expanded: document.querySelector(".menu-button")?.getAttribute("aria-expanded"),
    hidden: document.querySelector("#mobileMenu")?.hidden,
    bodyLocked: document.body.classList.contains("menu-open"),
  }));

  await page.goto(resolvePageUrl("contact.html"), { waitUntil: "domcontentloaded" });
  await page.fill('#leadForm input[name="name"]', "本地测试联系人");
  await page.fill('#leadForm input[name="phone"]', "18584713100");
  await page.selectOption('#leadForm select[name="role"]', { label: "建设单位" });
  await page.fill('#leadForm textarea[name="message"]', "测试本地表单状态");
  await page.locator('#leadForm button[type="submit"]').click();
  const formBusyState = await page.evaluate(() => ({
    busy: document.querySelector("#leadForm")?.getAttribute("aria-busy"),
    submitting: document.querySelector("#leadForm")?.classList.contains("is-submitting"),
    disabled: document.querySelector('#leadForm button[type="submit"]')?.disabled,
    statusText: document.querySelector("#formStatus")?.textContent?.trim(),
  }));

  await page.waitForTimeout(520);
  const formSuccessState = await page.evaluate(() => ({
    busy: document.querySelector("#leadForm")?.getAttribute("aria-busy"),
    submitting: document.querySelector("#leadForm")?.classList.contains("is-submitting"),
    disabled: document.querySelector('#leadForm button[type="submit"]')?.disabled,
    statusText: document.querySelector("#formStatus")?.textContent?.trim(),
    nameValue: document.querySelector('#leadForm input[name="name"]')?.value,
  }));

  return { tabState, filterState, resetFilterState, menuState, formBusyState, formSuccessState };
}

const localChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const launchOptions =
  process.env.BIMCC_USE_SYSTEM_CHROME === "1" && existsSync(localChrome)
    ? { headless: true, executablePath: localChrome, args: ["--no-sandbox"] }
    : { headless: true };

const browser = await chromium.launch(launchOptions);
const page = await browser.newPage();

try {
  const desktop = await inspectViewport(page, { width: 1440, height: 980 }, "bimcc-home-desktop.png");
  const mobile = await inspectViewport(page, { width: 390, height: 900 }, "bimcc-home-mobile.png");
  const secondaryPages = ["products.html", "solutions.html", "cases.html", "technology.html", "resources.html", "about.html", "contact.html"];
  const secondary = [];

  for (const path of secondaryPages) {
    secondary.push({
      path,
      desktop: await inspectSecondaryPage(page, path, { width: 1440, height: 980 }, `bimcc-${path.replace(".html", "")}-desktop.png`),
      mobile: await inspectSecondaryPage(page, path, { width: 390, height: 900 }, `bimcc-${path.replace(".html", "")}-mobile.png`),
    });
  }

  const interactions = await inspectInteractions(page);

  assert(desktop.sectionCount === 8, `Desktop expected 8 sections, found ${desktop.sectionCount}`);
  assert(mobile.sectionCount === 8, `Mobile expected 8 sections, found ${mobile.sectionCount}`);
  assert(desktop.headerHeight <= 80, `Desktop header is too tall: ${desktop.headerHeight}px`);
  assert(desktop.scrollWidth <= desktop.viewportWidth + 1, `Desktop has horizontal overflow: ${desktop.scrollWidth}px`);
  assert(mobile.scrollWidth <= mobile.viewportWidth + 1, `Mobile has horizontal overflow: ${mobile.scrollWidth}px`);
  assert(desktop.heroHeadingLines <= 2.2, `Desktop hero heading uses too many lines: ${desktop.heroHeadingLines}`);
  assert(mobile.heroHeadingLines <= 2.6, `Mobile hero heading uses too many lines: ${mobile.heroHeadingLines}`);
  assert(desktop.ctaVisibleInFirstViewport, "Desktop hero CTA is not visible in the first viewport");
  assert(!desktop.hasHero2014 && !mobile.hasHero2014, "Hero must not include 2014");
  assert(!desktop.hasPendingMarker && !mobile.hasPendingMarker, "Public pages should not expose internal review markers");
  assert(desktop.hiddenRevealCount === 0, `Desktop has hidden reveal blocks: ${desktop.hiddenRevealCount}`);
  assert(mobile.hiddenRevealCount === 0, `Mobile has hidden reveal blocks: ${mobile.hiddenRevealCount}`);
  assert(desktop.title.includes("筑云科技 BIMCC"), "Document title is missing brand name");
  assert(mobile.pageHeight <= 11200, `Mobile page is too tall after compact rails: ${mobile.pageHeight}px`);
  assert(mobile.productGridFlow === "column", `Mobile product grid should flow horizontally: ${mobile.productGridFlow}`);
  assert(mobile.productGridScrolls, "Mobile product grid should scroll horizontally");
  assert(mobile.caseGridFlow === "column", `Mobile case grid should flow horizontally: ${mobile.caseGridFlow}`);
  assert(mobile.caseGridScrolls, "Mobile case grid should scroll horizontally");
  assert(mobile.caseToolbarWrap === "nowrap", `Mobile case toolbar should stay on one row: ${mobile.caseToolbarWrap}`);
  assert(!mobile.caseToolbarScrolls || mobile.caseToolbarWrap === "nowrap", "Mobile case toolbar should remain usable without layout overflow");
  assert(interactions.tabState.activeTab === "industry", "ArrowRight should focus the industry solution tab");
  assert(interactions.tabState.industrySelected === "true", "Keyboard tab switch should select industry panel");
  assert(interactions.tabState.roleTabIndex === "-1", "Inactive solution tab should have tabindex -1");
  assert(interactions.tabState.industryTabIndex === "0", "Active solution tab should have tabindex 0");
  assert(interactions.tabState.industryPanelHidden === false, "Industry panel should be visible after keyboard switch");
  assert(interactions.filterState.waterPressed === "true", "Active case filter should set aria-pressed true");
  assert(interactions.filterState.visibleCases === 1, `Water filter expected 1 visible case, found ${interactions.filterState.visibleCases}`);
  assert(interactions.resetFilterState.waterPressed === "true", "Clicking the active filter again should keep the selected category");
  assert(interactions.resetFilterState.visibleCases === 1, `Repeated case filter click should keep water cases visible, found ${interactions.resetFilterState.visibleCases}`);
  assert(interactions.menuState.expanded === "false", "Escape should collapse mobile menu");
  assert(interactions.menuState.hidden === true, "Mobile menu should be hidden after Escape");
  assert(interactions.menuState.bodyLocked === false, "Body scroll lock should be removed after Escape");
  assert(interactions.formBusyState.busy === "true", "Lead form should set aria-busy during local submission");
  assert(interactions.formBusyState.submitting === true, "Lead form should expose submitting visual state");
  assert(interactions.formBusyState.disabled === true, "Lead form submit button should be disabled while submitting");
  assert(interactions.formBusyState.statusText.includes("正在提交"), "Lead form should show submitting feedback");
  assert(interactions.formSuccessState.busy === "false", "Lead form should clear aria-busy after local submission");
  assert(interactions.formSuccessState.submitting === false, "Lead form should clear submitting visual state after local submission");
  assert(interactions.formSuccessState.disabled === false, "Lead form submit button should be re-enabled after local submission");
  assert(interactions.formSuccessState.statusText.includes("已收到预约信息"), "Lead form should show success feedback");
  assert(interactions.formSuccessState.nameValue === "", "Lead form should reset after local submission");

  for (const result of secondary) {
    assert(result.desktop.heroExists && result.mobile.heroExists, `${result.path} should render a page hero`);
    assert(result.desktop.moduleCount >= 2, `${result.path} should expose page module markers`);
    assert(result.desktop.sourceCount >= 2, `${result.path} should expose source traceability markers`);
    assert(result.desktop.headerHeight <= 80, `${result.path} desktop header is too tall: ${result.desktop.headerHeight}px`);
    assert(result.desktop.scrollWidth <= result.desktop.viewportWidth + 1, `${result.path} desktop has horizontal overflow`);
    assert(result.mobile.scrollWidth <= result.mobile.viewportWidth + 1, `${result.path} mobile has horizontal overflow`);
    assert(result.desktop.heroHeadingLines <= 2.5, `${result.path} desktop hero heading uses too many lines: ${result.desktop.heroHeadingLines}`);
    assert(result.mobile.heroHeadingLines <= 3.2, `${result.path} mobile hero heading uses too many lines: ${result.mobile.heroHeadingLines}`);
    assert(result.desktop.ctaVisibleInFirstViewport, `${result.path} desktop hero CTA should be visible in first viewport`);
    assert(result.mobile.pageHeight <= 7600, `${result.path} mobile page is too tall: ${result.mobile.pageHeight}px`);
    assert(!result.desktop.hasOutdatedFacts && !result.mobile.hasOutdatedFacts, `${result.path} contains outdated trust or contact facts`);
    if (result.path === "contact.html") {
      assert(!result.mobile.contactCardGridScrolls, "Contact page mobile contact cards should not require horizontal scrolling");
      assert(result.mobile.contactCardGridFlow !== "column", "Contact page mobile contact cards should stack vertically");
    }
    if (result.path === "resources.html") {
      assert(!result.mobile.routeGridScrolls, "Resources page mobile resource cards should not require horizontal scrolling");
      assert(result.mobile.routeGridFlow !== "column", "Resources page mobile resource cards should stack vertically");
    }
    if (result.path === "about.html") {
      assert(!result.mobile.routeGridScrolls, "About page mobile trust cards should not require horizontal scrolling");
      assert(result.mobile.routeGridFlow !== "column", "About page mobile trust cards should stack vertically");
    }
  }

  console.log(JSON.stringify({ desktop, mobile, secondary, interactions }, null, 2));
} finally {
  await browser.close();
}

// Priority: explicit URL, manual preference, then the browser's primary language.
const languagePreferenceKey = "homepage-language";
const urlLanguage = new URLSearchParams(window.location.search).get("lang");
let savedLanguage = null;
try {
  savedLanguage = window.localStorage.getItem(languagePreferenceKey);
} catch {
  // The site also works when storage is blocked or opened as a local file.
}
const supportedLanguage = (value) => value === "ja" || value === "en";
const browserLanguage = navigator.languages?.[0] || navigator.language || "en";
const language = supportedLanguage(urlLanguage) ? urlLanguage
  : supportedLanguage(savedLanguage) ? savedLanguage
  : /^ja(?:-|$)/i.test(browserLanguage) ? "ja" : "en";
const isJapanese = language === "ja";
document.documentElement.lang = language;
document.title = isJapanese ? "川原 啓輔 | 東京科学大学" : "Keisuke Kawahara | Institute of Science Tokyo";
document.querySelectorAll("[data-en][data-ja]").forEach((element) => {
  element.textContent = element.dataset[language];
});
document.querySelectorAll("[data-alt-en][data-alt-ja]").forEach((image) => {
  image.alt = isJapanese ? image.dataset.altJa : image.dataset.altEn;
});

document.querySelectorAll("[data-keep-language]").forEach((link) => {
  const url = new URL(link.getAttribute("href"), window.location.href);
  url.searchParams.set("lang", language);
  link.href = url.href;
});
document.querySelectorAll("[data-language]").forEach((link) => {
  if (link.dataset.language === language) link.setAttribute("aria-current", "true");
  else link.removeAttribute("aria-current");
  // Keep the reader at the same section when changing language.
  link.addEventListener("click", () => {
    try {
      window.localStorage.setItem(languagePreferenceKey, link.dataset.language);
    } catch {
      // URL-based switching still works without persistent storage.
    }
    link.href = `?lang=${link.dataset.language}${window.location.hash}`;
  });
});
document.querySelectorAll(".conference-links > span").forEach((label) => {
  label.textContent = isJapanese ? "関連発表：" : "Related presentation:";
});
document.querySelectorAll(".award-link").forEach((button) => {
  button.textContent = isJapanese ? button.dataset.titleJa : button.dataset.title;
  const trophy = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  trophy.setAttribute("class", "award-icon");
  trophy.setAttribute("viewBox", "0 0 24 24");
  trophy.setAttribute("aria-hidden", "true");
  trophy.setAttribute("focusable", "false");
  const silhouette = document.createElementNS("http://www.w3.org/2000/svg", "path");
  silhouette.setAttribute("fill-rule", "evenodd");
  silhouette.setAttribute("d", "M6 2h12v2h4v4a5 5 0 0 1-5 5h-.53A6 6 0 0 1 13 14.92V18h3v2h2v2H6v-2h2v-2h3v-3.08A6 6 0 0 1 7.53 13H7a5 5 0 0 1-5-5V4h4V2ZM4 6v2a3 3 0 0 0 2.35 2.93A6 6 0 0 1 6 9V6H4Zm14 0v3c0 .68-.12 1.33-.35 1.93A3 3 0 0 0 20 8V6h-2Z");
  trophy.append(silhouette);
  button.prepend(trophy);
});
// Paper titles and citation metadata remain in their original language.
document.querySelectorAll(".research-body h3, .research-citation").forEach((element) => {
  element.lang = "en";
});

const topicHeading = document.querySelector(".topic-detail h1");
if (topicHeading) document.title = `${topicHeading.textContent} | ${isJapanese ? "川原 啓輔" : "Keisuke Kawahara"}`;
const description = document.querySelector(".topic-detail-summary")?.textContent || (isJapanese
  ? "東京科学大学 工学院 電気電子系 助教 川原啓輔。電子・光集積回路を研究しています。"
  : "Keisuke Kawahara is an Assistant Professor at the Institute of Science Tokyo. His research interests include electronic and photonic integrated circuits.");
document.querySelector('meta[name="description"]').content = description;
document.querySelector('meta[property="og:description"]').content = description;
document.querySelector('meta[property="og:title"]').content = topicHeading?.textContent || (isJapanese ? "川原 啓輔" : "Keisuke Kawahara");
document.querySelector(".site-nav").setAttribute("aria-label", isJapanese ? "メインナビゲーション" : "Primary navigation");
document.querySelector(".language-switch").setAttribute("aria-label", isJapanese ? "表示言語" : "Language");
document.querySelectorAll('[aria-label="External profiles"]').forEach((element) => {
  element.setAttribute("aria-label", isJapanese ? "外部プロフィール" : "External profiles");
});
document.querySelector(".back-to-top").setAttribute("aria-label", isJapanese ? "ページ上部へ" : "Back to top");
const dialogClose = document.querySelector(".dialog-close");
if (dialogClose) {
  dialogClose.textContent = isJapanese ? "閉じる ×" : "close ×";
  dialogClose.setAttribute("aria-label", isJapanese ? "賞状を閉じる" : "Close certificate");
}
const japaneseImageDescriptions = [
  "電気光学イコライザを内蔵したシリコンスローライト変調器の構造模式図",
  "シリコン光変調器と電子ドライバの一体実装",
  "電子・光協調シミュレーションの設計フロー",
  "シリコンフォトニック結晶スローライト光変調器",
  "結合インダクタを用いた完全差動分布増幅器のチップ写真",
  "インダクタレスCMOSアクティブバランのチップ写真",
  "イメージ除去アナログマルチプレクサのチップ写真",
];
if (isJapanese) document.querySelectorAll(".research-image img").forEach((image, index) => {
  image.alt = japaneseImageDescriptions[index] || image.alt;
});

// Account for wrapping navigation, language changes, and font loading.
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const mobileMenu = window.matchMedia("(max-width: 720px)");
const setMenuOpen = (open, returnFocus = false) => {
  header.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", isJapanese ? (open ? "メニューを閉じる" : "メニューを開く") : (open ? "Close menu" : "Open menu"));
  if (returnFocus) menuToggle.focus();
};
header.classList.add("menu-ready");
setMenuOpen(false);
menuToggle.addEventListener("click", () => setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"));
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a") && mobileMenu.matches) setMenuOpen(false, true);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("menu-open")) setMenuOpen(false, true);
});
document.addEventListener("pointerdown", (event) => {
  if (!header.contains(event.target) && header.classList.contains("menu-open")) setMenuOpen(false, siteNav.contains(document.activeElement));
});
mobileMenu.addEventListener("change", () => setMenuOpen(false));
const updateHeaderHeight = () => {
  document.documentElement.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
};
updateHeaderHeight();
new ResizeObserver(updateHeaderHeight).observe(header);
// Re-align direct fragment links after fonts and images have settled.
window.addEventListener("load", () => {
  updateHeaderHeight();
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
});

const dialog = document.querySelector("#award-dialog");
const dialogImage = document.querySelector("#award-dialog-image");
const dialogTitle = document.querySelector("#award-dialog-title");
const dialogYear = document.querySelector("#award-dialog-year");

document.querySelectorAll(".award-link").forEach((button) => {
  button.addEventListener("click", () => {
    dialogImage.src = button.dataset.image;
    const title = isJapanese ? button.dataset.titleJa : button.dataset.title;
    dialogImage.alt = isJapanese ? `${title}の賞状` : `${title} certificate`;
    dialogTitle.textContent = title;
    dialogYear.textContent = button.dataset.year;
    dialog.showModal();
  });
});

dialog?.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom;
  if (!inside) dialog.close();
});

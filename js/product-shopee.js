(() => {
  const link = document.querySelector(".product-shopee-fab");
  if (!link) return;

  function syncAccessibleName() {
    const isChinese = document.documentElement.dataset.language === "zh";
    link.setAttribute(
      "aria-label",
      isChinese ? "在线选购 — 官方授权网店" : "shop online? — Authorized Dealer Online Store"
    );
  }

  syncAccessibleName();
  window.addEventListener("herb-language-change", syncAccessibleName);
})();

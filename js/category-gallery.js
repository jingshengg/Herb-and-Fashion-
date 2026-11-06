(() => {
  const gallery = document.querySelector("[data-category-gallery]");
  const stage = gallery?.querySelector("[data-category-gallery-stage]");
  if (!gallery || !stage) return;

  const categoryNames = [
    { en: "Immunity & Respiratory Health", enLines: ["Immunity &", "Respiratory Health"], zh: "免疫与呼吸道健康", zhLines: ["免疫与呼吸道", "健康"], image: "Immunity & Respiratory Health.jpg" },
    { en: "Kidney, Liver & Reproductive Health", enLines: ["Kidney, Liver &", "Reproductive Health"], zh: "肝肾与生殖健康", zhLines: ["肝肾与生殖", "健康"], image: "Kidney, Liver & Reproductive Health.jpg" },
    { en: "Cardiovascular & Three-Highs Support", enLines: ["Cardiovascular &", "Three-Highs Support"], zh: "心血管与三高调理", zhLines: ["心血管与三高", "调理"], image: "Cardiovascular & Three-Highs Support.jpg" },
    { en: "Bone, Joint & Mobility Health", enLines: ["Bone, Joint &", "Mobility Health"], zh: "骨关节与活动力健康", zhLines: ["骨关节与活动力", "健康"], image: "Bone, Joint & Mobility Health.jpg" },
    { en: "Digestive & Metabolic Health", enLines: ["Digestive &", "Metabolic Health"], zh: "消化与代谢健康", zhLines: ["消化与代谢", "健康"], image: "Digestive & Metabolic Health.jpg" },
    { en: "Eye, Skin & Antioxidant Care", enLines: ["Eye, Skin &", "Antioxidant Care"], zh: "眼部、肌肤与抗氧化护理", zhLines: ["眼部、肌肤与", "抗氧化护理"], image: "Eye, Skin & Antioxidant Care.jpg" },
    { en: "Mood, Stress & Sleep Support", enLines: ["Mood, Stress &", "Sleep Support"], zh: "情绪、压力与睡眠管理", zhLines: ["情绪、压力与", "睡眠管理"], image: "Mood, Stress & Sleep Support.jpg" },
    { en: "Healthy Wellness Drink Mixes", enLines: ["Healthy Wellness", "Drink Mixes"], zh: "健康养生冲饮", zhLines: ["健康养生", "冲饮"], image: "Healthy Wellness Drink Mixes.jpg" }
  ];

  const cards = [...stage.querySelectorAll("[data-category-card]")];
  const previous = gallery.querySelector("[data-gallery-previous]");
  const next = gallery.querySelector("[data-gallery-next]");
  if (cards.length !== categoryNames.length) return;

  const measureCard = document.createElement("button");
  measureCard.type = "button";
  measureCard.className = "category-card";
  measureCard.setAttribute("aria-hidden", "true");
  measureCard.tabIndex = -1;
  measureCard.style.cssText = "position:absolute!important;left:-10000px!important;top:0!important;visibility:hidden!important;pointer-events:none!important;transform:none!important;transition:none!important;";
  stage.append(measureCard);

  cards.forEach((card, index) => {
    const image = document.createElement("img");
    image.src = `images/featured-products/${encodeURIComponent(categoryNames[index].image)}`;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    card.querySelector(".category-card__media").append(image);
  });

  let activeIndex = 0;
  let currentLanguage = document.documentElement.dataset.language === "zh" ||
    document.documentElement.lang.startsWith("zh") ? "zh" : "en";
  let pointerStart = null;
  let ignoreClickUntil = 0;

  const titleMarkup = (lines) => lines
    .map((line) => line.replace(/&/g, '<span class="plain-amp">&amp;</span>'))
    .join("<br>");

  function updateText(language) {
    currentLanguage = language === "zh" ? "zh" : "en";
    const isChinese = currentLanguage === "zh";
    stage.setAttribute("aria-label", isChinese ? "产品类别卡片" : "Product category cards");
    gallery.setAttribute("aria-label", isChinese ? "产品类别" : "Product categories");
    gallery.setAttribute("aria-roledescription", isChinese ? "轮播画廊" : "carousel");
    previous?.setAttribute("aria-label", isChinese ? "上一个类别" : "Previous category");
    next?.setAttribute("aria-label", isChinese ? "下一个类别" : "Next category");

    cards.forEach((card, index) => {
      const category = categoryNames[index];
      const title = category[currentLanguage];
      card.querySelector(".category-card__title").innerHTML = titleMarkup(category[`${currentLanguage}Lines`]);
      card.setAttribute("aria-label", isChinese
        ? (index === activeIndex ? "查看类别：" + title : "选择类别：" + title)
        : (index === activeIndex ? "View category: " + title : "Select category: " + title));
    });
  }

  function cardWidths() {
    measureCard.classList.remove("is-active");
    const sideWidth = measureCard.offsetWidth;
    measureCard.classList.add("is-active");
    const activeWidth = measureCard.offsetWidth;
    measureCard.classList.remove("is-active");
    return { activeWidth, sideWidth };
  }

  function positionForOffset(offset, activeWidth, sideWidth) {
    if (offset === 0) return 0;
    const distance = Math.abs(offset);
    const overlap = sideWidth * 0.18;
    const firstCenterGap = (activeWidth + sideWidth) / 2 - overlap;
    const sideCenterGap = sideWidth - overlap;
    return Math.sign(offset) * (firstCenterGap + (distance - 1) * sideCenterGap);
  }

  function render() {
    const count = cards.length;
    const { activeWidth, sideWidth } = cardWidths();
    const maxFocusableDistance = stage.clientWidth <= 600 ? 1 : 2;

    cards.forEach((card, index) => {
      let offset = (index - activeIndex + count) % count;
      if (offset > count / 2) offset -= count;

      const distance = Math.abs(offset);
      const isActive = offset === 0;
      const inwardAngle = Math.min(34, 30 + Math.max(0, distance - 1) * 2);
      const rotation = isActive ? 0 : (offset < 0 ? -inwardAngle : inwardAngle);

      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
      card.setAttribute("aria-hidden", String(distance > maxFocusableDistance));
      card.tabIndex = distance > maxFocusableDistance ? -1 : 0;
      card.querySelector(".category-card__content").setAttribute("aria-hidden", String(!isActive));
      card.style.setProperty("--card-x", positionForOffset(offset, activeWidth, sideWidth) + "px");
      card.style.setProperty("--card-depth", isActive ? "0px" : (-distance * 150) + "px");
      card.style.setProperty("--card-rotate", rotation + "deg");
      card.style.zIndex = String(100 - distance * 10);
    });
    updateText(currentLanguage);
  }

  function moveBy(amount) {
    activeIndex = (activeIndex + amount + cards.length) % cards.length;
    render();
  }

  gallery.addEventListener("click", (event) => {
    const arrow = event.target.closest("[data-gallery-previous], [data-gallery-next]");
    if (arrow) {
      moveBy(arrow.matches("[data-gallery-previous]") ? -1 : 1);
      return;
    }

    const card = event.target.closest("[data-category-card]");
    if (!card || Date.now() < ignoreClickUntil) return;

    const index = Number(card.dataset.index);
    if (index !== activeIndex) {
      activeIndex = index;
      render();
      return;
    }

    window.location.href = "products.html";
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    stage.classList.add("is-pointer-down");
  });

  window.addEventListener("pointermove", (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      pointerStart.moved = true;
      stage.classList.add("is-dragging");
    }
  }, { passive: true });

  function finishPointer(event) {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaX = event.clientX - pointerStart.x;
    const didMove = pointerStart.moved;
    pointerStart = null;
    stage.classList.remove("is-pointer-down", "is-dragging");

    if (!didMove) return;
    ignoreClickUntil = Date.now() + 350;
    if (Math.abs(deltaX) >= 48) moveBy(deltaX < 0 ? 1 : -1);
  }

  window.addEventListener("pointerup", finishPointer);
  window.addEventListener("pointercancel", finishPointer);
  window.addEventListener("resize", render, { passive: true });
  window.addEventListener("herb-language-change", (event) => updateText(event.detail?.language));

  updateText(currentLanguage);
  render();
})();

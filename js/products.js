(() => {
  const products = window.herbProductCatalogue || [];
  const categories = window.herbProductCategories || [];
  const grid = document.querySelector('[data-product-grid]');
  const emptyState = document.querySelector('[data-product-empty]');
  const status = document.querySelector('[data-product-status]');
  const sortSelect = document.querySelector('#product-sort');
  const filters = [...document.querySelectorAll('[data-category-filter]')];
  const viewButtons = [...document.querySelectorAll('[data-product-view]')];
  const search = document.querySelector('[data-product-search]');
  const toolbar = search?.closest('.product-toolbar');
  const searchToggle = search?.querySelector('[data-search-toggle]');
  const searchInput = search?.querySelector('[data-search-input]');
  const sortLabel = document.querySelector('[data-sort-label]');
  if (!grid || !sortSelect || !products.length || !categories.length) return;

  let searchClearTimer = 0;
  let searchToolbarTimer = 0;

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  let currentLanguage = document.documentElement.dataset.language === 'zh' ||
    document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  let activeCategory = null;

  const cards = products.map((product, defaultOrder) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.dataset.categories = product.categories.join(' ');
    card.dataset.defaultOrder = String(defaultOrder);
    card.dataset.price = product.price == null ? '' : String(product.price);

    const link = document.createElement(product.detailEnabled ? 'a' : 'button');
    link.className = `product-card-link${product.detailEnabled ? '' : ' product-card-link--unavailable'}`;
    if (product.detailEnabled) {
      link.href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
    } else {
      link.type = 'button';
      link.disabled = true;
      link.setAttribute('aria-disabled', 'true');
    }

    const media = document.createElement('span');
    media.className = 'product-media';
    const image = document.createElement('img');
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = '';
    image.addEventListener('error', () => {
      media.classList.add('product-media--placeholder');
      media.replaceChildren(makeImagePlaceholder());
    }, { once: true });
    media.append(image);

    const numeral = document.createElement('span');
    numeral.className = 'product-cabinet-index';
    numeral.setAttribute('aria-hidden', 'true');
    media.append(numeral);

    const info = document.createElement('span');
    info.className = 'product-card-info';
    const handle = document.createElement('span');
    handle.className = 'product-drawer-handle';
    handle.setAttribute('aria-hidden', 'true');

    const plaque = document.createElement('span');
    plaque.className = 'product-plaque';
    const nameBlock = document.createElement('span');
    nameBlock.className = 'product-name-block';
    const primary = document.createElement('span');
    primary.className = 'product-name-primary';
    const secondary = document.createElement('span');
    secondary.className = 'product-name-secondary';
    plaque.append(primary);
    nameBlock.append(plaque, secondary);

    const price = document.createElement('span');
    price.className = 'product-price';
    info.append(handle, nameBlock, price);
    link.append(media, info);
    card.append(link);
    grid.append(card);
    card._product = product;
    card._elements = { link, media, image, numeral, plaque, primary, secondary, price };
    return card;
  });

  const smallChineseNumerals = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  function chineseNumeral(value) {
    if (value <= 9) return smallChineseNumerals[value - 1] || '拾';
    if (value === 10) return '拾';
    if (value < 20) return `拾${smallChineseNumerals[value % 10 - 1]}`;
    const tens = Math.floor(value / 10);
    const remainder = value % 10;
    return `${smallChineseNumerals[tens - 1] || '拾'}拾${remainder ? smallChineseNumerals[remainder - 1] : ''}`;
  }

  function makeImagePlaceholder() {
    const placeholder = document.createElement('span');
    placeholder.className = 'product-image-placeholder';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-leaf';
    icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = currentLanguage === 'zh' ? '产品图片即将推出' : 'Product image coming soon';
    placeholder.append(icon, label);
    return placeholder;
  }

  function categoryFromHash() {
    const slug = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
    return categoryById.has(slug) ? slug : null;
  }

  function updateCategoryButtons() {
    filters.forEach((button) => {
      const category = categoryById.get(button.dataset.categoryFilter);
      const selected = category?.id === activeCategory;
      button.textContent = category ? category[currentLanguage] : '';
      button.classList.toggle('is-active', Boolean(selected));
      button.setAttribute('aria-pressed', String(Boolean(selected)));
      button.setAttribute('aria-label', currentLanguage === 'zh'
        ? `筛选类别：${category?.zh || ''}`
        : `Filter category: ${category?.en || ''}`);
    });
  }

  function updateProductNames(card) {
    const { link, image, plaque, primary, secondary } = card._elements;
    const product = card._product;
    const isChinese = currentLanguage === 'zh';
    const isLongEnglishName = !isChinese && product.name.length >= 20;
    primary.textContent = isChinese ? product.chineseName : product.name;
    primary.lang = isChinese ? 'zh-Hans' : 'en';
    primary.classList.toggle('product-name-primary--long', isLongEnglishName);
    plaque.classList.toggle('product-plaque--long', isLongEnglishName);
    secondary.textContent = isChinese ? product.name : product.chineseName;
    secondary.lang = isChinese ? 'en' : 'zh-Hans';
    if (product.detailEnabled) {
      link.setAttribute('aria-label', isChinese
        ? `查看产品：${product.chineseName}（${product.name}）`
        : `View product: ${product.name} (${product.chineseName})`);
    } else {
      link.setAttribute('aria-label', isChinese
        ? `${product.chineseName}（${product.name}），产品详情尚未开放`
        : `${product.name} (${product.chineseName}), product details are not available yet`);
    }
    image.alt = isChinese
      ? `${product.chineseName}（${product.name}）产品包装`
      : `${product.name} product packaging`;
  }

  function updateLanguage(language) {
    currentLanguage = language === 'zh' ? 'zh' : 'en';
    updateCategoryButtons();
    if (sortLabel) sortLabel.textContent = currentLanguage === 'zh' ? '排序方式' : 'Sort by';
    [...sortSelect.options].forEach((option) => {
      option.textContent = option.dataset[currentLanguage] || option.textContent;
    });
    if (searchInput) {
      searchInput.placeholder = currentLanguage === 'zh' ? '搜索产品名称' : 'Search products';
      searchInput.setAttribute('aria-label', currentLanguage === 'zh' ? '搜索产品名称' : 'Search product names');
    }
    if (searchToggle) searchToggle.setAttribute('aria-label', currentLanguage === 'zh' ? '搜索产品' : 'Search products');
    viewButtons.forEach((button) => {
      button.setAttribute('aria-label', currentLanguage === 'zh'
        ? (button.dataset.productView === 'grid' ? '网格视图' : '列表视图')
        : (button.dataset.productView === 'grid' ? 'Grid view' : 'List view'));
    });
    cards.forEach(updateProductNames);
    grid.querySelectorAll('.product-image-placeholder span').forEach((label) => {
      label.textContent = currentLanguage === 'zh' ? '产品图片即将推出' : 'Product image coming soon';
    });
    renderProducts();
  }

  function sortCards() {
    const sortMode = sortSelect.value;
    const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
    const firstWord = (text) => text.trim().split(/\s+/u)[0] || '';
    return [...cards].sort((a, b) => {
      const productA = a._product;
      const productB = b._product;
      const baseOrder = Number(a.dataset.defaultOrder) - Number(b.dataset.defaultOrder);
      if (sortMode === 'name-asc' || sortMode === 'name-desc') {
        const direction = sortMode === 'name-asc' ? 1 : -1;
        return direction * (collator.compare(firstWord(productA.name), firstWord(productB.name)) || collator.compare(productA.name, productB.name)) || baseOrder;
      }
      if (sortMode === 'price-asc' || sortMode === 'price-desc') {
        if (productA.price == null && productB.price == null) return baseOrder;
        if (productA.price == null) return 1;
        if (productB.price == null) return -1;
        const direction = sortMode === 'price-asc' ? 1 : -1;
        return direction * (productA.price - productB.price) || baseOrder;
      }
      return baseOrder;
    });
  }

  function reorderExistingCards(ordered) {
    const current = [...grid.children];
    if (current.length === ordered.length && current.every((node, index) => node === ordered[index])) return;
    const move = typeof grid.moveBefore === 'function'
      ? (node) => grid.moveBefore(node, null)
      : (node) => grid.append(node);
    ordered.forEach(move);
  }

  function announceResult(visibleCount) {
    if (!status) return;
    if (activeCategory) {
      const category = categoryById.get(activeCategory);
      status.textContent = currentLanguage === 'zh'
        ? `${category.zh}：${visibleCount} 款产品。`
        : `${visibleCount} products in ${category.en}.`;
      return;
    }
    const selectedSort = sortSelect.selectedOptions[0]?.textContent || '';
    status.textContent = currentLanguage === 'zh'
      ? `排序：${selectedSort}，${visibleCount} 款产品。`
      : `Sorted by ${selectedSort}, ${visibleCount} products.`;
  }

  function renderProducts(announce = false) {
    updateCategoryButtons();
    const query = (searchInput?.value || '').trim().toLocaleLowerCase();
    const ordered = sortCards();
    let visibleIndex = 0;
    ordered.forEach((card) => {
      const product = card._product;
      const belongsToCategory = !activeCategory || product.categories.includes(activeCategory);
      const matchesSearch = !query || `${product.name} ${product.chineseName}`.toLocaleLowerCase().includes(query);
      const visible = belongsToCategory && matchesSearch;
      card.hidden = !visible;
      if (visible) {
        visibleIndex += 1;
        const { image, numeral, price } = card._elements;
        const categoryImage = activeCategory && product.imagesByCategory[activeCategory];
        const imagePath = categoryImage || product.image;
        if (image.dataset.currentPath !== imagePath) {
          image.dataset.currentPath = imagePath;
          image.src = encodeURI(imagePath);
          card._elements.media.classList.remove('product-media--placeholder');
        }
        numeral.textContent = chineseNumeral(visibleIndex);
        price.textContent = product.price == null
          ? (product.detailEnabled ? (currentLanguage === 'zh' ? '价格未列明' : 'Price not listed') : '')
          : `RM ${product.price}`;
        price.hidden = !product.detailEnabled && product.price == null;
      }
    });
    reorderExistingCards(ordered);
    const visibleCount = ordered.filter((card) => !card.hidden).length;
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
      emptyState.textContent = currentLanguage === 'zh' ? '没有符合条件的产品。' : 'No products match this selection.';
    }
    if (announce) announceResult(visibleCount);
    grid.setAttribute('aria-busy', 'false');
  }

  function setCategory(category, updateUrl = true) {
    activeCategory = activeCategory === category ? null : category;
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.hash = activeCategory || '';
      window.history.replaceState(null, '', url);
    }
    renderProducts(true);
  }

  function setSearchOpen(isOpen, restoreToggleFocus = false) {
    if (!search || !searchInput || !searchToggle) return;
    window.clearTimeout(searchClearTimer);
    if (isOpen) {
      window.clearTimeout(searchToolbarTimer);
      search.classList.add('is-open');
      toolbar?.classList.add('product-toolbar--search-open');
      searchToggle.setAttribute('aria-expanded', 'true');
      searchInput.tabIndex = 0;
      searchInput.focus({ preventScroll: true });
      return;
    }

    search.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.tabIndex = -1;
    if (document.activeElement === searchInput) searchInput.blur();
    if (restoreToggleFocus) searchToggle.focus({ preventScroll: true });
    window.clearTimeout(searchToolbarTimer);
    searchToolbarTimer = window.setTimeout(() => {
      toolbar?.classList.remove('product-toolbar--search-open');
    }, 350);
  }

  filters.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.categoryFilter)));
  sortSelect.addEventListener('change', () => renderProducts(true));
  searchInput?.addEventListener('input', () => {
    if (searchInput.value.length === 0 && search?.classList.contains('is-open')) {
      window.clearTimeout(searchClearTimer);
      searchClearTimer = window.setTimeout(() => {
        if (searchInput.value.length === 0) setSearchOpen(false, true);
      }, 150);
    } else {
      window.clearTimeout(searchClearTimer);
    }
    renderProducts();
  });
  searchInput?.addEventListener('blur', () => {
    window.setTimeout(() => {
      if (searchInput.value.length === 0 && search?.classList.contains('is-open') && !search.contains(document.activeElement)) {
        setSearchOpen(false);
      }
    }, 0);
  });
  searchToggle?.addEventListener('click', () => {
    setSearchOpen(!search?.classList.contains('is-open'), true);
  });
  viewButtons.forEach((button) => button.addEventListener('click', () => {
    const view = button.dataset.productView;
    grid.classList.toggle('is-list-view', view === 'list');
    viewButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  }));
  window.addEventListener('hashchange', () => {
    activeCategory = categoryFromHash();
    renderProducts();
  });
  window.addEventListener('herb-language-change', (event) => updateLanguage(event.detail?.language));

  activeCategory = categoryFromHash();
  cards.forEach(updateProductNames);
  renderProducts();
})();

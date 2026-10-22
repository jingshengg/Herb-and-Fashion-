(() => {
  const products = window.herbProductCatalogue || [];
  const grid = document.querySelector('[data-product-grid]');
  const count = document.querySelector('[data-product-count]');
  const emptyState = document.querySelector('[data-product-empty]');
  const sortSelect = document.querySelector('#product-sort');
  if (!grid || !count || !sortSelect || !products.length) return;

  const filters = [...document.querySelectorAll('[data-category-filter]')];
  const viewButtons = [...document.querySelectorAll('[data-product-view]')];
  const categoryLabels = new Map([
    ['heart-circulation', { en: 'Heart & Circulation', zh: '心血管养护' }],
    ['bones-joints', { en: 'Bones & Joints', zh: '骨骼与关节' }],
    ['sleep-stress', { en: 'Sleep & Stress', zh: '助眠与解压' }],
    ['daily-vitality', { en: 'Daily Vitality', zh: '日常滋补' }]
  ]);
  const englishFilterMarkup = new Map(filters.map((button) => [button.dataset.categoryFilter, button.innerHTML]));
  let currentLanguage = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const productCards = products.map((product, index) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.dataset.category = product.category;
    card.dataset.defaultOrder = String(index);
    card.dataset.price = String(product.price);

    const link = document.createElement('a');
    link.className = 'product-card-link';
    link.href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
    link.setAttribute('aria-label', `${product.name}, ${product.chineseName}, RM ${product.price}`);

    const media = document.createElement('span');
    media.className = `product-media${product.image ? '' : ' product-media--placeholder'}`;
    if (product.image) {
      const image = document.createElement('img');
      image.src = encodeURI(product.image);
      image.alt = currentLanguage === 'zh'
        ? `${product.chineseName}（${product.name}）产品包装`
        : `${product.name} product packaging`;
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        media.classList.add('product-media--placeholder');
        media.replaceChildren(makeImagePlaceholder());
      }, { once: true });
      media.append(image);
    } else {
      media.append(makeImagePlaceholder());
    }

    const info = document.createElement('span');
    info.className = 'product-card-info';
    const name = document.createElement('span');
    name.className = 'product-name';
    const englishName = document.createElement('span');
    englishName.className = 'product-name-en';
    englishName.lang = 'en';
    englishName.textContent = product.name;
    const chineseName = document.createElement('span');
    chineseName.className = 'product-name-zh';
    chineseName.lang = 'zh-Hans';
    chineseName.textContent = product.chineseName;
    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = `RM ${product.price}`;
    name.append(englishName, chineseName);
    card._productNameElements = { englishName, chineseName };
    info.append(name, price);
    link.append(media, info);
    card.append(link);
    grid.append(card);
    return card;
  });

  function makeImagePlaceholder() {
    const placeholder = document.createElement('span');
    placeholder.className = 'product-image-placeholder';
    placeholder.innerHTML = `<i class="fa-solid fa-leaf" aria-hidden="true"></i><span>${currentLanguage === 'zh' ? '产品图片即将推出' : 'Product image coming soon'}</span>`;
    return placeholder;
  }

  let activeCategory = null;

  const categoryFromHash = () => {
    const slug = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
    return categoryLabels.has(slug) ? slug : null;
  };

  function updateLanguage(language) {
    currentLanguage = language === 'zh' ? 'zh' : 'en';
    filters.forEach((button) => {
      const category = categoryLabels.get(button.dataset.categoryFilter);
      if (currentLanguage === 'zh') button.textContent = category.zh;
      else button.innerHTML = englishFilterMarkup.get(button.dataset.categoryFilter);
    });
    productCards.forEach((card) => {
      const product = products[Number(card.dataset.defaultOrder)];
      const { englishName, chineseName } = card._productNameElements;
      const orderedNames = currentLanguage === 'zh' ? [chineseName, englishName] : [englishName, chineseName];
      card.querySelector('.product-name').replaceChildren(...orderedNames);
      card.querySelector('.product-card-link').setAttribute('aria-label', currentLanguage === 'zh'
        ? `产品：${product.chineseName}（${product.name}），价格 RM ${product.price}`
        : `${product.name}, ${product.chineseName}, RM ${product.price}`);
      const image = card.querySelector('.product-media img');
      if (image) {
        image.alt = currentLanguage === 'zh'
          ? `${product.chineseName}（${product.name}）产品包装`
          : `${product.name} product packaging`;
      }
    });
    grid.querySelectorAll('.product-image-placeholder span').forEach((label) => {
      label.textContent = currentLanguage === 'zh' ? '产品图片即将推出' : 'Product image coming soon';
    });
    renderProducts();
  }

  function updateCategoryButtons() {
    filters.forEach((button) => {
      const selected = button.dataset.categoryFilter === activeCategory;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function sortCards() {
    const sortMode = sortSelect.value;
    const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
    const firstWord = (text) => text.trim().split(/\s+/u)[0] || '';
    const ordered = [...productCards].sort((a, b) => {
      if (sortMode === 'name-asc' || sortMode === 'name-desc') {
        const aName = products[Number(a.dataset.defaultOrder)].name;
        const bName = products[Number(b.dataset.defaultOrder)].name;
        const direction = sortMode === 'name-asc' ? 1 : -1;
        return direction * (collator.compare(firstWord(aName), firstWord(bName)) || collator.compare(aName, bName));
      }
      if (sortMode === 'price-asc' || sortMode === 'price-desc') {
        const direction = sortMode === 'price-asc' ? 1 : -1;
        return direction * (Number(a.dataset.price) - Number(b.dataset.price)) || Number(a.dataset.defaultOrder) - Number(b.dataset.defaultOrder);
      }
      return Number(a.dataset.defaultOrder) - Number(b.dataset.defaultOrder);
    });
    grid.append(...ordered);
  }

  function renderProducts() {
    updateCategoryButtons();
    sortCards();
    let visibleCount = 0;
    productCards.forEach((card) => {
      const isVisible = !activeCategory || card.dataset.category === activeCategory;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (currentLanguage === 'zh') {
      count.textContent = activeCategory
        ? `显示${categoryLabels.get(activeCategory).zh}：${visibleCount}款产品`
        : `显示全部${visibleCount}款产品`;
    } else {
      count.textContent = activeCategory
        ? `Showing ${visibleCount} ${visibleCount === 1 ? 'product' : 'products'} in ${categoryLabels.get(activeCategory).en}`
        : `Showing all ${visibleCount} products`;
    }
    if (emptyState) emptyState.hidden = visibleCount !== 0;
    grid.setAttribute('aria-busy', 'false');
  }

  function setCategory(category, updateUrl = true) {
    activeCategory = activeCategory === category ? null : category;
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.hash = activeCategory || '';
      window.history.replaceState(null, '', url);
    }
    renderProducts();
  }

  filters.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.categoryFilter)));
  sortSelect.addEventListener('change', renderProducts);
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
  renderProducts();
})();

(() => {
  const root = document.querySelector('[data-product-detail]');
  if (!root) return;

  const itemId = new URLSearchParams(window.location.search).get('id');
  const product = (window.herbProductCatalogue || []).find((item) => item.id === itemId);
  if (!product) {
    root.innerHTML = '<p class="eyebrow">PRODUCT INFORMATION</p><h1>Product not found</h1><p>Please return to the catalogue to choose a product.</p><a class="button button-primary" href="products.html">View Featured Products <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>';
    return;
  }

  const productDetails = (window.herbProductDetails || {})[product.id] || {};
  const missingInfo = [
    'Product details were not provided in the supplied product list.',
    '所提供的产品资料中未列出相关详情。'
  ];

  const media = document.createElement('div');
  media.className = `product-detail-media${product.image ? '' : ' product-media--placeholder'}`;
  if (product.image) {
    const image = document.createElement('img');
    image.src = encodeURI(product.image);
    image.alt = `${product.name} product packaging`;
    image.addEventListener('error', () => {
      media.classList.add('product-media--placeholder');
      media.replaceChildren(makeImagePlaceholder());
    }, { once: true });
    media.append(image);
  } else {
    media.append(makeImagePlaceholder());
  }

  const copy = document.createElement('div');
  copy.className = 'product-detail-copy';

  const category = document.createElement('p');
  category.className = 'eyebrow';
  setTextWithPlainAmpersands(category, product.categoryName);

  const title = document.createElement('h1');
  title.textContent = product.name;

  const chineseName = document.createElement('p');
  chineseName.className = 'product-detail-chinese';
  chineseName.lang = 'zh-Hans';
  chineseName.textContent = product.chineseName;

  const price = document.createElement('p');
  price.className = 'product-detail-price';
  price.textContent = `RM ${product.price}`;

  const functionSection = document.createElement('section');
  functionSection.className = 'product-detail-function';
  const functionTitle = document.createElement('h2');
  functionTitle.className = 'product-detail-section-title';
  functionTitle.textContent = 'Function';
  const functionContent = document.createElement('div');
  functionContent.className = 'product-bilingual-content';
  renderBilingualEntries(functionContent, productDetails.function);
  functionSection.append(functionTitle, functionContent);

  const accordions = document.createElement('div');
  accordions.className = 'product-detail-accordions';
  accordions.setAttribute('aria-label', 'More product information');
  accordions.append(
    makeDisclosure(product, 'ingredients', 'Ingredients', productDetails.ingredients),
    makeDisclosure(product, 'dosage', 'Dosage', productDetails.dosage),
    makeDisclosure(product, 'additional', 'Additional Information', productDetails.additional)
  );

  copy.append(category, title, chineseName, price, functionSection, accordions);
  root.append(media, copy);

  function makeDisclosure(item, key, label, lines) {
    const details = document.createElement('details');
    details.className = 'product-accordion';

    const summary = document.createElement('summary');
    summary.textContent = label;
    summary.setAttribute('aria-controls', `product-${item.id}-${key}`);

    const panel = document.createElement('div');
    panel.className = 'product-accordion-panel product-bilingual-content';
    panel.id = `product-${item.id}-${key}`;
    renderBilingualEntries(panel, lines);

    details.append(summary, panel);
    return details;
  }

  function renderBilingualEntries(container, sourceLines) {
    const lines = Array.isArray(sourceLines) && sourceLines.length ? sourceLines : missingInfo;
    const entries = pairAdjacentLanguageLines(lines);

    entries.forEach(({ en, zh }) => {
      if (!en && !zh) return;
      const entry = document.createElement('div');
      entry.className = 'product-bilingual-entry';

      if (en) {
        const english = document.createElement('p');
        english.className = 'product-bilingual-en';
        setTextWithPlainAmpersands(english, en);
        entry.append(english);
      }

      if (zh) {
        const chinese = document.createElement('p');
        chinese.className = 'product-bilingual-zh';
        chinese.lang = 'zh-Hans';
        chinese.textContent = zh;
        entry.append(chinese);
      }

      container.append(entry);
    });
  }

  function pairAdjacentLanguageLines(lines) {
    const entries = [];
    for (let index = 0; index < lines.length; index += 1) {
      const entry = splitBilingualLine(lines[index]);
      if (entry.en && !entry.zh && index + 1 < lines.length) {
        const next = splitBilingualLine(lines[index + 1]);
        if (!next.en && next.zh) {
          entry.zh = next.zh;
          index += 1;
        }
      }
      entries.push(entry);
    }
    return entries;
  }

  function splitBilingualLine(value) {
    const source = String(value || '').trim();
    const firstChineseIndex = source.search(/\p{Script=Han}/u);
    if (firstChineseIndex < 0) return { en: source, zh: '' };

    let en = source.slice(0, firstChineseIndex).replace(/\s+/g, ' ').trim();
    const zh = source.slice(firstChineseIndex).trim();
    const trailingAmount = zh.match(/(\d+(?:\.\d+)?\s*mg)\s*$/i)?.[1];
    if (trailingAmount) {
      const existingAmounts = [...en.matchAll(/\d+(?:\.\d+)?\s*mg/gi)]
        .map((match) => match[0].replace(/\s+/g, '').toLowerCase());
      if (!existingAmounts.includes(trailingAmount.replace(/\s+/g, '').toLowerCase())) {
        en = `${en}${en ? ' — ' : ''}${trailingAmount}`;
      }
    }
    return { en, zh };
  }

  function setTextWithPlainAmpersands(element, value) {
    const parts = String(value || '').split('&');
    parts.forEach((part, index) => {
      if (index) {
        const ampersand = document.createElement('span');
        ampersand.className = 'plain-amp';
        ampersand.textContent = '&';
        element.append(ampersand);
      }
      if (part) element.append(document.createTextNode(part));
    });
  }

  function makeImagePlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'product-image-placeholder';
    placeholder.innerHTML = '<i class="fa-solid fa-leaf" aria-hidden="true"></i><span>Product image coming soon</span>';
    return placeholder;
  }
})();

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
  const categoryLabels = {
    'heart-circulation': { en: 'Heart & Circulation', zh: '心血管养护' },
    'bones-joints': { en: 'Bones & Joints', zh: '骨骼与关节' },
    'sleep-stress': { en: 'Sleep & Stress', zh: '助眠与解压' },
    'daily-vitality': { en: 'Daily Vitality', zh: '日常滋补' }
  };
  const labels = {
    en: { function: 'Function', ingredients: 'Ingredients', dosage: 'Dosage', additional: 'Additional Information', licence: 'Product registration no.', more: 'More product information', number: 'No.', ingredient: 'Ingredient', amount: 'Amount' },
    zh: { function: '产品功能', ingredients: '成分', dosage: '用法用量', additional: '其他信息', licence: '产品注册编号', more: '更多产品信息', number: '序号', ingredient: '成分', amount: '含量' }
  };
  let currentLanguage = document.documentElement.dataset.language === 'zh' || document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';

  const media = document.createElement('div');
  media.className = `product-detail-media${product.image ? '' : ' product-media--placeholder'}`;
  media.dataset.category = product.category;
  media.dataset.productId = product.id;
  let detailImage;
  if (product.image) {
    detailImage = document.createElement('img');
    detailImage.src = encodeURI(product.image);
    detailImage.alt = `${product.name} product packaging`;
    detailImage.loading = 'eager';
    detailImage.addEventListener('error', () => {
      media.classList.add('product-media--placeholder');
      media.replaceChildren(makeImagePlaceholder());
    }, { once: true });
    media.append(detailImage);
  } else {
    media.append(makeImagePlaceholder());
  }

  const copy = document.createElement('div');
  copy.className = 'product-detail-copy';

  const category = document.createElement('p');
  category.className = 'eyebrow';
  const title = document.createElement('h1');
  const secondaryName = document.createElement('p');
  secondaryName.className = 'product-detail-chinese product-detail-secondary-name';
  const license = document.createElement('p');
  license.className = 'product-detail-license';
  license.textContent = product.license || '—';

  const price = document.createElement('p');
  price.className = 'product-detail-price';
  price.textContent = `RM ${product.price}`;

  const functionSection = document.createElement('section');
  functionSection.className = 'product-detail-function';
  const functionTitle = document.createElement('h2');
  functionTitle.className = 'product-detail-section-title';
  const functionContent = document.createElement('div');
  functionContent.className = 'product-bilingual-content';
  functionSection.append(functionTitle, functionContent);

  const accordions = document.createElement('div');
  accordions.className = 'product-detail-accordions';
  accordions.setAttribute('aria-label', 'More product information');
  const accordionSections = [
    makeDisclosure('ingredients', productDetails.ingredients),
    makeDisclosure('dosage', productDetails.dosage),
    makeDisclosure('additional', productDetails.additional)
  ];
  accordions.append(...accordionSections.map(({ details }) => details));

  copy.append(category, title, secondaryName, license, price, functionSection, accordions);
  root.append(media, copy);

  function makeDisclosure(key, lines) {
    const details = document.createElement('details');
    details.className = `product-accordion product-accordion-${key}`;
    const summary = document.createElement('summary');
    summary.setAttribute('aria-controls', `product-${product.id}-${key}`);
    const panel = document.createElement('div');
    panel.className = `product-accordion-panel product-bilingual-content${key === 'ingredients' ? ' product-ingredients-content' : ''}`;
    panel.id = `product-${product.id}-${key}`;
    details.append(summary, panel);
    return { details, summary, panel, key, lines };
  }

  function updateLanguage(language) {
    currentLanguage = language === 'zh' ? 'zh' : 'en';
    const copyLabels = labels[currentLanguage];
    category.textContent = categoryLabels[product.category]?.[currentLanguage] || product.categoryName;
    category.lang = currentLanguage === 'zh' ? 'zh-Hans' : 'en';
    title.textContent = currentLanguage === 'zh' ? product.chineseName : product.name;
    title.lang = currentLanguage === 'zh' ? 'zh-Hans' : 'en';
    secondaryName.textContent = currentLanguage === 'zh' ? product.name : product.chineseName;
    secondaryName.lang = currentLanguage === 'zh' ? 'en' : 'zh-Hans';
    functionTitle.textContent = copyLabels.function;
    functionContent.replaceChildren();
    renderBilingualEntries(functionContent, productDetails.function);
    accordions.setAttribute('aria-label', copyLabels.more);
    accordionSections.forEach(({ summary, panel, key, lines }) => {
      summary.textContent = copyLabels[key];
      panel.replaceChildren();
      if (key === 'ingredients') renderIngredientsTable(panel, lines, copyLabels);
      else renderBilingualEntries(panel, lines, key === 'additional');
    });
    if (detailImage) {
      detailImage.alt = currentLanguage === 'zh'
        ? `${product.chineseName}（${product.name}）产品包装`
        : `${product.name} product packaging`;
    }
  }

  function renderBilingualEntries(container, sourceLines, moveNumberToChinese = false) {
    const lines = Array.isArray(sourceLines) && sourceLines.length ? sourceLines : missingInfo;
    pairAdjacentLanguageLines(lines).forEach((sourceEntry) => {
      let { en, zh } = sourceEntry;
      if (currentLanguage === 'zh' && moveNumberToChinese) {
        const numbered = en.match(/^(\s*\d+[.)])\s*(.*)$/);
        if (numbered) {
          en = numbered[2];
          zh = `${numbered[1]} ${zh}`.trim();
        }
      }
      if (!en && !zh) return;
      const entry = document.createElement('div');
      entry.className = 'product-bilingual-entry';
      appendLanguagePair(entry, en, zh);
      container.append(entry);
    });
  }

  function renderIngredientsTable(container, sourceLines, copyLabels) {
    const lines = Array.isArray(sourceLines) && sourceLines.length ? sourceLines : missingInfo;
    const headingIndex = lines.findIndex((line) => /^\s*each\b/i.test(String(line)));
    const captionText = headingIndex >= 0 ? String(lines[headingIndex]).trim().replace(/:\s*$/, '') : '';
    const ingredientLines = lines.filter((_, index) => index !== headingIndex);
    const table = document.createElement('table');
    table.className = 'product-ingredients-table';
    table.setAttribute('aria-label', copyLabels.ingredients);
    if (captionText) {
      const caption = document.createElement('caption');
      caption.className = 'product-ingredient-caption';
      const chineseCaption = chineseIngredientHeading(captionText);
      const captionOrder = currentLanguage === 'zh'
        ? [['zh', chineseCaption], ['en', captionText]]
        : [['en', captionText], ['zh', chineseCaption]];
      captionOrder.forEach(([language, text]) => {
        if (!text) return;
        const line = document.createElement('span');
        line.className = language === 'zh' ? 'product-bilingual-zh' : 'product-bilingual-en';
        line.lang = language === 'zh' ? 'zh-Hans' : 'en';
        line.textContent = text;
        caption.append(line);
      });
      table.append(caption);
    }
    const head = document.createElement('thead');
    const headingRow = document.createElement('tr');
    [copyLabels.number, copyLabels.ingredient, copyLabels.amount].forEach((label) => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      headingRow.append(cell);
    });
    head.append(headingRow);
    const body = document.createElement('tbody');
    const entries = pairAdjacentLanguageLines(ingredientLines);
    let rowNumber = 0;
    entries.forEach(({ en, zh }) => {
      if (!en && !zh) return;
      const sourceRow = /^source\s+of\s+capsule/i.test(en) || /^胶囊来源/.test(zh);
      const row = document.createElement('tr');
      if (sourceRow) {
        const cell = document.createElement('td');
        cell.colSpan = 3;
        const wrapper = document.createElement('div');
        wrapper.className = 'product-ingredient-bilingual';
        appendLanguagePair(wrapper, en, zh);
        cell.append(wrapper);
        row.append(cell);
      } else {
        rowNumber += 1;
        const numberCell = document.createElement('td');
        numberCell.className = 'product-ingredient-number';
        numberCell.textContent = String(rowNumber);
        const ingredientCell = document.createElement('td');
        const amountCell = document.createElement('td');
        amountCell.className = 'product-ingredient-amount';
        const amountResult = removeTrailingAmount(zh, 'zh') || removeTrailingAmount(en, 'en');
        if (amountResult) {
          if (amountResult.language === 'zh') zh = amountResult.value;
          else en = amountResult.value;
          amountCell.textContent = amountResult.amount;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'product-ingredient-bilingual';
        appendLanguagePair(wrapper, en, zh);
        ingredientCell.append(wrapper);
        row.append(numberCell, ingredientCell, amountCell);
      }
      body.append(row);
    });
    table.append(head, body);
    container.append(table);
  }

  function appendLanguagePair(container, en, zh) {
    const order = currentLanguage === 'zh' ? [['zh', zh], ['en', en]] : [['en', en], ['zh', zh]];
    order.forEach(([language, text]) => {
      if (!text) return;
      const paragraph = document.createElement('p');
      paragraph.className = language === 'en' ? 'product-bilingual-en' : 'product-bilingual-zh';
      paragraph.lang = language === 'en' ? 'en' : 'zh-Hans';
      paragraph.textContent = text;
      container.append(paragraph);
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
    return {
      en: source.slice(0, firstChineseIndex).replace(/\s+/g, ' ').trim(),
      zh: source.slice(firstChineseIndex).trim()
    };
  }

  function chineseIngredientHeading(heading) {
    const match = String(heading || '').match(/^Each\s+(.*?)\s+contains:?$/i);
    if (!match) return '';
    const detail = match[1];
    const amount = detail.match(/\d+(?:\.\d+)?\s*mg/i)?.[0]?.replace(/\s+/g, '') || '';
    const milligrams = amount ? amount.replace(/mg/i, '毫克') : '';
    const softGel = /soft\s*gel/i.test(detail);
    const vegetable = /vegetable/i.test(detail);
    const unit = `${milligrams}${vegetable ? '植物' : ''}${softGel ? '软胶囊' : '胶囊'}`;
    return `每粒${unit}含有：`;
  }

  function removeTrailingAmount(value, language) {
    const match = String(value || '').match(/(\d+(?:\.\d+)?\s*mg)\s*$/i);
    if (!match) return null;
    return {
      language,
      value: String(value).slice(0, match.index).trim(),
      amount: match[1].replace(/\s+/g, '')
    };
  }

  function makeImagePlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'product-image-placeholder';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-leaf';
    icon.setAttribute('aria-hidden', 'true');
    const message = document.createElement('span');
    message.textContent = 'Product image coming soon';
    placeholder.append(icon, message);
    return placeholder;
  }

  updateLanguage(currentLanguage);
  window.addEventListener('herb-language-change', (event) => updateLanguage(event.detail?.language));
})();

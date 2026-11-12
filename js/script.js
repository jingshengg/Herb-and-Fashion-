const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.site-menu');
const header = document.querySelector('.site-header');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

const year = document.getElementById('current-year');
if (year) year.textContent = new Date().getFullYear();

// Start all service-page counters together when the dashboard enters view.
const serviceDashboard = document.querySelector('[data-service-counter-dashboard]');
const serviceCounters = [...document.querySelectorAll('[data-count-up]')];
if (serviceDashboard && serviceCounters.length) {
  const targets = serviceCounters.map((counter) => Number(counter.dataset.countUp));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasStarted = false;

  const showCount = (counter, value) => {
    const nextValue = String(value);
    if (counter.textContent === nextValue) return;
    counter.textContent = nextValue;
  };

  serviceCounters.forEach((counter) => showCount(counter, 0));

  const startServiceCounters = () => {
    if (hasStarted) return;
    hasStarted = true;
    if (reduceMotion) {
      serviceCounters.forEach((counter, index) => showCount(counter, targets[index]));
      return;
    }

    const startTime = performance.now();
    const duration = 2800;
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      serviceCounters.forEach((counter, index) => {
        const value = progress === 1 ? targets[index] : Math.floor(targets[index] * progress);
        showCount(counter, value);
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const dashboardObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startServiceCounters();
        dashboardObserver.disconnect();
      }
    }, { threshold: 0.2 });
    dashboardObserver.observe(serviceDashboard);
  } else {
    startServiceCounters();
  }
}

window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 12));

// Transparent herb crops are optional. They appear only after a valid local image has loaded.
document.querySelectorAll('.herb-object img').forEach((image) => {
  const reveal = () => image.parentElement.classList.add('is-loaded');
  if (image.complete && image.naturalWidth > 0) reveal();
  image.addEventListener('load', reveal, { once: true });
});

// Office markers support hover, keyboard focus and tap/click on touch screens.
const officeLocations = [...document.querySelectorAll('[data-location]')];
const closeOfficeLocations = (except = null) => {
  officeLocations.forEach((location) => {
    if (location === except) return;
    location.classList.remove('is-open');
    location.querySelector('.location-marker')?.setAttribute('aria-expanded', 'false');
  });
};

officeLocations.forEach((location) => {
  const marker = location.querySelector('.location-marker');
  const closeButton = location.querySelector('.location-close');
  location.addEventListener('focusin', (event) => {
    if (!event.target.matches(':focus-visible')) return;
    closeOfficeLocations(location);
    location.classList.add('is-open');
    marker?.setAttribute('aria-expanded', 'true');
  });
  location.addEventListener('focusout', (event) => {
    if (location.contains(event.relatedTarget)) return;
    location.classList.remove('is-open');
    marker?.setAttribute('aria-expanded', 'false');
  });
  marker?.addEventListener('click', (event) => {
    const isKeyboardActivation = event.detail === 0;
    const willOpen = isKeyboardActivation
      ? (marker.matches(':focus-visible') || !location.classList.contains('is-open'))
      : !location.classList.contains('is-open');
    closeOfficeLocations(location);
    location.classList.toggle('is-open', willOpen);
    marker.setAttribute('aria-expanded', String(willOpen));
  });
  closeButton?.addEventListener('click', () => {
    location.classList.remove('is-open');
    marker?.setAttribute('aria-expanded', 'false');
    document.getElementById('footprint-title')?.focus({ preventScroll: true });
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-location]')) {
    closeOfficeLocations();
    const focusedLocation = document.activeElement?.closest('[data-location]');
    if (focusedLocation) document.activeElement.blur();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeOfficeLocations();
    const focusedLocation = document.activeElement?.closest('[data-location]');
    if (focusedLocation) document.activeElement.blur();
  }
});

// Site-wide language switch. The supplied Chinese copy is used wherever it is
// available; company names, office addresses and product-description content
// are deliberately left untouched.
(() => {
  const textTranslations = new Map(Object.entries({
    'Overview': '概览',
    'About Us': '关于我们',
    'Featured Products': '精选产品',
    'Our Services': '我们的服务',
    'OUR SERVICES': '我们的服务',
    'Events': '活动',
    'EVENTS': '活动',
    'Contact Us': '联系我们',
    'Frequently Asked Questions': '常见问题',
    'Herb & Fashion Malaysia': '马来西亚草本时尚',
    'Empowered by natural botanicals, ancient Eastern culture reclaims its place on the modern stage, radiating timeless style once again.': '在天然植物成分的赋能下，古老的东方文化重返现代舞台，再次绽放永恒的魅力。',
    'Get to Know Us': '认识我们',
    'Combining scientific formulations with trustworthy herbal ingredients, our products deliver high-quality manufacturing that strictly meets regulatory requirements for your peace of mind.': '我们的产品将科学配方与值得信赖的草本成分相结合，采用高品质的生产工艺，严格符合监管要求，让您高枕无忧。',
    'Heart & Circulation': '心血管养护',
    'Bones & Joints': '骨骼与关节',
    'Sleep & Stress': '助眠与解压',
    'Daily Vitality': '日常滋补',
    'Learn More': '了解更多',
    'End-to-End OEM & ODM Production': '端到端OEM与ODM生产',
    'Singapore Certifications & Declarations': '新加坡认证与声明',
    'Compliant Export & Global Logistics': '合规出口与全球物流',
    'Regulatory Compliance & Assurance': '法规合规与保障',
    'Singapore-Origin R&D & Production': '新加坡原产研发与制造',
    'Strict GMP Manufacturing Standards': '严格的GMP生产标准',
    'MAL Certification & Compliance': 'MAL认证与法规合规',
    'Dynamic Branding & Marketing': '品牌打造与市场营销',
    'Our products are proudly researched and manufactured in Singapore. We expertly integrate traditional herbal wisdom into innovative compound formulas designed to address the specific health needs of modern consumers.': '我们的产品均在新加坡引以为傲地进行研发与生产。我们将传统草药智慧与现代科技相融合，致力于将传统草药理念开发出符合现代人健康痛点的创新复合配方。',
    'All our products are manufactured under rigorous Good Manufacturing Practice (GMP) standards. This ensures the highest level of safety, efficacy, and consistent quality control throughout the entire production process.': '我们所有的产品均在严苛的良好生产规范（GMP）标准下制造。这确保了产品在生产全过程中的安全性、有效性和质量可控性，为您提供最高标准的品质保障。',
    "We strictly adhere to Malaysia's MAL product certification rules. This unwavering commitment supports full compliance with health authority standards, facilitating efficient product registration and ensuring absolute market readiness.": '我们严格遵守马来西亚的MAL产品认证法规。这项承诺确保了我们的产品完全符合当地卫生局的标准，从而促进高效的产品注册流程并保障其顺利进入市场。',
    "We demystify Traditional Chinese Medicine for modern audiences through compelling storytelling. Supported by a robust omni-channel distribution network and consumer education, we effectively connect premium health solutions with today's consumers.": '我们通过引人入胜的品牌故事，将深奥的传统中医概念转化为现代受众易于共鸣和理解的语言。依托强大的全渠道分销网络与消费者教育，我们有效地将优质健康解决方案与当今消费者连接起来。',
    'Our Offices': '我们的公司',
    'Our Partners': '我们的合作伙伴',
    'Select your region to find retailers and pharmacies carrying our products.': '请选择您所在的地区，查看有售本公司产品的零售商与药剂行。',
    'Klang Valley': '巴生谷',
    'Johor': '柔佛',
    'Sarawak': '砂拉越',
    'Coming Soon': '即将推出',
    'Partner Information': '合作伙伴信息',
    'Back to Our Partners': '返回合作伙伴列表',
    'Branch': '分行',
    'Address': '地址',
    'Operating Hours': '营业时间',
    'Contact': '联系电话',
    'Partner information will be available soon.': '合作伙伴资料将于稍后提供。',
    'Johor Office': '柔佛分行',
    'Selangor Office': '雪兰莪分行',
    'Sarawak Office': '砂拉越分行',
    'Follow Us': '关注我们',
    'Enquiry Form': '联系我们',
    'Name': '姓名',
    'First Name': '名字',
    'Last Name': '姓氏',
    'Company Name': '公司名称',
    'Contact Number': '联系电话',
    'Email': '电子邮箱',
    'Message': '留言内容',
    'Send Enquiry': '提交咨询',
    'The Power of Herbs, The Beauty of Traditional Chinese Medicine.': '以草本之力，还中医之美',
    'Herb & Fashion Sdn. Bhd. is a dedicated distributor of premium health and wellness solutions, expanded from its parent company in Singapore. Founded in Singapore in 2005, the brand has built a trusted reputation in modern health supplementation and traditional herbal wisdom. To meet growing regional demand, the company officially expanded to Malaysia in 2011, establishing Herb & Fashion Sdn. Bhd. to bring high-quality health solutions to the local market.': 'Herb & Fashion Sdn. Bhd. 是专注于分销高端健康与养生解决方案的专业企业，由其新加坡母公司拓展而来。该品牌于2005年在新加坡创立，在现代健康补充剂和传统草本智慧领域建立了值得信赖的声誉。为满足日益增长的区域需求，公司于2011年正式进军马来西亚市场，成立了Herb & Fashion Sdn. Bhd.，旨在为当地带来高品质的健康解决方案。',
    'With the brand\'s production infrastructure anchored in Singapore, the Malaysian company functions as a dedicated distribution, business development, and regulatory pipeline. It operates as the sole importer and distributor of the premium herbal formulations and Traditional Chinese Medicine (TCM) nutrition products produced by its parent manufacturing wing. All products distributed by the Malaysian entity are actively manufactured under strict Good Manufacturing Practice (GMP) standards in Singapore.': '该品牌的生产基础设施以新加坡为基地，而这家马来西亚公司则专门负责分销、业务拓展及监管事务。该公司是其母公司生产的高端草本制剂和中医（TCM）营养产品的唯一进口商和分销商。该马来西亚实体分销的所有产品均严格遵循新加坡的《良好生产规范》（GMP）标准进行生产。',
    'To make these trusted formulations highly accessible, Herb & Fashion Sdn. Bhd. has strategically grown its local footprint. The company\'s active distribution network currently covers key regions including Johor and Kuala Lumpur, and has recently expanded its reach to Sarawak. Through this ongoing domestic growth, Herb & Fashion Sdn. Bhd. aims to provide better services, efficient product delivery, and dedicated health support to customers and practitioners across Malaysia.': '为了让这些值得信赖的产品配方更易于获取，Herb & Fashion Sdn. Bhd. 通过战略布局扩大了其在当地的市场覆盖范围。该公司活跃的分销网络目前覆盖了柔佛和吉隆坡等主要地区，并最近将业务范围扩展至砂拉越。通过这一持续的国内业务扩张，Herb & Fashion Sdn. Bhd. 致力于为马来西亚各地的客户和从业者提供更优质的服务、高效的产品配送以及专业的健康支持。',
    'OUR DIRECTION': '我们的方向',
    'What guides us': '指引我们的理念',
    'Mission': '使命',
    'To be the best Chinese medicine & nutrition health supplement product manufacturer in Southeast Asia.': '成为东南亚地区最优秀的中药及营养保健品制造商。',
    'Vision': '愿景',
    'To promote the use of high-quality Chinese medicine & nutrition products for better health.': '推广优质中药及营养产品的使用，以促进公众健康。',
    'Core Values': '核心价值观',
    'Rooted in conscience, honesty, and integrity, our commitment extends beyond quality medicinal products to delivering truthful, evidence-based health guidance that serves public well-being over short-term trends across all operations.': '我们以良知、诚实和正直为根基，不仅致力于提供优质的医药产品，更在所有运营环节中，超越短期潮流，致力于提供真实、基于科学证据的健康指导，以服务公众福祉。',
    'Our footprint': '我们的足迹',
    'Our offices serve key markets across Singapore and Malaysia.': '我们公司致力于服务新加坡和马来西亚的主要市场。',
    'MALAYSIA · SELANGOR': '马来西亚 · 雪兰莪',
    'MALAYSIA · JOHOR': '马来西亚 · 柔佛',
    'SINGAPORE': '新加坡',
    'MALAYSIA · SARAWAK': '马来西亚 · 砂拉越',
    'Cheras': '蕉赖',
    'Selangor': '雪兰莪',
    'Johor Bahru': '柔佛新山',
    'Singapore': '新加坡',
    'Kuching': '古晋',
    'OUR CAPABILITIES': '我们的能力',
    'Why Choose Us': '为何选择我们',
    'Specially Formulated TCM Blends': '特调中医复合配方',
    'Winner of Singapore & Regional Benchmark Brand Awards': '荣获新加坡及区域标杆品牌大奖',
    '* Recognition received by the Singapore HQ.': '* 相关奖项由新加坡总部获得。',
    'Specially formulated Traditional Chinese Medicine blends.': '特调中医复合配方。',
    'Winner of Singapore and regional benchmark brand awards.': '荣获新加坡及区域标杆品牌大奖。',
    'Years of TCM Industry Experience': '年中医行业经验',
    'Guidance by Licensed Chinese Medicine Practitioners': '由持证中医师提供指导',
    'Pharmaceutical Businesses & Retailers Served': '家医药企业和零售商已获得服务',
    'More than 20 years of TCM industry experience.': '拥有20年以上中医行业经验。',
    '100 percent guidance by licensed Chinese medicine practitioners.': '100%由持证中医师提供指导。',
    'More than 500 pharmaceutical businesses and retailers served.': '已服务超过500家医药企业和零售商。',
    'We take products from concept and formulation through R&D, ingredient sourcing, and GMP-compliant production—an integrated OEM/ODM path from idea to market.': '我们从产品概念和配方设计开始，贯穿研发、原料采购及符合GMP标准的生产全过程——提供从创意到上市的一站式OEM/ODM服务。',
    'We support product registration, declarations, and certification requirements in Singapore, helping partners prepare for regulatory review and market entry.': '我们协助满足新加坡的产品注册、声明及认证要求，帮助合作伙伴做好监管审查和市场准入的准备。',
    'Our import/export consultation helps partners plan cross-border requirements and distribution for Southeast Asia and other international markets.': '我们的进出口咨询服务可协助合作伙伴规划面向东南亚及其他国际市场的跨境要求和分销方案。',
    'From formula optimization to product-registration support, we help partners assess product plans against applicable requirements and support a smoother path to market.': '从配方优化到产品注册支持，我们协助合作伙伴根据适用要求评估产品计划，并助力其更顺畅地进入市场。',
    'Gatherings, launches and conversations.': '聚会、发布会和交流活动。',
    'Event posters and photographs will be shared here. The Events page is ready for its first stories.': '活动海报和照片将在此分享。“活动”页面已准备好发布首批内容。',
    'Return to Overview': '返回概览',
    'Back to Featured Products': '返回精选产品',
    'Back to top': '返回顶部',
    'Terms and Conditions': '条款与条件',
    'Privacy Policy': '隐私政策',
    'Sort by': '排序方式',
    'Default': '默认',
    'Name (A-Z)': '名称（A-Z）',
    'Name (Z-A)': '名称（Z-A）',
    'Price (Low-High)': '价格（从低到高）',
    'Price (High-Low)': '价格（从高到低）',
    'Loading products…': '正在加载产品……',
    'No products are available in this category yet.': '此类别目前没有可显示的产品。',
    'Product image coming soon': '产品图片即将推出',
    'Product information': '产品信息',
    'PRODUCT INFORMATION': '产品信息',
    'Product not found': '找不到该产品',
    'Please return to the catalogue to choose a product.': '请返回产品目录选择产品。',
    'View Featured Products': '查看精选产品',
    'Function': '产品功能',
    'Ingredients': '成分',
    'Dosage': '用法用量',
    'Additional Information': '其他信息',
    'More product information': '更多产品信息',
    'Taking you to': '正在前往',
    'Open menu': '打开菜单',
    'Close address': '关闭地址',
    'Filter partners by region': '按地区筛选合作伙伴',
    'Partner logos': '合作伙伴标志'
  }));

  const attributeTranslations = {
    'Main navigation': '主导航',
    'Filter products by category': '按类别筛选产品',
    'Product layout': '产品显示方式',
    'Grid view': '网格视图',
    'List view': '列表视图',
    'Contact details': '联系信息',
    'Social media': '社交媒体',
    'Open menu': '打开菜单',
    'Close address': '关闭地址',
    'Map of Malaysia and Singapore with four office locations': '马来西亚和新加坡的四个办公室地点地图',
    'Selangor office address': '雪兰莪办公室地址',
    'Johor Bahru office address': '柔佛新山办公室地址',
    'Singapore office address': '新加坡办公室地址',
    'Kuching office address': '古晋办公室地址',
    'Featured Products banner': '精选产品横幅',
    'Our Services banner': '我们的服务横幅',
    'Our Services': '我们的服务',
    'Map outline of Peninsular Malaysia, Singapore and East Malaysia': '马来半岛、新加坡及东马地图轮廓',
    'Xiaohongshu': '小红书',
    'Instagram': 'Instagram',
    'Facebook': 'Facebook',
    'WhatsApp': 'WhatsApp',
    'Shopee': 'Shopee',
    'Enquiry Form': '联系我们',
    'Johor Office': '柔佛分行',
    'Selangor Office': '雪兰莪分行',
    'Sarawak Office': '砂拉越分行'
  };

  const pageTitles = {
    'index.html': 'Herb and Fashion Malaysia Official Website',
    'about.html': 'Herb and Fashion Malaysia Official Website',
    'products.html': 'Herb and Fashion Malaysia Official Website',
    'faq.html': '常见问题 | Herb and Fashion Malaysia Official Website',
    'services.html': 'Herb and Fashion Malaysia Official Website',
    'partner-details.html': '合作伙伴信息 | Herb and Fashion Malaysia Official Website',
    'events.html': 'Herb and Fashion Malaysia Official Website',
    'contact.html': 'Herb and Fashion Malaysia Official Website',
    'product-detail.html': 'Herb and Fashion Malaysia Official Website'
  };

  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const ignoredTextRegion = '.brand, .footer-wordmark, address, .language-toggle, .product-category-filters, .product-grid, .product-bilingual-content, .product-shopee-fab, .services-preview .service-item h3, [data-partner-title]';
  const translatedElements = [...document.body.querySelectorAll('*')]
    .filter((element) => !element.closest(ignoredTextRegion))
    .map((element) => ({ element, source: normalize(element.textContent) }))
    .filter(({ element, source }) => {
      if (!textTranslations.has(source) || element.querySelector(ignoredTextRegion)) return false;
      return ![...element.querySelectorAll('*')].some((child) => normalize(child.textContent) === source);
    });
  translatedElements.forEach(({ element }) => {
    element.dataset.languageOriginalHtml = element.innerHTML;
  });

  const translatedAttributes = [];
  document.body.querySelectorAll('[aria-label], [alt]').forEach((element) => {
    const attribute = element.hasAttribute('aria-label') ? 'aria-label' : 'alt';
    const original = element.getAttribute(attribute);
    if (attributeTranslations[original]) translatedAttributes.push({ element, attribute, original });
  });

  const titleElement = document.querySelector('title');
  const englishTitle = titleElement?.textContent || '';
  const pageFile = window.location.pathname.split('/').pop() || 'index.html';
  const bannerImages = [...document.querySelectorAll('[data-banner-zh]')].map((image) => ({
    image,
    englishSource: image.getAttribute('src'),
    chineseSource: image.dataset.bannerZh
  }));
  const legalLinks = [...document.querySelectorAll('[data-legal-link]')].map((link) => ({ link, english: link.dataset.pdfEn, chinese: link.dataset.pdfZh }));
  const languageButtons = [...document.querySelectorAll('[data-language-toggle]')];

  const readSavedLanguage = () => {
    try { return localStorage.getItem('herb-fashion-language') === 'zh' ? 'zh' : 'en'; }
    catch { return 'en'; }
  };

  function applyLanguage(language, animate = false) {
    const isChinese = language === 'zh';
    document.documentElement.lang = isChinese ? 'zh-Hans' : 'en';
    document.documentElement.dataset.language = language;

    translatedElements.forEach(({ element, source }) => {
      if (isChinese) {
        const decorative = [...element.querySelectorAll('[aria-hidden="true"]')];
        if (source === 'Herb & Fashion Malaysia') {
          const countryLine = document.createElement('span');
          countryLine.className = 'hero-zh-title-line';
          countryLine.textContent = '马来西亚';
          const titleLine = document.createElement('span');
          titleLine.className = 'hero-zh-title-line';
          titleLine.textContent = '草本时尚';
          element.replaceChildren(countryLine, titleLine, ...decorative);
        } else if (source.startsWith('Empowered by natural botanicals,')) {
          element.replaceChildren(
            document.createTextNode('在天然植物成分的赋能下，古老的东方文化重返现代舞台，再次绽放永恒的魅力。'),
            ...decorative
          );
        } else if (element.matches('.story-paragraph-lead')) {
          const translatedLead = textTranslations.get(source);
          const companyName = document.createElement('span');
          companyName.className = 'company-name-highlight';
          companyName.append(document.createTextNode('Herb '));
          const ampersand = document.createElement('span');
          ampersand.className = 'plain-amp';
          ampersand.textContent = '&';
          companyName.append(ampersand, document.createTextNode(' Fashion Sdn. Bhd.'));
          element.replaceChildren(companyName, document.createTextNode(translatedLead.slice('Herb & Fashion Sdn. Bhd.'.length)), ...decorative);
        } else if (element.matches('.office-entry h4')) {
          element.replaceChildren(...decorative, document.createTextNode(textTranslations.get(source)));
        } else {
          element.replaceChildren(document.createTextNode(textTranslations.get(source)), ...decorative);
        }
      } else {
        // The saved markup also restores the original Times New Roman ampersands and icons.
        if (!element.dataset.languageOriginalHtml) element.dataset.languageOriginalHtml = element.innerHTML;
        element.innerHTML = element.dataset.languageOriginalHtml;
      }
    });

    translatedAttributes.forEach(({ element, attribute, original }) => {
      element.setAttribute(attribute, isChinese ? attributeTranslations[original] : original);
    });
    document.querySelectorAll('.product-bilingual-en').forEach((paragraph) => paragraph.setAttribute('lang', 'en'));
    document.querySelectorAll('.product-bilingual-zh').forEach((paragraph) => paragraph.setAttribute('lang', 'zh-Hans'));
    const productId = new URLSearchParams(window.location.search).get('id');
    const currentProduct = (window.herbProductCatalogue || []).find((product) => product.id === productId);
    const detailImage = document.querySelector('.product-detail-media img');
    if (currentProduct && detailImage) {
      detailImage.alt = isChinese
        ? `${currentProduct.chineseName}（${currentProduct.name}）产品包装`
        : `${currentProduct.name} product packaging`;
    }

    bannerImages.forEach(({ image, englishSource, chineseSource }) => {
      image.setAttribute('src', isChinese ? chineseSource : englishSource);
    });
    legalLinks.forEach(({ link, english, chinese }) => {
      link.setAttribute('href', isChinese ? chinese : english);
    });
    if (titleElement) titleElement.textContent = isChinese ? (pageTitles[pageFile] || englishTitle) : englishTitle;

    languageButtons.forEach((button) => {
      button.classList.toggle('is-chinese', isChinese);
      button.setAttribute('aria-pressed', String(isChinese));
      button.setAttribute('aria-label', isChinese ? '切换为英文' : 'Switch language to Chinese');
      if (animate) {
        button.dataset.direction = isChinese ? 'to-chinese' : 'to-english';
        button.classList.remove('is-animating');
        void button.offsetWidth;
        button.classList.add('is-animating');
        window.setTimeout(() => button.classList.remove('is-animating'), 380);
      }
    });

    window.dispatchEvent(new CustomEvent('herb-language-change', { detail: { language } }));
  }

  languageButtons.forEach((button) => button.addEventListener('click', () => {
    const nextLanguage = document.documentElement.dataset.language === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('herb-fashion-language', nextLanguage); } catch { /* storage may be disabled */ }
    applyLanguage(nextLanguage, true);
  }));

  applyLanguage(readSavedLanguage());

})();


// Partner rail autoplays until one or more regions are selected. Filtered
// results become a static, responsive logo grid so every link stays easy to use.
const partnerCarousel = document.querySelector('[data-partner-carousel]');
if (partnerCarousel) {
  const viewport = partnerCarousel.querySelector('[data-partner-viewport]');
  const track = partnerCarousel.querySelector('[data-partner-track]');
  const items = [...track.querySelectorAll('[data-partner]')];
  const regionButtons = [...document.querySelectorAll('[data-region]')];
  const emptyState = partnerCarousel.querySelector('[data-partner-empty]');
  const visibleSlides = 5;
  const selectedRegions = new Set();
  const clones = items.slice(0, visibleSlides).map((item) => {
    const clone = item.cloneNode(true);
    clone.removeAttribute('href');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((image) => { image.alt = ''; });
    clone.setAttribute('tabindex', '-1');
    return clone;
  });
  let currentSlide = 0;
  let timer = null;
  let transitionFallback = null;

  const clearAdvanceTimer = () => {
    window.clearTimeout(timer);
    timer = null;
    window.clearTimeout(transitionFallback);
  };

  const setPosition = (animate = true) => {
    if (!animate) track.style.transition = 'none';
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const slideWidth = Math.max(0, (viewport.clientWidth - gap * (visibleSlides - 1)) / visibleSlides);
    track.style.setProperty('--partner-slide-width', `${slideWidth}px`);
    track.style.transform = `translate3d(${-currentSlide * (slideWidth + gap)}px, 0, 0)`;
    if (!animate) {
      track.getBoundingClientRect();
      track.style.removeProperty('transition');
    }
  };

  const scheduleNextSlide = () => {
    clearAdvanceTimer();
    if (document.hidden || selectedRegions.size) return;
    timer = window.setTimeout(advanceSlide, 4000);
  };

  const advanceSlide = () => {
    if (document.hidden || selectedRegions.size) return;
    currentSlide += 1;
    setPosition(true);
    let finished = false;
    const finishTransition = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(transitionFallback);
      track.removeEventListener('transitionend', onTransitionEnd);
      if (currentSlide >= items.length) {
        currentSlide = 0;
        setPosition(false);
      }
      scheduleNextSlide();
    };
    const onTransitionEnd = (event) => {
      if (event.target === track && event.propertyName === 'transform') finishTransition();
    };
    track.addEventListener('transitionend', onTransitionEnd);
    transitionFallback = window.setTimeout(finishTransition, 1300);
  };

  const render = () => {
    const filtering = selectedRegions.size > 0;
    clearAdvanceTimer();
    partnerCarousel.classList.toggle('is-filtered', filtering);
    regionButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(selectedRegions.has(button.dataset.region)));
    });

    if (filtering) {
      clones.forEach((clone) => clone.remove());
      track.style.transform = 'none';
      track.style.removeProperty('--partner-slide-width');
      items.forEach((item) => {
        const itemRegions = (item.dataset.regions || '').split(/\s+/).filter(Boolean);
        item.hidden = !itemRegions.some((region) => selectedRegions.has(region));
      });
      const hasKlangValley = selectedRegions.has('klang-valley');
      if (emptyState) {
        emptyState.hidden = !hasKlangValley;
        emptyState.textContent = document.documentElement.dataset.language === 'zh'
          ? '巴生谷合作伙伴信息即将公布。'
          : 'Klang Valley partners coming soon.';
      }
      return;
    }

    items.forEach((item) => { item.hidden = false; });
    if (emptyState) emptyState.hidden = true;
    clones.forEach((clone) => track.append(clone));
    currentSlide = 0;
    setPosition(false);
    scheduleNextSlide();
  };

  regionButtons.forEach((button) => button.addEventListener('click', () => {
    const region = button.dataset.region;
    if (selectedRegions.has(region)) selectedRegions.delete(region);
    else selectedRegions.add(region);
    render();
  }));

  setPosition(false);
  window.requestAnimationFrame(() => { setPosition(false); scheduleNextSlide(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearAdvanceTimer();
    else scheduleNextSlide();
  });
  window.addEventListener('resize', () => { if (!selectedRegions.size) setPosition(false); }, { passive: true });
  window.addEventListener('load', () => { if (!selectedRegions.size) setPosition(false); }, { once: true });
  window.addEventListener('herb-language-change', () => {
    if (selectedRegions.size && emptyState && selectedRegions.has('klang-valley')) {
      emptyState.textContent = document.documentElement.dataset.language === 'zh'
        ? '巴生谷合作伙伴信息即将公布。'
        : 'Klang Valley partners coming soon.';
    }
  });
}
// Render every visible ampersand in one consistent Times New Roman face,
// including content inserted later by product rendering and language changes.
(() => {
  const skipAmpersandWrap = 'script, style, noscript, textarea, option, svg, .ampersand-times, .plain-amp';

  function wrapAmpersandTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.nodeValue.includes('&')) return;
    if (node.parentElement?.closest(skipAmpersandWrap)) return;

    const pieces = node.nodeValue.split('&');
    const replacement = document.createDocumentFragment();
    pieces.forEach((piece, index) => {
      if (piece) replacement.append(document.createTextNode(piece));
      if (index < pieces.length - 1) {
        const ampersand = document.createElement('span');
        ampersand.className = 'ampersand-times';
        ampersand.textContent = '&';
        replacement.append(ampersand);
      }
    });
    node.replaceWith(replacement);
  }

  function wrapAmpersands(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      wrapAmpersandTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches(skipAmpersandWrap)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(wrapAmpersandTextNode);
  }

  wrapAmpersands(document.body);
  const ampersandObserver = new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => addedNodes.forEach(wrapAmpersands));
  });
  ampersandObserver.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('herb-language-change', () => wrapAmpersands(document.body));
})();

// Clear submitted form values before the browser returns to this page from Formspree.
window.addEventListener('beforeunload', () => {
  document.querySelectorAll('.enquiry-form').forEach((form) => form.reset());
});

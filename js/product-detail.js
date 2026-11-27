(() => {
  const root = document.querySelector('[data-product-detail]');
  if (!root) return;

  const products = window.herbProductCatalogue || [];
  const itemId = new URLSearchParams(window.location.search).get('id');
  const product = products.find((item) => item.id === itemId);
  const backText = document.querySelector('[data-product-back] span');
  const labels = {
    en: {
      back: 'Back to Featured Products', notFound: 'Product not found', unavailable: 'Product details are not available yet',
      price: 'Price', netQuality: 'Net Quantity', missingValue: 'Not specified in the supplied product information',
      nutrition: 'Nutrition Information', function: 'Function', dosage: 'Dosage', ingredients: 'Ingredients', additional: 'Additional Information',
      per100: 'Per 100 grams', perServing: 'Per Serving', ingredientNo: 'No.', ingredientName: 'Ingredient', amount: 'Amount', viewAll: 'View Featured Products',
    },
    zh: {
      back: '返回精选产品', notFound: '找不到产品', unavailable: '此产品的详细信息尚未开放',
      price: '价格', netQuality: '净含量', missingValue: '所提供的产品资料未列明',
      nutrition: '营养信息', function: '产品功能', dosage: '用法用量', ingredients: '成分', additional: '其他信息',
      per100: '每 100 克', perServing: '每份', ingredientNo: '序号', ingredientName: '成分', amount: '含量', viewAll: '查看精选产品',
    },
  };
  const nutritionNameZh = {
    'Energy (kJ)': '能量（千焦）',
    'Protein (g)': '蛋白质（克）',
    'Fat (g)': '脂肪（克）',
    'Carbohydrate (g)': '碳水化合物（克）',
    'Dietary Fiber (g)': '膳食纤维（克）',
    'Sodium (mg)': '钠（毫克）',
  };
  let currentLanguage = document.documentElement.dataset.language === 'zh' ||
    document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';

  function textElement(tag, className, text, language) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (language) element.lang = language;
    element.textContent = text;
    return element;
  }

  if (!product || !product.detailEnabled) {
    root.classList.add('product-detail-notice');
    const heading = textElement('h1', '', '');
    const message = textElement('p', '', '');
    const link = document.createElement('a');
    link.className = 'button button-primary';
    link.href = 'products.html';
    root.append(heading, message, link);
    const updateNotice = (language) => {
      currentLanguage = language === 'zh' ? 'zh' : 'en';
      heading.textContent = !product ? labels[currentLanguage].notFound : labels[currentLanguage].unavailable;
      message.textContent = !product
        ? (currentLanguage === 'zh' ? '请返回产品目录选择产品。' : 'Please return to the catalogue to choose a product.')
        : (currentLanguage === 'zh' ? '此产品的详细资料稍后开放。' : 'Product information will be available later.');
      link.textContent = labels[currentLanguage].viewAll;
      if (backText) backText.textContent = labels[currentLanguage].back;
    };
    updateNotice(currentLanguage);
    window.addEventListener('herb-language-change', (event) => updateNotice(event.detail?.language));
    return;
  }

  const details = (window.herbProductDetails || {})[product.id] || {};
  const isDrink = product.productType === 'drink-mix';
  const media = document.createElement('div');
  media.className = `product-detail-media${isDrink ? ' product-detail-media--drink' : ''}`;
  const image = document.createElement('img');
  image.src = encodeURI(product.image);
  image.alt = '';
  image.loading = 'eager';
  image.decoding = 'async';
  media.append(image);

  const copy = document.createElement('div');
  copy.className = `product-detail-copy product-detail-copy--${isDrink ? 'drink' : 'capsule'}`;
  const title = textElement('h1', '', '', 'en');
  const secondaryName = textElement('p', 'product-detail-secondary-name', '', 'zh-Hans');
  const meta = document.createElement('div');
  meta.className = `product-detail-meta product-detail-meta--${isDrink ? 'drink' : 'capsule'}`;
  const priceField = document.createElement('p');
  priceField.className = 'product-detail-price';
  const licenseField = document.createElement('p');
  licenseField.className = 'product-detail-license';
  const netField = document.createElement('p');
  netField.className = 'product-detail-net-quality';
  const badgeRow = document.createElement('div');
  badgeRow.className = 'product-detail-badges';
  const specificationField = document.createElement('p');
  specificationField.className = 'product-detail-specification';
  badgeRow.append(isDrink ? netField : licenseField);
  if (!isDrink) badgeRow.append(specificationField);
  meta.append(badgeRow, priceField);

  const functionSection = document.createElement('section');
  functionSection.className = 'product-detail-function';
  const functionHeading = document.createElement('h2');
  functionHeading.className = 'product-detail-section-title';
  const functionContent = document.createElement('div');
  functionContent.className = 'product-detail-function-content';
  functionSection.append(functionHeading, functionContent);

  const accordions = document.createElement('div');
  accordions.className = 'product-detail-accordions';
  const dosage = isDrink ? null : makeDisclosure('dosage');
  const nutrition = isDrink ? makeDisclosure('nutrition') : null;
  const ingredients = makeDisclosure('ingredients');
  const additional = makeDisclosure('additional');
  [dosage, nutrition, ingredients, additional].filter(Boolean).forEach(({ details: disclosure }) => accordions.append(disclosure));
  copy.append(title, secondaryName, meta);
  if (!isDrink) copy.append(functionSection);
  copy.append(accordions);
  root.append(media, copy);
  const drinkTutorial = isDrink ? createDrinkTutorial() : null;

  function makeDisclosure(key) {
    const detailsElement = document.createElement('details');
    detailsElement.className = `product-accordion product-accordion-${key}`;
    const summary = document.createElement('summary');
    const panel = document.createElement('div');
    panel.className = `product-accordion-panel product-detail-panel product-detail-panel-${key}`;
    detailsElement.append(summary, panel);
    return { details: detailsElement, summary, panel, key };
  }

  function makeLicenseShield() {
    const namespace = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(namespace, 'svg');
    icon.setAttribute('class', 'product-detail-license-icon');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const shield = document.createElementNS(namespace, 'path');
    shield.setAttribute('d', 'M12 2.5 4.5 5.3v5.3c0 5.1 3.1 8.8 7.5 10.9 4.4-2.1 7.5-5.8 7.5-10.9V5.3L12 2.5Z');
    const check = document.createElementNS(namespace, 'path');
    check.setAttribute('d', 'm8.4 12.1 2.3 2.3 4.9-5.1');
    icon.append(shield, check);
    return icon;
  }

  function formatNetQuality(value, language) {
    const formatted = String(value || '').trim().replace(/\s*[x×]\s*/gi, ' × ');
    return language === 'zh' ? formatted.replace(/\bsachets?\b/gi, '独立小袋') : formatted;
  }

  function createDrinkTutorial() {
    const page = document.querySelector('.product-detail-page');
    if (!page) return null;
    page.classList.add('has-drink-tutorial');
    const siteHeader = document.querySelector('.site-header');
    let isFullscreen = false;

    const hint = document.createElement('div');
    hint.className = 'drink-tutorial-hint';
    hint.setAttribute('role', 'note');
    const makeArrow = () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'drink-tutorial-hint-arrow');
      svg.setAttribute('viewBox', '0 0 18 18');
      svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M9 2.5v11m-4.5-4.5L9 13.5l4.5-4.5');
      svg.append(path);
      return svg;
    };
    const hintText = document.createElement('span');
    hintText.className = 'drink-tutorial-hint-text';
    hint.append(makeArrow(), hintText, makeArrow());
    document.body.append(hint);

    const track = document.createElement('section');
    track.className = 'drink-tutorial-track';
    const stage = document.createElement('div');
    stage.className = 'drink-tutorial-stage';
    const videoFrame = document.createElement('div');
    videoFrame.className = 'drink-tutorial-frame';
    const video = document.createElement('video');
    video.className = 'drink-tutorial-video';
    video.autoplay = false;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;
    video.controls = false;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-label', 'Drink mix preparation tutorial preview');
    video.pause();
    const source = document.createElement('source');
    source.src = encodeURI('images/video/冲饮冲泡教程.mp4');
    source.type = 'video/mp4';
    video.append(source);
    const shade = document.createElement('span');
    shade.className = 'drink-tutorial-shade';
    shade.setAttribute('aria-hidden', 'true');
    const controlsBar = document.createElement('div');
    controlsBar.className = 'drink-tutorial-controls';
    controlsBar.hidden = true;
    controlsBar.setAttribute('role', 'group');
    controlsBar.setAttribute('aria-label', 'Video controls');
    const makeControlButton = (className, label, text) => {
      const button = document.createElement('button');
      button.className = className;
      button.type = 'button';
      button.setAttribute('aria-label', label);
      button.textContent = text;
      return button;
    };
    const controlPlay = makeControlButton('drink-tutorial-control-button drink-tutorial-control-play', 'Play video', '▶');
    const controlBack = makeControlButton('drink-tutorial-control-button drink-tutorial-control-skip', 'Back 10 seconds', '↺ 10s');
    const controlForward = makeControlButton('drink-tutorial-control-button drink-tutorial-control-skip', 'Forward 10 seconds', '10s ↻');
    const controlSeek = document.createElement('input');
    controlSeek.className = 'drink-tutorial-control-seek';
    controlSeek.type = 'range';
    controlSeek.min = '0';
    controlSeek.max = '1000';
    controlSeek.value = '0';
    controlSeek.setAttribute('aria-label', 'Video timeline');
    const controlTime = document.createElement('span');
    controlTime.className = 'drink-tutorial-control-time';
    controlTime.textContent = '00:00 / 00:00';
    const controlMute = makeControlButton('drink-tutorial-control-button drink-tutorial-control-mute', 'Mute video', '🔊');
    const controlVolume = document.createElement('input');
    controlVolume.className = 'drink-tutorial-control-volume';
    controlVolume.type = 'range';
    controlVolume.min = '0';
    controlVolume.max = '1';
    controlVolume.step = '0.05';
    controlVolume.value = '1';
    controlVolume.setAttribute('aria-label', 'Video volume');
    const controlExit = makeControlButton('drink-tutorial-control-button drink-tutorial-control-exit', 'Exit full screen', '×');
    controlsBar.append(controlPlay, controlBack, controlForward, controlSeek, controlTime, controlMute, controlVolume, controlExit);
    videoFrame.append(video, shade, controlsBar);

    const leftWord = document.createElement('span');
    leftWord.className = 'drink-tutorial-word drink-tutorial-word--left';
    leftWord.setAttribute('aria-hidden', 'true');
    const rightWord = document.createElement('span');
    rightWord.className = 'drink-tutorial-word drink-tutorial-word--right';
    rightWord.setAttribute('aria-hidden', 'true');
    const row = document.createElement('div');
    row.className = 'drink-tutorial-row';
    row.append(leftWord, videoFrame, rightWord);

    const playButton = document.createElement('button');
    playButton.className = 'drink-tutorial-play';
    playButton.type = 'button';
    playButton.disabled = true;
    playButton.tabIndex = -1;
    playButton.setAttribute('aria-hidden', 'true');
    const playLabel = document.createElement('span');
    const playIcon = document.createElement('span');
    playIcon.className = 'drink-tutorial-play-icon';
    playIcon.setAttribute('aria-hidden', 'true');
    playIcon.textContent = '▶';
    playButton.append(playLabel, playIcon);
    stage.append(row, playButton);
    track.append(stage);
    const endSpacer = document.createElement('div');
    endSpacer.className = 'drink-tutorial-end-spacer';
    endSpacer.setAttribute('aria-hidden', 'true');
    page.append(track, endSpacer);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    let targetProgress = 0;
    let shownProgress = 0;
    let animationFrame = 0;
    let previousFrameTime = 0;
    let playbackStarted = false;
    let wasFullscreen = false;
    const restingSize = (width, height) => {
      const aspectRatio = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
      const restingWidth = width * 0.7;
      const restingHeight = restingWidth / aspectRatio;
      return { width: restingWidth, height: restingHeight };
    };
    const render = (progress) => {
      const isLockRange = progress >= 0.42 && progress <= 0.72;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const width = isLockRange ? viewportWidth : (stage.clientWidth || viewportWidth);
      const height = isLockRange ? viewportHeight : (stage.clientHeight || viewportHeight);
      const { width: restingWidth, height: restingHeight } = restingSize(width, height);
      const expandProgress = reduceMotion ? 1 : clamp(progress / 0.42);
      const expandEase = 1 - ((1 - expandProgress) ** 3);
      const shrinkProgress = reduceMotion ? 1 : clamp((progress - 0.72) / 0.28);
      const shrinkEase = shrinkProgress * shrinkProgress * (3 - (2 * shrinkProgress));
      const expandedWidth = 130 + ((width - 130) * expandEase);
      const expandedHeight = 52 + ((height - 52) * expandEase);
      const frameWidth = isLockRange
        ? width
        : reduceMotion ? restingWidth : progress < 0.42 ? expandedWidth : width + ((restingWidth - width) * shrinkEase);
      const frameHeight = isLockRange
        ? height
        : reduceMotion ? restingHeight : progress < 0.42 ? expandedHeight : height + ((restingHeight - height) * shrinkEase);
      const radius = isLockRange ? 0 : reduceMotion ? 16 : progress < 0.42 ? 26 * (1 - expandEase) : 16 * shrinkEase;
      stage.style.height = isLockRange ? `${viewportHeight}px` : '';
      videoFrame.style.width = `${frameWidth}px`;
      videoFrame.style.height = `${frameHeight}px`;
      videoFrame.style.borderRadius = `${radius}px`;
      const wordOpacity = reduceMotion || progress >= 0.42 ? 0 : 1 - clamp(progress / 0.42);
      leftWord.style.opacity = String(wordOpacity);
      rightWord.style.opacity = String(wordOpacity);

      const ready = !playbackStarted && !isFullscreen && isLockRange && (reduceMotion || progress >= 0.52);
      const buttonOpacity = playbackStarted || isFullscreen || !isLockRange
        ? 0
        : (reduceMotion ? 1 : clamp((progress - 0.46) / 0.08));
      playButton.style.opacity = String(buttonOpacity);
      playButton.style.transform = `translate(-50%, calc(-50% + ${(1 - buttonOpacity) * 18}px))`;
      playButton.style.pointerEvents = ready ? 'auto' : 'none';
      playButton.disabled = !ready;
      playButton.tabIndex = ready ? 0 : -1;
      playButton.setAttribute('aria-hidden', String(!ready));
      shade.hidden = !isLockRange || playbackStarted || isFullscreen;
      stage.classList.toggle('is-video-ready', isLockRange);
      stage.classList.toggle('is-full-bleed', isLockRange);
      stage.classList.toggle('is-video-playing', playbackStarted);
      siteHeader?.classList.toggle('is-video-covered', isLockRange);
    };

    const setFullscreenState = (value) => {
      isFullscreen = Boolean(value);
      video.controls = false;
      video.removeAttribute('controls');
      videoFrame.classList.toggle('is-fullscreen', isFullscreen);
      controlsBar.hidden = !isFullscreen;
      controlsBar.style.pointerEvents = isFullscreen ? 'auto' : 'none';
      if (isFullscreen) shade.hidden = true;
      playButton.hidden = isFullscreen;
    };

    const formatVideoTime = (seconds) => {
      if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
      const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
      const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${minutes}:${remainder}`;
    };
    let isSeeking = false;
    const updateControlBar = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      if (!isSeeking) controlSeek.value = duration ? String(Math.round((currentTime / duration) * 1000)) : '0';
      controlTime.textContent = `${formatVideoTime(currentTime)} / ${formatVideoTime(duration)}`;
      controlPlay.textContent = video.paused || video.ended ? '▶' : 'Ⅱ';
      controlPlay.setAttribute('aria-label', video.paused || video.ended
        ? (currentLanguage === 'zh' ? '播放影片' : 'Play video')
        : (currentLanguage === 'zh' ? '暂停影片' : 'Pause video'));
      controlMute.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
      controlMute.setAttribute('aria-label', video.muted || video.volume === 0
        ? (currentLanguage === 'zh' ? '取消静音' : 'Unmute video')
        : (currentLanguage === 'zh' ? '静音影片' : 'Mute video'));
      controlVolume.value = String(video.muted ? 0 : video.volume);
    };
    const seekBy = (seconds) => {
      if (!Number.isFinite(video.duration)) return;
      video.currentTime = clamp(video.currentTime + seconds, 0, video.duration);
      updateControlBar();
    };
    controlsBar.addEventListener('click', (event) => event.stopPropagation());
    controlPlay.addEventListener('click', () => {
      if (video.paused || video.ended) video.play().catch(() => {});
      else video.pause();
    });
    controlBack.addEventListener('click', () => seekBy(-10));
    controlForward.addEventListener('click', () => seekBy(10));
    controlSeek.addEventListener('pointerdown', () => { isSeeking = true; });
    controlSeek.addEventListener('input', () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = (Number(controlSeek.value) / 1000) * video.duration;
      }
      updateControlBar();
    });
    controlSeek.addEventListener('change', () => { isSeeking = false; updateControlBar(); });
    controlMute.addEventListener('click', () => {
      video.muted = !(video.muted || video.volume === 0);
      if (!video.muted && video.volume === 0) video.volume = 1;
      updateControlBar();
    });
    controlVolume.addEventListener('input', () => {
      video.volume = Number(controlVolume.value);
      video.muted = video.volume === 0;
      updateControlBar();
    });
    controlExit.addEventListener('click', () => {
      if (document.fullscreenElement === videoFrame) document.exitFullscreen?.();
    });
    ['timeupdate', 'loadedmetadata', 'durationchange', 'play', 'pause', 'volumechange', 'ended', 'seeking', 'seeked'].forEach((eventName) => {
      video.addEventListener(eventName, updateControlBar);
    });

    const animate = (time) => {
      animationFrame = 0;
      const elapsed = previousFrameTime ? Math.min(80, time - previousFrameTime) : 16.7;
      previousFrameTime = time;
      const damping = reduceMotion ? 1 : 1 - Math.exp(-elapsed / 95);
      shownProgress += (targetProgress - shownProgress) * damping;
      if (Math.abs(targetProgress - shownProgress) < 0.001) shownProgress = targetProgress;
      render(shownProgress);
      if (shownProgress !== targetProgress) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        previousFrameTime = 0;
      }
    };

    const updateScroll = () => {
      const trackTop = track.getBoundingClientRect().top;
      const travel = Math.max(1, track.offsetHeight - stage.clientHeight - (stage.clientHeight * 0.25));
      targetProgress = clamp(-trackTop / travel);
      const crossesLockBoundary = (shownProgress >= 0.42 && shownProgress <= 0.72) !== (targetProgress >= 0.42 && targetProgress <= 0.72);
      if (crossesLockBoundary || (targetProgress >= 0.42 && targetProgress <= 0.72)) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        shownProgress = targetProgress;
        render(shownProgress);
      }
      hint.classList.toggle('is-faded', window.scrollY > 60);
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
    };

    const updateLanguage = (language) => {
      const isChinese = language === 'zh';
      hintText.textContent = isChinese ? '往下查看冲泡教程' : 'SCROLL DOWN FOR VIDEO TUTORIAL';
      leftWord.textContent = isChinese ? '冲泡' : 'Brewing';
      rightWord.textContent = isChinese ? '教程' : 'Tutorial';
      video.setAttribute('aria-label', isChinese ? '冲饮冲泡教程预览' : 'Drink mix preparation tutorial preview');
      playLabel.textContent = isChinese ? '观看影片' : 'Begin the film';
      playButton.setAttribute('aria-label', isChinese ? '播放冲泡教程影片' : 'Begin the video tutorial');
      controlsBar.setAttribute('aria-label', isChinese ? '影片控制栏' : 'Video controls');
      controlBack.setAttribute('aria-label', isChinese ? '倒退 10 秒' : 'Back 10 seconds');
      controlForward.setAttribute('aria-label', isChinese ? '快进 10 秒' : 'Forward 10 seconds');
      controlSeek.setAttribute('aria-label', isChinese ? '影片时间轴' : 'Video timeline');
      controlVolume.setAttribute('aria-label', isChinese ? '影片音量' : 'Video volume');
      controlExit.setAttribute('aria-label', isChinese ? '退出全屏' : 'Exit full screen');
      updateControlBar();
      track.setAttribute('aria-label', isChinese ? '冲饮冲泡教程' : 'Drink mix video tutorial');
    };

    const restorePreview = () => {
      playbackStarted = false;
      wasFullscreen = false;
      setFullscreenState(false);
      video.autoplay = false;
      video.loop = true;
      video.muted = true;
      video.defaultMuted = true;
      video.removeAttribute('autoplay');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.currentTime = 0;
      targetProgress = clamp(targetProgress, 0.52, 0.72);
      shownProgress = targetProgress;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      render(shownProgress);
      const previewPromise = video.play();
      if (previewPromise?.catch) previewPromise.catch(() => {});
    };

    playButton.addEventListener('click', () => {
      if (playButton.disabled) return;
      playbackStarted = true;
      setFullscreenState(true);
      video.removeAttribute('muted');
      video.removeAttribute('loop');
      video.removeAttribute('autoplay');
      video.muted = false;
      video.defaultMuted = false;
      video.loop = false;
      video.autoplay = false;
      video.currentTime = 0;
      render(shownProgress);
      wasFullscreen = true;
      try {
        if (videoFrame.requestFullscreen) {
          const fullscreenPromise = videoFrame.requestFullscreen();
          if (fullscreenPromise?.catch) fullscreenPromise.catch(restorePreview);
        } else {
          restorePreview();
          return;
        }
      } catch {
        restorePreview();
        return;
      }
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    });

    document.addEventListener('fullscreenchange', () => {
      const isFrameFullscreen = document.fullscreenElement === videoFrame;
      if (playbackStarted && wasFullscreen && !isFrameFullscreen) restorePreview();
      else {
        wasFullscreen = isFrameFullscreen;
        setFullscreenState(isFrameFullscreen);
        render(shownProgress);
      }
    });
    video.addEventListener('loadedmetadata', () => render(shownProgress));
    document.addEventListener('keydown', (event) => {
      if (!isFullscreen || document.fullscreenElement !== videoFrame || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 10 : -10;
      const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
      video.currentTime = clamp(video.currentTime + direction, 0, duration);
      updateControlBar();
    });
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    window.addEventListener('pageshow', updateScroll);
    updateLanguage(currentLanguage);
    render(0);
    updateScroll();

    return { updateLanguage };
  }

  function appendLanguagePair(container, english, chinese) {
    const order = currentLanguage === 'zh'
      ? [['zh-Hans', chinese], ['en', english]]
      : [['en', english], ['zh-Hans', chinese]];
    order.forEach(([language, value]) => {
      if (!value) return;
      container.append(textElement('p', language === 'en' ? 'product-bilingual-en' : 'product-bilingual-zh', value, language));
    });
  }

  function splitBilingual(value) {
    const source = String(value || '').trim();
    const firstHan = source.search(/\p{Script=Han}/u);
    if (firstHan < 0) return { en: source, zh: '' };
    return {
      en: source.slice(0, firstHan).replace(/\s+/g, ' ').trim(),
      zh: source.slice(firstHan).trim(),
    };
  }

  function pairLines(lines) {
    const entries = [];
    for (let index = 0; index < (lines || []).length; index += 1) {
      const entry = splitBilingual(lines[index]);
      if (entry.en && !entry.zh && index + 1 < lines.length) {
        const next = splitBilingual(lines[index + 1]);
        if (!next.en && next.zh) {
          entry.zh = next.zh;
          index += 1;
        }
      }
      if (entry.en || entry.zh) entries.push(entry);
    }
    return entries;
  }

  function renderTextLines(container, lines, className = 'product-bilingual-entry') {
    pairLines(lines).forEach(({ en, zh }) => {
      const entry = document.createElement('div');
      entry.className = className;
      appendLanguagePair(entry, en, zh);
      container.append(entry);
    });
  }

  function renderNutrition(container) {
    if (!details.nutritionRows?.length) return;
    const table = document.createElement('table');
    table.className = 'product-nutrition-table';
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['', labels[currentLanguage].per100, labels[currentLanguage].perServing].forEach((value) => {
      const heading = textElement('th', '', value);
      heading.scope = 'col';
      headerRow.append(heading);
    });
    head.append(headerRow);
    const body = document.createElement('tbody');
    details.nutritionRows.forEach((row) => {
      const tr = document.createElement('tr');
      const rowLabel = currentLanguage === 'zh' ? (nutritionNameZh[row.label] || row.label) : row.label;
      [rowLabel, row.per100, row.perServing].forEach((value) => tr.append(textElement('td', '', value)));
      body.append(tr);
    });
    table.append(head, body);
    container.append(table);
  }

  function renderIngredients(container) {
    const sourceLines = details.ingredients || [];
    const captionIndex = sourceLines.findIndex((line) => /^\s*(each|ingredients?|per serving)\b/i.test(String(line)));
    if (captionIndex >= 0) {
      const captionPair = splitBilingual(sourceLines[captionIndex]);
      const caption = document.createElement('p');
      caption.className = 'product-ingredient-caption';
      appendLanguagePair(caption, captionPair.en, captionPair.zh);
      container.append(caption);
    }

    const table = document.createElement('table');
    table.className = 'product-ingredients-table';
    const thead = document.createElement('thead');
    const header = document.createElement('tr');
    (isDrink
      ? [labels[currentLanguage].ingredientName]
      : [labels[currentLanguage].ingredientNo, labels[currentLanguage].ingredientName, labels[currentLanguage].amount])
      .forEach((value) => {
        const heading = textElement('th', '', value);
        heading.scope = 'col';
        header.append(heading);
      });
    thead.append(header);
    const tbody = document.createElement('tbody');
    const rows = sourceLines.filter((_, index) => index !== captionIndex);
    pairLines(rows).forEach(({ en, zh }, index) => {
      const amountMatch = `${en} ${zh}`.match(/(\d+(?:\.\d+)?\s*(?:mg|g|mcg|μg|ml))\s*$/i);
      const amount = amountMatch ? amountMatch[1].replace(/\s+/g, '') : '';
      const ingredientEn = amountMatch ? en.replace(amountMatch[1], '').trim() : en;
      const ingredientZh = amountMatch ? zh.replace(amountMatch[1], '').trim() : zh;
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const name = document.createElement('div');
      name.className = 'product-ingredient-name';
      appendLanguagePair(name, ingredientEn, ingredientZh);
      nameCell.append(name);
      if (isDrink) {
        row.append(nameCell);
      } else {
        row.append(textElement('td', 'product-ingredient-number', String(index + 1)), nameCell, textElement('td', 'product-ingredient-amount', amount));
      }
      tbody.append(row);
    });
    table.append(thead, tbody);
    container.append(table);
  }

  function renderAdditional(container) {
    const entries = pairLines(details.additional || []).map(({ en, zh }, index) => {
      const englishNumber = en.match(/^\s*(\d+)[.)]?\s*/);
      const chineseNumber = zh.match(/^\s*(\d+)[.)]?\s*/);
      const number = isDrink ? String(index + 1) : (englishNumber?.[1] || chineseNumber?.[1] || String(index + 1));
      const english = englishNumber ? en.slice(englishNumber[0].length).trim() : en;
      const chinese = chineseNumber ? zh.slice(chineseNumber[0].length).trim() : zh;
      return { number, english, chinese };
    });

    entries.forEach(({ number, english, chinese }) => {
      const item = document.createElement('div');
      item.className = 'product-additional-entry';
      item.append(textElement('span', 'product-additional-number', `${number}.`));
      const text = document.createElement('div');
      text.className = 'product-additional-text';
      appendLanguagePair(text, english, chinese);
      item.append(text);
      container.append(item);
    });
  }

  function updateLanguage(language) {
    currentLanguage = language === 'zh' ? 'zh' : 'en';
    const copy = labels[currentLanguage];
    if (backText) backText.textContent = copy.back;
    title.textContent = currentLanguage === 'zh' ? product.chineseName : product.name;
    title.lang = currentLanguage === 'zh' ? 'zh-Hans' : 'en';
    secondaryName.textContent = currentLanguage === 'zh' ? product.name : product.chineseName;
    secondaryName.lang = currentLanguage === 'zh' ? 'en' : 'zh-Hans';
    priceField.replaceChildren(
      textElement('span', 'product-detail-price-currency', 'RM'),
      textElement('span', 'product-detail-price-amount', product.price == null ? '' : String(product.price))
    );
    priceField.hidden = product.price == null;
    const license = /^MAL\d{8}(?:TC|NC)$/i.test(product.license || '') ? product.license : '';
    licenseField.hidden = !license;
    licenseField.replaceChildren();
    if (!isDrink && license) {
      licenseField.append(makeLicenseShield());
      licenseField.append(textElement('span', 'product-detail-license-code', license));
    }
    specificationField.textContent = currentLanguage === 'zh' ? '100 粒胶囊 / 瓶' : '100 Capsules / Bottle';
    netField.hidden = !isDrink;
    netField.replaceChildren(
      textElement('span', 'product-detail-meta-label', copy.netQuality),
      textElement('span', 'product-detail-meta-separator', currentLanguage === 'zh' ? '：' : ':'),
      textElement('strong', 'product-detail-net-value', formatNetQuality(details.netQuality, currentLanguage) || copy.missingValue)
    );
    image.alt = currentLanguage === 'zh'
      ? `${product.chineseName}（${product.name}）产品包装`
      : `${product.name} product packaging`;

    if (dosage) {
      dosage.summary.textContent = copy.dosage;
      dosage.panel.replaceChildren();
      renderTextLines(dosage.panel, details.dosage || []);
    }
    if (nutrition) {
      nutrition.summary.textContent = copy.nutrition;
      nutrition.panel.replaceChildren();
      renderNutrition(nutrition.panel);
    }
    ingredients.summary.textContent = copy.ingredients;
    ingredients.panel.replaceChildren();
    renderIngredients(ingredients.panel);
    additional.summary.textContent = copy.additional;
    additional.panel.replaceChildren();
    renderAdditional(additional.panel);

    functionHeading.textContent = currentLanguage === 'zh' ? '产品功能 · Function' : 'Function · 产品功能';
    functionContent.replaceChildren();
    renderTextLines(functionContent, details.function || []);
    drinkTutorial?.updateLanguage(currentLanguage);
  }

  updateLanguage(currentLanguage);
  window.addEventListener('herb-language-change', (event) => updateLanguage(event.detail?.language));
})();

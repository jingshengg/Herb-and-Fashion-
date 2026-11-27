(() => {
  const logo = document.querySelector('[data-partner-logo]');
  const title = document.querySelector('[data-partner-title]');
  const locationsRoot = document.querySelector('[data-partner-locations]');
  const shopRoot = document.querySelector('[data-partner-online-shop]');
  if (!logo || !title || !locationsRoot) return;

  const logoBase = 'images/our%20partners/';
  const partners = {
    unicare: {
      name: 'Unicare Pharmacy', nameZh: '康民药剂行', logo: 'unicare-pharmacy.png', locations: [
        { name: 'Unicare Pharmacy (Unicity) 大学城', address: 'No 8,10 & 12, Lorong Wawasan, 9A, Jln Wawasan, 96000 Sibu, Sarawak, Malaysia.', contact: '019-589 5813', hours: ['8:00am - 9:00pm'] },
        { name: 'Unicare Pharmacy (Wonderful) 万家福', address: 'Lot 1612 Block 1, Sungai Merah Town District, Jalan Ling Kai Cheng, 96000 Sibu, Sarawak, Malaysia.', contact: '013-578 5813', hours: ['8:00am – 8:00pm'] },
        { name: 'Unicare Pharmacy (C.S.H.) 周锡萱', address: 'No 18, Lorong Chew Siik Hiong 1, Pekan Sibu, 96000 Sibu, Sarawak, Malaysia.', contact: '019-259 5813', hours: ['SAT-TUE 7:30am - 7:30pm', 'WED-FRI 7:00am - 7:30pm'] },
        { name: "Unicare Pharmacy (Hann's) 汉斯", address: "Sublot 2-01, G/F, Hann's Commercial Centre, Jalan Wong King Huo, Pekan Sibu, 96000 Sibu, Sarawak, Malaysia.", contact: '013-818 5813', hours: ['8:30am – 8:30pm'] },
        { name: 'Unicare Pharmacy (Teku) 德古', address: 'S/L, 451, No.67, G/F, Lor Indah Timur 3, Lorong Indah Timur, 96000 Sibu, Sarawak, Malaysia.', contact: '013-992 5813', hours: ['7:30am – 7:30pm'] }
      ]
    },
    greenhouse: {
      name: 'Greenhouse', nameZh: '恩粮坊', logo: 'green-house.png', locations: [
        { name: 'Greenhouse Johor Jaya', address: 'No. 37 & 39, Jalan Rosmerah 2/11, Taman Johor Jaya, 81100 Johor Bahru, Johor, Malaysia.', hours: ['9:30am - 6:30pm (except Sunday)'], contact: '011-5657 3807' },
        { name: 'Greenhouse Impian Emas', address: 'No. 93, 95, Jalan Impian Emas 22, Taman Impian Emas, 81300 Skudai, Johor Bahru, Johor, Malaysia.', hours: ['9:30am - 6:30pm'], contact: '016-237 3809' }
      ]
    },
    'peter-chinese-medical': {
      name: 'Peter Chinese Medical Hall', nameZh: '彼德中医内科正骨诊疗所', logo: 'peter-chinese-medical.png', locations: [
        { name: 'Peter Chinese Medical Hall', address: 'Lot 10387 Sublot 23 Ground Floor, Panovel Commercial Centre, Q5A, Kampung Kenyalang Park, 93300 Kuching, Sarawak, Malaysia.', hours: ['Mon-Sat 8:00am – 4:30pm (except Sunday)', 'Wed 8:00am – 11:30am'], contact: '018-255 9121' }
      ]
    },
    'bio-modern-herbs': {
      name: 'Bio Modern Herbs Sdn. Bhd.', logo: 'bio-modern-herbs.png', locations: [
        { name: 'Bio Modern Herbs Sdn. Bhd.', address: 'No. 56, Jalan Ekoflora 6/6, Taman Ekoflora, 81100 Johor Bahru, Johor, Malaysia.', contact: '010-391 3451' }
      ]
    },
    'sing-lee-pharmacy': {
      name: 'Sing Lee Pharmacy', nameZh: '信利西药行', logo: 'sing-lee-pharmacy.png', locations: [
        { name: 'Sing Lee Pharmacy', address: '857, Q112B, Tabuan Jaya Commercial Centre, 93350 Kuching, Sarawak, Malaysia.', contact: '082-236 6196', hours: ['9:30am – 7:30pm'] }
      ]
    },
    'bio-health-cmc': {
      name: 'Bio Health Chinese Medical Centre', logo: 'bio-health-cmc.png', locations: [
        { name: 'Bio Health Chinese Medical Centre', address: 'Lot 10387 Sublot 23 Ground Floor, Panovel Commercial Centre, Q5A, Kampung Kenyalang Park, 93300 Kuching, Sarawak, Malaysia.', hours: ['Mon-Sat 8:00am – 4:30pm (except Sunday)', 'Wed 8:00am – 11:30am'], contact: '018-255 9121' }
      ]
    },
    'ij-pharmacy': {
      name: 'IJ Pharmacy', logo: 'ij-pharmacy.png', locations: [
        { name: 'IJ Pharmacy', address: '20, Jalan Gangsa 1, Taman Gunung Pulai, 81000 Kulai, Johor, Malaysia.', hours: ['10:00am - 8:00pm'], contact: '07-665 1619' }
      ]
    },
    'kin-centre-pharmacy': {
      name: 'Kin Centre Pharmacy', logo: 'kin-centre-pharmacy.png', locations: [
        { name: "Kin Centre Pharmacy (King's Centre)", address: "King's Centre, Jalan Simpang Tiga, King Centre, 93300 Kuching, Sarawak, Malaysia.", hours: ['9:00am - 9:00pm'], contact: '016-688 4122' },
        { name: 'Kin Centre Pharmacy (RH PLAZA)', address: '49, RH Plaza Commercial Centre, Jalan Lapangan Terbang, Baru, 93350 Kuching, Sarawak, Malaysia.', hours: ['9:00am - 9:30pm'], contact: '019-818 4122' }
      ]
    },
    'george-pharmacy': {
      name: 'George Pharmacy', nameZh: '乔治药剂行', logo: 'george%20pharmacy.png', locations: [
        { name: 'George Pharmacy', address: 'BDC Commercial Centre, 974, Jalan Stutong, Taman Satria Jaya, 93350 Kuching, Sarawak, Malaysia.', contact: '082-575 434' }
      ]
    },
    'han-fang-tcm': {
      name: 'Han Fang Chinese Physician and Acupuncturist', nameZh: '新汉方中医诊所', logo: 'Han%20Fang%20tcm.png', locations: [
        { name: 'Han Fang Chinese Physician and Acupuncturist 新汉方中医诊所', address: 'No 126 H, Ground Floor Green Heights Commercial Centre, Lorong Lapangan Terbang 2, 93250 Kuching, Sarawak, Malaysia.', hours: ['8:30am - 12:30pm', '1:30pm – 6:00 pm'], hoursNote: '(except Sunday)', contact: '017-807 6699' }
      ]
    },
    'arumi-health': {
      name: 'Arumi Health Malaysia', logo: 'arumi%20health.png', locations: [], shop: 'https://my.shp.ee/2XUXYXj8'
    }
  };

  const labels = {
    en: { address: 'Address', hours: 'Operating Hours', contact: 'Contact', soon: 'Partner information will be available soon.', shop: 'Online Shop', shopAlt: 'Shop Arumi Health Malaysia on Shopee' },
    zh: { address: '地址', hours: '营业时间', contact: '联系电话', soon: '合作伙伴资料将于稍后提供。', shop: '线上购物平台', shopAlt: '在 Shopee 选购 Arumi Health Malaysia' }
  };
  const partner = partners[new URLSearchParams(window.location.search).get('partner')] || partners.unicare;
  logo.src = logoBase + partner.logo;
  logo.alt = partner.name + ' logo';

  const updateTitle = (language) => {
    const showChinese = language === 'zh' && partner.nameZh;
    title.textContent = showChinese ? partner.nameZh : partner.name;
    title.classList.toggle('partner-detail-title-zh', Boolean(showChinese));
    title.lang = showChinese ? 'zh-Hans' : 'en';
  };

  const appendField = (card, label, values, note = '') => {
    if (!values?.length) return;
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.dataset.partnerField = label;
    term.className = 'sr-only';
    term.textContent = label;
    if (note && values.length > 1) {
      description.className = 'partner-hours-split';
      const times = document.createElement('span');
      times.className = 'partner-hours-times';
      times.append(...values.flatMap((value, index) => {
        const text = [document.createTextNode(value)];
        if (index < values.length - 1) text.push(document.createElement('br'));
        return text;
      }));
      const noteText = document.createElement('span');
      noteText.className = 'partner-hours-note';
      noteText.textContent = note;
      description.append(times, noteText);
    } else {
      description.append(...values.flatMap((value, index) => {
        const text = [document.createTextNode(value)];
        if (index < values.length - 1) text.push(document.createElement('br'));
        return text;
      }));
    }
    row.append(term, description);
    card.querySelector('dl').append(row);
  };

  const render = (language) => {
    const copy = labels[language] || labels.en;
    locationsRoot.replaceChildren();
    if (shopRoot) {
      shopRoot.replaceChildren();
      shopRoot.hidden = !partner.shop;
    }
    partner.locations.forEach((location) => {
      const card = document.createElement('article');
      card.className = 'partner-location-card';
      const branch = document.createElement('h2');
      const chineseSuffix = location.name.match(/([\u3400-\u9fff]+)$/)?.[1];
      if (chineseSuffix) {
        const englishPart = location.name.slice(0, -chineseSuffix.length).trimEnd();
        const chinesePart = document.createElement('span');
        chinesePart.className = 'partner-location-name-zh';
        chinesePart.lang = 'zh-Hans';
        chinesePart.textContent = ` ${chineseSuffix}`;
        branch.append(document.createTextNode(englishPart), chinesePart);
      } else {
        branch.textContent = location.name;
      }
      const fields = document.createElement('dl');
      card.append(branch, fields);
      appendField(card, copy.address, [location.address]);
      appendField(card, copy.hours, location.hours, location.hoursNote);
      appendField(card, copy.contact, location.contact ? [location.contact] : []);
      locationsRoot.append(card);
    });
    if (!partner.locations.length && !partner.shop) {
      const note = document.createElement('p');
      note.className = 'partner-profile-note';
      note.textContent = copy.soon;
      locationsRoot.append(note);
    }
    if (partner.shop && shopRoot) {
      const shopLabel = document.createElement('p');
      shopLabel.className = 'partner-online-shop-label';
      shopLabel.textContent = copy.shop;
      const link = document.createElement('a');
      link.className = 'partner-online-shop-link';
      link.href = partner.shop;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', copy.shopAlt);
      const image = document.createElement('img');
      image.src = 'images/shopee%20logo.png';
      image.alt = 'Shopee';
      link.append(image);
      shopRoot.append(shopLabel, link);
    }
  };

  const renderForLanguage = (language) => {
    updateTitle(language);
    render(language);
  };
  renderForLanguage(document.documentElement.dataset.language === 'zh' ? 'zh' : 'en');
  window.addEventListener('herb-language-change', (event) => renderForLanguage(event.detail.language));
})();

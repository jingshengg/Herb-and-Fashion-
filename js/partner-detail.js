(() => {
  const logo = document.querySelector('[data-partner-logo]');
  const title = document.querySelector('[data-partner-title]');
  const locationsRoot = document.querySelector('[data-partner-locations]');
  if (!logo || !title || !locationsRoot) return;

  const logoBase = 'images/our%20partners/';
  const partners = {
    unicare: {
      name: 'Unicare Pharmacy', logo: 'unicare-pharmacy.png', locations: [
        { name: 'Unicare Pharmacy (Unicity) 大学城', address: 'No 8,10 & 12, Lorong Wawasan, 9A, Jln Wawasan, 96000 Sibu, Sarawak.', contact: '019-589 5813', hours: ['8:00am - 9:00pm'] },
        { name: 'Unicare Pharmacy (Wonderful) 万家福', address: 'Lot 1612 Block 1, Sungai Merah Town District, Jalan Ling Kai Cheng, 96000 Sibu, Sarawak.', contact: '013-578 5813', hours: ['8:00am – 8:00pm'] },
        { name: 'Unicare Pharmacy (C.S.H.) 周锡萱', address: 'No 18, Lorong Chew Siik Hiong 1, Pekan Sibu, 96000 Sibu, Sarawak.', contact: '019-259 5813', hours: ['SAT-TUE 7:30am - 7:30pm', 'WED-FRI 7:00am - 7:30pm'] },
        { name: "Unicare Pharmacy (Hann's) 汉斯", address: "Sublot 2-01, G/F, Hann's Commercial Centre, Jalan Wong King Huo, Pekan Sibu, 96000 Sibu, Sarawak.", contact: '013-818 5813', hours: ['8:30am – 8:30pm'] },
        { name: 'Unicare Pharmacy (Teku) 德古', address: 'S/L, 451, No.67, G/F, Lor Indah Timur 3, Lorong Indah Timur, 96000 Sibu, Sarawak.', contact: '013-992 5813', hours: ['7:30am – 7:30pm'] },
        { name: 'Unicare Pharmacy [Pakan] 巴干', address: 'SUBLOT 2 LOT 197 BLOCK 19, Jalan Pakan, 96510, Sarawak', contact: '019-883 8130', hours: ['8:00am – 5:30pm'] }
      ]
    },
    greenhouse: {
      name: 'Greenhouse', logo: 'green-house.png', locations: [
        { name: 'Greenhouse Johor Jaya', address: 'No. 37 & 39, Jalan Rosmerah 2/11, Taman Johor Jaya, 81100 Johor Bahru.', hours: ['9:30am - 6:30pm (except Sunday)'], contact: '011-5657 3807' },
        { name: 'Greenhouse Impian Emas', address: 'No. 93, 95, Jalan Impian Emas 22, Taman Impian Emas, 81300 Skudai, Johor Bahru, Johor.', hours: ['9:30am - 6:30pm'], contact: '016-237 3809' }
      ]
    },
    'peter-chinese-medical': {
      name: 'Peter Chinese Medical Hall', logo: 'peter-chinese-medical.png', locations: [
        { name: 'Peter Chinese Medical Hall', address: 'Lot 10387 Sublot 23 Ground Floor, Panovel Commercial Centre, Q5A, Kampung Kenyalang Park, 93300 Kuching, Sarawak.', hours: ['Mon-Sat 8:00am – 4:30pm (except Sunday)', 'Wed 8:00am – 11:30am'], contact: '018-255 9121' }
      ]
    },
    'bio-modern-herbs': {
      name: 'Bio Modern Herbs Sdn. Bhd.', logo: 'bio-modern-herbs.png', locations: [
        { name: 'Bio Modern Herbs Sdn. Bhd.', address: 'No. 26, Jalan Harmonium 10, Taman Desa Tebrau, 81100 Johor Bahru, Johor, Malaysia.', contact: '010-391 3451' }
      ]
    },
    'sing-lee-pharmacy': {
      name: 'Sing Lee Pharmacy', logo: 'sing-lee-pharmacy.png', locations: [
        { name: 'Sing Lee Pharmacy', address: '857, Q112B, Tabuan Jaya Commercial Centre, 93350 Kuching, Sarawak.', contact: '08-2366 196', hours: ['9:30am – 7:30pm'] }
      ]
    },
    'bio-health-cmc': {
      name: 'Bio Health Chinese Medical Centre', logo: 'bio-health-cmc.png', locations: [], comingSoon: true
    }
  };

  const labels = {
    en: { address: 'Address', hours: 'Operating Hours', contact: 'Contact', soon: 'Partner information will be available soon.' },
    zh: { address: '地址', hours: '营业时间', contact: '联系电话', soon: '合作伙伴资料将于稍后提供。' }
  };
  const params = new URLSearchParams(window.location.search);
  const partner = partners[params.get('partner')] || partners.unicare;
  logo.src = `${logoBase}${partner.logo}`;
  logo.alt = `${partner.name} logo`;
  title.textContent = partner.name;

  const appendField = (card, label, values) => {
    if (!values?.length) return;
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.dataset.partnerField = label;
    description.append(...values.flatMap((value, index) => {
      const text = [document.createTextNode(value)];
      if (index < values.length - 1) text.push(document.createElement('br'));
      return text;
    }));
    row.append(term, description);
    card.querySelector('dl').append(row);
  };

  const render = (language) => {
    const copy = labels[language] || labels.en;
    locationsRoot.replaceChildren();
    if (partner.comingSoon) {
      const note = document.createElement('p');
      note.className = 'partner-profile-note';
      note.textContent = copy.soon;
      locationsRoot.append(note);
      return;
    }
    partner.locations.forEach((location) => {
      const card = document.createElement('article');
      card.className = 'partner-location-card';
      const branch = document.createElement('h2');
      branch.textContent = location.name;
      const fields = document.createElement('dl');
      card.append(branch, fields);
      appendField(card, copy.address, [location.address]);
      appendField(card, copy.hours, location.hours);
      appendField(card, copy.contact, location.contact ? [location.contact] : []);
      locationsRoot.append(card);
    });
  };

  render(document.documentElement.dataset.language === 'zh' ? 'zh' : 'en');
  window.addEventListener('herb-language-change', (event) => render(event.detail.language));
})();

// Product names, categories, images, and editable catalogue prices.
window.herbProductCatalogue = [
  { id: 'inner-balance-essence', category: 'heart-circulation', categoryName: 'Heart & Circulation', name: 'INNER BALANCE ESSENCE CAPSULE', chineseName: '清衡方', price: 170, image: 'images/Products/H/Malaysia_清衡方.png' },
  { id: 'restore-capsule', category: 'heart-circulation', categoryName: 'Heart & Circulation', name: 'RESTORE CAPSULE', chineseName: '复修源', price: 200, image: 'images/Products/H/马来西亚_复修源 Restore Capsule.png' },
  { id: 'natto-complex-capsule', category: 'heart-circulation', categoryName: 'Heart & Circulation', name: 'NATTO COMPLEX CAPSULE', chineseName: '纳豆复方胶囊', price: 160, image: 'images/Products/H/马来西亚_纳豆复方 Natto Complex Capsule.png' },
  { id: 'perilla-oil-soft-gel-capsule', category: 'heart-circulation', categoryName: 'Heart & Circulation', name: 'PERILLA OIL SOFT GEL CAPSULE', chineseName: '紫苏油软胶囊', price: 200, image: 'images/Products/H/马来西亚_紫苏油 Perilla Oil Soft Gel.png' },
  { id: 'hawthorn-cassia-seed-plus', category: 'heart-circulation', categoryName: 'Heart & Circulation', name: 'HAWTHORN CASSIA SEED+ CAPSULE', chineseName: '山楂决明子+胶囊', price: 150, image: 'images/Products/H/马来西亚_山楂决明子+ Hawthorn Cassia Seed+.png' },
  { id: 'calcium-collagen-plus', category: 'bones-joints', categoryName: 'Bones & Joints', name: 'CALCIUM COLLAGEN+ CAPSULE', chineseName: '钙质胶原+', price: 160, image: '' },
  { id: 'seaweed-calcium-plus', category: 'bones-joints', categoryName: 'Bones & Joints', name: 'SEAWEED CALCIUM+ CAPSULE', chineseName: '红藻钙+', price: 50, image: 'images/Products/B/Malaysia_红藻钙.png' },
  { id: 'mu-gua-guan-jie-capsule', category: 'bones-joints', categoryName: 'Bones & Joints', name: 'MU GUA GUAN JIE CAPSULE', chineseName: '木瓜关节胶囊', price: 180, image: '' },
  { id: 'pain-relief', category: 'bones-joints', categoryName: 'Bones & Joints', name: 'PAIN RELIEF', chineseName: '舒痛', price: 250, image: 'images/Products/B/马来西亚_舒痛 Pain Relief.png' },
  { id: 'natural-sleep-ease-capsule', category: 'sleep-stress', categoryName: 'Sleep & Stress', name: 'NATURAL SLEEP EASE CAPSULE', chineseName: '舒眠方胶囊', price: 160, image: 'images/Products/S/马来西亚_舒眠方 Natural Sleep Ease Capsule.png' },
  { id: 'bupleurum-complex-capsule', category: 'sleep-stress', categoryName: 'Sleep & Stress', name: 'BUPLEURUM COMPLEX CAPSULE', chineseName: '柴胡复方', price: 180, image: 'images/Products/S/Malaysia_柴胡复方.png' },
  { id: 'cordyceps-rhodiola-rosea-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'CORDYCEPS RHODIOLA ROSEA CAPSULE', chineseName: '虫草红景天', price: 180, image: 'images/Products/D/马来西亚_虫草红景天 Cordyceps Rhodiola Rosea.png' },
  { id: 'cough-ease-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'COUGH EASE CAPSULE', chineseName: '舒咳宁', price: 150, image: 'images/Products/D/马来西亚_舒咳宁 Cough Ease Capsule.png' },
  { id: 'v-strength-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'V-STRENGTH CAPSULE', chineseName: '滋肾源', price: 160, image: 'images/Products/D/马来西亚_滋肾源 V-Strength Capsule.png' },
  { id: 'womens-treasure-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: "WOMEN'S TREASURE CAPSULE", chineseName: '女人宝', price: 200, image: '' },
  { id: 'revital-essence-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'REVITAL ESSENCE CAPSULE', chineseName: '养元复气胶囊', price: 250, image: 'images/Products/D/马来西亚_养元复气 Revital Essence.png' },
  { id: 'eye-health-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'EYE HEALTH CAPSULE', chineseName: '明眸胶囊', price: 160, image: 'images/Products/D/马来西亚_明眸胶囊 Eye Health Capsule.png' },
  { id: 'aloe-prebiotic', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'ALOE PREBIOTIC', chineseName: '芦荟益生原', price: 230, image: '' },
  { id: 'grape-seed-extract-300mg', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'GRAPE SEED EXTRACT 300MG CAPSULE', chineseName: '葡萄籽萃取物胶囊', price: 50, image: '' },
  { id: 'harmony-wellness-capsule', category: 'daily-vitality', categoryName: 'Daily Vitality', name: 'HARMONY WELLNESS CAPSULE', chineseName: '疏养方', price: 50, image: '' }
];

window.herbProductDetails = Object.freeze({
  "aloe-prebiotic": {
    "ingredients": [
      "Each 120 mg capsule contains",
      "Inulin 菊粉 80mg",
      "Aloe Vera Leaf Extract 芦荟叶提取物40mg",
      "Source of capsule shell: Hypromellose"
    ],
    "function": [
      "Used as health supplement. 作为保健品使用"
    ],
    "dosage": [
      "Adult: 1 capsule once per day after meal. Or as directed by a doctor or pharmacist.",
      "成人：饭后服用，每日 1次，每次 1粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "eye-health-capsule": {
    "ingredients": [
      "Each 300 mg vegetable capsule contains:",
      "Semen Cassia Obtusifolia Extract (Cassia Seeds) 决明子50mg",
      "Flos Chrysanthemum Morifolium Extract (Chrysanthemum) 菊花 50mg",
      "Fructus Vaccinium Myrtillus Extract (Bilberry) 山桑子20mg",
      "Fructus Morus Alba Extract (Mulberry) 桑椹 30mg",
      "Fructus Lycium Barbarum Extract (Wolfberry) 枸杞子50mg",
      "Fructus Vaccinium Corymbosum (Blueberry) 蓝莓100mg",
      "Source of capsule shell: Hypromellose"
    ],
    "function": [
      "Traditionally used for healthy eyes. 传统用于维护眼睛的健康。"
    ],
    "dosage": [
      "Adults: Take 2 capsules once a day after meal. Or as directed by a doctor or pharmacist.",
      "成人：饭后服用，每日 1次，每次 2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Consult a doctor or pharmacist before taking this traditional medicine, and keep it out of reach of children.",
      "服用此传统药物前请咨询医生或药剂师，并务必置于儿童接触不到的地方。",
      "2. Strictly do not use if pregnant, breastfeeding, or experiencing abdominal pain, nausea, or vomiting.",
      "孕妇、哺乳期妇女，以及出现腹痛、恶心或呕吐症状者请勿使用。",
      "3. Do not use for more than 7 days without medical advice. Prolonged use can cause product dependence and electrolyte imbalance.",
      "如需使用超过7天，请先咨询医护人员；频繁或长期使用可能导致药物依赖及电解质失衡。",
      "4. Store below 30°C, protected from light and moisture.",
      "储存条件： 存放于30°C以下，注意避光防潮。"
    ]
  },
  "inner-balance-essence": {
    "ingredients": [
      "Each 300 mg vegetable capsule contains:",
      "Fructus Momordica Charantia Extract 苦瓜 100mg",
      "Folium Morus Alba Extract 桑叶 50mg",
      "Fructus Morus Alba Extract 桑葚 50mg",
      "Propolis (Apis Mellifera) 蜂胶 100mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for health and strengthening the body. 传统上用于保健及强身健体。"
    ],
    "dosage": [
      "Adults: Take 2-3 vegetable capsules after meal, twice a day. Or as directed by a doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次 2-3粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. This product contains propolis, which can cause severe or fatal allergic reactions. Asthma and allergy sufferers are at a higher risk.",
      "本品含有蜂胶，可能导致严重甚至致命的过敏反应。哮喘和过敏患者面临的风险更高。",
      "2. Strictly do not use if you are pregnant or breast-feeding.",
      "孕妇及哺乳期妇女请勿使用。",
      "3. Consult a healthcare provider before taking this traditional medicine, and disclose all other supplements you are taking to avoid interactions or side effects.",
      "服用此传统药物前请咨询医护人员，并告知您正在服用的其他补充剂，以防产生相互作用或副作用。",
      "4. Keep out of reach of children. Store below 30°C, protected from light and moisture.",
      "务必置于儿童接触不到的地方。存放于30°C以下，注意避光和防潮。"
    ]
  },
  "calcium-collagen-plus": {
    "ingredients": [
      "Each capsule contains:",
      "Calcium Ascorbate (Providing 17.5mg Calcium & 153mg Vitamin C) 抗坏血酸钙 170mg",
      "Collagen Type II II 型胶原蛋白 150mg",
      "Boswellia Serrata Gum Extract乳香萃取物33mg"
    ],
    "function": [
      "Used as a health supplement. 作为保健品使用。"
    ],
    "dosage": [
      "Adults: 3 capsules 2 times a day after meal. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次3粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "bupleurum-complex-capsule": {
    "ingredients": [
      "Each 497mg capsule contains:",
      "Radix Bupleurum Chinense Extract 柴胡 31.5mg",
      "Radix Scutellaria Baicalensis Extract 黄芩 31.5mg",
      "Ramulus Cinnamomum Cassia Extract 桂枝 31.5mg",
      "Radix Paeonia Lactiflora (Rubra) Extract 赤芍 21mg",
      "Radix Paeonia Lactiflora (Alba) Extract 白芍 21mg",
      "Pericarpium Citrus Reticulata Extract 陈皮 21mg",
      "Sclerotium Poria Cocos (Poria Cum Radix Pini) Extract 茯神 42mg",
      "Fructus Citrus Aurantium Extract 枳壳 21mg",
      "Rhizoma Pinellia Ternate Preparata Extract 法半夏 21mg",
      "Caulis Phyllostachys Nigra (Bambusae In Taenia) Extract 竹茹 21mg",
      "Radix Codonopsis Pilosula Extract 党参 21mg",
      "Rhizoma Acorus Tatarinowii Extract 石菖蒲 31.5mg",
      "Radix Polygala Tenuifolia Extract 远志 21mg",
      "Semen Ziziphus Spinosa Extract 酸枣仁 42mg",
      "Fossilia Ossis Mastodi Extract 龙骨 52.5mg",
      "Concha Ostreae Gigas Extract 牡蛎 42mg",
      "Rhizoma Zingiber Officinale Recens Extract 生姜 10.5mg",
      "Fructus Ziziphus Jujuba Extract 大枣 7mg",
      "Radix Et Rhizoma Glycyrrhiza Uralensis Extract 甘草 7mg",
      "Source of Capsule Shell: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used to reduce phlegm. 传统上用于化痰。"
    ],
    "dosage": [
      "Adults: Take 3-4 capsules after meal, twice a day. Or as directed by doctor or pharmacist. 成人：饭后服用，每日 2次，每次 3-4粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. Take note that this product contains substances of animal origin.",
      "请注意，本产品含有动物来源的成分。",
      "3. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "4. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "cordyceps-rhodiola-rosea-capsule": {
    "ingredients": [
      "Each 500mg vegetable capsule contains:",
      "Cordyceps Militaris Fruiting Body 蛹虫草 200mg",
      "Radix Rhodiola Rosea Extract红景天100mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for health and strengthening the body.",
      "传统上用于维护健康及强身健体。"
    ],
    "dosage": [
      "Adults: Take 2 vegetable capsules after meal, twice a day. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "restore-capsule": {
    "ingredients": [
      "Each 501.2 mg vegetable capsule contains:",
      "Radix Et Rhizoma Panax Notoginseng 三七 58.7mg",
      "Radix Et Rhizoma Salvia Miltiorrhiza Extract 丹参 75mg",
      "Rhizoma Ligusticum Chuanxiong Extract 川芎 25mg",
      "Radix Angelica Sinensis Extract 当归 10mg",
      "Radix Astragalus Membranaceus Extract 黄芪 25mg",
      "Radix Panax Quinquefolius 西洋参 150mg",
      "Radix Ophiopogon Japonicus Extract 麦冬 120mg",
      "Fructus Schisandra Chinensis Extract 五味子 37.5mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for improving blood circulation. 传统上用于改善血液循环。"
    ],
    "dosage": [
      "Adults: 3-4 vegetable capsules after meal, twice a day. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次 3-4粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated for pregnant women. Safe use for lactating women and children has not been established.",
      "孕妇禁用；哺乳期妇女和儿童的安全使用尚未明确。",
      "2. Do not exceed the stated dose. Be aware that the safety of long-term use has not been established.",
      "请勿超过规定剂量；此药物长期使用的安全性尚未明确",
      "3. Consult a doctor or pharmacist before taking this traditional medicine, and keep it out of reach of children.",
      "服用此传统药物前请咨询医生或药剂师，并务必置于儿童接触不到的地方。",
      "4. Store below 30°C, protect from light and moisture, and close the bottle tightly after opening.",
      "存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧"
    ]
  },
  "womens-treasure-capsule": {
    "ingredients": [
      "Each 500mg capsule contains:",
      "Semen Cuscuta Chinensis Extract 菟丝子 39.58mg",
      "Herba Taxillus Chinensis Extract 桑寄生 39.58mg",
      "Radix Dipsacus Asperoides Extract 川续断 38mg",
      "Colla Corii Asini (Equus asinus) 阿胶 47.5mg",
      "Rhizoma Atractylodes Macrocephala Extract 白术 38mg",
      "Radix Codonopsis Pilosula Extract 党参 23.75mg",
      "Pericarpium Citrus Reticulata Extract 陈皮 23.75mg",
      "Radix Et Rhizoma Glycyrrhiza Uralensis 甘草 95mg",
      "Radix Angelicae Sinensis Extract 当归 39.58mg",
      "Radix Paeonia Lactiflora Alba Extract 白芍 39.58mg",
      "Fructus Lycium Barbarum Extract 枸杞子 51.93mg",
      "Fructus Schisandra Chinensis Extract 五味子 23.75mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for women's health. 传统上用于女性健康。"
    ],
    "dosage": [
      "Adults: Take 2 capsules each time, twice a day after meal. Or as directed by doctor or pharmacist. 成人：饭后服用，每日 2次，每次 2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "revital-essence-capsule": {
    "ingredients": [
      "Each 320 mg vegetable capsule contains:",
      "Cordyceps Militaris Fruiting Body 北虫草 100mg",
      "Radix Panax Quinquefolius Extract 西洋参 75mg",
      "Radix Et Rhizoma Panax Notoginseng Extract田七 92.3mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for general health. 传统上用于一般健康。"
    ],
    "dosage": [
      "Adults: Take 2 capsules each time, twice a day after meal. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated for pregnant women. Safe use for lactating women and children has not been established.",
      "孕妇禁用；哺乳期妇女和儿童的安全使用尚未明确。",
      "2. Do not exceed the stated dose. Be aware that the safety of long-term use has not been established.",
      "请勿超过规定剂量；此药物长期使用的安全性尚未明确。",
      "3. Consult a doctor or pharmacist before taking this traditional medicine, and keep it out of reach of children.",
      "服用此传统药物前请咨询医生或药剂师，并务必置于儿童接触不到的地方。",
      "4. Store below 30°C, protect from light and moisture, and close the bottle tightly after opening.",
      "存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "grape-seed-extract-300mg": {
    "ingredients": [
      "Each 300 mg vegetable capsule contains:",
      "Semen Vitis Vinifera (Grape Seed) Extract 葡萄籽萃取物 300mg",
      "Source of Capsule Shell: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for general health maintenance. 传统上用于维持身体健康。"
    ],
    "dosage": [
      "Adults: 1 capsule after meal, once a day. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 1次，每次1粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "hawthorn-cassia-seed-plus": {
    "ingredients": [
      "Each 300mg vegetable capsule contains:",
      "Fructus Crataegus Pinnatifida Extract 山楂 50mg",
      "Semen Cassia Tora Extract 决明子 50mg",
      "Radix Astragalus Membranaceus Extract 黄芪 30mg",
      "Rhizoma Atractylodes Macrocephala Extract 白术 50mg",
      "Radix Polygonum Multiflorum Extract 何首乌 20mg",
      "Semen Monascus Purpureus 红曲 50mg",
      "Folium Nelumbo Nucifera Extract荷叶50mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for general health. 传统上用于一般健康。"
    ],
    "dosage": [
      "Adult: Take 1 vegetable capsule after meal, twice a day. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次1粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. This product contains natural lovastatin. Strictly do not use if you are already taking statins. Avoid concurrent use with fibrates, as it may cause severe muscle issues (myositis) and kidney-related risks (myoglobinuria).",
      "本品含有天然洛伐他汀。若您正在服用其他他汀类药物（降脂药），请勿服用本品。避免与贝特类药物同服，以免引起严重的肌炎和肌红蛋白尿。",
      "2. Do not use if pregnant, breastfeeding, or if you are experiencing abdominal pain, nausea, or vomiting.",
      "孕妇、哺乳期妇女，以及出现腹痛、恶心或呕吐症状者请勿使用。",
      "3. Stop using immediately if you experience allergies, lethargy, or muscle aches. Consult a healthcare provider if using beyond 7 days; prolonged use risks product dependence and electrolyte imbalance.",
      "若出现过敏、乏力或全身/肌肉酸痛，请立即停用。连续使用超过7天请先咨询医护人员；频繁或长期使用会导致药物依赖及电解质失衡。",
      "4. Consult a doctor or pharmacist before use, and keep out of reach of children. Store below 30°C, protect from light and moisture, and close the bottle tightly after opening.",
      "服用此传统药物前请咨询医生或药剂师，并置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "mu-gua-guan-jie-capsule": {
    "ingredients": [
      "Each capsule 300mg contains:",
      "Fructus Chaenomeles Speciosa Extract 木瓜 21.25mg",
      "Radix Achyranthes Bidentata Extract 牛膝 26.56mg",
      "Caulis Trachelospermum Jasminoides Extract 络石藤 17.00mg",
      "Caulis Lonicera Japonica Extract 忍冬藤 8.50mg",
      "Caulis Piper Kadsura Extract 海风藤 17.00mg",
      "Caulis Spatholobus Suberectus Extract 鸡血藤 17.00mg",
      "Cordyceps Militaris Fruiting Body 北冬虫夏草 17.00mg",
      "Herba Taxillus Chinensis Extract 桑寄生 17.00mg",
      "Radix Paeonia Lactiflora (Alba) Extract 白芍 8.50mg",
      "Cortex Eucommia Ulmoides Extract 杜仲 8.92mg",
      "Os Fossilia Ossis Mastodi Extract 龙骨 17.00mg",
      "Concha Ostrea Gigas Extract 牡蛎 17.00mg",
      "Rhizoma Curcuma Longa Extract 姜黄 44.74mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for women's health. 传统上用于女性健康。"
    ],
    "dosage": [
      "Adults: Take 3 capsules each time, twice a day after meal. Or as directed by a doctor or pharmacist. 成人：饭后服用，每日 2次，每次3粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. Take note that this product contains substances of animal origin.",
      "请注意，本产品含有动物来源的成分。",
      "3. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "4. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "natto-complex-capsule": {
    "ingredients": [
      "Each 300mg capsule contains:",
      "Radix Salvia Miltiorrhiza Extract 丹参 50mg",
      "Folium Ginkgo Biloba 银杏叶 50mg",
      "Semen Glycine Max Extract 纳豆 30mg",
      "Semen Monascus Purpureus Extract 红曲50mg",
      "Radix Panax Notoginseng Extract 三七30mg",
      "Rhizoma Atractylodes Macrocephala Extract 白术30mg",
      "Rhizoma Alisma Orientale Extract 泽泻30mg",
      "Folium Camellia Sinensis Extract 绿茶30mg",
      "Source of Capsule: Vegetable.植物胶囊"
    ],
    "function": [
      "Traditionally used for general health. 传统上用于一般健康。"
    ],
    "dosage": [
      "Adults: Take 2 capsules once a day after meal. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日1次，每次2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. This product contains natural lovastatin. Do NOT use if you are taking other statins. Avoid concurrent use with fibrates, as it may cause severe muscle and kidney damage (myositis and myoglobinuria). Stop use immediately if you experience allergies, lethargy, or muscle aches.",
      "本品含天然洛伐他汀。若正在服用其他他汀类药物，请勿服用本品；避免与贝特类药物同服（可能导致严重的肌炎和肌红蛋白尿）。若出现过敏、乏力或全身/肌肉酸痛，请立即停用。",
      "2. Ginkgo increases the tendency of bleeding. Consult a doctor if you are taking or starting other medications, and before undergoing any surgical or dental procedures.",
      "银杏会增加出血倾向。若您正在或准备服用其他药物，以及在进行任何外科或牙科手术前，请务必咨询医生。",
      "3. Strictly contraindicated for pregnant women. Safe use for lactating women and children has not been established.",
      "孕妇绝对禁用；哺乳期妇女和儿童的安全使用尚未明确。",
      "4. Consult a healthcare provider before use. Do not exceed the stated dose, as long-term safety is unknown. Keep out of reach of children, store below 30°C, and protect from light and moisture.",
      "服用前请咨询医护人员，且请勿超量服用（长期使用的安全性尚未明确）。务必置于儿童接触不到的地方，存放于30°C以下，注意避光防潮。"
    ]
  },
  "pain-relief": {
    "ingredients": [
      "Each 550mg capsule contains:",
      "Semen Prunus Persica Extract 桃仁 55mg",
      "Flos Carthamus Tinctorius Extract 红花 55mg",
      "Scolopendra Subspinipes (Whole Body) 蜈蚣 36.3mg",
      "Scorpio Buthus Martensii (Whole Body) 全蝎 36.3mg",
      "Bombyx Batryticatus (Whole Larva Bombyx Mori) 僵蚕 36.3mg",
      "Zaocys Dhumnades (Whole Body) 木梢蛇 36.3mg",
      "Rhizoma Et Radix Polygonum Cuspidatum Extract 虎杖 55mg",
      "Radix Angelica Sinensis Extract 当归 36.96mg",
      "Rhizoma Ligusticum Chuanxiong Extract 川芎 36.96mg",
      "Radix Rehmannia Glutinosa Extract 生地黄 36.96mg",
      "Radix Paeonia Lactiflora Alba Extract 白芍 36.96mg",
      "Taxillus Chinensis (Branch with Leaf) Extract 桑寄生 55mg",
      "Cortex Eucommia Ulmoides Extract 杜仲 36.96mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used to relief pain. 传统上用于止痛"
    ],
    "dosage": [
      "Adults: 2 capsules to be taken after meal, twice a day. Or as directed by doctor or pharmacist. 成人：饭后服用，每日 2次，每次2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. Take note that this product contains substances of animal origin.",
      "请注意，本产品含有动物来源的成分。",
      "3. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "4. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "perilla-oil-soft-gel-capsule": {
    "ingredients": [
      "Each soft gel 500mg contains:",
      "Perilla Frutescens Seed Oil Extract 紫苏籽油 500mg",
      "Source of Capsule: Vegetable softgel. 植物软胶囊。"
    ],
    "function": [
      "Traditionally used for general health. 传统上用于一般健康。"
    ],
    "dosage": [
      "Adults: 2 capsules after meal, twice a day. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "seaweed-calcium-plus": {
    "ingredients": [
      "Each 300mg vegetable capsule contains:",
      "Lithothamnion Calcareum 红藻钙 200mg",
      "- Providing 64mg of Calcium and 4.4mg of Magnesium",
      "Curcuma Longa Root Extract",
      "- Providing 95mg of Curcuminoids姜黄根提取物100mg",
      "Source of Capsule: Vegetable. 植物胶囊。"
    ],
    "function": [
      "Used as a Health Supplement. 作为保健品使用"
    ],
    "dosage": [
      "Adults: Take 1 vegetable capsule after meal, once a day. Or as directed by doctor or pharmacist. 成人：饭后服用，每日 1次，每次1粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "natural-sleep-ease-capsule": {
    "ingredients": [
      "Each 551.12mg capsule contains:",
      "Ganoderma Lucidum (Fruiting Body) Extract 灵芝 48.13mg",
      "Semen Platycladus Orientalis Extract 柏子仁 24.06mg",
      "Rhizoma Coptis Chinensis 黄连 38.5mg",
      "Semen Zizyphus Spinosa Extract 酸枣仁 57.75mg",
      "Cortex Albizia Julibrissin Extract 合欢皮 77mg",
      "Radix Cucurma Aromatica Extract 郁金 24.06mg",
      "Caulis Polygonum Multiflorum Extract 夜交藤 22.65mg",
      "Radix Polygala Tenuifolia Extract 远志 47.67mg",
      "Rhizoma Acorus Tatarinowii Extract 石菖蒲 47.67mg",
      "Fructus Triticum Aestivum Extract 浮小麦 115.5mg",
      "Radix Et Rhizoma Glycyrrhiza Uralensis Extract 炙甘草 19.25mg",
      "Fructus Zizyphus Jujuba Extract 大枣 28.88mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for sleep difficulty. 传统上用于睡眠困难。"
    ],
    "dosage": [
      "Adult: Take 2 capsules each time, twice a day after meal. Or as directed by doctor or pharmacist. 成人：饭后服用，每日 2次，每次2粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. This product contains berberine. Strictly do not use for babies, children under 12 years of age, pregnant women, or lactating mothers.",
      "本品含有小檗碱（Berberine）。婴儿、12岁以下儿童、孕妇及哺乳期妇女严禁服用。",
      "2. Consult a doctor before use if you have G6PD deficiency, haemolytic anemia, glaucoma, diabetes, high blood pressure, a history of cardiovascular disease, OR if you are taking chemotherapy drugs (such as Paclitaxel or Cyclosporin).",
      "若患有G6PD缺乏症（蚕豆病）、溶血性贫血、青光眼、糖尿病、高血压、心血管疾病史，或正在使用紫杉醇（Paclitaxel）、环孢素（Cyclosporin）等化疗药物，服用前请务必咨询医生。",
      "3. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen, and keep out of reach of children.",
      "此为传统药物，若症状持续或恶化请就医。请务必置于儿童接触不到的地方。",
      "4. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "v-strength-capsule": {
    "ingredients": [
      "Each 480mg capsule contains:",
      "Rhizoma Alisma Orientale Extract 泽泻 35mg",
      "Radix Rehmannia Glutinosa Extract 地黄 50mg",
      "Rhizoma Dioscorea Opposita Extract 山药 25mg",
      "Sclerotium Poria Cocos Extract 茯苓 25mg",
      "Cortex Paeonia Suffruticosa Extract 牡丹皮 25mg",
      "Cortex Cinnamomum Cassia Extract 肉桂 25mg",
      "Fructus Cornus Officinalis Extract 山萸肉 66mg",
      "Fructus Morus Alba Extract 桑椹 24mg",
      "Semen Trigonella Foenum-graecum Extract 胡芦巴 25mg",
      "Aspongopus Chinensis Dried Body 九香虫 60mg",
      "Radix Trichosanthes Kirilowii Extract 天花粉 50mg",
      "Ramulus Cinnamomum Cassia Extract 桂枝 35mg",
      "Radix Morinda Officinalis Extract 巴戟天 35mg",
      "Source of Capsule Shell: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used for general health. 传统上用于一般健康。"
    ],
    "dosage": [
      "Adults: Take 3-4 capsules after meal, twice a day. Or as directed by doctor or pharmacist. 成人：饭后服用，每日 2次，每次3-4粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. Take note that this product contains substances of animal origin.",
      "请注意，本产品含有动物来源的成分。",
      "3. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "4. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "cough-ease-capsule": {
    "ingredients": [
      "Each 488 mg vegetable capsule contains:",
      "Radix Astragalus Membranaceus Extract 黄芪 72mg",
      "Rhizoma Atractylodes Macrocephala Praeparata Extract 炒白术 40mg",
      "Rhizoma Atractylodes Lancea Extract 苍术 40mg",
      "Radix Saposhnikovia Divaricata Extract 防风 48mg",
      "Herba Eupatorium Fortunei Extract 佩兰 48mg",
      "Radix Et Rhizoma Rhodiola Crenulata Extract 红景天 40mg",
      "Herba Houttuynia Cordata Extract 鱼腥草 40mg",
      "Rhizoma Et Radix Polygonum Cuspidatum Extract 虎杖 40mg",
      "Exocarpium Citrus Reticulata Rubrum Extract 橘红 40mg",
      "Spina Gleditsia Sinensis Extract 皂角刺 40mg",
      "Herba Verbena Officinalis Extract 马鞭草 40mg",
      "Source of Capsule: Vegetable. 植物胶囊"
    ],
    "function": [
      "Traditionally used to relieve cough. 传统上用于缓解咳嗽。"
    ],
    "dosage": [
      "Adults: 3 capsules to be taken, twice a day after meal. Or as directed by doctor or pharmacist.",
      "成人：饭后服用，每日 2次，每次3粒。或遵医生或药剂师嘱咐。"
    ],
    "additional": [
      "1. Contraindicated (strictly do not use) for pregnant women; insufficient safety data for breastfeeding women.",
      "孕妇禁用；哺乳期妇女缺乏可靠的安全数据。",
      "2. This is a traditional medicine. Consult a doctor or pharmacist if your symptoms persist or worsen.",
      "此为传统药物，若症状持续或恶化，请务必咨询医生或药剂师。",
      "3. Keep out of reach of children. Store below 30°C, protect from light and moisture, and ensure the bottle is closed tightly after opening.",
      "请置于儿童接触不到的地方。存放于30°C以下，注意避光防潮，每次开封使用后请将瓶盖拧紧。"
    ]
  },
  "harmony-wellness-capsule": {
    "ingredients": [],
    "function": [],
    "dosage": [],
    "additional": []
  }
});

const app = document.querySelector("#app");
const nav = document.querySelector("#siteNav");
const menuButton = document.querySelector("#menuButton");

const storeKey = "petsCharityAdminMvpV3";
const today = "2026-05-23";

const baseDonations = [
  ["林雅萱", 2000, "冬季醫療與保暖基金", "銀行轉帳", "待對帳"],
  ["李柏翰", 1000, "冬季醫療與保暖基金", "ATM", "已對帳"],
  ["王心怡", 3600, "犬舍修繕計畫", "信用卡", "收據待開"],
  ["陳俊廷", 500, "流浪犬伙食基金", "信用卡", "已對帳"]
];

const db = {
  adminAuth: { username: "admin", password: "admin" },
  adminUsers: [
    { name: "財務人員", username: "finance", password: "finance123", permissions: ["dashboard", "reports", "donations", "expenses", "accounting", "receipts", "invoice"] },
    { name: "服務人員", username: "service", password: "service123", permissions: ["dashboard", "farewell", "dogs", "content", "social"] }
  ],
  shopSettings: { freeShippingThreshold: 1000, shippingFee: 80 },
  dogs: [
    { id: "D-001", name: "阿福", age: "2 歲", status: "開放認養", area: "新北", breed: "米克斯", photos: ["assets/dogs/afu-01.png", "assets/dogs/afu-02.png"] },
    { id: "D-002", name: "米香", age: "8 歲", status: "醫療觀察", area: "桃園", breed: "米克斯", photos: ["assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png"] },
    { id: "D-003", name: "黑糖", age: "4 歲", status: "開放認養", area: "台北", breed: "米克斯", photos: ["assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png"] }
  ],
  products: [
    { id: "P-101", slug: "canvas-walk-bag", name: "公益帆布散步袋", category: "公益周邊", price: 680, stock: 42, status: "上架中", invoiceType: "電子發票", photos: ["assets/products/canvas-bag-01.png", "assets/products/canvas-bag-02.png"] },
    { id: "P-102", slug: "dog-postcards", name: "救援犬明信片組", category: "文創商品", price: 220, stock: 128, status: "上架中", invoiceType: "電子發票", photos: ["assets/products/postcards-01.png", "assets/products/postcards-02.png"] }
  ],
  stories: [
    { id: "story-01", title: "黑糖的心絲蟲治療之路", date: "2026-05-08", tag: "重症醫療", summary: "黑糖需要穩定治療與長期追蹤。", image: "assets/stories/story-01.png", photos: ["assets/stories/story-01.png", "assets/stories/story-01-02.png"] },
    { id: "story-02", title: "老犬暖冬床墊募集", date: "2026-04-22", tag: "物資募集", summary: "替高齡犬補足保暖與清潔耗材。", image: "assets/stories/story-02.png", photos: ["assets/stories/story-02.png", "assets/stories/story-02-02.png"] }
  ],
  donations: Array.from({ length: 400 }, (_, index) => {
    const sample = baseDonations[index % baseDonations.length];
    const n = index + 1;
    const day = String((index % 28) + 1).padStart(2, "0");
    return {
      no: `DN202605${String(n).padStart(5, "0")}`,
      paidAt: `2026-05-${day}`,
      name: sample[0],
      amount: sample[1],
      campaign: sample[2],
      method: sample[3],
      subject: sample[2].includes("醫療") ? "4101 指定用途捐款收入-醫療救援" : "4100 一般捐款收入",
      receiptNo: sample[4] === "收據待開" ? "待開立" : `R202605${String(n).padStart(5, "0")}`,
      receiptType: "年度收據",
      status: sample[4]
    };
  }),
  expenses: Array.from({ length: 135 }, (_, index) => {
    const n = index + 1;
    const day = String((index % 28) + 1).padStart(2, "0");
    const project = ["醫療救援", "犬舍修繕", "善終服務"][index % 3];
    return {
      no: `EX202605${String(n).padStart(3, "0")}`,
      date: `2026-05-${day}`,
      project,
      item: ["心絲蟲治療藥物", "保暖床墊與清潔耗材", "火化與接送費用"][index % 3],
      vendor: ["安心動物醫院", "毛孩用品社", "暖光生命禮儀"][index % 3],
      amount: [12800, 34200, 5800][index % 3],
      subject: ["5101 醫療支出", "5201 物資支出", "5401 善終服務支出"][index % 3],
      proof: ["已附憑證", "待補件"][index % 2],
      publish: ["公開", "待審核", "不公開"][index % 3]
    };
  }),
  orders: Array.from({ length: 86 }, (_, index) => {
    const n = index + 1;
    const day = String((index % 28) + 1).padStart(2, "0");
    return {
      no: `OD202605${String(n).padStart(4, "0")}`,
      createdAt: `2026-05-${day}`,
      buyer: ["張以琳", "黃柏安", "蔡孟潔"][index % 3],
      item: ["公益帆布散步袋 x 1", "救援犬明信片組 x 2", "電子捐款禮包 x 1"][index % 3],
      total: [680, 440, 1280][index % 3],
      payment: ["信用卡", "ATM", "銀行轉帳"][index % 3],
      invoiceType: ["電子發票", "二聯式發票", "三聯式發票"][index % 3],
      invoiceStatus: ["待開立", "已開立", "作廢"][index % 3],
      status: ["待出貨", "已出貨", "已完成"][index % 3]
    };
  }),
  farewellCases: [
    { no: "FW202605001", date: "2026-05-21", location: "新北板橋收容點", type: "個別火化", service: "接送、毛毯、紀念卡", cost: 4200, status: "已完成" },
    { no: "FW202605002", date: "2026-05-17", location: "桃園中壢醫院", type: "集體火化", service: "接送與基本清潔", cost: 2600, status: "已完成" }
  ],
  socialChannels: [
    { channel: "Facebook", audience: "既有支持者", format: "圖文貼文", status: "已連線" },
    { channel: "Instagram", audience: "年輕認養族群", format: "限動 / Reels", status: "已連線" },
    { channel: "LINE VOOM", audience: "在地志工", format: "短文更新", status: "待設定" }
  ],
  socialQueue: [
    { story: "黑糖的心絲蟲治療之路", channels: "Facebook, Instagram", publishAt: "2026-05-24 20:00", goal: "醫療捐款募集", status: "已排程" },
    { story: "老犬暖冬床墊募集", channels: "LINE, Facebook", publishAt: "2026-05-28 19:00", goal: "物資募集", status: "草稿" }
  ],
  contentAnalytics: [
    { title: "黑糖的心絲蟲治療之路", topic: "重症醫療", views: 12840, donateClicks: 936, donations: 218, amount: 436000, conversion: "1.70%" },
    { title: "老犬暖冬床墊募集", topic: "物資募集", views: 7210, donateClicks: 448, donations: 128, amount: 116800, conversion: "1.78%" }
  ]
};

db.receipts = db.donations.map(donation => ({
  no: donation.receiptNo,
  donation: donation.no,
  title: donation.name,
  type: donation.receiptType,
  delivery: "Email",
  status: donation.status === "已對帳" ? "已寄送" : donation.receiptNo === "待開立" ? "待開立" : "待寄送"
}));

function loadLocalData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey) || "{}");
    ["dogs", "products", "stories", "donations", "expenses", "receipts", "orders", "farewellCases", "accountingRules", "adminUsers"].forEach(key => {
      if (Array.isArray(saved[key])) db[key] = saved[key];
    });
    ["adminAuth", "shopSettings"].forEach(key => {
      if (saved[key] && typeof saved[key] === "object" && !Array.isArray(saved[key])) {
        db[key] = { ...db[key], ...saved[key] };
      }
    });
  } catch {
    localStorage.removeItem(storeKey);
  }
}

function saveLocalData() {
  localStorage.setItem(storeKey, JSON.stringify({
    adminAuth: db.adminAuth,
    adminUsers: db.adminUsers,
    shopSettings: db.shopSettings,
    dogs: db.dogs,
    products: db.products,
    stories: db.stories,
    donations: db.donations,
    expenses: db.expenses,
    receipts: db.receipts,
    orders: db.orders
  }));
}

loadLocalData();

function safeList(value, fallback = []) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
  return fallback;
}

function normalizeData() {
  const dogFallback = ["assets/dogs/afu-01.png", "assets/dogs/afu-02.png", "assets/dogs/afu-03.png"];
  const productFallback = ["assets/products/canvas-bag-01.png"];
  const storyFallback = ["assets/stories/story-01.png", "assets/stories/story-01-02.png", "assets/stories/story-01-03.png"];
  db.dogs = safeList(db.dogs).map((dog, index) => ({
    id: dog.id || `D-${String(index + 1).padStart(3, "0")}`,
    name: dog.name || "未命名犬隻",
    breed: dog.breed || "米克斯",
    age: dog.age || "待確認",
    sex: dog.sex || "待確認",
    size: dog.size || "待確認",
    status: dog.status || "開放認養",
    area: dog.area || "待確認",
    intro: dog.intro || "後台尚未填寫犬隻介紹。",
    photos: safeList(dog.photos, dogFallback).length ? safeList(dog.photos, dogFallback) : dogFallback
  }));
  db.products = safeList(db.products).map((product, index) => ({
    id: product.id || `P-${String(index + 1).padStart(3, "0")}`,
    slug: product.slug || `product-${index + 1}`,
    name: product.name || "未命名商品",
    category: product.category || "公益商品",
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    status: product.status || "上架中",
    invoiceType: product.invoiceType || "義賣收據",
    desc: product.desc || "後台尚未填寫商品摘要。",
    detail: product.detail || product.desc || "後台尚未填寫商品介紹。",
    photos: safeList(product.photos, productFallback).length ? safeList(product.photos, productFallback) : productFallback
  }));
  db.stories = safeList(db.stories).map((story, index) => {
    const photos = safeList(story.photos, story.image ? [story.image] : storyFallback);
    return {
      id: story.id || `story-${String(index + 1).padStart(2, "0")}`,
      title: story.title || "未命名文章",
      date: story.date || today,
      tag: story.tag || "公告",
      summary: story.summary || "後台尚未填寫摘要。",
      image: story.image || photos[0] || storyFallback[0],
      photos: photos.length ? photos : storyFallback,
      body: safeList(story.body, [story.summary || "後台尚未填寫內文。"])
    };
  });
  ["donations", "expenses", "receipts", "orders", "adminUsers"].forEach(key => {
    db[key] = safeList(db[key]);
  });
}

normalizeData();

let activeAdmin = "dashboard";
let activeMemberId = "";
let adminLoggedIn = sessionStorage.getItem("charityAdminLoggedIn") === "true";
let currentAdminRole = sessionStorage.getItem("charityAdminRole") || "admin";
let currentAdminUsername = sessionStorage.getItem("charityAdminUsername") || db.adminAuth.username;
let adminModalState = null;

const emptyFilters = () => ({ keyword: "", dateFrom: "", dateTo: "", status: "", page: 1, perPage: 50 });
let appliedFilters = { donations: emptyFilters(), expenses: emptyFilters(), receipts: emptyFilters(), invoice: emptyFilters() };
let draftFilters = {
  donations: { ...appliedFilters.donations },
  expenses: { ...appliedFilters.expenses },
  receipts: { ...appliedFilters.receipts },
  invoice: { ...appliedFilters.invoice }
};

const adminLabels = {
  dashboard: "管理報表",
  reports: "統計報表",
  analytics: "議題分析",
  data: "資料中心",
  donations: "捐款管理",
  expenses: "支出管理",
  accounting: "會計分類",
  receipts: "捐款收據",
  farewell: "善終服務",
  dogs: "犬隻管理",
  content: "內容管理",
  social: "社群發布",
  products: "商品上架",
  orders: "訂單管理",
  invoice: "發票管理",
  settings: "系統設定"
};

const navGroups = [
  ["管理報表", ["dashboard", "reports", "analytics", "data"]],
  ["財務類", ["donations", "expenses", "accounting", "receipts"]],
  ["服務類", ["farewell", "dogs", "content", "social"]],
  ["業務類", ["products", "orders", "invoice"]],
  ["系統設定", ["settings"]]
];

const schemas = {
  dogs: {
    label: "犬隻",
    idKey: "id",
    defaults: () => ({ id: `D-${Date.now().toString().slice(-4)}`, name: "", age: "", status: "開放認養", area: "", breed: "", photos: [] }),
    fields: [["id", "編號", "text"], ["name", "姓名", "text"], ["breed", "品種", "text"], ["age", "年齡", "text"], ["status", "狀態", "select", ["開放認養", "醫療觀察", "暫停媒合"]], ["area", "地區", "text"], ["photos", "犬隻照片", "images"]]
  },
  products: {
    label: "商品",
    idKey: "id",
    defaults: () => ({ id: `P-${Date.now().toString().slice(-4)}`, slug: "", name: "", category: "", price: 0, stock: 0, status: "上架中", invoiceType: "電子發票", photos: [] }),
    fields: [["id", "商品編號", "text"], ["slug", "網址代稱", "text"], ["name", "商品名稱", "text"], ["category", "分類", "text"], ["price", "售價", "number"], ["stock", "庫存", "number"], ["status", "狀態", "select", ["上架中", "草稿", "售完", "下架"]], ["invoiceType", "發票 / 收據", "select", ["電子發票", "二聯式發票", "三聯式發票", "捐款收據"]], ["photos", "商品照片", "images"]]
  },
  stories: {
    label: "內容",
    idKey: "id",
    defaults: () => ({ id: `story-${Date.now().toString().slice(-4)}`, title: "", date: today, tag: "", summary: "", image: "", photos: [] }),
    fields: [["id", "內容 ID", "text"], ["title", "標題", "text"], ["date", "日期", "date"], ["tag", "議題", "text"], ["summary", "摘要", "textarea"], ["image", "封面照片", "image"], ["photos", "故事照片", "images"]]
  },
  donations: {
    label: "捐款",
    idKey: "no",
    defaults: () => ({ no: `DN${Date.now()}`, paidAt: today, name: "", amount: 0, campaign: "", method: "信用卡", subject: "", receiptNo: "待開立", receiptType: "年度收據", status: "待對帳" }),
    fields: [["no", "捐款編號", "text"], ["paidAt", "付款日期", "date"], ["name", "捐款人", "text"], ["amount", "金額", "number"], ["campaign", "專案", "text"], ["method", "付款方式", "select", ["信用卡", "ATM", "銀行轉帳"]], ["subject", "會計科目", "text"], ["receiptNo", "收據", "text"], ["status", "狀態", "select", ["待對帳", "已對帳", "收據待開"]]]
  },
  expenses: {
    label: "支出",
    idKey: "no",
    defaults: () => ({ no: `EX${Date.now()}`, date: today, project: "", item: "", vendor: "", amount: 0, subject: "", proof: "待補件", publish: "待審核" }),
    fields: [["no", "支出編號", "text"], ["date", "日期", "date"], ["project", "專案", "text"], ["item", "項目", "text"], ["vendor", "廠商", "text"], ["amount", "金額", "number"], ["subject", "會計科目", "text"], ["proof", "憑證", "select", ["已附憑證", "待補件"]], ["publish", "公開狀態", "select", ["公開", "待審核", "不公開"]]]
  },
  orders: {
    label: "訂單",
    idKey: "no",
    defaults: () => ({ no: `OD${Date.now()}`, createdAt: today, buyer: "", item: "", total: 0, payment: "信用卡", invoiceType: "電子發票", invoiceStatus: "待開立", status: "待出貨" }),
    fields: [["no", "訂單編號", "text"], ["createdAt", "訂單日期", "date"], ["buyer", "購買人", "text"], ["item", "品項", "textarea"], ["total", "金額", "number"], ["payment", "付款", "select", ["信用卡", "ATM", "銀行轉帳"]], ["invoiceType", "發票類型", "select", ["電子發票", "二聯式發票", "三聯式發票", "捐款收據"]], ["invoiceStatus", "發票狀態", "select", ["待開立", "已開立", "作廢"]], ["status", "訂單狀態", "select", ["待出貨", "已出貨", "已完成", "取消"]]]
  }
};

const money = value => `NT$ ${Number(value || 0).toLocaleString("zh-TW")}`;
const esc = value => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const badge = (text, type = "") => `<span class="status ${type}">${esc(text)}</span>`;
const sum = rows => rows.reduce((total, item) => total + Number(item.amount || item.total || item.cost || 0), 0);

function pageShell(title, intro, body) {
  return `<section class="section"><div class="section-header"><div><span class="tag">暖屋犬舍</span><h2>${title}</h2><p>${intro}</p></div></div>${body}</section>`;
}

function home() {
  const donationTotal = sum(db.donations);
  return `<section class="hero"><div class="hero-inner"><p class="eyebrow">透明公益 / 犬隻救援 / 認養媒合</p><h1>讓每一隻流浪犬，都能被好好接住。</h1><p>暖屋犬舍整合捐款、醫療、認養、公益商品與善終陪伴，讓支持者看得見每一筆資源流向。</p><div class="hero-actions"><a class="button" href="#donate">立即捐款</a><a class="button ghost" href="#dogs">看看犬隻</a></div></div></section><section class="section"><div class="grid cols-4"><article class="metric"><strong>${db.dogs.length}</strong><span>照護犬隻</span></article><article class="metric"><strong>${money(donationTotal)}</strong><span>累計捐款</span></article><article class="metric"><strong>${db.stories.length}</strong><span>救援故事</span></article><article class="metric"><strong>${db.orders.length}</strong><span>公益訂單</span></article></div></section>${storiesSection()}${dogsSection(true)}${shopSection(true)}`;
}

function storiesSection() {
  return pageShell("救援故事", "用故事追蹤每個專案的近況、照片與後續需求。", `<div class="grid cols-3">${db.stories.map(story => `<article class="card"><img src="${esc(story.image || story.photos?.[0] || "")}" alt="${esc(story.title)}"><div class="card-body"><span class="tag">${esc(story.tag)}</span><h3>${esc(story.title)}</h3><p>${esc(story.summary)}</p><a class="button secondary" href="#donate">支持這個專案</a></div></article>`).join("")}</div>`);
}

function donatePage() {
  return pageShell("我要捐款", "選擇專案與付款資訊，後台會同步建立捐款與收據管理資料。", `<form class="panel donation-form" id="frontDonationForm"><div class="form-grid"><div class="field"><label>捐款人</label><input id="frontDonorName" required></div><div class="field"><label>金額</label><input id="frontDonationAmount" type="number" value="1000" required></div><div class="field"><label>專案</label><select id="frontDonationCampaign"><option>冬季醫療與保暖基金</option><option>犬舍修繕計畫</option><option>流浪犬伙食基金</option></select></div><div class="field"><label>付款方式</label><select id="frontDonationMethod"><option>信用卡</option><option>ATM</option><option>銀行轉帳</option></select></div></div><button class="button" type="submit">送出捐款</button><div class="donation-result" id="frontDonationResult" hidden></div></form><div class="grid cols-3" style="margin-top:22px">${["醫療救援", "犬舍修繕", "伙食照護"].map(name => `<article class="panel"><h3>${name}</h3><p>款項會在後台依專案、日期與狀態追蹤，方便後續對帳與開立收據。</p></article>`).join("")}</div>`);
}

function farewellPage() {
  return pageShell("善終服務", "協助通報、接送、火化與紀念流程，讓離別有紀錄也有尊重。", `<div class="report-grid"><div class="panel"><h2>服務流程</h2><ol class="impact-list"><li>接獲通報與基本資料確認</li><li>安排接送、醫療或火化合作單位</li><li>建立費用與公開紀錄</li><li>回報家屬或通報者處理結果</li></ol></div><div class="panel"><h2>近期案件</h2>${table(["日期", "地點", "類型", "費用", "狀態"], db.farewellCases.map(item => [item.date, item.location, item.type, money(item.cost), badge(item.status)]))}</div></div>`);
}

function dogsSection(compact = false) {
  const cards = db.dogs.map(dog => `<article class="card"><img src="${esc(dog.photos?.[0] || "")}" alt="${esc(dog.name)}"><div class="card-body"><span class="tag">${esc(dog.status)}</span><h3>${esc(dog.name)}</h3><p>${esc(dog.age)} / ${esc(dog.area)} / ${esc(dog.breed)}</p><a class="button secondary" href="#donate">支持照護</a></div></article>`).join("");
  const body = `<div class="grid cols-3">${cards}</div>`;
  return compact ? pageShell("等待家的犬隻", "認養前可先了解年齡、地區與健康狀態。", body) : pageShell("犬隻認養", "支援認養媒合與照護追蹤，後台可新增照片並即時預覽。", body);
}

function shopSection(compact = false) {
  const body = `<div class="grid cols-3">${db.products.map(product => `<article class="card"><img src="${esc(product.photos?.[0] || "")}" alt="${esc(product.name)}"><div class="card-body"><span class="tag">${esc(product.category)}</span><h3>${esc(product.name)}</h3><p>${money(product.price)} / 庫存 ${product.stock}</p><button class="button secondary" type="button">加入支持</button></div></article>`).join("")}</div>`;
  return compact ? pageShell("公益商品", "商品收入用於犬舍日常照護與醫療支出。", body) : pageShell("公益商城", "公益商品、訂單與發票資料會在後台業務類集中管理。", body);
}

function volunteerPage() {
  return pageShell("志工合作", "歡迎協助犬舍清潔、陪伴散步、物資整理、活動攝影與社群內容。", `<div class="grid cols-3">${["犬舍照護", "活動支援", "內容協作"].map(item => `<article class="panel"><h3>${item}</h3><p>留下可協助時段與專長，由服務人員安排後續聯繫。</p><button class="button secondary" type="button">我要加入</button></article>`).join("")}</div>`);
}

const restoreDogs = [
  { id: "D-001", name: "阿福", breed: "台灣犬混種", age: "2 歲", sex: "公", size: "中型", status: "開放認養", area: "新北", intro: "親人、會坐下，適合有固定作息的家庭。", photos: ["assets/dogs/afu-01.png", "assets/dogs/afu-02.png", "assets/dogs/afu-03.png"] },
  { id: "D-002", name: "米香", breed: "米克斯幼犬", age: "8 個月", sex: "母", size: "小中型", status: "醫療觀察", area: "桃園", intro: "活潑黏人，完成疫苗後可安排互動。", photos: ["assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png", "assets/dogs/mixiang-03.png"] },
  { id: "D-003", name: "黑糖", breed: "拉布拉多混種", age: "4 歲", sex: "母", size: "中大型", status: "開放認養", area: "台中", intro: "穩定溫柔，散步牽繩表現很好。", photos: ["assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png", "assets/dogs/heitang-03.png"] },
  { id: "D-004", name: "小路", breed: "虎斑米克斯", age: "1 歲", sex: "公", size: "中型", status: "中途安置", area: "台南", intro: "曾在車站附近救援，正在練習信任人。", photos: ["assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-03.png"] },
  { id: "D-005", name: "奶茶", breed: "黃金獵犬混種", age: "3 歲", sex: "母", size: "大型", status: "開放認養", area: "新竹", intro: "親人穩定，喜歡被梳毛，適合有散步習慣的家庭。", photos: ["assets/dogs/afu-02.png", "assets/dogs/afu-03.png", "assets/dogs/afu-01.png"] },
  { id: "D-006", name: "波波", breed: "柴犬混種", age: "5 歲", sex: "公", size: "中型", status: "行為觀察", area: "苗栗", intro: "有一點慢熟，熟悉後會主動靠近，適合有耐心的照顧者。", photos: ["assets/dogs/heitang-02.png", "assets/dogs/heitang-03.png", "assets/dogs/heitang-01.png"] },
  { id: "D-007", name: "雪球", breed: "瑪爾濟斯混種", age: "6 歲", sex: "母", size: "小型", status: "開放認養", area: "台北", intro: "安靜親人，適合公寓生活，目前已完成牙齒檢查。", photos: ["assets/dogs/mixiang-02.png", "assets/dogs/mixiang-03.png", "assets/dogs/mixiang-01.png"] },
  { id: "D-008", name: "可可", breed: "貴賓犬混種", age: "2 歲", sex: "母", size: "小型", status: "開放認養", area: "彰化", intro: "喜歡互動和玩具，會基本等待指令，適合新手家庭。", photos: ["assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-03.png", "assets/dogs/xiaolu-01.png"] },
  { id: "D-009", name: "栗子", breed: "柯基混種", age: "3 歲", sex: "公", size: "中小型", status: "開放認養", area: "嘉義", intro: "短腿愛散步，食慾穩定，需要控制體重與規律運動。", photos: ["assets/dogs/afu-03.png", "assets/dogs/afu-01.png", "assets/dogs/afu-02.png"] },
  { id: "D-010", name: "豆花", breed: "邊境牧羊犬混種", age: "1 歲", sex: "母", size: "中型", status: "訓練中", area: "高雄", intro: "聰明活潑，需要充足活動量，適合願意陪牠學習的家庭。", photos: ["assets/dogs/heitang-03.png", "assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png"] },
  { id: "D-011", name: "麻糬", breed: "比熊犬混種", age: "4 歲", sex: "公", size: "小型", status: "醫療觀察", area: "屏東", intro: "皮膚治療接近完成，個性溫和，適合室內陪伴生活。", photos: ["assets/dogs/mixiang-03.png", "assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png"] },
  { id: "D-012", name: "斑斑", breed: "米格魯混種", age: "5 歲", sex: "母", size: "中型", status: "開放認養", area: "宜蘭", intro: "嗅聞探索慾強，散步時很專注，適合喜歡戶外的家庭。", photos: ["assets/dogs/xiaolu-03.png", "assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-02.png"] },
  { id: "D-013", name: "海苔", breed: "黑色米克斯", age: "2 歲", sex: "公", size: "中型", status: "開放認養", area: "花蓮", intro: "外表酷但內心黏人，熟悉環境後會主動討摸。", photos: ["assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png", "assets/dogs/heitang-03.png"] },
  { id: "D-014", name: "芋圓", breed: "臘腸犬混種", age: "7 歲", sex: "母", size: "小型", status: "開放認養", area: "台東", intro: "步調慢、喜歡安靜陪伴，需要避免過度跳上跳下。", photos: ["assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png", "assets/dogs/mixiang-03.png"] },
  { id: "D-015", name: "旺來", breed: "哈士奇混種", age: "3 歲", sex: "公", size: "大型", status: "訓練中", area: "雲林", intro: "精力旺盛、表情豐富，需要穩定牽繩訓練和活動空間。", photos: ["assets/dogs/afu-01.png", "assets/dogs/afu-02.png", "assets/dogs/afu-03.png"] },
  { id: "D-016", name: "布丁", breed: "博美犬混種", age: "4 歲", sex: "母", size: "小型", status: "中途安置", area: "南投", intro: "警覺但不兇，正在練習不怕陌生人與外出聲音。", photos: ["assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-03.png"] },
  { id: "D-017", name: "橘子", breed: "秋田犬混種", age: "6 歲", sex: "公", size: "大型", status: "開放認養", area: "基隆", intro: "成熟穩重，適合有大型犬經驗、作息規律的家庭。", photos: ["assets/dogs/heitang-02.png", "assets/dogs/heitang-01.png", "assets/dogs/heitang-03.png"] },
  { id: "D-018", name: "芝麻", breed: "雪納瑞混種", age: "2 歲", sex: "母", size: "中小型", status: "開放認養", area: "台北", intro: "好奇心強，喜歡跟著人移動，適合願意陪伴互動的家庭。", photos: ["assets/dogs/mixiang-02.png", "assets/dogs/mixiang-01.png", "assets/dogs/mixiang-03.png"] },
  { id: "D-019", name: "木耳", breed: "牧羊犬混種", age: "5 歲", sex: "公", size: "中大型", status: "行為觀察", area: "新北", intro: "護家意識較高，需要有經驗的認養人慢慢建立信任。", photos: ["assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-03.png"] },
  { id: "D-020", name: "花生", breed: "巴哥犬混種", age: "8 歲", sex: "公", size: "小型", status: "高齡照護", area: "桃園", intro: "高齡但親人，適合安靜家庭，需定期追蹤呼吸與體重。", photos: ["assets/dogs/afu-02.png", "assets/dogs/afu-01.png", "assets/dogs/afu-03.png"] }
];

function restoreShell(title, intro, body, eyebrow = "Stray Dog Shelter Charity") {
  return `<section class="section"><div class="section-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${intro}</p></div></div>${body}</section>`;
}

let restoreDogPage = 1;

const restoreStoryRecords = [
  { id: "story-01", date: "2026-05-08", tag: "認養成功", title: "從工地到家庭，阿福學會安心睡覺", summary: "工地救援後完成醫療、減敏與試養，現在能在固定作息裡穩定生活。", amount: 68500, status: "已完成追蹤", photos: ["assets/stories/story-01.png", "assets/stories/story-01-02.png", "assets/stories/story-01-03.png"] },
  { id: "story-02", date: "2026-05-04", tag: "現場救援", title: "夜間通報後的橋下救援", summary: "志工接獲通報後到場誘捕，先安置、檢查皮膚狀況並安排後續治療。", amount: 42600, status: "治療中", photos: ["assets/stories/story-02.png", "assets/stories/story-02-02.png", "assets/stories/story-02-03.png"] },
  { id: "story-03", date: "2026-04-28", tag: "重症醫療", title: "黑糖的心絲蟲治療之路", summary: "黑糖需要長期追蹤，醫療基金支應檢查、藥物與回診費用。", amount: 93600, status: "穩定追蹤", photos: ["assets/stories/story-03.png", "assets/stories/story-03-02.png", "assets/stories/story-03-03.png"] },
  { id: "story-04", date: "2026-04-20", tag: "物資募集", title: "老犬暖冬床墊募集", summary: "高齡犬需要防滑、保暖與可清洗床墊，降低關節負擔與皮膚問題。", amount: 34800, status: "已採購", photos: ["assets/stories/story-04.png", "assets/stories/story-04-02.png", "assets/stories/story-04-03.png"] },
  { id: "story-05", date: "2026-04-12", tag: "中途照護", title: "小路從車站旁搬進中途家", summary: "小路對人仍緊張，先由中途家庭建立安全感，再逐步練習牽繩與外出。", amount: 22800, status: "中途安置", photos: ["assets/stories/story-05.png", "assets/stories/story-05-02.png", "assets/stories/story-05-03.png"] },
  { id: "story-06", date: "2026-04-03", tag: "訓練紀錄", title: "米香完成疫苗後開始社會化", summary: "幼犬米香完成基礎疫苗，開始接觸不同聲音、地面材質與陌生人。", amount: 18600, status: "開放互動", photos: ["assets/stories/story-06.png", "assets/stories/story-06-02.png", "assets/stories/story-06-03.png"] },
  { id: "story-07", date: "2026-03-25", tag: "善終紀錄", title: "街頭老犬的最後一程", summary: "善終基金協助接送、晶片掃描、安置與火化，讓無主犬也能被妥善告別。", amount: 12800, status: "已完成", photos: ["assets/stories/story-07.png", "assets/stories/story-07-02.png", "assets/stories/story-07-03.png"] },
  { id: "story-08", date: "2026-03-18", tag: "教育推廣", title: "校園生命教育與認養講座", summary: "帶著穩定犬隻進入校園，讓孩子理解認養、絕育與照護責任。", amount: 9600, status: "已辦理", photos: ["assets/stories/story-08.png", "assets/stories/story-08-02.png", "assets/stories/story-08-03.png"] },
  { id: "story-09", date: "2026-03-10", tag: "醫療追蹤", title: "奶茶的皮膚治療回診", summary: "奶茶經過藥浴、營養補充與環境清潔後，皮膚狀況已有明顯改善。", amount: 16400, status: "回診追蹤", photos: ["assets/stories/story-09.png", "assets/stories/story-09-02.png", "assets/stories/story-09-03.png"] },
  { id: "story-10", date: "2026-03-01", tag: "志工日誌", title: "週末犬舍清潔與散步日", summary: "志工協助清潔、洗曬墊料與陪伴散步，讓犬舍在高負荷下仍維持照護品質。", amount: 7200, status: "例行服務", photos: ["assets/stories/story-10.png", "assets/stories/story-10-02.png", "assets/stories/story-10-03.png"] }
];

function restoreCampaign(title, amount, goal, text) {
  const percent = Math.min(100, Math.round((amount / goal) * 100));
  return `<article class="card"><div class="card-body"><span class="tag">${percent}% 達成</span><h3>${title}</h3><p>${text}</p><div class="progress"><span style="width:${percent}%"></span></div><div class="between"><span>已募 NT$ ${amount.toLocaleString("zh-TW")}</span><span>目標 NT$ ${goal.toLocaleString("zh-TW")}</span></div><div class="actions"><a class="button" href="#donate">支持專案</a></div></div></article>`;
}

function restoreHome() {
  return `<section class="hero"><div class="hero-inner"><p class="eyebrow">Stray Dog Shelter Charity</p><h1>讓每一隻等待家的浪犬，被好好照顧到回家的那天</h1><p>整合救援、醫療、認養媒合、善終服務與公益義賣，讓捐款流向清楚、故事被看見、照護不中斷。</p><div class="hero-actions"><a class="button" href="#donate">立即捐款</a><a class="button secondary" href="#dogs">我要認養</a></div></div></section><section class="section"><div class="metric-grid"><div class="metric"><strong>52</strong><span>今年成功認養</span></div><div class="metric"><strong>${restoreDogs.length}</strong><span>等待家的狗狗</span></div><div class="metric"><strong>400</strong><span>公開捐款紀錄</span></div><div class="metric"><strong>135</strong><span>照護支出紀錄</span></div></div></section>`;
}

function restoreDogsPage() {
  return restoreShell("正在等待家的狗狗", "每張犬隻卡片都可延伸成詳細頁，包含健康狀態、品種、個性與認養資訊。", `<div class="dog-page-meta"><span>共 ${restoreDogs.length} 隻等待認養</span><span>前台資料已恢復顯示</span></div><div class="grid cols-4">${restoreDogs.map(dog => `<article class="card dog-card"><a class="dog-card-link" href="#dog-${dog.id}"><img class="dog-photo" src="${dog.photos[0]}" alt="${dog.name}主照片"></a><div class="card-body"><div class="between"><strong>${dog.id}</strong><span>${dog.area}</span></div><h3><a href="#dog-${dog.id}">${dog.name}</a></h3><p>${dog.intro}</p><div class="meta"><span class="tag">${dog.breed}</span><span class="tag">${dog.age}</span><span class="tag">${dog.sex}</span><span class="tag">${dog.size}</span><span class="tag">${dog.status}</span></div><div class="actions"><a class="button secondary" href="#dog-${dog.id}">看更多照片</a></div></div></article>`).join("")}</div>`, "Adoption");
}

function restoreDogDetail(dogId) {
  const dog = restoreDogs.find(item => item.id === dogId) || restoreDogs[0];
  return `<section class="section"><div class="dog-detail product-detail"><div><img class="product-main" id="dogMainImage" src="${dog.photos[0]}" alt="${dog.name}主照片"><div class="product-thumbs dog-detail-thumbs">${dog.photos.map((photo, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-dog-thumb="${photo}"><img src="${photo}" alt="${dog.name}照片 ${index + 1}"></button>`).join("")}</div><article class="product-description"><span class="tag">狗狗小檔案</span><h2>${dog.name} 正在等待一個家</h2><p>${dog.intro} 我們會先安排互動與照護說明，確認生活型態適合後再進入認養流程。</p><div class="product-points"><span>${dog.breed}</span><span>${dog.age}</span><span>${dog.size}</span><span>${dog.status}</span></div></article></div><div class="panel product-info"><a class="tag" href="#dogs">回等待家的狗狗</a><h1>${dog.name}</h1><p>${dog.intro}</p><div class="money-ledger"><div><span>編號</span><strong>${dog.id}</strong></div><div><span>地區</span><strong>${dog.area}</strong></div><div><span>品種</span><strong>${dog.breed}</strong></div><div><span>年齡</span><strong>${dog.age}</strong></div><div><span>性別</span><strong>${dog.sex}</strong></div><div><span>體型</span><strong>${dog.size}</strong></div><div><span>狀態</span><strong>${dog.status}</strong></div></div><div class="actions"><a class="button" href="#volunteer">預約認養</a><a class="button secondary" href="#dogs">看其他狗狗</a></div></div></div></section>`;
}

function restoreServiceIllustration(type) {
  const map = {
    report: ["assets/service-flow/report-confirmation.svg", "通報確認流程插畫"],
    pickup: ["assets/service-flow/pickup-care.svg", "接運安置流程插畫"],
    farewell: ["assets/service-flow/farewell-care.svg", "告別處理流程插畫"],
    public: ["assets/service-flow/public-ledger.svg", "費用公開流程插畫"]
  };
  const [src, alt] = map[type] || map.report;
  return `<img class="service-illustration-image" src="${src}" alt="${alt}">`;
}

function restoreFarewell() {
  const steps = [["01", "通", "通報確認", "記錄地點、照片、時間與安全狀態，必要時協調清潔隊或動保單位。", "report"], ["02", "接", "接運安置", "安排合作車輛接運，掃描晶片並查詢是否有飼主資料。", "pickup"], ["03", "別", "告別處理", "依狀況安排個別或集體火化，收容動物可保留紀念紀錄。", "farewell"], ["04", "公", "費用公開", "公開支出用途、供應商、金額與憑證狀態，保護個資後供查詢。", "public"]];
  return `<section class="section split"><div><p class="eyebrow">Farewell Care</p><h1>街頭與收容動物善終服務</h1><p>當路邊被車撞、無主死亡，或收容中心高齡病弱動物離世時，善終基金協助接運、晶片掃描、遺體安置、火化與公開紀錄，讓牠們最後一程也被尊重。</p><div class="hero-actions"><a class="button" href="#donate">支持善終基金</a><a class="button secondary" href="#volunteer">通報與聯絡</a></div></div><article class="panel"><span class="tag">100 位支持者</span><h2>街頭與收容動物善終基金</h2><p>協助路倒動物接運、遺體安置、個別或集體火化與紀念紀錄。</p><div class="progress"><span style="width:100%"></span></div><div class="between"><span>已募 NT$ 207,500</span><span>目標 NT$ 160,000</span></div></article></section><section class="section alt service-flow-section"><div class="section-header"><div><p class="eyebrow">Service Flow</p><h2>服務流程</h2><p>避免讓動物遺體長時間暴露，也保留必要紀錄與費用公開，讓捐款人知道每筆善款如何完成最後照護。</p></div></div><div class="service-flow">${steps.map(item => `<article class="service-step"><span class="step-number">${item[0]}</span><div class="service-illustration">${restoreServiceIllustration(item[4])}</div><div><span class="service-icon">${item[1]}</span><h3>${item[2]}</h3><p>${item[3]}</p></div></article>`).join("")}</div></section>`;
}

function restoreDonate() {
  const campaigns = [
    ["急難醫療基金", "讓救援犬在第一時間取得檢查、藥品與住院照護。", 207500, 260000],
    ["每月飼料與清潔", "支持園區日常飼料、清潔耗材與消毒作業。", 128800, 180000],
    ["善終服務基金", "支持街頭與收容動物最後一程的照護紀錄。", 207500, 160000]
  ];
  return restoreShell("捐款系統", "選擇專案、金額、捐款人資料、收據方式與付款方式，送出後會建立後台捐款與收據資料。", `<div class="donation-checkout"><div class="checkout-main"><div class="checkout-steps"><span class="active">1 選擇專案</span><span class="active">2 填寫資料</span><span class="active">3 確認送出</span></div><form class="checkout-form" id="frontDonationForm"><fieldset><legend>選擇支持專案</legend><div class="campaign-options">${campaigns.map((item, index) => `<label class="${index === 0 ? "selected" : ""}"><input type="radio" name="frontDonationCampaign" value="${item[0]}" ${index === 0 ? "checked" : ""}><strong>${item[0]}</strong><span>${item[1]}</span><small>已募 NT$ ${item[2].toLocaleString("zh-TW")} / 目標 NT$ ${item[3].toLocaleString("zh-TW")}</small></label>`).join("")}</div></fieldset><fieldset><legend>捐款金額</legend><div class="amount-options"><button type="button" data-donation-amount="500">NT$ 500</button><button type="button" data-donation-amount="1000">NT$ 1,000</button><button type="button" data-donation-amount="2000">NT$ 2,000</button><button type="button" data-donation-amount="3600">NT$ 3,600</button></div><div class="field" style="margin-top:12px"><label>自訂金額</label><input id="frontDonationAmount" type="number" min="100" value="1000" required></div></fieldset><fieldset><legend>捐款人資料</legend><div class="form-grid"><div class="field"><label>捐款人姓名</label><input id="frontDonorName" required placeholder="請輸入姓名"></div><div class="field"><label>Email</label><input id="frontDonorEmail" type="email" placeholder="receipt@example.com"></div><div class="field"><label>手機</label><input id="frontDonorPhone" placeholder="0912-345-678"></div><div class="field"><label>收據抬頭</label><input id="frontReceiptTitle" placeholder="可與捐款人相同"></div></div></fieldset><fieldset><legend>收據與付款</legend><div class="receipt-options"><label><input type="radio" name="frontReceiptType" value="年度收據" checked> 年度收據</label><label><input type="radio" name="frontReceiptType" value="單次收據"> 單次收據</label><label><input type="radio" name="frontReceiptType" value="不需收據"> 不需收據</label><label><input type="radio" name="frontReceiptType" value="紙本收據"> 紙本收據</label></div><div class="form-grid"><div class="field"><label>付款方式</label><select id="frontDonationMethod"><option>信用卡</option><option>ATM</option><option>銀行轉帳</option></select></div><div class="field"><label>備註</label><input id="frontDonationNote" placeholder="指定用途或想留下的話"></div></div><div class="bank-box"><strong>銀行轉帳資訊</strong><p>銀行：浪心公益銀行 代碼 808<br>帳號：123-456-789000<br>戶名：浪心犬舍公益平台</p></div></fieldset><div class="checkout-actions"><button class="button" type="submit">確認送出捐款</button><a class="button secondary" href="#receipt-lookup">查詢收據</a></div><div class="donation-result" id="frontDonationResult" hidden></div></form></div><aside class="panel checkout-summary"><span class="tag">Donation Summary</span><h2>捐款摘要</h2><div class="money-ledger"><div><span>預設專案</span><strong id="donationSummaryCampaign">急難醫療基金</strong></div><div><span>目前金額</span><strong id="donationSummaryAmount">NT$ 1,000</strong></div><div><span>資料用途</span><strong>後台對帳與收據</strong></div></div><p class="muted-note">送出後會建立一筆待對帳資料，後台可用日期、狀態與關鍵字篩選。</p></aside></div>`, "Donation");
}

function restoreReceiptLookup() {
  return restoreShell("收據查詢", "輸入捐款編號或捐款人姓名，查詢收據開立與寄送狀態。", `<div class="receipt-lookup-layout"><div class="panel"><h2>查詢收據</h2><form class="receipt-lookup-form" id="receiptLookupForm"><div class="form-grid"><div class="field full"><label>捐款編號 / 姓名</label><input id="receiptLookupKeyword" placeholder="例如 DN20260500001 或 林雅萱" required></div></div><button class="button" type="submit">查詢</button></form><div class="receipt-lookup-result" id="receiptLookupResult"></div></div><aside class="panel receipt-help"><span class="tag">Receipt</span><h2>查詢說明</h2><p>捐款送出後會先是待對帳。對帳完成後，收據會進入待寄送或已寄送狀態。</p><a class="button secondary" href="#donate">回捐款系統</a></aside></div>`, "Receipt Lookup");
}

function restoreStories() {
  return restoreShell("救援故事", "用真實紀錄串起救援、醫療、訓練與回家的每一步。", `<div class="admin-table-summary"><span>共 ${restoreStoryRecords.length} 篇救援紀錄</span><span>依日期由新到舊排列</span></div><div class="grid cols-3">${restoreStoryRecords.map(story => `<article class="card story-card"><a href="#${story.id}"><img class="story-photo" src="${story.photos[0]}" alt="${story.title}"></a><div class="card-body"><div class="between"><span class="tag">${story.tag}</span><small>${story.date}</small></div><h3><a href="#${story.id}">${story.title}</a></h3><p>${story.summary}</p><div class="actions"><a class="button secondary" href="#${story.id}">進入故事</a><a class="button secondary" href="#donate">支持專案</a></div></div></article>`).join("")}</div>`, "Rescue Stories");
}

function restoreStoryDetail(storyId) {
  const story = restoreStoryRecords.find(item => item.id === storyId) || restoreStoryRecords[0];
  const related = restoreStoryRecords.filter(item => item.id !== story.id).slice(0, 3);
  return `<article class="story-article"><div class="story-hero"><img src="${story.photos[0]}" alt="${story.title}"><div class="story-hero-copy"><a class="tag" href="#stories">回救援故事</a><p class="eyebrow">${story.tag} / ${story.date}</p><h1>${story.title}</h1><p>${story.summary}</p><div class="hero-actions"><a class="button" href="#donate">支持相關專案</a><a class="button ghost" href="#stories">回列表</a></div></div></div></article><section class="section"><div class="story-layout"><div class="story-content"><p>${story.summary}</p><p>這筆紀錄會連動後台的捐款、支出、收據與社群成效，方便後續追蹤專案狀態，而不是只留下前台文章。</p><p>目前照護工作包含現場評估、醫療或物資安排、志工回報、照片紀錄與後續追蹤。需要外部支持時，會同步到捐款專案與社群發布。</p><div class="story-cta"><h2>後續追蹤</h2><p>狀態：${story.status}。已投入照護與紀錄費用 ${money(story.amount)}，後續會依回診、安置或認養進度更新。</p><a class="button" href="#donate">支持這個故事</a></div></div><aside class="panel story-aside"><h2>故事資料</h2><div class="money-ledger"><div><span>日期</span><strong>${story.date}</strong></div><div><span>議題</span><strong>${story.tag}</strong></div><div><span>狀態</span><strong>${story.status}</strong></div><div><span>投入費用</span><strong>${money(story.amount)}</strong></div></div></aside></div></section><section class="section alt"><div class="section-header"><div><h2>照片紀錄</h2><p>保留現場、照護與後續追蹤照片，讓故事有完整脈絡。</p></div></div><div class="story-gallery">${story.photos.map((photo, index) => `<img src="${photo}" alt="${story.title}照片 ${index + 1}">`).join("")}</div></section><section class="section"><div class="section-header"><div><h2>相關故事</h2><p>同類型救援與照護紀錄。</p></div></div><div class="grid cols-3">${related.map(item => `<article class="card story-card"><a href="#${item.id}"><img class="story-photo" src="${item.photos[0]}" alt="${item.title}"></a><div class="card-body"><span class="tag">${item.tag}</span><h3><a href="#${item.id}">${item.title}</a></h3><p>${item.summary}</p></div></article>`).join("")}</div></section>`;
}

function restoreShop() {
  const products = [
    ["陪伴散步帆布袋", 680, "生活用品", "assets/products/canvas-bag-01.png"],
    ["浪犬插畫明信片組", 220, "紙品", "assets/products/postcards-01.png"],
    ["守護者不鏽鋼碗", 480, "寵物用品", "assets/products/steel-bowl-01.png"],
    ["沉香守護香牌", 1280, "香氛小物", "assets/products/agarwood-01.png"],
    ["檀香平安香牌", 1180, "香氛小物", "assets/products/sandalwood-01.png"],
    ["公益香囊組", 360, "香氛小物", "assets/products/sachet-01.png"],
    ["節慶公益禮盒", 1680, "禮盒", "assets/products/giftset-01.png"],
    ["浪犬守護徽章", 180, "文創商品", "assets/products/badge-01.png"],
    ["棉質領巾", 320, "寵物用品", "assets/products/cotton-bandana-01.png"],
    ["散步牽繩組", 760, "寵物用品", "assets/products/leash-set-01.png"],
    ["肉球吸水杯墊", 260, "生活用品", "assets/products/paw-coasters-01.png"],
    ["浪犬保溫杯", 890, "生活用品", "assets/products/paw-tumbler-01.png"],
    ["寵物急救包", 980, "照護用品", "assets/products/pet-first-aid-kit-01.png"],
    ["救援犬桌曆", 520, "紙品", "assets/products/rescue-dog-calendar-01.png"],
    ["訓練零食袋", 420, "寵物用品", "assets/products/treat-pouch-01.png"],
    ["可水洗寵物墊", 680, "寵物用品", "assets/products/washable-pet-mat-01.png"]
  ];
  return restoreShell("義賣商城", "義賣所得投入園區清潔、醫療與認養前準備。", `<div class="grid cols-3">${products.map(product => `<article class="card"><img class="product-photo" src="${product[3]}" alt="${product[0]}"><div class="card-body"><span class="tag">${product[2]}</span><h3>${product[0]}</h3><p>公益義賣商品，讓日常購買也能支持照護。</p><strong>NT$ ${product[1].toLocaleString("zh-TW")}</strong></div></article>`).join("")}</div>`, "Charity Shop");
}

function restoreVolunteer() {
  return restoreShell("志工與聯絡", "成為志工、認養人或定期支持者，讓照護工作更穩定。", `<div class="split"><article class="panel"><h2>留下參與方式</h2><div class="form-grid"><div class="field"><label>姓名</label><input placeholder="請輸入姓名"></div><div class="field"><label>聯絡方式</label><input placeholder="電話或 Email"></div><div class="field full"><label>參與方式</label><select><option>我想認養</option><option>我想當志工</option><option>我想定期捐款</option><option>企業合作</option></select></div></div></article><article class="panel"><h2>聯絡資訊</h2><p>服務時間：週二至週日 10:00-18:00</p><p>LINE：@straydog-home</p><p>Email：service@example.org</p></article></div>`, "Contact");
}

function isSuperAdmin() {
  return currentAdminRole === "admin";
}

function currentPermissions() {
  if (isSuperAdmin()) return Object.keys(adminLabels);
  return db.adminUsers.find(user => user.username === currentAdminUsername)?.permissions || [];
}

function canOpen(key) {
  return currentPermissions().includes(key);
}

function visibleGroups() {
  const allowed = new Set(currentPermissions());
  return navGroups.map(([title, keys]) => [title, keys.filter(key => allowed.has(key))]).filter(([, keys]) => keys.length);
}

function ensureActiveAdmin() {
  if (canOpen(activeAdmin)) return;
  activeAdmin = visibleGroups()[0]?.[1]?.[0] || "dashboard";
}

function adminLogin() {
  return `<section class="section admin-login-page"><form class="panel admin-login-card" id="adminLoginForm"><span class="tag">Admin Only</span><h1>後台登入</h1><p>預設最高管理者帳號密碼皆為 admin。</p><div class="form-grid"><div class="field full"><label>帳號</label><input id="adminUsername" required placeholder="admin"></div><div class="field full"><label>密碼</label><input id="adminPassword" type="password" required placeholder="admin"></div></div><button class="button" type="submit">登入後台</button><div class="donation-result" id="adminLoginResult" hidden></div></form></section>`;
}

function admin() {
  if (!adminLoggedIn) return adminLogin();
  ensureActiveAdmin();
  return `<section class="admin-page"><div class="admin-shell"><aside class="admin-sidebar"><h2>後台管理</h2><p class="admin-user-badge">${isSuperAdmin() ? "最高管理者" : `登入：${esc(currentAdminUsername)}`}</p><div class="admin-tabs">${visibleGroups().map(([title, keys]) => `<div class="admin-tab-group"><span>${title}</span>${keys.map(key => `<button class="${activeAdmin === key ? "active" : ""}" data-admin="${key}">${adminLabels[key]}</button>`).join("")}</div>`).join("")}</div></aside><div class="admin-content">${adminView(activeAdmin)}</div></div>${adminModal()}</section>`;
}

function adminView(key) {
  if (!canOpen(key)) return `<div class="admin-top"><div><h1>沒有權限</h1><p>這個帳號尚未開啟「${adminLabels[key] || key}」。</p></div></div>`;
  if (key === "dashboard") return dashboard();
  if (key === "reports") return reportsPanel();
  if (key === "analytics") return analyticsPanel();
  if (key === "data") return dataPanel();
  if (key === "donations") return filteredTable("donations", db.donations, donationConfig());
  if (key === "expenses") return filteredTable("expenses", db.expenses, expenseConfig());
  if (key === "accounting") return accountingPanel();
  if (key === "receipts") return filteredTable("receipts", db.receipts, receiptConfig());
  if (key === "serviceOverview") return serviceOverviewPanel();
  if (key === "adoptionApplications") return filteredTable("adoptionApplications", db.adoptionApplications, adoptionApplicationConfig());
  if (key === "serviceContacts") return filteredTable("serviceContacts", db.serviceContacts, serviceContactConfig());
  if (key === "farewell") return farewellPanel();
  if (key === "dogs") return crudList("犬隻管理", "新增犬隻", "dogs", ["編號", "姓名", "年齡", "狀態", "地區"], db.dogs.map(d => [d.id, d.name, d.age, badge(d.status, d.status === "醫療觀察" ? "warn" : ""), d.area]), d => d.id);
  if (key === "content") return crudList("內容管理", "新增內容", "stories", ["內容 ID", "標題", "日期", "議題", "摘要"], db.stories.map(s => [s.id, s.title, s.date, badge(s.tag), s.summary]), s => s.id);
  if (key === "social") return socialPanel();
  if (key === "products") return crudList("商品上架管理", "新增商品", "products", ["商品編號", "商品", "分類", "售價", "庫存", "狀態"], db.products.map(p => [p.id, p.name, p.category, money(p.price), p.stock, badge(p.status)]), p => p.id);
  if (key === "orders") return crudList("訂單管理", "新增訂單", "orders", ["訂單編號", "購買人", "品項", "金額", "付款", "狀態"], db.orders.slice(0, 50).map(o => [o.no, o.buyer, o.item, money(o.total), o.payment, badge(o.status)]), o => o.no);
  if (key === "invoice") return filteredTable("invoice", db.orders, invoiceConfig());
  if (key === "settings") return settingsPanel();
  return "";
}

function dashboard() {
  return `<div class="admin-top"><div><h1>管理報表</h1><p>掌握捐款、支出、收據、訂單與待處理工作。</p></div></div>${metricGrid([["捐款資料", db.donations.length], ["捐款總額", money(sum(db.donations))], ["支出資料", db.expenses.length], ["義賣訂單", db.orders.length]])}<div class="report-grid"><div class="panel"><h2>待處理事項</h2>${table(["項目", "數量", "建議處理"], [["待對帳捐款", db.donations.filter(d => d.status === "待對帳").length, "進入捐款管理"], ["待開立收據", db.receipts.filter(r => r.status === "待開立").length, "進入捐款收據"], ["待開立發票", db.orders.filter(o => o.invoiceStatus === "待開立").length, "進入發票管理"]])}</div><div class="panel"><h2>近期專案</h2><div class="mini-bars">${["冬季醫療與保暖基金", "犬舍修繕計畫", "流浪犬伙食基金"].map((name, i) => `<div><span>${name}</span><b>${money([860000, 420000, 260000][i])}</b><i style="width:${[100, 62, 38][i]}%"></i></div>`).join("")}</div></div></div>`;
}

function reportsPanel() {
  return `<div class="admin-top"><div><h1>統計報表</h1><p>彙整月度收入、支出、收據與訂單資料。</p></div><button class="button secondary" type="button">匯出報表</button></div>${metricGrid([["本月收入", money(sum(db.donations))], ["本月支出", money(sum(db.expenses))], ["收據筆數", db.receipts.length], ["訂單金額", money(sum(db.orders))]])}<div class="report-grid"><div class="panel"><h2>專案收入排行</h2><div class="mini-bars">${["冬季醫療與保暖基金", "犬舍修繕計畫", "流浪犬伙食基金"].map((name, i) => `<div><span>${name}</span><b>${money([1280000, 760000, 520000][i])}</b><i style="width:${[100, 59, 41][i]}%"></i></div>`).join("")}</div></div><div class="panel"><h2>可輸出報表</h2>${table(["報表", "期間", "狀態"], [["捐款日報", "2026/05", badge("可下載")], ["支出明細", "2026/05", badge("可下載")], ["收據寄送追蹤", "2026/05", badge("整理中", "warn")]])}</div></div>`;
}

function analyticsPanel() {
  return `<div class="admin-top"><div><h1>議題分析</h1><p>追蹤內容議題帶來的瀏覽、點擊與捐款轉換。</p></div></div>${metricGrid([["瀏覽數", db.contentAnalytics.reduce((a, b) => a + b.views, 0).toLocaleString("zh-TW")], ["捐款點擊", db.contentAnalytics.reduce((a, b) => a + b.donateClicks, 0).toLocaleString("zh-TW")], ["完成捐款", db.contentAnalytics.reduce((a, b) => a + b.donations, 0)], ["歸因金額", money(sum(db.contentAnalytics))]])}${table(["文章", "議題", "瀏覽", "捐款點擊", "完成捐款", "轉換率"], db.contentAnalytics.map(item => [item.title, badge(item.topic), item.views.toLocaleString("zh-TW"), item.donateClicks.toLocaleString("zh-TW"), item.donations, item.conversion]))}`;
}

function dataPanel() {
  return `<div class="admin-top"><div><h1>資料中心</h1><p>集中查看主要資料表的筆數、用途與維護狀態。</p></div><button class="button secondary" type="button">備份資料</button></div>${table(["資料表", "筆數", "主要用途", "狀態"], [["捐款資料", db.donations.length, "對帳、收據、報表", badge("正常")], ["支出資料", db.expenses.length, "公開徵信與會計分類", badge("正常")], ["收據資料", db.receipts.length, "開立與寄送追蹤", badge("正常")], ["訂單資料", db.orders.length, "商品出貨與發票", badge("正常")], ["犬隻資料", db.dogs.length, "認養與照護", badge("正常")]])}`;
}

function accountingPanel() {
  const rows = [["醫療", "5101 醫療支出", "醫療救援", "96%"], ["床墊 / 物資", "5201 物資支出", "物資募集", "91%"], ["火化 / 接送", "5401 善終服務支出", "善終服務", "88%"], ["指定捐款", "4101 指定用途捐款收入", "捐款管理", "94%"]];
  return `<div class="admin-top"><div><h1>會計分類</h1><p>管理捐款與支出的科目對應規則，減少人工分類錯誤。</p></div><button class="button" type="button">新增規則</button></div>${metricGrid([["分類規則", rows.length], ["待確認支出", db.expenses.filter(e => e.proof === "待補件").length], ["待對帳捐款", db.donations.filter(d => d.status === "待對帳").length], ["平均信心", "92%"]])}${table(["關鍵字", "會計科目", "套用範圍", "命中率"], rows)}`;
}

function farewellPanel() {
  return `<div class="admin-top"><div><h1>善終服務</h1><p>管理通報、接送、火化、費用與公開狀態。</p></div><button class="button" type="button">新增案件</button></div>${metricGrid([["案件數", db.farewellCases.length], ["服務費用", money(sum(db.farewellCases))], ["已完成", db.farewellCases.filter(c => c.status === "已完成").length], ["待處理", 0]])}${table(["編號", "日期", "地點", "類型", "服務內容", "費用", "狀態"], db.farewellCases.map(item => [item.no, item.date, item.location, item.type, item.service, money(item.cost), badge(item.status)]))}`;
}

function socialPanel() {
  return `<div class="admin-top"><div><h1>社群發布</h1><p>管理公益故事社群排程與成效，不混入系統設定。</p></div><button class="button" type="button">新增排程</button></div><div class="report-grid"><div class="panel"><h2>發布渠道</h2>${table(["渠道", "受眾", "格式", "狀態"], db.socialChannels.map(item => [item.channel, item.audience, item.format, badge(item.status)]))}</div><div class="panel"><h2>近期排程</h2>${table(["故事", "渠道", "發布時間", "目標", "狀態"], db.socialQueue.map(item => [item.story, item.channels, item.publishAt, item.goal, badge(item.status, item.status === "草稿" ? "warn" : "")]))}</div></div>${table(["文章", "議題", "瀏覽", "捐款點擊", "完成捐款", "歸因金額"], db.contentAnalytics.map(item => [item.title, item.topic, item.views.toLocaleString("zh-TW"), item.donateClicks.toLocaleString("zh-TW"), item.donations, money(item.amount)]))}`;
}

function settingsPanel() {
  const rows = db.adminUsers.map(user => [user.name, user.username, user.permissions.map(key => adminLabels[key]).join("、"), `<button class="button secondary danger" data-delete-admin-user="${esc(user.username)}">刪除</button>`]);
  return `<div class="admin-top"><div><h1>系統設定</h1><p>管理運費、後台使用者與最高管理者帳密。</p></div><button class="button" id="adminLogout" type="button">登出後台</button></div><form class="panel" id="shopSettingsForm"><h2>商品運費設定</h2><div class="form-grid"><div class="field"><label>免運門檻</label><input id="freeShippingThreshold" type="number" value="${db.shopSettings.freeShippingThreshold}"></div><div class="field"><label>運費</label><input id="shippingFee" type="number" value="${db.shopSettings.shippingFee}"></div></div><button class="button" type="submit">儲存運費設定</button></form>${isSuperAdmin() ? `<form class="panel" id="adminUserForm" style="margin-top:18px"><h2>使用者與頁簽權限</h2><div class="form-grid"><div class="field"><label>姓名 / 角色</label><input id="adminUserName"></div><div class="field"><label>登入帳號</label><input id="adminUserUsername"></div><div class="field"><label>登入密碼</label><input id="adminUserPassword" type="password"></div></div><div class="permission-grid">${navGroups.map(([title, keys]) => `<fieldset><legend>${title}</legend>${keys.map(key => `<label><input type="checkbox" name="adminUserPermission" value="${key}" ${key === "dashboard" ? "checked" : ""}><span>${adminLabels[key]}</span></label>`).join("")}</fieldset>`).join("")}</div><button class="button" type="submit">新增使用者</button></form><div class="panel" style="margin-top:18px"><h2>已建立使用者</h2>${table(["名稱", "帳號", "可進入頁簽"], rows)}</div>` : ""}<form class="panel" id="adminCredentialForm" style="margin-top:18px"><h2>最高管理者帳密</h2><div class="form-grid"><div class="field"><label>帳號</label><input id="adminNewUsername" value="${esc(db.adminAuth.username)}"></div><div class="field"><label>密碼</label><input id="adminNewPassword" type="password" value="${esc(db.adminAuth.password)}"></div></div><button class="button" type="submit">儲存帳密</button></form>`;
}

function metricGrid(items) {
  return `<div class="metric-grid">${items.map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join("")}</div>`;
}

function donationConfig() {
  return { title: "捐款管理", description: "以日期、狀態與關鍵字管理捐款資料，按下套用篩選後才查詢。", date: row => row.paidAt, status: row => row.status, search: row => [row.no, row.name, row.campaign, row.method, row.subject, row.receiptNo, row.status], headers: ["日期", "捐款編號", "捐款人", "金額", "專案", "付款", "會計科目", "收據", "狀態"], row: d => [d.paidAt, d.no, d.name, money(d.amount), d.campaign, d.method, d.subject, d.receiptNo, badge(d.status, d.status !== "已對帳" ? "warn" : "")], collection: "donations", addText: "新增捐款", placeholder: "捐款編號、姓名、專案、收據" };
}

function expenseConfig() {
  return { title: "支出管理", description: "用日期、公開狀態與關鍵字管理支出資料。", date: row => row.date, status: row => row.publish, search: row => [row.no, row.project, row.item, row.vendor, row.subject, row.proof, row.publish], headers: ["日期", "支出編號", "專案", "項目", "廠商", "金額", "會計科目", "憑證", "公開"], row: e => [e.date, e.no, e.project, e.item, e.vendor, money(e.amount), e.subject, badge(e.proof, e.proof === "待補件" ? "warn" : ""), badge(e.publish, e.publish === "待審核" ? "warn" : "")], collection: "expenses", addText: "新增支出", placeholder: "支出編號、專案、項目、廠商" };
}

function receiptConfig() {
  return { title: "捐款收據", description: "依捐款日期、寄送狀態與關鍵字管理收據。", date: receiptDate, status: row => row.status, search: row => [row.no, row.donation, row.title, row.type, row.delivery, row.status], headers: ["付款日期", "收據號碼", "捐款編號", "捐款人", "類型", "寄送", "狀態"], row: r => [receiptDate(r), r.no, r.donation, r.title, r.type, r.delivery, badge(r.status, r.status !== "已寄送" ? "warn" : "")], placeholder: "收據號碼、捐款編號、姓名、寄送" };
}

function invoiceConfig() {
  return { title: "發票管理", description: "依訂單日期、發票狀態與關鍵字管理商品發票。", date: row => row.createdAt, status: row => row.invoiceStatus, search: row => [row.no, row.buyer, row.item, row.invoiceType, row.invoiceStatus, row.status], headers: ["訂單日期", "訂單", "購買人", "金額", "發票類型", "發票狀態", "訂單狀態"], row: o => [o.createdAt, o.no, o.buyer, money(o.total), o.invoiceType, badge(o.invoiceStatus, o.invoiceStatus === "待開立" ? "warn" : ""), badge(o.status)], placeholder: "訂單、購買人、發票類型、狀態" };
}

function receiptDate(receipt) {
  return db.donations.find(item => item.no === receipt.donation)?.paidAt || "";
}

function filteredRows(kind, rows, config) {
  const filter = appliedFilters[kind];
  const keyword = filter.keyword.trim().toLowerCase();
  return rows.filter(row => {
    const date = config.date(row) || "";
    const text = config.search(row).join(" ").toLowerCase();
    const status = config.status(row) || "";
    if (keyword && !text.includes(keyword)) return false;
    if (filter.status && status !== filter.status) return false;
    if (filter.dateFrom && date < filter.dateFrom) return false;
    if (filter.dateTo && date > filter.dateTo) return false;
    return true;
  });
}

function filteredTable(kind, rows, config) {
  const filter = appliedFilters[kind];
  const draft = draftFilters[kind];
  const statuses = [...new Set(rows.map(config.status).filter(Boolean))];
  const filtered = filteredRows(kind, rows, config);
  const totalPages = Math.max(1, Math.ceil(filtered.length / filter.perPage));
  filter.page = Math.min(Math.max(1, filter.page), totalPages);
  const start = (filter.page - 1) * filter.perPage;
  const pageRows = filtered.slice(start, start + filter.perPage);
  return `<div class="admin-top"><div><h1>${config.title}</h1><p>${config.description}</p></div>${config.collection ? `<button class="button" data-admin-create="${config.collection}">${config.addText}</button>` : ""}</div><div class="admin-filter-panel"><div class="field"><label>搜尋</label><input data-filter-kind="${kind}" data-filter-key="keyword" value="${esc(draft.keyword)}" placeholder="${esc(config.placeholder)}"></div><div class="field"><label>起始日期</label><input data-filter-kind="${kind}" data-filter-key="dateFrom" type="date" value="${esc(draft.dateFrom)}"></div><div class="field"><label>結束日期</label><input data-filter-kind="${kind}" data-filter-key="dateTo" type="date" value="${esc(draft.dateTo)}"></div><div class="field"><label>狀態</label><select data-filter-kind="${kind}" data-filter-key="status"><option value="">全部狀態</option>${statuses.map(status => `<option value="${esc(status)}" ${draft.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}</select></div><div class="field"><label>每頁筆數</label><select data-filter-kind="${kind}" data-filter-key="perPage">${[25, 50, 100].map(size => `<option value="${size}" ${Number(draft.perPage) === size ? "selected" : ""}>${size} 筆</option>`).join("")}</select></div><div class="admin-filter-actions"><button class="button" data-apply-filter="${kind}" type="button">套用篩選</button><button class="button secondary" data-reset-filter="${kind}" type="button">清除篩選</button><button class="button secondary" type="button">匯出 CSV</button></div></div><div class="admin-table-summary"><span>目前顯示 ${filtered.length ? start + 1 : 0}-${Math.min(start + filter.perPage, filtered.length)} 筆，共 ${filtered.length} 筆</span><span>全部資料 ${rows.length} 筆</span></div>${table(config.headers, pageRows.map(config.row), config.collection, pageRows.map(row => row[schemas[config.collection]?.idKey]))}<div class="admin-pagination"><button class="button secondary" data-page-kind="${kind}" data-page="${filter.page - 1}" ${filter.page === 1 ? "disabled" : ""}>上一頁</button><span>第 ${filter.page} / ${totalPages} 頁</span><button class="button secondary" data-page-kind="${kind}" data-page="${filter.page + 1}" ${filter.page === totalPages ? "disabled" : ""}>下一頁</button></div>`;
}

function crudList(title, addText, collection, headers, rows, idGetter) {
  const source = db[collection];
  return `<div class="admin-top"><div><h1>${title}</h1><p>支援新增、編輯與刪除。</p></div><button class="button" data-admin-create="${collection}">${addText}</button></div>${table(headers, rows, collection, source.map(idGetter))}`;
}

function memberKeyFrom(parts) {
  const email = String(parts.email || "").trim().toLowerCase();
  const phone = String(parts.phone || "").replace(/\D/g, "");
  const lineId = String(parts.lineId || "").trim().toLowerCase();
  const name = String(parts.name || "").trim();
  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;
  if (lineId) return `line:${lineId}`;
  return name ? `name:${name}` : "";
}

function readonlyTable(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("") : `<tr><td class="empty" colspan="${headers.length}">沒有符合條件的資料</td></tr>`}</tbody></table></div>`;
}

function buildMembers() {
  const map = new Map();
  const ensure = input => {
    const key = memberKeyFrom(input);
    if (!key) return null;
    if (!map.has(key)) {
      map.set(key, { id: key, name: input.name || "", phone: input.phone || "", email: input.email || "", lineId: input.lineId || "", address: input.address || "", area: input.area || "", roles: new Set(), donations: [], orders: [], adoptions: [], contacts: [] });
    }
    const member = map.get(key);
    ["name", "phone", "email", "lineId", "address", "area"].forEach(field => {
      if (!member[field] && input[field]) member[field] = input[field];
    });
    if (input.role) member.roles.add(input.role);
    return member;
  };
  safeList(db.donations).forEach(item => {
    if (item.anonymous && !item.email && !item.phone) return;
    const member = ensure({ name: item.name, phone: item.phone, email: item.email, role: "捐款人" });
    if (member) member.donations.push(item);
  });
  safeList(db.orders).forEach(item => {
    const member = ensure({ name: item.buyer, phone: item.phone, email: item.email, address: item.address, role: "購買商品者" });
    if (member) member.orders.push(item);
  });
  safeList(db.adoptionApplications).forEach(item => {
    const member = ensure({ name: item.applicant, phone: item.phone, email: item.email, lineId: item.lineId, area: item.city, role: "認養申請者" });
    if (member) member.adoptions.push(item);
  });
  safeList(db.serviceContacts).forEach(item => {
    const member = ensure({ name: item.name, phone: item.phone, email: item.email, lineId: item.lineId, area: item.area, role: "志工/聯絡" });
    if (member) member.contacts.push(item);
  });
  return [...map.values()].map(member => {
    member.roles = [...member.roles];
    member.donationTotal = sum(member.donations);
    member.orderTotal = member.orders.reduce((total, item) => total + Number(item.total || 0), 0);
    member.lastActivity = [member.donations[0]?.paidAt, member.orders[0]?.createdAt, member.adoptions[0]?.appliedAt, member.contacts[0]?.createdAt].filter(Boolean).sort().reverse()[0] || "";
    return member;
  }).sort((a, b) => String(b.lastActivity).localeCompare(String(a.lastActivity)));
}

function memberSummaryPanel(member) {
  return `<div class="member-detail-grid"><article class="panel sensitive-panel"><span class="tag">機敏資料</span><h2>${esc(member.name || "未填姓名")}</h2><div class="money-ledger"><div><span>Email</span><strong>${esc(member.email || "-")}</strong></div><div><span>電話</span><strong>${esc(member.phone || "-")}</strong></div><div><span>LINE</span><strong>${esc(member.lineId || "-")}</strong></div><div><span>地址/地區</span><strong>${esc(member.address || member.area || "-")}</strong></div><div><span>身份標籤</span><strong>${member.roles.map(role => badge(role)).join(" ") || "-"}</strong></div></div><p class="muted-note">此頁含個資與互動紀錄，正式系統應限制權限並留下查閱紀錄。</p></article><article class="panel"><h2>會員統計</h2>${metricGrid([["捐款總額", money(member.donationTotal)], ["捐款次數", member.donations.length], ["購買總額", money(member.orderTotal)], ["購買次數", member.orders.length], ["服務紀錄", member.adoptions.length + member.contacts.length]])}</article></div>`;
}

function memberDetailPanel(member) {
  return `<div class="admin-top"><div><h1>會員詳細資料</h1><p>整合此會員填寫過的聯絡方式、捐款、購買、認養與志工/聯絡紀錄。</p></div><button class="button secondary" type="button" data-member-back>回會員列表</button></div>${memberSummaryPanel(member)}<div class="panel"><h2>捐款紀錄</h2>${readonlyTable(["日期", "捐款編號", "專案", "金額", "付款", "收據", "狀態"], member.donations.map(item => [item.paidAt || "-", item.no || "-", item.campaign || "-", money(item.amount), item.method || "-", item.receiptNo || "-", badge(item.status || "-")]))}</div><div class="panel" style="margin-top:18px"><h2>購買紀錄</h2>${readonlyTable(["日期", "訂單", "品項", "金額", "付款", "發票", "出貨"], member.orders.map(item => [item.createdAt || "-", item.no || "-", item.item || "-", money(item.total), item.payment || "-", badge(item.invoiceStatus || "-"), badge(item.status || "-")]))}</div><div class="panel" style="margin-top:18px"><h2>認養申請紀錄</h2>${readonlyTable(["日期", "申請編號", "犬隻", "電話", "LINE", "狀態"], member.adoptions.map(item => [item.appliedAt || "-", item.no || "-", `${item.dogId || ""} ${item.dogName || ""}`, item.phone || "-", item.lineId || "-", badge(item.status || "-")]))}</div><div class="panel" style="margin-top:18px"><h2>志工與聯絡紀錄</h2>${readonlyTable(["日期", "聯絡編號", "項目", "可協助時段", "地區", "狀態"], member.contacts.map(item => [item.createdAt || "-", item.no || "-", item.type || "-", item.time || "-", item.area || "-", badge(item.status || "-")]))}</div>`;
}

function membersPanel() {
  const members = buildMembers();
  const selected = members.find(member => member.id === activeMemberId);
  if (selected) return memberDetailPanel(selected);
  const donors = members.filter(member => member.donations.length).length;
  const buyers = members.filter(member => member.orders.length).length;
  const serviceUsers = members.filter(member => member.adoptions.length || member.contacts.length).length;
  const rows = members.map(member => [esc(member.name || "未填姓名"), member.roles.map(role => badge(role)).join(" "), esc(member.phone || "-"), esc(member.email || "-"), esc(member.lineId || "-"), money(member.donationTotal), money(member.orderTotal), member.adoptions.length + member.contacts.length, `<button class="button secondary" type="button" data-member-detail="${esc(member.id)}">查看會員</button>`]);
  return `<div class="admin-top"><div><h1>會員管理</h1><p>彙整所有填過個人資料的人：捐款人、商品購買者、認養申請者、志工與聯絡者。此區含機敏個資，放在系統設定上方並應限制權限。</p></div></div>${metricGrid([["會員總數", members.length], ["捐款人", donors], ["購買商品者", buyers], ["服務/志工相關", serviceUsers], ["會員捐款總額", money(members.reduce((total, item) => total + item.donationTotal, 0))]])}<div class="panel"><h2>會員列表</h2>${readonlyTable(["姓名", "身份", "電話", "Email", "LINE", "捐款總額", "購買總額", "服務紀錄", "查看"], rows)}</div>`;
}

function table(headers, rows, collection = "", ids = []) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}<th>操作</th></tr></thead><tbody>${rows.length ? rows.map((row, index) => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}<td>${collection ? `<div class="table-actions"><button class="button secondary" data-admin-edit="${collection}" data-admin-id="${esc(ids[index])}">編輯</button><button class="button secondary danger" data-admin-delete="${collection}" data-admin-id="${esc(ids[index])}">刪除</button></div>` : `<button class="button secondary" disabled>查看</button>`}</td></tr>`).join("") : `<tr><td class="empty" colspan="${headers.length + 1}">沒有符合條件的資料</td></tr>`}</tbody></table></div>`;
}

function modalRecord() {
  if (!adminModalState) return null;
  const { collection, id } = adminModalState;
  const schema = schemas[collection];
  return db[collection].find(item => String(item[schema.idKey]) === String(id)) || schema.defaults();
}

function mediaValues(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "").split(/\n+/).map(item => item.trim()).filter(Boolean);
}

function mediaControl(key, label, value, multiple) {
  const values = mediaValues(value);
  const inputValue = multiple ? values.join("\n") : values[0] || "";
  return `<div class="field full admin-media-field"><label>${label}</label><div class="admin-media-preview" data-admin-media-preview>${values.length ? values.map(src => `<img src="${esc(src)}" alt="照片預覽">`).join("") : `<span>尚未選擇照片</span>`}</div><div class="admin-media-actions"><label class="button secondary">選擇照片<input data-admin-media-upload type="file" accept="image/*" ${multiple ? "multiple" : ""}></label></div><details class="admin-media-advanced"><summary>進階：手動路徑 / 已選照片資料</summary>${multiple ? `<textarea name="${key}" data-admin-media-value>${esc(inputValue)}</textarea>` : `<input name="${key}" data-admin-media-value value="${esc(inputValue)}">`}</details></div>`;
}

function fieldControl([key, label, type, options = []], record) {
  const value = record[key] ?? "";
  if (type === "images") return mediaControl(key, label, value, true);
  if (type === "image") return mediaControl(key, label, value, false);
  if (type === "textarea") return `<div class="field full"><label>${label}</label><textarea name="${key}">${esc(value)}</textarea></div>`;
  if (type === "select") return `<div class="field"><label>${label}</label><select name="${key}">${options.map(option => `<option value="${esc(option)}" ${value === option ? "selected" : ""}>${esc(option)}</option>`).join("")}</select></div>`;
  return `<div class="field"><label>${label}</label><input name="${key}" type="${type}" value="${esc(value)}"></div>`;
}

function adminModal() {
  if (!adminModalState) return "";
  const schema = schemas[adminModalState.collection];
  const record = modalRecord();
  return `<div class="admin-modal-backdrop"><form class="admin-modal panel" id="adminCrudForm" data-admin-crud="${adminModalState.collection}"><div class="admin-modal-head"><div><span class="tag">${adminModalState.mode === "edit" ? "編輯" : "新增"}</span><h2>${schema.label}</h2></div><button class="button secondary" type="button" data-admin-close>關閉</button></div><div class="form-grid">${schema.fields.map(field => fieldControl(field, record)).join("")}</div><div class="admin-modal-actions"><button class="button secondary" type="button" data-admin-close>取消</button><button class="button" type="submit">儲存</button></div></form></div>`;
}

function saveCrud(form) {
  const collection = form.dataset.adminCrud;
  const schema = schemas[collection];
  const data = new FormData(form);
  const record = {};
  schema.fields.forEach(([key, , type]) => {
    const value = data.get(key);
    if (type === "number") record[key] = Number(value || 0);
    else if (type === "images") record[key] = mediaValues(value);
    else record[key] = String(value || "").trim();
  });
  const id = adminModalState.id;
  const index = db[collection].findIndex(item => String(item[schema.idKey]) === String(id));
  if (index >= 0) db[collection][index] = { ...db[collection][index], ...record };
  else db[collection].unshift(record);
  if (collection === "donations") {
    db.receipts.unshift({ no: record.receiptNo, donation: record.no, title: record.name, type: record.receiptType || "年度收據", delivery: "Email", status: record.status === "已對帳" ? "已寄送" : "待開立" });
  }
  normalizeData();
  saveLocalData();
  adminModalState = null;
  render();
}

function restoreDogsPage() {
  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(restoreDogs.length / perPage));
  restoreDogPage = Math.min(Math.max(restoreDogPage, 1), totalPages);
  const start = (restoreDogPage - 1) * perPage;
  const visibleDogs = restoreDogs.slice(start, start + perPage);
  const cards = visibleDogs.map(dog => `
    <article class="card dog-card">
      <a class="dog-card-link" href="#dog-${dog.id}">
        <img class="dog-photo" src="${dog.photos[0]}" alt="${dog.name}主照片">
      </a>
      <div class="card-body">
        <div class="between"><strong>${dog.id}</strong><span>${dog.area}</span></div>
        <h3><a href="#dog-${dog.id}">${dog.name}</a></h3>
        <p>${dog.intro}</p>
        <div class="meta">
          <span class="tag">${dog.breed}</span>
          <span class="tag">${dog.age}</span>
          <span class="tag">${dog.sex}</span>
          <span class="tag">${dog.size}</span>
          <span class="tag">${dog.status}</span>
        </div>
        <div class="actions">
          <a class="button secondary" href="#dog-${dog.id}">看更多照片</a>
        </div>
      </div>
    </article>
  `).join("");
  return `<section class="section"><div class="section-header"><div><p class="eyebrow">Adoption</p><h1>正在等待家的狗狗</h1><p>每張犬隻卡片都可延伸成詳細頁，包含健康狀態、品種、個性與認養資訊。</p></div><a class="button" href="#volunteer">預約認養</a></div><div class="dog-page-meta"><div><span>共 ${restoreDogs.length} 隻等待認養</span><span>第 ${restoreDogPage} / ${totalPages} 頁，每頁 ${perPage} 隻</span></div></div><div class="grid cols-4">${cards}</div><div class="pagination"><button class="button secondary" data-dog-page="${restoreDogPage - 1}" ${restoreDogPage === 1 ? "disabled" : ""}>上一頁</button><span>第 ${restoreDogPage} 頁 / 共 ${totalPages} 頁</span><button class="button secondary" data-dog-page="${restoreDogPage + 1}" ${restoreDogPage === totalPages ? "disabled" : ""}>下一頁</button></div></section>`;
}

function legacyRestoreRender() {
  const route = location.hash.replace("#", "") || "home";
  const page = route.startsWith("dog-") ? "dog" : route;
  const routes = { home: restoreHome, stories: restoreStories, donate: restoreDonate, "receipt-lookup": restoreReceiptLookup, farewell: restoreFarewell, dogs: restoreDogsPage, shop: restoreShop, volunteer: restoreVolunteer, admin };
  app.innerHTML = page === "dog" ? restoreDogDetail(route.replace("dog-", "")) : route.startsWith("story-") ? restoreStoryDetail(route) : (routes[page] || routes.home)();
  document.querySelectorAll(".site-nav a").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${route}` || (route.startsWith("story-") && href === "#stories"));
  });
  legacyRestoreBind();
  document.querySelectorAll("[data-dog-thumb]").forEach(button => button.addEventListener("click", () => {
    const mainImage = document.querySelector("#dogMainImage");
    if (!mainImage) return;
    mainImage.src = button.dataset.dogThumb;
    document.querySelectorAll("[data-dog-thumb]").forEach(item => item.classList.toggle("active", item === button));
  }));
  document.querySelectorAll("[data-dog-page]").forEach(button => button.addEventListener("click", () => {
    restoreDogPage = Number(button.dataset.dogPage);
    legacyRestoreRender();
  }));
}

function legacyRestoreBind() {
  menuButton?.addEventListener("click", () => nav?.classList.toggle("open"));
  nav?.addEventListener("click", () => nav.classList.remove("open"));

  document.querySelectorAll("[data-admin]").forEach(button => button.addEventListener("click", () => {
    activeAdmin = button.dataset.admin;
    adminModalState = null;
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-admin-create]").forEach(button => button.addEventListener("click", () => {
    adminModalState = { collection: button.dataset.adminCreate, mode: "create", id: "" };
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-admin-edit]").forEach(button => button.addEventListener("click", () => {
    adminModalState = { collection: button.dataset.adminEdit, mode: "edit", id: button.dataset.adminId };
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-admin-delete]").forEach(button => button.addEventListener("click", () => {
    const collection = button.dataset.adminDelete;
    const schema = schemas[collection];
    db[collection] = db[collection].filter(item => String(item[schema.idKey]) !== String(button.dataset.adminId));
    saveLocalData();
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-admin-close]").forEach(button => button.addEventListener("click", () => {
    adminModalState = null;
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-filter-kind]").forEach(field => field.addEventListener("input", () => {
    const kind = field.dataset.filterKind;
    const key = field.dataset.filterKey;
    draftFilters[kind][key] = key === "perPage" ? Number(field.value) : field.value;
  }));

  document.querySelectorAll("[data-apply-filter]").forEach(button => button.addEventListener("click", () => {
    const kind = button.dataset.applyFilter;
    appliedFilters[kind] = { ...draftFilters[kind], page: 1 };
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-reset-filter]").forEach(button => button.addEventListener("click", () => {
    const kind = button.dataset.resetFilter;
    appliedFilters[kind] = emptyFilters();
    draftFilters[kind] = { ...appliedFilters[kind] };
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-page-kind]").forEach(button => button.addEventListener("click", () => {
    const kind = button.dataset.pageKind;
    appliedFilters[kind].page = Number(button.dataset.page);
    draftFilters[kind].page = Number(button.dataset.page);
    legacyRestoreRender();
  }));

  document.querySelectorAll("[data-admin-media-upload]").forEach(input => input.addEventListener("change", async () => {
    const field = input.closest(".admin-media-field");
    const valueField = field.querySelector("[data-admin-media-value]");
    const preview = field.querySelector("[data-admin-media-preview]");
    const files = Array.from(input.files || []);
    const values = await Promise.all(files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    })));
    valueField.value = input.multiple ? values.join("\n") : values[0] || "";
    preview.innerHTML = values.length ? values.map(src => `<img src="${src}" alt="照片預覽">`).join("") : "<span>尚未選擇照片</span>";
  }));

  document.querySelector("#adminCrudForm")?.addEventListener("submit", event => {
    event.preventDefault();
    saveCrud(event.currentTarget);
  });

  document.querySelector("#adminLoginForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.querySelector("#adminUsername").value.trim();
    const password = document.querySelector("#adminPassword").value;
    if (username === db.adminAuth.username && password === db.adminAuth.password) {
      adminLoggedIn = true;
      currentAdminRole = "admin";
      currentAdminUsername = username;
      sessionStorage.setItem("charityAdminLoggedIn", "true");
      sessionStorage.setItem("charityAdminRole", "admin");
      sessionStorage.setItem("charityAdminUsername", username);
      activeAdmin = "dashboard";
      render();
      return;
    }
    const user = db.adminUsers.find(item => item.username === username && item.password === password);
    if (user) {
      adminLoggedIn = true;
      currentAdminRole = "user";
      currentAdminUsername = user.username;
      sessionStorage.setItem("charityAdminLoggedIn", "true");
      sessionStorage.setItem("charityAdminRole", "user");
      sessionStorage.setItem("charityAdminUsername", user.username);
      activeAdmin = user.permissions[0] || "dashboard";
      render();
      return;
    }
    const result = document.querySelector("#adminLoginResult");
    result.hidden = false;
    result.textContent = "帳號或密碼不正確。";
  });

  document.querySelector("#adminLogout")?.addEventListener("click", () => {
    adminLoggedIn = false;
    sessionStorage.removeItem("charityAdminLoggedIn");
    sessionStorage.removeItem("charityAdminRole");
    sessionStorage.removeItem("charityAdminUsername");
    legacyRestoreRender();
  });

  document.querySelector("#shopSettingsForm")?.addEventListener("submit", event => {
    event.preventDefault();
    db.shopSettings.freeShippingThreshold = Number(document.querySelector("#freeShippingThreshold").value || 0);
    db.shopSettings.shippingFee = Number(document.querySelector("#shippingFee").value || 0);
    saveLocalData();
    render();
  });

  document.querySelector("#adminCredentialForm")?.addEventListener("submit", event => {
    event.preventDefault();
    db.adminAuth.username = document.querySelector("#adminNewUsername").value.trim();
    db.adminAuth.password = document.querySelector("#adminNewPassword").value;
    saveLocalData();
    render();
  });

  document.querySelector("#adminUserForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const permissions = Array.from(document.querySelectorAll("input[name='adminUserPermission']:checked")).map(input => input.value);
    db.adminUsers.push({
      name: document.querySelector("#adminUserName").value.trim() || document.querySelector("#adminUserUsername").value.trim(),
      username: document.querySelector("#adminUserUsername").value.trim(),
      password: document.querySelector("#adminUserPassword").value,
      permissions
    });
    saveLocalData();
    render();
  });

  document.querySelectorAll("[data-delete-admin-user]").forEach(button => button.addEventListener("click", () => {
    db.adminUsers = db.adminUsers.filter(user => user.username !== button.dataset.deleteAdminUser);
    saveLocalData();
    render();
  }));

  document.querySelectorAll("input[name='frontDonationCampaign']").forEach(input => input.addEventListener("change", () => {
    document.querySelectorAll(".campaign-options label").forEach(label => label.classList.toggle("selected", label.contains(input) && input.checked));
    const summary = document.querySelector("#donationSummaryCampaign");
    if (summary) summary.textContent = input.value;
  }));

  document.querySelectorAll("[data-donation-amount]").forEach(button => button.addEventListener("click", () => {
    const amount = Number(button.dataset.donationAmount || 0);
    const input = document.querySelector("#frontDonationAmount");
    if (input) input.value = amount;
    const summary = document.querySelector("#donationSummaryAmount");
    if (summary) summary.textContent = money(amount);
  }));

  document.querySelector("#frontDonationAmount")?.addEventListener("input", event => {
    const summary = document.querySelector("#donationSummaryAmount");
    if (summary) summary.textContent = money(event.currentTarget.value);
  });

  document.querySelector("#receiptLookupForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const keyword = document.querySelector("#receiptLookupKeyword").value.trim().toLowerCase();
    const receipt = db.receipts.find(item => [item.no, item.donation, item.title, item.status].join(" ").toLowerCase().includes(keyword));
    const result = document.querySelector("#receiptLookupResult");
    if (!receipt) {
      result.innerHTML = `<div class="donation-result warn">查無符合的收據資料，請確認捐款編號或姓名。</div>`;
      return;
    }
    result.innerHTML = `<div class="donation-result"><strong>查詢結果</strong><div class="receipt-result-grid"><div><span>收據號碼</span><strong>${receipt.no}</strong></div><div><span>捐款編號</span><strong>${receipt.donation}</strong></div><div><span>收據抬頭</span><strong>${receipt.title}</strong></div><div><span>狀態</span><strong>${receipt.status}</strong></div></div></div>`;
  });

  document.querySelector("#frontDonationForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const amount = Number(document.querySelector("#frontDonationAmount").value || 0);
    const campaign = document.querySelector("input[name='frontDonationCampaign']:checked")?.value || "急難醫療基金";
    const receiptType = document.querySelector("input[name='frontReceiptType']:checked")?.value || "年度收據";
    const donorName = document.querySelector("#frontDonorName").value.trim();
    const receiptTitle = document.querySelector("#frontReceiptTitle").value.trim() || donorName;
    const no = `DN${Date.now()}`;
    const donation = {
      no,
      paidAt: today,
      name: donorName,
      amount,
      campaign,
      method: document.querySelector("#frontDonationMethod").value,
      subject: campaign.includes("醫療") ? "4101 指定用途捐款收入-醫療救援" : "4101 指定用途捐款收入",
      receiptNo: receiptType === "不需收據" ? "不需開立" : "待開立",
      receiptType,
      status: "待對帳"
    };
    db.donations.unshift(donation);
    if (receiptType !== "不需收據") {
      db.receipts.unshift({ no: "待開立", donation: no, title: receiptTitle, type: receiptType, delivery: "Email", status: "待開立" });
    }
    saveLocalData();
    const result = document.querySelector("#frontDonationResult");
    result.hidden = false;
    result.innerHTML = `<strong>捐款資料已建立</strong><div class="receipt-result-grid"><div><span>捐款編號</span><strong>${no}</strong></div><div><span>專案</span><strong>${campaign}</strong></div><div><span>金額</span><strong>${money(amount)}</strong></div><div><span>收據</span><strong>${receiptType}</strong></div></div><p>目前狀態為待對帳，後台捐款管理與收據管理會同步顯示。</p>`;
    event.currentTarget.reset();
    document.querySelector("#donationSummaryCampaign").textContent = "急難醫療基金";
    document.querySelector("#donationSummaryAmount").textContent = money(1000);
    document.querySelectorAll(".campaign-options label").forEach((label, index) => label.classList.toggle("selected", index === 0));
  });
}

const frontDogs = [
  { id: "D-001", name: "阿福", breed: "台灣犬混種", age: "2 歲", sex: "公", size: "中型", status: "開放認養", area: "新北", intro: "親人、會坐下，適合有固定作息的家庭。", photos: ["assets/dogs/afu-01.png", "assets/dogs/afu-02.png", "assets/dogs/afu-03.png"] },
  { id: "D-002", name: "米香", breed: "米克斯幼犬", age: "8 個月", sex: "母", size: "小中型", status: "醫療觀察", area: "桃園", intro: "活潑黏人，完成疫苗後可安排互動。", photos: ["assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png", "assets/dogs/mixiang-03.png"] },
  { id: "D-003", name: "黑糖", breed: "拉布拉多混種", age: "4 歲", sex: "母", size: "中大型", status: "開放認養", area: "台中", intro: "穩定溫柔，散步牽繩表現很好。", photos: ["assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png", "assets/dogs/heitang-03.png"] },
  { id: "D-004", name: "小路", breed: "虎斑米克斯", age: "1 歲", sex: "公", size: "中型", status: "中途安置", area: "台南", intro: "曾在車站附近救援，正在練習信任人。", photos: ["assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-03.png"] },
  { id: "D-005", name: "奶茶", breed: "黃金獵犬混種", age: "3 歲", sex: "母", size: "大型", status: "開放認養", area: "新竹", intro: "親人穩定，喜歡被梳毛，適合有散步習慣的家庭。", photos: ["assets/dogs/afu-02.png", "assets/dogs/afu-03.png", "assets/dogs/afu-01.png"] },
  { id: "D-006", name: "波波", breed: "柴犬混種", age: "5 歲", sex: "公", size: "中型", status: "行為觀察", area: "苗栗", intro: "有一點慢熟，熟悉後會主動靠近，適合有耐心的照顧者。", photos: ["assets/dogs/heitang-02.png", "assets/dogs/heitang-03.png", "assets/dogs/heitang-01.png"] },
  { id: "D-007", name: "雪球", breed: "瑪爾濟斯混種", age: "6 歲", sex: "母", size: "小型", status: "開放認養", area: "台北", intro: "安靜親人，適合公寓生活，目前已完成牙齒檢查。", photos: ["assets/dogs/mixiang-02.png", "assets/dogs/mixiang-03.png", "assets/dogs/mixiang-01.png"] },
  { id: "D-008", name: "可可", breed: "貴賓犬混種", age: "2 歲", sex: "母", size: "小型", status: "開放認養", area: "彰化", intro: "喜歡互動和玩具，會基本等待指令，適合新手家庭。", photos: ["assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-03.png", "assets/dogs/xiaolu-01.png"] },
  { id: "D-009", name: "栗子", breed: "柯基混種", age: "3 歲", sex: "公", size: "中小型", status: "開放認養", area: "嘉義", intro: "短腿愛散步，食慾穩定，需要控制體重與規律運動。", photos: ["assets/dogs/afu-03.png", "assets/dogs/afu-01.png", "assets/dogs/afu-02.png"] },
  { id: "D-010", name: "豆花", breed: "邊境牧羊犬混種", age: "1 歲", sex: "母", size: "中型", status: "訓練中", area: "高雄", intro: "聰明活潑，需要充足活動量，適合願意陪牠學習的家庭。", photos: ["assets/dogs/heitang-03.png", "assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png"] },
  { id: "D-011", name: "麻糬", breed: "比熊犬混種", age: "4 歲", sex: "公", size: "小型", status: "醫療觀察", area: "屏東", intro: "皮膚治療接近完成，個性溫和，適合室內陪伴生活。", photos: ["assets/dogs/mixiang-03.png", "assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png"] },
  { id: "D-012", name: "斑斑", breed: "米格魯混種", age: "5 歲", sex: "母", size: "中型", status: "開放認養", area: "宜蘭", intro: "嗅聞探索慾強，散步時很專注，適合喜歡戶外的家庭。", photos: ["assets/dogs/xiaolu-03.png", "assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-02.png"] },
  { id: "D-013", name: "海苔", breed: "黑色米克斯", age: "2 歲", sex: "公", size: "中型", status: "開放認養", area: "花蓮", intro: "外表酷但內心黏人，熟悉環境後會主動討摸。", photos: ["assets/dogs/heitang-01.png", "assets/dogs/heitang-02.png", "assets/dogs/heitang-03.png"] },
  { id: "D-014", name: "芋圓", breed: "臘腸犬混種", age: "7 歲", sex: "母", size: "小型", status: "開放認養", area: "台東", intro: "步調慢、喜歡安靜陪伴，需要避免過度跳上跳下。", photos: ["assets/dogs/mixiang-01.png", "assets/dogs/mixiang-02.png", "assets/dogs/mixiang-03.png"] },
  { id: "D-015", name: "旺來", breed: "哈士奇混種", age: "3 歲", sex: "公", size: "大型", status: "訓練中", area: "雲林", intro: "精力旺盛、表情豐富，需要穩定牽繩訓練和活動空間。", photos: ["assets/dogs/afu-01.png", "assets/dogs/afu-02.png", "assets/dogs/afu-03.png"] },
  { id: "D-016", name: "布丁", breed: "博美犬混種", age: "4 歲", sex: "母", size: "小型", status: "中途安置", area: "南投", intro: "警覺但不兇，正在練習不怕陌生人與外出聲音。", photos: ["assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-03.png"] },
  { id: "D-017", name: "橘子", breed: "秋田犬混種", age: "6 歲", sex: "公", size: "大型", status: "開放認養", area: "基隆", intro: "成熟穩重，適合有大型犬經驗、作息規律的家庭。", photos: ["assets/dogs/heitang-02.png", "assets/dogs/heitang-01.png", "assets/dogs/heitang-03.png"] },
  { id: "D-018", name: "芝麻", breed: "雪納瑞混種", age: "2 歲", sex: "母", size: "中小型", status: "開放認養", area: "台北", intro: "好奇心強，喜歡跟著人移動，適合願意陪伴互動的家庭。", photos: ["assets/dogs/mixiang-02.png", "assets/dogs/mixiang-01.png", "assets/dogs/mixiang-03.png"] },
  { id: "D-019", name: "木耳", breed: "牧羊犬混種", age: "5 歲", sex: "公", size: "中大型", status: "行為觀察", area: "新北", intro: "護家意識較高，需要有經驗的認養人慢慢建立信任。", photos: ["assets/dogs/xiaolu-02.png", "assets/dogs/xiaolu-01.png", "assets/dogs/xiaolu-03.png"] },
  { id: "D-020", name: "花生", breed: "巴哥犬混種", age: "8 歲", sex: "公", size: "小型", status: "高齡照護", area: "桃園", intro: "高齡但親人，適合安靜家庭，需定期追蹤呼吸與體重。", photos: ["assets/dogs/afu-02.png", "assets/dogs/afu-01.png", "assets/dogs/afu-03.png"] }
];

const frontProducts = [
  { id: "P-101", slug: "canvas-walk-bag", name: "陪伴散步帆布袋", price: 680, stock: 42, category: "生活用品", invoiceType: "義賣收據", desc: "厚磅帆布，可放牽繩、水瓶與拾便袋。", detail: "適合日常散步、志工外出與認養家庭使用。義賣盈餘投入收容犬醫療與飼料照護。", photos: ["assets/products/canvas-bag-01.png", "assets/products/canvas-bag-02.png", "assets/products/canvas-bag-03.png"] },
  { id: "P-102", slug: "dog-postcards", name: "浪犬插畫明信片組", price: 220, stock: 128, category: "紙品", invoiceType: "義賣收據", desc: "每組 8 張，義賣所得投入醫療基金。", detail: "以救援犬故事為靈感的插畫明信片，適合作為公益活動小物、感謝卡或收藏。", photos: ["assets/products/postcards-01.png", "assets/products/postcards-02.png", "assets/products/postcards-03.png"] },
  { id: "P-103", slug: "steel-dog-bowl", name: "守護者不鏽鋼碗", price: 480, stock: 36, category: "寵物用品", invoiceType: "義賣收據", desc: "耐用易清洗，適合中小型犬。", detail: "不鏽鋼材質耐用好清潔，可作為認養準備用品，也適合捐贈給中途家庭。", photos: ["assets/products/steel-bowl-01.png", "assets/products/steel-bowl-02.png", "assets/products/steel-bowl-03.png"] },
  { id: "P-104", slug: "agarwood-charm", name: "沉香守護香牌", price: 1280, stock: 24, category: "香氛小物", invoiceType: "電子發票", desc: "沉香調性溫潤沉穩，適合日常祈福。", detail: "搭配公益包裝與收據資訊，適合作為支持者禮物。", photos: ["assets/products/agarwood-01.png", "assets/products/agarwood-02.png", "assets/products/agarwood-03.png"] },
  { id: "P-105", slug: "sandalwood-charm", name: "檀香平安香牌", price: 1180, stock: 30, category: "香氛小物", invoiceType: "電子發票", desc: "木質調香氣，義賣所得投入照護。", detail: "適合企業小禮、活動回饋與日常使用。", photos: ["assets/products/sandalwood-01.png", "assets/products/sandalwood-02.png", "assets/products/sandalwood-03.png"] },
  { id: "P-106", slug: "charity-sachet", name: "公益香囊組", price: 360, stock: 64, category: "香氛小物", invoiceType: "電子發票", desc: "布質香囊組，清爽自然。", detail: "可放置衣櫃、車內與辦公桌，收益支持園區清潔用品。", photos: ["assets/products/sachet-01.png", "assets/products/sachet-02.png", "assets/products/sachet-03.png"] },
  { id: "P-107", slug: "charity-giftset", name: "節慶公益禮盒", price: 1680, stock: 18, category: "禮盒", invoiceType: "電子發票", desc: "香品與公益小物組合。", detail: "適合節慶送禮，附公益用途說明卡。", photos: ["assets/products/giftset-01.png", "assets/products/giftset-02.png", "assets/products/giftset-03.png"] },
  { id: "P-108", slug: "rescue-badge", name: "浪犬守護徽章", price: 180, stock: 95, category: "文創商品", invoiceType: "義賣收據", desc: "可別在帆布袋、帽子或背包上。", detail: "小額支持也能累積照護能量，適合活動攤位販售。", photos: ["assets/products/badge-01.png", "assets/products/badge-02.png", "assets/products/badge-03.png"] },
  { id: "P-109", slug: "cotton-bandana", name: "棉質領巾", price: 320, stock: 50, category: "寵物用品", invoiceType: "義賣收據", desc: "柔軟棉質，適合拍照與日常配戴。", detail: "多色搭配，收益投入認養前用品補給。", photos: ["assets/products/cotton-bandana-01.png"] },
  { id: "P-110", slug: "leash-set", name: "散步牽繩組", price: 760, stock: 28, category: "寵物用品", invoiceType: "義賣收據", desc: "日常外出牽繩與拾便袋收納。", detail: "適合認養家庭準備，也可捐給中途照護者。", photos: ["assets/products/leash-set-01.png"] },
  { id: "P-111", slug: "paw-coasters", name: "肉球吸水杯墊", price: 260, stock: 80, category: "生活用品", invoiceType: "電子發票", desc: "吸水陶瓷杯墊，桌面實用小物。", detail: "低門檻公益商品，適合第一次支持者。", photos: ["assets/products/paw-coasters-01.png"] },
  { id: "P-112", slug: "paw-tumbler", name: "浪犬保溫杯", price: 890, stock: 34, category: "生活用品", invoiceType: "電子發票", desc: "外出與辦公皆適用。", detail: "保溫杯收益支援園區日常耗材。", photos: ["assets/products/paw-tumbler-01.png"] },
  { id: "P-113", slug: "pet-first-aid-kit", name: "寵物急救包", price: 980, stock: 22, category: "照護用品", invoiceType: "電子發票", desc: "基礎包紮與清潔用品組。", detail: "適合中途家庭與志工外出救援時備用。", photos: ["assets/products/pet-first-aid-kit-01.png"] },
  { id: "P-114", slug: "rescue-dog-calendar", name: "救援犬桌曆", price: 520, stock: 60, category: "紙品", invoiceType: "義賣收據", desc: "收錄園區犬隻與救援故事。", detail: "每月一則照護紀錄，讓支持延續一整年。", photos: ["assets/products/rescue-dog-calendar-01.png"] },
  { id: "P-115", slug: "treat-pouch", name: "訓練零食袋", price: 420, stock: 45, category: "寵物用品", invoiceType: "義賣收據", desc: "訓練與散步時方便攜帶零食。", detail: "適合志工牽繩訓練與認養家庭使用。", photos: ["assets/products/treat-pouch-01.png"] },
  { id: "P-116", slug: "washable-pet-mat", name: "可水洗寵物墊", price: 680, stock: 38, category: "寵物用品", invoiceType: "義賣收據", desc: "可機洗，適合犬隻休息區。", detail: "可自用，也可作為園區物資支持。", photos: ["assets/products/washable-pet-mat-01.png"] }
];

const frontStories = [
  { id: "story-01", title: "從工地到家庭，阿福學會安心睡覺", date: "2026/05/08", tag: "認養成功", image: "assets/stories/story-01.png", photos: ["assets/stories/story-01.png", "assets/stories/story-01-02.png", "assets/stories/story-01-03.png"], summary: "阿福完成健康檢查、驅蟲、疫苗與社會化訓練，最後被穩定家庭認養。", body: ["阿福是在工地附近被通報的孩子，剛到園區時總是找角落躲著，對聲音特別敏感。", "照護組用固定散步和簡單指令訓練幫牠建立安全感，也把支出透明記錄給支持者查看。"] },
  { id: "story-02", title: "夜間通報後的橋下救援", date: "2026/04/22", tag: "現場救援", image: "assets/stories/story-02.png", photos: ["assets/stories/story-02.png", "assets/stories/story-02-02.png", "assets/stories/story-02-03.png"], summary: "救援組在夜間完成誘捕、隔離與第一時間檢查。", body: ["夜間通報通常最難處理，現場光線不足、車流複雜，也需要避免讓動物再次受驚。", "捐款支應交通、誘捕設備、隔離籠位與第一時間檢查。"] },
  { id: "story-03", title: "校園生命教育與認養講座", date: "2026/03/18", tag: "教育推廣", image: "assets/stories/story-08.png", photos: ["assets/stories/story-08.png", "assets/stories/story-08-02.png", "assets/stories/story-08-03.png"], summary: "志工帶著穩定犬隻進校園分享正確互動與認養責任。", body: ["生命教育不是宣傳口號，而是讓孩子學會如何安全、尊重地和動物互動。", "活動支出包含交通、教材、犬隻保險與志工行政成本。"] }
];

let frontDogPage = 1;
let frontCart = [];
try {
  frontCart = JSON.parse(localStorage.getItem("petsFrontCartV1") || "[]");
  if (!Array.isArray(frontCart)) frontCart = [];
} catch {
  localStorage.removeItem("petsFrontCartV1");
  frontCart = [];
}
const frontMoney = value => `NT$ ${Number(value || 0).toLocaleString("zh-TW")}`;
const frontSaveCart = () => localStorage.setItem("petsFrontCartV1", JSON.stringify(frontCart));
const publicDogs = () => safeList(db.dogs);
const publicProducts = () => safeList(db.products);
const publicStories = () => safeList(db.stories);

function frontShell(title, intro, body, eyebrow = "Stray Dog Shelter Charity") {
  return `<section class="section"><div class="section-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${intro}</p></div><a class="button secondary" href="#cart">購物車 ${frontCart.reduce((sum, item) => sum + item.qty, 0)}</a></div>${body}</section>`;
}

function frontHome() {
  return `<section class="hero"><div class="hero-inner"><p class="eyebrow">Stray Dog Shelter Charity</p><h1>讓每一隻等待家的浪犬，被好好照顧到回家的那天</h1><p>整合救援、醫療、認養媒合、善終服務與公益義賣，讓捐款流向清楚、故事被看見、照護不中斷。</p><div class="hero-actions"><a class="button" href="#donate">立即捐款</a><a class="button secondary" href="#dogs">我要認養</a></div></div></section><section class="section"><div class="metric-grid"><div class="metric"><strong>52</strong><span>今年成功認養</span></div><div class="metric"><strong>${publicDogs().length}</strong><span>等待家的狗狗</span></div><div class="metric"><strong>${publicProducts().length}</strong><span>公益義賣商品</span></div><div class="metric"><strong>${db.expenses.length}</strong><span>照護支出紀錄</span></div></div></section>`;
}

function frontDogsPage() {
  const perPage = 8;
  const rows = publicDogs();
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  frontDogPage = Math.min(Math.max(frontDogPage, 1), totalPages);
  const dogs = rows.slice((frontDogPage - 1) * perPage, frontDogPage * perPage);
  return frontShell("正在等待家的狗狗", "每張犬隻卡片都可延伸成詳細頁，包含健康狀態、品種、個性與認養資訊。", `<div class="dog-page-meta"><span>共 ${rows.length} 隻等待認養</span><span>第 ${frontDogPage} / ${totalPages} 頁，每頁 ${perPage} 隻</span></div><div class="grid cols-4">${dogs.map(dog => `<article class="card dog-card"><a class="dog-card-link" href="#dog-${dog.id}"><img class="dog-photo" src="${dog.photos[0]}" alt="${dog.name}主照片"></a><div class="card-body"><div class="between"><strong>${dog.id}</strong><span>${dog.area}</span></div><h3><a href="#dog-${dog.id}">${dog.name}</a></h3><p>${dog.intro}</p><div class="meta"><span class="tag">${dog.breed}</span><span class="tag">${dog.age}</span><span class="tag">${dog.sex}</span><span class="tag">${dog.size}</span><span class="tag">${dog.status}</span></div><div class="actions"><a class="button secondary" href="#dog-${dog.id}">看更多照片</a></div></div></article>`).join("")}</div><div class="pagination"><button class="button secondary" data-front-dog-page="${frontDogPage - 1}" ${frontDogPage === 1 ? "disabled" : ""}>上一頁</button><span>第 ${frontDogPage} 頁 / 共 ${totalPages} 頁</span><button class="button secondary" data-front-dog-page="${frontDogPage + 1}" ${frontDogPage === totalPages ? "disabled" : ""}>下一頁</button></div>`, "Adoption");
}

function frontDogDetail(id) {
  const dog = publicDogs().find(item => item.id === id) || publicDogs()[0];
  return `<section class="section"><div class="dog-detail product-detail"><div><img class="product-main" data-gallery-main src="${dog.photos[0]}" alt="${dog.name}主照片"><div class="product-thumbs">${dog.photos.map((photo, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-gallery-thumb="${photo}"><img src="${photo}" alt="${dog.name}照片 ${index + 1}"></button>`).join("")}</div><article class="product-description"><span class="tag">狗狗小檔案</span><h2>${dog.name} 正在等待一個家</h2><p>${dog.intro} 我們會先安排互動與照護說明，確認生活型態適合後再進入認養流程。</p><div class="product-points"><span>${dog.breed}</span><span>${dog.age}</span><span>${dog.size}</span><span>${dog.status}</span></div></article></div><div class="panel product-info"><a class="tag" href="#dogs">回等待家的狗狗</a><h1>${dog.name}</h1><p>${dog.intro}</p><div class="money-ledger"><div><span>編號</span><strong>${dog.id}</strong></div><div><span>地區</span><strong>${dog.area}</strong></div><div><span>品種</span><strong>${dog.breed}</strong></div><div><span>年齡</span><strong>${dog.age}</strong></div><div><span>性別</span><strong>${dog.sex}</strong></div><div><span>體型</span><strong>${dog.size}</strong></div><div><span>狀態</span><strong>${dog.status}</strong></div></div><div class="actions"><a class="button secondary" href="#dogs">看其他狗狗</a></div></div></div></section>`;
}

function frontShop() {
  return frontShell("義賣商城", "義賣所得投入園區清潔、醫療與認養前準備。", `<div class="grid cols-3">${publicProducts().map(product => `<article class="card"><a href="#product-${product.slug}"><img class="product-photo" src="${product.photos[0]}" alt="${product.name}"></a><div class="card-body"><span class="tag">${product.category}</span><h3><a href="#product-${product.slug}">${product.name}</a></h3><p>${product.desc}</p><strong>${frontMoney(product.price)}</strong><div class="actions"><a class="button secondary" href="#product-${product.slug}">看商品細節</a><button class="button" type="button" data-add-cart="${product.slug}">放入購物車</button></div></div></article>`).join("")}</div>`, "Charity Shop");
}

function frontProductDetail(slug) {
  const product = publicProducts().find(item => item.slug === slug) || publicProducts()[0];
  const photoSlots = [...product.photos];
  while (photoSlots.length < 3) photoSlots.push("");
  return `<section class="section"><div class="product-detail"><div class="product-gallery"><img class="product-main" data-gallery-main src="${product.photos[0]}" alt="${product.name}主照片"><div class="product-thumbs">${photoSlots.map((photo, index) => photo ? `<button class="${index === 0 ? "active" : ""}" type="button" data-gallery-thumb="${photo}"><img src="${photo}" alt="${product.name}照片 ${index + 1}"></button>` : `<div class="product-thumb-empty"></div>`).join("")}</div><article class="product-description"><span class="tag">${product.category}</span><h2>${product.name}</h2><p>${product.detail}</p><div class="product-points"><span>${product.invoiceType}</span><span>庫存 ${product.stock}</span><span>義賣支持照護</span></div></article></div><aside class="panel product-info"><a class="tag" href="#shop">回義賣商城</a><h1>${product.name}</h1><p>${product.desc}</p><div class="money-ledger"><div><span>商品編號</span><strong>${product.id}</strong></div><div><span>分類</span><strong>${product.category}</strong></div><div><span>庫存</span><strong>${product.stock}</strong></div><div><span>價格</span><strong>${frontMoney(product.price)}</strong></div></div><div class="actions"><button class="button" type="button" data-add-cart="${product.slug}">放入購物車</button><a class="button secondary" href="#cart">前往購物車</a></div></aside></div></section>`;
}

function frontCartPage() {
  const lines = frontCart.map(item => ({ ...item, product: publicProducts().find(product => product.slug === item.slug) })).filter(item => item.product);
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const threshold = Number(db.shopSettings.freeShippingThreshold || 0);
  const shipping = subtotal >= threshold || subtotal === 0 ? 0 : Number(db.shopSettings.shippingFee || 0);
  return frontShell("購物車", "確認義賣商品與數量後，可送出訂購需求。", lines.length ? `<div class="cart-layout"><div class="panel"><div class="table-wrap"><table><thead><tr><th>商品</th><th>數量</th><th>小計</th><th>操作</th></tr></thead><tbody>${lines.map(item => `<tr><td>${item.product.name}</td><td><button class="button secondary" data-cart-qty="${item.slug}" data-delta="-1">-</button> ${item.qty} <button class="button secondary" data-cart-qty="${item.slug}" data-delta="1">+</button></td><td>${frontMoney(item.product.price * item.qty)}</td><td><button class="button secondary danger" data-cart-remove="${item.slug}">移除</button></td></tr>`).join("")}</tbody></table></div></div><aside class="panel product-info"><h2>訂單摘要</h2><div class="money-ledger"><div><span>商品小計</span><strong>${frontMoney(subtotal)}</strong></div><div><span>運費</span><strong>${shipping ? frontMoney(shipping) : "免運"}</strong></div><div><span>合計</span><strong>${frontMoney(subtotal + shipping)}</strong></div></div><form id="frontOrderForm" class="form-grid"><div class="field full"><label>姓名</label><input required></div><div class="field full"><label>聯絡電話</label><input required></div><button class="button" type="submit">送出訂購需求</button></form><div class="donation-result" id="frontOrderResult" hidden></div></aside></div>` : `<div class="empty-state">購物車目前沒有商品。<br><br><a class="button" href="#shop">回義賣商城</a></div>`, "Cart");
}

function frontStoriesPage() {
  return frontShell("救援故事", "用真實紀錄串起救援、醫療、訓練與回家的每一步。", `<div class="grid cols-3">${publicStories().map(story => `<article class="card story-card"><a href="#${story.id}"><img class="story-photo" src="${story.image}" alt="${story.title}"></a><div class="card-body"><div class="between"><span class="tag">${story.tag}</span><small>${story.date}</small></div><h3><a href="#${story.id}">${story.title}</a></h3><p>${story.summary}</p><div class="actions"><a class="button secondary" href="#${story.id}">閱讀故事</a><a class="button secondary" href="#donate">支持相關專案</a></div></div></article>`).join("")}</div>`, "Rescue Stories");
}

function frontStoryDetail(id) {
  const story = publicStories().find(item => item.id === id) || publicStories()[0];
  return `<article class="story-article"><div class="story-hero"><img src="${story.photos[0]}" alt="${story.title}"><div class="story-hero-copy"><a class="tag" href="#stories">回救援故事</a><p class="eyebrow">${story.tag} / ${story.date}</p><h1>${story.title}</h1><p>${story.summary}</p><div class="hero-actions"><a class="button" href="#donate">支持相關專案</a><a class="button ghost" href="#stories">看其他故事</a></div></div></div></article><section class="section"><div class="story-layout"><div class="story-content">${story.body.map(text => `<p>${text}</p>`).join("")}</div><aside class="panel story-aside"><h2>故事資訊</h2><div class="money-ledger"><div><span>日期</span><strong>${story.date}</strong></div><div><span>分類</span><strong>${story.tag}</strong></div><div><span>照片</span><strong>${story.photos.length} 張</strong></div></div></aside></div></section><section class="section alt"><div class="section-header"><div><h2>照片紀錄</h2><p>保留救援與照護過程，讓支持者能追蹤每一步。</p></div></div><div class="story-gallery">${story.photos.map((photo, index) => `<img src="${photo}" alt="${story.title}照片 ${index + 1}">`).join("")}</div></section>`;
}

function frontDonatePage() {
  return frontShell("捐款系統", "選擇想支持的照護專案，讓每筆善款都有清楚用途。", `<form class="panel donation-form" id="frontDonationForm"><div class="campaign-options">${["急難醫療基金", "每月飼料與清潔", "善終服務基金"].map((name, index) => `<label class="${index === 0 ? "selected" : ""}"><input type="radio" name="frontDonationCampaign" value="${name}" ${index === 0 ? "checked" : ""}><span>${name}</span><small>支持透明照護紀錄</small></label>`).join("")}</div><div class="form-grid"><div class="field"><label>捐款人</label><input id="frontDonorName" required></div><div class="field"><label>金額</label><input id="frontDonationAmount" type="number" value="1000" required></div><div class="field"><label>付款方式</label><select id="frontDonationMethod"><option>信用卡</option><option>ATM</option><option>銀行轉帳</option></select></div><div class="field"><label>收據抬頭</label><input id="frontReceiptTitle"></div></div><div class="actions">${[500, 1000, 2000, 3600].map(amount => `<button class="button secondary" type="button" data-donation-amount="${amount}">${frontMoney(amount)}</button>`).join("")}<button class="button" type="submit">送出捐款</button></div><div class="donation-result" id="frontDonationResult" hidden></div></form>`, "Donation");
}

function frontReceiptLookup() {
  return frontShell("收據查詢", "輸入捐款編號或收據編號，查詢目前處理狀態。", `<form class="panel" id="receiptLookupForm"><div class="field"><label>查詢關鍵字</label><input id="receiptLookupKeyword" placeholder="例如 DN20260500001 或 R20260500001" required></div><button class="button" type="submit">查詢</button><div id="receiptLookupResult"></div></form>`, "Receipt");
}

function frontFarewell() {
  const steps = [["01", "通", "通報確認", "記錄地點、照片、時間與安全狀態。", "assets/service-flow/report-confirmation.svg"], ["02", "接", "接運安置", "安排合作車輛接運，掃描晶片並查詢飼主資料。", "assets/service-flow/pickup-care.svg"], ["03", "別", "告別處理", "依狀況安排個別或集體火化，保留紀念紀錄。", "assets/service-flow/farewell-care.svg"], ["04", "公", "費用公開", "公開支出用途、供應商、金額與憑證狀態。", "assets/service-flow/public-ledger.svg"]];
  return `<section class="section split"><div><p class="eyebrow">Farewell Care</p><h1>街頭與收容動物善終服務</h1><p>當路邊被車撞、無主死亡，或收容中心高齡病弱動物離世時，善終基金協助接運、晶片掃描、遺體安置、火化與公開紀錄。</p><div class="hero-actions"><a class="button" href="#donate">支持善終基金</a><a class="button secondary" href="#volunteer">通報與聯絡</a></div></div><article class="panel"><span class="tag">100 位支持者</span><h2>街頭與收容動物善終基金</h2><p>協助路倒動物接運、遺體安置、個別或集體火化與紀念紀錄。</p><div class="progress"><span style="width:100%"></span></div><div class="between"><span>已募 NT$ 207,500</span><span>目標 NT$ 160,000</span></div></article></section><section class="section alt service-flow-section"><div class="section-header"><div><p class="eyebrow">Service Flow</p><h2>服務流程</h2><p>避免讓動物遺體長時間暴露，也保留必要紀錄與費用公開。</p></div></div><div class="service-flow">${steps.map(step => `<article class="service-step"><span class="step-number">${step[0]}</span><div class="service-illustration"><img class="service-illustration-image" src="${step[4]}" alt="${step[2]}流程插畫"></div><div><span class="service-icon">${step[1]}</span><h3>${step[2]}</h3><p>${step[3]}</p></div></article>`).join("")}</div></section>`;
}

function frontVolunteer() {
  return frontShell("志工與聯絡", "成為志工、認養人或定期支持者，讓照護工作更穩定。", `<div class="split"><article class="panel"><h2>留下參與方式</h2><div class="form-grid"><div class="field"><label>姓名</label><input placeholder="請輸入姓名"></div><div class="field"><label>聯絡方式</label><input placeholder="電話或 Email"></div><div class="field full"><label>參與方式</label><select><option>我想認養</option><option>我想當志工</option><option>我想定期捐款</option><option>企業合作</option></select></div></div><button class="button" type="button">送出聯絡需求</button></article><article class="panel"><h2>聯絡資訊</h2><p>服務時間：週二至週日 10:00-18:00</p><p>LINE：@straydog-home</p><p>Email：service@example.org</p></article></div>`, "Contact");
}

function render() {
  const route = location.hash.replace("#", "") || "home";
  const routes = { home: frontHome, stories: frontStoriesPage, donate: frontDonatePage, "donate-now": frontDonatePage, "receipt-lookup": frontReceiptLookup, farewell: frontFarewell, dogs: frontDogsPage, shop: frontShop, cart: frontCartPage, volunteer: frontVolunteer, admin };
  if (route.startsWith("dog-")) app.innerHTML = frontDogDetail(route.replace("dog-", ""));
  else if (route.startsWith("adoption-apply-")) app.innerHTML = frontAdoptionApply(route.replace("adoption-apply-", ""));
  else if (route.startsWith("product-")) app.innerHTML = frontProductDetail(route.replace("product-", ""));
  else if (route.startsWith("story-")) app.innerHTML = frontStoryDetail(route);
  else app.innerHTML = (routes[route] || routes.home)();
  document.querySelectorAll(".site-nav a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${route}` || (route.startsWith("story-") && link.getAttribute("href") === "#stories") || (route.startsWith("product-") && link.getAttribute("href") === "#shop")));
  bind();
}

function bind() {
  menuButton?.addEventListener("click", () => nav?.classList.toggle("open"));
  nav?.addEventListener("click", () => nav.classList.remove("open"));

  document.querySelectorAll("[data-admin]").forEach(button => button.addEventListener("click", () => {
    activeAdmin = button.dataset.admin;
    adminModalState = null;
    render();
  }));

  document.querySelectorAll("[data-admin-create]").forEach(button => button.addEventListener("click", () => {
    adminModalState = { collection: button.dataset.adminCreate, mode: "create", id: "" };
    render();
  }));

  document.querySelectorAll("[data-admin-edit]").forEach(button => button.addEventListener("click", () => {
    adminModalState = { collection: button.dataset.adminEdit, mode: "edit", id: button.dataset.adminId };
    render();
  }));

  document.querySelectorAll("[data-admin-delete]").forEach(button => button.addEventListener("click", () => {
    const collection = button.dataset.adminDelete;
    const schema = schemas[collection];
    if (!schema || !Array.isArray(db[collection])) return;
    db[collection] = db[collection].filter(item => String(item[schema.idKey]) !== String(button.dataset.adminId));
    normalizeData();
    saveLocalData();
    render();
  }));

  document.querySelectorAll("[data-admin-close]").forEach(button => button.addEventListener("click", () => {
    adminModalState = null;
    render();
  }));

  document.querySelector("#adminCrudForm")?.addEventListener("submit", event => {
    event.preventDefault();
    saveCrud(event.currentTarget);
  });

  document.querySelector("#adminLoginForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.querySelector("#adminUsername").value.trim();
    const password = document.querySelector("#adminPassword").value;
    const result = document.querySelector("#adminLoginResult");
    if (username === db.adminAuth.username && password === db.adminAuth.password) {
      adminLoggedIn = true;
      currentAdminRole = "admin";
      currentAdminUsername = username;
      sessionStorage.setItem("charityAdminLoggedIn", "true");
      sessionStorage.setItem("charityAdminRole", "admin");
      sessionStorage.setItem("charityAdminUsername", username);
      activeAdmin = "dashboard";
      render();
      return;
    }
    const user = db.adminUsers.find(item => item.username === username && item.password === password);
    if (user) {
      adminLoggedIn = true;
      currentAdminRole = "user";
      currentAdminUsername = user.username;
      sessionStorage.setItem("charityAdminLoggedIn", "true");
      sessionStorage.setItem("charityAdminRole", "user");
      sessionStorage.setItem("charityAdminUsername", user.username);
      activeAdmin = user.permissions[0] || "dashboard";
      render();
      return;
    }
    if (result) {
      result.hidden = false;
      result.textContent = "帳號或密碼不正確。";
    }
  });

  document.querySelector("#adminLogout")?.addEventListener("click", () => {
    adminLoggedIn = false;
    sessionStorage.removeItem("charityAdminLoggedIn");
    sessionStorage.removeItem("charityAdminRole");
    sessionStorage.removeItem("charityAdminUsername");
    render();
  });

  document.querySelectorAll("[data-filter-kind]").forEach(field => field.addEventListener("input", () => {
    const kind = field.dataset.filterKind;
    const key = field.dataset.filterKey;
    draftFilters[kind][key] = key === "perPage" ? Number(field.value) : field.value;
  }));

  document.querySelectorAll("[data-apply-filter]").forEach(button => button.addEventListener("click", () => {
    const kind = button.dataset.applyFilter;
    appliedFilters[kind] = { ...draftFilters[kind], page: 1 };
    render();
  }));

  document.querySelectorAll("[data-reset-filter]").forEach(button => button.addEventListener("click", () => {
    const kind = button.dataset.resetFilter;
    appliedFilters[kind] = emptyFilters();
    draftFilters[kind] = { ...appliedFilters[kind] };
    render();
  }));

  document.querySelectorAll("[data-page-kind]").forEach(button => button.addEventListener("click", () => {
    const kind = button.dataset.pageKind;
    appliedFilters[kind].page = Number(button.dataset.page);
    draftFilters[kind].page = Number(button.dataset.page);
    render();
  }));

  document.querySelectorAll("[data-admin-media-upload]").forEach(input => input.addEventListener("change", async () => {
    const field = input.closest(".admin-media-field");
    const valueField = field?.querySelector("[data-admin-media-value]");
    const preview = field?.querySelector("[data-admin-media-preview]");
    if (!valueField || !preview) return;
    const files = Array.from(input.files || []);
    const values = await Promise.all(files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    })));
    valueField.value = input.multiple ? values.join("\n") : values[0] || "";
    preview.innerHTML = values.length ? values.map(src => `<img src="${src}" alt="照片預覽">`).join("") : "<span>尚未選擇照片</span>";
  }));

  document.querySelector("#shopSettingsForm")?.addEventListener("submit", event => {
    event.preventDefault();
    db.shopSettings.freeShippingThreshold = Number(document.querySelector("#freeShippingThreshold").value || 0);
    db.shopSettings.shippingFee = Number(document.querySelector("#shippingFee").value || 0);
    saveLocalData();
    render();
  });

  document.querySelector("#adminCredentialForm")?.addEventListener("submit", event => {
    event.preventDefault();
    db.adminAuth.username = document.querySelector("#adminNewUsername").value.trim();
    db.adminAuth.password = document.querySelector("#adminNewPassword").value;
    saveLocalData();
    render();
  });

  document.querySelector("#adminUserForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.querySelector("#adminUserUsername").value.trim();
    const password = document.querySelector("#adminUserPassword").value;
    if (!username || !password) return;
    const permissions = Array.from(document.querySelectorAll("input[name='adminUserPermission']:checked")).map(input => input.value);
    db.adminUsers.push({
      name: document.querySelector("#adminUserName").value.trim() || username,
      username,
      password,
      permissions
    });
    normalizeData();
    saveLocalData();
    render();
  });

  document.querySelectorAll("[data-delete-admin-user]").forEach(button => button.addEventListener("click", () => {
    db.adminUsers = db.adminUsers.filter(user => user.username !== button.dataset.deleteAdminUser);
    saveLocalData();
    render();
  }));

  document.querySelectorAll("[data-gallery-thumb]").forEach(button => button.addEventListener("click", () => {
    const main = document.querySelector("[data-gallery-main]");
    if (!main) return;
    main.src = button.dataset.galleryThumb;
    document.querySelectorAll("[data-gallery-thumb]").forEach(item => item.classList.toggle("active", item === button));
  }));
  document.querySelectorAll("[data-front-dog-page]").forEach(button => button.addEventListener("click", () => {
    frontDogPage = Number(button.dataset.frontDogPage);
    render();
  }));
  document.querySelectorAll("[data-add-cart]").forEach(button => button.addEventListener("click", () => {
    const slug = button.dataset.addCart;
    const item = frontCart.find(cartItem => cartItem.slug === slug);
    if (item) item.qty += 1;
    else frontCart.push({ slug, qty: 1 });
    frontSaveCart();
    button.textContent = "已加入購物車";
    setTimeout(render, 300);
  }));
  document.querySelectorAll("[data-cart-qty]").forEach(button => button.addEventListener("click", () => {
    const item = frontCart.find(cartItem => cartItem.slug === button.dataset.cartQty);
    if (!item) return;
    item.qty += Number(button.dataset.delta);
    if (item.qty <= 0) frontCart = frontCart.filter(cartItem => cartItem.slug !== item.slug);
    frontSaveCart();
    render();
  }));
  document.querySelectorAll("[data-cart-remove]").forEach(button => button.addEventListener("click", () => {
    frontCart = frontCart.filter(item => item.slug !== button.dataset.cartRemove);
    frontSaveCart();
    render();
  }));
  document.querySelectorAll("[data-donation-amount]").forEach(button => button.addEventListener("click", () => {
    const input = document.querySelector("#frontDonationAmount");
    if (input) input.value = button.dataset.donationAmount;
  }));
  document.querySelectorAll("input[name='frontDonationCampaign']").forEach(input => input.addEventListener("change", () => {
    document.querySelectorAll(".campaign-options label").forEach(label => label.classList.toggle("selected", label.contains(input) && input.checked));
  }));
  document.querySelector("#frontDonationForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const amount = Number(document.querySelector("#frontDonationAmount").value || 0);
    const campaign = document.querySelector("input[name='frontDonationCampaign']:checked")?.value || "急難醫療基金";
    const receiptTitle = document.querySelector("#frontReceiptTitle").value.trim();
    const donorName = document.querySelector("#frontDonorName").value.trim() || "匿名捐款人";
    const paymentMethod = document.querySelector("#frontDonationMethod").value;
    const no = `DN${Date.now()}`;
    const receiptNo = `R${Date.now()}`;
    const donation = {
      no,
      paidAt: today,
      name: donorName,
      amount,
      campaign,
      method: paymentMethod,
      subject: campaign.includes("醫療") ? "4101 指定用途捐款收入-醫療救援" : "4101 指定用途捐款收入",
      receiptNo,
      receiptType: "年度收據",
      status: paymentMethod === "信用卡" ? "已對帳" : "待對帳"
    };
    db.donations.unshift(donation);
    db.receipts.unshift({
      no: receiptNo,
      donation: no,
      title: receiptTitle || donorName,
      type: "年度收據",
      delivery: "Email",
      status: paymentMethod === "信用卡" ? "待寄送" : "待開立"
    });
    saveLocalData();
    const result = document.querySelector("#frontDonationResult");
    result.hidden = false;
    result.innerHTML = `<strong>捐款資料已建立：${no}</strong><p>專案：${campaign}｜金額：${frontMoney(amount)}｜狀態：${donation.status}</p><p>這筆資料已同步到後台「捐款管理 / 捐款收據」。</p>`;
  });
  document.querySelector("#receiptLookupForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const keyword = document.querySelector("#receiptLookupKeyword").value.trim().toLowerCase();
    const receipt = db.receipts.find(item => [item.no, item.donation, item.title, item.status].join(" ").toLowerCase().includes(keyword));
    document.querySelector("#receiptLookupResult").innerHTML = receipt
      ? `<div class="donation-result"><strong>查到收據資料</strong><div class="receipt-result-grid"><div><span>收據號碼</span><strong>${receipt.no}</strong></div><div><span>捐款編號</span><strong>${receipt.donation}</strong></div><div><span>抬頭</span><strong>${receipt.title}</strong></div><div><span>狀態</span><strong>${receipt.status}</strong></div></div></div>`
      : `<div class="donation-result warn">查無符合資料，請確認捐款編號、收據號碼或收據抬頭。</div>`;
  });
  document.querySelector("#frontOrderForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const formInputs = Array.from(event.currentTarget.querySelectorAll("input"));
    const lines = frontCart.map(item => ({ ...item, product: publicProducts().find(product => product.slug === item.slug) })).filter(item => item.product);
    const subtotal = lines.reduce((total, item) => total + item.product.price * item.qty, 0);
    const threshold = Number(db.shopSettings.freeShippingThreshold || 0);
    const shipping = subtotal >= threshold || subtotal === 0 ? 0 : Number(db.shopSettings.shippingFee || 0);
    const orderNo = `OD${Date.now()}`;
    db.orders.unshift({
      no: orderNo,
      createdAt: today,
      buyer: formInputs[0]?.value || "未命名購買人",
      phone: formInputs[1]?.value || "",
      item: lines.map(line => `${line.product.name} x ${line.qty}`).join("、"),
      total: subtotal + shipping,
      payment: "待聯繫",
      invoiceType: "電子發票",
      invoiceStatus: "待開立",
      status: "待出貨"
    });
    saveLocalData();
    const result = document.querySelector("#frontOrderResult");
    result.hidden = false;
    result.textContent = `訂購需求已建立：${orderNo}，後台「訂單管理 / 發票管理」可查看。`;
    frontCart = [];
    frontSaveCart();
  });
}

// Repair layer: keep the existing prototype code, but restore the production
// data source and the missing public/admin flows in one predictable place.
const repairCampaigns = [
  { name: "急難醫療基金", note: "急診、手術、住院與術後照護", raised: 860000, goal: 1200000 },
  { name: "每月飼料與清潔", note: "飼料、清潔用品、除蚤與日常耗材", raised: 420000, goal: 600000 },
  { name: "善終服務基金", note: "不對外接案，僅支援園區與合作救援個案的善終支出", raised: 207500, goal: 160000 },
  { name: "不指定一般捐款", note: "由犬舍依當月最急迫需求調度", raised: 260000, goal: 400000 }
];

const repairStorySeeds = [
  {
    id: "story-01",
    date: "2026-05-08",
    tag: "急難醫療",
    title: "阿福終於敢睡著了",
    summary: "阿福被發現時蜷縮在市場後巷，聽見腳步聲就發抖。牠不是不親人，只是太久沒有人溫柔地靠近牠。",
    image: "assets/stories/story-01.png",
    photos: ["assets/stories/story-01.png", "assets/stories/story-01-02.png", "assets/stories/story-01-03.png"],
    amount: 68500,
    body: [
      "第一次見到阿福，是一個雨後的清晨。市場鐵門還沒完全拉開，牠躲在紙箱和廢棄菜葉中間，身上的毛結成硬塊，右後腳不敢落地。志工蹲下來叫牠，牠沒有逃，只是把頭埋得更低，像在等一件牠已經習慣的壞事發生。",
      "我們把外套鋪在地上，花了四十分鐘才讓牠靠近。上車後牠沒有叫，只有很小聲、很短的喘息。獸醫檢查發現牠有舊骨裂、皮膚感染和嚴重營養不良。那天的醫療費不是一個漂亮的數字，卻是阿福重新被世界接住的第一步。",
      "住院第三天，阿福第一次把頭靠在護理師手上睡著。那一刻大家都安靜了，因為我們知道，救援不只是把牠帶離危險，也是在告訴牠：你可以不用再撐著了。",
      "這筆故事支出包含急診檢查、X 光、藥物、住院與後續復健，共 NT$ 68,500，已同步列入支出透明頁。每一筆捐款，都在幫像阿福這樣的孩子重新學會安心。"
    ]
  },
  {
    id: "story-02",
    date: "2026-05-04",
    tag: "救援安置",
    title: "蜜香等到一個不會放手的人",
    summary: "蜜香在廢棄工寮生下幼犬，自己瘦到只剩肋骨，卻還是把每一口食物推給孩子。",
    image: "assets/stories/story-02.png",
    photos: ["assets/stories/story-02.png", "assets/stories/story-02-02.png", "assets/stories/story-02-03.png"],
    amount: 42600,
    body: [
      "有人通報工寮裡有小狗哭，志工趕到時，看見蜜香站在門口。牠沒有衝過來，也沒有逃走，只是一直回頭看著角落。那裡有四隻小小的孩子，身上還帶著泥土和奶味。",
      "蜜香很瘦，瘦到摸得到每一節脊椎。可是我們放下罐頭時，牠先用鼻子把食物推向幼犬，自己只舔了邊緣一點點。那不是訓練出來的懂事，是一個媽媽把自己放到最後的本能。",
      "救援那天，我們把孩子一隻一隻抱上車，最後才輪到蜜香。她上車前停了一下，好像在確認孩子都在。到了犬舍後，她第一次放心吃完一整碗飯，也第一次在乾淨墊子上把身體攤開。",
      "蜜香一家的安置費、幼犬檢查、驅蟲、營養補充與隔離照護，共 NT$ 42,600。支持這個專案，不只是救一隻狗，是讓一個努力活下來的家庭有機會重新開始。"
    ]
  },
  {
    id: "story-03",
    date: "2026-04-28",
    tag: "術後照護",
    title: "黑糖的尾巴，又開始慢慢搖了",
    summary: "黑糖曾經因疼痛不讓任何人靠近，手術後牠用很小的力氣搖尾巴，像是在說牠願意再試一次。",
    image: "assets/stories/story-03.png",
    photos: ["assets/stories/story-03.png", "assets/stories/story-03-02.png", "assets/stories/story-03-03.png"],
    amount: 93600,
    body: [
      "黑糖被帶回來時，眼神很硬。牠不是兇，是痛到不知道該相信誰。每一次有人靠近傷口，牠都把身體縮成一團，喉嚨發出低低的警告聲。",
      "手術排在隔天早上。志工整晚輪流陪牠，沒有一直摸牠，只是在牠看得到的地方坐著。半夜三點，黑糖把鼻子慢慢伸到籠門邊，輕輕碰了一下志工的手。那是一個很小的動作，卻像是牠把心門開了一條縫。",
      "術後恢復不輕鬆，換藥、止痛、復健，每一步都需要時間。第十天，黑糖看見照護員拿著飯碗走來，尾巴搖了兩下。大家都笑了，因為那代表牠身體比較不痛了，也開始期待明天。",
      "黑糖的手術、麻醉、住院、藥物與復健支出共 NT$ 93,600。這些費用會公開在支出透明頁，讓每位支持者知道自己的善意如何變成牠重新搖尾巴的力量。"
    ]
  },
  {
    id: "story-04",
    date: "2026-04-20",
    tag: "長期照護",
    title: "老奶茶沒有被時間丟下",
    summary: "年老的奶茶走得慢、看不清楚，但牠每天仍會準時到門口等志工，像是在確認今天也有人記得牠。",
    image: "assets/stories/story-04.png",
    photos: ["assets/stories/story-04.png", "assets/stories/story-04-02.png", "assets/stories/story-04-03.png"],
    amount: 34800,
    body: [
      "奶茶已經很老了，走路會偏，眼睛也有白霧。牠不再像年輕狗一樣衝到最前面，但每天傍晚聽見鑰匙聲，仍會慢慢走到門口坐下。",
      "牠等的不是大餐，而是那句『奶茶，今天也有乖乖吃飯嗎？』對一隻年老的狗來說，被叫名字、被看見、被記得，就是很大的安全感。",
      "長期照護不刺激，也不容易被分享。它沒有驚險的救援畫面，只有每天洗墊子、餵藥、回診、剪指甲和陪牠慢慢走路。但正是這些不被看見的小事，撐住了奶茶最後一段生活的尊嚴。",
      "奶茶本月照護支出包含慢性病藥物、營養品、回診與照護耗材，共 NT$ 34,800。謝謝你讓年老的牠沒有被時間丟下。"
    ]
  },
  {
    id: "story-05",
    date: "2026-04-12",
    tag: "幼犬救援",
    title: "小鹿第一次知道手可以是溫柔的",
    summary: "小鹿總是躲在籠子最裡面，直到有一天牠主動把下巴放到志工掌心。",
    image: "assets/stories/story-05.png",
    photos: ["assets/stories/story-05.png", "assets/stories/story-05-02.png", "assets/stories/story-05-03.png"],
    amount: 22800,
    body: [
      "小鹿剛來時，最害怕人的手。只要手伸過去，牠就貼著牆發抖。我們不知道牠曾經遇過什麼，只知道牠需要的不是急著被抱起來，而是有權利慢慢相信。",
      "志工每天坐在籠外，手上放一點飼料，不追、不抓、不催。第一週，小鹿只敢趁人轉身時偷吃。第二週，牠願意在志工看著牠時走近。第三週，牠把下巴放到掌心，停了三秒。",
      "那三秒很短，卻足夠讓所有照護的人紅了眼眶。因為小鹿終於知道，手不一定會傷害牠，也可以是讓牠靠一下的地方。",
      "小鹿的幼犬檢查、疫苗、驅蟲、隔離照護與行為安撫支出共 NT$ 22,800。每一個願意等牠的人，都是牠重新信任世界的理由。"
    ]
  },
  {
    id: "story-06",
    date: "2026-04-03",
    tag: "行為復健",
    title: "米香學會把害怕說小聲一點",
    summary: "米香一開始用吠叫保護自己，後來牠學會先聞一聞、想一想，再決定要不要靠近。",
    image: "assets/stories/story-06.png",
    photos: ["assets/stories/story-06.png", "assets/stories/story-06-02.png", "assets/stories/story-06-03.png"],
    amount: 18600,
    body: [
      "米香的吠叫很大聲，大到第一次來訪的人都會停在門口。但熟悉牠的志工知道，那不是攻擊，是牠把害怕穿成盔甲。",
      "我們替米香安排固定照護員、固定散步路線，也讓牠練習用鼻子探索，而不是用吠叫把所有東西推開。進步很慢，有時一天只多走三步，有時只是少叫一次。",
      "某個下午，新志工蹲在牠旁邊，米香沒有立刻吠。牠聞了聞對方的鞋子，退後一步，又再走近。那一刻我們知道，米香不是變成另一隻狗，而是終於不用一直那麼害怕。",
      "米香的行為訓練、營養補充與照護支出共 NT$ 18,600。行為復健沒有捷徑，但每一筆支持都能讓牠多一次練習安全感的機會。"
    ]
  },
  {
    id: "story-07",
    date: "2026-03-25",
    tag: "善終陪伴",
    title: "阿公走的那天，身邊有人叫牠的名字",
    summary: "阿公沒有晶片，也沒有人來接牠，但牠離開時不是無名無姓，志工握著牠的腳說：你不是一隻狗走。",
    image: "assets/stories/story-07.png",
    photos: ["assets/stories/story-07.png", "assets/stories/story-07-02.png", "assets/stories/story-07-03.png"],
    amount: 12800,
    body: [
      "阿公是一隻很老的狗，被發現時已經站不太起來。牠沒有晶片，身上也沒有能找到家的線索。我們不知道牠年輕時叫什麼，只因為牠的眼神很像一位溫柔的老人，大家叫牠阿公。",
      "獸醫說阿公的身體已經撐到最後。那天我們沒有再讓牠奔波，只鋪了乾淨的墊子，讓牠聞到熟悉的罐頭味，也讓志工輪流陪在旁邊。",
      "阿公離開時，志工握著牠的腳，一遍一遍叫牠的名字。生命最後不一定要有奇蹟，但至少可以有尊嚴、有溫度、有一個人記得牠曾經來過。",
      "阿公的善終支出包含安置、醫療評估、善終處理與紀念紀錄，共 NT$ 12,800。這個基金不提供外部接案，只守住園區與合作救援個案最後一段路。"
    ]
  },
  {
    id: "story-08",
    date: "2026-03-18",
    tag: "透明支出",
    title: "一張發票背後，是一整排乾淨的睡墊",
    summary: "支出透明不是冷冰冰的表格，而是讓大家知道飼料、藥品、清潔與睡墊真的變成犬舍每天的安穩。",
    image: "assets/stories/story-08.png",
    photos: ["assets/stories/story-08.png", "assets/stories/story-08-02.png", "assets/stories/story-08-03.png"],
    amount: 31200,
    body: [
      "有些捐款者會問：我捐的錢，最後去了哪裡？這是一個很重要的問題，也是一個公益網站必須認真回答的問題。",
      "這個月有一筆看起來很普通的支出：清潔用品、睡墊、消毒水、洗衣耗材。它不像手術故事那麼驚心動魄，但隔天早上，犬舍裡一整排孩子都睡在乾淨的墊子上，皮膚病復發的機率也少了一點。",
      "我們希望支出透明不只是報表，而是一條信任的路。你看到的每一張收據、每一個分類、每一筆金額，都應該能連回牠們生活裡真實變好的地方。",
      "本筆照護與清潔支出共 NT$ 31,200，明細已公開在支出透明頁。謝謝每一位願意把信任交給我們，也願意要求我們把事情說清楚的人。"
    ]
  },
  {
    id: "story-09",
    date: "2026-03-06",
    tag: "認養準備",
    title: "豆花在門口練習說再見",
    summary: "豆花快要去新家了，志工每天陪牠練習牽繩、坐車與獨處，讓牠的幸福不是碰運氣。",
    image: "assets/stories/story-09.png",
    photos: ["assets/stories/story-09.png", "assets/stories/story-09-02.png", "assets/stories/story-09-03.png"],
    amount: 16400,
    body: [
      "豆花是那種會讓人捨不得送走的狗。牠會把頭靠在人的膝蓋上，聽見名字就小跑步過來。但真正好的認養，不是被喜歡就好，而是要讓牠準備好進入另一個家庭。",
      "牠一開始很怕坐車，也不懂得等待。志工每天花一點時間陪牠練習，從上車吃一口零食，到短短五分鐘車程，再到可以安靜躺在後座。",
      "送養前一天，豆花坐在犬舍門口看著夕陽。志工說：你要去更大的家了。牠當然聽不懂全部，但牠知道眼前的人很溫柔，而這份溫柔會跟著牠走進新生活。",
      "豆花的送養前健檢、疫苗、牽繩訓練與交通支出共 NT$ 16,400。每一筆準備，都是為了讓認養不是衝動，而是一段能走很久的關係。"
    ]
  },
  {
    id: "story-10",
    date: "2026-02-21",
    tag: "物資支持",
    title: "那天晚上，倉庫沒有空下來",
    summary: "寒流來的前一天，飼料和毛毯剛好送到。志工說，最好的幸運，是有人在牠們冷之前先想到牠們。",
    image: "assets/stories/story-10.png",
    photos: ["assets/stories/story-10.png", "assets/stories/story-10-02.png", "assets/stories/story-10-03.png"],
    amount: 58400,
    body: [
      "寒流預報出來時，志工第一個反應不是自己要穿多厚，而是倉庫裡的飼料和毛毯還夠不夠。犬舍最怕的不是忙，是孩子們需要時我們剛好沒有。",
      "那天傍晚，物資車抵達。大家把一包包飼料搬進倉庫，毛毯堆成小山。有幾隻狗在門邊探頭，好像也知道今晚會睡得暖一點。",
      "公益工作裡有很多不浪漫的部分：搬重物、點數量、記帳、拍憑證、整理庫存。但正是這些看起來很日常的事，讓救援不會只靠熱血，而能穩穩地撐過每一天。",
      "本次飼料、毛毯與保暖物資支出共 NT$ 58,400，已列入支出透明頁。謝謝你在寒流來之前，先替牠們想到了一點溫暖。"
    ]
  }
];

function mergeByKey(target, seed, key) {
  const rows = safeList(target);
  const exists = new Set(rows.map(item => String(item?.[key] || "")));
  seed.forEach(item => {
    const id = String(item?.[key] || "");
    if (!exists.has(id)) {
      rows.push({ ...item });
      exists.add(id);
    }
  });
  return rows;
}

function repairSeedData() {
  if (typeof frontDogs !== "undefined" && db.dogs.length < 20) {
    db.dogs = mergeByKey(db.dogs, frontDogs, "id");
  }
  if (typeof frontProducts !== "undefined" && db.products.length < 12) {
    db.products = mergeByKey(db.products, frontProducts, "id");
  }
  const storyIds = new Set(repairStorySeeds.map(story => story.id));
  if (localStorage.getItem("warmStorySeedVersion") !== "2026-05-23-v1") {
    db.stories = safeList(db.stories).filter(story => !storyIds.has(story.id));
    localStorage.setItem("warmStorySeedVersion", "2026-05-23-v1");
  }
  db.stories = mergeByKey(db.stories, repairStorySeeds, "id")
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  db.accountingRules = safeList(db.accountingRules, [
    { id: "AR-001", keyword: "醫療,急診,手術,住院", subject: "5101 醫療救援支出", project: "急難醫療基金", confidence: "96%", status: "啟用" },
    { id: "AR-002", keyword: "飼料,清潔,耗材,除蚤", subject: "5201 日常照護支出", project: "每月飼料與清潔", confidence: "91%", status: "啟用" },
    { id: "AR-003", keyword: "善終,火化,安置", subject: "5401 善終服務支出", project: "善終服務基金", confidence: "88%", status: "啟用" },
    { id: "AR-004", keyword: "義賣,商品,商城", subject: "4102 義賣收入", project: "義賣商城", confidence: "94%", status: "啟用" }
  ]);
  db.farewellCases = safeList(db.farewellCases).map(item => ({ photos: [], ...item }));
  db.receipts = safeList(db.receipts);
  db.adoptionApplications = safeList(db.adoptionApplications);
  db.serviceContacts = safeList(db.serviceContacts);
  normalizeData();
}

schemas.dogs = {
  label: "犬隻",
  idKey: "id",
  defaults: () => ({ id: `D-${Date.now().toString().slice(-4)}`, name: "", age: "", sex: "", size: "", status: "開放認養", area: "", breed: "", intro: "", photos: [] }),
  fields: [["id", "編號", "text"], ["name", "名字", "text"], ["breed", "犬種", "text"], ["age", "年齡", "text"], ["sex", "性別", "text"], ["size", "體型", "text"], ["status", "狀態", "select", ["開放認養", "醫療觀察", "預約互動", "已認養"]], ["area", "所在地", "text"], ["intro", "犬隻說明", "textarea"], ["photos", "犬隻照片", "images"]]
};
schemas.products = {
  label: "商品",
  idKey: "id",
  defaults: () => ({ id: `P-${Date.now().toString().slice(-4)}`, slug: `product-${Date.now()}`, name: "", category: "", price: 0, stock: 0, status: "上架中", invoiceType: "義賣收據", desc: "", detail: "", photos: [] }),
  fields: [["id", "商品編號", "text"], ["slug", "網址代稱", "text"], ["name", "商品名稱", "text"], ["category", "分類", "text"], ["price", "價格", "number"], ["stock", "庫存", "number"], ["status", "狀態", "select", ["上架中", "補貨中", "售完", "下架"]], ["invoiceType", "發票 / 收據", "select", ["義賣收據", "二聯式發票", "三聯式發票", "捐款收據"]], ["desc", "商品簡短說明", "textarea"], ["detail", "商品詳細說明", "textarea"], ["photos", "商品照片", "images"]]
};
schemas.stories = {
  label: "救援故事",
  idKey: "id",
  defaults: () => ({ id: `story-${Date.now().toString().slice(-4)}`, title: "", date: today, tag: "", summary: "", image: "", photos: [], body: [] }),
  fields: [["id", "故事 ID", "text"], ["title", "標題", "text"], ["date", "日期", "date"], ["tag", "分類", "text"], ["summary", "摘要", "textarea"], ["body", "完整內容", "textarea"], ["image", "封面照片", "image"], ["photos", "故事照片", "images"]]
};
schemas.donations.fields = [["no", "捐款編號", "text"], ["paidAt", "捐款日期", "date"], ["name", "捐款人", "text"], ["amount", "金額", "number"], ["campaign", "專案", "select", repairCampaigns.map(item => item.name)], ["method", "付款方式", "select", ["信用卡", "ATM", "銀行轉帳"]], ["subject", "會計科目", "text"], ["receiptNo", "收據編號", "text"], ["receiptType", "收據方式", "select", ["年度收據", "單次收據", "紙本收據", "不需收據"]], ["status", "狀態", "select", ["待對帳", "已入帳", "收據待寄送", "收據已寄送"]]];
schemas.orders.fields = [["no", "訂單編號", "text"], ["createdAt", "訂單日期", "date"], ["buyer", "購買人", "text"], ["phone", "聯絡電話", "text"], ["item", "品項", "textarea"], ["total", "金額", "number"], ["payment", "付款方式", "select", ["貨到付款", "ATM", "信用卡", "銀行轉帳"]], ["invoiceType", "發票類型", "select", ["免用統一發票", "二聯式發票", "三聯式發票", "捐款收據"]], ["invoiceStatus", "發票狀態", "select", ["未開立", "已開立", "作廢"]], ["status", "出貨狀態", "select", ["待出貨", "已出貨", "已完成", "取消"]]];
schemas.receipts = {
  label: "捐款收據",
  idKey: "no",
  defaults: () => ({ no: `R${Date.now()}`, donation: "", title: "", type: "年度收據", delivery: "Email", status: "待寄送" }),
  fields: [["no", "收據編號", "text"], ["donation", "捐款編號", "text"], ["title", "收據抬頭", "text"], ["type", "收據方式", "select", ["年度收據", "單次收據", "紙本收據", "不需收據"]], ["delivery", "寄送方式", "select", ["Email", "紙本郵寄", "現場領取", "不寄送"]], ["status", "狀態", "select", ["待開立", "待寄送", "已寄送", "作廢"]]]
};
schemas.accountingRules = {
  label: "會計分類規則",
  idKey: "id",
  defaults: () => ({ id: `AR-${Date.now().toString().slice(-4)}`, keyword: "", subject: "", project: "", confidence: "90%", status: "啟用" }),
  fields: [["id", "規則編號", "text"], ["keyword", "關鍵字", "textarea"], ["subject", "會計科目", "text"], ["project", "對應專案", "text"], ["confidence", "信心值", "text"], ["status", "狀態", "select", ["啟用", "停用"]]]
};
schemas.farewellCases = {
  label: "善終服務案件",
  idKey: "no",
  defaults: () => ({ no: `FW${Date.now()}`, date: today, location: "", type: "", service: "", cost: 0, status: "待處理", photos: [] }),
  fields: [["no", "案件編號", "text"], ["date", "日期", "date"], ["location", "地點", "text"], ["type", "類型", "text"], ["service", "處理內容", "textarea"], ["cost", "支出金額", "number"], ["status", "狀態", "select", ["待處理", "處理中", "已完成"]], ["photos", "案件照片", "images"]]
};
schemas.adoptionApplications = {
  label: "認養申請",
  idKey: "no",
  defaults: () => ({ no: `AD${Date.now()}`, appliedAt: today, dogId: "", dogName: "", applicant: "", phone: "", email: "", lineId: "", city: "", homeType: "", family: "", petExperience: "", schedule: "", reason: "", status: "待審核" }),
  fields: [["no", "申請編號", "text"], ["appliedAt", "申請日期", "date"], ["dogId", "犬隻編號", "text"], ["dogName", "想認養犬隻", "text"], ["applicant", "申請人", "text"], ["phone", "手機", "text"], ["email", "Email", "text"], ["lineId", "LINE ID", "text"], ["city", "居住地區", "text"], ["homeType", "居住環境", "text"], ["family", "家庭成員與同住動物", "textarea"], ["petExperience", "飼養經驗", "textarea"], ["schedule", "每日陪伴時間", "text"], ["reason", "想認養的原因", "textarea"], ["status", "狀態", "select", ["待審核", "已聯絡", "安排互動", "通過", "未通過"]]]
};
schemas.serviceContacts = {
  label: "志工與聯絡",
  idKey: "no",
  defaults: () => ({ no: `VC${Date.now()}`, createdAt: today, name: "", phone: "", email: "", lineId: "", area: "", time: "", type: "犬隻照護", note: "", status: "待回覆" }),
  fields: [["no", "聯絡編號", "text"], ["createdAt", "日期", "date"], ["name", "姓名", "text"], ["phone", "手機", "text"], ["email", "Email", "text"], ["lineId", "LINE ID", "text"], ["area", "居住地區", "text"], ["time", "可協助時段", "text"], ["type", "參與項目", "select", ["犬隻照護", "接送與物資搬運", "救援故事整理", "義賣包貨", "會計資料整理", "其他"]], ["note", "備註", "textarea"], ["status", "狀態", "select", ["待回覆", "已聯絡", "已排班", "暫緩"]]]
};

Object.assign(adminLabels, {
  serviceOverview: "服務總覽",
  adoptionApplications: "認養申請",
  serviceContacts: "志工與聯絡"
});
Object.assign(adminLabels, { members: "會員管理" });
if (!navGroups.some(([, keys]) => keys.includes("adoptionApplications"))) {
  navGroups.splice(3, 0, ["服務類", ["serviceOverview", "adoptionApplications", "serviceContacts", "farewell"]]);
  const oldServiceGroup = navGroups.find(([, keys]) => keys.includes("dogs") && keys.includes("farewell"));
  if (oldServiceGroup) oldServiceGroup[1] = oldServiceGroup[1].filter(key => key !== "farewell");
}
if (!navGroups.some(([, keys]) => keys.includes("members"))) {
  const settingsIndex = navGroups.findIndex(([, keys]) => keys.includes("settings"));
  navGroups.splice(settingsIndex >= 0 ? settingsIndex : navGroups.length, 0, ["敏感資料", ["members"]]);
}

appliedFilters.orders = appliedFilters.orders || emptyFilters();
draftFilters.orders = draftFilters.orders || { ...appliedFilters.orders };
appliedFilters.adoptionApplications = appliedFilters.adoptionApplications || emptyFilters();
draftFilters.adoptionApplications = draftFilters.adoptionApplications || { ...appliedFilters.adoptionApplications };
appliedFilters.serviceContacts = appliedFilters.serviceContacts || emptyFilters();
draftFilters.serviceContacts = draftFilters.serviceContacts || { ...appliedFilters.serviceContacts };

function frontShell(title, intro, body, eyebrow = "Stray Dog Shelter Charity", options = {}) {
  const cartCount = frontCart.reduce((total, item) => total + item.qty, 0);
  const action = options.cart ? `<a class="button secondary" href="#cart">購物車 ${cartCount}</a>` : (options.action || "");
  return `<section class="section"><div class="section-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${intro}</p></div>${action}</div>${body}</section>`;
}

function rescuePreviewSection(limit = 3) {
  const stories = publicStories().slice(0, limit);
  return `<section class="section alt"><div class="section-header"><div><p class="eyebrow">Rescue Stories</p><h2>救援故事</h2><p>往下滑就能看到最新救援、醫療與安置紀錄。</p></div><a class="button secondary" href="#stories">看全部 ${publicStories().length} 篇</a></div><div class="grid cols-3">${stories.map(story => `<article class="card story-card"><a href="#${story.id}"><img class="story-photo" src="${esc(story.image || story.photos?.[0] || "")}" alt="${esc(story.title)}"></a><div class="card-body"><div class="between"><span class="tag">${esc(story.tag)}</span><small>${esc(story.date)}</small></div><h3><a href="#${story.id}">${esc(story.title)}</a></h3><p>${esc(story.summary)}</p><a class="button secondary" href="#${story.id}">閱讀故事</a></div></article>`).join("")}</div></section>`;
}

function frontHome() {
  const spent = sum(db.expenses);
  const paths = [
    ["看見牠的故事", "先從真實救援紀錄了解每一筆支持帶來的改變。", "#stories", "救援故事"],
    ["確認錢的去向", "逐筆查看日期、用途、金額與憑證狀態。", "#transparency", "支出證明"],
    ["給牠一個家", "瀏覽等待認養的犬隻，再填寫完整申請資料。", "#dogs", "認養犬隻"],
    ["用義賣支持", "購買公益商品，讓日常消費也能變成照護資源。", "#shop", "義賣商城"]
  ];
  return `<section class="hero"><div class="hero-inner"><p class="eyebrow">Stray Dog Shelter Charity</p><h1>讓每一筆善款，都看得到牠被照顧的去向</h1><p>這裡整合救援故事、認養犬隻、捐款收據、義賣商城與支出證明，讓支持者可以一路追蹤善款如何被使用。</p><div class="hero-actions"><a class="button" href="#donate">我要捐款</a><a class="button secondary" href="#stories">看救援故事</a></div></div></section><section class="section"><div class="metric-grid"><div class="metric"><strong>${publicStories().length}</strong><span>救援故事</span></div><div class="metric"><strong>${publicDogs().length}</strong><span>認養犬隻</span></div><div class="metric"><strong>${publicProducts().length}</strong><span>義賣商品</span></div><div class="metric"><strong>${money(spent)}</strong><span>公開支出</span></div></div><div class="home-path-grid">${paths.map(([title, text, href, cta]) => `<article class="panel home-path-card"><span class="tag">${cta}</span><h3>${title}</h3><p>${text}</p><a class="button secondary" href="${href}">${cta}</a></article>`).join("")}</div></section>${rescuePreviewSection(3)}`;
}

function frontStoriesPage() {
  return frontShell("救援故事", `目前公開 ${publicStories().length} 篇救援紀錄，包含內容、照片與支出脈絡。`, `<div class="grid cols-3">${publicStories().map(story => `<article class="card story-card"><a href="#${story.id}"><img class="story-photo" src="${esc(story.image || story.photos?.[0] || "")}" alt="${esc(story.title)}"></a><div class="card-body"><div class="between"><span class="tag">${esc(story.tag)}</span><small>${esc(story.date)}</small></div><h3><a href="#${story.id}">${esc(story.title)}</a></h3><p>${esc(story.summary)}</p><div class="actions"><a class="button secondary" href="#${story.id}">進入故事</a><a class="button secondary" href="#donate">支持專案</a></div></div></article>`).join("")}</div>`, "Rescue Stories");
}

function frontDonatePage(preselected = "") {
  const selected = preselected || repairCampaigns[0].name;
  return frontShell("捐款系統", "選擇專案、金額、捐款方式、收據方式與是否匿名；送出後會同步建立後台捐款與收據資料。", `<div class="donation-checkout"><div class="checkout-main"><form class="checkout-form panel donation-form" id="frontDonationForm"><fieldset><legend>選擇支持專案</legend><div class="campaign-options">${repairCampaigns.map(item => `<label class="${item.name === selected ? "selected" : ""}"><input type="radio" name="frontDonationCampaign" value="${esc(item.name)}" ${item.name === selected ? "checked" : ""}><strong>${esc(item.name)}</strong><span>${esc(item.note)}</span><small>已募 ${money(item.raised)} / 目標 ${money(item.goal)}</small></label>`).join("")}</div></fieldset><fieldset><legend>捐款金額</legend><div class="amount-options">${[500, 1000, 2000, 3600].map(amount => `<button type="button" data-donation-amount="${amount}">${frontMoney(amount)}</button>`).join("")}</div><div class="field" style="margin-top:12px"><label>自訂金額</label><input id="frontDonationAmount" type="number" min="100" value="1000" required></div></fieldset><fieldset><legend>捐款人資料</legend><div class="form-grid"><div class="field"><label>捐款人姓名</label><input id="frontDonorName" required></div><div class="field"><label>Email</label><input id="frontDonorEmail" type="email"></div><div class="field"><label>手機</label><input id="frontDonorPhone"></div><div class="field"><label>收據抬頭</label><input id="frontReceiptTitle"></div></div><label class="check-line"><input type="checkbox" id="frontAnonymousDonation"> 匿名捐款，前台公開紀錄不顯示姓名</label></fieldset><fieldset><legend>週期、收據與付款</legend><div class="receipt-options"><label><input type="radio" name="frontDonationFrequency" value="單次捐款" checked> 單次捐款</label><label><input type="radio" name="frontDonationFrequency" value="定期定額"> 定期定額</label></div><div class="form-grid recurring-period-row"><div class="field"><label>定期定額付款週期</label><select id="frontRecurringPeriod"><option value="每月">每月扣款</option><option value="每季">每季扣款</option><option value="每年">每年扣款</option></select></div><p class="field-note">選擇定期定額時，系統會一併記錄扣款週期。</p></div><div class="receipt-options"><label><input type="radio" name="frontReceiptType" value="年度收據" checked> 年度收據</label><label><input type="radio" name="frontReceiptType" value="單次收據"> 單次收據</label><label><input type="radio" name="frontReceiptType" value="紙本收據"> 紙本收據</label><label><input type="radio" name="frontReceiptType" value="不需收據"> 不需收據</label></div><div class="form-grid"><div class="field"><label>付款方式</label><select id="frontDonationMethod"><option>信用卡</option><option>ATM</option><option>銀行轉帳</option></select></div><div class="field"><label>備註</label><input id="frontDonationNote" placeholder="指定用途或想留下的話"></div></div></fieldset><div class="checkout-actions"><button class="button" type="submit">確認送出捐款</button><a class="button secondary" href="#receipt-lookup">查詢收據</a></div><div class="donation-result" id="frontDonationResult" hidden></div></form></div><aside class="panel checkout-summary"><span class="tag">Donation Summary</span><h2>捐款摘要</h2><div class="money-ledger"><div><span>預設專案</span><strong id="donationSummaryCampaign">${esc(selected)}</strong></div><div><span>目前金額</span><strong id="donationSummaryAmount">NT$ 1,000</strong></div><div><span>收據查詢</span><strong>可用捐款編號查詢</strong></div></div><p class="muted-note">定期定額先建立申請紀錄，正式扣款仍需要後續金流串接。</p></aside></div>`, "Donation");
}

function frontFarewell() {
  const steps = [
    { no: "01", icon: "核", title: "個案確認", text: "確認是否屬於園區或合作救援個案，保留時間、地點與狀態紀錄。", note: "不對外接案", image: "assets/service-flow/report-confirmation.svg" },
    { no: "02", icon: "護", title: "照護與安置", text: "安排安置、包覆與必要運送，讓最後一段路維持乾淨與尊重。", note: "照片建檔", image: "assets/service-flow/pickup-care.svg" },
    { no: "03", icon: "帳", title: "費用公開", text: "每筆善終支出會記錄供應商、金額、憑證狀態與對應基金。", note: "同步透明頁", image: "assets/service-flow/public-ledger.svg" },
    { no: "04", icon: "善", title: "捐款支持", text: "支持者點擊後會直接帶到善終服務基金，避免捐款用途混淆。", note: "指定基金", image: "assets/service-flow/farewell-care.svg" }
  ];
  return `<section class="section split"><div><p class="eyebrow">Farewell Care</p><h1>善終服務基金</h1><p>本頁只說明園區與合作救援個案的善終支出，不提供對外通報或聯絡接案服務。</p><div class="hero-actions"><a class="button" href="#donate-farewell">支持善終服務基金</a></div></div><article class="panel"><span class="tag">透明支出</span><h2>善終支出會公開列帳</h2><p>每筆費用會在後台善終案件建檔，並同步到支出透明資料供捐款者查閱。</p><div class="progress"><span style="width:100%"></span></div><div class="between"><span>已募 NT$ 207,500</span><span>目標 NT$ 160,000</span></div></article></section><section class="section alt service-flow-section farewell-flow"><div class="section-header"><div><p class="eyebrow">Internal Flow</p><h2>處理流程</h2><p>這是內部救援與園區個案流程，不是外部通報服務。</p></div><a class="button secondary" href="#transparency">查看支出透明</a></div><div class="service-flow">${steps.map(step => `<article class="service-step farewell-step"><div class="flow-card-head"><span class="step-number">${step.no}</span><span class="flow-note">${step.note}</span></div><div class="service-illustration"><img class="service-illustration-image" src="${step.image}" alt="${step.title}流程插畫"></div><div class="flow-copy"><span class="service-icon">${step.icon}</span><h3>${step.title}</h3><p>${step.text}</p></div></article>`).join("")}</div><div class="flow-support-panel"><div><span class="tag">善終基金</span><h3>支持善終服務基金時，系統會自動選好指定基金</h3><p>這筆基金只用於園區與合作救援個案的最後照護、安置、處理與公開紀錄。</p></div><a class="button" href="#donate-farewell">支持這個基金</a></div></section>`;
}

function frontDogsPage() {
  const perPage = 8;
  const rows = publicDogs();
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  frontDogPage = Math.min(Math.max(frontDogPage, 1), totalPages);
  const dogs = rows.slice((frontDogPage - 1) * perPage, frontDogPage * perPage);
  const officialLinks = [
    ["農業部領養資訊", "https://animal.moa.gov.tw/Frontend/AdoptSearch/AdoptInfo?tab=1"],
    ["全國認領養系統", "https://www.pet.gov.tw/"],
    ["公立收容所列表", "https://animal.moa.gov.tw/Frontend/AnimalShelter"],
    ["寵物登記管理系統", "https://www.pet.gov.tw/"]
  ];
  return frontShell("認養犬隻", `目前共有 ${rows.length} 隻犬隻資料。先看看牠們的照片與個性，按「我要認養」後再填寫申請表。`, `<div class="dog-page-meta"><span>共 ${rows.length} 隻</span><span>第 ${frontDogPage} / ${totalPages} 頁</span></div><div class="grid cols-4">${dogs.map(dog => `<article class="card dog-card"><a class="dog-card-link" href="#dog-${dog.id}"><img class="dog-photo" src="${esc(dog.photos[0])}" alt="${esc(dog.name)}"></a><div class="card-body"><div class="between"><strong>${esc(dog.id)}</strong><span>${esc(dog.area)}</span></div><h3><a href="#dog-${dog.id}">${esc(dog.name)}</a></h3><p>${esc(dog.intro)}</p><div class="meta"><span class="tag">${esc(dog.breed)}</span><span class="tag">${esc(dog.age)}</span><span class="tag">${esc(dog.sex)}</span><span class="tag">${esc(dog.size)}</span><span class="tag">${esc(dog.status)}</span></div><div class="actions"><a class="button secondary" href="#dog-${dog.id}">查看詳細</a><a class="button secondary" href="#adoption-apply-${dog.id}">我要認養</a></div></div></article>`).join("")}</div><div class="pagination"><button class="button secondary" data-front-dog-page="${frontDogPage - 1}" ${frontDogPage === 1 ? "disabled" : ""}>上一頁</button><span>第 ${frontDogPage} / ${totalPages} 頁</span><button class="button secondary" data-front-dog-page="${frontDogPage + 1}" ${frontDogPage === totalPages ? "disabled" : ""}>下一頁</button></div><div class="panel official-links"><h2>認養前可參考的官方資源</h2><p>認養前建議先了解終養責任、晶片登記、絕育與行為教育。</p><div class="resource-link-grid">${officialLinks.map(([label, href]) => `<a class="button secondary" href="${href}" target="_blank" rel="noopener">${label}</a>`).join("")}</div></div>`, "Adoption");
}

function frontAdoptionApply(dogId = "") {
  const rows = publicDogs();
  const dog = rows.find(item => item.id === dogId) || rows[0] || {};
  return frontShell("認養申請表", "請先填寫詳細資料，我們會依犬隻個性、家庭環境與照護能力媒合，不是先搶先贏。", `<div class="adoption-apply-layout"><aside class="panel adoption-dog-summary"><span class="tag">Selected Dog</span><img src="${esc(dog.photos?.[0] || "")}" alt="${esc(dog.name || "")}"><h2>${esc(dog.id || "")} ${esc(dog.name || "")}</h2><p>${esc(dog.intro || "")}</p><div class="meta"><span class="tag">${esc(dog.breed || "")}</span><span class="tag">${esc(dog.age || "")}</span><span class="tag">${esc(dog.status || "")}</span></div><a class="button secondary" href="#dogs">回認養犬隻</a></aside><article class="panel adoption-form-panel"><form id="frontAdoptionForm" class="form-grid"><div class="field full"><label>想認養的犬隻</label><select id="adoptDogSelect">${rows.map(item => `<option value="${esc(item.id)}" ${item.id === dog.id ? "selected" : ""}>${esc(item.id)} ${esc(item.name)}</option>`).join("")}</select></div><div class="field"><label>申請人姓名</label><input id="adoptApplicant" required></div><div class="field"><label>手機</label><input id="adoptPhone" required></div><div class="field"><label>Email</label><input id="adoptEmail" type="email"></div><div class="field"><label>LINE ID</label><input id="adoptLine"></div><div class="field"><label>居住地區</label><input id="adoptCity" placeholder="例如 台中北區" required></div><div class="field"><label>居住環境</label><select id="adoptHomeType"><option>透天</option><option>公寓</option><option>大樓</option><option>租屋</option><option>其他</option></select></div><div class="field full"><label>家庭成員與同住動物</label><textarea id="adoptFamily" required></textarea></div><div class="field full"><label>飼養經驗</label><textarea id="adoptExperience" required></textarea></div><div class="field"><label>每日可陪伴時間</label><input id="adoptSchedule" placeholder="例如 平日晚上、假日全天"></div><div class="field full"><label>為什麼想認養牠</label><textarea id="adoptReason" required></textarea></div><button class="button" type="submit">送出認養申請</button></form><div class="donation-result" id="frontAdoptionResult" hidden></div></article></div>`, "Adoption Application");
}

function frontDogDetail(id) {
  const dog = publicDogs().find(item => item.id === id) || publicDogs()[0];
  if (!dog) return frontDogsPage();
  return `<section class="section"><div class="dog-detail product-detail"><div><img class="product-main" data-gallery-main src="${esc(dog.photos[0])}" alt="${esc(dog.name)}"><div class="product-thumbs">${dog.photos.map((photo, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-gallery-thumb="${esc(photo)}"><img src="${esc(photo)}" alt="${esc(dog.name)}照片 ${index + 1}"></button>`).join("")}</div><article class="product-description"><span class="tag">照護紀錄</span><h2>${esc(dog.name)} 正在等待合適的家</h2><p>${esc(dog.intro)} 認養前我們會先確認家庭環境、照護能力與陪伴時間，讓牠不是被帶走而已，而是真的回家。</p><div class="product-points"><span>${esc(dog.breed)}</span><span>${esc(dog.age)}</span><span>${esc(dog.size)}</span><span>${esc(dog.status)}</span></div></article></div><div class="panel product-info"><a class="tag" href="#dogs">回認養犬隻</a><h1>${esc(dog.name)}</h1><p>${esc(dog.intro)}</p><div class="money-ledger"><div><span>編號</span><strong>${esc(dog.id)}</strong></div><div><span>地區</span><strong>${esc(dog.area)}</strong></div><div><span>犬種</span><strong>${esc(dog.breed)}</strong></div><div><span>年齡</span><strong>${esc(dog.age)}</strong></div><div><span>性別</span><strong>${esc(dog.sex)}</strong></div><div><span>體型</span><strong>${esc(dog.size)}</strong></div><div><span>狀態</span><strong>${esc(dog.status)}</strong></div></div><div class="actions"><a class="button" href="#adoption-apply-${esc(dog.id)}">我要認養 ${esc(dog.name)}</a><a class="button secondary" href="#dogs">看其他犬隻</a></div></div></div></section>`;
}

function frontShop() {
  return frontShell("義賣商城", `目前共有 ${publicProducts().length} 項義賣商品，購物車與免運門檻會在結帳頁顯示。`, `<div class="grid cols-3">${publicProducts().map(product => `<article class="card"><a href="#product-${product.slug}"><img class="product-photo" src="${esc(product.photos[0])}" alt="${esc(product.name)}"></a><div class="card-body"><span class="tag">${esc(product.category)}</span><h3><a href="#product-${product.slug}">${esc(product.name)}</a></h3><p>${esc(product.desc)}</p><strong>${frontMoney(product.price)}</strong><div class="actions"><a class="button secondary" href="#product-${product.slug}">查看說明</a><button class="button" type="button" data-add-cart="${esc(product.slug)}">加入購物車</button></div></div></article>`).join("")}</div>`, "Charity Shop", { cart: true });
}

function frontCartPage() {
  const lines = frontCart.map(item => ({ ...item, product: publicProducts().find(product => product.slug === item.slug) })).filter(item => item.product);
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const threshold = Number(db.shopSettings.freeShippingThreshold || 0);
  const shipping = subtotal >= threshold || subtotal === 0 ? 0 : Number(db.shopSettings.shippingFee || 0);
  const freeShippingText = subtotal === 0 ? `滿 ${frontMoney(threshold)} 免運` : subtotal >= threshold ? "已達免運門檻" : `再買 ${frontMoney(threshold - subtotal)} 即可免運`;
  return frontShell("購物車", "確認義賣商品與數量後，可送出訂購需求。", lines.length ? `<div class="cart-layout"><div class="panel"><div class="table-wrap"><table><thead><tr><th>商品</th><th>數量</th><th>小計</th><th>操作</th></tr></thead><tbody>${lines.map(item => `<tr><td>${esc(item.product.name)}</td><td><button class="button secondary" data-cart-qty="${esc(item.slug)}" data-delta="-1">-</button> ${item.qty} <button class="button secondary" data-cart-qty="${esc(item.slug)}" data-delta="1">+</button></td><td>${frontMoney(item.product.price * item.qty)}</td><td><button class="button secondary danger" data-cart-remove="${esc(item.slug)}">移除</button></td></tr>`).join("")}</tbody></table></div></div><aside class="panel product-info"><h2>訂單摘要</h2><p class="free-shipping-note">${freeShippingText}</p><div class="money-ledger"><div><span>商品小計</span><strong>${frontMoney(subtotal)}</strong></div><div><span>運費</span><strong>${shipping ? frontMoney(shipping) : "免運"}</strong></div><div><span>合計</span><strong>${frontMoney(subtotal + shipping)}</strong></div></div><form id="frontOrderForm" class="form-grid"><div class="field full"><label>姓名</label><input id="frontOrderName" required></div><div class="field full"><label>聯絡電話</label><input id="frontOrderPhone" required></div><div class="field full"><label>Email</label><input id="frontOrderEmail" type="email"></div><div class="field full"><label>收件地址</label><input id="frontOrderAddress" required></div><div class="field full"><label>付款方式</label><select id="frontOrderPayment"><option>銀行轉帳</option><option>貨到付款</option><option>信用卡</option></select></div><button class="button" type="submit">送出訂購需求</button></form><div class="donation-result" id="frontOrderResult" hidden></div></aside></div>` : `<div class="empty-state">購物車目前沒有商品。<br><br><p>${freeShippingText}</p><a class="button" href="#shop">回義賣商城</a></div>`, "Cart", { cart: true });
}

function frontVolunteer() {
  return frontShell("志工與聯繫", "請留下完整聯絡方式與可協助項目，後續由志工窗口統一回覆。", `<div class="split"><article class="panel"><h2>聯繫表單</h2><form id="frontVolunteerForm" class="form-grid"><div class="field"><label>姓名</label><input id="volunteerName" placeholder="請輸入姓名" required></div><div class="field"><label>手機</label><input id="volunteerPhone" placeholder="0912-345-678" required></div><div class="field"><label>Email</label><input id="volunteerEmail" type="email" placeholder="name@example.com"></div><div class="field"><label>LINE ID</label><input id="volunteerLine" placeholder="@straydog-home"></div><div class="field"><label>居住地區</label><input id="volunteerArea" placeholder="例如 台中北區"></div><div class="field"><label>可協助時段</label><input id="volunteerTime" placeholder="平日晚上 / 假日白天"></div><div class="field full"><label>想參與的項目</label><select id="volunteerType"><option>犬隻照護</option><option>接送與物資搬運</option><option>救援故事整理</option><option>義賣包貨</option><option>會計資料整理</option><option>其他</option></select></div><div class="field full"><label>備註</label><textarea id="volunteerNote" placeholder="可補充經驗、交通方式或其他聯絡偏好"></textarea></div><button class="button" type="submit">送出聯繫資料</button></form><div class="donation-result" id="frontVolunteerResult" hidden></div></article><article class="panel"><h2>聯絡方式</h2><p>LINE ID：straydog-home</p><p>電話：04-0000-0000</p><p>Email：service@example.org</p><p>服務時間：週一至週六 10:00-18:00</p><p>地址：台中市公益路救援犬舍</p></article></div>`, "Contact");
}

function frontTransparency() {
  const expenses = safeList(db.expenses).slice(0, 80);
  const donations = sum(db.donations);
  const spent = sum(db.expenses);
  const projects = [...new Set(expenses.map(item => item.project).filter(Boolean))].slice(0, 8);
  const max = Math.max(1, ...projects.map(project => sum(expenses.filter(item => item.project === project))));
  const balance = donations - spent;
  const proven = expenses.filter(item => String(item.proof || "").includes("已") || String(item.proof || "").includes("證")).length;
  const proofRate = expenses.length ? Math.round((proven / expenses.length) * 100) : 0;
  const recent = expenses.slice(0, 6);
  return `<section class="proof-hero"><div class="proof-hero-copy"><p class="eyebrow">Expense Proof</p><h1>捐款者的每一分錢，都清清楚楚花在有意義的地方</h1><p>我們把醫療、照護、善終與日常支出的日期、用途、廠商、金額與憑證狀態公開，讓每一份信任都能被查得到、看得懂、追得回。</p><div class="hero-actions"><a class="button" href="#donate">支持照護工作</a><a class="button secondary" href="#stories">看救援故事</a></div></div><aside class="proof-hero-card"><span class="tag">本月公開</span><strong>${money(spent)}</strong><p>已建立 ${db.expenses.length} 筆支出紀錄，憑證完成率 ${proofRate}%</p><div class="proof-checks"><span>日期公開</span><span>用途公開</span><span>金額公開</span><span>憑證追蹤</span></div></aside></section><section class="section proof-section"><div class="proof-metrics">${[["累計捐款", money(donations), "支持者投入的每一筆善意"], ["公開支出", money(spent), "醫療、照護、善終與犬舍維運"], ["目前結餘", money(balance), "保留給後續急難與長期照護"], ["公開筆數", db.expenses.length, "可依日期與專案逐筆查閱"]].map(([label, value, note]) => `<article class="proof-metric"><span>${label}</span><strong>${value}</strong><p>${note}</p></article>`).join("")}</div><div class="proof-layout"><article class="panel proof-panel"><div class="panel-title"><h2>支出分類統計</h2><p>每個分類都能對回實際支出項目，不只是一個總金額。</p></div><div class="mini-bars proof-bars">${projects.map(project => { const amount = sum(expenses.filter(item => item.project === project)); return `<div><span>${esc(project)}</span><b>${money(amount)}</b><i style="width:${Math.max(8, Math.round(amount / max * 100))}%"></i></div>`; }).join("")}</div></article><article class="panel proof-panel"><div class="panel-title"><h2>支出證明原則</h2><p>公開不是做樣子，是讓捐款者能放心確認錢真的用在犬隻身上。</p></div><div class="proof-principles"><div><strong>1. 用途可讀</strong><span>支出項目用白話呈現，避免只有會計代碼。</span></div><div><strong>2. 金額可查</strong><span>金額、廠商與日期逐筆留下紀錄。</span></div><div><strong>3. 憑證可追</strong><span>未補件、已附憑證、待審核都清楚標示。</span></div></div></article></div><div class="panel proof-recent"><div class="panel-title"><h2>最近支出證明</h2><p>先看最近幾筆錢用在哪裡，再往下查完整明細。</p></div><div class="proof-recent-grid">${recent.map(item => `<article><span class="tag">${esc(item.project)}</span><h3>${esc(item.item)}</h3><p>${esc(item.vendor)} / ${esc(item.date)}</p><strong>${money(item.amount)}</strong><div>${badge(item.proof)} ${badge(item.publish)}</div></article>`).join("")}</div></div><div class="panel proof-table-panel"><div class="panel-title"><h2>完整支出明細</h2><p>包含日期、專案、項目、廠商、金額、憑證與公開狀態。</p></div>${table(["日期", "專案", "項目", "廠商", "金額", "憑證", "公開狀態"], expenses.map(item => [item.date, item.project, item.item, item.vendor, money(item.amount), badge(item.proof), badge(item.publish)]))}</div></section>`;
}

function accountingPanel() {
  return crudList("會計分類", "新增規則", "accountingRules", ["規則編號", "關鍵字", "會計科目", "對應專案", "信心值", "狀態"], db.accountingRules.map(item => [item.id, item.keyword, item.subject, item.project, item.confidence, badge(item.status)]), item => item.id);
}

function farewellPanel() {
  return crudList("善終服務", "新增案件", "farewellCases", ["案件編號", "日期", "地點", "類型", "處理內容", "支出", "狀態"], db.farewellCases.map(item => [item.no, item.date, item.location, item.type, item.service, money(item.cost), badge(item.status)]), item => item.no);
}

function receiptConfig() {
  return { title: "捐款收據", description: "可查看與編輯收據狀態，待寄送可改為已寄送。", date: receiptDate, status: row => row.status, search: row => [row.no, row.donation, row.title, row.type, row.delivery, row.status], headers: ["捐款日期", "收據編號", "捐款編號", "抬頭", "方式", "寄送", "狀態"], row: r => [receiptDate(r), r.no, r.donation, r.title, r.type, r.delivery, badge(r.status, r.status !== "已寄送" ? "warn" : "")], collection: "receipts", addText: "新增收據", placeholder: "收據編號、捐款編號、姓名或狀態" };
}

function invoiceConfig() {
  return { title: "發票管理", description: "發票以訂單資料管理；進入編輯即可將未開立改為已開立，並和出貨狀態分開管理。", date: row => row.createdAt, status: row => row.invoiceStatus, search: row => [row.no, row.buyer, row.item, row.invoiceType, row.invoiceStatus, row.status], headers: ["訂單日期", "訂單", "購買人", "金額", "發票類型", "發票狀態", "出貨狀態"], row: o => [o.createdAt, o.no, o.buyer, money(o.total), o.invoiceType, badge(o.invoiceStatus, o.invoiceStatus === "未開立" ? "warn" : ""), badge(o.status)], collection: "orders", addText: "新增訂單", placeholder: "訂單、購買人、品項或發票狀態" };
}

function orderConfig() {
  return { title: "訂單管理", description: "出貨狀態與發票狀態分開：待出貨/已出貨/已完成是物流流程，發票未開立/已開立是會計流程。", date: row => row.createdAt, status: row => row.status, search: row => [row.no, row.buyer, row.item, row.payment, row.invoiceStatus, row.status], headers: ["訂單日期", "訂單", "購買人", "品項", "金額", "付款", "發票", "出貨"], row: o => [o.createdAt, o.no, o.buyer, o.item, money(o.total), o.payment, badge(o.invoiceStatus, o.invoiceStatus === "未開立" ? "warn" : ""), badge(o.status, o.status === "待出貨" ? "warn" : "")], collection: "orders", addText: "新增訂單", placeholder: "訂單、購買人、品項、出貨狀態" };
}

function adoptionApplicationConfig() {
  return { title: "認養申請", description: "服務類資料表：統計前台認養申請，並追蹤待審核、已聯絡、安排互動與通過狀態。", date: row => row.appliedAt, status: row => row.status, search: row => [row.no, row.dogId, row.dogName, row.applicant, row.phone, row.email, row.lineId, row.city, row.status], headers: ["日期", "申請編號", "犬隻", "申請人", "手機", "LINE", "地區", "狀態"], row: item => [item.appliedAt, item.no, `${item.dogId} ${item.dogName}`, item.applicant, item.phone, item.lineId, item.city, badge(item.status, item.status === "待審核" ? "warn" : "")], collection: "adoptionApplications", addText: "新增認養申請", placeholder: "申請人、犬隻、電話、LINE、狀態" };
}

function serviceContactConfig() {
  return { title: "志工與聯絡", description: "服務類資料表：統計志工、合作、聯絡需求，方便後續回覆與排班。", date: row => row.createdAt, status: row => row.status, search: row => [row.no, row.name, row.phone, row.email, row.lineId, row.area, row.type, row.status], headers: ["日期", "聯絡編號", "姓名", "手機", "LINE", "地區", "項目", "狀態"], row: item => [item.createdAt, item.no, item.name, item.phone, item.lineId, item.area, item.type, badge(item.status, item.status === "待回覆" ? "warn" : "")], collection: "serviceContacts", addText: "新增聯絡資料", placeholder: "姓名、電話、LINE、項目、狀態" };
}

function serviceOverviewPanel() {
  const adoption = safeList(db.adoptionApplications);
  const contacts = safeList(db.serviceContacts);
  const farewell = safeList(db.farewellCases);
  const adoptionPending = adoption.filter(item => item.status === "待審核").length;
  const contactPending = contacts.filter(item => item.status === "待回覆").length;
  const byDog = [...new Set(adoption.map(item => item.dogName || item.dogId).filter(Boolean))].slice(0, 6);
  return `<div class="admin-top"><div><h1>服務總覽</h1><p>認養申請、志工聯絡與善終服務都歸在服務類，方便追蹤每一筆待處理需求。</p></div></div>${metricGrid([["認養申請", adoption.length], ["待審核認養", adoptionPending], ["志工聯絡", contacts.length], ["待回覆聯絡", contactPending], ["善終案件", farewell.length]])}<div class="report-grid"><div class="panel"><h2>認養申請熱門犬隻</h2><div class="mini-bars">${byDog.length ? byDog.map(name => { const count = adoption.filter(item => (item.dogName || item.dogId) === name).length; return `<div><span>${esc(name)}</span><b>${count} 件</b><i style="width:${Math.max(14, count * 18)}%"></i></div>`; }).join("") : `<p class="muted-note">尚無認養申請。</p>`}</div></div><div class="panel"><h2>服務待辦</h2>${table(["類型", "待處理", "下一步"], [["認養申請", adoptionPending, "審核資料並安排互動"], ["志工與聯絡", contactPending, "回覆 LINE / 電話並分類"], ["善終服務", farewell.filter(item => item.status !== "已完成").length, "補照片、費用與憑證"]])}</div></div>`;
}

function table(headers, rows, collection = "", ids = []) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}<th>操作</th></tr></thead><tbody>${rows.length ? rows.map((row, index) => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}<td>${collection ? `<div class="table-actions"><button class="button secondary" data-admin-edit="${collection}" data-admin-id="${esc(ids[index])}">查看/編輯</button><button class="button secondary danger" data-admin-delete="${collection}" data-admin-id="${esc(ids[index])}">刪除</button></div>` : `<span class="muted-note">-</span>`}</td></tr>`).join("") : `<tr><td class="empty" colspan="${headers.length + 1}">沒有符合條件的資料</td></tr>`}</tbody></table></div>`;
}

function saveLocalData() {
  localStorage.setItem(storeKey, JSON.stringify({
    adminAuth: db.adminAuth,
    adminUsers: db.adminUsers,
    shopSettings: db.shopSettings,
    dogs: db.dogs,
    products: db.products,
    stories: db.stories,
    donations: db.donations,
    expenses: db.expenses,
    receipts: db.receipts,
    orders: db.orders,
    farewellCases: db.farewellCases,
    accountingRules: db.accountingRules,
    adoptionApplications: db.adoptionApplications,
    serviceContacts: db.serviceContacts
  }));
}

function adminView(key) {
  if (!canOpen(key)) return `<div class="admin-top"><div><h1>沒有權限</h1><p>目前帳號不能開啟 ${adminLabels[key] || key}。</p></div></div>`;
  if (key === "dashboard") return dashboard();
  if (key === "reports") return reportsPanel();
  if (key === "analytics") return analyticsPanel();
  if (key === "data") return dataPanel();
  if (key === "donations") return filteredTable("donations", db.donations, donationConfig());
  if (key === "expenses") return filteredTable("expenses", db.expenses, expenseConfig());
  if (key === "accounting") return accountingPanel();
  if (key === "receipts") return filteredTable("receipts", db.receipts, receiptConfig());
  if (key === "serviceOverview") return serviceOverviewPanel();
  if (key === "adoptionApplications") return filteredTable("adoptionApplications", db.adoptionApplications, adoptionApplicationConfig());
  if (key === "serviceContacts") return filteredTable("serviceContacts", db.serviceContacts, serviceContactConfig());
  if (key === "farewell") return farewellPanel();
  if (key === "dogs") return crudList("犬隻管理", "新增犬隻", "dogs", ["編號", "名字", "年齡", "狀態", "地區", "說明"], db.dogs.map(d => [d.id, d.name, d.age, badge(d.status), d.area, d.intro]), d => d.id);
  if (key === "content") return crudList("救援故事管理", "新增故事", "stories", ["故事 ID", "標題", "日期", "分類", "摘要"], db.stories.map(s => [s.id, s.title, s.date, badge(s.tag), s.summary]), s => s.id);
  if (key === "social") return socialPanel();
  if (key === "products") return crudList("商品管理", "新增商品", "products", ["商品編號", "商品", "分類", "價格", "庫存", "說明", "狀態"], db.products.map(p => [p.id, p.name, p.category, money(p.price), p.stock, p.desc, badge(p.status)]), p => p.id);
  if (key === "orders") return filteredTable("orders", db.orders, orderConfig());
  if (key === "invoice") return filteredTable("invoice", db.orders, invoiceConfig());
  if (key === "members") return membersPanel();
  if (key === "settings") return settingsPanel();
  return "";
}

function render() {
  repairSeedData();
  const route = location.hash.replace("#", "") || "home";
  const routes = { home: frontHome, stories: frontStoriesPage, donate: frontDonatePage, "donate-now": frontDonatePage, "donate-farewell": () => frontDonatePage("善終服務基金"), "receipt-lookup": frontReceiptLookup, farewell: frontFarewell, dogs: frontDogsPage, shop: frontShop, cart: frontCartPage, volunteer: frontVolunteer, transparency: frontTransparency, admin };
  if (route.startsWith("dog-")) app.innerHTML = frontDogDetail(route.replace("dog-", ""));
  else if (route.startsWith("adoption-apply-")) app.innerHTML = frontAdoptionApply(route.replace("adoption-apply-", ""));
  else if (route.startsWith("product-")) app.innerHTML = frontProductDetail(route.replace("product-", ""));
  else if (route.startsWith("story-")) app.innerHTML = frontStoryDetail(route);
  else app.innerHTML = (routes[route] || routes.home)();
  document.querySelectorAll(".site-nav a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${route}` || (route.startsWith("story-") && link.getAttribute("href") === "#stories") || (route.startsWith("product-") && link.getAttribute("href") === "#shop")));
  bind();
  bindRepairLayer();
}

function bindRepairLayer() {
  document.querySelectorAll("[data-member-detail]").forEach(button => button.addEventListener("click", () => {
    activeMemberId = button.dataset.memberDetail || "";
    render();
  }));
  document.querySelectorAll("[data-admin]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.admin !== "members") activeMemberId = "";
  }));
  document.querySelector("[data-member-back]")?.addEventListener("click", () => {
    activeMemberId = "";
    render();
  });
  document.querySelector("#frontDonationForm")?.addEventListener("submit", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const amount = Number(document.querySelector("#frontDonationAmount")?.value || 0);
    const campaign = document.querySelector("input[name='frontDonationCampaign']:checked")?.value || repairCampaigns[0].name;
    const receiptType = document.querySelector("input[name='frontReceiptType']:checked")?.value || "年度收據";
    const frequencyType = document.querySelector("input[name='frontDonationFrequency']:checked")?.value || "單次捐款";
    const recurringPeriod = document.querySelector("#frontRecurringPeriod")?.value || "每月";
    const frequency = frequencyType === "定期定額" ? `定期定額（${recurringPeriod}）` : frequencyType;
    const anonymous = document.querySelector("#frontAnonymousDonation")?.checked || false;
    const nameInput = document.querySelector("#frontDonorName")?.value.trim() || "未填姓名";
    const donorName = anonymous ? "匿名捐款人" : nameInput;
    const donorEmail = document.querySelector("#frontDonorEmail")?.value.trim() || "";
    const donorPhone = document.querySelector("#frontDonorPhone")?.value.trim() || "";
    const receiptTitle = document.querySelector("#frontReceiptTitle")?.value.trim() || donorName;
    const donationNote = document.querySelector("#frontDonationNote")?.value.trim() || "";
    const paymentMethod = document.querySelector("#frontDonationMethod")?.value || "信用卡";
    const no = `DN${Date.now()}`;
    const receiptNo = receiptType === "不需收據" ? "不需收據" : `R${Date.now()}`;
    db.donations.unshift({
      no,
      paidAt: today,
      name: donorName,
      email: donorEmail,
      phone: donorPhone,
      amount,
      campaign,
      method: paymentMethod,
      frequency,
      anonymous,
      subject: campaign === "善終服務基金" ? "4103 善終服務基金收入" : "4101 捐款收入",
      receiptNo,
      receiptType,
      receiptTitle,
      note: donationNote,
      status: paymentMethod === "信用卡" ? "已入帳" : "待對帳"
    });
    if (receiptType !== "不需收據") {
      db.receipts.unshift({ no: receiptNo, donation: no, title: receiptTitle, type: receiptType, delivery: receiptType === "紙本收據" ? "紙本郵寄" : "Email", status: "待寄送" });
    }
    saveLocalData();
    const result = document.querySelector("#frontDonationResult");
    result.hidden = false;
    result.innerHTML = `<strong>捐款資料已建立：${no}</strong><p>專案：${esc(campaign)}，金額：${frontMoney(amount)}，週期：${esc(frequency)}，收據：${esc(receiptType)}。</p>`;
  }, { capture: true });
  document.querySelectorAll("input[name='frontDonationCampaign']").forEach(input => input.addEventListener("change", () => {
    document.querySelector("#donationSummaryCampaign").textContent = input.value;
  }));
  document.querySelector("#frontDonationAmount")?.addEventListener("input", event => {
    const target = document.querySelector("#donationSummaryAmount");
    if (target) target.textContent = frontMoney(event.target.value || 0);
  });
  document.querySelectorAll("[data-adopt-dog]").forEach(button => button.addEventListener("click", () => {
    const select = document.querySelector("#adoptDogSelect");
    if (select) {
      select.value = button.dataset.adoptDog;
      document.querySelector(".adoption-aside")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }));
  document.querySelector("#frontAdoptionForm")?.addEventListener("submit", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const dogId = document.querySelector("#adoptDogSelect")?.value || "";
    const dog = publicDogs().find(item => item.id === dogId) || {};
    const no = `AD${Date.now()}`;
    db.adoptionApplications.unshift({
      no,
      appliedAt: today,
      dogId,
      dogName: dog.name || dogId,
      applicant: document.querySelector("#adoptApplicant")?.value.trim() || "",
      phone: document.querySelector("#adoptPhone")?.value.trim() || "",
      email: document.querySelector("#adoptEmail")?.value.trim() || "",
      lineId: document.querySelector("#adoptLine")?.value.trim() || "",
      city: document.querySelector("#adoptCity")?.value.trim() || "",
      homeType: document.querySelector("#adoptHomeType")?.value || "",
      family: document.querySelector("#adoptFamily")?.value.trim() || "",
      petExperience: document.querySelector("#adoptExperience")?.value.trim() || "",
      schedule: document.querySelector("#adoptSchedule")?.value.trim() || "",
      reason: document.querySelector("#adoptReason")?.value.trim() || "",
      status: "待審核"
    });
    saveLocalData();
    const result = document.querySelector("#frontAdoptionResult");
    result.hidden = false;
    result.innerHTML = `<strong>認養申請已送出：${no}</strong><p>我們會先審核資料，再聯絡你安排後續互動與家訪評估。</p>`;
    event.currentTarget.reset();
  }, { capture: true });
  document.querySelector("#frontVolunteerForm")?.addEventListener("submit", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const no = `VC${Date.now()}`;
    db.serviceContacts.unshift({
      no,
      createdAt: today,
      name: document.querySelector("#volunteerName")?.value.trim() || "",
      phone: document.querySelector("#volunteerPhone")?.value.trim() || "",
      email: document.querySelector("#volunteerEmail")?.value.trim() || "",
      lineId: document.querySelector("#volunteerLine")?.value.trim() || "",
      area: document.querySelector("#volunteerArea")?.value.trim() || "",
      time: document.querySelector("#volunteerTime")?.value.trim() || "",
      type: document.querySelector("#volunteerType")?.value || "犬隻照護",
      note: document.querySelector("#volunteerNote")?.value.trim() || "",
      status: "待回覆"
    });
    saveLocalData();
    const result = document.querySelector("#frontVolunteerResult");
    result.hidden = false;
    result.innerHTML = `<strong>聯繫資料已送出：${no}</strong><p>後台已建立服務聯絡資料，志工窗口可依狀態追蹤回覆。</p>`;
    event.currentTarget.reset();
  }, { capture: true });
  document.querySelector("#frontOrderForm")?.addEventListener("submit", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const lines = frontCart.map(item => ({ ...item, product: publicProducts().find(product => product.slug === item.slug) })).filter(item => item.product);
    const subtotal = lines.reduce((total, item) => total + item.product.price * item.qty, 0);
    const threshold = Number(db.shopSettings.freeShippingThreshold || 0);
    const shipping = subtotal >= threshold || subtotal === 0 ? 0 : Number(db.shopSettings.shippingFee || 0);
    const orderNo = `OD${Date.now()}`;
    db.orders.unshift({
      no: orderNo,
      createdAt: today,
      buyer: document.querySelector("#frontOrderName")?.value.trim() || "",
      phone: document.querySelector("#frontOrderPhone")?.value.trim() || "",
      email: document.querySelector("#frontOrderEmail")?.value.trim() || "",
      address: document.querySelector("#frontOrderAddress")?.value.trim() || "",
      item: lines.map(line => `${line.product.name} x ${line.qty}`).join("、"),
      total: subtotal + shipping,
      payment: document.querySelector("#frontOrderPayment")?.value || "銀行轉帳",
      invoiceType: "免用統一發票",
      invoiceStatus: "未開立",
      status: "待出貨"
    });
    saveLocalData();
    const result = document.querySelector("#frontOrderResult");
    result.hidden = false;
    result.innerHTML = `<strong>訂購需求已送出：${orderNo}</strong><p>後台已建立訂單，會依付款與出貨狀態追蹤。</p>`;
    frontCart = [];
    frontSaveCart();
  }, { capture: true });
}

repairSeedData();
window.addEventListener("hashchange", render);
render();

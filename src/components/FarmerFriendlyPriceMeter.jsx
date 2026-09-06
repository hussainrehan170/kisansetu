import React, { useState } from 'react';

export const CROP_PRICE_DATA = {
  onion: {
    nashik: { current: '₹1,850/Q', low: '₹1,680/Q', high: '₹1,850/Q', diff: '+₹170', status: 'high', pr: 85, days: [1680, 1710, 1750, 1780, 1800, 1820, 1850] },
    pune: { current: '₹1,720/Q', low: '₹1,550/Q', high: '₹1,740/Q', diff: '+₹170', status: 'avg', pr: 55, days: [1550, 1590, 1630, 1680, 1740, 1710, 1720] },
    vashi: { current: '₹1,980/Q', low: '₹1,790/Q', high: '₹1,980/Q', diff: '+₹190', status: 'high', pr: 92, days: [1790, 1820, 1860, 1900, 1930, 1950, 1980] },
    solapur: { current: '₹1,580/Q', low: '₹1,450/Q', high: '₹1,600/Q', diff: '+₹130', status: 'low', pr: 25, days: [1450, 1480, 1500, 1540, 1600, 1590, 1580] }
  },
  tomato: {
    nashik: { current: '₹1,200/Q', low: '₹1,050/Q', high: '₹1,250/Q', diff: '+₹150', status: 'avg', pr: 58, days: [1050, 1100, 1150, 1180, 1250, 1220, 1200] },
    pune: { current: '₹1,250/Q', low: '₹1,100/Q', high: '₹1,280/Q', diff: '+₹150', status: 'avg', pr: 62, days: [1100, 1140, 1190, 1220, 1280, 1260, 1250] },
    vashi: { current: '₹1,320/Q', low: '₹1,180/Q', high: '₹1,350/Q', diff: '+₹140', status: 'high', pr: 88, days: [1180, 1220, 1260, 1300, 1350, 1330, 1320] },
    solapur: { current: '₹1,100/Q', low: '₹980/Q', high: '₹1,150/Q', diff: '+₹120', status: 'low', pr: 30, days: [980, 1020, 1060, 1100, 1150, 1120, 1100] }
  },
  soybean: {
    nashik: { current: '₹4,050/Q', low: '₹3,880/Q', high: '₹4,080/Q', diff: '+₹170', status: 'high', pr: 82, days: [3880, 3920, 3950, 3990, 4020, 4080, 4050] },
    pune: { current: '₹4,100/Q', low: '₹3,920/Q', high: '₹4,120/Q', diff: '+₹180', status: 'high', pr: 86, days: [3920, 3960, 4000, 4040, 4080, 4120, 4100] },
    vashi: { current: '₹4,200/Q', low: '₹4,010/Q', high: '₹4,220/Q', diff: '+₹190', status: 'high', pr: 94, days: [4010, 4050, 4100, 4140, 4180, 4220, 4200] },
    solapur: { current: '₹3,950/Q', low: '₹3,800/Q', high: '₹3,980/Q', diff: '+₹150', status: 'avg', pr: 50, days: [3800, 3830, 3870, 3910, 3950, 3980, 3950] }
  },
  pomegranate: {
    nashik: { current: '₹5,500/Q', low: '₹5,100/Q', high: '₹5,600/Q', diff: '+₹400', status: 'high', pr: 80, days: [5100, 5200, 5300, 5420, 5600, 5550, 5500] },
    pune: { current: '₹5,800/Q', low: '₹5,350/Q', high: '₹5,850/Q', diff: '+₹450', status: 'high', pr: 87, days: [5350, 5450, 5580, 5690, 5780, 5850, 5800] },
    vashi: { current: '₹6,100/Q', low: '₹5,600/Q', high: '₹6,150/Q', diff: '+₹500', status: 'high', pr: 95, days: [5600, 5720, 5840, 5950, 6050, 6150, 6100] },
    solapur: { current: '₹5,200/Q', low: '₹4,850/Q', high: '₹5,300/Q', diff: '+₹350', status: 'avg', pr: 52, days: [4850, 4920, 5010, 5120, 5250, 5300, 5200] }
  }
};

export const METER_I18N = {
  en: {
    kpi1Title: "Today's Highest Rate",
    kpi1Badge: "▲ High Profit",
    kpi1Value: "₹1,980",
    kpi1Sub: "📍 Vashi APMC (Top Mandi)",
    kpi2Title: "Market Trend",
    kpi2Badge: "🟢 Bullish",
    kpi2Value: "Rising Fast! ▲",
    kpi2Sub: "+₹50 since yesterday · Good time to sell",
    kpi3Title: "Nearest Mandi",
    kpi3Badge: "12 km away",
    kpi3Value: "₹1,850",
    kpi3Sub: "📍 Nashik Mandi · Open Today",
    kpi4Title: "Buyers Ready",
    kpi4Badge: "✓ Verified",
    kpi4Value: "3 Active Buyers",
    kpi4Sub: "Direct Farm Pickup · Assured Payment",
    rateMeterTitle: "Price Health Meter",
    meterLowLabel: "🔴 Low Rate",
    meterAvgLabel: "🟡 Average Rate",
    meterHighLabel: "🟢 High Profit Rate",
    highVerdict: "🟢 High Rate (Great time to sell)",
    avgVerdict: "🟡 Average Rate (Normal trend)",
    lowVerdict: "🔴 Low Rate (Consider cold storage)",
    sevenDayTitle: "7-Day Daily Price Trend",
    sevenDaySub: "Live Mandi Data",
    todayPeakBadge: "🌟 Peak Rate",
    weekLowTitle: "🔻 7-Day Low:",
    weekHighTitle: "🔺 7-Day High:",
    dayLabels: ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"]
  },
  hi: {
    kpi1Title: "आज का सबसे बड़ा भाव",
    kpi1Badge: "▲ बंपर मुनाफा",
    kpi1Value: "₹1,980",
    kpi1Sub: "📍 वाशी मंडी (सर्वोच्च दर)",
    kpi2Title: "मंडी का रुख",
    kpi2Badge: "🟢 खूब तेजी",
    kpi2Value: "खूब तेजी है! ▲",
    kpi2Sub: "कल से ₹50 बढ़ा · माल बेचने का सही समय",
    kpi3Title: "पास की मंडी का भाव",
    kpi3Badge: "12 किमी दूर",
    kpi3Value: "₹1,850",
    kpi3Sub: "📍 नासिक मंडी · आज चालू है",
    kpi4Title: "तैयार पक्के खरीददार",
    kpi4Badge: "✓ पक्के",
    kpi4Value: "3 खरीददार तैयार",
    kpi4Sub: "खेत से सीधी उठाई · पक्का भुगतान",
    rateMeterTitle: "भाव मीटर (Price Health Meter)",
    meterLowLabel: "🔴 मंदा (कम भाव)",
    meterAvgLabel: "🟡 सामान्य (औसत)",
    meterHighLabel: "🟢 बंपर तेजी (मुनाफा भाव)",
    highVerdict: "🟢 बंपर तेजी (फसल बेचने का सही समय)",
    avgVerdict: "🟡 सामान्य भाव (औसत दर)",
    lowVerdict: "🔴 मंदा भाव (कोल्ड स्टोरेज में रखने की सलाह)",
    sevenDayTitle: "पिछले 7 दिनों का रोज का भाव विवरण",
    sevenDaySub: "लाइव मंडी डेटा",
    todayPeakBadge: "🌟 सबसे ज्यादा",
    weekLowTitle: "🔻 सबसे कम:",
    weekHighTitle: "🔺 सबसे ज्यादा:",
    dayLabels: ["6 दिन पहले", "5 दिन पहले", "4 दिन पहले", "3 दिन पहले", "परसों", "कल", "आज"]
  },
  hr: {
    kpi1Title: "आज का सब तै घणा भाव",
    kpi1Badge: "▲ चोखा नफा",
    kpi1Value: "₹1,980",
    kpi1Sub: "📍 वाशी मंडी (सब तै घणा)",
    kpi2Title: "मंडी का रुख",
    kpi2Badge: "🟢 खूब तेजी",
    kpi2Value: "खूब तेजी सै! ▲",
    kpi2Sub: "काल तै ₹50 बढ़ रह्या सै · बेचण का सही टेम",
    kpi3Title: "धोरै की मंडी का भाव",
    kpi3Badge: "12 किमी दूर",
    kpi3Value: "₹1,850",
    kpi3Sub: "📍 नासिक मंडी · आज चालू सै",
    kpi4Title: "तैयार पक्के खरीददार",
    kpi4Badge: "✓ पक्के",
    kpi4Value: "3 खरीददार तैयार",
    kpi4Sub: "खेत तै सीधी उठाई · पक्का भुगतान",
    rateMeterTitle: "भाव मीटर (Price Meter)",
    meterLowLabel: "🔴 मंदा (घट भाव)",
    meterAvgLabel: "🟡 सामान्य (औसत)",
    meterHighLabel: "🟢 बंपर तेजी (चोखा भाव)",
    highVerdict: "🟢 बंपर तेजी (फसल बेचण का सही टेम)",
    avgVerdict: "🟡 सामान्य भाव (औसत दर)",
    lowVerdict: "🔴 मंदा भाव (कोल्ड स्टोर म्ह रखण की सलाह)",
    sevenDayTitle: "पिछले 7 दिनां का रोज का भाव विवरण",
    sevenDaySub: "लाइव मंडी डेटा",
    todayPeakBadge: "🌟 सब तै घणा",
    weekLowTitle: "🔻 सब तै कम:",
    weekHighTitle: "🔺 सब तै ज्यादा:",
    dayLabels: ["6 दिन पैहल्यां", "5 दिन पैहल्यां", "4 दिन पैहल्यां", "3 दिन पैहल्यां", "परसों", "कल", "आज"]
  },
  mr: {
    kpi1Title: "आजचा सर्वोच्च बाजारभाव",
    kpi1Badge: "▲ बंपर नफा",
    kpi1Value: "₹1,980",
    kpi1Sub: "📍 वाशी एपीएमसी (सर्वोच्च दर)",
    kpi2Title: "बाजारभाव कल",
    kpi2Badge: "🟢 तेजी",
    kpi2Value: "तेजीत आहे! ▲",
    kpi2Sub: "कालपेक्षा ₹50 वाढ · माल विकण्याची योग्य वेळ",
    kpi3Title: "जवळच्या मंडीचा भाव",
    kpi3Badge: "12 किमी अंतरावर",
    kpi3Value: "₹1,850",
    kpi3Sub: "📍 नाशिक एपीएमसी · आज सुरू आहे",
    kpi4Title: "सत्यापित खरेदीदार",
    kpi4Badge: "✓ पडताळणीकृत",
    kpi4Value: "3 खरेदीदार तयार",
    kpi4Sub: "थेट शेतातून उचल · सुरक्षित पैसे",
    rateMeterTitle: "भाव मीटर (Price Meter)",
    meterLowLabel: "🔴 मंदी (कमी भाव)",
    meterAvgLabel: "🟡 सामान्य (सरासरी)",
    meterHighLabel: "🟢 बंपर तेजी (नफा भाव)",
    highVerdict: "🟢 बंपर तेजी (माल विकण्याचा योग्य वेळ)",
    avgVerdict: "🟡 सामान्य भाव (सरासरी दर)",
    lowVerdict: "🔴 मंदी (कोल्ड स्टोरेजमध्ये ठेवण्याचा सल्ला)",
    sevenDayTitle: "मागील 7 दिवसांचे दैनिक बाजारभाव",
    sevenDaySub: "थेट एपीएमसी डेटा",
    todayPeakBadge: "🌟 सर्वाधिक",
    weekLowTitle: "🔻 सर्वात कमी:",
    weekHighTitle: "🔺 सर्वाधिक:",
    dayLabels: ["6 दिवसांपूर्वी", "5 दिवसांपूर्वी", "4 दिवसांपूर्वी", "3 दिवसांपूर्वी", "परवा", "काल", "आज"]
  }
};

const FarmerFriendlyPriceMeter = ({ lang = 'en' }) => {
  const [selectedMandi, setSelectedMandi] = useState('nashik');
  const [selectedCrop, setSelectedCrop] = useState('onion');

  const currentLang = METER_I18N[lang] ? lang : 'en';
  const t = METER_I18N[currentLang];

  const cropData = (CROP_PRICE_DATA[selectedCrop] && CROP_PRICE_DATA[selectedCrop][selectedMandi]) 
    || CROP_PRICE_DATA.onion.nashik;

  const minDay = Math.min(...cropData.days);
  const maxDay = Math.max(...cropData.days);
  const range = Math.max(1, maxDay - minDay);

  const getVerdict = () => {
    if (cropData.status === 'high') return { text: t.highVerdict, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600' };
    if (cropData.status === 'avg') return { text: t.avgVerdict, color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-600' };
    return { text: t.lowVerdict, color: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600' };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-6">
      {/* 4 Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Highest Rate */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200/80 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-400 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shadow-2xs">🏆</div>
              <span className="text-sm font-bold text-stone-700">{t.kpi1Title}</span>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">{t.kpi1Badge}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">{t.kpi1Value}</span>
            <span className="text-xs font-bold text-stone-400 uppercase">/ Quintal</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-stone-500 flex items-center gap-1">
            <span>{t.kpi1Sub}</span>
          </div>
        </div>

        {/* Card 2: Market Trend */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200/80 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-400 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shadow-2xs">📈</div>
              <span className="text-sm font-bold text-stone-700">{t.kpi2Title}</span>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">{t.kpi2Badge}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{t.kpi2Value}</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <span>{t.kpi2Sub}</span>
          </div>
        </div>

        {/* Card 3: Nearest Mandi */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-400 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-2xs">🏪</div>
              <span className="text-sm font-bold text-stone-700">{t.kpi3Title}</span>
            </div>
            <span className="text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full">{t.kpi3Badge}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">{t.kpi3Value}</span>
            <span className="text-xs font-bold text-stone-400 uppercase">/ Quintal</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-stone-500 flex items-center gap-1">
            <span>{t.kpi3Sub}</span>
          </div>
        </div>

        {/* Card 4: Buyers Ready */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-400 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl shadow-2xs">🤝</div>
              <span className="text-sm font-bold text-stone-700">{t.kpi4Title}</span>
            </div>
            <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">{t.kpi4Badge}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{t.kpi4Value}</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <span>{t.kpi4Sub}</span>
          </div>
        </div>

      </div>

      {/* Main Meter & 7-Day Pillar Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        {/* Selector & Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Mandi</label>
              <select
                value={selectedMandi}
                onChange={(e) => setSelectedMandi(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 font-semibold text-stone-800 focus:outline-none pr-8 shadow-xs cursor-pointer"
              >
                <option value="nashik">Nashik APMC</option>
                <option value="pune">Pune APMC</option>
                <option value="vashi">Navi Mumbai (Vashi)</option>
                <option value="solapur">Solapur APMC</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 font-semibold text-stone-800 focus:outline-none pr-8 shadow-xs cursor-pointer"
              >
                <option value="onion">Red Onion (कांदा / प्याज)</option>
                <option value="tomato">Hybrid Tomato (टोमॅटो)</option>
                <option value="soybean">Soybean (सोयाबीन)</option>
                <option value="pomegranate">Pomegranate (डाळिंब / अनार)</option>
              </select>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Today's Modal Rate</div>
            <div className="text-3xl font-black mt-0.5 text-emerald-700">{cropData.current}</div>
          </div>
        </div>

        {/* 1. Easy-to-understand Price Health Meter */}
        <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span className="text-xs font-black text-stone-900 uppercase tracking-wider">{t.rateMeterTitle}</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border shadow-2xs ${verdict.color}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${verdict.dot}`}></span>
              <span>{verdict.text}</span>
            </div>
          </div>

          {/* Visual Color Gauge */}
          <div className="relative pt-2 pb-2">
            <div className="flex justify-between text-[11px] font-bold mb-2 px-1">
              <span className="text-rose-600 font-bold">{t.meterLowLabel}</span>
              <span className="text-amber-600 font-bold">{t.meterAvgLabel}</span>
              <span className="text-emerald-700 font-bold">{t.meterHighLabel}</span>
            </div>
            {/* Gradient bar */}
            <div className="w-full h-4 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-500 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10"></div>
            </div>
            {/* Pointer position */}
            <div className="relative w-full h-8 mt-1">
              <div
                className="absolute flex flex-col items-center transition-all duration-500"
                style={{ left: `calc(${cropData.pr}% - 40px)` }}
              >
                <span className="text-xs text-stone-900 leading-none">▲</span>
                <span className="text-[10px] font-black bg-stone-900 text-white px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap mt-0.5">
                  {cropData.current} · {cropData.status === 'high' ? 'High Profit' : cropData.status === 'avg' ? 'Average' : 'Low Rate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Simple 7-Day Price Tracker */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-black text-stone-800 uppercase tracking-wider">{t.sevenDayTitle}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded font-bold">{t.sevenDaySub}</span>
          </div>

          {/* 7 Daily Pillar Cards */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {cropData.days.map((price, idx) => {
              const isToday = idx === 6;
              const barHeightPct = Math.round(45 + ((price - minDay) / range) * 50);
              const label = t.dayLabels[idx] || `${6 - idx}d ago`;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-2.5 text-center flex flex-col items-center justify-between h-32 shadow-xs transition-all ${
                    isToday
                      ? 'bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-500 shadow-md relative'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  {isToday && (
                    <span className="absolute -top-2.5 px-2 py-0.2 bg-emerald-600 text-white text-[8px] font-black rounded-full uppercase tracking-wider">
                      {t.todayPeakBadge}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-800 font-black mt-1' : 'text-stone-400'}`}>
                    {label}
                  </span>
                  <div className="w-full bg-stone-100 rounded-lg h-14 flex items-end p-0.5">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        isToday ? 'bg-emerald-600' : 'bg-emerald-400/80 hover:bg-emerald-500'
                      }`}
                      style={{ height: `${barHeightPct}%` }}
                    ></div>
                  </div>
                  <div className={`text-[11px] font-black ${isToday ? 'text-emerald-700' : 'text-stone-800'}`}>
                    ₹{price.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Low / High summary pills */}
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-stone-500 mt-4 pt-3 border-t border-stone-100 px-1">
            <span className="text-rose-600 font-bold">
              {t.weekLowTitle} ₹{minDay.toLocaleString('en-IN')}
            </span>
            <span className="text-emerald-700 font-bold">
              {t.weekHighTitle} ₹{maxDay.toLocaleString('en-IN')} ({cropData.diff} growth)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmerFriendlyPriceMeter;

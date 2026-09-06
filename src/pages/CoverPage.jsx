import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WHEAT_HERO_BG } from '../assets/heroBg';
import { KISAN_SETU_LOGO } from '../assets/logo';

const translations = {
  en: {
    heroTitle1: 'Strengthening Market Linkages with',
    heroTitle2: 'Fair Price Discovery',
    heroSubtitle: 'Empowering farmers & FPOs across Maharashtra with real-time APMC intelligence, standardized quality grading, verified buyer matching, and automated logistics.',
    btnContinue: 'Continue to Platform →',
    btnFarmer: 'Farmer Portal 🧑‍🌾',
    cropsSecTitle: 'Explore Crop Intelligence',
    cropsSecSubtitle: 'Real-time APMC arrivals, modal rates, and standardized quality grading across Maharashtra agricultural terminals.',
    cropNameWheat: 'Wheat (गेहूं / गहू)',
    cropNameOnion: 'Red Onion (कांदा / प्याज)',
    cropNameTomato: 'Hybrid Tomato (टोमॅटो)',
    cropNameSoybean: 'Soybean (सोयाबीन)',
    toolsSecTitle: 'Quick Access Modules',
    toolsSecSubtitle: 'Jump straight into the core features that connect farmers with verified buyers and transparent pricing.',
    tool1Title: 'Price Aggregator',
    tool1Desc: 'Real-time Agmarknet & eNAM prices across Maharashtra APMCs.',
    tool2Title: 'Farmer & FPO Portal',
    tool2Desc: 'Digitize lots with APMC quality grading (FAQ/Grade A) and accept bids.',
    tool3Title: 'Buyer Marketplace',
    tool3Desc: 'Verified farm-gate sourcing for processors, retail chains & exporters.',
    tool4Title: 'Logistics & Storage',
    tool4Desc: 'Per-km truck booking and cold storage reservations for perishables.',
    tool5Title: 'Escrow & Disputes',
    tool5Desc: 'Digital contract ledger and 24h grievance redressal mechanism.',
    footerAbout: 'Smart India Hackathon 2026 · Problem Statement SIH26132 for Government of Maharashtra. Strengthening farm-gate market linkages and price discovery.',
    footerCol1: 'Platform Modules',
    footerCol2: 'State APMC Network',
    footerCol3: 'Compliance & Governance'
  },
  hi: {
    heroTitle1: 'खेत से बाज़ार तक सशक्त संपर्क एवं',
    heroTitle2: 'पारदर्शी मूल्य खोज',
    heroSubtitle: 'महाराष्ट्र के किसानों एवं FPO के लिए वास्तविक समय पर APMC मंडी भाव, मानकीकृत गुणवत्ता ग्रेडिंग, सत्यापित खरीदार एवं त्वरित कोल्ड स्टोरेज लॉजिस्टिक्स का संपूर्ण डिजिटल समाधान।',
    btnContinue: 'मुख्य पोर्टल पर आगे बढ़ें →',
    btnFarmer: 'किसान पोर्टल 🧑‍🌾',
    cropsSecTitle: 'फसल एवं बाज़ार विश्लेषण',
    cropsSecSubtitle: 'महाराष्ट्र के प्रमुख APMC टर्मिनलों से दैनिक आगमन, मॉडल दरें और मानकीकृत गुणवत्ता ग्रेडिंग।',
    cropNameWheat: 'गेहूं (गहू / Wheat)',
    cropNameOnion: 'लाल प्याज (कांदा / Onion)',
    cropNameTomato: 'हाइब्रिड टमाटर (Tomato)',
    cropNameSoybean: 'सोयाबीन (Soybean)',
    toolsSecTitle: 'त्वरित एक्सेस मॉड्यूल',
    toolsSecSubtitle: 'किसानों को सीधे सत्यापित खरीदारों और पारदर्शी बाज़ार दरों से जोड़ने वाले मुख्य उपकरणों का उपयोग करें।',
    tool1Title: 'मंडी भाव संकलक',
    tool1Desc: 'महाराष्ट्र की APMC मंडियों से Agmarknet और eNAM लाइव दरें।',
    tool2Title: 'किसान एवं FPO पोर्टल',
    tool2Desc: 'APMC ग्रेडिंग (FAQ/Grade A) के साथ फसल दर्ज करें और बोलियाँ स्वीकारें।',
    tool3Title: 'संस्थागत खरीदार बाज़ार',
    tool3Desc: 'खाद्य प्रसंस्करणकर्ताओं, निर्यातकों व खुदरा विक्रेताओं हेतु सीधी खरीद।',
    tool4Title: 'परिवहन व शीतगृह',
    tool4Desc: 'सत्यापित ट्रक परिवहन एवं तापमान-नियंत्रित कोल्ड स्टोरेज स्लॉट।',
    tool5Title: 'एस्क्रो व विवाद निवारण',
    tool5Desc: 'डिजिटल अनुबंध बहीखाता और 24-घंटे में त्वरित शिकायत निवारण।',
    footerAbout: 'स्मार्ट इंडिया हैकाथॉन 2026 · महाराष्ट्र शासन हेतु समस्या विवरण SIH26132 · किसानों के लिए बाज़ार संपर्क एवं मूल्य खोज को सुदृढ़ बनाना।',
    footerCol1: 'प्लेटफॉर्म मॉड्यूल',
    footerCol2: 'राज्य APMC नेटवर्क',
    footerCol3: 'मानक व शासन'
  },
  hr: {
    heroTitle1: 'खेत तै लेकै मंडी ताहीं पक्का सौदा अर',
    heroTitle2: 'सही दाम की खोज',
    heroSubtitle: 'सोनीपत अर देस भर के किसान भायां खातर असली टेम पै मंडी भाव, खरी-खरी ग्रेडिंग, पक्के खरीददार अर सीधी ढुलाई की सुविधा।',
    btnContinue: 'पोर्टल पै आगै बढ़ो →',
    btnFarmer: 'किसान पोर्टल 🧑‍🌾',
    cropsSecTitle: 'फसल अर मंडी भाव',
    cropsSecSubtitle: 'सोनीपत, गन्नौर, करनाल अर आसपास की मंडियां तै ताजा आवक अर मॉडल भाव।',
    cropNameWheat: 'गेहूं (Wheat)',
    cropNameOnion: 'लाल प्याज (कांदा)',
    cropNameTomato: 'टमाटर (Tomato)',
    cropNameSoybean: 'सोयाबीन (Soybean)',
    toolsSecTitle: 'प्लेटफॉर्म के औजार',
    toolsSecSubtitle: 'किसान, खरीददार अर गाड़ी वालियां नै जोड़ण खातर खास सुबिधा।',
    tool1Title: 'मंडी भाव संकलक',
    tool1Desc: 'eNAM अर Agmarknet तै सीधी ताजा दर।',
    tool2Title: 'किसान पोर्टल',
    tool2Desc: 'लॉट बणाओ, बोली मंगवाओ, नफे म्ह बेचो।',
    tool3Title: 'खरीददार बाजार',
    tool3Desc: 'बड़ी मिल अर व्यापारियों तै सीधी खरीद।',
    tool4Title: 'गाड़ी अर गोदाम',
    tool4Desc: 'पक्की गाड़ियां अर कोल्ड स्टोर की बुकिंग।',
    tool5Title: 'एस्क्रो अर समाधान',
    tool5Desc: 'पक्का डिजिटल इकरारनामा अर पंचायत समाधान।',
    footerAbout: 'SIH26132 · किसान भायां खातर खेत तै मंडी ताहीं पक्का जोड़ अर खरा भाव।',
    footerCol1: 'प्लेटफॉर्म के औजार',
    footerCol2: 'मंडी नेटवर्क',
    footerCol3: 'नियम अर कायदे'
  },
  mr: {
    heroTitle1: 'शेतापासून बाजारापर्यंत सक्षम संपर्क आणि',
    heroTitle2: 'पारदर्शक किंमत शोध',
    heroSubtitle: 'महाराष्ट्रातील शेतकरी व FPO साठी रिअल-टाइम APMC मंडी भाव, प्रमाणित गुणवत्ता श्रेणीकरण, सत्यापित खरेदीदार आणि कोल्ड स्टोरेज लॉजिस्टिक्स.',
    btnContinue: 'प्लॅटफॉर्मवर पुढे जा →',
    btnFarmer: 'शेतकरी पोर्टल 🧑‍🌾',
    cropsSecTitle: 'पिकाचे बाजारभाव',
    cropsSecSubtitle: 'महाराष्ट्रातील APMC टर्मिनल्सवरून दैनंदिन आवक, मॉडल दर आणि गुणवत्ता श्रेणीकरण.',
    cropNameWheat: 'गहू (Wheat)',
    cropNameOnion: 'लाल कांदा (Onion)',
    cropNameTomato: 'हायब्रिड टोमॅटो',
    cropNameSoybean: 'सोयाबीन',
    toolsSecTitle: 'प्लॅटफॉर्म मॉड्यूल',
    toolsSecSubtitle: 'शेतकरी, खरेदीदार आणि लॉजिस्टिक्स भागीदारांना जोडणारी मुख्य साधने.',
    tool1Title: 'भाव संकलक',
    tool1Desc: 'Agmarknet व eNAM वरून थेट APMC दर.',
    tool2Title: 'शेतकरी पोर्टल',
    tool2Desc: 'लॉट तयार करा, बोली घ्या, बाजारात जा.',
    tool3Title: 'खरेदीदार बाजार',
    tool3Desc: 'प्रक्रियाकर्ते व निर्यातदारांसाठी थेट खरेदी.',
    tool4Title: 'वाहतूक व साठवण',
    tool4Desc: 'सत्यापित ट्रक व कोल्ड स्टोरेज.',
    tool5Title: 'एस्क्रो व तक्रार',
    tool5Desc: 'डिजिटल करार व तक्रार निवारण.',
    footerAbout: 'SIH26132 · महाराष्ट्र शासन · शेतकऱ्यांसाठी बाजार संपर्क.',
    footerCol1: 'प्लॅटफॉर्म मॉड्यूल',
    footerCol2: 'APMC नेटवर्क',
    footerCol3: 'अनुपालन'
  }
};

const INDIA_LOCATION_LANG_MAP = {
  haryana: { code: 'hr', name: 'हरियाणवी', subname: 'Haryanvi', continueText: 'हरियाणवी म्ह जारी राखो →', defaultLoc: 'Sonipat, Haryana', icon: '🌾' },
  sonipat: { code: 'hr', name: 'हरियाणवी', subname: 'Haryanvi', continueText: 'हरियाणवी म्ह जारी राखो →', defaultLoc: 'Sonipat, Haryana', icon: '🌾' },
  delhi: { code: 'hr', name: 'हरियाणवी', subname: 'Haryanvi', continueText: 'हरियाणवी म्ह जारी राखो →', defaultLoc: 'Delhi-NCR / Sonipat', icon: '🌾' },
  punjab: { code: 'pa', name: 'ਪੰਜਾਬੀ', subname: 'Punjabi', continueText: 'ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਰੀ ਰੱਖੋ →', defaultLoc: 'Punjab', icon: '🌾' },
  maharashtra: { code: 'mr', name: 'मराठी', subname: 'Marathi', continueText: 'मराठीत पुढे जा →', defaultLoc: 'Maharashtra', icon: '🌱' },
  nashik: { code: 'mr', name: 'मराठी', subname: 'Marathi', continueText: 'मराठीत पुढे जा →', defaultLoc: 'Nashik, Maharashtra', icon: '🌱' },
  pune: { code: 'mr', name: 'मराठी', subname: 'Marathi', continueText: 'मराठीत पुढे जा →', defaultLoc: 'Pune, Maharashtra', icon: '🌱' },
  gujarat: { code: 'gu', name: 'ગુજરાતી', subname: 'Gujarati', continueText: 'ગુજરાતીમાં ચાલુ રાખો →', defaultLoc: 'Gujarat', icon: '🌾' },
  rajasthan: { code: 'raj', name: 'राजस्थानी', subname: 'Rajasthani', continueText: 'राजस्थानी में आगे बढ़ो →', defaultLoc: 'Rajasthan', icon: '🐪' },
  uttar_pradesh: { code: 'bh', name: 'भोजपुरी', subname: 'Bhojpuri', continueText: 'भोजपुरी में आगे बढ़ीं →', defaultLoc: 'Uttar Pradesh', icon: '🌾' }
};

const CoverPage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [showEntranceModal, setShowEntranceModal] = useState(true);

  // Compulsory Registration Modal States
  const [showCompulsoryRegModal, setShowCompulsoryRegModal] = useState(false);
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' | 'buyer'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const [farmerForm, setFarmerForm] = useState({
    fullName: '',
    phone: '',
    villageDistrict: '',
    state: 'Maharashtra',
    primaryCrops: ''
  });

  const [buyerForm, setBuyerForm] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    businessType: '',
    location: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Prevent Escape key from closing the compulsory modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showCompulsoryRegModal) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [showCompulsoryRegModal]);

  // Intercept "CONTINUE TO PLATFORM" click
  const handleContinueToPlatform = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const savedReg = localStorage.getItem('krishisetu_registration');
    if (savedReg) {
      try {
        const parsed = JSON.parse(savedReg);
        if (parsed && parsed.id) {
          navigate('/prices');
          return;
        }
      } catch (err) {
        // invalid JSON in storage, open modal
      }
    }
    setServerError('');
    setFormErrors({});
    setShowCompulsoryRegModal(true);
  };

  const validatePhone = (phone) => {
    const clean = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errors = {};

    if (regRole === 'farmer') {
      if (!farmerForm.fullName.trim()) errors.fullName = 'Full Name is required';
      if (!farmerForm.phone.trim()) errors.phone = 'Phone Number is required';
      else if (!validatePhone(farmerForm.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
      if (!farmerForm.villageDistrict.trim()) errors.villageDistrict = 'Village / District is required';
      if (!farmerForm.state.trim()) errors.state = 'State is required';
      if (!farmerForm.primaryCrops.trim()) errors.primaryCrops = 'Primary Crop(s) is required';
    } else {
      if (!buyerForm.fullName.trim()) errors.fullName = 'Full Name is required';
      if (!buyerForm.phone.trim()) errors.phone = 'Phone Number is required';
      else if (!validatePhone(buyerForm.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
      if (!buyerForm.companyName.trim()) errors.companyName = 'Business / Company Name is required';
      if (!buyerForm.businessType.trim()) errors.businessType = 'Please select a Business Type';
      if (!buyerForm.location.trim()) errors.location = 'Location (City / District) is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const payload = regRole === 'farmer'
      ? { role: 'farmer', ...farmerForm, phone: farmerForm.phone.replace(/\D/g, '') }
      : { role: 'buyer', ...buyerForm, phone: buyerForm.phone.replace(/\D/g, '') };

    try {
      // Try Vite proxy /api/register first, then direct port 8000
      let response = null;
      try {
        response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (fetchErr) {
        response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server rejected registration request');
      }

      const savedRecord = await response.json();
      localStorage.setItem('krishisetu_registration', JSON.stringify({
        id: savedRecord.id,
        role: savedRecord.role,
        fullName: savedRecord.fullName,
        phone: savedRecord.phone,
        createdAt: savedRecord.createdAt
      }));

      setIsSubmitting(false);
      setShowCompulsoryRegModal(false);
      navigate('/prices');

    } catch (err) {
      console.error('Registration failed:', err);
      // If backend server is not running, provide offline persistence fallback so user is not blocked
      const fallbackId = 'reg_local_' + Math.random().toString(36).substring(2, 11);
      const fallbackRecord = {
        ...payload,
        id: fallbackId,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('krishisetu_registration', JSON.stringify({
        id: fallbackId,
        role: payload.role,
        fullName: payload.fullName,
        phone: payload.phone,
        createdAt: fallbackRecord.createdAt
      }));

      setServerError('Note: Backend server was unreachable, registration saved locally on this device.');
      setTimeout(() => {
        setIsSubmitting(false);
        setShowCompulsoryRegModal(false);
        navigate('/prices');
      }, 1200);
    }
  };

  const [lang, setLang] = useState('en');
  const [thirdLang, setThirdLang] = useState(INDIA_LOCATION_LANG_MAP['sonipat']);
  const t = translations[lang] || translations['en'];

  useEffect(() => {
    // Attempt automatic browser location detection
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // Rough geographic heuristic for Indian states
          if (lat >= 27.5 && lat <= 31.0 && lng >= 74.5 && lng <= 78.0) {
            setThirdLang(INDIA_LOCATION_LANG_MAP['sonipat']);
          } else if (lat >= 15.5 && lat <= 22.0 && lng >= 72.5 && lng <= 80.5) {
            setThirdLang(INDIA_LOCATION_LANG_MAP['nashik']);
          } else if (lat >= 29.5 && lat <= 32.5 && lng >= 73.5 && lng <= 77.0) {
            setThirdLang(INDIA_LOCATION_LANG_MAP['punjab']);
          } else if (lat >= 20.0 && lat <= 24.5 && lng >= 68.0 && lng <= 74.5) {
            setThirdLang(INDIA_LOCATION_LANG_MAP['gujarat']);
          }
        },
        () => {
          // Default to Sonipat, Haryana
          setThirdLang(INDIA_LOCATION_LANG_MAP['sonipat']);
        },
        { timeout: 3000 }
      );
    }
  }, []);

  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('ks_lang', selectedLang);
    setShowEntranceModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] text-stone-900 selection:bg-amber-200 selection:text-stone-900 relative overflow-x-hidden font-sans">

      {/* Mandatory Language Selection Entrance Popup with 3 Location-Aware Options */}
      {showEntranceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md">
          <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 sm:p-10 max-w-lg w-full shadow-2xl text-center relative animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-white border border-emerald-200 p-1 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <img src={KISAN_SETU_LOGO} alt="KisanSetu Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              KisanSetu
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 mt-2 shadow-2xs">
              <span>📍 {thirdLang.defaultLoc} (Detected Location)</span>
            </div>
            <div className="my-5 py-3 border-y border-stone-100">
              <p className="text-sm font-bold text-stone-800">
                Choose Your Language to Enter
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                वेबसाइट में आगे बढ़ने के लिए अपनी भाषा चुनें
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => handleSelectLanguage('en')}
                className="group p-4 rounded-2xl border-2 border-stone-200 hover:border-emerald-600 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all shadow-2xs hover:shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider block">English</span>
                  <span className="text-base font-black text-stone-900 mt-1 block">English</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-3 group-hover:text-emerald-800 font-medium">Continue in English →</span>
              </button>

              <button
                onClick={() => handleSelectLanguage('hi')}
                className="group p-4 rounded-2xl border-2 border-stone-200 hover:border-emerald-600 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all shadow-2xs hover:shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider block">हिन्दी</span>
                  <span className="text-base font-black text-stone-900 mt-1 block">हिन्दी</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-3 group-hover:text-emerald-800 font-medium">हिन्दी में जारी रखें →</span>
              </button>

              <button
                onClick={() => handleSelectLanguage(thirdLang.code)}
                className="group p-4 rounded-2xl border-2 border-emerald-300 hover:border-emerald-600 bg-emerald-50/60 hover:bg-emerald-100/50 text-left transition-all shadow-2xs hover:shadow-md flex flex-col justify-between relative overflow-hidden cursor-pointer"
              >
                <span className="absolute top-2 right-2 text-xs">{thirdLang.icon}</span>
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 font-black uppercase tracking-wider block">Local Dialect</span>
                  <span className="text-base font-black text-emerald-950 mt-1 block">{thirdLang.name}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">({thirdLang.subname})</span>
                </div>
                <span className="text-[10px] text-emerald-800 mt-3 font-bold">{thirdLang.continueText}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION: Full-Width Cinematic Golden Sunset Landscape with Centered Floating Glass Card */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Crisp High-Resolution Golden Wheat Sunset Background (100% Guaranteed Base64) */}
        <div className="absolute inset-0 -z-10">
          <img
            src={WHEAT_HERO_BG}
            alt="Golden Wheat Sunset Agricultural Landscape"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(12,10,9,0.72) 0%, rgba(28,25,23,0.50) 50%, rgba(12,10,9,0.68) 100%)'
            }}
          />
        </div>

        {/* Centered Floating Glassmorphic Hero Card */}
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <div className="bg-stone-900/65 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl text-white">
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-white/95 rounded-3xl p-2 flex items-center justify-center shadow-2xl border border-emerald-300/60">
                <img src={KISAN_SETU_LOGO} alt="KisanSetu Official Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.12]">
              <span>{t.heroTitle1}</span>
              <span className="text-amber-400 block sm:inline sm:ml-3">{t.heroTitle2}</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-stone-200 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons: Continue to Platform (Intercepted for Compulsory Registration) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={handleContinueToPlatform}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 uppercase tracking-wide flex items-center space-x-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                <span>{t.btnContinue}</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION 2: Explore Crop Intelligence (Featured Commodities Grid) */}
      <section className="py-16 lg:py-24 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-stone-900 mb-3 tracking-tight">
              {t.cropsSecTitle}
            </h2>
            <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">
              {t.cropsSecSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link to="/prices" className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group text-left">
              <div className="relative h-44 overflow-hidden bg-amber-100">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                  alt="Wheat Crop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Rabi Season
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{t.cropNameWheat}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Pune & Nashik APMC</p>
                  </div>
                  <span className="text-emerald-700 font-black text-sm">₹2,000/Q</span>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Grade: FAQ Standard</span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform font-bold">View Prices →</span>
                </div>
              </div>
            </Link>

            <Link to="/prices" className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group text-left">
              <div className="relative h-44 overflow-hidden bg-rose-100">
                <img
                  src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop"
                  alt="Onion Crop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Kharif / Late
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{t.cropNameOnion}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Nashik & Yeola APMC</p>
                  </div>
                  <span className="text-emerald-700 font-black text-sm">₹1,850/Q</span>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Grade: FAQ / Grade A</span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform font-bold">View Prices →</span>
                </div>
              </div>
            </Link>

            <Link to="/prices" className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group text-left">
              <div className="relative h-44 overflow-hidden bg-red-100">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop"
                  alt="Tomato Crop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  All Seasons
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{t.cropNameTomato}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Pune Market Yard</p>
                  </div>
                  <span className="text-emerald-700 font-black text-sm">₹1,250/Q</span>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Grade: Grade A Fresh</span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform font-bold">View Prices →</span>
                </div>
              </div>
            </Link>

            <Link to="/prices" className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group text-left">
              <div className="relative h-44 overflow-hidden bg-amber-100">
                <img
                  src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&h=300&fit=crop"
                  alt="Soybean Crop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Kharif Season
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{t.cropNameSoybean}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Solapur & Aurangabad</p>
                  </div>
                  <span className="text-emerald-700 font-black text-sm">₹4,050/Q</span>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500 font-medium">
                  <span>Grade: FAQ Standard</span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform font-bold">View Prices →</span>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* SECTION 3: Quick Access Modules (Figma Style 5-Tool Cards Grid) */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-stone-900 mb-3 tracking-tight">
            {t.toolsSecTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">
            {t.toolsSecSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <Link to="/prices" className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1.5">{t.tool1Title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{t.tool1Desc}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 mt-4 block">Open Tool →</span>
          </Link>

          <Link to="/login?role=farmer" className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🧑‍🌾
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1.5">{t.tool2Title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{t.tool2Desc}</p>
            </div>
            <span className="text-xs font-bold text-amber-700 mt-4 block">Open Tool →</span>
          </Link>

          <Link to="/login?role=buyer" className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1.5">{t.tool3Title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{t.tool3Desc}</p>
            </div>
            <span className="text-xs font-bold text-blue-700 mt-4 block">Open Tool →</span>
          </Link>

          <Link to="/farmer/logistics" className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🚚
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1.5">{t.tool4Title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{t.tool4Desc}</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 mt-4 block">Open Tool →</span>
          </Link>

          <Link to="/transactions" className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-stone-800 text-white rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1.5">{t.tool5Title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{t.tool5Desc}</p>
            </div>
            <span className="text-xs font-bold text-stone-800 mt-4 block">Open Tool →</span>
          </Link>
        </div>
      </section>

      {/* Modern 4-Column Footer */}
      <footer className="bg-stone-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-left border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src="/logo.png" alt="KisanSetu Logo" className="w-11 h-11 object-contain rounded-xl bg-white p-1 border border-stone-700 shadow-sm" />
                <div className="flex flex-col">
                  <span className="font-black text-base text-white leading-tight">KISAN SETU</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">जुड़ाव से समृद्धि</span>
                </div>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                {t.footerAbout}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-300 mb-3">{t.footerCol1}</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link to="/prices" className="hover:text-white">Price Aggregator</Link></li>
                <li><Link to="/login?role=farmer" className="hover:text-white">Farmer Lot Creation</Link></li>
                <li><Link to="/login?role=buyer" className="hover:text-white">Institutional Bidding</Link></li>
                <li><Link to="/farmer/logistics" className="hover:text-white">Transit Logistics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-300 mb-3">{t.footerCol2}</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>Pune APMC (Gultekdi)</li>
                <li>Nashik APMC (Yeola / Dindori)</li>
                <li>Navi Mumbai APMC (Vashi)</li>
                <li>Solapur APMC (Market Yard)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-300 mb-3">{t.footerCol3}</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>APMC FAQ Quality Grading</li>
                <li>GST & FSSAI Verification</li>
                <li>Digital Escrow Settlement</li>
                <li>Grievance Redressal SLA 24h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
            © 2026 KisanSetu · Smart India Hackathon 2026 · Government of Maharashtra Pilot
          </div>
        </div>
      </footer>

    
      {/* ================= COMPULSORY REGISTRATION POPUP MODAL ================= */}
      {showCompulsoryRegModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div 
            className="bg-white border border-stone-200 rounded-[2.5rem] p-6 sm:p-9 max-w-lg w-full shadow-2xl my-auto text-left relative"
            onClick={(e) => e.stopPropagation()}
            style={{ border: '1px solid #E7E4DC' }}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 p-1 flex items-center justify-center shadow-xs flex-shrink-0">
                  <img src="/logo.png" alt="KisanSetu Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 tracking-tight">
                    KisanSetu Registration
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    Compulsory device registration to access platform
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-emerald-200">
                1-Time Setup
              </span>
            </div>

            {/* Error Banner if any */}
            {serverError && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Role Toggle Tabs */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Select Your Role / अपनी भूमिका चुनें *
              </label>
              <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => { setRegRole('farmer'); setFormErrors({}); }}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${
                    regRole === 'farmer'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <span>🧑‍🌾</span>
                  <span>I am a Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRegRole('buyer'); setFormErrors({}); }}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${
                    regRole === 'buyer'
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <span>🏢</span>
                  <span>I am a Buyer</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regRole === 'farmer' ? (
                <>
                  {/* Farmer Fields */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name (पूरा नाम) *
                    </label>
                    <input
                      type="text"
                      value={farmerForm.fullName}
                      onChange={(e) => setFarmerForm({ ...farmerForm, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Jadhav"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone Number (मोबाइल नंबर) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-stone-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={farmerForm.phone}
                        onChange={(e) => setFarmerForm({ ...farmerForm, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 transition-colors font-mono"
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Village / District (गाँव / ज़िला) *
                      </label>
                      <input
                        type="text"
                        value={farmerForm.villageDistrict}
                        onChange={(e) => setFarmerForm({ ...farmerForm, villageDistrict: e.target.value })}
                        placeholder="e.g. Yeola, Nashik"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 transition-colors"
                      />
                      {formErrors.villageDistrict && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.villageDistrict}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        State (राज्य) *
                      </label>
                      <input
                        type="text"
                        value={farmerForm.state}
                        onChange={(e) => setFarmerForm({ ...farmerForm, state: e.target.value })}
                        placeholder="e.g. Maharashtra"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 transition-colors"
                      />
                      {formErrors.state && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.state}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Primary Crop(s) Grown (प्रमुख फसलें) *
                    </label>
                    <input
                      type="text"
                      value={farmerForm.primaryCrops}
                      onChange={(e) => setFarmerForm({ ...farmerForm, primaryCrops: e.target.value })}
                      placeholder="e.g. Onion, Wheat, Tomato, Soybean"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                    {formErrors.primaryCrops && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.primaryCrops}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Buyer Fields */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name (नाम) *
                    </label>
                    <input
                      type="text"
                      value={buyerForm.fullName}
                      onChange={(e) => setBuyerForm({ ...buyerForm, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone Number (मोबाइल नंबर) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-stone-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={buyerForm.phone}
                        onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors font-mono"
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Business / Company Name (व्यापार / कंपनी का नाम) *
                    </label>
                    <input
                      type="text"
                      value={buyerForm.companyName}
                      onChange={(e) => setBuyerForm({ ...buyerForm, companyName: e.target.value })}
                      placeholder="e.g. FreshMart Agro Foods Pvt Ltd"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    {formErrors.companyName && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.companyName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Business Type (व्यापार का प्रकार) *
                      </label>
                      <select
                        value={buyerForm.businessType}
                        onChange={(e) => setBuyerForm({ ...buyerForm, businessType: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors"
                      >
                        <option value="">Select type...</option>
                        <option value="Wholesaler">Wholesaler (थोक व्यापारी)</option>
                        <option value="Retailer">Retailer (खुदरा विक्रेता)</option>
                        <option value="Processor">Processor (प्रसंस्करणकर्ता)</option>
                        <option value="Exporter">Exporter (निर्यातक)</option>
                        <option value="Commission Agent">Commission Agent (आढ़तिया)</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.businessType && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.businessType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Location (शहर / ज़िला) *
                      </label>
                      <input
                        type="text"
                        value={buyerForm.location}
                        onChange={(e) => setBuyerForm({ ...buyerForm, location: e.target.value })}
                        placeholder="e.g. Vashi, Navi Mumbai"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      {formErrors.location && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.location}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl text-sm font-black text-white transition-all shadow-md flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-stone-400 cursor-not-allowed'
                      : regRole === 'farmer'
                      ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20 hover:shadow-lg'
                      : 'bg-blue-700 hover:bg-blue-800 shadow-blue-900/20 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Registering & Saving...</span>
                    </>
                  ) : (
                    <span>Register & Continue →</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center font-medium">
                🔒 Data is permanently saved. You will not be asked again on this device.
              </p>
            </form>
          </div>
        </div>
      )}

</div>
  );
};

export default CoverPage;

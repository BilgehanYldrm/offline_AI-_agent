import { ASSEMBLY_POINTS } from './data/assemblyPoints';
import { translations } from './data/translations';
import { askQuestion } from './services/assistant';
import { DemoNotice } from './components/DemoNotice';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Package,
  Users,
  ChevronLeft,
  MapPin,
  ShieldCheck,
  HandHeart,
  Heart,
  Info,
  Map as MapIcon,
  Search,
  Truck,
  PhoneCall,
  Globe,
  ClipboardCheck,
  Navigation,
  Flame,
  Activity,
  Waves,
  CloudRain,
  Brain,
  Wind,
  ListChecks,
  ExternalLink,
  CheckCircle2,
  Menu,
  X,
  HelpCircle,
  ChevronDown,
  Mic,
  MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMap, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <>{time.toLocaleTimeString('tr-TR', { hour12: false })}</>;
};

// Mock Assembly Points Data
// --- Translations ---

enum ModuleType {
  EMERGENCY = 'emergency',
  PREPARATION = 'preparation',
  LOGISTICS = 'logistics',
  SUPPORT = 'support',
  NEEDS = 'needs',
  FAQ = 'faq'
}

interface NeedItem {
  id: string;
  title: string;
  category: Category;
  city: string;
  district: string;
  collected: number;
  total: number;
  urgency: 'CRITICAL' | 'MEDIUM' | 'STABLE';
}

interface LogisticsPost {
  id: string;
  from: string;
  to: string;
  vehicle: string;
  departure: string;
  capacity: number;
  contact: string;
}

interface CollectionCenter {
  id: string;
  name: string;
  pos: [number, number];
  address: string;
  city: string;
  status: 'active' | 'busy' | 'full';
  type: string;
  acceptedItems: string[];
  types?: string[];
}

type Category = 'food' | 'shelter' | 'medical' | 'children' | 'hygiene' | 'blood';

interface VolunteerTask {
  id: string;
  title: string;
  category: 'field';
  location: string;
  needed: number;
  current: number;
  urgency: 'CRITICAL' | 'NORMAL';
  types?: string[];
}

const VOLUNTEER_TASKS: VolunteerTask[] = [
  { id: 't1', title: 'Toplama Merkezi Koli Tasnifi', category: 'field', location: 'İstanbul - Ataşehir', needed: 15, current: 12, urgency: 'NORMAL', types: ['earthquake', 'flood', 'fire'] },
  { id: 't3', title: 'Sıfır Kıyafet Ayrıştırma Ekibi', category: 'field', location: 'Ankara - Yenimahalle', needed: 20, current: 5, urgency: 'CRITICAL', types: ['earthquake', 'flood'] },
  { id: 't4', title: 'Yangın Alanı Soğutma Desteği', category: 'field', location: 'Muğla - Marmaris', needed: 10, current: 8, urgency: 'CRITICAL', types: ['fire'] },
  { id: 't5', title: 'Sel Bölgesi Tahliye Yardımı', category: 'field', location: 'Bartın - Merkez', needed: 30, current: 10, urgency: 'CRITICAL', types: ['flood'] },
];

const DONATION_CHANNELS = [
  { name: 'Türk Kızılay', site: 'https://www.kizilay.org.tr/Bagis', icon: HandHeart, color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'Ahbap Derneği', site: 'https://ahbap.org/?srsltid=AfmBOoru9QQgIf9jKnowkelTXZRLZhAsNc4Qi1g9dJsx3ndKhfuke1jS', icon: Heart, color: 'text-green-600', bg: 'bg-green-50' },
];

const NEEDS_DATA: NeedItem[] = [
  { id: '1', title: 'Çocuk Maması', category: 'children', city: 'Hatay', district: 'Defne', collected: 240, total: 500, urgency: 'CRITICAL' },
  { id: '2', title: 'Kışlık Çadır', category: 'shelter', city: 'Kahramanmaraş', district: 'Elbistan', collected: 450, total: 500, urgency: 'CRITICAL' },
  { id: '3', title: 'Hijyen Paketi', category: 'hygiene', city: 'Adıyaman', district: 'Merkez', collected: 1200, total: 2000, urgency: 'MEDIUM' },
  { id: '4', title: 'Battaniye', category: 'shelter', city: 'Gaziantep', district: 'Nurdağı', collected: 800, total: 1000, urgency: 'MEDIUM' },
  { id: '5', title: 'Kuru Gıda Paketi', category: 'food', city: 'Malatya', district: 'Yeşilyurt', collected: 300, total: 1000, urgency: 'CRITICAL' },
  { id: '6', title: 'İlk Yardım Kiti', category: 'medical', city: 'Osmaniye', district: 'Merkez', collected: 150, total: 300, urgency: 'MEDIUM' },
  { id: '7', title: '0 Rh- Kan İhtiyacı', category: 'blood', city: 'Hatay', district: 'Defne Devlet Hst.', collected: 10, total: 50, urgency: 'CRITICAL' },
  { id: '8', title: 'A Rh+ Kan İhtiyacı', category: 'blood', city: 'Kahramanmaraş', district: 'Şehir Hst.', collected: 25, total: 100, urgency: 'CRITICAL' },
];

const LOGISTICS_DATA: LogisticsPost[] = [
  { id: 'l1', from: 'İstanbul', to: 'Hatay', vehicle: 'Tır (20 Ton)', departure: 'Bugün 22:00', capacity: 40, contact: '05xx' },
  { id: 'l2', from: 'Ankara', to: 'Kahramanmaraş', vehicle: 'Kamyonet', departure: 'Yarın 08:00', capacity: 100, contact: '05xx' },
  { id: 'l3', from: 'İzmir', to: 'Adıyaman', vehicle: 'Panelvan', departure: 'Bugün 19:00', capacity: 15, contact: '05xx' },
];

const COLLECTION_CENTERS: CollectionCenter[] = [
  {
    id: 'c1',
    name: 'Yenikapı Etkinlik Alanı Yardım Merkezi',
    pos: [41.0001, 28.9515],
    address: 'Yenikapı Sahil, Fatih/İstanbul',
    city: 'İstanbul',
    status: 'active',
    type: 'Ana Toplama Merkezi',
    acceptedItems: ['Gıda', 'Kıyafet', 'Hijyen'],
    types: ['earthquake', 'flood']
  },
  {
    id: 'c2',
    name: 'Ankara Kent Konseyi Toplama Noktası',
    pos: [39.9208, 32.8541],
    address: 'Gençlik Parkı İçi, Ankara',
    city: 'Ankara',
    status: 'busy',
    type: 'Belediye Merkezi',
    acceptedItems: ['Isıtıcı', 'Battaniye', 'Su'],
    types: ['earthquake', 'flood', 'fire']
  },
  {
    id: 'c3',
    name: 'İzmir Fuar Kültürpark Celal Atik GM',
    pos: [38.4285, 27.1405],
    address: 'Kültürpark, Konak/İzmir',
    city: 'İzmir',
    status: 'active',
    type: 'Lojistik Depo',
    acceptedItems: ['Tıbbi Malzeme', 'Kuru Gıda'],
    types: ['earthquake', 'fire']
  },
  {
    id: 'c4',
    name: 'Muğla Menteşe Spor Salonu Yardım Merkezi',
    pos: [37.2181, 28.3665],
    address: 'Menteşe, Muğla',
    city: 'Muğla',
    status: 'active',
    type: 'Afet Lojistik',
    acceptedItems: ['Su', 'Maske', 'Yanık Kremi'],
    types: ['fire']
  },
  {
    id: 'c5',
    name: 'Kastamonu Bozkurt Spor Salonu',
    pos: [41.9567, 34.0111],
    address: 'Bozkurt, Kastamonu',
    city: 'Kastamonu',
    status: 'active',
    type: 'Acil Yardım',
    acceptedItems: ['Gıda', 'Su', 'Hijyen Paketi'],
    types: ['flood']
  },
  {
    id: 'c6',
    name: 'Antalya Manavgat Gençlik Merkezi',
    pos: [36.7867, 31.4422],
    address: 'Manavgat, Antalya',
    city: 'Antalya',
    status: 'active',
    type: 'Toplama Merkezi',
    acceptedItems: ['Su', 'Gıda', 'Kıyafet'],
    types: ['fire']
  },
  {
    id: 'c7',
    name: 'Bartın Belediye Sosyal Tesisleri',
    pos: [41.6361, 32.3375],
    address: 'Merkez, Bartın',
    city: 'Bartın',
    status: 'busy',
    type: 'Belediye Yardım Noktası',
    acceptedItems: ['Battaniye', 'Çizme', 'Su'],
    types: ['flood']
  },
  {
    id: 'c8',
    name: 'Marmaris Belediye Spor Tesisleri',
    pos: [36.8528, 28.2711],
    address: 'Marmaris, Muğla',
    city: 'Muğla',
    status: 'active',
    type: 'Yangın Koordinasyon',
    acceptedItems: ['Su', 'Buz', 'Ayran'],
    types: ['fire']
  }
];

interface ModuleConfig {
  id: ModuleType;
  icon: any;
  color: string;
  borderColor: string;
  metric: { tr: string, en: string, ar: string };
}

// --- Components ---

const modules: ModuleConfig[] = [
  {
    id: ModuleType.EMERGENCY,
    icon: Activity,
    color: 'bg-[#C62828]',
    borderColor: 'border-[#B71C1C]',
    metric: { tr: 'DEMO: 14 ÖRNEK BÖLGE', en: 'DEMO: 14 SAMPLE ZONES', ar: 'عرض تجريبي: مناطق نموذجية' }
  },
  {
    id: ModuleType.PREPARATION,
    icon: ShieldCheck,
    color: 'bg-[#1A237E]',
    borderColor: 'border-[#0D47A1]',
    metric: { tr: 'DEMO: HAZIRLIK', en: 'DEMO: PREPARATION', ar: 'عرض تجريبي: الاستعداد' }
  },
  {
    id: ModuleType.LOGISTICS,
    icon: Truck,
    color: 'bg-[#E65100]',
    borderColor: 'border-[#BF360C]',
    metric: { tr: 'DEMO: LOJİSTİK', en: 'DEMO: LOGISTICS', ar: 'عرض تجريبي: الخدمات اللوجستية' }
  },
  {
    id: ModuleType.SUPPORT,
    icon: Users,
    color: 'bg-[#00695C]',
    borderColor: 'border-[#004D40]',
    metric: { tr: 'DEMO: GÖNÜLLÜLER', en: 'DEMO: VOLUNTEERS', ar: 'عرض تجريبي: المتطوعون' }
  },
  {
    id: ModuleType.FAQ,
    icon: HelpCircle,
    color: 'bg-[#4527A0]',
    borderColor: 'border-[#311B92]',
    metric: { tr: 'BİLGİ BANKASI', en: 'KNOWLEDGE BASE', ar: 'قاعدة المعرفة' }
  }
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [lang, setLang] = useState<'tr' | 'en' | 'ar'>('tr');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);
  const [isHelpRequestModalOpen, setIsHelpRequestModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const sirenRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Preload siren sound
    const audio = new Audio('/düdüksesi.mp3');
    audio.loop = true;
    sirenRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    // Tarayıcının sesli tanıma desteğini kontrol et (Chrome/Edge/Safari destekler, Firefox desteklemez)
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognitionCtor);
  }, []);

 const t = translations[lang];

  const handleAiSearch = async (overrideQuestion?: string) => {
    const soru = (overrideQuestion ?? aiQuestion).trim();
    if (!soru || aiLoading) return;
    setAiLoading(true);
    setAiAnswer('');

    try {
      const data = await askQuestion(soru);
      setAiAnswer(data.cevap);
    } catch (error) {
      setAiAnswer(t.aiError || 'Yapay zeka sunucusuna bağlanılamadı.');
    } finally {
      setAiLoading(false);
    }
  };

  const speechLangMap: Record<'tr' | 'en' | 'ar', string> = {
    tr: 'tr-TR',
    en: 'en-US',
    ar: 'ar-SA'
  };

  const startVoiceInput = () => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert(
        lang === 'tr'
          ? 'Tarayıcınız sesli arama özelliğini desteklemiyor. Lütfen Chrome veya Edge kullanmayı deneyin.'
          : 'Your browser does not support voice search. Please try Chrome or Edge.'
      );
      return;
    }

    // Zaten dinliyorsa durdur (mikrofon butonuna tekrar basınca toggle davranışı)
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    // Önceden yarım kalmış bir instance varsa temizle (çift başlatmayı önler)
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) { /* yoksay */ }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = speechLangMap[lang];
    // continuous=true: tarayıcı, siz konuşmaya başlayana kadar veya sonuç
    // alınana kadar dinlemeyi anında kesmez. Kısa bir sessizlikte otomatik
    // kapanma (varsayılan continuous=false davranışı) "hemen kapanma"
    // şikayetinin en sık nedenidir.
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      recognitionRef.current = null;
      const errMessages: Record<string, { tr: string; en: string }> = {
        'not-allowed': {
          tr: 'Mikrofon izni reddedildi. Tarayıcı adres çubuğundaki kilit/mikrofon simgesinden izin vermeniz gerekiyor.',
          en: 'Microphone permission denied. Please allow it from the lock/mic icon in the address bar.'
        },
        'no-speech': {
          tr: 'Herhangi bir konuşma algılanmadı. Lütfen tekrar deneyin.',
          en: 'No speech was detected. Please try again.'
        },
        'audio-capture': {
          tr: 'Mikrofon bulunamadı. Bir mikrofon bağlı olduğundan emin olun.',
          en: 'No microphone was found. Please make sure a microphone is connected.'
        },
        'network': {
          tr: 'Ağ hatası nedeniyle sesli tanıma başarısız oldu.',
          en: 'Voice recognition failed due to a network error.'
        }
      };
      const msg = errMessages[event.error];
      console.error('Speech recognition error:', event.error);
      if (msg) {
        alert(lang === 'tr' ? msg.tr : msg.en);
      } else if (event.error !== 'aborted') {
        alert(
          (lang === 'tr' ? 'Sesli tanıma hatası: ' : 'Voice recognition error: ') + event.error
        );
      }
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAiQuestion(transcript);
      recognition.stop(); // sonucu aldık, dinlemeyi manuel olarak kapat
      // Konuşma tanınır tanınmaz otomatik olarak soruyu sor
      handleAiSearch(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const shareLocation = () => {
    setLocationStatus('requesting');

    // Demonstration only: no location is transmitted.
    setTimeout(() => {
      setLocationStatus('success');
      setTimeout(() => setLocationStatus('idle'), 3000);
    }, 1500);
  };

  const toggleSiren = () => {
    if (sirenRef.current) {
      if (isSirenPlaying) {
        sirenRef.current.pause();
        sirenRef.current.currentTime = 0;
        setIsSirenPlaying(false);
      } else {
        sirenRef.current.play().then(() => setIsSirenPlaying(true)).catch(() => setIsSirenPlaying(false));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[#1c1c1c] overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(#1a237e 0.5px, transparent 0.5px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to right, #000 0.5px, transparent 0.5px) 0 0 / 100px 100%, linear-gradient(to bottom, #000 0.5px, transparent 0.5px) 0 0 / 100% 100px',
          opacity: 0.015
        }}
      />
      {/* Logo Watermark Background */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.15]">
        <img src="/logo.png" alt="" className="w-full max-w-3xl object-contain" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-4 min-w-0">
          <div className="relative shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 sm:w-20 sm:h-20 object-contain brightness-90 contrast-125"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xs sm:text-sm tracking-wide text-[#1a237e]"><span className="sm:hidden">EL ELE</span><span className="hidden sm:inline">{t.appName}</span></h1>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                <ShieldCheck size={10} className="text-green-600" /> PORTFOLIO DEMO
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 px-6 border-x border-gray-100 mx-6 h-full">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Sistem Saati</span>
            <span className="text-sm font-mono font-bold text-[#1a237e]">
              <DigitalClock />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 relative">
          <div className="relative">
            <button
              aria-label={t.contact}
              onClick={() => setIsContactOpen(!isContactOpen)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-lg font-black text-[10px] transition-all border-2 uppercase tracking-widest ${isContactOpen
                  ? 'bg-red-700 text-white border-red-800 shadow-inner'
                  : 'bg-white text-red-700 border-red-700 hover:bg-red-50 hover:shadow-md'
                }`}
            >
              {isContactOpen ? <X size={14} /> : <PhoneCall size={14} />}
              <span className="hidden sm:inline">{t.contact}</span>
            </button>

            {/* Contact Dropdown */}
            <AnimatePresence>
              {isContactOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsContactOpen(false)}
                    className="fixed inset-0 z-[-1]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                  >
                    <div className="p-4 border-b border-gray-50">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.contactTitle}</h4>
                    </div>
                    <div className="p-2 space-y-1">
                      <a
                        href="https://www.afad.gov.tr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <PhoneCall size={14} />
                          </div>
                          <span className="text-xs font-bold">{t.contactAfad}</span>
                        </div>
                        <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
                      </a>

                      <a
                        href="https://www.kizilay.org.tr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <HandHeart size={14} />
                          </div>
                          <span className="text-xs font-bold">{t.contactKizilay}</span>
                        </div>
                        <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
                      </a>

                      <a
                        href="http://www.koeri.boun.edu.tr/scripts/lst0.asp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Activity size={14} />
                          </div>
                          <span className="text-xs font-bold">{t.contactKandilli}</span>
                        </div>
                        <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
                      </a>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Language Toggle */}
          <button
            aria-label="Change language"
            onClick={() => setLang(lang === 'tr' ? 'en' : lang === 'en' ? 'ar' : 'tr')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all border border-gray-200"
          >
            <Globe size={16} />
            <span className={lang === 'tr' ? 'text-blue-600' : ''}>TR</span>
            <span className="text-gray-300">/</span>
            <span className={lang === 'en' ? 'text-blue-600' : ''}>ENG</span>
            <span className="text-gray-300">/</span>
            <span className={lang === 'ar' ? 'text-blue-600' : ''}>العربية</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-10 px-4 sm:px-6 max-w-5xl mx-auto">
        <DemoNotice lang={lang} />
        <AnimatePresence mode="wait">
          {!activeModule ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.filter(m => m.id !== ModuleType.FAQ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`relative h-[220px] md:h-[280px] rounded-2xl p-6 md:p-8 text-left transition-all hover:translate-y-[-4px] active:scale-[0.98] shadow-lg group overflow-hidden border-2 ${m.borderColor} ${m.color}`}
                  >
                    {/* Technical decorative lines */}
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-16 h-16 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-16 h-16 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 blur-[80px] group-hover:bg-white/10 transition-colors" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/20 group-hover:scale-110 transition-transform">
                          <m.icon size={32} className="text-white" />
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`px-2 py-1 rounded text-[9px] font-black tracking-widest text-white/90 border border-white/20 bg-black/10 flex items-center gap-2`}>
                            {m.id === ModuleType.EMERGENCY && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" />}
                            {m.metric[lang]}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h2 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight uppercase tracking-wide">
                          {t.modules[m.id].title}
                        </h2>
                        <div className="w-12 h-1 bg-white/30 rounded-full mb-3 group-hover:w-24 transition-all duration-500" />
                        <p className="text-white/70 text-xs sm:text-sm font-bold uppercase tracking-wider">
                          {t.modules[m.id].subtitle}
                        </p>
                      </div>

                      <div className="flex justify-end transition-transform group-hover:translate-x-1">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white transition-all">
                          <ChevronLeft className="rotate-180" size={20} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* FAQ Wide Button */}
              {modules.find(m => m.id === ModuleType.FAQ) && (
                <button
                  onClick={() => setActiveModule(ModuleType.FAQ)}
                  className="w-full bg-[#311B92] border-2 border-[#1A237E] rounded-2xl p-6 text-left flex items-center justify-between transition-all hover:translate-y-[-2px] shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }} />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-black text-white uppercase tracking-wider">
                          {t.modules[ModuleType.FAQ].title}
                        </h2>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-white/10 rounded border border-white/10 text-white/60">
                          {modules.find(m => m.id === ModuleType.FAQ)?.metric[lang]}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                        {t.modules[ModuleType.FAQ].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-white/30 group-hover:text-white transition-all group-hover:translate-x-1">
                    <ChevronLeft className="rotate-180" size={24} strokeWidth={3} />
                  </div>
                </button>
              )}
            </motion.div>
          ) : (
            <ModuleView
              type={activeModule}
              onBack={() => setActiveModule(null)}
              lang={lang}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button for Location */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {locationStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-lg shadow-xl text-[10px] font-black uppercase tracking-widest pointer-events-auto border-2
                ${locationStatus === 'requesting' ? 'bg-yellow-600 border-yellow-700 text-white' :
                  locationStatus === 'success' ? 'bg-green-600 border-green-700 text-white' : 'bg-red-600 border-red-700 text-white'}`}
            >
              {locationStatus === 'requesting' ? t.locationRequesting :
                locationStatus === 'success' ? t.locationSuccess : t.locationError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex flex-col gap-3 pointer-events-auto items-center">
          <AnimatePresence>
            {isEmergencyMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex flex-col gap-3 mb-2"
              >
                {/* Help Request Button */}
                <button
                  onClick={() => {
                    setIsEmergencyMenuOpen(false);
                    setIsHelpRequestModalOpen(true);
                  }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl transition-all active:scale-95 text-white font-black text-[10px] tracking-widest uppercase border-2 border-white/20 bg-blue-600 hover:bg-blue-700`}
                >
                  <HandHeart size={18} />
                  {lang === 'tr' ? 'Yardım Talebi Oluştur' : 'Create Help Request'}
                </button>
                {/* Siren Button */}
                <button
                  onClick={toggleSiren}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl transition-all active:scale-95 text-white font-black text-[10px] tracking-widest uppercase border-2 border-white/20
                    ${isSirenPlaying ? 'bg-orange-600 animate-pulse' : 'bg-[#1a2c5b] hover:bg-[#111f42]'}`}
                >
                  {isSirenPlaying ? <Activity size={18} /> : <Wind size={18} />}
                  {isSirenPlaying ? (lang === 'tr' ? 'Yardım Sesini Durdur' : 'Stop Sound') : (lang === 'tr' ? 'Yardım Sesi' : 'Help Sound')}
                </button>

                {/* Location Button */}
                <button
                  onClick={() => {
                    shareLocation();
                    setIsEmergencyMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl transition-all active:scale-95 text-white font-black text-[10px] tracking-widest uppercase border-2 border-white/20
                    ${locationStatus === 'requesting' ? 'bg-yellow-600' :
                      locationStatus === 'success' ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {locationStatus === 'success' ? <CheckCircle2 size={18} /> : <MapPin size={18} />}
                  {locationStatus === 'success' ? (lang === 'tr' ? 'DEMO: GÖNDERİLMEDİ' : 'DEMO: NOT SENT') : (lang === 'tr' ? 'Konum Gönder' : 'Send Location')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Emergency Button */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-[-4px] border-2 border-red-600/30 rounded-full animate-[pulse_2s_infinite]" />
            <button
              onClick={() => setIsEmergencyMenuOpen(!isEmergencyMenuOpen)}
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-90 relative border-4 border-white text-center p-2
                ${isEmergencyMenuOpen ? 'bg-red-800 rotate-45' : 'bg-red-600 hover:bg-red-700'}`}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
              <div className="mb-1 relative z-10 transition-transform duration-300">
                {isEmergencyMenuOpen ? <X size={28} className="text-white" /> : <ShieldCheck size={28} className="text-white" />}
              </div>
              {!isEmergencyMenuOpen && (
                <span className="text-white text-[8px] font-black leading-tight uppercase tracking-tighter relative z-10">
                  {t.reportInstantLocation}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Asistan Butonu (Sol Alt) */}
      <div className="fixed bottom-24 left-6 z-50 pointer-events-none">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-full shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest border-4 border-white transition-all active:scale-95"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30" />
            <Brain size={22} className="relative z-10" />
          </div>
          {lang === 'tr' ? 'Asistan' : lang === 'ar' ? 'المساعد' : 'Assistant'}
        </button>
      </div>

      {/* Asistan Modal */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white rounded-[40px] shadow-2xl z-[101] overflow-hidden border border-gray-100 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                      {lang === 'tr' ? 'Afet Asistanı' : lang === 'ar' ? 'مساعد الطوارئ' : 'Disaster Assistant'}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {lang === 'tr' ? 'Yerel Doküman Araması • Türkçe' : 'Local Document Search • Turkish'}
                    </p>
                    {/* ⚙️ ANLIK DURUM ROZETİ GÖSTERGESİ */}
                    <div className="text-[10px] font-black uppercase tracking-wider mt-1">
                      <span>{lang === 'tr' ? 'Yerel API bağlantısı gerektirir' : 'Requires a running local API'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  aria-label="Assistant question"
                  maxLength={1000}
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  placeholder={isListening ? (lang === 'tr' ? 'Dinleniyor...' : lang === 'ar' ? 'الاستماع...' : 'Listening...') : t.aiPlaceholder}
                  className="flex-1 p-4 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
                {voiceSupported && (
                  <button
                    onClick={startVoiceInput}
                    title={lang === 'tr' ? 'Sesli Arama' : lang === 'ar' ? 'البحث الصوتي' : 'Voice Search'}
                    className={`relative px-4 py-4 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center
                      ${isListening ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {isListening && (
                      <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-40" />
                    )}
                    <span className="relative z-10">
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => handleAiSearch()}
                  disabled={aiLoading}
                  className="px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase shadow-md hover:bg-emerald-700 transition-all"
                >
                  {aiLoading ? '...' : (lang === 'tr' ? 'SOR' : lang === 'ar' ? 'اسأل' : 'ASK')}
                </button>
              </div>

              {isListening && (
                <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {lang === 'tr' ? 'Mikrofon dinliyor, konuşabilirsiniz...' : lang === 'ar' ? 'الميكروفون يستمع، يمكنك التحدث...' : 'Microphone is listening, you can speak...'}
                </div>
              )}

              {(aiLoading || aiAnswer) && (
                <div role="status" aria-live="polite" className="mt-4 p-4 bg-gray-50 rounded-2xl border-l-4 border-emerald-600 max-h-[300px] overflow-y-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    {lang === 'tr' ? 'Doküman sonucu' : 'Document result'}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                    {aiLoading ? t.aiThinking : aiAnswer}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!activeModule && (
        <div className="h-12" /> // Spacing for fab
      )}
      {!activeModule && (
        <div className="h-12" /> // Spacing for fab
      )}
      <AnimatePresence>
        {isHelpRequestModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpRequestModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[40px] shadow-2xl z-[101] overflow-hidden border border-gray-100 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <HandHeart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Yardım Talebi</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">İhtiyacınızı Bize Bildirin</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsHelpRequestModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert(lang === 'tr' ? 'Demo: Yardım talebi gönderilmedi. Bu uygulama acil yardım ekiplerine bağlı değildir.' : 'Demo: No help request was sent. This app is not connected to emergency services.'); setIsHelpRequestModalOpen(false); }}>
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">İhtiyaç Türü</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Arama Kurtarma', 'Gıda & Su', 'Barınma / Çadır', 'Tıbbi Destek'].map((type) => (
                      <label key={type} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-blue-500 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-700">
                        <input type="radio" name="needType" required className="accent-blue-600" />
                        <span className="text-xs font-bold">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kişi Sayısı</label>
                    <input type="number" min="1" required placeholder="Örn: 4" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">İletişim (Tel)</label>
                    <input type="tel" required placeholder="05XX XXX XX XX" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tam Adres / Konum Detayı</label>
                  <input type="text" required placeholder="Mahalle, sokak, bina no, kat bilgisi..." className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.01] active:scale-95 transition-all text-sm uppercase">
                  Talebi Gönder
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Detail View Component ---

function ModuleView({ type, onBack, lang }: { type: ModuleType, onBack: () => void, lang: 'tr' | 'en' | 'ar' }) {
  const t = translations[lang];
  const tm = t.modules[type];
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);
  const [simQuestionIndex, setSimQuestionIndex] = useState(0);
  const [simScore, setSimScore] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const renderContent = () => {
    switch (type) {
      case ModuleType.EMERGENCY:
        const e = t.modules.emergency;

        if (!selectedDisaster) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-20"
            >
              {[
                { id: 'earthquake', title: t.earthquake, icon: Activity, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
                { id: 'flood', title: t.flood, icon: Waves, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
                { id: 'fire', title: t.fire, icon: Flame, color: 'bg-orange-500', shadow: 'shadow-orange-500/20' }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisaster(d.id)}
                  className="flex flex-col items-center justify-center p-8 bg-white rounded-[40px] border border-gray-100 shadow-xl hover:scale-[1.02] active:scale-95 transition-all group gap-4 text-center h-[200px]"
                >
                  <div className={`w-16 h-16 ${d.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${d.shadow}`}>
                    <d.icon size={32} />
                  </div>
                  <span className="font-black text-gray-900 group-hover:text-red-500 transition-colors uppercase tracking-tight text-sm">
                    {d.title}
                  </span>
                </button>
              ))}
            </motion.div>
          );
        }

        return (
          <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {e.liveTrack} • <span className="text-red-500 uppercase tracking-tighter">{t[selectedDisaster as keyof typeof t] as string}</span>
              </div>
              <button
                onClick={() => setSelectedDisaster(null)}
                className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-900 transition-colors"
              >
                {lang === 'tr' ? ' Türü Değiştir' : 'Change Type'}
              </button>
            </div>

            <div className="bg-gray-100 aspect-video rounded-3xl relative overflow-hidden border border-gray-200">
              <EmergencyMap lang={lang} disasterType={selectedDisaster} />
            </div>


            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-red-500" /> {e.lastMinute}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="pb-2 border-bottom border-gray-50">
                  <span className="text-red-500 font-bold block mb-1">14:20</span>
                  {selectedDisaster === 'earthquake' ? e.news1 :
                    selectedDisaster === 'flood' ? (lang === 'tr' ? 'Batı Karadeniz için yoğun yağış uyarısı yapıldı.' : 'Heavy rain warning for Western Black Sea.') :
                      (lang === 'tr' ? 'Ege bölgesinde orman yangını tehlikesi %80 seviyesinde.' : 'Wildfire risk in Aegean region is at 80%.')}
                </li>
                <li className="text-gray-500">
                  {selectedDisaster === 'earthquake' ? e.news2 :
                    selectedDisaster === 'flood' ? (lang === 'tr' ? 'Sel anında yüksek bölgelere çıkmayı ihmal etmeyin.' : 'Do not forget to climb to high areas during a flood.') :
                      (lang === 'tr' ? 'Duman solumamak için ağzınızı ıslak bezle kapatın.' : 'Cover your mouth with a wet cloth to avoid smoke inhalation.')}
                </li>
              </ul>
            </div>

            {selectedDisaster === 'earthquake' && (
              <a
                href="http://www.koeri.boun.edu.tr/sismo/2/son-depremler/harita-uzerinde/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group shadow-sm border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-200 text-blue-700 flex items-center justify-center">
                    <MapIcon size={20} />
                  </div>
                  <div>
                    <div className="font-black">Kandilli Rasathanesi Canlı Deprem Haritası</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      {lang === 'tr' ? 'Harita Üzerinde İncele' : 'View on Map'}
                    </div>
                  </div>
                </div>
                <ExternalLink size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        );
      case ModuleType.PREPARATION:
        const p = t.modules.preparation;

        if (activeSection === 'videos') {
          const simData = p.generalSimulation;
          const currentQ = simData[simQuestionIndex];

          const handleAnswer = (index: number) => {
            if (selectedOption !== null) return; // prevent multiple clicks
            setSelectedOption(index);
          };

          const handleNext = () => {
            if (selectedOption !== null && currentQ.options[selectedOption].correct) {
              setSimScore(s => s + 1);
            }
            setSelectedOption(null);
            if (simQuestionIndex + 1 < simData.length) {
              setSimQuestionIndex(simQuestionIndex + 1);
            } else {
              setSimCompleted(true);
            }
          };

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a2c5b] transition-colors"
              >
                <ChevronLeft size={16} /> {t.back}
              </button>
              <div className="p-5 sm:p-8 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#1a2c5b]/10 text-[#1a2c5b] flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{p.videoTitle}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="aspect-video rounded-3xl overflow-hidden shadow-sm bg-gray-100">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/K0keerAalYE" title="AFAD Eğitim Videosu 1" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden shadow-sm bg-gray-100">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/4Xc2XJX3cKU" title="AFAD Eğitim Videosu 2" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                      <Brain size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black">{p.simulationTitle}</h3>
                      {!simCompleted && <p className="text-sm font-bold text-gray-400">Soru {simQuestionIndex + 1} / {simData.length}</p>}
                    </div>
                  </div>

                  {!simCompleted ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-lg font-bold text-gray-800">{currentQ.scenario}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {currentQ.options.map((opt: any, i: number) => {
                          let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-colors font-medium ";
                          if (selectedOption === null) {
                            btnClass += "border-gray-100 hover:border-orange-500 hover:bg-orange-50 text-gray-700";
                          } else {
                            if (opt.correct) {
                              btnClass += "border-green-500 bg-green-50 text-green-700";
                            } else if (selectedOption === i) {
                              btnClass += "border-red-500 bg-red-50 text-red-700";
                            } else {
                              btnClass += "border-gray-100 text-gray-400 opacity-50";
                            }
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handleAnswer(i)}
                              disabled={selectedOption !== null}
                              className={btnClass}
                            >
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                      {selectedOption !== null && (
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-[#1a2c5b] text-white rounded-2xl font-bold hover:bg-[#0d162e] transition-colors inline-flex items-center gap-2 shadow-lg"
                          >
                            {lang === 'tr' ? 'Sıradaki Soru' : 'Next Question'}
                            <ChevronLeft size={16} className="rotate-180" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-6">
                      <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${simScore >= 10 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                        {simScore >= 10 ? <ShieldCheck size={48} /> : <AlertTriangle size={48} />}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black mb-2">{simScore >= 10 ? (lang === 'tr' ? 'Tebrikler!' : 'Congratulations!') : (lang === 'tr' ? 'Uyarı' : 'Warning')}</h4>
                        <p className="text-lg text-gray-600 mb-4">
                          {lang === 'tr' ? `15 sorudan ${simScore} tanesini doğru bildiniz.` : `You answered ${simScore} out of 15 questions correctly.`}
                        </p>
                        {simScore < 10 && (
                          <div className="p-4 bg-red-50 text-red-700 rounded-2xl font-bold border border-red-100">
                            {lang === 'tr' ? 'Doğru sayınız yetersiz. Lütfen eğitim videolarını daha dikkatli izleyiniz.' : 'Your score is insufficient. Please watch the training videos more carefully.'}
                          </div>
                        )}
                        {simScore >= 10 && (
                          <div className="p-4 bg-green-50 text-green-700 rounded-2xl font-bold border border-green-100">
                            {lang === 'tr' ? 'Afet farkındalığınız yüksek. Bilgilerinizi taze tutmaya devam edin!' : 'You have high disaster awareness. Keep your knowledge fresh!'}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSimQuestionIndex(0);
                          setSimScore(0);
                          setSimCompleted(false);
                          setSelectedOption(null);
                        }}
                        className="mt-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
                      >
                        <Brain size={18} />
                        {lang === 'tr' ? 'Tekrar Çöz' : 'Retake Quiz'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        }

        if (activeSection === 'kit') {
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a2c5b] transition-colors"
              >
                <ChevronLeft size={16} /> {t.back}
              </button>
              <div className="p-5 sm:p-8 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">
                    <Package size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{p.sections.find((s: any) => s.id === 'kit').title}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.kitChecklist.map((item: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all border border-transparent hover:border-gray-200 group">
                      <input type="checkbox" className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg accent-gray-700 transition-transform group-active:scale-90" />
                      <span className="text-xs sm:text-sm font-bold text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        }

        if (activeSection === 'firstaid') {
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a2c5b] transition-colors"
              >
                <ChevronLeft size={16} /> {t.back}
              </button>
              <div className="p-5 sm:p-8 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{p.sections.find((s: any) => s.id === 'firstaid').title}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Stabilize */}
                  <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden shadow-sm flex items-center justify-center p-4 group-hover:scale-[1.02] transition-transform">
                      <img src="/firstaid/stabilize.png" alt="Baş og Omurga Sabitleme" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="font-black text-gray-909 mb-2">{lang === 'tr' ? 'Baş ve Omurga Sabitleme' : 'Head and Spine Stabilization'}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {lang === 'tr' ? 'Travma durumunda kazazedenin başını ve boynunu hareket ettirmeyerek omurga hasarını önleyin.' : 'Prevent spine damage by keeping the victim\'s head and neck still during trauma.'}
                    </p>
                  </div>

                  {/* Burn */}
                  <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden shadow-sm flex items-center justify-center p-4 group-hover:scale-[1.02] transition-transform">
                      <img src="/firstaid/burn.png" alt="Yanığa Müdahale" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">{lang === 'tr' ? 'Yanığa İlk Müdahale' : 'First Aid for Burns'}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {lang === 'tr' ? 'Yanık bölgesini en az 10-15 dakika boyunca serin, akan suyun altında tutarak sıcaklığı düşürün.' : 'Hold the burned area under cool, running water for at least 10-15 minutes to reduce heat.'}
                    </p>
                  </div>

                  {/* CPR */}
                  <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden shadow-sm flex items-center justify-center p-4 group-hover:scale-[1.02] transition-transform">
                      <img src="/firstaid/cpr.png" alt="Kalp Masajı (CPR)" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">{lang === 'tr' ? 'Kalp Masajı (CPR)' : 'CPR'}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {lang === 'tr' ? 'Eğitimliyseniz, bilinci kapalı ve nefes almayan kişiye göğüs kafesi esneyecek şekilde masaj uygulayın.' : 'If trained, perform chest compressions on an unresponsive and non-breathing person.'}
                    </p>
                  </div>

                  {/* Bandage */}
                  <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden shadow-sm flex items-center justify-center p-4 group-hover:scale-[1.02] transition-transform">
                      <img src="/firstaid/bandage.png" alt="Yara Bandajlama" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">{lang === 'tr' ? 'Yara Bandajlama' : 'Wound Bandaging'}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {lang === 'tr' ? 'Kanamayı durdurmak için temiz bir bez veya sargı beziyle yara üzerine doğrudan baskı yapın.' : 'Apply direct pressure on the wound with a clean cloth or bandage to stop bleeding.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        if (activeSection === 'during_disaster') {
          if (!selectedDisaster) {
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <button
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a2c5b] transition-colors"
                >
                  <ChevronLeft size={16} /> {t.back}
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-20">
                  {[
                    { id: 'earthquake', title: t.earthquake, icon: Activity, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
                    { id: 'flood', title: t.flood, icon: Waves, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
                    { id: 'fire', title: t.fire, icon: Flame, color: 'bg-orange-500', shadow: 'shadow-orange-500/20' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDisaster(d.id)}
                      className="flex flex-col items-center justify-center p-8 bg-white rounded-[40px] border border-gray-100 shadow-xl hover:scale-[1.02] active:scale-95 transition-all group gap-4 text-center h-[200px]"
                    >
                      <div className={`w-16 h-16 ${d.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${d.shadow}`}>
                        <d.icon size={32} />
                      </div>
                      <span className="font-black text-gray-900 group-hover:text-red-500 transition-colors uppercase tracking-tight text-sm">
                        {d.title}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button
                onClick={() => setSelectedDisaster(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1a2c5b] transition-colors"
              >
                <ChevronLeft size={16} /> {t.back}
              </button>
              <div className="p-5 sm:p-8 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center
                    ${selectedDisaster === 'earthquake' ? 'bg-red-50 text-red-500' : selectedDisaster === 'flood' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                    {selectedDisaster === 'earthquake' ? <Activity size={24} /> : selectedDisaster === 'flood' ? <Waves size={24} /> : <Flame size={24} />}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{t[selectedDisaster as keyof typeof t] as string} {lang === 'tr' ? 'Anında Yapılması Gerekenler' : 'Instructions'}</h3>
                </div>

                <div className="w-full bg-gray-50 rounded-3xl p-4 border border-gray-100">
                  <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                    {selectedDisaster === 'earthquake' && <img src="/instructions/earthquake.jpg" alt="Deprem anında yapılması gerekenler" className="w-full h-auto object-contain rounded-xl" />}
                    {selectedDisaster === 'fire' && <img src="/instructions/fire.jpg" alt="Yangın anında yapılması gerekenler" className="w-full h-auto object-contain rounded-xl" />}
                    {selectedDisaster === 'flood' && <img src="/instructions/flood.jpg" alt="Sel anında yapılması gerekenler" className="w-full h-auto object-contain rounded-xl" />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        if (activeSection === 'building') {
          return (
            <BuildingDetailView
              lang={lang}
              onBack={() => setActiveSection(null)}
            />
          );
        }

        if (activeSection === 'fire') {
          return (
            <FireDetailView
              lang={lang}
              onBack={() => setActiveSection(null)}
            />
          );
        }

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {p.sections.map((section: any) => (
                <button
                  key={section.id}
                  onClick={() => {
                    if (section.id === 'kit') setActiveSection('kit');
                    if (section.id === 'firstaid') setActiveSection('firstaid');
                    if (section.id === 'during_disaster') {
                      setActiveSection('during_disaster');
                      setSelectedDisaster(null);
                    }
                    if (section.id === 'building') setActiveSection('building');
                    if (section.id === 'fire') setActiveSection('fire');
                  }}
                  className="flex flex-col p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-left hover:scale-[1.01] active:scale-95 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center mb-4 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <h4 className="font-bold text-lg mb-1 Tactics">{section.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500">{section.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSimQuestionIndex(0);
                setSimScore(0);
                setSimCompleted(false);
                setSelectedOption(null);
                setActiveSection('videos');
              }}
              className="w-full text-left p-6 bg-[#1a2c5b] text-white rounded-3xl flex items-center justify-between overflow-hidden relative group hover:scale-[1.01] active:scale-95 transition-all shadow-sm mt-6"
            >
              <div className="relative z-10">
                <h4 className="font-bold mb-1">{p.videoTitle} & {p.simulationTitle}</h4>
                <p className="text-xs text-white/50">{lang === 'tr' ? 'Videoları izleyin ve kendinizi test edin.' : 'Watch videos and test yourself.'}</p>
              </div>
              <div className="flex gap-2">
                <BookOpen size={32} className="text-white/20 transition-transform group-hover:-rotate-12" />
                <Brain size={32} className="text-white/20 transition-transform group-hover:rotate-12" />
              </div>
            </button>
          </div>
        );
      case ModuleType.LOGISTICS:
        return (
          <div className="space-y-12">
            <NeedsDashboard lang={lang} />
            <div className="border-t border-gray-100 pt-12">
              <LogisticsNetwork lang={lang} />
            </div>
          </div>
        );
      case ModuleType.SUPPORT:
        if (!selectedDisaster) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-20"
            >
              {[
                { id: 'earthquake', title: t.earthquake, icon: Activity, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
                { id: 'flood', title: t.flood, icon: Waves, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
                { id: 'fire', title: t.fire, icon: Flame, color: 'bg-orange-500', shadow: 'shadow-orange-500/20' }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisaster(d.id)}
                  className="flex flex-col items-center justify-center p-8 bg-white rounded-[40px] border border-gray-100 shadow-xl hover:scale-[1.02] active:scale-95 transition-all group gap-4 text-center h-[200px]"
                >
                  <div className={`w-16 h-16 ${d.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${d.shadow}`}>
                    <d.icon size={32} />
                  </div>
                  <span className="font-black text-gray-900 group-hover:text-red-500 transition-colors uppercase tracking-tight text-sm">
                    {d.title}
                  </span>
                </button>
              ))}
            </motion.div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="bg-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedDisaster === 'earthquake' ? 'bg-red-500' : selectedDisaster === 'flood' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                {t[selectedDisaster as keyof typeof t] as string} {lang === 'tr' ? 'DESTEK FORMU' : 'SUPPORT FORM'}
              </div>
              <button
                onClick={() => setSelectedDisaster(null)}
                className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-900 transition-colors"
              >
                {lang === 'tr' ? ' Türü Değiştir' : 'Change Type'}
              </button>
            </div>
            <VolunteerDashboard lang={lang} disasterType={selectedDisaster} />
          </div>
        );
      case ModuleType.FAQ:
        return <FAQModule lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{tm.title}</h2>
          <p className="text-gray-500 text-sm font-medium">{tm.subtitle}</p>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </motion.div>
  );
}

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function EmergencyMap({ lang, disasterType }: { lang: 'tr' | 'en' | 'ar', disasterType?: string | null }) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewPos, setViewPos] = useState<[number, number] | null>(null);
  const t = translations[lang];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        setViewPos(p);
      });
    }
  }, []);

  const filteredPoints = searchTerm.trim() ? ASSEMBLY_POINTS.filter(p =>
    (p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!disasterType || (p.types as string[])?.includes(disasterType) || (!p.types && disasterType === 'earthquake'))
  ) : [];

  const disasterConfig = {
    earthquake: { color: '#ef4444', label: lang === 'tr' ? 'TOPLANMA ALANI' : 'ASSEMBLY AREA', icon: Activity },
    flood: { color: '#3b82f6', label: lang === 'tr' ? 'GÜVENLİ YÜKSEK BÖLGE' : 'SAFE HIGH GROUND', icon: Waves },
    fire: { color: '#f97316', label: lang === 'tr' ? 'YANGIN KAÇIŞ BÖLGESİ' : 'FIRE ESCAPE ZONE', icon: Flame }
  };

  const currentTheme = disasterType ? disasterConfig[disasterType as keyof typeof disasterConfig] : disasterConfig.earthquake;

  const filteredCenters = searchTerm.trim() ? COLLECTION_CENTERS.filter(c =>
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!disasterType || (c.types as string[])?.includes(disasterType) || (!c.types && disasterType === 'earthquake'))
  ) : [];

  // Center map on search results if available
  useEffect(() => {
    if (searchTerm.trim() && filteredPoints.length > 0) {
      setViewPos(filteredPoints[0].pos);
    } else if (searchTerm.trim() && filteredCenters.length > 0) {
      setViewPos(filteredCenters[0].pos);
    }
  }, [searchTerm, filteredPoints.length, filteredCenters.length]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search Header Overlay (Float over Map) */}
      <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] rounded-[32px] sm:rounded-[40px] overflow-hidden border border-gray-200 shadow-sm">
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-[2000] flex flex-col gap-2">
          <div className="relative flex shadow-2xl rounded-2xl overflow-hidden group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors z-10">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder={lang === 'tr' ? "Şehir ismi arayın..." : "Search for a city..."}
              className={`pl-11 pr-12 py-4 rounded-2xl text-[11px] sm:text-xs font-black border-none outline-none focus:ring-4 focus:ring-red-500/20 w-full sm:w-80 transition-all shadow-lg text-gray-900 ${searchTerm.trim()
                  ? 'bg-white/20 backdrop-blur-md sm:bg-white/98 sm:backdrop-blur-md'
                  : 'bg-white/98 backdrop-blur-md'
                }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <MapContainer
          center={viewPos || [39.0, 35.0]}
          zoom={searchTerm.trim() ? 12 : (userPos ? 15 : 6)}
          className="w-full h-full z-0"
          scrollWheelZoom={true}
          maxBounds={[[34.0, 25.0], [43.0, 46.0]]}
          minZoom={5}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userPos && (
            <Marker position={userPos}>
              <Popup>
                <span className="text-[10px] font-bold">{lang === 'tr' ? 'Mevcut Konumunuz' : 'Your Location'}</span>
              </Popup>
            </Marker>
          )}

          {viewPos && <MapCenter center={viewPos} />}

          {searchTerm.trim() && filteredPoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.pos}
              radius={8}
              pathOptions={{
                fillColor: currentTheme.color,
                color: '#fff',
                weight: 2,
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <div className="p-1 text-center min-w-[120px]">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${currentTheme.color}20`, color: currentTheme.color }}>
                    <currentTheme.icon size={16} />
                  </div>
                  <h5 className="font-black text-[10px] text-gray-900 mb-1 uppercase tracking-tight">{point.city}</h5>
                  <p className="text-[8px] font-bold text-gray-500 uppercase">{point.district}</p>
                  <p className="text-[7px] text-gray-400 mt-1">{point.address}</p>
                  <div className="mt-2 pt-2 border-t border-gray-100 text-[8px] font-black uppercase" style={{ color: currentTheme.color }}>
                    {currentTheme.label}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {searchTerm.trim() && filteredCenters.map((center) => (
            <CircleMarker
              key={center.id}
              center={center.pos}
              radius={10}
              pathOptions={{
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 2,
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <div className="p-1 text-center min-w-[180px]">
                  <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Truck size={16} />
                  </div>
                  <h5 className="font-black text-[10px] text-gray-900 mb-1 uppercase leading-tight">{center.name}</h5>
                  <p className="text-[7px] text-gray-400 mt-0.5">{center.address}</p>
                  <div className="mt-2 text-left space-y-1">
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Kabul Edilenler:</div>
                    <div className="flex flex-wrap gap-1">
                      {center.acceptedItems.map(item => (
                        <span key={item} className="text-[7px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-bold">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`mt-2 pt-2 border-t border-gray-100 text-[8px] font-black uppercase
                    ${center.status === 'active' ? 'text-green-600' : center.status === 'busy' ? 'text-orange-500' : 'text-red-600'}`}>
                    Durum: {center.status === 'active' ? 'Açık' : center.status === 'busy' ? 'Yoğun' : 'Kapasite Dolu'}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="hidden sm:block mt-8 space-y-4">
        <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
          <Info size={18} className="text-blue-500" />
          {lang === 'tr' ? 'Toplanma Alanları ve Yardım Merkezleri' : 'Assembly Areas and Help Centers'}
        </h4>

        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {!searchTerm.trim() ? (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search size={24} className="text-gray-300" />
                </div>
                <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  {lang === 'tr' ? 'Sonuç görmek için şehir adı yazın' : 'Type a city name to see results'}
                </h5>
                <p className="text-[10px] font-bold text-gray-400 mt-2">Örn: İstanbul, Ankara, Hatay...</p>
              </div>
            ) : (
              <>
                {filteredPoints.map((point) => (
                  <LocationCard key={point.id} point={point} lang={lang} onShow={() => setViewPos(point.pos)} />
                ))}
                {filteredCenters.map((center) => (
                  <CenterCard key={center.id} center={center} lang={lang} onShow={() => setViewPos(center.pos)} />
                ))}
                {filteredPoints.length === 0 && filteredCenters.length === 0 && (
                  <div className="col-span-full py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-xs font-bold text-gray-400">{lang === 'tr' ? 'Eşleşen alan bulunamadı.' : 'No matching areas found.'}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LocationCardProps {
  point: any;
  lang: string;
  onShow: () => void;
  key?: any;
}

function VolunteerDashboard({ lang, disasterType }: { lang: 'tr' | 'en' | 'ar', disasterType?: string | null }) {
  const t = translations[lang].modules.support;
  const [activeTab, setActiveTab] = useState<'form' | 'tasks' | 'donate'>('form');

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'form', title: t.volunteerTitle, icon: Users },
          { id: 'tasks', title: t.tasksTitle, icon: ListChecks },
          { id: 'donate', title: t.donationTitle, icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 rounded-3xl text-sm font-black flex items-center gap-3 whitespace-nowrap transition-all border ${activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
              }`}
          >
            <tab.icon size={18} />
            {tab.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'form' && <VolunteerForm lang={lang} disasterType={disasterType} />}
          {activeTab === 'tasks' && <TaskBoard lang={lang} disasterType={disasterType} />}
          {activeTab === 'donate' && <DonationBridge lang={lang} disasterType={disasterType} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function VolunteerForm({ lang, disasterType }: { lang: 'tr' | 'en' | 'ar', disasterType?: string | null }) {
  const t = translations[lang].modules.support;
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users size={24} />
          </div>
          <h3 className="text-2xl font-black">{t.volunteerTitle}</h3>
        </div>
        {disasterType && (
          <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2
            ${disasterType === 'earthquake' ? 'bg-red-50 text-red-600' : disasterType === 'flood' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
            {disasterType === 'earthquake' ? <Activity size={14} /> : disasterType === 'flood' ? <Waves size={14} /> : <Flame size={14} />}
            {typeof t[disasterType as keyof typeof t] === 'string' ? String(t[disasterType as keyof typeof t]) : disasterType}
          </div>
        )}
      </div>
      <p className="text-gray-500 mb-8 font-medium">{t.volunteerDesc}</p>

      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert(lang === 'tr' ? 'Demo: Kayıt gönderilmedi veya saklanmadı.' : 'Demo: No registration was sent or saved.'); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder={t.formName} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="email" placeholder="E-posta Adresi" className="p-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Gönüllülük Şekli</label>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl border bg-blue-50 border-blue-200 text-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500 text-white">
                  <MapPin size={20} />
                </div>
                <span className="font-bold text-sm">{t.fieldOptions.field}</span>
              </div>
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Yetkinlik Seçimi (Birden fazla seçebilirsiniz)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(t.volunteerTags).map(([key, label]: [string, any]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleSkill(key)}
                className={`p-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-tighter transition-all border ${selectedSkills.includes(key) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.01] active:scale-95 transition-all text-sm uppercase">
          {t.submit}
        </button>
      </form>
    </div>
  );
}

function TaskBoard({ lang, disasterType }: { lang: 'tr' | 'en' | 'ar', disasterType?: string | null }) {
  const t = translations[lang].modules.support;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black">{t.tasksTitle}</h3>
          <p className="text-gray-500 text-sm font-medium">{t.tasksSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VOLUNTEER_TASKS.filter(task => !disasterType || (task.types as string[])?.includes(disasterType)).map((task) => (
          <div key={task.id} className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                  ${task.urgency === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {task.urgency}
                </span>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase">
                  <MapPin size={12} />
                  {task.location}
                </div>
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h4>

              <div className="space-y-3">
                <div className="flex justify-between items-end text-[10px] font-black uppercase">
                  <div className="text-gray-400">Gönüllü Durumu</div>
                  <div className="text-gray-900">{task.current} / {task.needed}</div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${task.urgency === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${(task.current / task.needed) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button className="mt-8 w-full py-3 bg-gray-50 text-gray-900 font-black rounded-2xl text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">
              Hemen Katıl
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonationBridge({ lang, disasterType }: { lang: 'tr' | 'en' | 'ar', disasterType?: string | null }) {
  const t = translations[lang].modules.support;

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl
          ${disasterType === 'earthquake' ? 'bg-red-50 text-red-600' : disasterType === 'flood' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
          {disasterType === 'earthquake' ? <Activity size={40} /> : disasterType === 'flood' ? <Waves size={40} /> : <Flame size={40} />}
        </div>
        <h3 className="text-3xl font-black mb-4">{disasterType ? (lang === 'tr' ? `${translations[lang as keyof typeof translations][disasterType as keyof (typeof translations)['tr']] as string} Yardımı` : `${translations[lang as keyof typeof translations][disasterType as keyof (typeof translations)['tr']] as string} Support`) : t.donationTitle}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">
          Sitemiz doğrudan bağış kabul etmemektedir. Lütfen yardımlarınızı aşağıdaki doğrulanmış resmi kurumlar üzerinden gerçekleştiriniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DONATION_CHANNELS.map((channel) => (
          <a
            key={channel.name}
            href={channel.site}
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group flex flex-col items-center text-center"
          >
            <div className={`w-16 h-16 ${channel.bg} ${channel.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <channel.icon size={32} />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">{channel.name}</h4>
            <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mb-6">
              <CheckCircle2 size={12} /> DOĞRULANDI
            </div>
            <div className="mt-auto flex items-center gap-2 text-xs font-black text-gray-400 group-hover:text-blue-600 transition-colors uppercase">
              Web Sitesine Git <ExternalLink size={14} />
            </div>
          </a>
        ))}
      </div>

      <div className="p-8 bg-gray-900 text-white rounded-[40px] flex flex-col md:flex-row items-center gap-8 border border-gray-800">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={32} className="text-yellow-400" />
        </div>
        <div>
          <h5 className="text-lg font-black mb-2">Dolandırıcılık Uyarısı</h5>
          <p className="text-white/60 text-sm font-medium leading-relaxed">
            Resmi olmayan IBAN numaralarına veya sosyal medyadaki kontrolsüz "bağış" çağrılarına itibar etmeyiniz. Sadece doğrulanmış, devlet onaylı kanalları kullanın.
          </p>
        </div>
      </div>
    </div>
  );
}

function LocationCard({ point, lang, onShow }: LocationCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <MapPin size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">{point.city}</span>
            <span className="text-gray-300">/</span>
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{point.district}</span>
          </div>
          <p className="text-xs font-bold text-gray-500 leading-snug">{point.address}</p>
          <button onClick={onShow} className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase hover:text-blue-700 transition-colors">
            <Navigation size={12} /> {lang === 'tr' ? 'Haritada Göster' : 'Show on Map'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface CenterCardProps {
  center: CollectionCenter;
  lang: string;
  onShow: () => void;
  key?: any;
}

function CenterCard({ center, lang, onShow }: CenterCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Truck size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{center.type}</span>
            <span className={`text-[9px] font-black uppercase ${center.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>● {center.status}</span>
          </div>
          <h5 className="text-[11px] font-black text-gray-900 uppercase mb-1 leading-tight">{center.name}</h5>
          <p className="text-[10px] font-bold text-gray-500 leading-snug mb-3">{center.address}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {center.acceptedItems.slice(0, 3).map(i => <span key={i} className="text-[8px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-bold">{i}</span>)}
          </div>
          <button onClick={onShow} className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase hover:text-blue-700 transition-colors">
            <Navigation size={12} /> {lang === 'tr' ? 'Haritada Göster' : 'Show on Map'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NeedsDashboard({ lang }: { lang: 'tr' | 'en' | 'ar' }) {
  const [category, setCategory] = useState<Category | 'all'>('all');

  const filteredNeeds = NEEDS_DATA.filter(n =>
    (category === 'all' || n.category === category)
  );

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'blood', 'food', 'shelter', 'medical', 'children', 'hygiene'].map((cat) => {
          const labels: any = {
            all: lang === 'tr' ? 'Hepsi' : lang === 'ar' ? 'الكل' : 'All',
            blood: lang === 'tr' ? 'Kan' : lang === 'ar' ? 'الدم' : 'Blood',
            food: lang === 'tr' ? 'Gıda' : lang === 'ar' ? 'طعام' : 'Food',
            shelter: lang === 'tr' ? 'Barınma' : lang === 'ar' ? 'مأوى' : 'Shelter',
            medical: lang === 'tr' ? 'Medikal' : lang === 'ar' ? 'طبي' : 'Medical',
            children: lang === 'tr' ? 'Çocuk' : lang === 'ar' ? 'أطفال' : 'Children',
            hygiene: lang === 'tr' ? 'Hijyen' : lang === 'ar' ? 'نظافة' : 'Hygiene'
          };
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className={`px-6 py-4 rounded-3xl text-xs font-black uppercase tracking-tighter whitespace-nowrap transition-all border ${category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                }`}
            >
              {labels[cat]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNeeds.map((need) => {
          const progress = Math.min(100, Math.floor((need.collected / need.total) * 100));
          const isNearlyFull = progress >= 90;

          return (
            <motion.div
              key={need.id}
              layout
              className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-end mb-4">
                  <div className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg uppercase">
                    {need.city} / {need.district}
                  </div>
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-1">{need.title}</h4>
                <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-tighter">
                  {lang === 'tr' ? (
                    need.category === 'blood' ? 'Kan' :
                      need.category === 'food' ? 'Gıda' :
                        need.category === 'shelter' ? 'Barınma' :
                          need.category === 'medical' ? 'Medikal' :
                            need.category === 'children' ? 'Çocuk' : 'Hijyen'
                  ) : lang === 'ar' ? (
                    need.category === 'blood' ? 'الدم' :
                      need.category === 'food' ? 'طعام' :
                        need.category === 'shelter' ? 'مأوى' :
                          need.category === 'medical' ? 'طبي' :
                            need.category === 'children' ? 'أطفال' : 'نظافة'
                  ) : need.category}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="text-xs font-black text-gray-900">
                      {need.collected} / {need.total} <span className="text-gray-400 font-bold ml-1">{need.category === 'blood' ? (lang === 'tr' ? 'ÜNİTE' : lang === 'ar' ? 'وحدة' : 'UNIT') : (lang === 'tr' ? 'ADET' : lang === 'ar' ? 'قطعة' : 'UNITS')}</span>
                    </div>
                    <div className="text-lg font-black text-blue-600">%{progress}</div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full rounded-full transition-all duration-1000 ${isNearlyFull ? 'bg-green-500' : 'bg-blue-500'}`}
                    />
                  </div>
                </div>
              </div>

              {isNearlyFull && (
                <div className="mt-6 p-4 bg-green-50 rounded-2xl flex gap-3 text-green-700">
                  <CheckCircle2 size={18} className="flex-shrink-0" />
                  <p className="text-[10px] font-bold leading-tight">
                    {lang === 'tr'
                      ? "İhtiyaç karşılanmak üzeredir, lütfen diğer kritik ihtiyaçlara yönelin."
                      : "Need is almost met, please focus on other critical needs."}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function LogisticsNetwork({ lang }: { lang: 'tr' | 'en' | 'ar' }) {
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [logisticsList, setLogisticsList] = useState<LogisticsPost[]>(LOGISTICS_DATA);

  const filteredLogistics = logisticsList.filter(item => {
    const matchFrom = item.from.toLowerCase().includes(fromSearch.toLowerCase());
    const matchTo = item.to.toLowerCase().includes(toSearch.toLowerCase());
    return matchFrom && matchTo;
  });

  const handleCreateRoute = () => {
    if (!fromSearch.trim() || !toSearch.trim()) {
      alert(lang === 'tr' ? "Lütfen 'Nereden' ve 'Nereye' alanlarını doldurun." : "Please fill in 'From' and 'To' fields.");
      return;
    }

    const newRoute: LogisticsPost = {
      id: 'l' + Date.now(),
      from: fromSearch.trim(),
      to: toSearch.trim(),
      vehicle: lang === 'tr' ? 'Binek Araç / Özel' : 'Private Vehicle',
      departure: lang === 'tr' ? 'En Kısa Sürede' : 'As soon as possible',
      capacity: 100,
      contact: 'Sistem üzerinden eklendi'
    };

    setLogisticsList([newRoute, ...logisticsList]);
    setFromSearch('');
    setToSearch('');
  };

  return (
    <div className="space-y-8">
      {/* Provider Form Section */}
      <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
              <Truck size={32} /> {lang === 'tr' ? 'Yoldayım - Lojistik Ağı' : 'I\'m on my way - Logistics Network'}
            </h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">
              {lang === 'tr'
                ? 'Afet bölgesine gidecek aracınız mı var? Rotanızı ekleyin, yardım bekleyen malzemelerle sizi eşleştirelim.'
                : 'Do you have a vehicle going to the disaster zone? Add your route, let us match you with supplies.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-white/20 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
                <MapPin size={20} className="text-blue-100 ml-2" />
                <input 
                  type="text" 
                  placeholder={lang === 'tr' ? 'Nereden (Örn: İstanbul)' : 'From'}
                  value={fromSearch}
                  onChange={(e) => setFromSearch(e.target.value)}
                  className="bg-transparent border-none text-white placeholder-blue-200 outline-none w-full font-bold"
                />
              </div>
              <div className="flex-1 bg-white/20 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
                <MapPin size={20} className="text-blue-100 ml-2" />
                <input 
                  type="text" 
                  placeholder={lang === 'tr' ? 'Nereye (Örn: Hatay)' : 'To'}
                  value={toSearch}
                  onChange={(e) => setToSearch(e.target.value)}
                  className="bg-transparent border-none text-white placeholder-blue-200 outline-none w-full font-bold"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={handleCreateRoute}
            className="px-8 py-4 bg-white text-blue-600 rounded-3xl font-black uppercase text-xs shadow-xl hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap h-full"
          >
            {lang === 'tr' ? 'Rota Oluştur' : 'Create Route'}
          </button>
        </div>
      </div>

      {/* Available Routes List */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">
          {lang === 'tr' ? 'Aktif Araçlar & Rotalar' : 'Active Vehicles & Routes'}
          {filteredLogistics.length === 0 && (
             <span className="ml-2 text-red-500 lowercase">({lang === 'tr' ? 'Sonuç bulunamadı' : 'No results found'})</span>
          )}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {filteredLogistics.map((item) => (
            <motion.div
              key={item.id}
              className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold group">
                  <Truck size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-black text-gray-900">{item.from}</span>
                    <ChevronLeft className="rotate-180 text-gray-300" size={14} />
                    <span className="text-sm font-black text-blue-600">{item.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                    <span>{item.vehicle}</span>
                    <span>•</span>
                    <span>Kalkış: {item.departure}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Müsait Kapasite</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.capacity}%` }} />
                    </div>
                    <span className="text-xs font-black text-blue-600">%{item.capacity}</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-gray-800 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all">
                  {lang === 'tr' ? 'İLETİŞİME GEÇ' : 'CONTACT'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FireDetailView({ lang, onBack }: { lang: 'tr' | 'en' | 'ar', onBack: () => void }) {
  const t = translations[lang];
  const p = t.modules.preparation;
  const [subSection, setSubSection] = useState<string | null>(null);

  const renderSubContent = () => {
    const details = p.fireDetails;

    switch (subSection) {
      case 'classes':
        return (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-[600px] sm:w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 sm:p-4 font-black rounded-tl-2xl">Sınıf</th>
                  <th className="p-3 sm:p-4 font-black">Yanıcı Madde</th>
                  <th className="p-3 sm:p-4 font-black">Müdahale Aracı</th>
                  <th className="p-3 sm:p-4 font-black rounded-tr-2xl">Uyarı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {details.classes.map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-gray-700 whitespace-nowrap">{c.type}</td>
                    <td className="p-3 sm:p-4 text-gray-600">{c.items}</td>
                    <td className="p-3 sm:p-4 text-gray-600 font-medium">{c.tools}</td>
                    <td className="p-3 sm:p-4">
                      {c.forbidden && <span className="text-[8px] sm:text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase">{c.forbidden}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'pass':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {details.passSteps.map((step: any, i: number) => (
              <div key={i} className="p-4 sm:p-6 bg-white border border-gray-100 rounded-[24px] sm:rounded-[32px] text-center shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 font-black text-lg sm:text-xl group-hover:scale-110 transition-transform">
                  {step.key[0]}
                </div>
                <h5 className="font-black text-gray-900 mb-1 text-sm sm:text-base">{step.title}</h5>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        );


      case 'smoke':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {details.smokeGuide.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 p-4 sm:p-6 bg-white border border-gray-100 rounded-[24px] sm:rounded-[32px] items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  {i === 0 ? <Wind size={24} className="sm:size-8" /> : <HandHeart size={24} className="sm:size-8" />}
                </div>
                <div>
                  <h5 className="font-bold text-base sm:text-lg mb-1">{item.title}</h5>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'checklist':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {details.equipmentCheck.map((item: string, i: number) => (
              <label key={i} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gray-50 hover:bg-white hover:border-gray-200 cursor-pointer transition-all border border-transparent">
                <input type="checkbox" className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg accent-gray-600" />
                <span className="text-xs sm:text-sm font-bold text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.fireMenu.map((item: any) => {
              const icons: Record<string, any> = {
                Flame: <Flame size={24} />,
                Activity: <Activity size={24} />,
                Brain: <Brain size={24} />,
                Wind: <Wind size={24} />,
                ListChecks: <ListChecks size={24} />
              };
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSubSection(item.id);
                  }}
                  className="flex flex-col p-5 sm:p-6 bg-gray-50 rounded-[24px] sm:rounded-3xl border border-transparent hover:border-gray-200 hover:bg-gray-100/50 transition-all text-left group"
                >
                  <div className="text-gray-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {icons[item.icon]}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm leading-tight text-gray-800">{item.title}</h4>
                  <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    İncele <ChevronLeft className="rotate-180" size={10} />
                  </div>
                </button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={subSection ? () => setSubSection(null) : onBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} /> {subSection ? (lang === 'tr' ? 'Menüye Dön' : 'Back to Menu') : t.back}
        </button>
      </div>
      <div className="p-5 sm:p-8 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">
            {subSection ? <Info size={24} /> : <Flame size={24} />}
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {subSection
              ? p.fireMenu.find((m: any) => m.id === subSection).title
              : p.sections.find((s: any) => s.id === 'fire').title}
          </h3>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={subSection || 'menu'}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {renderSubContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function BuildingDetailView({ lang, onBack }: { lang: 'tr' | 'en' | 'ar', onBack: () => void }) {
  const t = translations[lang];
  const p = t.modules.preparation;
  const [subSection, setSubSection] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const renderSubContent = () => {
    const details = p.buildingDetails;

    switch (subSection) {
      case 'assessment':
        const assessment = details.assessment;
        const allAnswered = assessment.questions.length === Object.keys(answers).length;
        const riskPoints = Object.values(answers).filter(v => v === true).length;

        return (
          <div className="space-y-6">
            <div className="space-y-3 sm:space-y-4">
              {assessment.questions.map((q: any) => (
                <div key={q.id} className="p-3 sm:p-4 bg-gray-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{q.text}</span>
                  <div className="flex gap-2 self-end sm:self-auto">
                    {[true, false].map((val) => (
                      <button
                        key={val.toString()}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                        className={`px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${answers[q.id] === val
                            ? (val ? 'bg-red-500 text-white' : 'bg-green-500 text-white')
                            : 'bg-white text-gray-400 border border-gray-100'
                          }`}
                      >
                        {val ? (lang === 'tr' ? 'Evet' : 'Yes') : (lang === 'tr' ? 'Hayır' : 'No')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {allAnswered && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-gray-50 border border-gray-200 rounded-3xl">
                <div className="flex items-center gap-3 text-gray-600 font-bold mb-2">
                  <AlertTriangle size={20} />
                  <span>Duyarlılık Analizi Sonucu ({riskPoints}/{assessment.questions.length})</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{assessment.resultWarning}</p>
              </motion.div>
            )}
          </div>
        );

      case 'soil':
        const soil = details.soil;
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-5 sm:p-6 bg-gray-100 rounded-[24px] sm:rounded-3xl border border-gray-200 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 text-gray-700 font-bold text-xs sm:text-sm">
                <MapPin size={18} />
                <span>{soil.fayDist}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 font-bold text-xs sm:text-sm">
                <Globe size={18} />
                <span>{soil.soilType}</span>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {soil.regulations.map((reg: any, i: number) => (
                <div key={i} className="p-3 sm:p-4 bg-white border border-gray-100 rounded-2xl">
                  <div className="text-[10px] sm:text-xs font-black text-gray-600 mb-1">{reg.year}</div>
                  <p className="text-xs sm:text-sm text-gray-600">{reg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'report':
        const report = details.report;
        return (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 bg-red-50 rounded-[24px] sm:rounded-3xl border border-red-100 text-center">
              <AlertTriangle size={40} className="mx-auto text-red-500 mb-4 sm:size-12" />
              <h4 className="text-base sm:text-lg font-bold text-red-900 mb-2">{report.title}</h4>
              <p className="text-xs sm:text-sm text-red-700 mb-6">{report.desc}</p>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {report.links.map((link: any, i: number) => (
                  <a
                    key={i}
                    href="https://www.turkiye.gov.tr/cevre-ve-sehircilik-hasar-tespit-sorgulama"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-2xl border border-red-100 hover:bg-red-100 transition-colors group"
                  >
                    <span className="font-bold text-red-600 text-xs sm:text-sm">{link.name}</span>
                    <ChevronLeft className="rotate-180 text-red-300 group-hover:text-red-600" size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        );

      case 'roadmap':
        const roadmap = details.roadmap;
        return (
          <div className="space-y-4 sm:space-y-6">
            {roadmap.steps.map((step: any, i: number) => (
              <div key={i} className="flex gap-3 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-[10px] sm:text-sm">
                  {i + 1}
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 flex-grow">
                  <h5 className="font-bold mb-1 text-sm sm:text-base">{step.title}</h5>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );


      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.buildingMenu.map((item: any) => {
              const icons: Record<string, any> = {
                ClipboardCheck: <ClipboardCheck size={24} />,
                MapPin: <MapPin size={24} />,
                AlertTriangle: <AlertTriangle size={24} />,
                Map: <MapIcon size={24} />,
                Navigation: <Navigation size={24} />
              };
              return (
                <button
                  key={item.id}
                  onClick={() => setSubSection(item.id)}
                  className="flex flex-col p-5 sm:p-6 bg-gray-50 rounded-[24px] sm:rounded-3xl border border-transparent hover:border-gray-200 hover:bg-gray-100/50 transition-all text-left group"
                >
                  <div className="text-gray-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {icons[item.icon]}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm leading-tight text-gray-800">{item.title}</h4>
                  <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    Sorgula <CheckCircle2 size={10} />
                  </div>
                </button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={subSection ? () => setSubSection(null) : onBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} /> {subSection ? (lang === 'tr' ? 'Menüye Dön' : 'Back to Menu') : t.back}
        </button>
      </div>
      <div className="p-5 sm:p-8 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-700 text-white flex items-center justify-center">
            {subSection ? <Info size={24} /> : <ShieldCheck size={24} />}
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {subSection
              ? p.buildingMenu.find((m: any) => m.id === subSection).title
              : p.sections.find((s: any) => s.id === 'building').title}
          </h3>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={subSection || 'menu'}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {renderSubContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FAQModule({ lang }: { lang: 'tr' | 'en' | 'ar' }) {
  const t = translations[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <HelpCircle size={40} />
        </div>
        <h3 className="text-3xl font-black mb-4">{(t.modules as any).faq.title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">
          {(t.modules as any).faq.subtitle}
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {(t.modules as any).faq.qa.map((item: any, i: number) => (
          <div key={i} className="border border-gray-100 rounded-[32px] bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
            <button
              onClick={() => TumSatirlariKapat(i)}
              className="w-full p-6 text-left flex items-center justify-between gap-4"
            >
              <span className="font-bold text-gray-900 pr-4">{item.q}</span>
              <div className={`p-2 rounded-xl transition-all ${openIndex === i ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-gray-500 font-medium leading-relaxed border-t border-gray-50 pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  function TumSatirlariKapat(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }
}
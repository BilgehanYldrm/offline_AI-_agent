export function DemoNotice({ lang }: { lang: 'tr' | 'en' | 'ar' }) {
  const copy = {
    tr: 'PORTFÖY DEMOSU • Harita noktaları, istatistikler ve haberler örnektir. Formlar ve konum paylaşımı ekiplerle bağlantılı değildir. Tıbbi içerik uzman doğrulamasından geçmemiştir.',
    en: 'PORTFOLIO DEMO • Map locations, statistics and news are samples. Forms and location sharing are not connected to responders. Medical content has not been clinically reviewed.',
    ar: 'عرض تجريبي • المواقع والإحصاءات والأخبار أمثلة. النماذج ومشاركة الموقع غير متصلة بفرق الطوارئ. المحتوى الطبي لم تتم مراجعته طبياً.',
  };
  return <aside className="relative mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950" dir={lang === 'ar' ? 'rtl' : 'ltr'}>{copy[lang]}</aside>;
}

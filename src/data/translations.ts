export const translations = {
  tr: {
    appName: 'TÜRKİYE AFETTE EL ELE',
    shareLocation: 'Konum Paylaş',
    locationRequesting: 'Konum Alınıyor...',
    locationSuccess: 'Demo: Konum gönderilmedi',
    locationError: 'Hata Oluştu',
    openModule: 'Modülü Aç',
    back: 'Geri',
    officialChannel: 'Resmi Duyuru Kanalı',
    contactAfad: 'AFAD',
    contactKizilay: 'Türk Kızılay',
    contactKandilli: 'Kandilli Rasathanesi',
    contactTitle: 'İletişim & Kurumlar',
    contact: 'Destek Hattı',
    reportInstantLocation: 'ACİL DURUM',
    selectDisaster: 'Afet Türünü Seçin',
    earthquake: 'Deprem',
    flood: 'Sel / Su Baskını',
    fire: 'Orman Yangını',
    sirenPlaying: 'Siren Çalıyor',
    sirenStopped: 'Siren Durduruldu',
    aiPlaceholder: 'Yapay zeka asistanına afet and ilk yardım hakkında sorun... (Örn: kanama durumunda ne yapmalıyım)',
    aiTitle: '🤖 Yapay Zeka Destekli Afet Asistanı',
    aiThinking: 'Düşünüyor ve veritabanını tarıyor...',
    aiError: 'Yapay zeka motoruna bağlanılamadı. Lütfen Python (FastAPI) sunucunuzun çalıştığından emin olun.',
    modules: {
      emergency: {
        title: 'Afet Durumu & Örnek Harita',
        subtitle: 'Afet Anı Koordinasyon',
        liveTrack: 'ÖRNEK HARİTA',
        lastMinute: 'Örnek Duyurular',
        gatheringAreas: 'Toplanma Alanları',
        searchPlaceholder: 'Mahalle/İlçe ara...',
        nearestZone: 'En yakın güvenli bölge 400m mesafededir.',
        news1: "Kandilli: Ege Denizi'nde 4.2 büyüklüğünde sarsıntı kaydedildi.",
        news2: 'AFAD: Deprem anında "Çök-Kapan-Tutun" hareketini unutmayın.',
      },
      preparation: {
        title: 'Hazırlık & Eğitim',
        subtitle: 'Afet Öncesi Bilinçlendirme',
        sections: [
          { id: 'kit', title: 'Afet Çantası', desc: 'Acil durum malzemeleri listesi' },
          { id: 'firstaid', title: 'İlk Yardım Temelleri', desc: 'Hayat kurtaran temel müdahaleler' },
          { id: 'during_disaster', title: 'Afet Sırasında Yapılması Gerekenler', desc: 'Anında müdahale adımları' },
          { id: 'building', title: 'Bina Dayanıklılık Sorgulaması', desc: 'Yapı güvenliği kontrol adımları' },
          { id: 'fire', title: 'Yangına İlk Müdahale', desc: 'Söndürme ve tahliye teknikleri' }
        ],
        fireMenu: [
          { id: 'classes', title: 'Yangın Sınıfları', icon: 'Flame' },
          { id: 'checklist', title: 'Ev Tipi Ekipman Listesi', icon: 'ListChecks' }
        ],
        fireDetails: {
          classes: [
            { type: 'A (Katı)', items: 'Ahşap, Kağıt, Kumaş', tools: 'Su, Kuru Kimyevi Toz (KKT)', forbidden: '' },
            { type: 'B (Sıvı)', items: 'Benzin, Yağ, Alkol', tools: 'Köpük, CO2, KKT', forbidden: 'Asla su dökülmez!' },
            { type: 'C (Gaz)', items: 'LPG, Doğalgaz', tools: 'KKT, CO2', forbidden: '' },
            { type: 'E (Elektrik)', items: 'Trafolar, Beyaz Eşyalar', tools: 'CO2, KKT', forbidden: 'Asla su dökülmez!' },
            { type: 'F (Mutfak)', items: 'Yağ Yangınları', tools: 'Yangın Battaniyesi, Özel Kimyasal', forbidden: 'Asla su dökülmez!' }
          ],
          passSteps: [
            { key: 'P (Pull)', title: 'Çek', desc: 'Güvenlik pimini çekin.' },
            { key: 'A (Aim)', title: 'Nişan Al', desc: 'Hortumu ateşin tabanına doğrultun.' },
            { key: 'S (Squeeze)', title: 'Sık', desc: 'Mandalları sonuna kadar sıkın.' },
            { key: 'S (Sweep)', title: 'Süpür', desc: 'Alevlerin üzerine süpürerek müdahale edin.' }
          ],
          smokeGuide: [
            { title: '"Eğil ve Sürün" Kuralı', desc: 'Temiz hava tabana yakındır. Dumanlı odada yerde ilerleyin.' },
            { title: 'Kapı Kontrolü', desc: 'Kapıyı açmadan önce elinizin tersiyle sıcaklığı kontrol edin.' }
          ],
          equipmentCheck: [
            '6 kg Kuru Kimyevi Tozlu söndürücü (Güncel)',
            'Mutfakta yangın battaniyesi',
            'Koridorda duman dedektörü',
            'Gaz kaçak dedektörü'
          ]
        },
        buildingMenu: [
          { id: 'assessment', title: 'İnteraktif Öz-Değerlendirme Testi', icon: 'ClipboardCheck' },
          { id: 'soil', title: 'Adres Bazlı Çevre ve Zemin Bilgisi', icon: 'MapPin' },
          { id: 'report', title: 'Yapısal İhlal Bildirim Butonu', icon: 'AlertTriangle' },
          { id: 'roadmap', title: '"Sorgulama Sonrası" Yol Haritası', icon: 'Map' }
        ],
        buildingDetails: {
          assessment: {
            questions: [
              { id: 1, text: 'Binanızın giriş katında dükkan var mı ve buradaki duvarlar kaldırılmış mı?', type: 'boolean' },
              { id: 2, text: 'Bodrum katta kolon demirlerinde paslanma veya beton dökülmesi görüyor musunuz?', type: 'boolean' },
              { id: 3, text: 'Kirişlerde "X" şeklinde çatlaklar var mı?', type: 'boolean' },
              { id: 4, text: 'Binanız 1999 yılından önce mi yapıldı?', type: 'boolean' }
            ],
            resultWarning: 'Binanız gözlemsel olarak risk faktörleri barındırıyor. This test resmi bir mühendislik analizi yerine geçmez, profesyonel inceleme yaptırmanızı öneririz.'
          },
          soil: {
            fayDist: 'Binanızın bulunduğu konumun en yakın aktif fay hattına uzaklığı: ~3.4 km',
            soilType: 'Zemin Yapısı: Alüvyon / Orta Sert (Z3)',
            regulations: [
              { year: '1999 Öncesi', desc: '1975 ve 1998 yönetmelikleri geçerliydi. Standartlar günümüze göre oldukça düşüktü.' },
              { year: '1999-2018', desc: 'Deprem sonrası revize edilen 2007 yönetmeliği ile denetimler arttırıldı.' },
              { year: '2018 Sonrası', desc: 'En güncel og sıkı Türkiye Bina Deprem Yönetmeliği kriterlerine tabidir.' }
            ]
          },
          report: {
            title: 'Yapısal İhlal Bildirimi',
            desc: 'Giris katı dükkanlarda kolon kesme veya kaçak tadilat şüphesi durumunda bildirim yapın.',
            links: [
              { name: 'e-Devlet Bildirim Portalı', icon: 'Globe' }
            ]
          },
          roadmap: {
            steps: [
              { title: 'Resmi Başvuru', desc: 'Belediyelerin "Hızlı Bina Taraması" veya Bakanlık onaylı kuruluşlara başvura bilirsiniz.' },
              { title: 'Karot Testi Nedir?', desc: 'Beton kalitesini ölçmek için numune alma işlemidir. Uzman eşliğinde yapılmalıdır.' },
              { title: 'Hukuki Haklar', desc: 'Kentsel dönüşüm kira yardımı ve devlet destekli güçlendirme kredileri hakkınız mevcuttur.' }
            ]
          },
          emergency_local: {
            gatheringArea: 'En Yakın Toplanma Alanı: Cumhuriyet Parkı (150m)',
            daskInfo: 'DASK poliçenizin güncelliğini sorgulamayı unutmayın. Afet anında teminat altındasınız.'
          }
        },
        kitChecklist: [
          '💧 Su (Kişi başı günlük 4 litre)',
          '🥫 Dayanıklı gıdalar (Konserve, bisküvi vb.)',
          '🩹 İlk yardım çantası',
          '📻 Pilli radyo ve yedek piller',
          '🔦 El feneri ve yedek piller',
          '📢 Düdük',
          '🔪 Çakı, makas, koli bandı',
          '🧼 Hijyen paketi (Sabun, maske, dezenfektan)',
          '📄 Önemli belge fotokopileri',
          '🔑 Yedek anahtarlar',
          '🧣 Battaniye ve yedek kıyafet',
          '💊 Düzenli kullanılan ilaçlar'
        ],
        videoTitle: 'Eğitim Videoları',
        videoDesc: 'Temel protokoller.',
        simulationTitle: 'Panik Anı Simülasyonu',
        simulationDesc: '15 soruluk afet farkındalık testi',
        generalSimulation: [
          { scenario: 'Deprem anında bina içindeysek ne yapmalıyız?', options: [{ text: 'Dışarı koşmalıyız', correct: false }, { text: 'Çök-Kapan-Tutun pozisyonu almalıyız', correct: true }, { text: 'Asansöre binmeliyiz', correct: false }] },
          { scenario: 'Mutfakta yağ yangını çıkarsa ne yapılmamalıdır?', options: [{ text: 'Üzerine su dökmek', correct: true }, { text: 'Ocağı kapatmak', correct: false }, { text: 'Yangın battaniyesi örtmek', correct: false }] },
          { scenario: 'Dumanla kaplı bir odadan nasıl çıkılır?', options: [{ text: 'Koşarak', correct: false }, { text: 'Zıplayarak', correct: false }, { text: 'Emekleyerek', correct: true }] },
          { scenario: 'Sel uyarısı geldiğinde ilk olarak ne yapılmalıdır?', options: [{ text: 'Bodruma inilmelidir', correct: false }, { text: 'Yüksek bir yere çıkılmalıdır', correct: true }, { text: 'Araçla yola çıkılmalıdır', correct: false }] },
          { scenario: 'Depremde yatakta yakalanırsak ne yapmalıyız?', options: [{ text: 'Yastıkla başı koruyup cenin pozisyonu almak', correct: true }, { text: 'Pencereden atlamak', correct: false }, { text: 'Merdivenlere koşmak', correct: false }] },
          { scenario: 'Yangın söndürme cihazı kullanırken ilk adım (PASS) nedir?', options: [{ text: 'Hortumu yöneltmek', correct: false }, { text: 'Pimi çekmek', correct: true }, { text: 'Mandala basmak', correct: false }] },
          { scenario: 'Afet çantasında bulunması gerekmeyen şey nedir?', options: [{ text: 'El feneri', correct: false }, { text: 'Porselen tabak', correct: true }, { text: 'Düdük', correct: false }] },
          { scenario: 'Sel sularının içine girmek güvenli midir?', options: [{ text: 'Evet, su seviyesi düşükse', correct: false }, { text: 'Hayır, akıntı og hastalık riski vardır', correct: true }, { text: 'Sadece yüzme bilenler için', correct: false }] },
          { scenario: 'İlk yardımda birinci derece yanığa ne uygulanır?', options: [{ text: 'Diş macunu sürmek', correct: false }, { text: '10-15 dk soğuk suya tutmak', correct: true }, { text: 'Buz basmak', correct: false }] },
          { scenario: 'Dışarıdayken deprem olursa nereye gidilmelidir?', options: [{ text: 'Binalardan uzak açık bir alana', correct: true }, { text: 'Ağaçların altına', correct: false }, { text: 'Binaların dibine', correct: false }] },
          { scenario: 'Afet sonrası iletişim nasıl sağlanmalıdır?', options: [{ text: 'Uzun telefon görüşmeleriyle', correct: false }, { text: 'Kısa SMS veya internet üzerinden', correct: true }, { text: 'Sürekli polisi arayarak', correct: false }] },
          { scenario: 'Yangında odadan çıkarken kapı sıcaksa ne yapılmalıdır?', options: [{ text: 'Hemen açılmalıdır', correct: false }, { text: 'Açılmamalı, kapı altı kapatılmalıdır', correct: true }, { text: 'Tekme atılmalıdır', correct: false }] },
          { scenario: 'İlk yardımda kanama nasıl durdurulur?', options: [{ text: 'Yaraya sıcak su dökerek', correct: false }, { text: 'Temiz bezle direkt baskı uygulayarak', correct: true }, { text: 'Yarayı açık bırakarak', correct: false }] },
          { scenario: 'Sel sonrası musluk suyu hemen içilebilir mi?', options: [{ text: 'Hayır, kirlenmiş olabilir', correct: true }, { text: 'Evet, musluktan akıyorsa temizdir', correct: false }, { text: 'Sadece kaynatmadan içilir', correct: false }] },
          { scenario: 'Karbonmonoksit sızıntısı şüphesinde ne yapılmalıdır?', options: [{ text: 'Uyuyup dinlenmek', correct: false }, { text: 'Pencereleri kapatmak', correct: false }, { text: 'Hemen camları açıp dışarı çıkmak', correct: true }] }
        ]
      },
      logistics: {
        title: 'İhtiyaç & Lojistik',
        subtitle: 'Stok Takibi & Ulaşım Rotaları',
        statVehicles: 'Aktif Araçlar',
        createRoute: 'Rota Oluştur',
      },
      support: {
        title: 'Destek & Gönüllülük',
        subtitle: 'Sürekli Topluluk Gücü',
        volunteerTitle: 'Gönüllü Olun',
        volunteerDesc: 'Ekiplerimize katılarak afet sonrası çalışmalarda yanımızda olun.',
        formName: 'Ad Soyad',
        formExpertise: 'Uzmanlık Alanı',
        expertiseOptions: ['İlk Yardım', 'Lojistik', 'Arama Kurtarma', 'Psikososyal Destek'],
        volunteerTags: {
          health: 'Sağlık',
          tech: 'Saha',
          logistics: 'Lojistik',
          language: 'Dil',
        },
        fieldOptions: {
          field: 'Saha Gönüllüsü',
        },
        tasksTitle: 'Gönüllü Panosu',
        tasksSubtitle: 'Anlık Görev Borsası',
        donationTitle: 'Güvenli Bağış Kanalları',
        donationSubtitle: 'Resmi Kurum Köprüsü',
        submit: 'Başvuruyu Gönder'
      },
      faq: {
        title: 'FAQ & Bilgilendirme',
        subtitle: 'Hayat Kurtaran Bilgiler',
        qa: [
          { q: 'Deprem anında ilk ne yapmalıyım?', a: 'Çök-Kapan-Tutun yöntemini uygulayın. Pencerelerden, merdivenlerden ve asansörlerden uzak durun.' },
          { q: 'Afet çantasına neler koymalıyım?', a: 'Su, düdük, fener, ilk yardım seti, yedek piller, battaniye ve 3 günlük kuru gıda.' },
          { q: 'Sel baskını uyarısı aldığımda ne yapmalıyım?', a: 'Elektrik ve doğalgazı kapatın, hemen yüksek bölgelere çıkın. Aracınızı kullanmaya çalışmayın.' },
          { q: 'Yangın anında kapılar sıcaksa ne yapmalıyım?', a: 'Kapıyı açmayın. Dumanı engellemek için kapı altlarını ıslak bezle kapatın ve pencereden yardım isteyin.' },
          { q: 'Toplanma alanımı nasıl öğrenebilirim?', a: 'E-Devlet üzerinden \'Afet ve Acil Durum Toplanma Alanı Sorgulama\' hizmetini kullanarak veya uygulamamızdaki \'Toplanma Alanları\' haritasından size en yakın güvenli noktayı öğrenebilirsiniz.' },
          { q: 'Enkaz altında kalırsam ne yapmalıyım?', a: 'Panik yapmamaya çalışın ve enerjinizi koruyun. Toz yutmamak için ağzınızı bir bezle kapatın. Dışarıdan ses duyduğunuzda borulara vurarak veya düdük çalarak yerinizi belli edin.' },
          { q: 'DASK hasar bildirimi ne kadar sürede yapılmalıdır?', a: 'Hasarı öğrendiğiniz tarihten itibaren en geç 15 iş günü içinde DASK\'a (Alo 125, e-Devlet veya web sitesi üzerinden) bildirim yapmanız gerekmektedir.' }
        ]
      }
    }
  },
  en: {
    appName: 'TURKEY DISASTER RELIEF',
    shareLocation: 'Share Location',
    locationRequesting: 'Getting Location...',
    locationSuccess: 'Demo: Location not sent',
    locationError: 'Error Occurred',
    openModule: 'Open Module',
    back: 'Back',
    officialChannel: 'Official Announcement Channel',
    contactAfad: 'AFAD',
    contactKizilay: 'Turkish Red Crescent',
    contactKandilli: 'Kandilli Observatory',
    contactTitle: 'Contact & Institutions',
    contact: 'Support Line',
    reportInstantLocation: 'EMERGENCY',
    selectDisaster: 'Select Disaster Type',
    earthquake: 'Earthquake',
    flood: 'Flood',
    fire: 'Wildfire',
    sirenPlaying: 'Siren Playing',
    sirenStopped: 'Siren Stopped',
    aiPlaceholder: 'Ask AI assistant about disaster and first aid... (e.g., what to do in case of bleeding)',
    aiTitle: '🤖 AI-Powered Disaster Assistant',
    aiThinking: 'Thinking and scanning local knowledge base...',
    aiError: 'Could not connect to AI engine. Make sure your Python server is running.',
    modules: {
      emergency: {
        title: 'Disaster Status & Live Track',
        subtitle: 'Disaster Moment Coordination',
        liveTrack: 'SAMPLE MAP',
        lastMinute: 'Sample Announcements',
        gatheringAreas: 'Gathering Areas',
        searchPlaceholder: 'Search District...',
        nearestZone: 'Nearest safe zone is 400m away.',
        news1: 'Kandilli: 4.2 magnitude tremor recorded in the Aegean Sea.',
        news2: "AFAD: Remember 'Drop-Cover-Hold' during an earthquake.",
      },
      preparation: {
        title: 'Nav & Prep',
        subtitle: 'Pre-Disaster Awareness',
        sections: [
          { id: 'kit', title: 'Disaster Kit', desc: 'Emergency supply list' },
          { id: 'firstaid', title: 'First Aid Basics', desc: 'Life-saving interventions' },
          { id: 'during_disaster', title: 'What to Do During a Disaster', desc: 'Immediate response steps' },
          { id: 'building', title: 'Building Resilience', desc: 'Structure safety check steps' },
          { id: 'fire', title: 'Fire First Response', desc: 'Extinguishing & evacuation' }
        ],
        fireMenu: [
          { id: 'classes', title: 'Fire Classes', icon: 'Flame' },
          { id: 'checklist', title: 'Home Equipment List', icon: 'ListChecks' }
        ],
        fireDetails: {
          classes: [
            { type: 'A (Solid)', items: 'Wood, Paper, Cloth', tools: 'Water, Dry Powder (KKT)', forbidden: '' },
            { type: 'B (Liquid)', items: 'Petrol, Oil, Alcohol', tools: 'Foam, CO2, KKT', forbidden: 'Never use water!' },
            { type: 'C (Gas)', items: 'LPG, Natural Gas', tools: 'KKT, CO2', forbidden: '' },
            { type: 'E (Electric)', items: 'Transformers, Appliances', tools: 'CO2, KKT', forbidden: 'Never use water!' },
            { type: 'F (Kitchen)', items: 'Cooking Oils', tools: 'Fire Blanket, Special Chemical', forbidden: 'Never use water!' }
          ],
          passSteps: [
            { key: 'P (Pull)', title: 'Pull', desc: 'Pull the safety pin.' },
            { key: 'A (Aim)', title: 'Aim', desc: 'Aim at the base of the fire.' },
            { key: 'S (Squeeze)', title: 'Squeeze', desc: 'Squeeze the lever completely.' },
            { key: 'S (Sweep)', title: 'Sweep', desc: 'Sweep from side to side over the flames.' }
          ],
          smokeGuide: [
            { title: '"Low and Crawl" Rule', desc: 'Clean air is near the floor. Advance on the ground.' },
            { title: 'Door Control', desc: 'Check the temperature with the back of your hand before opening.' }
          ],
          equipmentCheck: [
            '6 kg Dry Chemical fire extinguisher (Updated)',
            'Fire blanket in the kitchen',
            'Smoke detector in the hallway',
            'Gas leak detector'
          ]
        },
        buildingMenu: [
          { id: 'assessment', title: 'Interactive Self-Assessment Test', icon: 'ClipboardCheck' },
          { id: 'soil', title: 'Address-Based Soil Info', icon: 'MapPin' },
          { id: 'report', title: 'Structural Violation Report', icon: 'AlertTriangle' },
          { id: 'roadmap', title: '"Post-Query" Roadmap', icon: 'Map' }
        ],
        buildingDetails: {
          assessment: {
            questions: [
              { id: 1, text: 'Are there shops on the ground floor and have any walls been removed?', type: 'boolean' },
              { id: 2, text: 'Do you see corrosion in columns or concrete peeling in the basement?', type: 'boolean' },
              { id: 3, text: 'Are there "X" shaped cracks in the beams?', type: 'boolean' },
              { id: 4, text: 'Was your building built before 1999?', type: 'boolean' }
            ],
            resultWarning: 'Your building shows observational risk factors. This test is not a official engineering analysis. We recommend professional inspection.'
          },
          soil: {
            fayDist: 'Distance to the nearest active fault line: ~3.4 km',
            soilType: 'Soil Structure: Alluvium / Medium Hard (Z3)',
            regulations: [
              { year: 'Pre-1999', desc: '1975 and 1998 regulations were in effect. Standards were significantly lower than today.' },
              { year: '1999-2018', desc: '2007 regulation revised after the earthquake increased inspections.' },
              { year: 'Post-2018', desc: 'Subject to the most current and strict Turkey Building Earthquake Regulation criteria.' }
            ]
          },
          report: {
            title: 'Structural Violation Report',
            desc: 'Report suspected column cutting or illegal renovations in ground floor shops.',
            links: [
              { name: 'e-Government Portal', icon: 'Globe' }
            ]
          },
          roadmap: {
            steps: [
              { title: 'Official Application', desc: 'Apply to municipal "Fast Building Scan" or Ministry-approved institutions.' },
              { title: 'What is Core Testing?', desc: 'A process of taking samples to measure concrete quality. Must be done by experts.' },
              { title: 'Legal Rights', desc: 'Urban transformation rent assistance and state-supported reinforcement loans are available.' }
            ]
          },
          emergency_local: {
            gatheringArea: 'Nearest Assembly Area: Cumhuriyet Park (150m)',
            daskInfo: "Don't forget to query your DASK policy status. You are covered in case of disaster."
          }
        },
        kitChecklist: [
          '💧 Water (4 liters per person per day)',
          '🥫 Non-perishable food (Canned, crackers etc.)',
          '🩹 First aid kit',
          '📻 Battery-powered radio and extra batteries',
          '🔦 Flashlight and extra batteries',
          '📢 Whistle',
          '🔪 Multi-tool knife, scissors, duct tape',
          '🧼 Hygiene kit (Soap, masks, sanitizer)',
          '📄 Copies of important documents',
          '🔑 Spare keys',
          '🧣 Blankets and extra clothing',
          '💊 Regular medications'
        ],
        videoTitle: 'Training Videos',
        videoDesc: 'Basic protocols.',
        simulationTitle: 'Panic Simulation',
        simulationDesc: '15-question disaster awareness test',
        generalSimulation: [
          { scenario: 'What should we do indoors during an earthquake?', options: [{ text: 'Run outside', correct: false }, { text: 'Drop, Cover, and Hold On', correct: true }, { text: 'Use the elevator', correct: false }] },
          { scenario: 'What should NOT be done if a grease fire starts in the kitchen?', options: [{ text: 'Pour water on it', correct: true }, { text: 'Turn off the stove', correct: false }, { text: 'Cover with a fire blanket', correct: false }] },
          { scenario: 'How to exit a smoke-filled room?', options: [{ text: 'Running', correct: false }, { text: 'Jumping', correct: false }, { text: 'Crawling', correct: true }] },
          { scenario: 'What is the first step during a flood warning?', options: [{ text: 'Go to the basement', correct: false }, { text: 'Move to higher ground', correct: true }, { text: 'Drive away', correct: false }] },
          { scenario: 'What to do if caught in bed during an earthquake?', options: [{ text: 'Protect head with pillow and curl up', correct: true }, { text: 'Jump out the window', correct: false }, { text: 'Run to the stairs', correct: false }] },
          { scenario: 'First step (PASS) when using a fire extinguisher?', options: [{ text: 'Aim the hose', correct: false }, { text: 'Pull the pin', correct: true }, { text: 'Squeeze the handle', correct: false }] },
          { scenario: 'Which is NOT needed in a disaster kit?', options: [{ text: 'Flashlight', correct: false }, { text: 'Porcelain plate', correct: true }, { text: 'Whistle', correct: false }] },
          { scenario: 'Is it safe to enter floodwaters?', options: [{ text: 'Yes, if it is shallow', correct: false }, { text: 'No, due to currents and diseases', correct: true }, { text: 'Only for swimmers', correct: false }] },
          { scenario: 'How to treat a minor burn in first aid?', options: [{ text: 'Apply toothpaste', correct: false }, { text: 'Cool running water for 10-15 mins', correct: true }, { text: 'Apply ice', correct: false }] },
          { scenario: 'Where to go if outdoors during an earthquake?', options: [{ text: 'Open area away from buildings', correct: true }, { text: 'Under trees', correct: false }, { text: 'Next to buildings', correct: false }] },
          { scenario: 'How to communicate post-disaster?', options: [{ text: 'Long phone calls', correct: false }, { text: 'Short SMS or internet apps', correct: true }, { text: 'Calling police repeatedly', correct: false }] },
          { scenario: 'If a door feels hot during a fire, what to do?', options: [{ text: 'Open it immediately', correct: false }, { text: 'Do not open, block the bottom', correct: true }, { text: 'Kick it open', correct: false }] },
          { scenario: 'How to stop bleeding in first aid?', options: [{ text: 'Pour hot water', correct: false }, { text: 'Apply direct pressure with clean cloth', correct: true }, { text: 'Leave it open', correct: false }] },
          { scenario: 'Can you drink tap water immediately after a flood?', options: [{ text: 'No, it might be contaminated', correct: true }, { text: 'Yes, if it flows', correct: false }, { text: 'Only without boiling', correct: false }] },
          { scenario: 'What to do if carbon monoxide leak is suspected?', options: [{ text: 'Sleep and rest', correct: false }, { text: 'Close windows', correct: false }, { text: 'Open windows and evacuate', correct: true }] }
        ]
      },
      logistics: {
        title: 'Needs & Logistics',
        subtitle: 'Stock Tracking & Transport Routes',
        statVehicles: 'Active Vehicles',
        createRoute: 'Create Route',
      },
      support: {
        title: 'Support & Volunteering',
        subtitle: 'Continuous Community Strength',
        volunteerTitle: 'Become a Volunteer',
        volunteerDesc: 'Join our teams and stand by us in post-disaster efforts.',
        formName: 'Full Name',
        formExpertise: 'Area of Expertise',
        expertiseOptions: ['First Aid', 'Logistics', 'Search & Rescue', 'Psychosocial Support'],
        volunteerTags: {
          health: 'Health',
          tech: 'Field',
          logistics: 'Logistics',
          language: 'Language',
        },
        fieldOptions: {
          field: 'Field Volunteer',
        },
        tasksTitle: 'Volunteer Board',
        tasksSubtitle: 'Instant Task Market',
        donationTitle: 'Verified Donation Channels',
        donationSubtitle: 'Official Institution Bridge',
        submit: 'Submit Application'
      },
      faq: {
        title: 'FAQ & Information',
        subtitle: 'Life Saving Info',
        qa: [
          { q: 'What should I do first during an earthquake?', a: 'Apply the Drop-Cover-Hold on method. Stay away from windows, stairs, and elevators.' },
          { q: 'What should I put in an emergency kit?', a: 'Water, whistle, flashlight, first aid kit, spare batteries, blanket, and 3 days of dry food.' },
          { q: 'What should I do when I receive a flood warning?', a: 'Turn off electricity and gas, move to higher ground immediately. Do not try to drive your vehicle.' },
          { q: 'What if the doors are hot during a fire?', a: 'Do not open the door. Block smoke with wet cloths under the door and call for help from the window.' },
          { q: 'How can I find out my assembly area?', a: 'You can find your nearest safe point by using the \'Disaster and Emergency Assembly Area Inquiry\' service on e-Government or from the \'Assembly Areas\' map in our application.' },
          { q: 'What should I do if I am trapped under rubble?', a: 'Try not to panic and conserve your energy. Cover your mouth with a cloth to avoid swallowing dust. When you hear sounds from outside, tap on pipes or blow a whistle to signal your location.' },
          { q: 'How long do I have to report a DASK claim?', a: 'You must notify DASK (via Alo 125, e-Government or website) within 15 working days at the latest from the date you learned of the damage.' }
        ]
      }
    }
  },
  ar: {
    appName: 'تركيا يداً بيد في الكوارث',
    shareLocation: 'مشاركة الموقع',
    locationRequesting: 'جاري تحديد الموقع...',
    locationSuccess: 'عرض تجريبي: لم يتم إرسال الموقع',
    locationError: 'حدث خطأ',
    openModule: 'فتح الوحدة',
    back: 'رجوع',
    officialChannel: 'قناة الإعلانات الرسمية',
    contactAfad: 'AFAD',
    contactKizilay: 'الهلال الأحمر التركي',
    contactKandilli: 'مرصد كانديلي',
    contactTitle: 'الجهات والاتصال',
    contact: 'خط الدعم',
    reportInstantLocation: 'حالة طوارئ',
    selectDisaster: 'اختر نوع الكارثة',
    earthquake: 'زلزال',
    flood: 'فيضان',
    fire: 'حريق غابة',
    sirenPlaying: 'صفارة الإنذار تعمل',
    sirenStopped: 'توقفت صفارة الإنذار',
    aiPlaceholder: 'اسأل مساعد الذكاء الاصطناعي حول الكوارث والإسعافات الأولية...',
    aiTitle: '🤖 مساعد الطوارئ الذكي المحتلي',
    aiThinking: 'يفكر الذكاء الاصطناعي الآن ويقوم بمسح قواعد البيانات المحلية...',
    aiError: 'فشل الاتصال بمحرك الذكاء الاصطناعي المحلي. يرجى تشغيل خادم ووردبريس/بايثون.',
    modules: {
      emergency: {
        title: 'حالة الكارثة والتتبع المباشر',
        subtitle: 'تنسيق لحظة الكارثة',
        liveTrack: 'خريطة تجريبية',
        lastMinute: 'إعلانات تجريبية',
        gatheringAreas: 'مناطق التجمع',
        searchPlaceholder: 'ابحث عن منطقة...',
        nearestZone: 'أقرب منطقة آمنة تبعد 400 متر.',
        news1: 'كانديلي: تسجيل هزة بقوة 4.2 في بحر إيجة.',
        news2: 'آفاد: تذكر "انزل-تغط-تمسك" أثناء الزلزال.',
      },
      preparation: {
        title: 'الاستعداد والتعليم',
        subtitle: 'الوعي قبل الكارثة',
        sections: [
          { id: 'kit', title: 'حقيبة الكوارث', desc: 'قائمة مستلزمات الطوارئ' },
          { id: 'firstaid', title: 'أسasيات الإسعافات الأولية', desc: 'تدخلات منقذة للحياة' },
          { id: 'during_disaster', title: 'ماذا تفعل أثناء الكارثة', desc: 'خطوات الاستجابة الفورية' },
          { id: 'building', title: 'مقاومة المباني', desc: 'خطوات فحص سلامة الهيكل' },
          { id: 'fire', title: 'الاستجابة الأولى للحريق', desc: 'الإطفاء والإخلاء' }
        ],
        fireMenu: [
          { id: 'classes', title: 'فئات الحرائق', icon: 'Flame' },
          { id: 'checklist', title: 'قائمة المعدات المنزلية', icon: 'ListChecks' }
        ],
        fireDetails: {
          classes: [
            { type: 'A (صلبة)', items: 'خشب، ورق، قماش', tools: 'ماء، مسحوق جاف (KKT)', forbidden: '' },
            { type: 'B (سائلة)', items: 'بنزين، زيت، كحول', tools: 'رغوة، تقسيم ثاني أكسيد الكربون، KKT', forbidden: 'لا تستخدم الماء أبداً!' },
            { type: 'C (غازية)', items: 'غاز مسال، غاز طبيعي', tools: 'KKT، ثاني أكسيد الكربون', forbidden: '' },
            { type: 'E (كهربائية)', items: 'محولات، أجهزة منزلية', tools: 'ثاني أكسيد الكربون، KKT', forbidden: 'لا تستخدم الماء أبداً!' },
            { type: 'F (مطبخ)', items: 'زيوت الطبخ', tools: 'بطانية حريق، مواد كيميائية خاصة', forbidden: 'لا تستخدم الماء أبداً!' }
          ],
          passSteps: [
            { key: 'P (اسحب)', title: 'اسحب', desc: 'اسحب مسمار الأمان.' },
            { key: 'A (وجه)', title: 'وجه', desc: 'وجه نحو قاعدة النار.' },
            { key: 'S (اضغط)', title: 'اضغط', desc: 'اضغط على المقبض بالكامل.' },
            { key: 'S (امسح)', title: 'امسح', desc: 'امسح من جانب إلى آخر فوق ألسنة اللهب.' }
          ],
          smokeGuide: [
            { title: 'قاعدة "منخفض وازحف"', desc: 'الهواء النظيف بالقرب من الأرض. تقدم على الأرض.' },
            { title: 'التحكم في الباب', desc: 'افحص درجة الحرارة بظهر يدك قبل الفتح.' }
          ],
          equipmentCheck: [
            'طفاية حريق مسحوق جاف 6 كجم (محدثة)',
            'بطانية حريق في المطبخ',
            'كاشf دخان في الردهة',
            'كاشف تسرب الغاز'
          ]
        },
        buildingMenu: [
          { id: 'assessment', title: 'اختبار التقييم الذاتي التفاعلي', icon: 'ClipboardCheck' },
          { id: 'soil', title: 'معلومات التربة حسب العنوان', icon: 'MapPin' },
          { id: 'report', title: 'الإبلاغ عن انتهاك هيكلي', icon: 'AlertTriangle' },
          { id: 'roadmap', title: 'خارطة طريق "ما بعد الاستعلام"', icon: 'Map' }
        ],
        buildingDetails: {
          assessment: {
            questions: [
              { id: 1, text: 'هل توجد متاجر في الطابق الأرضي وهل تم إزالة أي جدران؟', type: 'boolean' },
              { id: 2, text: 'هل ترى تآكلاً في الأعمدة أو تقشراً للخرسانة في القبو؟', type: 'boolean' },
              { id: 3, text: 'هل توجد شقوق على شكل "X" في العوارض؟', type: 'boolean' },
              { id: 4, text: 'هل تم بناء المبنى الخاص بك قبل عام 1999؟', type: 'boolean' }
            ],
            resultWarning: 'يظهر المبنى الخاص بك عوامل خطر ملحوظة. هذا الاختبار ليس تحليلاً هندسياً رسمياً. نوصي بالفحص الاحترافي.'
          },
          soil: {
            fayDist: 'المسافة إلى أقرب خط صدع نشط: ~3.4 كم',
            soilType: 'هيكل التربة: طمي / صلب متوسط (Z3)',
            regulations: [
              { year: 'قبل 1999', desc: 'كانت لوائح 1975 و 1998 سارية. كانت المعايير أقل بكثير من اليوم.' },
              { year: '1999-2018', desc: 'زادت لائحة 2007 المنقحة بعد الزلزال من عمليات التفتيش.' },
              { year: 'بعد 2018', desc: 'يخضع لأحدث وأكثر المعايير صرامة من لائحة زلازل المباني في تركيا.' }
            ]
          },
          report: {
            title: 'الإبلاغ عن انتهاك هيكلي',
            desc: 'أبلغ عن قطع الأعمدة المشتبه به أو التجديدات غير القانونية في متاجر الطابق الأرضي.',
            links: [
              { name: 'بوابة الحكومة الإلكترونية', icon: 'Globe' }
            ]
          },
          roadmap: {
            steps: [
              { title: 'تطبيق رسمي', desc: 'تقدم بطلب إلى "المسح السريع للمباني" التابع للبلدية أو المؤسسات المعتمدة من الوزارة.' },
              { title: 'ما هو اختبار اللب؟', desc: 'عملية أخذ عينات لقياس جودة الخرسانة. يجب أن يتم من قبل خبراء.' },
              { title: 'الحقوق القانونية', desc: 'تتوفر مساعدة الإيجار للتحول الحضري وقروض التعزيز المدعومة من الدولة.' }
            ]
          },
          emergency_local: {
            gatheringArea: 'أقرب منطقة تجمع: حديقة الجمهورية (150م)',
            daskInfo: 'لا تنس الاستعلام عن حالة بوليصة DASK الخاصة بك. أنت مغطى في حالة وقوع كارثة.'
          }
        },
        kitChecklist: [
          '💧 ماء (4 لتر للشخص في اليوم)',
          '🥫 طعام غير قابل للتلف (معلبات، بسكويت إلخ)',
          '🩹 حقيبة إسعافات أولية',
          '📻 راديو يعمل بالبطارية وبطاريات إضافية',
          '🔦 مصباح يدوي وبطاريات إضافية',
          '📢 صفارة',
          '🔪 سكين متعدد الاستخدامات، مقص، شريط لاصق',
          '🧼 مجموعة نظافة (صابون، كمامات، معقم)',
          '📄 نسخة من المستندat المهمة',
          '🔑 مفاتيح احتياطية',
          '🧣 بطانيات وملابس إضافية',
          '💊 الأدوية المعتادة'
        ],
        videoTitle: 'مقاطع فيديو تعليمية',
        videoDesc: 'البروتوكولات الأساسية.',
        simulationTitle: 'محاكاة الذعر',
        simulationDesc: 'اختبار وعي بالكوارث من 15 سؤالاً',
        generalSimulation: [
          { scenario: 'ماذا يجب أن نفعل في الداخل أثناء الزلزال؟', options: [{ text: 'الركض للخارج', correct: false }, { text: 'انزل، تغط، وتمسك', correct: true }, { text: 'استخدام المصعد', correct: false }] },
          { scenario: 'ما الذي يجب ألا تفعله إذا اندلع حريق دهون في المطبخ？', options: [{ text: 'صب الماء عليه', correct: true }, { text: 'إيقاف تشغيل الموقد', correct: false }, { text: 'تغطيته ببطانية حريق', correct: false }] },
          { scenario: 'كيف تخرج من غرفة مليئة بالدخان؟', options: [{ text: 'الركض', correct: false }, { text: 'القفز', correct: false }, { text: 'الزحف', correct: true }] },
          { scenario: 'ما هي الخطوة الأولى عند التحذير من الفيضانات؟', options: [{ text: 'الذهاب إلى القبو', correct: false }, { text: 'الانتقال إلى أرض مرتفعة', correct: true }, { text: 'القيادة بعيداً', correct: false }] },
          { scenario: 'ماذا تفعل إذا حوصرت في السرير أثناء زلزال؟', options: [{ text: 'حماية الرأس بوسادة والتكور', correct: true }, { text: 'القفز من النافذة', correct: false }, { text: 'الركض إلى الدرج', correct: false }] },
          { scenario: 'First step (PASS) when using a fire extinguisher?', options: [{ text: 'Aim the hose', correct: false }, { text: 'Pull the pin', correct: true }, { text: 'Squeeze the handle', correct: false }] },
          { scenario: 'Which is NOT needed in a disaster kit?', options: [{ text: 'Flashlight', correct: false }, { text: 'Porcelain plate', correct: true }, { text: 'Whistle', correct: false }] },
          { scenario: 'Is it safe to enter floodwaters?', options: [{ text: 'Yes, if it is shallow', correct: false }, { text: 'No, due to currents and diseases', correct: true }, { text: 'Only for swimmers', correct: false }] },
          { scenario: 'How to treat a minor burn in first aid?', options: [{ text: 'Apply toothpaste', correct: false }, { text: 'Cool running water for 10-15 mins', correct: true }, { text: 'Apply ice', correct: false }] },
          { scenario: 'Where to go if outdoors during an earthquake?', options: [{ text: 'Open area away from buildings', correct: true }, { text: 'Under trees', correct: false }, { text: 'Next to buildings', correct: false }] },
          { scenario: 'How to communicate post-disaster?', options: [{ text: 'Long phone calls', correct: false }, { text: 'Short SMS or internet apps', correct: true }, { text: 'Calling police repeatedly', correct: false }] },
          { scenario: 'If a door feels hot during a fire, what to do?', options: [{ text: 'Open it immediately', correct: false }, { text: 'Do not open, block the bottom', correct: true }, { text: 'Kick it open', correct: false }] },
          { scenario: 'How to stop bleeding in first aid?', options: [{ text: 'Pour hot water', correct: false }, { text: 'Apply direct pressure with clean cloth', correct: true }, { text: 'Leave it open', correct: false }] },
          { scenario: 'Can you drink tap water immediately after a flood?', options: [{ text: 'No, it might be contaminated', correct: true }, { text: 'Yes, if it flows', correct: false }, { text: 'Only without boiling', correct: false }] },
          { scenario: 'What to do if carbon monoxide leak is suspected?', options: [{ text: 'Sleep and rest', correct: false }, { text: 'Close windows', correct: false }, { text: 'Open windows and evacuate', correct: true }] }
        ]
      },
      logistics: {
        title: 'الاحتياجات والخدمات اللوجستية',
        subtitle: 'تتبع المخزون وطرق النقل',
        statVehicles: 'المركبات النشطة',
        createRoute: 'إنشاء مسار',
      },
      support: {
        title: 'الدعم والتطوع',
        subtitle: 'قوة المجتمع المستمرة',
        volunteerTitle: 'كن متطوعاً',
        volunteerDesc: 'انضم إلى فريقنا وقف بجانبنا في جهود ما بعد الكارثة.',
        formName: 'الاسم الكامل',
        formExpertise: 'مجال الخبرة',
        expertiseOptions: ['إسعافات أولية', 'خدمات لوجستية', 'بحث وإنقاذ', 'دعم نفسي واجتماعي'],
        volunteerTags: {
          health: 'صحة',
          tech: 'ميدان',
          logistics: 'لوجستي',
          language: 'لغة',
        },
        fieldOptions: {
          field: 'متطوع ميداني',
        },
        tasksTitle: 'لوحة المتطوعين',
        tasksSubtitle: 'سوق المهام الفوري',
        donationTitle: 'قنوات التبرع الموثوقة',
        donationSubtitle: 'جسر المؤسسة الرسمية',
        submit: 'إرسال الطلب'
      },
      faq: {
        title: 'أسئلة وأجوبة ومعلومات',
        subtitle: 'معلومات منقذة للحياة',
        qa: [
          { q: 'ماذا يجب أن أفعل أولاً أثناء الزلزال؟', a: 'قم بتطبيق طريقة انزل-تغط-تمسك. ابق بعيداً عن النوافذ والسلالم والمصاعد.' },
          { q: 'ماذا يجب أن أضع في حقيبة الطوارئ؟', a: 'ماء، صفارة، مصباح يدوي، حقيبة إسعافات أولية، بطاريات احتياطية، بطانية، وطعام جاف لمدة 3 أيام.' },
          { q: 'ماذا يجب أن أفعل عندما أتلقى تحذيراً من فيضان؟', a: 'أوقف تشغيل الكهرباء والغاز، وانتقل إلى أرض مرتفعة على الفور. لا تحاول قيادة سيارتك.' },
          { q: 'ماذا لو كانت الأبواب ساخنة أثناء الحريق؟', a: 'لا تفتح الباب. سد الدخان بقطع قماش مبللة تحت الباب واطلب المساعدة من can.' },
          { q: 'كيف يمكنني معرفة منطقة التجمع الخاصة بي؟', a: 'يمكنك معرفة أقرب نقطة آمنة لك باستخدام خدمة "الاستعلام عن منطقة التجمع في حالات الكوارث والطوارئ" على بوابة الحكومة الإلكترونية أو من خريطة "مناطق التجمع" في تطبيقنا.' },
          { q: 'ماذا أفعل إذا حوصرت تحت الأنقاض؟', a: 'Panik yapmamaya çalışın ve enerjinizi koruyun. Toz yutmamak için ağzınızı bir bezle kapatın. Dışarıdan ses duyduğunuzda borulara vurarak veya düdük çalarak yerinizi belli edin.' },
          { q: 'ما هي المدة الزمنية للإبلاغ عن مطالبة DASK؟', a: 'Hasarı öğrendiğiniz tarihten itibaren en geç 15 iş günü içinde DASK\'a (Alo 125, e-Devlet veya web sitesi üzerinden) bildirim yapmanız gerekmektedir.' }
        ]
      }
    }
  }
};

// --- Types ---


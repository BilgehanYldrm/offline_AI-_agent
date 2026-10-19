export const ASSEMBLY_POINTS = [
  // İstanbul
  { id: 'ist1', city: 'İstanbul', district: 'Kadıköy', address: 'Moda Sahil Parkı Yanı, No:12', pos: [40.9901, 29.0236] as [number, number], types: ['earthquake', 'flood'] },
  { id: 'ist2', city: 'İstanbul', district: 'Beşiktaş', address: 'Abbasağa Parkı İçi, Beşiktaş', pos: [41.0428, 29.0075] as [number, number], types: ['earthquake'] },
  { id: 'ist3', city: 'İstanbul', district: 'Üsküdar', address: 'Fethi Paşa Korusu Girişi', pos: [41.0267, 29.0167] as [number, number], types: ['earthquake', 'fire'] },
  { id: 'ist4', city: 'İstanbul', district: 'Avcılar', address: 'Denizköşkler Sahil Parkı', pos: [40.9801, 28.7175] as [number, number], types: ['earthquake'] },
  { id: 'ist5', city: 'İstanbul', district: 'Esenyurt', address: 'Recep Tayyip Erdoğan Parkı', pos: [41.0343, 28.6801] as [number, number], types: ['earthquake', 'flood'] },
  { id: 'ist6', city: 'İstanbul', district: 'Başakşehir', address: 'Sular Vadisi Etkinlik Alanı', pos: [41.0967, 28.8000] as [number, number], types: ['earthquake', 'flood'] },
  { id: 'ist7', city: 'İstanbul', district: 'Maltepe', address: 'Maltepe Etkinlik Alanı B Kapısı', pos: [40.9248, 29.1311] as [number, number], types: ['earthquake'] },
  { id: 'ist8', city: 'İstanbul', district: 'Pendik', address: 'Pendik Sahil Meydanı', pos: [40.8769, 29.2311] as [number, number], types: ['earthquake'] },
  { id: 'ist9', city: 'İstanbul', district: 'Kartal', address: 'Kartal Meydanı, Sahil Yolu', pos: [40.8886, 29.1853] as [number, number], types: ['earthquake'] },
  { id: 'ist10', city: 'İstanbul', district: 'Fatih', address: 'Yedikule Hisarı Yanı', pos: [41.0125, 28.9482] as [number, number], types: ['earthquake'] },
  { id: 'ist11', city: 'İstanbul', district: 'Şişli', address: 'Maçka Demokrasi Parkı Üst Giriş', pos: [41.0601, 28.9876] as [number, number], types: ['earthquake', 'fire'] },

  // Ankara
  { id: 'ank1', city: 'Ankara', district: 'Çankaya', address: 'Kuğulu Park Yanı, Tunalı', pos: [39.9208, 32.8541] as [number, number] },
  { id: 'ank2', city: 'Ankara', district: 'Kızılay', address: 'Güvenpark Meydanı', pos: [39.9201, 32.8531] as [number, number] },
  { id: 'ank3', city: 'Ankara', district: 'Etimesgut', address: 'Türk Beyleri Kent Meydanı', pos: [39.9498, 32.6636] as [number, number] },
  { id: 'ank4', city: 'Ankara', district: 'Keçiören', pos: [39.9781, 32.8647] as [number, number], address: 'Kalaba Kent Meydanı' },
  { id: 'ank5', city: 'Ankara', district: 'Yenimahalle', pos: [39.9546, 32.8011] as [number, number], address: 'Yenimahalle Belediyesi Yanı' },
  { id: 'ank6', city: 'Ankara', district: 'Mamak', pos: [39.9419, 32.9011] as [number, number], address: '75. Yıl Parkı İçi' },

  // İzmir
  { id: 'izm1', city: 'İzmir', district: 'Konak', address: 'Gündoğdu Meydanı, Kordon', pos: [38.4192, 27.1287] as [number, number] },
  { id: 'izm2', city: 'İzmir', district: 'Karşıyaka', address: 'Karşıyaka İskele Meydanı', pos: [38.4552, 27.1278] as [number, number] },
  { id: 'izm3', city: 'İzmir', district: 'Bornova', pos: [38.4632, 27.2163] as [number, number], address: 'Aşık Veysel Rekreasyon Alanı' },
  { id: 'izm4', city: 'İzmir', district: 'Buca', pos: [38.3845, 27.1632] as [number, number], address: 'Hasanağa Bahçesi Tarihi Giriş' },

  // Antalya
  { id: 'ant1', city: 'Antalya', district: 'Muratpaşa', address: 'Karaalioğlu Parkı İçi', pos: [36.8848, 30.7056] as [number, number] },
  { id: 'ant2', city: 'Antalya', district: 'Kepez', address: 'Dokuma Park Alanı', pos: [36.9200, 30.6900] as [number, number] },
  { id: 'ant3', city: 'Antalya', district: 'Konyaaltı', address: 'Hurma Mah. Semt Pazarı Alanı', pos: [36.8624, 30.6315] as [number, number] },

  // Bursa
  { id: 'bur1', city: 'Bursa', district: 'Osmangazi', address: 'Merinos Kültür Parkı', pos: [40.1824, 29.0611] as [number, number] },
  { id: 'bur2', city: 'Bursa', district: 'Nilüfer', address: 'Üç Fidan Parkı', pos: [40.2100, 28.9500] as [number, number] },
  { id: 'bur3', city: 'Bursa', district: 'Yıldırım', address: 'Kaplıkaya Cazibe Merkezi Yanı', pos: [40.1834, 29.0911] as [number, number] },

  // Others
  { id: 'adi1', city: 'Adıyaman', district: 'Merkez', address: 'Mimar Sinan Parkı', pos: [37.7648, 38.2763] as [number, number] },
  { id: 'hat1', city: 'Hatay', district: 'Antakya', address: 'Atatürk Parkı Meydanı', pos: [36.2023, 36.1606] as [number, number] },
  { id: 'hat2', city: 'Hatay', district: 'İskenderun', address: 'Anıt Alanı Sahil', pos: [36.5833, 36.1667] as [number, number] },
  { id: 'kah1', city: 'Kahramanmaraş', district: 'Pazarcık', address: 'Hükümet Konağı Önü', pos: [37.5858, 37.5133] as [number, number] },
  { id: 'kah2', city: 'Kahramanmaraş', district: 'Onikişubat', address: 'Kılavuzlu Mesire Alanı', pos: [37.5900, 36.9200] as [number, number] },
  { id: 'gaz1', city: 'Gaziantep', district: 'Şahinbey', address: '100. Yıl Kültür Parkı', pos: [37.0500, 37.3800] as [number, number] },
  { id: 'gaz2', city: 'Gaziantep', district: 'Şehitkamil', address: 'Anıt Park İçi', pos: [37.0800, 37.3700] as [number, number] },
  { id: 'ada1', city: 'Adana', district: 'Seyhan', address: 'Merkez Park Amfi Tiyatro Yanı', pos: [36.9914, 35.3308] as [number, number] },
  { id: 'ada2', city: 'Adana', district: 'Çukurova', address: 'Doğal Park Girişi', pos: [37.0400, 35.3000] as [number, number] },
  { id: 'kon1', city: 'Konya', district: 'Selçuklu', address: 'Kılıçarslan Şehir Meydanı', pos: [37.8748, 32.4931] as [number, number] },
  { id: 'kon2', city: 'Konya', district: 'Meram', address: 'Meram Bağları Girişi', pos: [37.8500, 32.4500] as [number, number] },
  { id: 'diy1', city: 'Diyarbakır', district: 'Sur', address: 'Dağkapı Meydanı', pos: [37.9100, 40.2400] as [number, number] },
  { id: 'diy2', city: 'Diyarbakır', district: 'Kayapınar', address: 'Park Orman İçi', pos: [37.9400, 40.1800] as [number, number] },
  { id: 'sam1', city: 'Samsun', district: 'Atakum', address: 'Çobanlı İskelesi Meydanı', pos: [41.3300, 36.2700] as [number, number] },
  { id: 'sam2', city: 'Samsun', district: 'İlkadım', address: 'Cumhuriyet Meydanı Anıt Yanı', pos: [41.2800, 36.3300] as [number, number] },
  { id: 'tra1', city: 'Trabzon', district: 'Ortahisar', address: 'Atatürk Alanı (Meydan Parkı)', pos: [41.0000, 39.7200] as [number, number] },
  { id: 'kay1', city: 'Kayseri', district: 'Melikgazi', address: 'Cumhuriyet Meydanı Saat Kulesi Yanı', pos: [38.7200, 35.4800] as [number, number] },
  { id: 'esk1', city: 'Eskişehir', district: 'Tepebaşı', address: 'Şelale Park Yanı', pos: [39.7800, 30.5200] as [number, number] },
  { id: 'koc1', city: 'Kocaeli', district: 'İzmit', address: 'Sekapark Etkinlik Alanı', pos: [40.7600, 29.9300] as [number, number] },
  { id: 'koc2', city: 'Kocaeli', district: 'Gebze', address: '15 Temmuz Milli İrade Kent Meydanı', pos: [40.8000, 29.4300] as [number, number] },
  { id: 'mgr1', city: 'Muğla', district: 'Bodrum', address: 'Bodrum Belediye Meydanı', pos: [37.0300, 27.4300] as [number, number] },
  { id: 'mgr2', city: 'Muğla', district: 'Menteşe', address: 'Muğla Kent Meydanı', pos: [37.2100, 28.3600] as [number, number] },
];


import sqlite3
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoruPaketi(BaseModel):
    soru: str

def sorudan_anahtar_kelime_bul_hizli(kullanici_sorusu):
    soru_temiz = kullanici_sorusu.lower()
    
    if any(kök in soru_temiz for kök in ["yan", "ynk", "ateş", "alev"]):
        return "yanık"
    elif any(kök in soru_temiz for kök in ["kan", "kesi", "kop", "yara"]):
        return "kanama"
    elif any(kök in soru_temiz for kök in ["gaz", "koku", "sızınt", "şalter", "vana"]):
        return "gaz"
    elif any(kök in soru_temiz for kök in ["enkaz", "göçük", "altınd", "sıkış"]):
        return "enkaz"
    elif any(kök in soru_temiz for kök in ["çanta", "deprem ç", "cnta", "malzeme"]):
        return "deprem çantası"
    
    return "ilk yardım"

# ⚡ YENİLENEN VERİTABANI FONKSİYONU (Sadece ilgili başlığın altındaki dökümanı getirir)
def afet_veritabaninda_ara(soru_kelimesi):
    conn = sqlite3.connect('afet_bilgi.db')
    cursor = conn.cursor()
    
    # Kelimenin geçtiği dökümanları çekiyoruz
    cursor.execute("SELECT metin_parcasi FROM kaynak_dokumanlar WHERE metin_parcasi LIKE ?", (f'%{soru_kelimesi}%',))
    sonuclar = cursor.fetchall()
    conn.close()
    
    if sonuclar:
        # 🎯 EN YÜKSEK ÖNCELİKLİ EŞLEŞME (Başlık Kontrolü)
        # Çekilen dökümanlar arasında, aradığımız kelime hangi dökümanın ilk 30 karakterinde (yani başlığında) geçiyorsa onu seç.
        for satir in sonuclar:
            metin = satir[0]
            if soru_kelimesi.lower() in metin[:30].lower():
                print(f"🎯 Nokta Atışı Başlık Eşleşmesi: {soru_kelimesi.upper()}")
                return metin
        
        # Eğer özellikle başlıkta bulamazsa, içinde geçen ilk dökümanı döndür
        return sonuclar[0][0]
        
    return "Veritabanında bu konuyla ilgili acil müdahale bilgisi bulunamadı."

@app.post("/soru-sor")
def yapay_zekaya_sor(paket: SoruPaketi):
    kullanici_sorusu = paket.soru
    
    arama_anahtari = sorudan_anahtar_kelime_bul_hizli(kullanici_sorusu)
    veritabanindan_gelen_bilgi = afet_veritabaninda_ara(arama_anahtari)
    
    sistem_talimati = f"""
    Sen Türkiye Afette Elele projesinin acil durum yapay zeka asistanısın.
    Kullanıcı şu an büyük bir panik içinde. Sadece sana verilen 'GÜVENİLİR BİLGİ' başlığı altındaki maddeleri oku ve cevapla.
    
    TALİMATLAR:
    1. Kesinlikle başka konulardan (Örn: Enkaz, deprem çantası) bahsetme. Sadece soruyla eşleşen maddeleri yaz.
    2. Cevabın İNANILMAZ KISA, NET ve EMİR KİPİYLE olmalıdır.
    3. Giriş veya sonuç cümleleri asla yazma. Doğrudan maddeleri ver.

    GÜVENİLİR BİLGİ:
    {veritabanindan_gelen_bilgi}
    """
    
    ollama_url = "http://localhost:11434/api/chat"
    veri_paketi = {
        "model": "llama3:8b", 
        "messages": [
            {"role": "system", "content": sistem_talimati},
            {"role": "user", "content": kullanici_sorusu}
        ],
        "stream": False
    }
    
    try:
        response = requests.post(ollama_url, json=veri_paketi)
        if response.status_code == 200:
            return {"cevap": response.json()['message']['content']}
    except:
        pass
    return {"cevap": "Sistem şu an yoğun, lütfen 112'yi arayın."}
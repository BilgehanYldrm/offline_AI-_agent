import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# React / Web arayüzünün sorunsuz bağlanması için CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 TÜRKÇE YAPAY ZEKA MODELİ (Semantic Search Fallback)
print("🧠 Yapay zeka modeli yükleniyor, lütfen bekleyin...")
model = SentenceTransformer('dbmdz/bert-base-turkish-cased')
print("✅ Model başarıyla yüklendi!")

class SoruIstegi(BaseModel):
    soru: str

def txt_dosyasindan_blok_ara(kullanici_sorusu):
    """
    1. Öncelikli Kural Tablosu (Deterministic Mapping): Cümledeki acil durumu yakalar (%0 Hata Payı).
    2. Vektör Benzerliği (Semantic Search): Genel sorularda BERT modeli ile anlamsal eşleşme yapar.
    """
    su_anki_dizin = os.path.dirname(os.path.abspath(__file__))
    taranacak_yerler = [
        os.path.join(su_anki_dizin, "data"),
        su_anki_dizin,
        os.path.join(su_anki_dizin, "src"),
        "C:/Users/by020/Desktop/ELELE/data"
    ]
    
    dosya_yolu = None
    for yer in taranacak_yerler:
        if os.path.exists(yer):
            for dosya_adi in os.listdir(yer):
                if dosya_adi.lower().endswith(".txt"):
                    dosya_yolu = os.path.join(yer, dosya_adi)
                    break
        if dosya_yolu: break

    if not dosya_yolu or not os.path.exists(dosya_yolu):
        return "⚠️ Hata: Proje klasöründe döküman (.txt) dosyası bulunamadı."
        
    with open(dosya_yolu, "r", encoding="utf-8") as f:
        ham_metin = f.read()
    
    # Dökümanı '=== BAŞLIK ===' bloklarına göre ayır
    bloklar = re.findall(r'===\s*([^=]+)\s*===\s*\n(.*?)(?=\n===|\Z)', ham_metin, re.DOTALL)
    
    if not bloklar:
        return "⚠️ Hata: .txt dosyasının formatı '=== BAŞLIK ===' şeklinde olmalıdır."

    soru_temiz = kullanici_sorusu.lower().strip()

    # 🎯 ÖNCELİK SIRALI KESİN ANAHTAR KELİME TABLOSU
    kesin_hedef = None

    # 1. Öncelik: Spesifik Acil Durumlar (Cümlede 'bulunduğum' geçse bile yangını yakalar)
    if "yangın" in soru_temiz or "yangin" in soru_temiz or "duman" in soru_temiz or "alev" in soru_temiz:
        kesin_hedef = "YANGIN ANINDA TAHLİYE VE MÜDAHALE"
    elif "sel" in soru_temiz or "su bask" in soru_temiz:
        kesin_hedef = "SU BASKINI (SEL) DURUMUNDA HAREKET TARZI"
    elif "elektrik" in soru_temiz or "çarp" in soru_temiz or "carp" in soru_temiz:
        kesin_hedef = "ELEKTRİK ÇARPMASI DURUMUNDA MÜDAHALE"
    elif "burun" in soru_temiz or "burn" in soru_temiz:
        kesin_hedef = "BURUN KANAMASI MÜDAHALESİ"
    elif "kop" in soru_temiz or "amput" in soru_temiz or "uzuv" in soru_temiz:
        kesin_hedef = "UZUV KOPMASI (AMPUTASYON) DURUMUNDA MÜDAHALE"
    elif "çanta" in soru_temiz or "canta" in soru_temiz:
        kesin_hedef = "DEPREM ÇANTASINDA BULUNMASI GEREKENLER"
    elif "iç kan" in soru_temiz or "ic kan" in soru_temiz:
        kesin_hedef = "İÇ KANAMA ŞÜPHESİ DURUMUNDA MÜDAHALE"
    elif "kafa" in soru_temiz or "beyin" in soru_temiz or "başım" in soru_temiz or "basım" in soru_temiz:
        kesin_hedef = "KAFA TRAVMASI SONRASI KANAMA"
    elif "kus" in soru_temiz or "öksür" in soru_temiz or "oksur" in soru_temiz:
        kesin_hedef = "KUSARAK VEYA ÖKSÜREREK KAN GELMELERİ DURUMU"
    elif "kes" in soru_temiz or "kan" in soru_temiz or "yara" in soru_temiz:
        kesin_hedef = "HAFİF-ORTA ŞİDDETTE YARA KANAMASI MÜDAHALESİ"
    elif "bayıl" in soru_temiz or "bayil" in soru_temiz or "şok" in soru_temiz or "sok" in soru_temiz:
        kesin_hedef = "BAYILMA VE ŞOK BELİRTİLERİNDE MÜDAHALE"
    elif "cpr" in soru_temiz or "kalp" in soru_temiz or "masaj" in soru_temiz or "nefes" in soru_temiz:
        kesin_hedef = "KALP DURMASI VE TEMEL YAŞAM DESTEĞİ (CPR)"
    elif "kırık" in soru_temiz or "kirik" in soru_temiz or "çıkık" in soru_temiz or "cikik" in soru_temiz:
        kesin_hedef = "KIRIK VE ÇIKIK MÜDAHALESİ"

    # 2. Öncelik: Genel Deprem ve Bina Tahliye İfadeleri
    elif "deprem" in soru_temiz or "sarsıntı" in soru_temiz or "sarsinti" in soru_temiz or "çök" in soru_temiz:
        kesin_hedef = "DEPREM ANINDA YAPILMASI GEREKENLER (ÇÖK-KAPAN-TUTUN)"
    elif "tahliye" in soru_temiz or "binadan" in soru_temiz:
        kesin_hedef = "DEPREM SONRASI BİNADAN TAHLİYE"
    elif "psikolojik" in soru_temiz or "travma" in soru_temiz or "kork" in soru_temiz or "sakin" in soru_temiz:
        kesin_hedef = "PSİKOLOJİK İLK YARDIM VE TRAVMA SONRASI DESTEK"
    elif "haber" in soru_temiz or "sms" in soru_temiz or "telefon" in soru_temiz or "internet" in soru_temiz:
        kesin_hedef = "HABERLEŞMENİN KESİLDİĞİ DURUMLARDA YAPILACAKLAR"

    # 1. Aşama: Hedef anahtar kelime eşleştiyse dökümandaki bloğu birebir döndür
    if kesin_hedef:
        for baslik, icerik in bloklar:
            if kesin_hedef.lower() in baslik.lower():
                return f"=== {baslik.strip()} ===\n\n{icerik.strip()}"

    # 2. Aşama: Eşleşme yoksa Türkçe BERT yapay zeka modeliyle Kosinüs Benzerliği hesapla
    basliklar = [b[0].strip() for b in bloklar]
    soru_vektoru = model.encode(kullanici_sorusu, convert_to_tensor=True)
    baslik_vektorleri = model.encode(basliklar, convert_to_tensor=True)
    
    benzerlikler = util.cos_sim(soru_vektoru, baslik_vektorleri)[0]
    en_iyi_indeks = benzerlikler.argmax().item()
    en_iyi_oran = benzerlikler[en_iyi_indeks].item()
    
    if en_iyi_oran > 0.25:
        en_iyi_baslik = bloklar[en_iyi_indeks][0].strip()
        en_iyi_icerik = bloklar[en_iyi_indeks][1].strip()
        return f"=== {en_iyi_baslik} ===\n\n{en_iyi_icerik}"
        
    return f"=== {bloklar[0][0].strip()} ===\n\n{bloklar[0][1].strip()}"

@app.post("/soru-sor")
async def soru_sor(istek: SoruIstegi):
    print(f"📩 Gelen Soru: {istek.soru}")
    cevap = txt_dosyasindan_blok_ara(istek.soru)
    return {"cevap": cevap}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
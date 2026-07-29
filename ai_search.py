import os
import re
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

class SoruIstegi(BaseModel):
    soru: str

def txt_dosyasindan_blok_ara(kullanici_sorusu):
    """
    Klasördeki .txt dosyasını bulur ve kullanıcının sorusuna en uygun
    ilk yardım bloğunu hiçe saymadan BİREBİR getirir.
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
        return "⚠️ Hata: Proje klasöründe .txt dökümanı bulunamadı."
        
    with open(dosya_yolu, "r", encoding="utf-8") as f:
        ham_metin = f.read()
    
    # Metni '=== BAŞLIK ===' yapısına göre parçalara ayır
    bloklar = re.findall(r'===\s*([^=]+)\s*===\s*\n(.*?)(?=\n===|\Z)', ham_metin, re.DOTALL)
    
    soru_temiz = kullanici_sorusu.lower().strip()

    kesin_hedef = None

    # 🎯 EKLERDEN BAĞIMSIZ HARF KÖKÜ HARİTASI
    if "kop" in soru_temiz or "amput" in soru_temiz or "uzuv" in soru_temiz:
        kesin_hedef = "UZUV KOPMASI (AMPUTASYON) DURUMUNDA MÜDAHALE"
    elif "burun" in soru_temiz or "burn" in soru_temiz:
        kesin_hedef = "BURUN KANAMASI MÜDAHALESİ"
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
    elif "sel" in soru_temiz or "su bask" in soru_temiz:
        kesin_hedef = "SU BASKINI (SEL) DURUMUNDA HAREKET TARZI"
    elif "çanta" in soru_temiz or "canta" in soru_temiz:
        kesin_hedef = "DEPREM ÇANTASINDA BULUNMASI GEREKENLER"
    elif "elektrik" in soru_temiz or "çarp" in soru_temiz or "carp" in soru_temiz:
        kesin_hedef = "ELEKTRİK ÇARPMASI DURUMUNDA MÜDAHALE"
    elif "yangın" in soru_temiz or "yangin" in soru_temiz or "duman" in soru_temiz or "alev" in soru_temiz:
        kesin_hedef = "YANGIN ANINDA TAHLİYE VE MÜDAHALE"
    elif "tahliye" in soru_temiz or "bina" in soru_temiz or "çık" in soru_temiz or "cik" in soru_temiz:
        kesin_hedef = "DEPREM SONRASI BİNADAN TAHLİYE"
    elif "deprem" in soru_temiz or "sarsıntı" in soru_temiz or "sarsinti" in soru_temiz or "çök" in soru_temiz:
        kesin_hedef = "DEPREM ANINDA YAPILMASI GEREKENLER (ÇÖK-KAPAN-TUTUN)"
    elif "psikolojik" in soru_temiz or "travma" in soru_temiz or "kork" in soru_temiz:
        kesin_hedef = "PSİKOLOJİK İLK YARDIM VE TRAVMA SONRASI DESTEK"
    elif "kırık" in soru_temiz or "kirik" in soru_temiz or "çıkık" in soru_temiz or "cikik" in soru_temiz:
        kesin_hedef = "KIRIK VE ÇIKIK MÜDAHALESİ"
    elif "haber" in soru_temiz or "sms" in soru_temiz or "telefon" in soru_temiz:
        kesin_hedef = "HABERLEŞMENİN KESİLDİĞİ DURUMLARDA YAPILACAKLAR"

    # Eğer hedef eşleştiyse .txt dosyasındaki başlığı ve içeriği HİÇ DEĞİŞTİRMEDEN BİREBİR dön
    if kesin_hedef:
        for baslik, icerik in bloklar:
            if kesin_hedef.lower() in baslik.lower():
                return f"=== {baslik.strip()} ===\n\n{icerik.strip()}"

    # Eşleşme yoksa metindeki ilk bloğu birebir dön
    return f"=== {bloklar[0][0].strip()} ===\n\n{bloklar[0][1].strip()}"

@app.post("/soru-sor")
@app.post("/ask")
@app.post("/chat")
@app.post("/api/chat")
async def yapay_zeka_cevapla(istek: SoruIstegi):
    cevap = txt_dosyasindan_blok_ara(istek.soru)
    # Frontend hem 'cevap', hem 'response', hem de 'message' key'lerini bekliyor olabilir
    return {
        "cevap": cevap,
        "response": cevap,
        "message": cevap
    }
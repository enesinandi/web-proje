/* =========================================================
   tvmaze-api.js
   ---------------------------------------------------------
   Bu dosya, ilgi-alanlarim.html sayfasında TVMaze API
   üzerinden popüler dizi ve film verilerini çeker ve
   sayfada gösterir.

   Kullanılan teknik: fetch() + async/await
   API: https://www.tvmaze.com/api (ücretsiz, key gerekmez)
   ========================================================= */

const API_BASE = "https://api.tvmaze.com";

// Sayfa yüklendiğinde verileri çek
document.addEventListener("DOMContentLoaded", function () {
    populerDizileriGetir();
    arananDizileriGetir();
});


/* =========================================================
   1) POPÜLER DİZİLER (Sayfa yüklenince otomatik çekilir)
   ========================================================= */
async function populerDizileriGetir() {
    const hedef = document.getElementById("populer-diziler");

    try {
        // Show 1-12 (popüler dizilerin ID'leri)
        const cevap = await fetch(`${API_BASE}/shows?page=0`);

        if (!cevap.ok) {
            throw new Error(`HTTP hatası: ${cevap.status}`);
        }

        const veri = await cevap.json();

        // İlk 12 diziyi al, puanına göre sırala
        const diziler = veri
            .filter(d => d.rating && d.rating.average)
            .sort((a, b) => b.rating.average - a.rating.average)
            .slice(0, 12);

        let html = "";
        diziler.forEach(dizi => {
            const resim = dizi.image && dizi.image.medium
                ? dizi.image.medium
                : "https://placehold.co/210x295/2c3e50/ffffff?text=Resim+Yok";
            const puan = dizi.rating.average || "-";
            const yil = dizi.premiered ? new Date(dizi.premiered).getFullYear() : "-";
            const turler = dizi.genres && dizi.genres.length > 0 ? dizi.genres.join(", ") : "-";
            const ozet = dizi.summary
                ? kisalt(dizi.summary.replace(/<[^>]+>/g, ""), 120)
                : "Açıklama bulunamadı.";

            html += `
                <div class="col-md-6 col-lg-4">
                    <article class="kart h-100">
                        <div class="row g-3">
                            <div class="col-4">
                                <img src="${resim}" alt="${dizi.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-8">
                                <h3 style="font-size: 1.1rem;">${dizi.name}</h3>
                                <div class="mb-2">
                                    <span class="badge bg-warning text-dark">
                                        <i class="bi bi-star-fill"></i> ${puan}
                                    </span>
                                    <span class="badge bg-secondary">${yil}</span>
                                </div>
                                <p class="small text-muted mb-2">
                                    <i class="bi bi-tag-fill"></i> ${turler}
                                </p>
                            </div>
                        </div>
                        <p class="small mt-3 mb-0">${ozet}</p>
                        ${dizi.officialSite
                            ? `<a href="${dizi.officialSite}" target="_blank" rel="noopener" class="btn btn-sm btn-anahat mt-3">
                                 <i class="bi bi-box-arrow-up-right"></i> Detay
                               </a>`
                            : ""}
                    </article>
                </div>
            `;
        });

        hedef.innerHTML = html;

    } catch (hata) {
        hedef.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Diziler şu anda yüklenemedi.
                    <br><small class="text-muted">Hata: ${hata.message}</small>
                </div>
            </div>
        `;
        console.error("Dizi listesi hatası:", hata);
    }
}


/* =========================================================
   2) ARAMA KUTUSU
   ========================================================= */
function arananDizileriGetir() {
    const buton = document.getElementById("ara-btn");
    const input = document.getElementById("ara-input");

    if (!buton || !input) return;

    // Butona tıklayınca ara
    buton.addEventListener("click", function () {
        const sorgu = input.value.trim();
        if (sorgu) {
            ara(sorgu);
        }
    });

    // Enter'a basınca da ara
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const sorgu = input.value.trim();
            if (sorgu) {
                ara(sorgu);
            }
        }
    });
}


async function ara(sorgu) {
    const hedef = document.getElementById("arama-sonuclari");

    // Yüklenirken spinner göster
    hedef.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border" role="status" style="color: var(--renk-vurgu);">
                <span class="visually-hidden">Aranıyor...</span>
            </div>
            <p class="mt-3 text-muted">"${sorgu}" aranıyor...</p>
        </div>
    `;

    try {
        const cevap = await fetch(`${API_BASE}/search/shows?q=${encodeURIComponent(sorgu)}`);

        if (!cevap.ok) {
            throw new Error(`HTTP hatası: ${cevap.status}`);
        }

        const veri = await cevap.json();

        if (veri.length === 0) {
            hedef.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="bi bi-info-circle me-2"></i>
                        "${sorgu}" için sonuç bulunamadı.
                    </div>
                </div>
            `;
            return;
        }

        // İlk 6 sonucu göster
        const sonuclar = veri.slice(0, 6);

        let html = `
            <div class="col-12 mb-3">
                <h3 class="text-center">"${sorgu}" için ${sonuclar.length} sonuç bulundu</h3>
            </div>
        `;

        sonuclar.forEach(item => {
            const dizi = item.show;
            const resim = dizi.image && dizi.image.medium
                ? dizi.image.medium
                : "https://placehold.co/210x295/2c3e50/ffffff?text=Resim+Yok";
            const puan = (dizi.rating && dizi.rating.average) || "-";
            const yil = dizi.premiered ? new Date(dizi.premiered).getFullYear() : "-";
            const turler = dizi.genres && dizi.genres.length > 0 ? dizi.genres.join(", ") : "-";
            const ozet = dizi.summary
                ? kisalt(dizi.summary.replace(/<[^>]+>/g, ""), 150)
                : "Açıklama bulunamadı.";

            html += `
                <div class="col-md-6 col-lg-4">
                    <article class="kart h-100">
                        <div class="row g-3">
                            <div class="col-4">
                                <img src="${resim}" alt="${dizi.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-8">
                                <h3 style="font-size: 1.1rem;">${dizi.name}</h3>
                                <div class="mb-2">
                                    <span class="badge bg-warning text-dark">
                                        <i class="bi bi-star-fill"></i> ${puan}
                                    </span>
                                    <span class="badge bg-secondary">${yil}</span>
                                </div>
                                <p class="small text-muted mb-2">
                                    <i class="bi bi-tag-fill"></i> ${turler}
                                </p>
                            </div>
                        </div>
                        <p class="small mt-3 mb-0">${ozet}</p>
                    </article>
                </div>
            `;
        });

        hedef.innerHTML = html;

    } catch (hata) {
        hedef.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Arama sırasında bir hata oluştu.
                    <br><small class="text-muted">Hata: ${hata.message}</small>
                </div>
            </div>
        `;
        console.error("Arama hatası:", hata);
    }
}


/* =========================================================
   YARDIMCI: Uzun metni kısalt
   ========================================================= */
function kisalt(metin, uzunluk) {
    if (!metin) return "";
    if (metin.length <= uzunluk) return metin;
    return metin.substring(0, uzunluk).trim() + "...";
}

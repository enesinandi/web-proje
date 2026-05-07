/* iletisim-form.js

   Bu dosya iletisim.html'deki formu iki farklı yöntemle
   doğrular:

     1) NATIVE JAVASCRIPT  -> "Native JS ile Gönder" butonu
     2) VUE.JS 3 (CDN)     -> "Vue.js ile Gönder" butonu
*/

// Email format kontrolü için regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Telefon: sadece rakam, en az 10 en fazla 11 hane
const TELEFON_REGEX = /^[0-9]{10,11}$/;


/*  1) NATIVE JAVASCRIPT İLE DOĞRULAMA */
document.addEventListener("DOMContentLoaded", function () {

    const nativeButon = document.getElementById("btn-native");
    if (!nativeButon) return;

    nativeButon.addEventListener("click", function () {
        // tüm hata mesajlarını temizle
        hatalariTemizle();

        // Form alanlarını al
        const ad = document.getElementById("ad").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefon = document.getElementById("telefon").value.trim();
        const konu = document.getElementById("konu").value;
        const cinsiyet = document.querySelector('input[name="cinsiyet"]:checked');
        const iletisimTercih = document.querySelectorAll('input[name="iletisim_tercih[]"]:checked');
        const mesaj = document.getElementById("mesaj").value.trim();
        const kvkk = document.getElementById("kvkk").checked;

        let hataVar = false;

        // 1. Ad kontrolü
        if (ad === "") {
            hataGoster("hata-ad", "Ad Soyad alanı boş bırakılamaz.");
            hataVar = true;
        } else if (ad.length < 3) {
            hataGoster("hata-ad", "Ad Soyad en az 3 karakter olmalıdır.");
            hataVar = true;
        }

        // 2. E-posta kontrolü
        if (email === "") {
            hataGoster("hata-email", "E-posta alanı boş bırakılamaz.");
            hataVar = true;
        } else if (!EMAIL_REGEX.test(email)) {
            hataGoster("hata-email", "Geçerli bir e-posta adresi giriniz.");
            hataVar = true;
        }

        // 3. Telefon kontrolü (sadece rakam, 10-11 hane)
        if (telefon === "") {
            hataGoster("hata-telefon", "Telefon alanı boş bırakılamaz.");
            hataVar = true;
        } else if (!TELEFON_REGEX.test(telefon)) {
            hataGoster("hata-telefon", "Telefon sadece rakam içermeli ve 10-11 hane olmalıdır.");
            hataVar = true;
        }

        // 4. Konu kontrolü
        if (konu === "") {
            hataGoster("hata-konu", "Lütfen bir konu seçin.");
            hataVar = true;
        }

        // 5. Cinsiyet kontrolü
        if (!cinsiyet) {
            hataGoster("hata-cinsiyet", "Lütfen bir seçenek işaretleyin.");
            hataVar = true;
        }

        // 6. En az bir iletişim tercihi
        if (iletisimTercih.length === 0) {
            hataGoster("hata-iletisim-tercih", "En az bir iletişim tercihi seçmelisiniz.");
            hataVar = true;
        }

        // 7. Mesaj kontrolü
        if (mesaj === "") {
            hataGoster("hata-mesaj", "Mesaj alanı boş bırakılamaz.");
            hataVar = true;
        } else if (mesaj.length < 10) {
            hataGoster("hata-mesaj", "Mesaj en az 10 karakter olmalıdır.");
            hataVar = true;
        }

        // 8. KVKK kontrolü
        if (!kvkk) {
            hataGoster("hata-kvkk", "Devam etmek için KVKK onayı vermelisiniz.");
            hataVar = true;
        }

        // Sonuç
        if (hataVar) {
            // Sayfayı yukarı kaydır ki kullanıcı hataları görebilsin
            document.getElementById("iletisim-form-alani").scrollIntoView({ behavior: "smooth" });
            return;
        }

        // Hepsi doğruysa formu gönder
        alert("Native JS ile doğrulama başarılı! Form gönderiliyor...");
        document.getElementById("iletisim-form").submit();
    });

});

// hata mesajı yaz
function hataGoster(elemanId, mesaj) {
    const eleman = document.getElementById(elemanId);
    if (eleman) {
        eleman.textContent = mesaj;
    }
}

// hata mesajlarını temizle
function hatalariTemizle() {
    const hataAlanlari = document.querySelectorAll(".text-danger[id^='hata-']");
    hataAlanlari.forEach(el => el.textContent = "");
}


/*
   2) VUE.JS İLE DOĞRULAMA

   Vue.js Composition API kullanmıyoruz; daha okunaklı olduğu
   için klasik Options API ile yazıyoruz. Vue 3'ün CDN
   sürümü (vue.global.prod.js) script tag ile yüklenmiştir.
*/
const { createApp } = Vue;

createApp({
    data() {
        return {
            // Form alanları (v-model ile bağlı)
            ad: "",
            email: "",
            telefon: "",
            konu: "",
            cinsiyet: "",
            iletisimTercih: [],
            mesaj: "",
            kvkk: false,

            // Vue tarafından gösterilecek mesaj
            vueMesaj: "",
            vueBasarili: false
        };
    },

    methods: {
        vueIleDogrula() {
            // Hata mesajını sıfırla
            this.vueMesaj = "";
            this.vueBasarili = false;

            // Hataları topla
            const hatalar = [];

            // 1. Ad
            if (!this.ad || this.ad.trim() === "") {
                hatalar.push("Ad Soyad boş bırakılamaz.");
            } else if (this.ad.trim().length < 3) {
                hatalar.push("Ad Soyad en az 3 karakter olmalıdır.");
            }

            // 2. E-posta
            if (!this.email || this.email.trim() === "") {
                hatalar.push("E-posta boş bırakılamaz.");
            } else if (!EMAIL_REGEX.test(this.email.trim())) {
                hatalar.push("Geçerli bir e-posta adresi giriniz.");
            }

            // 3. Telefon
            if (!this.telefon || this.telefon.trim() === "") {
                hatalar.push("Telefon boş bırakılamaz.");
            } else if (!TELEFON_REGEX.test(this.telefon.trim())) {
                hatalar.push("Telefon sadece rakam içermeli ve 10-11 hane olmalıdır.");
            }

            // 4. Konu
            if (!this.konu) {
                hatalar.push("Konu seçilmelidir.");
            }

            // 5. Cinsiyet
            if (!this.cinsiyet) {
                hatalar.push("Cinsiyet seçilmelidir.");
            }

            // 6. İletişim tercihi
            if (!this.iletisimTercih || this.iletisimTercih.length === 0) {
                hatalar.push("En az bir iletişim tercihi seçilmelidir.");
            }

            // 7. Mesaj
            if (!this.mesaj || this.mesaj.trim() === "") {
                hatalar.push("Mesaj boş bırakılamaz.");
            } else if (this.mesaj.trim().length < 10) {
                hatalar.push("Mesaj en az 10 karakter olmalıdır.");
            }

            // 8. KVKK
            if (!this.kvkk) {
                hatalar.push("KVKK onayı verilmelidir.");
            }

            // Sonuç
            if (hatalar.length > 0) {
                this.vueMesaj = "Vue.js doğrulama hataları:\n• " + hatalar.join("\n• ");
                this.vueBasarili = false;
                return;
            }

            // Hepsi doğru — başarı mesajı göster ve formu gönder
            this.vueMesaj = "Vue.js ile doğrulama başarılı! Form gönderiliyor...";
            this.vueBasarili = true;

            // 1 saniye bekle (kullanıcı mesajı görsün) sonra formu submit et
            setTimeout(() => {
                document.getElementById("iletisim-form").submit();
            }, 1000);
        }
    }

}).mount("#iletisim-form-alani");

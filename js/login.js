/*
   login.js

   login.html sayfasındaki giriş formunu doğrular.
   */


// E-posta format kontrolü için regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


document.addEventListener("DOMContentLoaded", function () {

    // 1) URL'de ?hata= parametresi varsa onu göster
    urldenHataGoster();

    // 2) Form gönderiminde doğrulama yap
    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        // Önce hata mesajlarını temizle
        document.getElementById("hata-kullanici").textContent = "";
        document.getElementById("hata-sifre").textContent = "";

        const kullanici = document.getElementById("kullanici").value.trim();
        const sifre = document.getElementById("sifre").value;

        let hataVar = false;

        // E-posta kontrolü
        if (kullanici === "") {
            document.getElementById("hata-kullanici").textContent =
                "E-posta alanı boş bırakılamaz.";
            hataVar = true;
        } else if (!EMAIL_REGEX.test(kullanici)) {
            document.getElementById("hata-kullanici").textContent =
                "Geçerli bir e-posta adresi giriniz.";
            hataVar = true;
        }

        // Şifre kontrolü (sadece boş olmaması yeterli — gerçek kontrol PHP'de)
        if (sifre === "") {
            document.getElementById("hata-sifre").textContent =
                "Şifre alanı boş bırakılamaz.";
            hataVar = true;
        }

        // Hata varsa formu gönderme
        if (hataVar) {
            event.preventDefault();
        }
        // Hata yoksa form normal akışta PHP'ye POST edilir
    });
});


/**
 * URL'deki ?hata=kod parametresini okuyup uygun mesajı gösterir.
 * Bu parametre login-check.php'nin başarısız girişten sonra
 * yaptığı geri yönlendirme ile gelir.
 */
function urldenHataGoster() {
    const params = new URLSearchParams(window.location.search);
    const hataKodu = params.get("hata");

    if (!hataKodu) return;

    // Hata kodlarına göre mesaj eşle
    const mesajlar = {
        "bos":   "Lütfen tüm alanları doldurun.",
        "yanlis": "E-posta veya şifre hatalı. Tekrar deneyin.",
        "yontem": "Geçersiz istek yöntemi."
    };

    const mesaj = mesajlar[hataKodu] || "Bir hata oluştu. Tekrar deneyin.";

    const kutu = document.getElementById("hata-kutusu");
    const metin = document.getElementById("hata-metni");

    if (kutu && metin) {
        metin.textContent = mesaj;
        kutu.classList.remove("d-none");
    }
}

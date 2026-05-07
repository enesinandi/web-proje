<?php
/*
 * login-check.php
 * Login formundan gelen e-posta ve şifreyi sabit
 * değişkenlerle karşılaştırır.
 */

// Sadece POST isteklerine yanıt ver
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../login.html?hata=yontem");
    exit;
}

/*
   SABİT KULLANICI BİLGİLERİ

    */
$DOGRU_EPOSTA = "enes.inandi@ogr.sakarya.edu.tr";
$DOGRU_SIFRE  = "B251210086";
$OGRENCI_NO   = "B251210086";


// Formdan gelen veriler
$kullanici = isset($_POST["kullanici"]) ? trim($_POST["kullanici"]) : "";
$sifre     = isset($_POST["sifre"])     ? $_POST["sifre"]            : "";

// 1. Boş alan kontrolü
if ($kullanici === "" || $sifre === "") {
    header("Location: ../login.html?hata=bos");
    exit;
}

// 2. Bilgileri karşılaştır (eposta için harfduyarsız )
if (strcasecmp($kullanici, $DOGRU_EPOSTA) === 0 && $sifre === $DOGRU_SIFRE) {
    // Başarılı giriş
    // Öğrenci numarasını URL ile aktarıyoruz
    header("Location: welcome.php?no=" . urlencode($OGRENCI_NO));
    exit;
} else {
    // Başarısız giriş
    header("Location: ../login.html?hata=yanlis");
    exit;
}

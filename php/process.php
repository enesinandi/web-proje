<?php
/**
 * process.php
 * ---------------------------------------------------------
 * İletişim formundan gelen verileri karşılayıp
 * ekrana düzenli şekilde yazdıran sayfa.
 *
 * Form iletisim.html'de POST metoduyla bu dosyaya gönderilir.
 * --------------------------------------------------------- */

// Bu sayfa SADECE POST isteğine yanıt verir.
// Birisi adresi browser'a yazıp GET ile gelirse iletisim'e geri gönder.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../iletisim.html");
    exit;
}

// Gelen verileri topla — yoksa boş string varsayılan değer ata
$ad             = isset($_POST["ad"])             ? trim($_POST["ad"])             : "";
$email          = isset($_POST["email"])          ? trim($_POST["email"])          : "";
$telefon        = isset($_POST["telefon"])        ? trim($_POST["telefon"])        : "";
$konu           = isset($_POST["konu"])           ? $_POST["konu"]                 : "";
$cinsiyet       = isset($_POST["cinsiyet"])       ? $_POST["cinsiyet"]             : "Belirtilmemiş";
$iletisimTercih = isset($_POST["iletisim_tercih"]) ? $_POST["iletisim_tercih"]     : [];
$mesaj          = isset($_POST["mesaj"])          ? trim($_POST["mesaj"])          : "";
$kvkk           = isset($_POST["kvkk"])           ? "Evet"                         : "Hayır";

// Konu seçeneğini Türkçe görünür hale getir
$konuMetinleri = [
    "is-teklifi"       => "İş / Staj Teklifi",
    "proje-isbirligi"  => "Proje İşbirliği",
    "genel-soru"       => "Genel Soru",
    "geri-bildirim"    => "Geri Bildirim",
    "diger"            => "Diğer",
    ""                 => "Seçilmemiş"
];
$konuYazi = isset($konuMetinleri[$konu]) ? $konuMetinleri[$konu] : $konu;

// Cinsiyet seçeneğini Türkçeleştir
$cinsiyetMetinleri = [
    "erkek"                  => "Erkek",
    "kadin"                  => "Kadın",
    "belirtmek-istemiyorum"  => "Belirtmek istemiyorum"
];
$cinsiyetYazi = isset($cinsiyetMetinleri[$cinsiyet]) ? $cinsiyetMetinleri[$cinsiyet] : $cinsiyet;

// XSS koruması için yardımcı fonksiyon
function guvenli($metin) {
    return htmlspecialchars($metin, ENT_QUOTES, "UTF-8");
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Sonucu | Web Teknolojileri Projesi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>

    <nav class="navbar navbar-expand-lg site-navbar sticky-top">
        <div class="container">
            <a class="navbar-brand" href="../index.html">Enes Yusuf<span>İnandı</span></a>
        </div>
    </nav>

    <header class="hero">
        <div class="container">
            <h1>Form Verileri Alındı</h1>
            <p>Aşağıda formdan gelen verilerin tamamını görebilirsiniz. Bu veriler PHP üzerinden işlenmiştir.</p>
        </div>
    </header>

    <main>
        <section class="py-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">

                        <article class="kart">
                            <h2 class="mb-4">
                                <i class="bi bi-check-circle-fill text-success me-2"></i>
                                Mesajınız Başarıyla Alındı
                            </h2>

                            <p class="text-muted">
                                Form gönderildi. Aşağıda PHP'nin <code>$_POST</code> değişkeni
                                üzerinden aldığı tüm veriler listelenmiştir.
                            </p>

                            <hr>

                            <table class="table table-striped">
                                <tbody>
                                    <tr>
                                        <th scope="row" style="width: 35%;">
                                            <i class="bi bi-person-fill me-1"></i>Ad Soyad
                                        </th>
                                        <td><?php echo guvenli($ad); ?></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-envelope-fill me-1"></i>E-posta
                                        </th>
                                        <td><?php echo guvenli($email); ?></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-telephone-fill me-1"></i>Telefon
                                        </th>
                                        <td><?php echo guvenli($telefon); ?></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-bookmark-fill me-1"></i>Konu
                                        </th>
                                        <td><?php echo guvenli($konuYazi); ?></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-person-circle me-1"></i>Cinsiyet
                                        </th>
                                        <td><?php echo guvenli($cinsiyetYazi); ?></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-bell-fill me-1"></i>İletişim Tercihi
                                        </th>
                                        <td>
                                            <?php
                                            if (count($iletisimTercih) > 0) {
                                                $tercihYazilari = [
                                                    "eposta"  => "E-posta",
                                                    "telefon" => "Telefon",
                                                    "sms"     => "SMS"
                                                ];
                                                $sonuc = [];
                                                foreach ($iletisimTercih as $tercih) {
                                                    $sonuc[] = isset($tercihYazilari[$tercih])
                                                                ? $tercihYazilari[$tercih]
                                                                : guvenli($tercih);
                                                }
                                                echo implode(", ", $sonuc);
                                            } else {
                                                echo "<em class='text-muted'>Seçilmemiş</em>";
                                            }
                                            ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-chat-text-fill me-1"></i>Mesaj
                                        </th>
                                        <td><?php echo nl2br(guvenli($mesaj)); ?></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <i class="bi bi-shield-check me-1"></i>KVKK Onayı
                                        </th>
                                        <td>
                                            <?php if ($kvkk === "Evet"): ?>
                                                <span class="badge bg-success">Onaylandı</span>
                                            <?php else: ?>
                                                <span class="badge bg-danger">Onaylanmadı</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="mt-4 d-flex gap-2">
                                <a href="../iletisim.html" class="btn btn-vurgu">
                                    <i class="bi bi-arrow-left me-1"></i> Yeni Mesaj Gönder
                                </a>
                                <a href="../index.html" class="btn btn-anahat">
                                    <i class="bi bi-house-door me-1"></i> Ana Sayfa
                                </a>
                            </div>
                        </article>

                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p class="mb-1">© 2026 Enes Yusuf İnandı — Tüm hakları saklıdır.</p>
            <small>
                Web Teknolojileri Proje Ödevi |
                <a href="https://github.com/enesinandi/web-proje" target="_blank" rel="noopener">GitHub</a>
            </small>
            <div class="ayraç"></div>
            <small>Sakarya Üniversitesi · 2025-2026 Bahar Dönemi</small>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

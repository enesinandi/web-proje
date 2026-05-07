<?php
/*
 * welcome.php
 * Başarılı giriş sonrası gösterilen sayfa.
 * URL'den gelen öğrenci numarasını ekrana yazar.
 */

// URL'den öğrenci numarasını al, XSS'e karşı temizle
$ogrenciNo = isset($_GET["no"])
    ? htmlspecialchars($_GET["no"], ENT_QUOTES, "UTF-8")
    : "Öğrenci";
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hoşgeldiniz | Web Teknolojileri Projesi</title>
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
            <h1>Giriş Başarılı</h1>
            <p>Sisteme başarıyla giriş yaptınız.</p>
        </div>
    </header>

    <main>
        <section class="py-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">

                        <article class="kart text-center">
                            <div style="font-size: 4rem; color: #28a745;">
                                <i class="bi bi-check-circle-fill"></i>
                            </div>

                            <h2 class="mt-3 mb-3">Hoşgeldiniz <?php echo $ogrenciNo; ?></h2>

                            <p class="text-muted mb-4">
                                Web Teknolojileri proje ödevi giriş sistemine
                                başarıyla giriş yaptınız.
                            </p>

                            <hr>

                            <p class="small text-muted mb-4">
                                Bu sayfa, sabit tanımlı kullanıcı bilgileriyle eşleşen bir
                                giriş yapıldığında PHP tarafından oluşturulur.
                                Doğrulama <code>login-check.php</code> dosyasında yapılmıştır.
                            </p>

                            <div class="d-flex gap-2 justify-content-center flex-wrap">
                                <a href="../index.html" class="btn btn-vurgu">
                                    <i class="bi bi-house-door me-1"></i>
                                    Ana Sayfa
                                </a>
                                <a href="../login.html" class="btn btn-anahat">
                                    <i class="bi bi-arrow-left me-1"></i>
                                    Çıkış Yap
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

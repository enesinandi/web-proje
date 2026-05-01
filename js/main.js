/* =========================================================
   main.js - Genel JavaScript dosyası
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    // Aktif sayfa linkini navbar'da işaretle
    aktifLinkiIsaretle();

    // Konsola hoşgeldin notu (geliştirici için)
    console.log('%cWeb Teknolojileri Projesi', 'color:#e67e22;font-size:18px;font-weight:bold');
});

/**
 * Şu an açık olan sayfanın navbar linkine "aktif" sınıfını ekler.
 */
function aktifLinkiIsaretle() {
    const yol = window.location.pathname.split('/').pop() || 'index.html';
    const linkler = document.querySelectorAll('.site-navbar .nav-link');

    linkler.forEach(link => {
        const href = link.getAttribute('href');
        if (href === yol) {
            link.classList.add('aktif');
        }
    });
}

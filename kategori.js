let kategoriler = JSON.parse(localStorage.getItem("kategoriler")) || [];
let yazarlar = JSON.parse(localStorage.getItem("yazarlar")) || [];
let kitaplar = JSON.parse(localStorage.getItem("kitaplar")) || [];
function tümKategoriSil() {

    if (confirm("Kategoriler ve katagorilere kayıtlı olan tüm yazarlar ve kitaplar silinecektir! Onaylıyor musunuz?")=== true){
        localStorage.removeItem('kitaplar');
        localStorage.removeItem('yazarlar');
        localStorage.removeItem('kategoriler');
        tabloyuGuncelle();
        location.reload();

    }
    else {
        console.log("Silme işlemi iptal edildi.");
        tabloyuGuncelle();
    }
}

// kategori silme fonksiyonu
function kategoriSil(arananKategoriId) {
    if (confirm("Bu kategoriye kayıtlı tüm yazarlar ve kitaplar silinecektir! Onaylıyor musunuz?") === true) {
        function yazarSil(arananKategoriId) {
            let getYazarlar = JSON.parse(localStorage.getItem("yazarlar"));
            var silinecekYazarID = [];
            getYazarlar.forEach(yazar => {
                if (parseInt(yazar.kategoriId) === parseInt(arananKategoriId)) {
                    silinecekYazarID.push(yazar.id);
                }
            });

            function kitapSil(silinecekYazarID) {
                let getKitaplar = JSON.parse(localStorage.getItem("kitaplar"));
                var silinecekKitapID = [];

                silinecekYazarID.forEach(yazarId => {
                    getKitaplar.forEach(kitap => {
                        if (parseInt(kitap.yazarId) === parseInt(yazarId)) {
                            silinecekKitapID.push(kitap.id);
                        }
                    });
                });

                // Kitap silme işlemi
                const yeniKitaplar = getKitaplar.filter(kitap => !silinecekKitapID.includes(kitap.id));
                localStorage.setItem("kitaplar", JSON.stringify(yeniKitaplar));
                tabloyuGuncelle(); // Tabloyu güncelle
                console.log("kitap tablosu güncel")
            }
            let kitaplar = JSON.parse(localStorage.getItem("kitaplar")) || [];
            if (kitaplar.length > 0) {
                console.log("kitapsil çalıştı")
                kitapSil(silinecekYazarID);
            }
            

            // Yazar silme işlemi
            const yeniYazarlar = getYazarlar.filter(yazar => !silinecekYazarID.includes(yazar.id));
            localStorage.setItem("yazarlar", JSON.stringify(yeniYazarlar));
            tabloyuGuncelle(); // Tabloyu güncelle
            console.log("yazar tablosu güncel")
        }
        let yazarlar = JSON.parse(localStorage.getItem("yazarlar")) || [];
        if (yazarlar.length > 0) {
            console.log("yazarsil çalıştı")
            yazarSil(arananKategoriId);
        }
        

        // Kategori silme işlemi
        let getKategoriler = JSON.parse(localStorage.getItem("kategoriler"));
        const yeniKategoriler = getKategoriler.filter(kategori => kategori.id !== arananKategoriId);
        localStorage.setItem("kategoriler", JSON.stringify(yeniKategoriler));
        tabloyuGuncelle(); // Tabloyu güncelle
        console.log("kategori tablosu güncel")

    } else {
        console.log("Silme işlemi iptal edildi.");
        tabloyuGuncelle();
    }
    tabloyuGuncelle();
    console.log("kategori tablosu güncel")
    // Pencereyi yenile
    // location.reload();

}

// kategori silme fonksiyonu
function kategoriGuncelle(kategoriId) {
    const kategori = JSON.parse(localStorage.getItem("kategoriler")).find(kategori => kategori.id === kategoriId);

    // Güncelleme formunu ekrana getir
    document.getElementById("guncelleFormDiv").style.display = "block";
    
    // Mevcut ismi ve kategoriyi doldur
    document.getElementById("guncelleIsim").value = kategori.isim;

    // Form submit edildiğinde kitap bilgilerini güncelle
    document.getElementById("guncelleForm").onsubmit = function (e) {
        e.preventDefault();  // Sayfanın yenilenmesini engelle

        // Yeni değerleri al
        const yeniIsim = document.getElementById("guncelleIsim").value.trim();

        // Verileri güncelle
        const kategoriler = JSON.parse(localStorage.getItem("kategoriler"));
        const yazarlar = JSON.parse(localStorage.getItem("yazarlar"));
        const kitaplar = JSON.parse(localStorage.getItem("kitaplar"));

        // Kategoriyi güncelle
        const kategoriIndex = kategoriler.findIndex(cat => cat.id === kategoriId);
        if (kategoriIndex > -1) {
            kategoriler[kategoriIndex].isim = ilkHarfBuyukYap(yeniIsim);
            localStorage.setItem("kategoriler", JSON.stringify(kategoriler));
        }

        // Yazarları güncelle
        if (yazarlar.length > 0) {
            const güncellenecekYazarID = [];
            yazarlar.forEach(yazar => {
                if (parseInt(yazar.kategoriId) === parseInt(kategoriId)) {
                    güncellenecekYazarID.push(yazar.id);
                    yazar.kategoriIsmi = ilkHarfBuyukYap(yeniIsim);
                }
            });
            localStorage.setItem("yazarlar", JSON.stringify(yazarlar));
        }


        // Kitapları güncelle
        if (kitaplar.length > 0) {
            kitaplar.forEach(kitap => {
                if (güncellenecekYazarID.includes(parseInt(kitap.yazarId))) {
                    kitap.kategoriIsmi = ilkHarfBuyukYap(yeniIsim);
                }
            });
            localStorage.setItem("kitaplar", JSON.stringify(kitaplar));
        }


        // Tabloyu güncelle
        tabloyuGuncelle();

        // Formu gizle ve temizle
        document.getElementById("guncelleFormDiv").style.display = "none";
        document.getElementById("guncelleForm").reset();
    };

    // İptal butonuna tıklandığında formu gizle
    document.getElementById("iptalButton").onclick = function () {
        document.getElementById("guncelleFormDiv").style.display = "none";
        document.getElementById("guncelleForm").reset();
    };
}

function tabloyuGuncelle() {
    const tableBody = document.getElementById("kategoriTableBody");
    tableBody.innerHTML = '';  // Önce tabloyu temizle
    const kategoriler = JSON.parse(localStorage.getItem("kategoriler")) || [];
    kategoriler.forEach(kategori => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${kategori.isim}</td>
        <td>${kategori.id}</td>
        <td><button class="btn btn-danger" onclick="kategoriSil(${kategori.id})">Sil</button></td>
        <td><button class="btn btn-warning" onclick="kategoriGuncelle(${kategori.id})">Güncelle</button></td>
    `;
        tableBody.appendChild(row);
    });
}

// Metni "Her Kelimenin İlk Harfi Büyük" formatına çeviren fonksiyon
function ilkHarfBuyukYap(str) {
    return str.toLowerCase().split(' ').map(kelime => {
        return kelime.charAt(0).toUpperCase() + kelime.slice(1);
    }).join(' ');
}

// Kategori ekleme formunun submit işlemi
document.getElementById("kategoriForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Sayfanın yeniden yüklenmesini engelle
    let kategoriIsmi = document.getElementById("kategoriIsmi").value.trim();

    let kategoriler = JSON.parse(localStorage.getItem("kategoriler")) || [];    
    
    // Kullanıcının girdiği metni düzenle
    kategoriIsmi = ilkHarfBuyukYap(kategoriIsmi);

    // Aynı isimde bir kategori olup olmadığını kontrol et
    const ayniKategori = kategoriler.some(kategori => kategori.isim.toLowerCase() === kategoriIsmi.toLowerCase());

    // Eğer aynı isimde bir kategori varsa uyarı ver
    if (ayniKategori) {
        alert("Bu isimde bir kategori zaten mevcut!");
        return;  // Kategori eklemeden çık
    }

    const kategoriId = kategoriler.length ? kategoriler[kategoriler.length - 1].id + 1 : 1;

    const yeniKategori = { id: kategoriId, isim: kategoriIsmi };
    kategoriler.push(yeniKategori);

    // LocalStorage'a kaydet
    localStorage.setItem("kategoriler", JSON.stringify(kategoriler));

    // Formu temizle
    document.getElementById("kategoriForm").reset();

    // Tabloyu güncelle
    tabloyuGuncelle();
});

// Sayfa yüklendiğinde tabloları güncelle
window.onload = tabloyuGuncelle;

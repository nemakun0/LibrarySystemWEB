let kategoriler = JSON.parse(localStorage.getItem("kategoriler")) || [];
let yazarlar = JSON.parse(localStorage.getItem("yazarlar")) || [];

function tümYazarSil() {

    if (confirm("Yazarlar ve bu yazarların kitapları silinecektir! Onaylıyor musunuz?") === true) {
        localStorage.removeItem('kitaplar');
        localStorage.removeItem('yazarlar');
        tabloyuGuncelle();
        console.log("tablo güncellendi");
        location.reload();

    }
    else {
        console.log("Silme işlemi iptal edildi.");
        tabloyuGuncelle();
    }
}

function yazarSil(arananYazarId) {
    if (confirm("Bu yazara ait tüm kitaplar silinecektir! Onaylıyor musunuz?") === true) {

        let getYazarlar = JSON.parse(localStorage.getItem("yazarlar"));
        function kitapSil(arananYazarId) {
            let getKitaplar = JSON.parse(localStorage.getItem("kitaplar"));
            var silinecekKitapID = [];

            getKitaplar.forEach(kitap => {
                if (parseInt(kitap.yazarId) === parseInt(arananYazarId)) {
                    silinecekKitapID.push(kitap.id);
                }
            });

            // Kitap silme işlemi
            const yeniKitaplar = getKitaplar.filter(kitap => !silinecekKitapID.includes(kitap.id));
            localStorage.setItem("kitaplar", JSON.stringify(yeniKitaplar));
            tabloyuGuncelle(); // Tabloyu güncelle
            console.log("kitap tablosu güncel")
        }
        let kitaplar = JSON.parse(localStorage.getItem("kitaplar"));
        if (kitaplar.length > 0) {
            kitapSil(arananYazarId);
        }

        // Yazar silme işlemi
        const yeniYazarlar = getYazarlar.filter(yazar => parseInt(yazar.id) !== parseInt(arananYazarId));
        localStorage.setItem("yazarlar", JSON.stringify(yeniYazarlar));
        tabloyuGuncelle(); // Tabloyu güncelle
        console.log("yazar tablosu güncel")
    }
    else {
        console.log("Silme işlemi iptal edildi.");
        tabloyuGuncelle();
    }
    tabloyuGuncelle();
    console.log("kategori tablosu güncel")
    // Pencereyi yenile
    location.reload();
}

function yazariGuncelle(yazarId) {
    const yazar = yazarlar.find(yazar => yazar.id === yazarId);

    // Güncelleme formunu ekrana getir
    document.getElementById("guncelleFormDiv").style.display = "block";

    // Mevcut ismi ve kategoriyi doldur
    document.getElementById("guncelleIsim").value = yazar.isim;

    // Kategori seçimi için select kutusunu doldur
    const kategoriSelect = document.getElementById('guncelleKategori');
    kategoriSelect.innerHTML = '<option>Kategori Seçiniz</option>'; // Eski seçenekleri temizle
    const kategoriler = JSON.parse(localStorage.getItem('kategoriler')) || [];
    kategoriler.forEach(kategori => {
        let option = document.createElement('option');
        option.value = kategori.id;
        option.text = kategori.isim;
        if (parseInt(kategori.id) === parseInt(yazar.kategoriId)) {
            option.selected = true;  // Mevcut kategoriyi seçili göster
        }
        kategoriSelect.appendChild(option);
    });

    // Form submit edildiğinde yazar bilgilerini güncelle
    document.getElementById("guncelleForm").onsubmit = function (e) {
        e.preventDefault();  // Sayfanın yenilenmesini engelle

        // Yeni değerleri al
        const yeniIsim = document.getElementById("guncelleIsim").value.trim();
        const yeniKategoriId = document.getElementById("guncelleKategori").value;
        const yeniKategoriIsmi = document.getElementById("guncelleKategori").options[document.getElementById("guncelleKategori").selectedIndex].text;

        // Yazarın bilgilerini güncelle
        yazar.isim = ilkHarfBuyukYap(yeniIsim);
        yazar.kategoriId = yeniKategoriId;
        yazar.kategoriIsmi = yeniKategoriIsmi;

        let kitaplar = JSON.parse(localStorage.getItem('kitaplar')) || [];
        if (kitaplar == !null) {
            // Yazarın kitaplarındaki kategori bilgilerini de güncelle

            kitaplar.forEach(kitap => {
                console.log("kitap güncellemeye geldi")
                console.log(parseInt(kitap.yazarId))
                console.log(parseInt(yazarId))
                if (parseInt(kitap.yazarId) === parseInt(yazarId)) {
                    // kitap.kategoriId = yeniKategoriId;
                    kitap.kategoriIsmi = yeniKategoriIsmi;
                    console.log("Ismini güncellemeye de geldi")
                }
            });
        }



        // Kitaplar LocalStorage'ını güncelle
        localStorage.setItem("kitaplar", JSON.stringify(kitaplar));

        // LocalStorage'ı güncelle
        localStorage.setItem("yazarlar", JSON.stringify(yazarlar));

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




// Kategorileri Local Storage'dan çek ve select box'a ekle
function kategorileriSelectBoxaEkle() {
    const kategoriSelect = document.getElementById('selectType');
    const kategoriler = JSON.parse(localStorage.getItem('kategoriler'));

    // Select kutusunu önce temizleyelim
    kategoriSelect.innerHTML = '<option selected>Kategori Seçiniz</option>';

    // Veriler varsa ekle
    if (kategoriler) {
        kategoriler.forEach(kategori => {
            let option = document.createElement('option');
            option.value = kategori.id;
            option.text = kategori.isim;
            kategoriSelect.appendChild(option);
        });
    }
}

// Tabloyu güncelleyen fonksiyon
function tabloyuGuncelle() {
    const tableBody = document.getElementById("yazarTableBody");
    tableBody.innerHTML = '';  // Önce tabloyu temizle
    yazarlar.forEach(yazar => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${yazar.id}</td>
            <td>${yazar.isim}</td>
            <td>${yazar.kategoriIsmi}</td>
            <td>${yazar.kategoriId}</td>
            <td><button class="btn btn-danger" onclick="yazarSil(${yazar.id})">Sil</button></td>
            <td><button class="btn btn-warning" onclick="yazariGuncelle(${yazar.id})">Güncelle</button></td>
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

document.getElementById("yazarForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Sayfanın yeniden yüklenmesini engelle
    let yazarIsmi = document.getElementById("yazarIsmi").value.trim();
    let selectElement = document.getElementById("selectType");
    let kategoriSecilen = document.getElementById("selectType").value;
    let kategoriText = selectElement.options[selectElement.selectedIndex].text;
    console.log(kategoriText)

    // Kullanıcının girdiği metni düzenle
    yazarIsmi = ilkHarfBuyukYap(yazarIsmi);

    // Aynı isimde bir yazar olup olmadığını kontrol et
    const ayniYazar = yazarlar.some(yazar => yazar.isim.toLowerCase() === yazarIsmi.toLowerCase());
    const ayniKategori = kategoriler.some(kategori => kategori.isim.toLowerCase() === kategoriText.toLowerCase());

    //Eğer aynı isimde bir yazar varsa uyarı ver
    if (ayniYazar && ayniKategori) {
        alert("Bu isimde bir yazar zaten mevcut!");
        return;  // Yazar eklemeden çık
    }

    if (kategoriSecilen === "Kategori Seçiniz") {
        alert("Lütfen bir kategori seçiniz!");
        return;
    }
    const yazarId = yazarlar.length ? yazarlar[yazarlar.length - 1].id + 1 : 1;


    const yeniyazar = { id: yazarId, isim: yazarIsmi, kategoriId: kategoriSecilen, kategoriIsmi: kategoriText };
    console.log(yeniyazar)
    yazarlar.push(yeniyazar);


    // LocalStorage'a kaydet
    localStorage.setItem("yazarlar", JSON.stringify(yazarlar));

    // Formu temizle
    document.getElementById("yazarForm").reset();

    // Tabloyu güncelle
    tabloyuGuncelle();
}
);

// Sayfa yüklendiğinde çalıştır
window.onload = function () {
    kategorileriSelectBoxaEkle();
    tabloyuGuncelle();
};
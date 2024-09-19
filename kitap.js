let kitaplar = JSON.parse(localStorage.getItem("kitaplar")) || [];
let yazarlar = JSON.parse(localStorage.getItem("yazarlar")) || [];

function tümKitapSil() {

    if (confirm("Tüm kitaplar silinecektir! Onaylıyor musunuz?")=== true){
        localStorage.removeItem('kitaplar');
        tabloyuGuncelle();
        console.log("tablo güncellendi");
        location.reload();
        
    }
    else {
        console.log("Silme işlemi iptal edildi.");
        tabloyuGuncelle();
    }
}

function kitapSil(arananKitapId) {
    let getKitaplar = JSON.parse(localStorage.getItem("kitaplar"));
    const yeniKitaplar = getKitaplar.filter(kitap => kitap.id !== arananKitapId);
    localStorage.setItem("kitaplar", JSON.stringify(yeniKitaplar));
    tabloyuGuncelle(); // Tabloyu güncelle
    console.log("kitap tablosu güncel")
    location.reload();
}

function yazarlariSelectBoxaEkle() {
    const yazarSelect = document.getElementById('selectYazar');
    const yazarlar = JSON.parse(localStorage.getItem('yazarlar'));

    // Select kutusunu önce temizleyelim
    yazarSelect.innerHTML = '<option selected>Yazar Seçiniz</option>';

    // Veriler varsa ekle
    if (yazarlar) {
        yazarlar.forEach(yazar => {
            let option = document.createElement('option');
            option.value = yazar.id;
            option.text = yazar.isim;
            option.kId = yazar.kategoriId;
            option.kName = yazar.kategoriIsmi;
            yazarSelect.appendChild(option);
        });
    }
}

// kitap bilgilerini güncelleme fonksiyonu
function kitapGuncelle(kitapId) {
    const kitap = kitaplar.find(kitap => kitap.id === kitapId);
    
    // Güncelleme formunu ekrana getir
    document.getElementById("guncelleFormDiv").style.display = "block";
    
    // Mevcut kitap ismi ve yazarı doldur
    document.getElementById("guncelleIsim").value = kitap.isim;

    // yazar seçimi için select kutusunu doldur
    const yazarSelect = document.getElementById('guncelleYazar');
    yazarSelect.innerHTML = '<option>Yazar Seçiniz</option>'; // Eski seçenekleri temizle
    const yazarlar = JSON.parse(localStorage.getItem('yazarlar')) || [];
    yazarlar.forEach(yazar => {
        let option = document.createElement('option');
        option.value = yazar.id;
        option.text = yazar.isim;
        option.kategName = yazar.kategoriIsmi;
        if (parseInt(yazar.id) === parseInt(kitap.yazarId)) {
            option.selected = true;  // Mevcut kategoriyi seçili göster
        }
        yazarSelect.appendChild(option);
    });

    // Form submit edildiğinde kitap bilgilerini güncelle
    document.getElementById("guncelleForm").onsubmit = function (e) {
        e.preventDefault();  // Sayfanın yenilenmesini engelle

        // kitap için gerekli olan Yeni değerleri al
        // yeni isim, yeni ID, yeni yazar ismi, yeni kategori ismi
        let selectElement = document.getElementById("guncelleYazar");
        const yeniKitapIsim = document.getElementById("guncelleIsim").value.trim();
        const yeniYazarIsmi = document.getElementById("guncelleYazar").options[document.getElementById("guncelleYazar").selectedIndex].text;   
        const yeniKategoriIsmi = selectElement.options[selectElement.selectedIndex].kategName;
        console.log(yeniKategoriIsmi)
        const yeniYazarId = document.getElementById("guncelleYazar").value;
        
        // kitabın bilgilerini güncelle
        kitap.isim = ilkHarfBuyukYap(yeniKitapIsim); 
        kitap.yazarIsmi = yeniYazarIsmi;
        kitap.kategoriIsmi = yeniKategoriIsmi;
        kitap.yazarId = yeniYazarId;

        // Kitaplar LocalStorage'ını güncelle
        localStorage.setItem("kitaplar", JSON.stringify(kitaplar));
        
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

// Kategorileri tabloya yükleme fonksiyonu
function tabloyuGuncelle() {
    const tableBody = document.getElementById("kitapTableBody");
    tableBody.innerHTML = '';  // Önce tabloyu temizle
    kitaplar.forEach(kitap => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${kitap.id}</td>
        <td>${kitap.isim}</td>
        <td>${kitap.yazarIsmi}</td>
        <td>${kitap.kategoriIsmi}</td>
        <td><button class="btn btn-danger" onclick="kitapSil(${kitap.id})">Sil</button></td>
        <td><button class="btn btn-warning" onclick="kitapGuncelle(${kitap.id})">Güncelle</button></td>
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

document.getElementById("kitapForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Sayfanın yeniden yüklenmesini engelle
    let kitapIsmi = document.getElementById("kitapIsmi").value.trim();
    let selectElement = document.getElementById("selectYazar");
    console.log(selectElement)
    let yazarSecilen = document.getElementById("selectYazar").value;
    let yazarText = selectElement.options[selectElement.selectedIndex].text;

    // Kullanıcının girdiği metni düzenle
    kitapIsmi = ilkHarfBuyukYap(kitapIsmi);

    // Aynı isimde bir kitap olup olmadığını kontrol et
    const aynikitap = kitaplar.some(kitap => kitap.isim.toLowerCase() === kitapIsmi.toLowerCase());

    // Eğer aynı isimde bir kitap varsa uyarı ver
    if (aynikitap) {
        alert("Bu isimde bir kitap mevcut!");
        return;  // Yazar eklemeden çık
    }

    if (yazarText === "Yazar Seçiniz") {
        alert("Lütfen bir yazar seçiniz!");
        return;
    }
    const kitapId = kitaplar.length ? kitaplar[kitaplar.length - 1].id + 1 : 1;

    let kategoriIsmi = selectElement.options[selectElement.selectedIndex].kName;

    const yeniyazar = { id: kitapId, isim: kitapIsmi, yazarIsmi:yazarText, kategoriIsmi:kategoriIsmi, yazarId:yazarSecilen};
    console.log(yeniyazar)
    kitaplar.push(yeniyazar);


    // LocalStorage'a kaydet
    localStorage.setItem("kitaplar", JSON.stringify(kitaplar));

    // Formu temizle
    document.getElementById("kitapForm").reset();

    // Tabloyu güncelle
    tabloyuGuncelle();
    }
);

window.onload = function() {
    yazarlariSelectBoxaEkle();
    tabloyuGuncelle();
};
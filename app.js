

// Türkiye illeri ve İstanbul ilçeleri
const cities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];

const istanbulDistricts = ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultangazi", "Sultanbeyli", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"];

let currentRating = 0;

// Sayfa yüklendiğinde
window.onload = function() {
    loadCities();
    createStars();
    loadPlaces();
};

function loadCities() {
    const citySelect = document.getElementById('city');
    const filterCity = document.getElementById('filterCity');
    
    cities.forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
        filterCity.innerHTML += `<option value="${city}">${city}</option>`;
    });
    
    const filterDistrict = document.getElementById('filterDistrict');
    istanbulDistricts.forEach(district => {
        filterDistrict.innerHTML += `<option value="${district}">${district}</option>`;
    });
}

function createStars() {
    const container = document.getElementById('ratingStars');
    for (let i = 1; i <= 5; i++) {
        container.innerHTML += `<span class="star" onclick="setRating(${i})">★</span>`;
    }
}

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateDistricts() {
    const city = document.getElementById('city').value;
    const districtSelect = document.getElementById('district');
    
    districtSelect.innerHTML = '<option value="">İlçe seçiniz...</option>';
    
    if (city === 'İstanbul') {
        districtSelect.disabled = false;
        istanbulDistricts.forEach(district => {
            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    } else {
        districtSelect.disabled = true;
    }
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorBox = document.getElementById('errorBox');
    
    if (username === 'Yaren' && password === 'Umut') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appPage').classList.add('show');
        loadPlaces();
    } else {
        errorBox.textContent = 'Kullanıcı adı veya şifre hatalı!';
        errorBox.classList.add('show');
    }
}

function logout() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('appPage').classList.remove('show');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('errorBox').classList.remove('show');
}

// Mekan ekleme - Supabase'e kaydet
async function addPlace() {
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const name = document.getElementById('placeName').value;
    const detail = document.getElementById('placeDetail').value;
    
    if (!city || !district || !name || currentRating === 0) {
        alert('Lütfen tüm alanları doldurun ve yıldız verin!');
        return;
    }
    
    // Supabase'e kaydet
    const { data, error } = await supabase
        .from('places')
        .insert([
            {
                city: city,
                district: district,
                name: name,
                detail: detail,
                rating: currentRating
            }
        ]);
    
    if (error) {
        console.error('Hata:', error);
        alert('Mekan eklenirken hata oluştu!');
        return;
    }
    
    // Formu temizle
    document.getElementById('placeName').value = '';
    document.getElementById('placeDetail').value = '';
    currentRating = 0;
    setRating(0);
    
    // Mekanları yeniden yükle
    loadPlaces();
    alert('Mekan başarıyla eklendi! 🎉');
}

// Mekan silme - Supabase'den sil
async function deletePlace(id) {
    if (!confirm('Bu mekanı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Hata:', error);
        alert('Mekan silinirken hata oluştu!');
        return;
    }
    
    // Mekanları yeniden yükle
    loadPlaces();
}

// Mekanları Supabase'den yükle
async function loadPlaces() {
    const container = document.getElementById('placesContainer');
    container.innerHTML = '<div class="loading">Yükleniyor...</div>';
    
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Hata:', error);
        container.innerHTML = '<div class="empty">Mekanlar yüklenirken hata oluştu.</div>';
        return;
    }
    
    showPlaces(data);
}

// Filtreleme
async function filterPlaces() {
    const container = document.getElementById('placesContainer');
    container.innerHTML = '<div class="loading">Filtreleniyor...</div>';
    
    const filterCity = document.getElementById('filterCity').value;
    const filterDistrict = document.getElementById('filterDistrict').value;
    const filterRating = document.getElementById('filterRating').value;
    
    let query = supabase.from('places').select('*');
    
    if (filterCity) {
        query = query.eq('city', filterCity);
    }
    
    if (filterDistrict) {
        query = query.eq('district', filterDistrict);
    }
    
    if (filterRating) {
        query = query.eq('rating', parseInt(filterRating));
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
        console.error('Hata:', error);
        container.innerHTML = '<div class="empty">Filtreleme sırasında hata oluştu.</div>';
        return;
    }
    
    showPlaces(data);
}

// Mekanları göster
function showPlaces(places) {
    const container = document.getElementById('placesContainer');
    
    if (!places || places.length === 0) {
        container.innerHTML = '<div class="empty">Henüz mekan eklenmemiş veya filtreye uygun mekan yok.</div>';
        return;
    }
    
    let html = '<div class="places">';
    places.forEach(place => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<span class="star ${i <= place.rating ? 'active' : ''}">★</span>`;
        }
        
        html += `
            <div class="place">
                <h3>${place.name}</h3>
                <div class="place-info">📍 ${place.city}, ${place.district}</div>
                <div class="place-stars">${starsHtml}</div>
                ${place.detail ? `<p>${place.detail}</p>` : ''}
                <button class="delete" onclick="deletePlace(${place.id})">Sil</button>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}
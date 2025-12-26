document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const landForm = document.getElementById('landForm');
    const listingsContainer = document.getElementById('listingsContainer');
    const noListingsMessage = document.getElementById('noListingsMessage');
    
    // Constants
    const STORAGE_KEY = 'ab_prime_listings';

    // State
    let listings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // --- Functions ---

    // Format Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH').format(amount);
    };

    // Save retrieval
    const saveListings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        renderListings();
    };

    // Create Listing HTML
    const createListingCard = (listing) => {
        const card = document.createElement('div');
        card.className = 'card listing-card';
        
        const areaString = `${listing.rai ? listing.rai + ' ไร่ ' : ''}${listing.ngan ? listing.ngan + ' งาน ' : ''}${listing.wah ? listing.wah + ' ตร.ว.' : ''}`;

        card.innerHTML = `
            <img src="${listing.imageBase64}" alt="${listing.title}" class="listing-image">
            <div class="listing-content">
                <h3 class="listing-title" title="${listing.title}">${listing.title}</h3>
                <div class="listing-price">฿${formatCurrency(listing.price)}</div>
                
                <div class="listing-details">
                    <span><i class="fa-solid fa-ruler-combined"></i> ${areaString || 'ไม่ระบุขนาด'}</span>
                </div>
                
                <p class="listing-location"><i class="fa-solid fa-location-dot"></i> ${listing.location}</p>
                
                <div class="listing-footer">
                    <span class="listing-date">ลงเมื่อ: ${new Date(listing.date).toLocaleDateString('th-TH')}</span>
                    <button class="btn btn-danger delete-btn" data-id="${listing.id}">
                        <i class="fa-solid fa-trash"></i> ลบประกาศ
                    </button>
                </div>
            </div>
        `;
        return card;
    };

    // Render Listings
    const renderListings = () => {
        listingsContainer.innerHTML = '';
        
        if (listings.length === 0) {
            listingsContainer.classList.add('hidden');
            noListingsMessage.classList.remove('hidden');
        } else {
            listingsContainer.classList.remove('hidden');
            noListingsMessage.classList.add('hidden');
            
            // Sort by newest first
            listings.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            listings.forEach(listing => {
                listingsContainer.appendChild(createListingCard(listing));
            });
        }
    };

    // Handle Form Submit
    landForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const rai = document.getElementById('rai').value;
        const ngan = document.getElementById('ngan').value;
        const wah = document.getElementById('wah').value;
        const location = document.getElementById('location').value;
        const imageFile = document.getElementById('imageFile').files[0];
        const description = document.getElementById('description').value;

        // Validation (Basic)
        if (!title || !price || !location || !imageUrl) {
    alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
    return;
}


        const reader = new FileReader();

reader.onload = function () {
    const newListing = {
        id: Date.now().toString(),
        title,
        price: Number(price),
        rai,
        ngan,
        wah,
        location,
        imageBase64: reader.result, // 🔥 เก็บรูป
        description,
        date: new Date().toISOString()
    };

    listings.push(newListing);
    saveListings();

    landForm.reset();
    alert('ลงประกาศขายที่ดินเรียบร้อยแล้ว!');
    document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
};

reader.readAsDataURL(imageFile);

        
        // Reset form
        landForm.reset();
        alert('ลงประกาศขายที่ดินเรียบร้อยแล้ว!');
        
        // Scroll to listings
        document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
    });

    // Handle Delete
    listingsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const id = btn.dataset.id;
            
            if (confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
                listings = listings.filter(item => item.id !== id);
                saveListings();
            }
        }
    });

    // Initial Render
    renderListings();
});

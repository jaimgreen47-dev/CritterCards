const API_URL = '/api';
let currentListing = null;

async function loadListings() {
  try {
    const res = await fetch(`${API_URL}/listings`);
    const listings = await res.json();

    const grid = document.getElementById('listingsGrid');
    grid.innerHTML = '';

    listings.forEach(listing => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-image">🐄</div>
        <div class="card-content">
          <div class="card-title">${listing.animal_name}</div>
          <div class="card-info"><strong>Breed:</strong> ${listing.breed}</div>
          <div class="card-info"><strong>Age:</strong> ${listing.age}</div>
          <div class="card-info"><strong>Seller:</strong> ${listing.seller_name}</div>
          <div class="card-price">$${listing.price}</div>
        </div>
      `;
      card.onclick = () => viewListing(listing);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading listings:', err);
  }
}

function viewListing(listing) {
  currentListing = listing;
  const detail = document.getElementById('listingDetail');
  detail.innerHTML = `
    <h2>${listing.animal_name}</h2>
    <table>
      <tr>
        <td><strong>Breed:</strong></td>
        <td>${listing.breed}</td>
      </tr>
      <tr>
        <td><strong>Age:</strong></td>
        <td>${listing.age}</td>
      </tr>
      <tr>
        <td><strong>Height:</strong></td>
        <td>${listing.height || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Temperament:</strong></td>
        <td>${listing.temperament || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Location:</strong></td>
        <td>${listing.location || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Price:</strong></td>
        <td style="font-size: 20px; color: #27ae60; font-weight: bold;">$${listing.price}</td>
      </tr>
    </table>
    <h3>Description</h3>
    <p>${listing.description || 'No description provided'}</p>
    <p><strong>Seller:</strong> ${listing.seller_name}</p>
  `;

  document.getElementById('listingModal').style.display = 'flex';
}

function closeListingModal() {
  document.getElementById('listingModal').style.display = 'none';
}

function startCheckout() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to make a purchase');
    document.getElementById('authModal').style.display = 'flex';
    return;
  }

  document.getElementById('listingModal').style.display = 'none';
  document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
}

// Search and filter
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    card.style.display = title.includes(searchTerm) ? 'block' : 'none';
  });
});

// Load listings on page load
document.addEventListener('DOMContentLoaded', loadListings);

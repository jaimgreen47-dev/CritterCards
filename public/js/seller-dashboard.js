const API_URL = '/api';

async function loadDashboard() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/';
    return;
  }

  try {
    // Load stats
    const statsRes = await fetch(`${API_URL}/dashboard/seller-stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const stats = await statsRes.json();

    document.getElementById('totalSales').textContent = stats.total_sales;
    document.getElementById('totalRevenue').textContent = '$' + stats.total_revenue.toFixed(2);
    document.getElementById('activeListings').textContent = stats.active_listings;

    // Load listings
    const listingsRes = await fetch(`${API_URL}/listings`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const allListings = await listingsRes.json();

    // Filter to seller's listings
    const myListings = allListings.filter(l => l.seller_id == JSON.parse(localStorage.getItem('user')).id);

    const tbody = document.getElementById('listingsBody');
    tbody.innerHTML = '';

    myListings.forEach(listing => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${listing.animal_name}</td>
        <td>${listing.breed}</td>
        <td>$${listing.price}</td>
        <td><span style="background: #27ae60; color: white; padding: 5px 10px; border-radius: 3px;">${listing.status}</span></td>
        <td>
          <button onclick="editListing(${listing.id})" class="btn-primary" style="padding: 5px 10px; font-size: 12px;">Edit</button>
          <button onclick="deleteListing(${listing.id})" class="btn-primary" style="padding: 5px 10px; font-size: 12px; background: #e74c3c;">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Load sales
    const salesRes = await fetch(`${API_URL}/purchases/my-sales`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const sales = await salesRes.json();

    const salesBody = document.getElementById('salesBody');
    salesBody.innerHTML = '';

    sales.forEach(sale => {
      const commission = sale.commission;
      const earned = sale.amount - commission;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${sale.animal_name}</td>
        <td>${sale.buyer_name}</td>
        <td>$${sale.amount.toFixed(2)}</td>
        <td>$${commission.toFixed(2)}</td>
        <td style="font-weight: bold; color: #27ae60;">$${earned.toFixed(2)}</td>
        <td>${new Date(sale.created_at).toLocaleDateString()}</td>
      `;
      salesBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

function openListingForm() {
  document.getElementById('listingFormModal').style.display = 'flex';
}

function closeListingForm() {
  document.getElementById('listingFormModal').style.display = 'none';
}

document.getElementById('listingForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const formData = {
    animal_name: document.getElementById('animalName').value,
    breed: document.getElementById('breed').value,
    age: document.getElementById('age').value,
    height: document.getElementById('height').value,
    temperament: document.getElementById('temperament').value,
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value,
    location: document.getElementById('location').value,
  };

  try {
    const res = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Listing created successfully!');
      closeListingForm();
      e.target.reset();
      loadDashboard();
    } else {
      alert('Failed to create listing');
    }
  } catch (err) {
    console.error('Error creating listing:', err);
    alert('Error creating listing');
  }
});

function deleteListing(id) {
  if (confirm('Are you sure you want to delete this listing?')) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(() => {
      alert('Listing deleted');
      loadDashboard();
    });
  }
}

function editListing(id) {
  alert('Edit functionality coming soon!');
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', loadDashboard);

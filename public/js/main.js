// Main JavaScript file for general functionality

// Update user button
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const authBtn = document.getElementById('authBtn');
  const userBtn = document.getElementById('userBtn');

  if (token) {
    if (authBtn) authBtn.textContent = 'Logout';
    if (userBtn) userBtn.textContent = 'Logout';

    if (authBtn) authBtn.onclick = logout;
    if (userBtn) userBtn.onclick = logout;
  } else {
    if (authBtn) authBtn.onclick = openAuthModal;
    if (userBtn) userBtn.onclick = openAuthModal;
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const API_URL = '/api';

function openAuthModal() {
  document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function switchTab(tab) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Show selected tab
  document.getElementById(tab + 'Tab').classList.add('active');
  event.target.classList.add('active');
}

// Login form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      closeAuthModal();
      window.location.reload();
    } else {
      alert('Login failed: ' + data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Login error');
  }
});

// Register form
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input, select');
  const data = {
    name: inputs[0].value,
    email: inputs[1].value,
    password: inputs[2].value,
    user_type: inputs[3].value,
  };

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      closeAuthModal();
      window.location.reload();
    } else {
      alert('Registration failed: ' + result.error);
    }
  } catch (err) {
    console.error(err);
    alert('Registration error');
  }
});

// Update auth button based on login status
function updateAuthButton() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authBtn = document.getElementById('authBtn');

  if (token) {
    authBtn.textContent = `${user.name} (${user.user_type})`;
    authBtn.onclick = logout;
  } else {
    authBtn.textContent = 'Login';
    authBtn.onclick = openAuthModal;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateAuthButton);

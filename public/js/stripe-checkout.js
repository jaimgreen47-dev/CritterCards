const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Replace with your key
const elements = stripe.elements();
const cardElement = elements.create('card');

let paymentIntentId = null;

// Mount card element if it exists
if (document.getElementById('card-element')) {
  cardElement.mount('#card-element');

  cardElement.on('change', function (event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
}

// Handle checkout form submission
document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const depositAmount = parseFloat(document.getElementById('depositAmount').value);

  try {
    // Create payment intent
    const res = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        listing_id: window.currentListing.id,
        deposit_amount: depositAmount,
      }),
    });

    const data = await res.json();
    paymentIntentId = data.paymentIntentId;

    // Confirm payment
    const confirmRes = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: JSON.parse(localStorage.getItem('user')).name,
        },
      },
    });

    if (confirmRes.paymentIntent.status === 'succeeded') {
      // Confirm on backend
      const confirmBackend = await fetch('/api/payments/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          listing_id: window.currentListing.id,
        }),
      });

      const result = await confirmBackend.json();
      alert('Payment successful! Deposit of $' + depositAmount + ' confirmed.');
      document.getElementById('checkoutModal').style.display = 'none';
      window.location.reload();
    } else {
      alert('Payment failed: ' + confirmRes.error.message);
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Checkout error: ' + err.message);
  }
});

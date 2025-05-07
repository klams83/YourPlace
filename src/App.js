import React from 'react';

function App() {
  const redirectToStripe = () => {
    const stripe = window.Stripe('pk_test_VOTRE_CLE_PUBLIQUE');
    stripe.redirectToCheckout({
      lineItems: [{ price: 'price_xxxx', quantity: 1 }],
      mode: 'payment',
      successUrl: window.location.href + '?success=true',
      cancelUrl: window.location.href + '?canceled=true'
    });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Îles Rêvées 🌴</h1>
      <p>Offrez à vos murs une évasion rêvée – Les îles comme vous ne les avez jamais vues</p>
      <img src='/images/hero-island.jpg' alt='île' style={{ maxWidth: '100%', borderRadius: '12px', margin: '1rem 0' }} />
      <h2>Poster IA – 40x60 cm</h2>
      <img src='/images/product-1.jpg' alt='produit' style={{ width: '300px', borderRadius: '8px' }} />
      <p>89,00 €</p>
      <button onClick={redirectToStripe} style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>
        Acheter maintenant
      </button>
      <script src='https://js.stripe.com/v3/'></script>
    </div>
  );
}

export default App;
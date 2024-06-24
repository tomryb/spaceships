// pages/checkout.js
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartDisplay from '../components/CartDisplay';
import CheckoutForm from '../components/CheckoutForm';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe('your-publishable-key');

export async function getServerSideProps(context) {
  const res = await fetch('https://your-api-endpoint.com/api/cart', {
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });
  const cartData = await res.json();

  return {
    props: {
      cartData,
    },
  };
}

export default function Checkout({ cartData }) {
  const [clientSecret, setClientSecret] = useState('');
  const { state, dispatch } = useCart();

  useEffect(() => {
    dispatch({ type: 'SET_CART', payload: cartData });

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: calculateTotal(cartData) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [cartData, dispatch]);

  return (
    <div>
      <h1>Checkout</h1>
      <CartDisplay cart={state.cart} />
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} cartData={state.cart} />
        </Elements>
      )}
    </div>
  );
}

function calculateTotal(cartData) {
  return cartData.items.reduce((total, item) => total + item.price, 0) * 100; // amount in cents
}

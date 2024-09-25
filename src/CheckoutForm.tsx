import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("Card Element not found");
      return;
    }

    // Używamy createPaymentMethod, przekazując CardElement
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement, // Poprawny element typu CardElement
    });

    if (error) {
      console.error('[Error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Tutaj przetwórz płatność na backendzie
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Zapłać
      </button>
    </form>
  );
}

export default CheckoutForm;

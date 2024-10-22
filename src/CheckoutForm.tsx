import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; 
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("Card Element not found");
      return;
    }

   
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement, 
    });

    if (error) {
      console.error('[Error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
     
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

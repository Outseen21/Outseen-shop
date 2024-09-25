import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function PayPalButton() {
  return (
    <PayPalScriptProvider options={{ clientId: "your_paypal_client_id" }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE", // Dodajemy właściwość intent
            purchase_units: [
              {
                amount: {
                  currency_code: "USD", // Waluta płatności
                  value: "10.00", // Kwota do zapłaty
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions?.order) {
            return actions.order.capture().then((details) => {
              if (details.payer && details.payer.name) {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
              } else {
                console.log("Payer details are not available.");
              }
            });
          } else {
            console.error("Order action is undefined.");
          }
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;

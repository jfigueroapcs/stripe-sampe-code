import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { destroyCookie, parseCookies } from "nookies";

const CARD_ELEMENT_OPTIONS = {
	style: {
	  base: {
		color: "#32325d",
		fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
		fontSmoothing: "antialiased",
		fontSize: "16px",
		"::placeholder": {
		  color: "#aab7c4",
		},
	  },
	  invalid: {
		color: "#fa755a",
		iconColor: "#fa755a",
	  },
	},
  };


const CheckoutForm = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState();

  // console.log(paymentIntent)

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const {
        error,
        paymentIntent: { status }
      } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (error) throw new Error(error.message);

      if (status === "succeeded") {
        destroyCookie(null, "paymentIntentId");
        setCheckoutSuccess(true);
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  if (checkoutSuccess) return <p>Payment successfull! </p>;

  return (
    <form onSubmit={handleSubmit}>
      {/* <CardElement /> */}

      <CardElement options={CARD_ELEMENT_OPTIONS} />

      <button type="submit" disabled={!stripe}>
        Pay now
      </button>

      {checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>}
    </form>
  );
};

export default CheckoutForm;
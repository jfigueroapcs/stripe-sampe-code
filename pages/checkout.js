import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm1";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const getServerSideProps  = async (ctx) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {})

    let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    // console.log(paymentIntentId)
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent,
        data: "id"
      }
    };
  }

    paymentIntent = await stripe.paymentIntents.create({
        amount: 55555,
        currency: 'usd',
        statement_descriptor: 'Custom descriptor'
    })

    setCookie(ctx, "paymentIntentId", paymentIntent.id);

    return {
        props: {
            paymentIntent,
            data: "none"
        }
    }
}

const CheckoutPage = props => {
    console.log(props.paymentIntent)
    const { paymentIntent } = props
    console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
    )
}

export default CheckoutPage
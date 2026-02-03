import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { SERVER_URL } from "@/lib/constants";

interface Props {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}

const StripePayment = ({ priceInCents, orderId, clientSecret }: Props) => {
  const { theme, systemTheme } = useTheme();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  );

  const options: StripeElementsOptions | undefined = {
    clientSecret,
    appearance: {
      theme:
        theme === "dark"
          ? "night"
          : theme === "light"
            ? "stripe"
            : systemTheme === "light"
              ? "stripe"
              : "night",
    },
  };

  // Stripe Form Component
  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (stripe == null || elements == null || email == null) return;

      setIsLoading(true);

      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error?.type === "card_error" ||
            error?.type === "validation_error"
          ) {
            setErrorMessage(error.message ?? "An unknown error occured");
          } else if (error) {
            setErrorMessage("An unknown error occured");
          }
        })
        .finally(() => setIsLoading(false));
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading
            ? "Purchasing..."
            : `Purchase ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <StripeForm />
    </Elements>
  );
};

export default StripePayment;

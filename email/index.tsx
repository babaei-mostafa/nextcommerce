import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import * as dotenv from "dotenv";
import PurchaseReceiptEmail from "./purchase-receipt";

dotenv.config();

const resentApiKey = process.env.RESEND_API_KEY;
if (!resentApiKey) throw new Error("RESEND_API_KEY is not defined");

const resend = new Resend(resentApiKey);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email!,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};

import crypto from "crypto";

export interface EsewaPaymentConfig {
  amount: string;
  product_delivery_charge: string;
  product_service_charge: string;
  product_code: string;
  signature: string;
  signed_field_names: string;
  success_url: string;
  failure_url: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
}

const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q"; // eSewa UAT secret key

export const generateEsewaSignature = (
  total_amount: string,
  transaction_uuid: string,
  product_code: string
) => {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(message);
  return hmac.digest("base64");
};

export const initiateEsewaPayment = (
  amount: number,
  transaction_uuid: string,
  plan: string
): EsewaPaymentConfig => {
  const product_code = process.env.NEXT_PUBLIC_ESEWA_PRODUCT_CODE || "EPAYTEST";
  const success_url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/esewa/success`;
  const failure_url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?status=failed`;

  const total_amount = String(amount);
  const signature = generateEsewaSignature(total_amount, transaction_uuid, product_code);

  return {
    amount: String(amount),
    tax_amount: "0",
    total_amount,
    transaction_uuid,
    product_code,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url,
    failure_url,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };
};

export const verifyEsewaPayment = async (encodedData: string) => {
  try {
    const decodedString = Buffer.from(encodedData, "base64").toString("utf-8");
    const data = JSON.parse(decodedString);
    return data;
  } catch (error) {
    console.error("eSewa Verification Error:", error);
    return null;
  }
};

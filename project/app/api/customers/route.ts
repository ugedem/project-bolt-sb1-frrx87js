import { NextResponse } from "next/server";

const DUMMY_CUSTOMERS = [
  { id: "cus_001", name: "Acme Co", email: "hello@acme.example", phone: "+123456789", location: "Lagos" },
  { id: "cus_002", name: "Beta LLC", email: "hi@beta.example", phone: "+198765432", location: "Abuja" },
  { id: "cus_003", name: "Gamma Ltd", email: "contact@gamma.example", phone: "+234800111222", location: "Port Harcourt" },
];

async function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function GET() {
  await delay(250);
  return NextResponse.json({ data: DUMMY_CUSTOMERS });
}

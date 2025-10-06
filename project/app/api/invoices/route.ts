import { NextResponse } from "next/server";

const DUMMY_INVOICES = [
  { id: "inv_001", customer: "Acme Co", due: "2025-10-20", amount: 4200, status: "paid" },
  { id: "inv_002", customer: "Beta LLC", due: "2025-11-05", amount: 1280, status: "draft" },
  { id: "inv_003", customer: "Gamma Ltd", due: "2025-10-30", amount: 760, status: "overdue" },
];

async function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function GET() {
  await delay(250);
  return NextResponse.json({ data: DUMMY_INVOICES });
}

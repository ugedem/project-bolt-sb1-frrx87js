import { NextResponse } from "next/server";

const DUMMY_PRODUCTS = [
  { id: "prod_001", name: "Starter Plan", price: 0, sku: "ST-001", stock: 999 },
  { id: "prod_002", name: "Pro Plan", price: 199, sku: "PR-002", stock: 120 },
  { id: "prod_003", name: "Enterprise", price: 999, sku: "EN-003", stock: 5 },
];

async function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function GET() {
  await delay(250);
  return NextResponse.json({ data: DUMMY_PRODUCTS });
}

"use client";

import { useEffect, useState } from "react";

type Invoice = { id: string; customer: string; due: string; amount: number; status: string };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((j) => mounted && setInvoices(j?.data ?? []))
      .catch((e) => mounted && setErr(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading invoices…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!invoices || invoices.length === 0) return <div className="p-6">No invoices found.</div>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Invoices</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Due</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t">
                <td className="py-2">{inv.id}</td>
                <td className="py-2">{inv.customer}</td>
                <td className="py-2">{inv.due}</td>
                <td className="py-2">USD {inv.amount}</td>
                <td className="py-2">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

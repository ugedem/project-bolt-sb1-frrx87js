"use client";

import { useEffect, useState } from "react";

type Customer = { id: string; name: string; email: string; phone?: string; location?: string };

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/customers")
      .then((r) => r.json())
      .then((j) => mounted && setItems(j?.data ?? []))
      .catch((e) => mounted && setErr(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading customers…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!items || items.length === 0) return <div className="p-6">No customers found.</div>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.email}</td>
                <td className="py-2">{c.phone ?? "—"}</td>
                <td className="py-2">{c.location ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

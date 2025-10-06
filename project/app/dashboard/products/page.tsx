"use client";

import { useEffect, useState } from "react";

type Product = { id: string; name: string; price: number; sku: string; stock: number };

export default function ProductsPage() {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setData(json?.data ?? []);
      })
      .catch((e) => {
        setErr(String(e));
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-6">Loading products…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!data || data.length === 0) return <div className="p-6">No products found.</div>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">SKU</th>
              <th className="py-2">Name</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2">{p.sku}</td>
                <td className="py-2">{p.name}</td>
                <td className="py-2">USD {p.price}</td>
                <td className="py-2">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

"use client";

export default function LatestInvoices() {
  const invoices = [
    { id: 1, customer: "John Doe", amount: "$120", date: "2025-10-05" },
    { id: 2, customer: "Jane Smith", amount: "$80", date: "2025-10-03" },
    { id: 3, customer: "Michael Lee", amount: "$150", date: "2025-10-02" },
  ];

  return (
    <div className="col-span-4 rounded-2xl border p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Latest Invoices</h2>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id} className="flex justify-between border-b py-2">
            <span>{invoice.customer}</span>
            <span>{invoice.amount}</span>
            <span className="text-sm text-gray-500">{invoice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

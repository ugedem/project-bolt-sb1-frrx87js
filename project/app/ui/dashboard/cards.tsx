"use client";

export default function CardWrapper() {
  const mockData = [
    { title: "Active Users", value: 120 },
    { title: "Invoices", value: 30 },
    { title: "Revenue", value: "$12,000" },
    { title: "Growth", value: "15%" },
  ];

  return (
    <>
      {mockData.map((card, index) => (
        <div key={index} className="rounded-2xl border p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </>
  );
}

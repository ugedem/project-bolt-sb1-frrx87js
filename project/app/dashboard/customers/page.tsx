import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Customers
      </h1>
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <p className="text-gray-600">Customer management coming soon...</p>
      </div>
    </div>
  );
}

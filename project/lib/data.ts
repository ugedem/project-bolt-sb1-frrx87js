import { supabase } from './supabase';

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
  try {
    const { data, error } = await supabase
      .from('revenue')
      .select('*')
      .order('month');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        id,
        amount,
        customers (
          name,
          image_url,
          email
        )
      `)
      .order('date', { ascending: false })
      .limit(5);

    if (error) throw error;

    return data.map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      supabase.from('invoices').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('invoices').select('amount, status'),
    ]);

    const numberOfInvoices = invoiceCount.count ?? 0;
    const numberOfCustomers = customerCount.count ?? 0;
    const totalPaidInvoices = invoiceStatus.data
      ?.filter((invoice) => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0) ?? 0;
    const totalPendingInvoices = invoiceStatus.data
      ?.filter((invoice) => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0) ?? 0;

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: totalPaidInvoices / 100,
      totalPendingInvoices: totalPendingInvoices / 100,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let queryBuilder = supabase
      .from('invoices')
      .select(`
        id,
        amount,
        date,
        status,
        customers (
          name,
          email,
          image_url
        )
      `, { count: 'exact' })
      .order('date', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (query) {
      queryBuilder = queryBuilder.or(
        `customers.name.ilike.%${query}%,customers.email.ilike.%${query}%,status.ilike.%${query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    let queryBuilder = supabase
      .from('invoices')
      .select('*, customers(name, email)', { count: 'exact', head: true });

    if (query) {
      queryBuilder = queryBuilder.or(
        `customers.name.ilike.%${query}%,customers.email.ilike.%${query}%,status.ilike.%${query}%`
      );
    }

    const { count, error } = await queryBuilder;

    if (error) throw error;

    const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      return {
        ...data,
        amount: data.amount / 100,
      };
    }

    return null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all customers.');
  }
}

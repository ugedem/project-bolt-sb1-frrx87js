'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSession } from './auth';

const prisma = new PrismaClient();

const InvoiceSchema = z.object({
  customerId: z.string().nonempty("Please select a customer."),
  amount: z.coerce.number().gt(0, "Please enter an amount greater than $0."),
  status: z.enum(['pending', 'paid']),
});

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validated = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "Failed to create invoice." };
  }

  const { customerId, amount, status } = validated.data;

  await prisma.invoice.create({
    data: { customerId, amount: amount * 100, status, date: new Date() },
  });

  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validated = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "Failed to update invoice." };
  }

  const { customerId, amount, status } = validated.data;

  await prisma.invoice.update({
    where: { id },
    data: { customerId, amount: amount * 100, status },
  });

  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } });
  redirect('/dashboard/invoices');
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Use NextAuth signIn via server action if needed, or redirect to login page
  const session = await getSession();
  if (!session) return 'Invalid credentials.';

  redirect('/dashboard');
}

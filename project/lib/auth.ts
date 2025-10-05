import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

import { supabase } from "@/integrations/supabase/client";

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "googlemail.com", "hotmail.com", "outlook.com",
  "yahoo.com", "yahoo.co.uk", "aol.com", "live.com",
  "msn.com", "icloud.com", "me.com", "mail.com",
  "protonmail.com", "proton.me", "yandex.com", "zoho.com"
];

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return FREE_EMAIL_DOMAINS.includes(domain);
}

export async function signUpCandidate(email: string, password: string, fullName?: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { app_role: "candidate", full_name: fullName },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signUpCompany(
  email: string,
  password: string,
  companyName: string,
  contactName?: string,
  companyWebsite?: string,
  companySize?: string,
  industry?: string,
  howHeard?: string
) {
  if (isFreeEmailDomain(email)) {
    return { data: null, error: { message: "Please use your official company email address" } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { app_role: "company", full_name: contactName },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error || !data.user) return { data, error };

  // Create company record
  const { error: companyError } = await supabase.from("companies").insert({
    user_id: data.user.id,
    company_name: companyName,
    company_email: email,
    contact_person_name: contactName || null,
    company_website: companyWebsite || null,
    company_size: companySize || null,
    industry: industry || null,
    how_heard: howHeard || null,
  });

  if (companyError) return { data, error: companyError };
  return { data, error: null };
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUserRole(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return data?.role || null;
}

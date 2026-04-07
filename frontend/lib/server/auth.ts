import { cookies } from 'next/headers';

export async function getServerAuthUser() {
  const token = cookies().get('jwt')?.value;
  if (!token) return null;

  const base = process.env.API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/auth/me`, {
    headers: { Cookie: `jwt=${token}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.user ?? null;
}

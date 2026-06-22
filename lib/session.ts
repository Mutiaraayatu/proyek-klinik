import { cookies } from "next/headers";

// Membaca cookie sesi untuk tahu siapa yang sedang login
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) return null;

  try {
    return JSON.parse(session.value) as { id: number; nama: string; role: string };
  } catch {
    return null;
  }
}
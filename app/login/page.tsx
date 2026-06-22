import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Cari akun berdasarkan email
  const user = await prisma.user.findUnique({ where: { email } });

  // Kalau email tidak ada, atau password tidak cocok -> tolak
  if (!user || !(await bcrypt.compare(password, user.password))) {
    redirect("/login?error=1");
  }

  // Berhasil: simpan sesi (siapa yang login + perannya) di cookie
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({ id: user.id, nama: user.nama, role: user.role }), {
    httpOnly: true,
    path: "/",
  });

  redirect("/dokter");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Login Staf</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          Email atau password salah.
        </p>
      )}

      <form action={login} className="bg-gray-50 border p-5 rounded-lg space-y-3">
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Belum punya akun? <a href="/register" className="text-blue-600 hover:underline">Daftar di sini</a>
      </p>
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    redirect("/login?error=1");
  }

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Kembali ke beranda</a>
          <h1 className="text-3xl font-bold mt-3 text-slate-800">Login Staf</h1>
          <p className="text-slate-500 mt-2">Masuk untuk mengelola data klinik.</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center">
            Email atau password salah.
          </div>
        )}

        <form action={login} className="kartu space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input name="email" type="email" placeholder="email@klinik.com" required className="input-form" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" required className="input-form" />
          </div>
          <button type="submit" className="btn-primary w-full text-base py-3">
            Login
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Belum punya akun? <a href="/register" className="text-blue-600 hover:underline font-medium">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
}
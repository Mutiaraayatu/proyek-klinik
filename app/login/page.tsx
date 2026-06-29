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
          <div className="mt-4 mb-3 flex justify-center">
            <span className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-teal-900">Login Staf</h1>
          <p className="text-teal-700 mt-2">Masuk untuk mengelola data klinik.</p>
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
            <input name="password" type="password" placeholder="password" required className="input-form" />
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
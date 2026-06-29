import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function daftarAkun(formData: FormData) {
  "use server";
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const passwordAman = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { nama, email, password: passwordAman, role },
  });

  redirect("/login");
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Kembali ke beranda</a>
          <h1 className="text-3xl font-bold mt-3 text-teal-900">Daftar Akun Staf</h1>
          <p className="text-teal-700 mt-2">Buat akun untuk admin atau dokter.</p>
        </div>

        <form action={daftarAkun} className="kartu space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
            <input name="nama" placeholder="Nama lengkap" required className="input-form" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input name="email" type="email" placeholder="email@klinik.com" required className="input-form" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input name="password" type="password" placeholder="password" required className="input-form" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Peran</label>
            <select name="role" required className="input-form">
              <option value="dokter">Dokter (hanya melihat)</option>
              <option value="admin">Admin (akses penuh)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full text-base py-3">
            Daftar
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline font-medium">Login di sini</a>
        </p>
      </div>
    </div>
  );
}
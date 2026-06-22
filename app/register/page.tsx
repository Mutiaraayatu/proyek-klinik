import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function daftarAkun(formData: FormData) {
  "use server";
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // Acak password supaya aman (tidak disimpan apa adanya)
  const passwordAman = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { nama, email, password: passwordAman, role },
  });

  redirect("/login");
}

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Akun Staf</h1>

      <form action={daftarAkun} className="bg-gray-50 border p-5 rounded-lg space-y-3">
        <input name="nama" placeholder="Nama" required className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" />
        <select name="role" required className="w-full border p-2 rounded">
          <option value="dokter">Dokter (hanya melihat)</option>
          <option value="admin">Admin (akses penuh)</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Daftar
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline">Login di sini</a>
      </p>
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function daftarPasien(formData: FormData) {
  "use server";
  const namaPasien = formData.get("namaPasien") as string;
  const noHp = formData.get("noHp") as string;
  const keluhan = formData.get("keluhan") as string;
  const dokterId = Number(formData.get("dokterId"));

  await prisma.pendaftaran.create({
    data: { namaPasien, noHp, keluhan, dokterId },
  });

  redirect("/daftar?sukses=1");
}

export default async function DaftarPublikPage({
  searchParams,
}: {
  searchParams: Promise<{ sukses?: string }>;
}) {
  const { sukses } = await searchParams;

  const daftarDokter = await prisma.dokter.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Kembali ke beranda</a>
          <h1 className="text-3xl font-bold mt-3 text-teal-900">Pendaftaran Pasien</h1>
          <p className="text-teal-700 mt-2">Isi data Anda untuk mendaftar konsultasi.</p>
        </div>

        {sukses && (
          <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 text-center">
            ✓ Pendaftaran berhasil! Silakan datang sesuai jadwal dokter. Terima kasih.
          </div>
        )}

        <form action={daftarPasien} className="kartu space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input name="namaPasien" placeholder="Masukkan nama Anda" required className="input-form" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor HP</label>
            <input name="noHp" placeholder="Contoh: 0812xxxx" required className="input-form" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keluhan</label>
            <textarea name="keluhan" placeholder="Ceritakan keluhan Anda" required className="input-form" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Dokter</label>
            <select name="dokterId" required className="input-form">
              <option value="">-- Pilih Dokter --</option>
              {daftarDokter.map((dokter) => (
                <option key={dokter.id} value={dokter.id}>
                  {dokter.nama} ({dokter.spesialisasi}) - {dokter.hariPraktik}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full text-base py-3">
            Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
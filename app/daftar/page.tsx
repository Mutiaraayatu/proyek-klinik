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
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Pendaftaran Pasien</h1>
      <p className="text-gray-600 mb-6">Silakan isi data Anda untuk mendaftar konsultasi.</p>

      {sukses && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          Pendaftaran berhasil! Silakan datang sesuai jadwal dokter. Terima kasih.
        </div>
      )}

      <form action={daftarPasien} className="bg-gray-50 border p-5 rounded-lg space-y-3">
        <input name="namaPasien" placeholder="Nama lengkap" required className="w-full border p-2 rounded" />
        <input name="noHp" placeholder="Nomor HP" required className="w-full border p-2 rounded" />
        <textarea name="keluhan" placeholder="Keluhan Anda" required className="w-full border p-2 rounded" />
        <select name="dokterId" required className="w-full border p-2 rounded">
          <option value="">-- Pilih Dokter --</option>
          {daftarDokter.map((dokter) => (
            <option key={dokter.id} value={dokter.id}>
              {dokter.nama} ({dokter.spesialisasi}) - {dokter.hariPraktik}
            </option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Daftar Sekarang
        </button>
      </form>
    </div>
  );
}
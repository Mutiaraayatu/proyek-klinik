import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

async function tambahPendaftaran(formData: FormData) {
  "use server";
  const namaPasien = formData.get("namaPasien") as string;
  const noHp = formData.get("noHp") as string;
  const keluhan = formData.get("keluhan") as string;
  const dokterId = Number(formData.get("dokterId"));

  await prisma.pendaftaran.create({
    data: { namaPasien, noHp, keluhan, dokterId },
  });

  revalidatePath("/pendaftaran");
}

async function lanjutkanStatus(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));

  const pasien = await prisma.pendaftaran.findUnique({ where: { id } });
  if (!pasien) return;

  let statusBaru = pasien.status;
  if (pasien.status === "Menunggu") statusBaru = "Diperiksa";
  else if (pasien.status === "Diperiksa") statusBaru = "Selesai";

  await prisma.pendaftaran.update({
    where: { id },
    data: { status: statusBaru },
  });

  revalidatePath("/pendaftaran");
}

async function hapusPendaftaran(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));

  await prisma.pendaftaran.delete({ where: { id } });

  revalidatePath("/pendaftaran");
}

async function logout() {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export default async function HalamanPendaftaran() {
  // Penjaga: kalau belum login, tendang ke halaman login
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.role === "admin";

  const daftarPendaftaran = await prisma.pendaftaran.findMany({
    include: { dokter: true },
    orderBy: { id: "desc" },
  });

  const daftarDokter = await prisma.dokter.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pendaftaran Pasien</h1>
        <div className="text-sm">
          <span className="text-gray-600 mr-3">
            {session.nama} ({session.role})
          </span>
          <form action={logout} className="inline">
            <button className="text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </div>

      {/* Form daftar hanya untuk admin */}
      {isAdmin && (
        <form action={tambahPendaftaran} className="bg-gray-50 border p-5 rounded-lg mb-8 space-y-3">
          <h2 className="font-semibold text-lg">Daftar Baru</h2>
          <input name="namaPasien" placeholder="Nama pasien" required className="w-full border p-2 rounded" />
          <input name="noHp" placeholder="Nomor HP" required className="w-full border p-2 rounded" />
          <textarea name="keluhan" placeholder="Keluhan" required className="w-full border p-2 rounded" />
          <select name="dokterId" required className="w-full border p-2 rounded">
            <option value="">-- Pilih Dokter --</option>
            {daftarDokter.map((dokter) => (
              <option key={dokter.id} value={dokter.id}>
                {dokter.nama} ({dokter.spesialisasi})
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Daftar
          </button>
        </form>
      )}

      <h2 className="font-semibold text-lg mb-3">Daftar Antrian</h2>
      {daftarPendaftaran.length === 0 ? (
        <p className="text-gray-500">Belum ada pendaftaran.</p>
      ) : (
        <ul className="space-y-2">
          {daftarPendaftaran.map((p) => (
            <li key={p.id} className="border p-3 rounded">
              <p className="font-medium">{p.namaPasien}</p>
              <p className="text-sm text-gray-600">{p.keluhan} · HP: {p.noHp}</p>
              <p className="text-sm text-gray-600">
                Dokter: {p.dokter.nama} · Status: <span className="font-medium">{p.status}</span>
              </p>

              {/* Tombol aksi hanya untuk admin */}
              {isAdmin && (
                <div className="flex items-center gap-3 mt-2">
                  {p.status !== "Selesai" && (
                    <form action={lanjutkanStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        {p.status === "Menunggu" ? "Mulai Periksa" : "Tandai Selesai"}
                      </button>
                    </form>
                  )}
                  <form action={hapusPendaftaran}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-red-600 text-sm hover:underline">
                      Hapus
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
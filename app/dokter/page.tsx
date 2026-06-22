import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

async function tambahDokter(formData: FormData) {
  "use server";
  const nama = formData.get("nama") as string;
  const spesialisasi = formData.get("spesialisasi") as string;
  const hariPraktik = formData.get("hariPraktik") as string;

  await prisma.dokter.create({
    data: { nama, spesialisasi, hariPraktik },
  });

  revalidatePath("/dokter");
}

async function hapusDokter(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));

  await prisma.dokter.delete({ where: { id } });

  revalidatePath("/dokter");
}

async function logout() {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export default async function HalamanDokter() {
  // Penjaga: kalau belum login, tendang ke halaman login
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.role === "admin";

  const daftarDokter = await prisma.dokter.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Data Dokter</h1>
        <div className="text-sm">
          <span className="text-gray-600 mr-3">
            {session.nama} ({session.role})
          </span>
          <form action={logout} className="inline">
            <button className="text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </div>

      {/* Form tambah hanya untuk admin */}
      {isAdmin && (
        <form action={tambahDokter} className="bg-gray-50 border p-5 rounded-lg mb-8 space-y-3">
          <h2 className="font-semibold text-lg">Tambah Dokter</h2>
          <input name="nama" placeholder="Nama dokter" required className="w-full border p-2 rounded" />
          <input name="spesialisasi" placeholder="Spesialisasi" required className="w-full border p-2 rounded" />
          <input name="hariPraktik" placeholder="Hari praktik (mis. Senin & Rabu)" required className="w-full border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Simpan
          </button>
        </form>
      )}

      <h2 className="font-semibold text-lg mb-3">Daftar Dokter</h2>
      {daftarDokter.length === 0 ? (
        <p className="text-gray-500">Belum ada dokter.</p>
      ) : (
        <ul className="space-y-2">
          {daftarDokter.map((dokter) => (
            <li key={dokter.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-medium">{dokter.nama}</p>
                <p className="text-sm text-gray-600">
                  {dokter.spesialisasi} — {dokter.hariPraktik}
                </p>
              </div>
              {/* Tombol Edit & Hapus hanya untuk admin */}
              {isAdmin && (
                <div className="flex gap-3 items-center">
                  <a href={`/dokter/${dokter.id}/edit`} className="text-blue-600 text-sm hover:underline">
                    Edit
                  </a>
                  <form action={hapusDokter}>
                    <input type="hidden" name="id" value={dokter.id} />
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
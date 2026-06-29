import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import NavStaf from "@/app/components/NavStaf";

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

export default async function HalamanDokter() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.role === "admin";

  const daftarDokter = await prisma.dokter.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="min-h-screen">
      <NavStaf nama={session.nama} role={session.role} />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-teal-900">Kelola Data Dokter</h1>

        {isAdmin && (
          <form action={tambahDokter} className="kartu space-y-4 mb-8">
            <h2 className="font-semibold text-lg text-teal-900">Tambah Dokter</h2>
            <input name="nama" placeholder="Nama dokter" required className="input-form" />
            <input name="spesialisasi" placeholder="Spesialisasi" required className="input-form" />
            <input name="hariPraktik" placeholder="Hari praktik (mis. Senin & Rabu)" required className="input-form" />
            <button type="submit" className="btn-primary">Simpan</button>
          </form>
        )}

        <h2 className="font-semibold text-lg mb-3 text-teal-900">Daftar Dokter</h2>
        {daftarDokter.length === 0 ? (
          <p className="text-slate-500">Belum ada dokter.</p>
        ) : (
          <ul className="space-y-3">
            {daftarDokter.map((dokter) => (
              <li key={dokter.id} className="kartu flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">{dokter.nama}</p>
                  <p className="text-sm text-slate-500">
                    {dokter.spesialisasi} · {dokter.hariPraktik}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-3 items-center">
                    <a href={`/dokter/${dokter.id}/edit`} className="text-teal-700 text-sm font-medium hover:underline">
                      Edit
                    </a>
                    <form action={hapusDokter}>
                      <input type="hidden" name="id" value={dokter.id} />
                      <button type="submit" className="text-red-600 text-sm font-medium hover:underline">
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
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import NavStaf from "@/app/components/NavStaf";

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

export default async function HalamanPendaftaran() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.role === "admin";

  const daftarPendaftaran = await prisma.pendaftaran.findMany({
    include: { dokter: true },
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <NavStaf nama={session.nama} role={session.role} />

      <div className="max-w-2xl mx-auto p-8 pt-0">
        <h1 className="text-2xl font-bold mb-6">Antrian Pasien</h1>

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
                <p className="text-sm text-gray-500">
                  Daftar: {p.tanggalDaftar.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>

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
    </div>
  );
}
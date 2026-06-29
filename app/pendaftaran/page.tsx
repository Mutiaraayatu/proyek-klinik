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

function kelasStatus(status: string) {
  if (status === "Diperiksa") return "status-diperiksa";
  if (status === "Selesai") return "status-selesai";
  return "status-menunggu";
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
    <div className="min-h-screen">
      <NavStaf nama={session.nama} role={session.role} />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-teal-900">Antrian Pasien</h1>

        {daftarPendaftaran.length === 0 ? (
          <p className="text-slate-500">Belum ada pendaftaran.</p>
        ) : (
          <ul className="space-y-3">
            {daftarPendaftaran.map((p) => (
              <li key={p.id} className="kartu">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800">{p.namaPasien}</p>
                    <p className="text-sm text-slate-500">{p.keluhan} · HP: {p.noHp}</p>
                    <p className="text-sm text-slate-500">Dokter: {p.dokter.nama}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Daftar: {p.tanggalDaftar.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={kelasStatus(p.status)}>{p.status}</span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                    {p.status !== "Selesai" && (
                      <form action={lanjutkanStatus}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-800">
                          {p.status === "Menunggu" ? "Mulai Periksa" : "Tandai Selesai"}
                        </button>
                      </form>
                    )}
                    <form action={hapusPendaftaran}>
                      <input type="hidden" name="id" value={p.id} />
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
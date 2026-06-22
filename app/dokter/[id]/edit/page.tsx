import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";

// Update: simpan perubahan data dokter
async function updateDokter(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const spesialisasi = formData.get("spesialisasi") as string;
  const hariPraktik = formData.get("hariPraktik") as string;

  await prisma.dokter.update({
    where: { id },
    data: { nama, spesialisasi, hariPraktik },
  });

  revalidatePath("/dokter");
  redirect("/dokter");
}

export default async function EditDokterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Ambil data dokter yang mau diedit
  const dokter = await prisma.dokter.findUnique({
    where: { id: Number(id) },
  });

  if (!dokter) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Dokter</h1>

      <form action={updateDokter} className="bg-gray-50 border p-5 rounded-lg space-y-3">
        <input type="hidden" name="id" value={dokter.id} />
        <input name="nama" defaultValue={dokter.nama} required className="w-full border p-2 rounded" />
        <input name="spesialisasi" defaultValue={dokter.spesialisasi} required className="w-full border p-2 rounded" />
        <input name="hariPraktik" defaultValue={dokter.hariPraktik} required className="w-full border p-2 rounded" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Update
          </button>
          <a href="/dokter" className="inline-block bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Batal
          </a>
        </div>
      </form>
    </div>
  );
}
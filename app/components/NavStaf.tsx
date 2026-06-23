import { redirect } from "next/navigation";

async function logout() {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export default function NavStaf({ nama, role }: { nama: string; role: string }) {
  return (
    <nav className="bg-white border-b mb-6">
      <div className="max-w-2xl mx-auto px-8 py-3 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-4">
          <a href="/dokter" className="font-medium hover:text-blue-600">Kelola Dokter</a>
          <a href="/pendaftaran" className="font-medium hover:text-blue-600">Antrian Pasien</a>
        </div>
        <div className="text-sm flex items-center gap-3">
          <span className="text-gray-600">{nama} ({role})</span>
          <form action={logout} className="inline">
            <button className="text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
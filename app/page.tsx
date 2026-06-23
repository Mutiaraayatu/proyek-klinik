export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-white rounded-2xl text-3xl mb-5 shadow-lg">
          🩺
        </div>
        <h1 className="text-4xl font-bold mb-3 text-slate-800">Klinik Sehat Bersama</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Layanan kesehatan terpercaya. Daftar konsultasi dengan dokter kami secara online, mudah dan tanpa antre lama.
        </p>

        <div className="space-y-3">
          <a href="/daftar" className="btn-primary w-full text-base py-3">
            Daftar sebagai Pasien
          </a>
          <a href="/login" className="btn-secondary w-full text-base py-3">
            Login Staf
          </a>
        </div>

        <p className="text-sm text-slate-400 mt-10">
          &copy; 2026 Klinik Sehat Bersama
        </p>
      </div>
    </div>
  );
}
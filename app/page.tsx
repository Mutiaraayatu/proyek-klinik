export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-center gap-2 py-4 border-b border-gray-100">
        <span className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center text-lg">
          🏥
        </span>
        <span className="text-lg font-semibold text-teal-700">Klinik Asy-Syifa</span>
      </header>

      {/* Hero */}
      <section className="bg-teal-50 px-6 py-12 text-center">
        <span className="inline-block bg-teal-200 text-teal-900 text-xs px-4 py-1 rounded-full mb-4">
          Layanan kesehatan terpercaya
        </span>
        <h1 className="text-3xl font-bold text-teal-900 mb-3">Klinik Asy-Syifa</h1>
        <p className="text-teal-700 max-w-md mx-auto mb-6 leading-relaxed">
          Daftar konsultasi dengan dokter kami secara online
          insyaallah mudah, cepat, dan satt settt.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/daftar" className="bg-teal-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-800">
            Daftar sebagai Pasien
          </a>
          <a href="/login" className="bg-white text-teal-700 font-medium px-6 py-3 rounded-lg border border-teal-200 hover:bg-teal-50">
            Login Staf
          </a>
        </div>
      </section>

      {/* Kartu info */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-8 max-w-3xl mx-auto">
        <div className="border border-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🕐</div>
          <div className="font-medium text-slate-800 mb-1">Jam Buka</div>
          <div className="text-sm text-gray-500">Senin–Minggu<br />24 jam</div>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">📍</div>
          <div className="font-medium text-slate-800 mb-1">Lokasi</div>
          <div className="text-sm text-gray-500">Jl. Kesehatan No. 1<br />Jakarta</div>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🩺</div>
          <div className="font-medium text-slate-800 mb-1">Layanan</div>
          <div className="text-sm text-gray-500">Apa aja ada</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
        &copy; 2026 Bismillah Sehatt
      </footer>
    </div>
  );
}
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-3">Klinik Sehat Bersama</h1>
        <p className="text-gray-600 mb-8">
          Layanan kesehatan terpercaya. Daftar konsultasi dengan mudah.
        </p>
        <div className="space-y-3">
          <a href="/daftar" className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
            Daftar sebagai Pasien
          </a>
          <a href="/login" className="block w-full bg-white border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
            Login Staf
          </a>
        </div>
      </div>
    </div>
  );
}
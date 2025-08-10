import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">
          Страница не найдена
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-block"
          >
            На главную
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

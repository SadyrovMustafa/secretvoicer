export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
        <p className="text-xl text-gray-300 mb-6">
          Произошла внутренняя ошибка сервера
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Обновить страницу
        </button>
      </div>
    </div>
  )
}

import { NextPageContext } from 'next'
import { ErrorProps } from 'next/error'

interface CustomErrorProps extends ErrorProps {
  hasGetInitialProps?: boolean
}

function Error({ statusCode, hasGetInitialProps }: CustomErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">
          {statusCode || 'Ошибка'}
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          {statusCode
            ? `Произошла ошибка ${statusCode} на сервере`
            : 'Произошла ошибка на клиенте'}
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

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error

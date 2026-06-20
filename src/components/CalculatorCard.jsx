import { Link } from 'react-router-dom'

export default function CalculatorCard({ calc, rank }) {
  return (
    <Link
      to={calc.path}
      className="calc-card hover:shadow-md hover:border-blue-200 transition-all group block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{calc.icon}</span>
        {rank && (
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            TOP {rank}
          </span>
        )}
      </div>
      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
        {calc.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{calc.description}</p>
      <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
        계산하기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  )
}

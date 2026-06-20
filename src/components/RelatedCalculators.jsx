import { Link } from 'react-router-dom'
import { calculators } from '../data/calculators'

export default function RelatedCalculators({ currentId }) {
  const related = calculators.filter(c => c.id !== currentId).slice(0, 4)
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-800 mb-4">다른 인기 계산기</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map(calc => (
          <Link
            key={calc.id}
            to={calc.path}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all text-center group"
          >
            <div className="text-2xl mb-2">{calc.icon}</div>
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              {calc.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

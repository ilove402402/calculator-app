import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🧮</span>
          <div className="hidden sm:block">
            <div className="font-bold text-blue-600 leading-tight text-lg">모두의 계산기</div>
            <div className="text-xs text-gray-400 leading-tight">복잡한 계산, 쉽고 빠르게</div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="계산기 검색..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 shrink-0">
          <Link to="/" className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            홈
          </Link>
          <Link to="/salary" className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            급여
          </Link>
          <Link to="/loan" className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            금융
          </Link>
          <Link to="/bmi" className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            건강
          </Link>
        </nav>
      </div>
    </header>
  )
}

import { Link } from 'react-router-dom'

const FOOTER_CATEGORIES = [
  { slug: 'salary-labor', icon: '💼', name: '급여/노동' },
  { slug: 'real-estate',  icon: '🏠', name: '부동산/세금' },
  { slug: 'finance',      icon: '💰', name: '금융/재테크' },
  { slug: 'life-welfare', icon: '👶', name: '생활/복지' },
  { slug: 'health',       icon: '❤️', name: '건강' },
  { slug: 'convenience',  icon: '🧮', name: '생활편의' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* 카테고리 링크 */}
      <div className="max-w-6xl mx-auto px-4 py-5 border-b border-gray-100">
        <div className="flex flex-wrap justify-center gap-2">
          {FOOTER_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600
                         rounded-full text-sm text-gray-600 transition-colors"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧮</span>
          <span className="font-bold text-blue-600 text-sm">모두의 계산기</span>
          <span className="text-gray-300 mx-1">|</span>
          <p className="text-xs text-gray-400">계산 결과는 참고용이며 실제와 다를 수 있습니다.</p>
        </div>
        <div className="flex gap-4">
          <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">이용약관</span>
          <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">개인정보처리방침</span>
          <span className="text-xs text-gray-400">© 2026</span>
        </div>
      </div>
    </footer>
  )
}

import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import CalculatorCard from '../components/CalculatorCard'
import IsansuModal from '../components/IsansuModal'
import { calculators } from '../data/calculators'

const CATEGORY_CARDS = [
  {
    slug: 'salary-labor', icon: '💼', name: '급여/노동',
    hoverColor: 'hover:border-blue-200', textColor: 'text-blue-700',
    items: [
      { name: '연봉 실수령액',  path: '/salary' },
      { name: '실업급여',      path: '/unemployment' },
      { name: '퇴직금',        path: '/retirement' },
      { name: '최저시급/알바', path: '/minimum-wage' },
      { name: '주휴수당',      path: '/category/salary-labor', soon: true },
    ],
  },
  {
    slug: 'real-estate', icon: '🏠', name: '부동산/세금',
    hoverColor: 'hover:border-emerald-200', textColor: 'text-emerald-700',
    items: [
      { name: '양도소득세',     path: '/capital-gains' },
      { name: '취득세',         path: '/category/real-estate', soon: true },
      { name: '부동산 중개수수료', path: '/category/real-estate', soon: true },
      { name: '증여세',         path: '/category/real-estate', soon: true },
      { name: '전세/월세 전환', path: '/category/real-estate', soon: true },
    ],
  },
  {
    slug: 'finance', icon: '💰', name: '금융/재테크',
    hoverColor: 'hover:border-yellow-200', textColor: 'text-yellow-700',
    items: [
      { name: '대출 이자', path: '/loan' },
      { name: '적금 이자', path: '/category/finance', soon: true },
      { name: '환율 계산', path: '/category/finance', soon: true },
      { name: '복리 계산', path: '/category/finance', soon: true },
      { name: '부가세(VAT)', path: '/category/finance', soon: true },
    ],
  },
  {
    slug: 'life-welfare', icon: '👶', name: '생활/복지',
    hoverColor: 'hover:border-pink-200', textColor: 'text-pink-700',
    items: [
      { name: '육아휴직급여',  path: '/category/life-welfare', soon: true },
      { name: '기초연금',      path: '/category/life-welfare', soon: true },
      { name: '국민연금 수령액', path: '/category/life-welfare', soon: true },
      { name: '아동수당',      path: '/category/life-welfare', soon: true },
      { name: '군인 월급',     path: '/category/life-welfare', soon: true },
    ],
  },
  {
    slug: 'health', icon: '❤️', name: '건강',
    hoverColor: 'hover:border-red-200', textColor: 'text-red-600',
    items: [
      { name: 'BMI 체질량지수', path: '/bmi' },
      { name: '칼로리 계산',   path: '/category/health', soon: true },
      { name: '기초대사량',    path: '/category/health', soon: true },
      { name: '임신 주수',     path: '/category/health', soon: true },
      { name: '체지방률',      path: '/category/health', soon: true },
    ],
  },
  {
    slug: 'convenience', icon: '🧮', name: '생활편의',
    hoverColor: 'hover:border-violet-200', textColor: 'text-violet-700',
    items: [
      { name: 'D-day 카운터',   path: '/dday' },
      { name: '나이 계산',      path: '/category/convenience', soon: true },
      { name: '날짜 계산',      path: '/category/convenience', soon: true },
      { name: '평/제곱미터 변환', path: '/category/convenience', soon: true },
      { name: '전기요금',       path: '/category/convenience', soon: true },
    ],
  },
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showModal, setShowModal] = useState(false)

  const filtered = query.trim()
    ? calculators.filter(c =>
        c.name.includes(query) || c.description.includes(query)
      )
    : calculators

  return (
    <Layout>
      {/* 이산수 배너 */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base">🤖</span>
            <span className="text-slate-300">
              <span className="font-semibold text-white">이산수</span>가 오늘도 새로운 계산기를 분석 중입니다
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-slate-300 hover:text-white border border-slate-500 hover:border-slate-300 px-3 py-1 rounded-full transition-colors shrink-0"
          >
            계산기 요청하기
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">🧮 모두의 계산기</h1>
          <p className="text-blue-100 mb-8 text-lg">복잡한 계산, 쉽고 빠르게</p>
          <div className="max-w-xl mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="계산기를 검색해보세요 (예: 연봉, 대출, BMI)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 text-base
                         focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['연봉', '실업급여', '대출', 'BMI', 'D-day'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-4 py-1.5 bg-blue-500 bg-opacity-50 hover:bg-opacity-70 rounded-full text-sm text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {query.trim() ? `"${query}" 검색 결과 (${filtered.length}개)` : '인기 계산기 TOP 10'}
          </h2>
          {query.trim() && (
            <button onClick={() => setQuery('')} className="text-sm text-blue-600 hover:underline">
              전체 보기
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm mt-2">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(calc => (
              <CalculatorCard key={calc.id} calc={calc} rank={calc.rank} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">카테고리</h2>
          <p className="text-sm text-gray-400 mb-6">원하는 분야의 계산기를 바로 찾아보세요</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORY_CARDS.map(cat => (
              <div key={cat.slug}
                className={`calc-card border-2 border-transparent transition-all ${cat.hoverColor}`}>
                {/* 카드 헤더 */}
                <Link to={`/category/${cat.slug}`}
                  className="flex items-center gap-3 mb-4 group">
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1">
                    <span className={`font-bold text-base group-hover:text-blue-600 transition-colors ${cat.textColor}`}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-sm">전체 →</span>
                </Link>

                {/* 계산기 목록 */}
                <ul className="space-y-1">
                  {cat.items.map(item => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-gray-600
                                   hover:bg-gray-50 hover:text-blue-600 transition-colors group/item"
                      >
                        <span className="text-gray-300 group-hover/item:text-blue-400 transition-colors">›</span>
                        <span className="flex-1">{item.name}</span>
                        {item.soon && (
                          <span className="text-xs text-gray-300 font-medium">준비중</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이산수 소개 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 text-9xl opacity-5 leading-none select-none">🤖</div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* 캐릭터 */}
            <div className="shrink-0 text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-3">
                🤖
              </div>
              <div className="text-xs text-slate-400 font-medium">AI 계산기 운영 직원</div>
            </div>

            {/* 소개 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <h2 className="text-2xl font-bold">이산수</h2>
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">AI</span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-5">
                저 <span className="font-semibold text-white">이산수</span>가 매일 트렌드를 분석하고 새로운 계산기를 추가합니다.<br className="hidden md:block" />
                사용자가 필요한 계산기를 먼저 파악해서 빠르게 개발하는 것이 저의 역할이에요.
              </p>

              {/* 통계 */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                {[
                  ['10개', '현재 운영 중'],
                  ['50+개', '개발 예정'],
                  ['매일', '트렌드 분석'],
                ].map(([value, label]) => (
                  <div key={label} className="text-center md:text-left">
                    <div className="text-2xl font-bold text-blue-400">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
              >
                🤖 이산수에게 계산기 요청하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {showModal && <IsansuModal onClose={() => setShowModal(false)} />}
    </Layout>
  )
}

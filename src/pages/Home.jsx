import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import CalculatorCard from '../components/CalculatorCard'
import IsansuModal from '../components/IsansuModal'
import { calculators } from '../data/calculators'
import { getTopRequests, getGenerated } from '../utils/storage'

const CATEGORY_CARDS = [
  {
    slug: 'salary-labor', icon: '💼', name: '급여/노동',
    hoverColor: 'hover:border-blue-200', textColor: 'text-blue-700',
    items: [
      { name: '연봉 실수령액',  path: '/salary' },
      { name: '실업급여',      path: '/unemployment' },
      { name: '퇴직금',        path: '/retirement' },
      { name: '최저시급/알바', path: '/minimum-wage' },
      { name: '주휴수당',      path: '/weekly-holiday-pay' },
    ],
  },
  {
    slug: 'real-estate', icon: '🏠', name: '부동산/세금',
    hoverColor: 'hover:border-emerald-200', textColor: 'text-emerald-700',
    items: [
      { name: '양도소득세',      path: '/capital-gains' },
      { name: '취득세',          path: '/acquisition-tax' },
      { name: '부동산 중개수수료', path: '/real-estate-fee' },
      { name: '증여세',          path: '/gift-tax' },
      { name: '전세/월세 전환',  path: '/rent-conversion' },
    ],
  },
  {
    slug: 'finance', icon: '💰', name: '금융/재테크',
    hoverColor: 'hover:border-yellow-200', textColor: 'text-yellow-700',
    items: [
      { name: '대출 이자',   path: '/loan' },
      { name: '적금 이자',   path: '/savings' },
      { name: '환율 계산',   path: '/exchange' },
      { name: '복리 계산',   path: '/compound-interest' },
      { name: '부가세(VAT)', path: '/vat' },
    ],
  },
  {
    slug: 'life-welfare', icon: '👶', name: '생활/복지',
    hoverColor: 'hover:border-pink-200', textColor: 'text-pink-700',
    items: [
      { name: '육아휴직급여',    path: '/parental-leave' },
      { name: '기초연금',        path: '/basic-pension' },
      { name: '국민연금 수령액', path: '/national-pension' },
      { name: '아동수당',        path: '/child-allowance' },
      { name: '군인 월급',       path: '/military-salary' },
    ],
  },
  {
    slug: 'health', icon: '❤️', name: '건강',
    hoverColor: 'hover:border-red-200', textColor: 'text-red-600',
    items: [
      { name: 'BMI 체질량지수', path: '/bmi' },
      { name: '칼로리 계산',    path: '/calorie' },
      { name: '기초대사량',     path: '/bmr' },
      { name: '임신 주수',      path: '/pregnancy' },
      { name: '체지방률',       path: '/body-fat' },
    ],
  },
  {
    slug: 'convenience', icon: '🧮', name: '생활편의',
    hoverColor: 'hover:border-violet-200', textColor: 'text-violet-700',
    items: [
      { name: 'D-day 카운터',    path: '/dday' },
      { name: '나이 계산',       path: '/age-calc' },
      { name: '날짜 계산',       path: '/date-calc' },
      { name: '평수 변환',       path: '/area-convert' },
      { name: '전기요금',        path: '/electricity' },
    ],
  },
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showModal, setShowModal] = useState(false)
  const [topRequests, setTopRequests] = useState([])
  const [generatedCalcs, setGeneratedCalcs] = useState([])

  useEffect(() => {
    setTopRequests(getTopRequests(5))
    setGeneratedCalcs(getGenerated())
  }, [])

  const filtered = query.trim()
    ? calculators.filter(c =>
        c.name.includes(query) || c.description.includes(query)
      )
    : calculators

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <Layout>
      {/* 이산수 배너 */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base">🤖</span>
            <span className="text-slate-300">
              <span className="font-semibold text-white">이산수</span>가 오늘도 새로운 계산기를 분석 중입니다
              {topRequests.length > 0 && (
                <span className="ml-2 text-slate-400">
                  · 이번 주 요청 {topRequests.reduce((s, r) => s + r.votes, 0)}표
                </span>
              )}
            </span>
          </div>
          <Link
            to="/request"
            className="text-xs text-slate-300 hover:text-white border border-slate-500 hover:border-slate-300 px-3 py-1 rounded-full transition-colors shrink-0"
          >
            계산기 요청하기 →
          </Link>
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

      {/* 이산수가 추가한 NEW 계산기 */}
      {generatedCalcs.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-2 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-800">🤖 이산수가 추가한 계산기</h2>
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {generatedCalcs.map(calc => (
              <Link
                key={calc.id}
                to={calc.path}
                className="calc-card hover:shadow-md hover:border-blue-200 transition-all group relative"
              >
                {new Date(calc.createdAt) > sevenDaysAgo && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
                <div className="text-3xl mb-2 text-center">{calc.spec.icon}</div>
                <div className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center leading-tight">
                  {calc.name}
                </div>
                <div className="text-xs text-slate-400 text-center mt-1">🤖 AI 생성</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 이산수 소개 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 text-9xl opacity-5 leading-none select-none">🤖</div>

          <div className="relative flex flex-col lg:flex-row items-start gap-8">
            {/* 캐릭터 + 소개 */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0">
                  🤖
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">이산수</h2>
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">AI</span>
                  </div>
                  <p className="text-slate-400 text-sm">AI 계산기 자동 생성 시스템</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-5">
                저 <span className="font-semibold text-white">이산수</span>가 여러분이 원하는 계산기를 분석하고 즉시 만들어드립니다.<br className="hidden md:block" />
                계산기 이름과 설명만 입력하면 AI가 자동으로 완성합니다.
              </p>

              <div className="flex flex-wrap gap-5 mb-6">
                {[
                  [String(10 + generatedCalcs.length) + '개', '운영 중'],
                  [String(topRequests.length) + '개', '이번 주 요청'],
                  ['즉시', '자동 생성'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-blue-400">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/request"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
              >
                🤖 이산수에게 계산기 요청하기
              </Link>
            </div>

            {/* 이번 주 TOP 5 요청 */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-white bg-opacity-5 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  🔥 이번 주 인기 요청 TOP 5
                </h3>
                {topRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-400 text-xs mb-2">아직 요청이 없습니다</p>
                    <Link to="/request" className="text-xs text-blue-400 hover:text-blue-300 underline">
                      첫 번째 요청 보내기 →
                    </Link>
                  </div>
                ) : (
                  <ol className="space-y-2">
                    {topRequests.map((req, i) => (
                      <li key={req.id} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                          ${i === 0 ? 'bg-yellow-500 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 truncate">{req.name}</p>
                        </div>
                        <span className="text-xs text-blue-400 font-medium shrink-0">{req.votes}표</span>
                      </li>
                    ))}
                  </ol>
                )}
                <Link
                  to="/request"
                  className="mt-4 block text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  전체 요청 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && <IsansuModal onClose={() => setShowModal(false)} />}
    </Layout>
  )
}

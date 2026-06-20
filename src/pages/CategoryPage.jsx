import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import CalculatorCard from '../components/CalculatorCard'
import IsansuModal from '../components/IsansuModal'
import { calculators } from '../data/calculators'

export const CATEGORIES = {
  'salary-labor': {
    icon: '💼', name: '급여/노동',
    description: '연봉·실업급여·퇴직금·4대보험 등 근로 관련 계산기',
    gradient: 'from-blue-500 to-blue-700',
    planned: [
      { name: '주휴수당',      icon: '📆', eta: '2026.07' },
      { name: '야근수당',      icon: '🌙', eta: '2026.07' },
      { name: '연차수당',      icon: '🏖️', eta: '2026.08' },
      { name: '육아휴직급여',  icon: '👶', eta: '2026.08' },
      { name: '출산휴가급여',  icon: '🤱', eta: '2026.09' },
      { name: '프리랜서 세금', icon: '💻', eta: '2026.09' },
      { name: '알바 주급',     icon: '💵', eta: '2026.10' },
    ],
  },
  'real-estate': {
    icon: '🏠', name: '부동산/세금',
    description: '양도소득세·취득세·재산세·임대소득세 등 부동산 계산기',
    gradient: 'from-emerald-500 to-emerald-700',
    planned: [
      { name: '취득세',           icon: '🏷️', eta: '2026.07' },
      { name: '증여세',           icon: '🎁', eta: '2026.07' },
      { name: '상속세',           icon: '📜', eta: '2026.08' },
      { name: '부동산 중개수수료', icon: '🤝', eta: '2026.08' },
      { name: '전세/월세 전환',   icon: '🔄', eta: '2026.09' },
      { name: '청약 가점',        icon: '🏢', eta: '2026.09' },
      { name: 'DSR',              icon: '📊', eta: '2026.10' },
      { name: '임대수익률',       icon: '📈', eta: '2026.10' },
    ],
  },
  finance: {
    icon: '💰', name: '금융/재테크',
    description: '대출이자·복리·투자수익률·환율 등 금융 계산기',
    gradient: 'from-yellow-500 to-orange-500',
    planned: [
      { name: '적금 이자',     icon: '🏦', eta: '2026.07' },
      { name: '복리 계산',     icon: '📈', eta: '2026.07' },
      { name: '단리 계산',     icon: '📉', eta: '2026.07' },
      { name: '환율 계산',     icon: '💱', eta: '2026.08' },
      { name: '부가세(VAT)',   icon: '🧾', eta: '2026.08' },
      { name: '주식 수익률',   icon: '📊', eta: '2026.09' },
      { name: '로또 당첨금',   icon: '🎰', eta: '2026.09' },
      { name: '연말정산 환급', icon: '💸', eta: '2026.10' },
      { name: '신용카드 할부', icon: '💳', eta: '2026.10' },
    ],
  },
  'life-welfare': {
    icon: '👶', name: '생활/복지',
    description: '육아휴직·출산급여·장애수당·기초생활수급 등 복지 계산기',
    gradient: 'from-pink-500 to-rose-600',
    planned: [
      { name: '기초연금',       icon: '👴', eta: '2026.07' },
      { name: '국민연금 수령액', icon: '🏛️', eta: '2026.07' },
      { name: '아동수당',       icon: '🧒', eta: '2026.08' },
      { name: '기초생활수급',   icon: '🏠', eta: '2026.08' },
      { name: '장애인연금',     icon: '♿', eta: '2026.09' },
      { name: '군인 월급',      icon: '🪖', eta: '2026.09' },
      { name: '공무원 연금',    icon: '🏢', eta: '2026.10' },
      { name: '학자금대출',     icon: '🎓', eta: '2026.10' },
    ],
  },
  health: {
    icon: '❤️', name: '건강',
    description: 'BMI·칼로리·체지방률·기초대사량 등 건강 관련 계산기',
    gradient: 'from-red-500 to-rose-600',
    planned: [
      { name: '칼로리 계산',   icon: '🍎', eta: '2026.07' },
      { name: '기초대사량',    icon: '🔥', eta: '2026.07' },
      { name: '체지방률',      icon: '📏', eta: '2026.08' },
      { name: '임신 주수',     icon: '🤰', eta: '2026.08' },
      { name: '출산예정일',    icon: '👶', eta: '2026.09' },
      { name: '배란일',        icon: '📅', eta: '2026.09' },
      { name: '혈압 체크',     icon: '💊', eta: '2026.10' },
      { name: '음주측정',      icon: '🍺', eta: '2026.10' },
      { name: '수면 계산',     icon: '😴', eta: '2026.11' },
    ],
  },
  convenience: {
    icon: '🧮', name: '생활편의',
    description: 'D-day·날짜계산·단위변환·할인계산 등 일상 편의 계산기',
    gradient: 'from-violet-500 to-purple-700',
    planned: [
      { name: '날짜 계산',       icon: '📆', eta: '2026.07' },
      { name: '나이 계산',       icon: '🎂', eta: '2026.07' },
      { name: '평/제곱미터 변환', icon: '📐', eta: '2026.08' },
      { name: '단위변환',        icon: '⚖️', eta: '2026.08' },
      { name: '전기요금',        icon: '⚡', eta: '2026.09' },
      { name: '가스요금',        icon: '🔥', eta: '2026.09' },
      { name: '자동차 연비',     icon: '🚗', eta: '2026.10' },
      { name: '주유비',          icon: '⛽', eta: '2026.10' },
      { name: '시간 계산',       icon: '⏱️', eta: '2026.11' },
    ],
  },
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [showModal, setShowModal] = useState(false)
  const cat = CATEGORIES[slug]

  if (!cat) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center text-gray-400">
          <div className="text-5xl mb-4">😢</div>
          <p className="text-xl font-bold text-gray-600 mb-2">존재하지 않는 카테고리입니다</p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">홈으로 돌아가기</Link>
        </div>
      </Layout>
    )
  }

  const available = calculators.filter(c => c.categorySlug === slug)

  return (
    <Layout>
      {/* Header */}
      <div className={`bg-gradient-to-br ${cat.gradient} text-white py-12`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-3">{cat.icon}</div>
          <h1 className="text-3xl font-bold mb-2">{cat.name}</h1>
          <p className="text-white/80">{cat.description}</p>
          <div className="flex justify-center gap-3 mt-5">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              현재 {available.length}개
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              예정 +{cat.planned.length}개
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* 이용 가능한 계산기 */}
        {available.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              ✅ 지금 바로 사용 가능
              <span className="text-sm font-normal text-gray-400">({available.length}개)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {available.map(calc => (
                <CalculatorCard key={calc.id} calc={calc} />
              ))}
            </div>
          </section>
        )}

        {/* 이산수가 준비 중인 계산기 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              🤖 이산수가 분석 중인 계산기
              <span className="text-sm font-normal text-gray-400">({cat.planned.length}개)</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cat.planned.map(item => (
              <div key={item.name}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-blue-100 hover:shadow-sm transition-all">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold text-gray-700 mb-2">{item.name}</div>
                <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  <span>🤖</span>
                  <span>이산수 준비 중</span>
                </div>
                <div className="text-xs text-blue-400 font-medium mt-1">{item.eta} 예정</div>
              </div>
            ))}
          </div>
        </section>

        {/* 이산수 CTA */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg">
              🤖
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="font-bold text-lg mb-1">이산수 AI 계산기 직원</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                원하는 계산기가 없나요? 이산수에게 요청하면<br className="hidden sm:block" />
                트렌드를 분석해서 빠르게 추가해 드립니다.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="shrink-0 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-colors"
            >
              계산기 요청하기 →
            </button>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition-colors text-sm">
            ← 전체 계산기 보기
          </Link>
        </div>
      </div>

      {showModal && (
        <IsansuModal
          onClose={() => setShowModal(false)}
          categoryName={cat.name}
        />
      )}
    </Layout>
  )
}

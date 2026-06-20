import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateUnemployment, formatWon, formatNumber } from '../utils/calculations'

export default function Unemployment() {
  const [monthlyPay, setMonthlyPay] = useState('3000000')
  const [workYears, setWorkYears] = useState('2')
  const [workMonths, setWorkMonths] = useState('0')
  const [age, setAge] = useState('35')

  const result = useMemo(
    () => calculateUnemployment(monthlyPay, workYears, workMonths, age),
    [monthlyPay, workYears, workMonths, age]
  )

  return (
    <CalcPageLayout
      id="unemployment"
      icon="📋"
      title="실업급여 계산기"
      description="퇴직 후 받을 수 있는 구직급여(실업급여) 금액을 계산합니다"
      badge="2026년 기준"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">퇴직 전 월 급여</label>
            <div className="relative">
              <input type="number" value={monthlyPay} onChange={e => setMonthlyPay(e.target.value)}
                className="input-field pr-8" placeholder="3000000" min="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">근무기간</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input type="number" value={workYears} onChange={e => setWorkYears(e.target.value)}
                  className="input-field pr-8" placeholder="0" min="0" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">년</span>
              </div>
              <div className="relative">
                <input type="number" value={workMonths} onChange={e => setWorkMonths(e.target.value)}
                  className="input-field pr-8" placeholder="0" min="0" max="11" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">개월</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">나이</label>
            <div className="relative">
              <input type="number" value={age} onChange={e => setAge(e.target.value)}
                className="input-field pr-8" placeholder="35" min="18" max="70" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">세</span>
            </div>
          </div>
        </div>
      </div>

      {result?.error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 text-sm">
          ⚠️ {result.error}
        </div>
      ) : result ? (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">계산 결과</h2>
          <div className="bg-white rounded-xl p-4 mb-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">총 예상 수급액</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.totalBenefit)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">1일 수급액</div>
              <div className="text-xl font-bold text-gray-800">{formatWon(result.dailyBenefit)}</div>
              <div className="text-xs text-gray-400 mt-1">상한 66,000원/일</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">수급 기간</div>
              <div className="text-xl font-bold text-gray-800">{result.benefitDays}일</div>
              <div className="text-xs text-gray-400 mt-1">약 {Math.round(result.benefitDays / 30)}개월</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
            ※ 이직일 이전 3개월 평균 일급의 60% 기준 계산 | 하한액 {formatWon(result.lowerLimit)}/일 (최저임금의 80%)
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          정보를 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateRetirement, formatWon } from '../utils/calculations'

export default function Retirement() {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState('2020-01-01')
  const [endDate, setEndDate] = useState(today)
  const [avgMonthlyPay, setAvgMonthlyPay] = useState('3000000')

  const result = useMemo(
    () => calculateRetirement(startDate, endDate, avgMonthlyPay),
    [startDate, endDate, avgMonthlyPay]
  )

  return (
    <CalcPageLayout
      id="retirement"
      icon="🏦"
      title="퇴직금 계산기"
      description="근속기간과 평균 월급으로 퇴직금과 세후 실수령액을 계산합니다"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">입사일</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="input-field" max={today} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">퇴사일</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="input-field" max={today} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              최근 3개월 평균 월급 <span className="text-gray-400 font-normal">(세전)</span>
            </label>
            <div className="relative">
              <input type="number" value={avgMonthlyPay} onChange={e => setAvgMonthlyPay(e.target.value)}
                className="input-field pr-8" placeholder="3000000" min="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
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
            <div className="text-sm text-gray-500 mb-1">세후 실수령 퇴직금</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.afterTaxPay)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">근속 기간</div>
              <div className="text-xl font-bold text-gray-800">{result.workDays.toLocaleString()}일</div>
              <div className="text-xs text-gray-400 mt-1">약 {result.workYears.toFixed(1)}년</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">세전 퇴직금</div>
              <div className="text-xl font-bold text-gray-800">{formatWon(result.retirementPay)}</div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
            <span className="text-sm text-gray-600">퇴직소득세 (지방세 포함)</span>
            <span className="text-sm font-semibold text-red-500">- {formatWon(result.tax)}</span>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg text-xs text-blue-700">
            ※ 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365) | 실제 세액은 달라질 수 있습니다
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

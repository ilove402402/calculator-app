import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateParentalLeave } from '../utils/calculations'

export default function ParentalLeave() {
  const [form, setForm] = useState({ monthlyWage: '', months: '12' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateParentalLeave(form.monthlyWage, form.months),
    [form]
  )

  const rateInfo = [
    { period: '1~3개월차', rate: '100%', cap: '200만원' },
    { period: '4~6개월차', rate: '80%', cap: '150만원' },
    { period: '7~12개월차', rate: '50%', cap: '120만원' },
  ]

  return (
    <CalcPageLayout id="parental-leave" icon="👶" title="육아휴직급여 계산기" description="2024년 개정 기준 기간별 육아휴직급여 계산 (하한 70만원)">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">통상임금 (월)</label>
            <div className="relative">
              <input type="number" value={form.monthlyWage} onChange={e => set('monthlyWage', e.target.value)}
                className="input-field pr-8" placeholder="3000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">육아휴직 기간</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[3, 6, 9, 12].map(m => (
                <button key={m} onClick={() => set('months', String(m))}
                  className={`py-2 rounded-xl text-sm font-semibold transition-colors
                    ${form.months === String(m) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {m}개월
                </button>
              ))}
            </div>
            <div className="relative">
              <input type="number" value={form.months} onChange={e => set('months', e.target.value)}
                className="input-field pr-10" min="1" max="12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">개월</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">총 육아휴직급여</div>
              <div className="text-4xl font-bold text-blue-600">{formatWon(result.total)}</div>
              <div className="text-sm text-gray-400 mt-1">월 평균 {formatWon(result.averageMonthly)}</div>
            </div>
            <div className="space-y-2">
              {result.schedule.map(s => (
                <div key={s.month} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{s.month}개월차</span>
                    <span className="text-xs text-gray-400 ml-2">통상임금의 {(s.rate * 100).toFixed(0)}%</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{formatWon(s.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 지급 기준 안내 */}
          <div className="calc-card">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">2024년 개정 육아휴직급여 기준</h3>
            <div className="space-y-2">
              {rateInfo.map(r => (
                <div key={r.period} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-600">{r.period}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">{r.rate}</span>
                    <span className="text-xs text-gray-400 ml-1">(상한 {r.cap})</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">하한 70만원 · 고용보험 가입 180일 이상 필요</p>
          </div>
        </div>
      )}
    </CalcPageLayout>
  )
}

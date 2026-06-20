import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateCompoundInterest } from '../utils/calculations'

export default function CompoundInterest() {
  const [form, setForm] = useState({
    principal: '', annualRate: '', years: '10', additionalMonthly: '0', frequency: 'month',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateCompoundInterest(form.principal, form.annualRate, form.years, form.additionalMonthly, form.frequency),
    [form]
  )

  const profitRate = result ? ((result.totalInterest / result.totalPrincipal) * 100).toFixed(1) : null

  return (
    <CalcPageLayout id="compound-interest" icon="📈" title="복리 계산기" description="원금 + 월 추가납입 · 연/월 복리 미래가치 계산">
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">투자 조건 입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">초기 원금</label>
            <div className="relative">
              <input type="number" value={form.principal} onChange={e => set('principal', e.target.value)}
                className="input-field pr-8" placeholder="10000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">연 수익률</label>
            <div className="relative">
              <input type="number" value={form.annualRate} onChange={e => set('annualRate', e.target.value)}
                className="input-field pr-8" placeholder="7" step="0.1" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">투자 기간</label>
            <div className="relative">
              <input type="number" value={form.years} onChange={e => set('years', e.target.value)}
                className="input-field pr-8" min="1" max="50" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">년</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">월 추가 납입 (선택)</label>
            <div className="relative">
              <input type="number" value={form.additionalMonthly} onChange={e => set('additionalMonthly', e.target.value)}
                className="input-field pr-8" placeholder="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">복리 주기</label>
            <div className="grid grid-cols-2 gap-2">
              {[['month', '월복리'], ['year', '연복리']].map(([val, label]) => (
                <button key={val} onClick={() => set('frequency', val)}
                  className={`py-2 rounded-xl text-sm font-semibold transition-colors
                    ${form.frequency === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700">미래가치 예측</h2>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">{form.years}년 후 예상 금액</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.totalFV)}</div>
            <div className="text-sm text-blue-400 mt-1">수익률 +{profitRate}%</div>
          </div>
          {[
            ['총 투자 원금', result.totalPrincipal],
            ['총 수익 (이자+수익)', result.totalInterest],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{formatWon(value)}</span>
            </div>
          ))}
          {/* 간단한 막대 시각화 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">원금 vs 수익</p>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div className="bg-blue-400" style={{ width: `${(result.totalPrincipal / result.totalFV) * 100}%` }} />
              <div className="bg-green-400 flex-1" />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-blue-500">원금 {((result.totalPrincipal / result.totalFV) * 100).toFixed(0)}%</span>
              <span className="text-green-500">수익 {((result.totalInterest / result.totalFV) * 100).toFixed(0)}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">세전 기준 · 실제 수익은 세금 및 수수료 차감 필요</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

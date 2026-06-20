import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateSavings } from '../utils/calculations'

export default function Savings() {
  const [form, setForm] = useState({ monthlyDeposit: '', annualRate: '', termMonths: '12' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateSavings(form.monthlyDeposit, form.annualRate, form.termMonths),
    [form]
  )

  const QUICK_MONTHS = [6, 12, 24, 36]

  return (
    <CalcPageLayout id="savings" icon="🏦" title="적금 이자 계산기" description="정기적금 만기 수령액 · 이자과세 15.4% 자동 차감">
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">적금 조건 입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">월 납입액</label>
            <div className="relative">
              <input type="number" value={form.monthlyDeposit} onChange={e => set('monthlyDeposit', e.target.value)}
                className="input-field pr-8" placeholder="300000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">연이율</label>
            <div className="relative">
              <input type="number" value={form.annualRate} onChange={e => set('annualRate', e.target.value)}
                className="input-field pr-8" placeholder="3.5" step="0.1" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">적립 기간</label>
            <div className="flex gap-2 mb-2">
              {QUICK_MONTHS.map(m => (
                <button key={m} onClick={() => set('termMonths', String(m))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors
                    ${form.termMonths === String(m) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {m}개월
                </button>
              ))}
            </div>
            <div className="relative">
              <input type="number" value={form.termMonths} onChange={e => set('termMonths', e.target.value)}
                className="input-field pr-10" min="1" max="120" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">개월</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700">만기 수령액</h2>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">만기 수령액 (세후)</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.maturityAmount)}</div>
          </div>
          {[
            ['총 납입 원금', result.totalPrincipal, false],
            ['세전 이자', result.totalInterest, false],
            ['이자 소득세 (15.4%)', -result.taxAmount, false],
            ['세후 순이자', result.netInterest, true],
          ].map(([label, value, bold]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm ${bold ? 'font-bold text-blue-600' : 'font-semibold text-gray-800'}`}>
                {value < 0 ? `-${formatWon(-value)}` : formatWon(value)}
              </span>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center">단리 기준 · 비과세 상품의 경우 세금 없음</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

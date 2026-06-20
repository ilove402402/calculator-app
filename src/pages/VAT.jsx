import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon } from '../utils/calculations'

export default function VAT() {
  const [form, setForm] = useState({ amount: '', direction: 'exclude' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    const a = Number(form.amount)
    if (!a || a <= 0) return null
    if (form.direction === 'exclude') {
      const vat = Math.round(a * 0.1)
      return { supplyPrice: a, vat, total: a + vat }
    } else {
      const supplyPrice = Math.round(a / 1.1)
      const vat = a - supplyPrice
      return { supplyPrice, vat, total: a }
    }
  }, [form])

  return (
    <CalcPageLayout id="vat" icon="🧾" title="부가세(VAT) 계산기" description="공급가액↔공급대가 상호 변환 및 부가가치세 계산">
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">계산 방식 선택</h2>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {[
            ['exclude', '공급가액 입력 → 부가세 계산', '세금 별도 금액으로 VAT 구할 때'],
            ['include', '공급대가 입력 → 공급가액 분리', '세금 포함 금액에서 VAT 역산할 때'],
          ].map(([val, label, sub]) => (
            <label key={val} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors
              ${form.direction === val ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="direction" value={val} checked={form.direction === val}
                onChange={e => set('direction', e.target.value)} className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </label>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            {form.direction === 'exclude' ? '공급가액 (VAT 제외)' : '공급대가 (VAT 포함)'}
          </label>
          <div className="relative">
            <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
              className="input-field pr-8" placeholder="100000" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
          </div>
          {form.amount && <p className="text-xs text-blue-500 mt-1">{Number(form.amount).toLocaleString()}원</p>}
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700">계산 결과</h2>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">부가가치세 (10%)</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.vat)}</div>
          </div>
          {[
            ['공급가액 (VAT 제외)', result.supplyPrice],
            ['공급대가 (VAT 포함)', result.total],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{formatWon(val)}</span>
            </div>
          ))}
        </div>
      )}
    </CalcPageLayout>
  )
}

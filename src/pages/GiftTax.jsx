import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateGiftTax } from '../utils/calculations'

const RELATIONS = [
  { value: 'spouse',        label: '배우자',                    deduction: '6억원 공제' },
  { value: 'lineal_adult',  label: '직계존비속 (성년)',         deduction: '5,000만원 공제' },
  { value: 'lineal_minor',  label: '직계존비속 (미성년자)',     deduction: '2,000만원 공제' },
  { value: 'other_relative',label: '기타 친족 (형제자매 등)',   deduction: '1,000만원 공제' },
  { value: 'non_relative',  label: '타인 (친족 외)',            deduction: '공제 없음' },
]

const TAX_TABLE = [
  { over: 0,            rate: 10, desc: '1억 이하' },
  { over: 100_000_000,  rate: 20, desc: '1억 ~ 5억' },
  { over: 500_000_000,  rate: 30, desc: '5억 ~ 10억' },
  { over: 1_000_000_000,rate: 40, desc: '10억 ~ 30억' },
  { over: 3_000_000_000,rate: 50, desc: '30억 초과' },
]

export default function GiftTax() {
  const [form, setForm] = useState({ giftAmount: '', relationship: 'lineal_adult' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateGiftTax(form.giftAmount, form.relationship),
    [form]
  )

  const rel = RELATIONS.find(r => r.value === form.relationship)

  return (
    <CalcPageLayout id="gift-tax" icon="🎁" title="증여세 계산기" description="2026년 기준 증여세 + 신고세액공제(3%) · 10년 합산 증여재산공제">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">증여자와의 관계</label>
            <div className="space-y-2">
              {RELATIONS.map(r => (
                <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors
                  ${form.relationship === r.value ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="rel" value={r.value} checked={form.relationship === r.value}
                    onChange={e => set('relationship', e.target.value)} className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{r.label}</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">{r.deduction}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">증여 금액</label>
            <div className="relative">
              <input type="number" value={form.giftAmount} onChange={e => set('giftAmount', e.target.value)}
                className="input-field pr-8" placeholder="100000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {form.giftAmount && <p className="text-xs text-blue-500 mt-1">{Number(form.giftAmount).toLocaleString()}원</p>}
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">최종 납부 증여세</div>
            <div className={`text-4xl font-bold ${result.finalTax === 0 ? 'text-green-600' : 'text-blue-600'}`}>
              {result.finalTax === 0 ? '비과세' : formatWon(result.finalTax)}
            </div>
            {result.finalTax === 0 && (
              <p className="text-sm text-green-600 mt-1">공제 한도 이내 · 납부 세액 없음</p>
            )}
          </div>
          {[
            ['증여 금액', Number(form.giftAmount)],
            [`증여재산공제 (${rel?.label})`, -result.deduction],
            ['과세표준', result.taxableBase],
            ['산출 세액', result.taxBeforeCredit],
            ['신고세액공제 (3%)', -result.reportCredit],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-semibold ${val < 0 ? 'text-green-600' : 'text-gray-800'}`}>
                {val < 0 ? `-${formatWon(-val)}` : formatWon(val)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 세율표 */}
      <div className="calc-card mt-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">2026년 증여세율표</h3>
        <div className="space-y-1.5">
          {TAX_TABLE.map(t => (
            <div key={t.over} className="flex justify-between text-sm">
              <span className="text-gray-600">{t.desc}</span>
              <span className="font-semibold text-gray-800">{t.rate}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">증여재산공제는 10년 합산 · 신고 기한 내 신고 시 3% 공제</p>
      </div>
    </CalcPageLayout>
  )
}

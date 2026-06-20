import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateRealEstateFee } from '../utils/calculations'

const TYPES = [
  { value: 'sale',    label: '매매', icon: '🏠' },
  { value: 'jeonse', label: '전세', icon: '🔑' },
  { value: 'monthly', label: '월세', icon: '📅' },
]

const FEE_TABLE = {
  sale: [
    { range: '5천만원 미만', rate: '0.6%', limit: '25만원 한도' },
    { range: '5천만원~2억 미만', rate: '0.5%', limit: '80만원 한도' },
    { range: '2억~9억 미만', rate: '0.4%', limit: '' },
    { range: '9억~12억 미만', rate: '0.5%', limit: '' },
    { range: '12억~15억 미만', rate: '0.6%', limit: '' },
    { range: '15억 이상', rate: '0.7%', limit: '' },
  ],
  rent: [
    { range: '5천만원 미만', rate: '0.5%', limit: '20만원 한도' },
    { range: '5천만원~1억 미만', rate: '0.4%', limit: '30만원 한도' },
    { range: '1억~6억 미만', rate: '0.3%', limit: '' },
    { range: '6억~12억 미만', rate: '0.4%', limit: '' },
    { range: '12억~15억 미만', rate: '0.5%', limit: '' },
    { range: '15억 이상', rate: '0.6%', limit: '' },
  ],
}

export default function RealEstateFee() {
  const [form, setForm] = useState({ transactionType: 'sale', price: '', monthlyRent: '', deposit: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateRealEstateFee(form.transactionType, form.price, form.monthlyRent, form.deposit),
    [form]
  )

  return (
    <CalcPageLayout id="real-estate-fee" icon="🤝" title="부동산 중개수수료 계산기" description="2021년 10월 개정 기준 매매·전세·월세 중개보수 계산">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">거래 유형</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map(t => (
                <button key={t.value} onClick={() => set('transactionType', t.value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${form.transactionType === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {form.transactionType !== 'monthly' ? (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {form.transactionType === 'sale' ? '매매 금액' : '전세 보증금'}
              </label>
              <div className="relative">
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                  className="input-field pr-8" placeholder="500000000" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
              </div>
              {form.price && <p className="text-xs text-blue-500 mt-1">{Number(form.price).toLocaleString()}원</p>}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">보증금</label>
                <div className="relative">
                  <input type="number" value={form.deposit} onChange={e => set('deposit', e.target.value)}
                    className="input-field pr-8" placeholder="50000000" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">월세</label>
                <div className="relative">
                  <input type="number" value={form.monthlyRent} onChange={e => set('monthlyRent', e.target.value)}
                    className="input-field pr-8" placeholder="700000" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">환산보증금 = 보증금 + 월세 × 100</p>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">중개보수 합계 (VAT 포함)</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.total)}</div>
            <div className="text-xs text-gray-400 mt-1">적용 요율: {(result.rate * 100).toFixed(2)}%</div>
          </div>
          {[
            ['거래 기준 금액', result.base],
            ['중개보수 (VAT 제외)', result.fee],
            ['부가가치세 (10%)', result.vat],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{formatWon(val)}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center">
            공인중개사법 2021.10 개정 기준 · 한도 금액 이하 자동 적용 · 협의 가능
          </p>
        </div>
      )}

      {/* 요율표 */}
      <div className="calc-card mt-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">
          {form.transactionType === 'sale' ? '매매' : '전·월세'} 중개보수 요율표
        </h3>
        <div className="space-y-1.5">
          {(form.transactionType === 'sale' ? FEE_TABLE.sale : FEE_TABLE.rent).map(row => (
            <div key={row.range} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{row.range}</span>
              <div className="text-right">
                <span className="font-semibold text-gray-800">{row.rate}</span>
                {row.limit && <span className="text-xs text-gray-400 ml-1">({row.limit})</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CalcPageLayout>
  )
}

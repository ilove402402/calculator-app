import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const CURRENCIES = [
  { code: 'USD', name: '미국 달러', symbol: '$', defaultRate: 1380 },
  { code: 'EUR', name: '유로',     symbol: '€', defaultRate: 1510 },
  { code: 'JPY', name: '일본 엔',  symbol: '¥', defaultRate: 9.2, per: 100 },
  { code: 'CNY', name: '중국 위안',symbol: '¥', defaultRate: 191 },
  { code: 'GBP', name: '영국 파운드', symbol: '£', defaultRate: 1760 },
  { code: 'AUD', name: '호주 달러', symbol: 'A$', defaultRate: 895 },
  { code: 'CAD', name: '캐나다 달러', symbol: 'C$', defaultRate: 1010 },
  { code: 'CHF', name: '스위스 프랑', symbol: 'Fr', defaultRate: 1590 },
  { code: 'HKD', name: '홍콩 달러', symbol: 'HK$', defaultRate: 177 },
  { code: 'SGD', name: '싱가포르 달러', symbol: 'S$', defaultRate: 1040 },
]

export default function Exchange() {
  const [currency, setCurrency] = useState('USD')
  const [rate, setRate] = useState(String(CURRENCIES[0].defaultRate))
  const [amount, setAmount] = useState('')
  const [direction, setDirection] = useState('krw_to_foreign') // KRW→외화 or 외화→KRW

  const curr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]

  const result = useMemo(() => {
    const a = Number(amount)
    const r = Number(rate)
    if (!a || !r) return null
    const per = curr.per || 1
    if (direction === 'krw_to_foreign') {
      const foreign = a / (r / per)
      return { krw: a, foreign, foreignStr: `${curr.symbol}${foreign.toFixed(2)}` }
    } else {
      const krw = a * (r / per)
      return { krw, foreign: a, foreignStr: `${curr.symbol}${a}` }
    }
  }, [amount, rate, direction, curr])

  function handleCurrencyChange(code) {
    setCurrency(code)
    const c = CURRENCIES.find(x => x.code === code)
    setRate(String(c.defaultRate))
  }

  return (
    <CalcPageLayout id="exchange" icon="💱" title="환율 계산기" description="원화 ↔ 외화 환산 · 주요 10개 통화 지원">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">통화 선택</label>
            <select value={currency} onChange={e => handleCurrencyChange(e.target.value)} className="input-field">
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              환율 (원/{curr.per ? `${curr.per}${curr.code}` : curr.code})
            </label>
            <div className="relative">
              <input type="number" value={rate} onChange={e => setRate(e.target.value)}
                className="input-field pr-8" step="0.01" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              참고 환율 {curr.defaultRate.toLocaleString()}원 기준 (직접 수정 가능)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">환산 방향</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['krw_to_foreign', `원화 → ${currency}`],
                ['foreign_to_krw', `${currency} → 원화`],
              ].map(([val, label]) => (
                <button key={val} onClick={() => setDirection(val)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${direction === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              {direction === 'krw_to_foreign' ? '원화 금액' : `${curr.name} 금액`}
            </label>
            <div className="relative">
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="input-field pr-12" placeholder={direction === 'krw_to_foreign' ? '1000000' : '1000'} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {direction === 'krw_to_foreign' ? '원' : curr.code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700">환산 결과</h2>
          <div className="bg-white rounded-xl p-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-5">
              <div>
                <div className="text-xs text-gray-400 mb-1">{direction === 'krw_to_foreign' ? '원화' : curr.name}</div>
                <div className="text-xl font-bold text-gray-700">
                  {direction === 'krw_to_foreign'
                    ? `${result.krw.toLocaleString()}원`
                    : result.foreignStr}
                </div>
              </div>
              <div className="text-2xl text-blue-300">=</div>
              <div>
                <div className="text-xs text-gray-400 mb-1">{direction === 'krw_to_foreign' ? curr.name : '원화'}</div>
                <div className="text-xl font-bold text-blue-600">
                  {direction === 'krw_to_foreign'
                    ? result.foreignStr
                    : `${Math.round(result.krw).toLocaleString()}원`}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">실시간 환율이 아닙니다 · 실제 거래 시 은행 고시환율 확인 필수</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

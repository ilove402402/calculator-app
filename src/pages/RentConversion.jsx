import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon } from '../utils/calculations'

export default function RentConversion() {
  const [mode, setMode] = useState('to_monthly') // 전세→월세 | 월세→전세
  const [form, setForm] = useState({
    jeonseDeposit: '', monthlyDeposit: '', monthlyRent: '', rate: '5.5',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    const r = Number(form.rate) / 100
    if (!r) return null

    if (mode === 'to_monthly') {
      const jeonse = Number(form.jeonseDeposit)
      const dep = Number(form.monthlyDeposit) || 0
      if (!jeonse) return null
      const convertBase = jeonse - dep
      if (convertBase <= 0) return { error: '전세금이 보증금보다 작습니다' }
      const monthly = Math.round(convertBase * r / 12)
      return { monthly, convertBase, rate: r * 100 }
    } else {
      const dep = Number(form.monthlyDeposit) || 0
      const rent = Number(form.monthlyRent)
      if (!rent) return null
      const jeonse = dep + Math.round(rent * 12 / r)
      return { jeonse, dep, rent, rate: r * 100 }
    }
  }, [form, mode])

  return (
    <CalcPageLayout id="rent-conversion" icon="🔄" title="전세/월세 전환 계산기" description="전세↔월세 상호 전환 · 법정 전월세전환율 기준">
      <div className="calc-card mb-4">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[['to_monthly', '전세 → 월세'], ['to_jeonse', '월세 → 전세']].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${mode === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === 'to_monthly' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">전세 보증금</label>
                <div className="relative">
                  <input type="number" value={form.jeonseDeposit} onChange={e => set('jeonseDeposit', e.target.value)}
                    className="input-field pr-8" placeholder="300000000" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
                {form.jeonseDeposit && <p className="text-xs text-blue-500 mt-1">{Number(form.jeonseDeposit).toLocaleString()}원</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">월세 전환 후 보증금 (선택)</label>
                <div className="relative">
                  <input type="number" value={form.monthlyDeposit} onChange={e => set('monthlyDeposit', e.target.value)}
                    className="input-field pr-8" placeholder="0" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">월세 보증금</label>
                <div className="relative">
                  <input type="number" value={form.monthlyDeposit} onChange={e => set('monthlyDeposit', e.target.value)}
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
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">전월세 전환율</label>
            <div className="relative">
              <input type="number" value={form.rate} onChange={e => set('rate', e.target.value)}
                className="input-field pr-8" step="0.1" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">법정 상한: 기준금리 + 2% (2026년 약 5.5% 기준)</p>
          </div>
        </div>
      </div>

      {result && (
        result.error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{result.error}</div>
        ) : (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
            <h2 className="font-semibold text-gray-700">전환 결과</h2>
            {mode === 'to_monthly' ? (
              <>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">환산 월세</div>
                  <div className="text-4xl font-bold text-blue-600">{formatWon(result.monthly)}</div>
                  <div className="text-xs text-gray-400 mt-1">/월</div>
                </div>
                <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                  <span className="text-sm text-gray-600">전환 기준금액</span>
                  <span className="text-sm font-semibold">{formatWon(result.convertBase)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">환산 전세금</div>
                  <div className="text-4xl font-bold text-blue-600">{formatWon(result.jeonse)}</div>
                </div>
                <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                  <span className="text-sm text-gray-600">보증금 + 전환분</span>
                  <span className="text-sm font-semibold">{formatWon(result.dep)} + {formatWon(result.jeonse - result.dep)}</span>
                </div>
              </>
            )}
            <p className="text-xs text-gray-400 text-center">주택임대차보호법 제7조의2 기준 · 실제 계약 시 양 당사자 협의 필요</p>
          </div>
        )
      )}
    </CalcPageLayout>
  )
}

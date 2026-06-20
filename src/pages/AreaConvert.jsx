import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const PYEONG = 3.30579

export default function AreaConvert() {
  const [form, setForm] = useState({ value: '', unit: 'pyeong' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    const v = Number(form.value)
    if (!v || v <= 0) return null
    const isPyeong = form.unit === 'pyeong'
    const converted = isPyeong ? v * PYEONG : v / PYEONG
    return { from: v, fromUnit: isPyeong ? '평' : '㎡', to: converted, toUnit: isPyeong ? '㎡' : '평' }
  }, [form])

  // 아파트 면적 빠른 입력 버튼
  const QUICK = [
    { label: '59㎡형', sqm: 59 },
    { label: '84㎡형', sqm: 84 },
    { label: '101㎡형', sqm: 101 },
    { label: '114㎡형', sqm: 114 },
  ]

  return (
    <CalcPageLayout id="area-convert" icon="📐" title="평/제곱미터 변환" description="평 ↔ ㎡(제곱미터) 단위 상호 변환 · 1평 = 3.30579㎡">
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">단위 선택</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[['pyeong', '평 → ㎡'], ['sqm', '㎡ → 평']].map(([val, label]) => (
            <label key={val} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors
              ${form.unit === val ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="unit" value={val} checked={form.unit === val}
                onChange={e => set('unit', e.target.value)} className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {form.unit === 'sqm' && (
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK.map(q => (
              <button key={q.label} onClick={() => setForm({ value: String(q.sqm), unit: 'sqm' })}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-colors text-gray-600 font-medium">
                {q.label}
              </button>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            {form.unit === 'pyeong' ? '평수 입력' : '면적 입력 (㎡)'}
          </label>
          <div className="relative">
            <input type="number" value={form.value} onChange={e => set('value', e.target.value)}
              className="input-field pr-10" placeholder={form.unit === 'pyeong' ? '25' : '82.6'} step="0.01" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {form.unit === 'pyeong' ? '평' : '㎡'}
            </span>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700">변환 결과</h2>
          <div className="bg-white rounded-xl p-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">{result.fromUnit}</div>
                <div className="text-2xl font-bold text-gray-700">{result.from.toLocaleString()}</div>
              </div>
              <div className="text-2xl text-blue-400">→</div>
              <div>
                <div className="text-xs text-gray-400 mb-1">{result.toUnit}</div>
                <div className="text-2xl font-bold text-blue-600">{result.to.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm text-center">
            <span className="text-xs text-gray-500">1평 = 3.30579㎡ (= 400/121 ㎡) 기준</span>
          </div>
        </div>
      )}
    </CalcPageLayout>
  )
}

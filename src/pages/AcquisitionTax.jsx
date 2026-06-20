import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateAcquisitionTax } from '../utils/calculations'

export default function AcquisitionTax() {
  const [form, setForm] = useState({
    price: '', ownedCount: '0', isAdjusted: 'false', propertyType: 'house', areaM2: '',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateAcquisitionTax(form.price, form.ownedCount, form.isAdjusted === 'true', form.propertyType, form.areaM2),
    [form]
  )

  return (
    <CalcPageLayout id="acquisition-tax" icon="🏷️" title="취득세 계산기" description="2026년 기준 취득세 + 지방교육세 + 농어촌특별세">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">부동산 종류</label>
            <div className="grid grid-cols-3 gap-2">
              {[['house', '🏠 주택'], ['non-house', '🏢 비주택'], ['land', '🌾 농지/토지']].map(([val, label]) => (
                <button key={val} onClick={() => set('propertyType', val)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${form.propertyType === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">취득 금액</label>
            <div className="relative">
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                className="input-field pr-8" placeholder="500000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {form.price && <p className="text-xs text-blue-500 mt-1">{Number(form.price).toLocaleString()}원</p>}
          </div>
          {form.propertyType === 'house' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">취득 후 보유 주택 수</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['0', '무주택→1채'], ['1', '1채→2채'], ['2', '2채→3채+']].map(([val, label]) => (
                    <button key={val} onClick={() => set('ownedCount', val)}
                      className={`py-2.5 rounded-xl text-xs font-semibold transition-colors
                        ${form.ownedCount === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {Number(form.ownedCount) >= 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">지역 구분 (다주택 세율 영향)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['false', '비조정대상지역'], ['true', '조정대상지역']].map(([val, label]) => (
                      <button key={val} onClick={() => set('isAdjusted', val)}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                          ${form.isAdjusted === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  전용면적 <span className="text-gray-400 font-normal">(85㎡ 이하 농어촌특별세 면제)</span>
                </label>
                <div className="relative">
                  <input type="number" value={form.areaM2} onChange={e => set('areaM2', e.target.value)}
                    className="input-field pr-8" placeholder="84" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">㎡</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">총 납부세액</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.total)}</div>
            <div className="text-xs text-gray-400 mt-1">취득세율 {(result.taxRate * 100).toFixed(2)}%</div>
          </div>
          {[
            ['취득세', result.baseTax],
            ['지방교육세', result.eduTax],
            ['농어촌특별세', result.ruralTax],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{formatWon(val)}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center">2026년 기준 · 실제 세액은 관할 지자체에서 확인하세요</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

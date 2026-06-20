import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateBasicPension } from '../utils/calculations'

export default function BasicPension() {
  const [form, setForm] = useState({ monthlyIncome: '', assets: '', isCouple: 'false' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateBasicPension(form.monthlyIncome, form.assets, form.isCouple === 'true'),
    [form]
  )

  return (
    <CalcPageLayout id="basic-pension" icon="👴" title="기초연금 계산기" description="2025년 기준 기초연금 수급 여부 및 월 예상 수령액 추정">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
            <strong>수급 조건:</strong> 만 65세 이상 · 소득하위 70% · 대한민국 국적 · 국내 거주
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">가구 유형</label>
            <div className="grid grid-cols-2 gap-2">
              {[['false', '단독가구'], ['true', '부부가구']].map(([val, label]) => (
                <button key={val} onClick={() => set('isCouple', val)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${form.isCouple === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">월 소득 (근로소득 등)</label>
            <div className="relative">
              <input type="number" value={form.monthlyIncome} onChange={e => set('monthlyIncome', e.target.value)}
                className="input-field pr-8" placeholder="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">일반재산 (부동산·금융자산 합계)</label>
            <div className="relative">
              <input type="number" value={form.assets} onChange={e => set('assets', e.target.value)}
                className="input-field pr-8" placeholder="100000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className={`rounded-2xl border p-6 space-y-3 ${result.eligible ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">기초연금 수급 여부</div>
            <div className={`text-2xl font-bold ${result.eligible ? 'text-blue-600' : 'text-orange-600'}`}>
              {result.eligible ? '✅ 수급 가능 (추정)' : '❌ 수급 제외 (추정)'}
            </div>
          </div>
          {result.eligible && (
            <>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">월 예상 수령액</div>
                <div className="text-4xl font-bold text-blue-600">{formatWon(result.monthly)}</div>
                {result.isCouple && <p className="text-xs text-gray-400 mt-1">부부 각각 지급 (최대금액의 80%)</p>}
              </div>
              <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">연간 합계</span>
                <span className="text-sm font-semibold text-gray-800">{formatWon(result.annualTotal)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
            <span className="text-sm text-gray-600">소득인정액 (추정)</span>
            <span className="text-sm font-semibold text-gray-800">{formatWon(result.recognizedIncome)}/월</span>
          </div>
          <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
            <span className="text-sm text-gray-600">선정기준액</span>
            <span className="text-sm font-semibold text-gray-800">
              {formatWon(result.isCouple ? 3_408_000 : 2_130_000)}/월
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">2025년 기준 추정치 · 정확한 수급 여부는 복지로 또는 주민센터 문의</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

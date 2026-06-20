import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateNationalPension } from '../utils/calculations'

export default function NationalPension() {
  const [form, setForm] = useState({ avgMonthlyIncome: '', joinMonths: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() =>
    calculateNationalPension(form.avgMonthlyIncome, form.joinMonths),
    [form]
  )

  const joinYears = Math.floor(Number(form.joinMonths) / 12)
  const joinRemMonths = Number(form.joinMonths) % 12

  return (
    <CalcPageLayout id="national-pension" icon="🏛️" title="국민연금 예상 수령액" description="가입 기간과 평균 소득으로 노령연금 예상액 계산 (2026년 기준)">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
            수급 개시 연령: <strong>1969년생 이후 만 65세</strong> (2026년 기준)
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">가입 기간 평균 소득월액</label>
            <div className="relative">
              <input type="number" value={form.avgMonthlyIncome} onChange={e => set('avgMonthlyIncome', e.target.value)}
                className="input-field pr-8" placeholder="3000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">전체 가입 기간 동안의 월 소득 평균</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">가입 기간 (개월)</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[120, 180, 240, 360].map(m => (
                <button key={m} onClick={() => set('joinMonths', String(m))}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors
                    ${form.joinMonths === String(m) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {m / 12}년
                </button>
              ))}
            </div>
            <div className="relative">
              <input type="number" value={form.joinMonths} onChange={e => set('joinMonths', e.target.value)}
                className="input-field pr-12" placeholder="240" min="1" max="480" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">개월</span>
            </div>
            {form.joinMonths && (
              <p className="text-xs text-blue-500 mt-1">{joinYears}년 {joinRemMonths}개월</p>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">예상 월 수령액 ({result.n}개월 가입)</div>
              <div className="text-4xl font-bold text-blue-600">{formatWon(result.monthlyPension)}</div>
              <div className="text-sm text-gray-400 mt-1">연간 {formatWon(result.yearlyPension)}</div>
            </div>
            {[
              ['전체 가입자 평균소득 (A값)', formatWon(result.A)],
              ['본인 평균소득 (B값)', formatWon(result.B)],
              ['수급 개시 연령', `만 ${result.eligibleAge}세`],
              ['20년 완전 노령연금', formatWon(result.fullPension) + '/월'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center px-2">
            국민연금공단 공식 계산과 차이가 있을 수 있습니다 · 정확한 예상액은 내 연금 알아보기(nps.or.kr) 확인
          </p>
        </div>
      )}
    </CalcPageLayout>
  )
}

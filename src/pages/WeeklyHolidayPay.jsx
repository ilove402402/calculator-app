import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateWeeklyHoliday, MIN_WAGE_2026 } from '../utils/calculations'

export default function WeeklyHolidayPay() {
  const [form, setForm] = useState({ hourlyWage: String(MIN_WAGE_2026), hoursPerDay: '8', daysPerWeek: '5' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => calculateWeeklyHoliday(form.hourlyWage, form.hoursPerDay, form.daysPerWeek), [form])

  return (
    <CalcPageLayout id="weekly-holiday-pay" icon="📆" title="주휴수당 계산기" description="주 15시간 이상 근무 시 발생하는 유급 주휴수당 계산">
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">근무 조건 입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">시급</label>
            <div className="relative">
              <input type="number" value={form.hourlyWage} onChange={e => set('hourlyWage', e.target.value)} className="input-field pr-8" placeholder="10030" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">2026년 최저시급: {MIN_WAGE_2026.toLocaleString()}원</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">하루 근무시간</label>
              <div className="relative">
                <input type="number" value={form.hoursPerDay} onChange={e => set('hoursPerDay', e.target.value)} className="input-field pr-10" min="1" max="12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">시간</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">주당 근무일수</label>
              <div className="relative">
                <input type="number" value={form.daysPerWeek} onChange={e => set('daysPerWeek', e.target.value)} className="input-field pr-6" min="1" max="6" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">일</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {result && (
        result.eligible === false ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="font-bold text-orange-700">주휴수당 미발생</p>
            <p className="text-sm text-orange-600 mt-1">주 소정근로시간 {result.weeklyHours}시간 · 15시간 미만은 주휴수당 없음</p>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
            <h2 className="font-semibold text-gray-700">계산 결과</h2>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">주휴수당</div>
              <div className="text-4xl font-bold text-blue-600">{formatWon(result.weeklyHolidayPay)}</div>
              <div className="text-xs text-gray-400 mt-1">주 {result.weeklyHours}시간 근무 → 1주 1일분 유급휴일</div>
            </div>
            {[
              ['주급 (주휴수당 포함)', result.weeklyTotalPay],
              ['월급 예상 (×4.345주)', result.monthlyPay],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{formatWon(value)}</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 text-center pt-1">주휴수당 = 시급 × (주 소정근로시간 / 5)</p>
          </div>
        )
      )}
    </CalcPageLayout>
  )
}

import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateMinimumWage, formatWon, MIN_WAGE_2026 } from '../utils/calculations'

export default function MinimumWage() {
  const [hourlyWage, setHourlyWage] = useState(String(MIN_WAGE_2026))
  const [hoursPerDay, setHoursPerDay] = useState('8')
  const [daysPerWeek, setDaysPerWeek] = useState('5')

  const result = useMemo(
    () => calculateMinimumWage(hourlyWage, hoursPerDay, daysPerWeek),
    [hourlyWage, hoursPerDay, daysPerWeek]
  )

  const weeklyHours = Number(hoursPerDay) * Number(daysPerWeek)
  const hasHolidayPay = weeklyHours >= 15

  return (
    <CalcPageLayout
      id="minimum-wage"
      icon="⏰"
      title="최저시급 / 알바 계산기"
      description="2026년 최저시급 10,030원 기준 일급·주급·월급과 주휴수당을 계산합니다"
      badge="2026년 10,030원"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600">시급</label>
              <button onClick={() => setHourlyWage(String(MIN_WAGE_2026))}
                className="text-xs text-blue-600 hover:underline">
                최저시급 ({MIN_WAGE_2026.toLocaleString()}원) 적용
              </button>
            </div>
            <div className="relative">
              <input type="number" value={hourlyWage} onChange={e => setHourlyWage(e.target.value)}
                className="input-field pr-8" min="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">하루 근무시간</label>
              <div className="relative">
                <input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)}
                  className="input-field pr-8" min="1" max="24" step="0.5" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">시간</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">주간 근무일수</label>
              <div className="relative">
                <input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)}
                  className="input-field pr-8" min="1" max="7" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">일</span>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-xl text-xs ${hasHolidayPay ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500'}`}>
            {hasHolidayPay
              ? `✅ 주 ${weeklyHours}시간 근무 → 주휴수당 발생 (주 15시간 이상)`
              : `ℹ️ 주 ${weeklyHours}시간 근무 → 주휴수당 없음 (주 15시간 미만)`}
          </div>
        </div>
      </div>

      {result ? (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">계산 결과</h2>
          <div className="bg-white rounded-xl p-4 mb-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">
              월급 {hasHolidayPay ? '(주휴수당 포함)' : ''}
            </div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.monthlyPay)}</div>
            <div className="text-xs text-gray-400 mt-1">월 {Math.round(result.monthlyHours)}시간 기준</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['일급', formatWon(result.dailyPay)],
              ['주급', formatWon(result.weeklyPay)],
              ['주휴수당', hasHolidayPay ? formatWon(result.weeklyHolidayPay) : '해당없음'],
            ].map(([label, value]) => (
              <div key={label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-sm font-bold text-gray-800">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg text-xs text-blue-700">
            ※ 주휴수당: 주 15시간 이상 근무 시 1일분 추가 지급 | 세전 금액 기준
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          근무 조건을 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

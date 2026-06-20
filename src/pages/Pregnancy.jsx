import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const MILESTONES = [
  { week: 4,  text: '착상 완료 · 임신 확인 가능' },
  { week: 8,  text: '심장 박동 시작' },
  { week: 12, text: '1삼분기 종료 · 유산 위험 감소' },
  { week: 16, text: '태동 느끼기 시작' },
  { week: 20, text: '정밀 초음파 (기형아 검사)' },
  { week: 24, text: '2삼분기 종료 · 당뇨 검사' },
  { week: 28, text: '3삼분기 시작 · 폐 발달' },
  { week: 32, text: '역아 확인 · 분만 준비 시작' },
  { week: 36, text: '만삭에 가까움 · 주 1회 검진' },
  { week: 40, text: '출산 예정일' },
]

export default function Pregnancy() {
  const [lastPeriod, setLastPeriod] = useState('')

  const result = useMemo(() => {
    if (!lastPeriod) return null
    const lmp = new Date(lastPeriod)
    if (isNaN(lmp)) return null
    const today = new Date()
    const daysPregnant = Math.floor((today - lmp) / 86400000)
    if (daysPregnant < 0) return { future: true }

    const totalWeeks = Math.floor(daysPregnant / 7)
    const remDays = daysPregnant % 7
    const dueDate = new Date(lmp.getTime() + 280 * 86400000)
    const daysUntilDue = Math.ceil((dueDate - today) / 86400000)

    let trimester = 1
    if (totalWeeks >= 28) trimester = 3
    else if (totalWeeks >= 14) trimester = 2

    const nextMilestone = MILESTONES.find(m => m.week > totalWeeks)

    return {
      weeks: totalWeeks, days: remDays, daysPregnant,
      dueDate, daysUntilDue: Math.max(0, daysUntilDue),
      trimester, nextMilestone,
      progress: Math.min(100, (daysPregnant / 280) * 100),
    }
  }, [lastPeriod])

  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <CalcPageLayout id="pregnancy" icon="🤰" title="임신 주수 계산기" description="마지막 생리일 기준 임신 주수 · 출산예정일 · 삼분기 확인">
      <div className="calc-card mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1.5">마지막 생리 시작일 (LMP)</label>
        <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
          max={maxDate} className="input-field" />
        <p className="text-xs text-gray-400 mt-1.5">임신 기간 = 마지막 생리일부터 280일 (40주)</p>
      </div>

      {result && (
        result.future ? (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-orange-700 text-sm text-center">
            마지막 생리일이 오늘 이후입니다
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-500 mb-1">현재 임신</div>
                <div className="text-5xl font-bold text-blue-600">{result.weeks}주</div>
                <div className="text-lg text-blue-400 font-semibold">{result.days}일</div>
                <div className="mt-2 inline-block text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {result.trimester}삼분기
                </div>
              </div>
              {/* 진행 바 */}
              <div className="mb-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${result.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>임신 시작</span>
                  <span>{result.progress.toFixed(0)}% 경과</span>
                  <span>출산 예정</span>
                </div>
              </div>
              {[
                ['출산 예정일', result.dueDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })],
                ['출산까지', result.daysUntilDue > 0 ? `약 ${result.daysUntilDue}일 남음` : '출산 예정일 도달'],
                ['임신 경과', `${result.daysPregnant}일 (${result.weeks}주 ${result.days}일)`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm mb-2">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            {result.nextMilestone && (
              <div className="calc-card">
                <p className="text-xs font-semibold text-gray-500 mb-2">다음 주요 이정표</p>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
                    {result.nextMilestone.week}주
                  </span>
                  <p className="text-sm text-gray-700">{result.nextMilestone.text}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 text-center px-4">의학적 조언이 아닙니다 · 정확한 정보는 담당 의사에게 문의하세요</p>
          </div>
        )
      )}
    </CalcPageLayout>
  )
}

import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토']

export default function DateCalc() {
  const [mode, setMode] = useState('diff') // 'diff' | 'add'
  const [form, setForm] = useState({ startDate: '', endDate: '', baseDate: '', days: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    if (mode === 'diff') {
      if (!form.startDate || !form.endDate) return null
      const start = new Date(form.startDate)
      const end = new Date(form.endDate)
      if (isNaN(start) || isNaN(end)) return null
      const diffMs = end - start
      const diffDays = Math.round(diffMs / 86400000)
      const absDays = Math.abs(diffDays)
      const weeks = Math.floor(absDays / 7)
      const remDays = absDays % 7
      const months = Math.abs(end.getFullYear() * 12 + end.getMonth() - start.getFullYear() * 12 - start.getMonth())
      const years = Math.floor(absDays / 365)
      return { mode: 'diff', diffDays, absDays, weeks, remDays, months, years, sign: diffDays >= 0 ? '이후' : '이전' }
    } else {
      if (!form.baseDate || !form.days) return null
      const base = new Date(form.baseDate)
      if (isNaN(base)) return null
      const result = new Date(base.getTime() + Number(form.days) * 86400000)
      const diffMs = result - new Date()
      const daysFromToday = Math.ceil(diffMs / 86400000)
      return {
        mode: 'add',
        resultDate: result,
        resultStr: result.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
        dayOfWeek: DAYS_OF_WEEK[result.getDay()],
        daysFromToday,
      }
    }
  }, [form, mode])

  const today = new Date().toISOString().split('T')[0]

  return (
    <CalcPageLayout id="date-calc" icon="📆" title="날짜 계산기" description="두 날짜 사이 기간 계산 · 특정 날짜에서 N일 후 날짜">
      <div className="calc-card mb-4">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[['diff', '📅 기간 계산'], ['add', '➕ 날짜 더하기']].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${mode === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {mode === 'diff' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">시작일</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">종료일</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="input-field" />
            </div>
            <button onClick={() => setForm(p => ({ ...p, startDate: today, endDate: '' }))}
              className="text-xs text-blue-600 hover:underline">오늘을 시작일로 설정</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">기준일</label>
              <input type="date" value={form.baseDate} onChange={e => set('baseDate', e.target.value)} className="input-field" />
              <button onClick={() => set('baseDate', today)} className="text-xs text-blue-600 hover:underline mt-1 block">오늘로 설정</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">더할 일수 (음수 입력 시 이전 날짜)</label>
              <div className="relative">
                <input type="number" value={form.days} onChange={e => set('days', e.target.value)} className="input-field pr-8" placeholder="100" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">일</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          {result.mode === 'diff' ? (
            <>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">두 날짜 사이</div>
                <div className="text-4xl font-bold text-blue-600">{result.absDays.toLocaleString()}일</div>
                <div className="text-xs text-gray-400 mt-1">
                  {result.diffDays < 0 ? '종료일이 시작일보다 앞선 날짜' : ''}
                </div>
              </div>
              {[
                ['주 + 일', `${result.weeks}주 ${result.remDays}일`],
                ['약 개월수', `약 ${result.months}개월`],
                ['약 년수', `약 ${result.years}년`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">계산된 날짜</div>
                <div className="text-2xl font-bold text-blue-600">{result.resultStr}</div>
                <div className="text-lg font-semibold text-blue-400 mt-1">{result.dayOfWeek}요일</div>
              </div>
              <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">오늘로부터</span>
                <span className="text-sm font-semibold text-gray-800">
                  {result.daysFromToday >= 0 ? `${result.daysFromToday}일 후` : `${Math.abs(result.daysFromToday)}일 전`}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </CalcPageLayout>
  )
}

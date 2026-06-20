import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const ACTIVITIES = [
  { id: 'sedentary',    label: '거의 활동 안 함',    sub: '주로 앉아 있는 생활',         factor: 1.2 },
  { id: 'light',        label: '가벼운 활동',        sub: '주 1~3회 운동',              factor: 1.375 },
  { id: 'moderate',     label: '보통 활동',          sub: '주 3~5회 운동',              factor: 1.55 },
  { id: 'active',       label: '활발한 활동',        sub: '주 6~7회 강도 있는 운동',     factor: 1.725 },
  { id: 'very_active',  label: '매우 활발',          sub: '하루 2회 훈련 또는 육체 노동', factor: 1.9 },
]

export default function BMR() {
  const [form, setForm] = useState({ gender: 'male', age: '', height: '', weight: '', activity: 'moderate' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    const age = Number(form.age), h = Number(form.height), w = Number(form.weight)
    if (!age || !h || !w) return null
    // Mifflin-St Jeor 공식
    const bmr = form.gender === 'male'
      ? 10 * w + 6.25 * h - 5 * age + 5
      : 10 * w + 6.25 * h - 5 * age - 161
    const act = ACTIVITIES.find(a => a.id === form.activity)
    const tdee = Math.round(bmr * (act?.factor || 1.55))
    return {
      bmr: Math.round(bmr),
      tdee,
      lose: tdee - 500,
      gain: tdee + 500,
      actLabel: act?.label,
    }
  }, [form])

  return (
    <CalcPageLayout id="bmr" icon="🔥" title="기초대사량(BMR) 계산기" description="Mifflin-St Jeor 공식 · 활동량별 일일 권장 칼로리">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">성별</label>
            <div className="grid grid-cols-2 gap-2">
              {[['male', '남성 👨'], ['female', '여성 👩']].map(([val, label]) => (
                <button key={val} onClick={() => set('gender', val)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${form.gender === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['age', '나이', '세', '30'],
              ['height', '신장', 'cm', '170'],
              ['weight', '체중', 'kg', '70'],
            ].map(([key, label, unit, ph]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                <div className="relative">
                  <input type="number" value={form[key]} onChange={e => set(key, e.target.value)}
                    className="input-field pr-7 text-sm" placeholder={ph} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">활동 수준</label>
            <div className="space-y-2">
              {ACTIVITIES.map(a => (
                <label key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors
                  ${form.activity === a.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="activity" value={a.id} checked={form.activity === a.id}
                    onChange={e => set('activity', e.target.value)} className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{a.label}</p>
                    <p className="text-xs text-gray-400">{a.sub}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">×{a.factor}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">일일 권장 칼로리 (TDEE)</div>
            <div className="text-4xl font-bold text-blue-600">{result.tdee.toLocaleString()}</div>
            <div className="text-sm text-gray-400 mt-1">kcal/일 · {result.actLabel}</div>
          </div>
          {[
            ['기초대사량 (BMR)', `${result.bmr.toLocaleString()} kcal`, '아무것도 안 해도 소모'],
            ['다이어트 권장', `${result.lose.toLocaleString()} kcal`, '일일 500kcal 감소'],
            ['근육 증가 권장', `${result.gain.toLocaleString()} kcal`, '일일 500kcal 증가'],
          ].map(([label, value, sub]) => (
            <div key={label} className="flex justify-between items-center bg-white rounded-xl px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm text-gray-700 font-medium">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <span className="text-sm font-bold text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      )}
    </CalcPageLayout>
  )
}

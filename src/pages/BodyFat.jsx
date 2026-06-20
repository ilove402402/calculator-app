import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const FAT_RANGES = {
  male:   [{ max: 10, label: '저체지방', color: 'text-blue-500' }, { max: 20, label: '정상', color: 'text-green-500' }, { max: 25, label: '과체지방', color: 'text-yellow-500' }, { max: 999, label: '비만', color: 'text-red-500' }],
  female: [{ max: 18, label: '저체지방', color: 'text-blue-500' }, { max: 28, label: '정상', color: 'text-green-500' }, { max: 33, label: '과체지방', color: 'text-yellow-500' }, { max: 999, label: '비만', color: 'text-red-500' }],
}
const NORMAL = { male: [10, 20], female: [18, 28] }

export default function BodyFat() {
  const [form, setForm] = useState({ gender: 'male', age: '', height: '', weight: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    const age = Number(form.age), h = Number(form.height), w = Number(form.weight)
    if (!age || !h || !w) return null
    const bmi = w / Math.pow(h / 100, 2)
    // Deurenberg 공식
    const genderFactor = form.gender === 'male' ? 1 : 0
    const bodyFat = 1.20 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4
    const fatKg = w * bodyFat / 100
    const leanKg = w - fatKg
    const ranges = FAT_RANGES[form.gender]
    const found = ranges.find(r => bodyFat <= r.max) || ranges[ranges.length - 1]
    const [normalMin, normalMax] = NORMAL[form.gender]
    const gaugePos = Math.min(100, Math.max(0, ((bodyFat - 5) / 40) * 100))
    return { bmi: bmi.toFixed(1), bodyFat: bodyFat.toFixed(1), fatKg: fatKg.toFixed(1), leanKg: leanKg.toFixed(1), label: found.label, color: found.color, normalMin, normalMax, gaugePos }
  }, [form])

  return (
    <CalcPageLayout id="body-fat" icon="📏" title="체지방률 계산기" description="Deurenberg 공식 기반 체지방률 추정 · 정상 범위 확인">
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
            {[['age', '나이', '세', '30'], ['height', '신장', 'cm', '170'], ['weight', '체중', 'kg', '70']].map(([key, label, unit, ph]) => (
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
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">체지방률 (추정)</div>
            <div className={`text-4xl font-bold ${result.color}`}>{result.bodyFat}%</div>
            <div className={`text-sm font-semibold mt-1 ${result.color}`}>{result.label}</div>
            <p className="text-xs text-gray-400 mt-1">
              정상 범위: {result.normalMin}~{result.normalMax}% ({form.gender === 'male' ? '남성' : '여성'})
            </p>
          </div>
          {/* 게이지 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="h-3 bg-gradient-to-r from-blue-300 via-green-400 via-yellow-400 to-red-500 rounded-full relative mb-1">
              <div className="absolute w-3 h-3 bg-white border-2 border-gray-600 rounded-full -top-0 -translate-x-1/2 transition-all"
                style={{ left: `${result.gaugePos}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>5%</span><span>정상</span><span>비만</span><span>45%</span>
            </div>
          </div>
          {[
            ['BMI', `${result.bmi} kg/㎡`],
            ['체지방량 (추정)', `${result.fatKg} kg`],
            ['제지방량 (근육·뼈 등)', `${result.leanKg} kg`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{value}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center">추정치입니다 · 정확한 측정은 InBody 등 전문 기기 이용</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

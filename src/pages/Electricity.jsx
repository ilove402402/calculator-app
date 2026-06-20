import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon, calculateElectricity } from '../utils/calculations'

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const SEASON_INFO = {
  summer: ['7월', '8월'],
  winter: ['12월', '1월', '2월'],
  other: ['3월', '4월', '5월', '6월', '9월', '10월', '11월'],
}

export default function Electricity() {
  const currentMonth = new Date().getMonth() + 1
  const [form, setForm] = useState({ kwh: '', month: String(currentMonth) })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const result = useMemo(() => calculateElectricity(form.kwh, form.month), [form])

  const isSummer = [7, 8].includes(Number(form.month))
  const isWinter = [12, 1, 2].includes(Number(form.month))
  const seasonLabel = isSummer ? '하계 ☀️' : isWinter ? '동계 ❄️' : '봄/가을 🌿'

  return (
    <CalcPageLayout id="electricity" icon="⚡" title="전기요금 계산기" description="한국전력 주택용 저압 누진요금제 · 부가세·기반기금 포함">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">사용 월</label>
            <select value={form.month} onChange={e => set('month', e.target.value)} className="input-field">
              {MONTHS.map((m, i) => (
                <option key={i + 1} value={String(i + 1)}>{m}</option>
              ))}
            </select>
            <p className="text-xs mt-1">
              <span className={`font-medium ${isSummer ? 'text-orange-500' : isWinter ? 'text-blue-500' : 'text-green-600'}`}>
                {seasonLabel}
              </span>
              <span className="text-gray-400 ml-1">요금이 적용됩니다</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">이번 달 사용량</label>
            <div className="flex gap-2 mb-2">
              {[100, 200, 300, 400].map(k => (
                <button key={k} onClick={() => set('kwh', String(k))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors
                    ${form.kwh === String(k) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {k}
                </button>
              ))}
            </div>
            <div className="relative">
              <input type="number" value={form.kwh} onChange={e => set('kwh', e.target.value)}
                className="input-field pr-12" placeholder="300" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kWh</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">이번 달 예상 전기요금</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.total)}</div>
            <div className="text-xs text-gray-400 mt-1">{form.kwh}kWh · {seasonLabel}</div>
          </div>
          {[
            ['기본요금', result.basicFee],
            ['전력량요금', result.energyFee],
            ['소계', result.subtotal],
            ['부가가치세 (10%)', result.vat],
            ['전력산업기반기금 (3.7%)', result.fund],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{formatWon(val)}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center">한전 주택용 저압 누진 3단계 기준 · 실제 청구액과 차이 있을 수 있음</p>
        </div>
      )}

      {/* 누진 구조 안내 */}
      <div className="calc-card mt-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">주택용 전력 누진 요금표 (기타 계절)</h3>
        <div className="space-y-1.5 text-sm">
          {[
            ['200kWh 이하', '기본 910원 + 88.3원/kWh'],
            ['201~400kWh', '기본 1,600원 + 182.9원/kWh'],
            ['401kWh 초과', '기본 7,300원 + 275.6원/kWh'],
          ].map(([range, rate]) => (
            <div key={range} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-600">{range}</span>
              <span className="font-medium text-gray-800">{rate}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">하계(7~8월)·동계(12~2월)는 구간별 요율 상이</p>
      </div>
    </CalcPageLayout>
  )
}

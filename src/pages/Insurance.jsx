import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateInsurance, formatWon } from '../utils/calculations'

function InsuranceRow({ label, empRate, rate, empAmount, emplAmount }) {
  return (
    <div className="grid grid-cols-4 items-center py-3 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-400">{rate}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-blue-600">{formatWon(empAmount)}</div>
        <div className="text-xs text-gray-400">근로자 {empRate}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-orange-500">{formatWon(emplAmount)}</div>
        <div className="text-xs text-gray-400">사업주</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-700">{formatWon(empAmount + emplAmount)}</div>
        <div className="text-xs text-gray-400">합계</div>
      </div>
    </div>
  )
}

export default function Insurance() {
  const [monthlySalary, setMonthlySalary] = useState('3000000')

  const result = useMemo(() => calculateInsurance(monthlySalary), [monthlySalary])

  return (
    <CalcPageLayout
      id="insurance"
      icon="🛡️"
      title="4대보험 계산기"
      description="월 급여 기준 근로자·사업주 부담 4대보험료를 계산합니다"
      badge="2026년 요율"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">월 급여 (세전)</label>
          <div className="relative">
            <input type="number" value={monthlySalary} onChange={e => setMonthlySalary(e.target.value)}
              className="input-field pr-8" placeholder="3000000" min="0" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
          </div>
          {monthlySalary && (
            <p className="text-xs text-gray-400 mt-1">{Number(monthlySalary).toLocaleString('ko-KR')}원 = 연봉 약 {(Number(monthlySalary) * 12).toLocaleString('ko-KR')}원</p>
          )}
        </div>
      </div>

      {/* 요율표 */}
      <div className="calc-card mb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">2026년 보험요율</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['국민연금', '근로자 4.5% / 사업주 4.5% (총 9%)'],
            ['건강보험', '근로자 3.545% / 사업주 3.545% (총 7.09%)'],
            ['장기요양', '건강보험료의 12.95% (각 절반)'],
            ['고용보험', '근로자 0.9% / 사업주 0.9% (150인 미만)'],
          ].map(([label, rate]) => (
            <div key={label} className="bg-gray-50 rounded-lg p-2">
              <div className="font-medium text-gray-700">{label}</div>
              <div className="text-gray-400 mt-0.5">{rate}</div>
            </div>
          ))}
        </div>
      </div>

      {result ? (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-2">계산 결과</h2>
          <div className="grid grid-cols-4 text-xs text-gray-400 mb-1 font-medium px-0">
            <div>항목</div>
            <div className="text-right text-blue-600">근로자</div>
            <div className="text-right text-orange-500">사업주</div>
            <div className="text-right">합계</div>
          </div>
          <div className="bg-white rounded-xl px-4 shadow-sm">
            <InsuranceRow label="국민연금" empRate="4.5%" rate="총 9%"
              empAmount={result.employee.nationalPension} emplAmount={result.employer.nationalPension} />
            <InsuranceRow label="건강보험" empRate="3.545%" rate="총 7.09%"
              empAmount={result.employee.health} emplAmount={result.employer.health} />
            <InsuranceRow label="장기요양" empRate="건보의 6.475%" rate="건보의 12.95%"
              empAmount={result.employee.longTerm} emplAmount={result.employer.longTerm} />
            <InsuranceRow label="고용보험" empRate="0.9%" rate="총 1.8%"
              empAmount={result.employee.employment} emplAmount={result.employer.employment} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-blue-600 rounded-xl p-4 text-center text-white">
              <div className="text-xs opacity-80 mb-1">근로자 부담 합계</div>
              <div className="text-2xl font-bold">{formatWon(result.employee.total)}</div>
            </div>
            <div className="bg-orange-500 rounded-xl p-4 text-center text-white">
              <div className="text-xs opacity-80 mb-1">사업주 부담 합계</div>
              <div className="text-2xl font-bold">{formatWon(result.employer.total)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          월 급여를 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

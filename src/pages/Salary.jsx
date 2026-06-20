import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateSalary, formatWon } from '../utils/calculations'

function ResultRow({ label, value, highlight }) {
  return (
    <div className={`flex justify-between items-center py-2.5 ${highlight ? 'border-t border-blue-200 mt-1 pt-3' : 'border-b border-gray-50'}`}>
      <span className={`text-sm ${highlight ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{label}</span>
      <span className={highlight ? 'text-xl font-bold text-blue-600' : 'text-sm font-medium text-gray-800'}>
        {value}
      </span>
    </div>
  )
}

export default function Salary() {
  const [annualSalary, setAnnualSalary] = useState('40000000')
  const [dependents, setDependents] = useState('0')

  const result = useMemo(() => calculateSalary(annualSalary, dependents), [annualSalary, dependents])

  return (
    <CalcPageLayout
      id="salary"
      icon="💰"
      title="연봉 실수령액 계산기"
      description="2026년 세율 기준 월 실수령액과 4대보험을 계산합니다"
      badge="2026년 기준"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">연봉 (세전)</label>
            <div className="relative">
              <input
                type="number"
                value={annualSalary}
                onChange={e => setAnnualSalary(e.target.value)}
                className="input-field pr-8"
                placeholder="40000000"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {annualSalary && (
              <p className="text-xs text-gray-400 mt-1">
                = {Number(annualSalary).toLocaleString('ko-KR')}원
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              부양가족 수 <span className="text-gray-400 font-normal">(본인 제외)</span>
            </label>
            <select
              value={dependents}
              onChange={e => setDependents(e.target.value)}
              className="input-field"
            >
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}명{n === 0 ? ' (없음)' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-1">계산 결과</h2>
          <p className="text-xs text-gray-400 mb-4">월 급여 기준 (연봉 ÷ 12)</p>

          <div className="bg-white rounded-xl p-4 mb-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">월 실수령액</div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.netSalary)}</div>
            <div className="text-sm text-gray-400 mt-1">세전 {formatWon(result.monthly)} → 공제 후</div>
          </div>

          <div className="space-y-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">공제 내역</p>
            <ResultRow label="국민연금 (4.5%)" value={formatWon(result.nationalPension)} />
            <ResultRow label="건강보험 (3.545%)" value={formatWon(result.healthInsurance)} />
            <ResultRow label="장기요양보험 (건강보험의 12.95%)" value={formatWon(result.longTermCare)} />
            <ResultRow label="고용보험 (0.9%)" value={formatWon(result.employmentInsurance)} />
            <ResultRow label="소득세" value={formatWon(result.monthlyIncomeTax)} />
            <ResultRow label="지방소득세 (소득세의 10%)" value={formatWon(result.localTax)} />
            <ResultRow label="총 공제액" value={formatWon(result.totalDeduction)} highlight />
          </div>
        </div>
      )}

      {!result && (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          연봉을 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

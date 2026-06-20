import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateYearEndTax, formatWon } from '../utils/calculations'

export default function YearEndTax() {
  const [annualSalary, setAnnualSalary] = useState('40000000')
  const [dependents, setDependents] = useState('0')
  const [creditCard, setCreditCard] = useState('5000000')
  const [medicalExpense, setMedicalExpense] = useState('500000')
  const [educationExpense, setEducationExpense] = useState('0')

  const result = useMemo(
    () => calculateYearEndTax(annualSalary, dependents, creditCard, medicalExpense, educationExpense),
    [annualSalary, dependents, creditCard, medicalExpense, educationExpense]
  )

  return (
    <CalcPageLayout
      id="year-end-tax"
      icon="📄"
      title="연말정산 계산기"
      description="연봉과 지출 내역으로 환급액 또는 추가납부액을 미리 계산합니다"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">연봉 (세전)</label>
            <div className="relative">
              <input type="number" value={annualSalary} onChange={e => setAnnualSalary(e.target.value)}
                className="input-field pr-8" placeholder="40000000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">부양가족 수 (본인 제외)</label>
            <select value={dependents} onChange={e => setDependents(e.target.value)} className="input-field">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}명{n === 0 ? ' (없음)' : ''}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">연간 지출 내역</p>
            {[
              ['신용카드·체크카드 사용액', creditCard, setCreditCard, '총급여의 25% 초과분 15% 공제'],
              ['의료비', medicalExpense, setMedicalExpense, '총급여의 3% 초과분 15% 세액공제'],
              ['교육비', educationExpense, setEducationExpense, '15% 세액공제 (한도 있음)'],
            ].map(([label, value, setter, hint]) => (
              <div key={label} className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <div className="relative">
                  <input type="number" value={value} onChange={e => setter(e.target.value)}
                    className="input-field pr-8" min="0" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result ? (
        <div className={`rounded-2xl border p-6 ${result.refund >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h2 className="font-semibold text-gray-700 mb-4">계산 결과</h2>
          <div className="bg-white rounded-xl p-5 text-center shadow-sm mb-4">
            <div className="text-sm text-gray-500 mb-1">
              {result.refund >= 0 ? '예상 환급액 💸' : '예상 추가납부액 ⚠️'}
            </div>
            <div className={`text-4xl font-bold ${result.refund >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {result.refund >= 0 ? '+' : ''}{formatWon(result.refund)}
            </div>
          </div>

          <div className="space-y-2">
            {[
              ['기납부 세액 (원천징수)', formatWon(result.paidTax), false],
              ['신용카드 소득공제 효과', `- ${formatWon(result.ccDeduction)}`, false],
              ['의료비 세액공제', `- ${formatWon(result.medCredit)}`, false],
              ['교육비 세액공제', `- ${formatWon(result.eduCredit)}`, false],
              ['결정세액', formatWon(result.finalTax), true],
            ].map(([label, value, highlight]) => (
              <div key={label} className={`flex justify-between bg-white rounded-lg px-4 py-2.5 shadow-sm ${highlight ? 'ring-1 ring-blue-300' : ''}`}>
                <span className="text-sm text-gray-600">{label}</span>
                <span className={`text-sm font-semibold ${highlight ? 'text-blue-700' : 'text-gray-800'}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
            ※ 간편 계산 결과로 실제와 다를 수 있습니다. 보험료·주택자금 등 추가 공제 미반영
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          연봉을 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

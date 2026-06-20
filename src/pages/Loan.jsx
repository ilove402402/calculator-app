import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateLoan, formatWon } from '../utils/calculations'

export default function Loan() {
  const [loanAmount, setLoanAmount] = useState('100000000')
  const [annualRate, setAnnualRate] = useState('4.5')
  const [termMonths, setTermMonths] = useState('240')
  const [repaymentType, setRepaymentType] = useState('equal-payment')

  const result = useMemo(
    () => calculateLoan(loanAmount, annualRate, termMonths, repaymentType),
    [loanAmount, annualRate, termMonths, repaymentType]
  )

  return (
    <CalcPageLayout
      id="loan"
      icon="🏧"
      title="대출 이자 계산기"
      description="원금균등·원리금균등 방식의 월 상환액과 총 이자를 계산합니다"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">대출 금액</label>
            <div className="relative">
              <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
                className="input-field pr-8" placeholder="100000000" min="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {loanAmount && <p className="text-xs text-gray-400 mt-1">{Number(loanAmount).toLocaleString('ko-KR')}원</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">연 이율</label>
            <div className="relative">
              <input type="number" value={annualRate} onChange={e => setAnnualRate(e.target.value)}
                className="input-field pr-8" placeholder="4.5" min="0" step="0.1" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">대출 기간</label>
            <div className="relative">
              <input type="number" value={termMonths} onChange={e => setTermMonths(e.target.value)}
                className="input-field pr-8" placeholder="240" min="1" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">개월</span>
            </div>
            {termMonths && <p className="text-xs text-gray-400 mt-1">= {Math.floor(Number(termMonths) / 12)}년 {Number(termMonths) % 12}개월</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">상환 방식</label>
            <div className="grid grid-cols-2 gap-2">
              {[['equal-payment', '원리금균등', '매월 동일한 금액 납부'], ['equal-principal', '원금균등', '매월 이자가 줄어드는 방식']].map(([val, label, desc]) => (
                <button key={val} onClick={() => setRepaymentType(val)}
                  className={`p-3 rounded-xl border-2 text-left transition-colors ${
                    repaymentType === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className={`text-sm font-semibold ${repaymentType === val ? 'text-blue-700' : 'text-gray-700'}`}>{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result ? (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">계산 결과</h2>
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">
                {repaymentType === 'equal-payment' ? '월 상환액 (고정)' : '첫 달 상환액'}
              </div>
              <div className="text-4xl font-bold text-blue-600">{formatWon(result.monthlyPayment)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">총 이자</div>
                <div className="text-xl font-bold text-red-500">{formatWon(result.totalInterest)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">총 상환액</div>
                <div className="text-xl font-bold text-gray-800">{formatWon(result.totalPayment)}</div>
              </div>
            </div>
          </div>

          {result.schedule.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">상환 일정 (요약)</p>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['회차', '상환액', '원금', '이자', '잔액'].map(h => (
                        <th key={h} className="px-3 py-2 text-xs text-gray-500 text-right first:text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-3 py-2 text-gray-700">{row.month}회</td>
                        <td className="px-3 py-2 text-right text-gray-700">{Math.round(row.payment).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-blue-600">{Math.round(row.principal).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-red-400">{Math.round(row.interest).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-gray-500">{Math.round(row.balance).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          대출 정보를 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

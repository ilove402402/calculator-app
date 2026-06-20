import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateCapitalGains, formatWon } from '../utils/calculations'

export default function CapitalGains() {
  const [acquisitionPrice, setAcquisitionPrice] = useState('300000000')
  const [transferPrice, setTransferPrice] = useState('500000000')
  const [holdingYears, setHoldingYears] = useState('3')
  const [isOneHousehold, setIsOneHousehold] = useState(false)

  const result = useMemo(
    () => calculateCapitalGains(acquisitionPrice, transferPrice, holdingYears, isOneHousehold),
    [acquisitionPrice, transferPrice, holdingYears, isOneHousehold]
  )

  return (
    <CalcPageLayout
      id="capital-gains"
      icon="🏠"
      title="양도소득세 계산기"
      description="부동산 매도 시 납부할 양도소득세를 계산합니다 (지방소득세 포함)"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">취득가액 (구입 금액)</label>
            <div className="relative">
              <input type="number" value={acquisitionPrice} onChange={e => setAcquisitionPrice(e.target.value)}
                className="input-field pr-8" placeholder="300000000" min="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {acquisitionPrice && <p className="text-xs text-gray-400 mt-1">{Number(acquisitionPrice).toLocaleString('ko-KR')}원</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">양도가액 (매도 금액)</label>
            <div className="relative">
              <input type="number" value={transferPrice} onChange={e => setTransferPrice(e.target.value)}
                className="input-field pr-8" placeholder="500000000" min="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {transferPrice && <p className="text-xs text-gray-400 mt-1">{Number(transferPrice).toLocaleString('ko-KR')}원</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">보유 기간</label>
            <div className="relative">
              <input type="number" value={holdingYears} onChange={e => setHoldingYears(e.target.value)}
                className="input-field pr-8" placeholder="3" min="0" step="0.5" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">년</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
            onClick={() => setIsOneHousehold(!isOneHousehold)}>
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
              ${isOneHousehold ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
              {isOneHousehold && <span className="text-white text-sm">✓</span>}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">1가구 1주택 여부</span>
              <p className="text-xs text-gray-400">2년 이상 보유 시 비과세 혜택 적용</p>
            </div>
          </div>
        </div>
      </div>

      {result && (
        result.exempt ? (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <div className="text-xl font-bold text-green-700 mb-2">비과세 대상입니다!</div>
            <p className="text-sm text-green-600">1가구 1주택, 2년 이상 보유, 12억 이하 — 양도소득세 없음</p>
            <div className="mt-4 bg-white rounded-xl p-3">
              <span className="text-sm text-gray-600">양도차익: </span>
              <span className="font-bold text-gray-800">{formatWon(result.transferGain)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">계산 결과</h2>
            <div className="bg-white rounded-xl p-4 mb-4 text-center shadow-sm">
              <div className="text-sm text-gray-500 mb-1">납부 예상 세액 (지방세 포함)</div>
              <div className="text-4xl font-bold text-blue-600">{formatWon(result.taxAmount)}</div>
            </div>
            <div className="space-y-2">
              {[
                ['양도차익', formatWon(result.transferGain)],
                ['장기보유특별공제', `- ${formatWon(result.longTermDeduction)} (${Math.round((result.longTermDeductionRate || 0) * 100)}%)`],
                ['기본공제', `- ${formatWon(result.basicDeduction)}`],
                ['과세표준', formatWon(result.taxableGain)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between bg-white rounded-lg px-4 py-2.5 shadow-sm">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
              ※ 필요경비(취득세, 중개수수료 등) 미반영 시 실제 세액이 낮아질 수 있습니다
            </div>
          </div>
        )
      )}

      {!result && (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          금액을 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

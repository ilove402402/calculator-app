import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon } from '../utils/calculations'

// 2024년 기준 (2026년도 동일 적용)
// 부모급여: 만 0세(0~11개월) 100만원, 만 1세(12~23개월) 50만원
// 아동수당: 만 0~7세 (0~95개월) 10만원/월

export default function ChildAllowance() {
  const [children, setChildren] = useState([{ id: 1, months: '' }])

  function addChild() {
    setChildren(prev => [...prev, { id: Date.now(), months: '' }])
  }
  function removeChild(id) {
    setChildren(prev => prev.filter(c => c.id !== id))
  }
  function updateChild(id, months) {
    setChildren(prev => prev.map(c => c.id === id ? { ...c, months } : c))
  }

  const results = useMemo(() => {
    return children.map(child => {
      const m = Number(child.months)
      if (m === '' || isNaN(m) || m < 0) return null

      const parentBenefit = m <= 11 ? 1_000_000 : m <= 23 ? 500_000 : 0
      const childAllowance = m <= 95 ? 100_000 : 0
      const total = parentBenefit + childAllowance

      let ageLabel = ''
      if (m <= 11) ageLabel = `만 0세 (${m}개월)`
      else if (m <= 23) ageLabel = `만 1세 (${m}개월)`
      else if (m <= 35) ageLabel = `만 2세 (${m}개월)`
      else ageLabel = `만 ${Math.floor(m / 12)}세 (${m}개월)`

      return { ...child, m, parentBenefit, childAllowance, total, ageLabel }
    })
  }, [children])

  const totalAll = results.reduce((sum, r) => sum + (r?.total || 0), 0)

  return (
    <CalcPageLayout id="child-allowance" icon="🧒" title="아동수당 계산기" description="2024년 기준 부모급여 + 아동수당 월 수령액">
      <div className="calc-card mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">자녀 정보 입력</h2>
          <button onClick={addChild} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ 자녀 추가</button>
        </div>

        <div className="space-y-3">
          {children.map((child, i) => (
            <div key={child.id} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                {i + 1}
              </div>
              <div className="relative flex-1">
                <input type="number" value={child.months}
                  onChange={e => updateChild(child.id, e.target.value)}
                  className="input-field pr-12" placeholder="24" min="0" max="120" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">개월</span>
              </div>
              {children.length > 1 && (
                <button onClick={() => removeChild(child.id)} className="text-gray-300 hover:text-red-400 transition-colors text-lg">×</button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">아이 나이를 개월 수로 입력하세요 (예: 24 = 만 2세)</p>
      </div>

      {results.some(r => r !== null) && (
        <div className="space-y-3">
          {results.map((r, i) => r && (
            <div key={children[i].id} className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{i + 1}</span>
                <span className="font-semibold text-gray-700">{r.ageLabel}</span>
              </div>
              {[
                ['부모급여', r.parentBenefit, r.parentBenefit === 0 ? '해당 없음 (만 2세 이상)' : r.m <= 11 ? '만 0세 100만원' : '만 1세 50만원'],
                ['아동수당', r.childAllowance, r.childAllowance === 0 ? '해당 없음 (만 8세 이상)' : '만 0~7세 10만원'],
              ].map(([label, val, note]) => (
                <div key={label} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-gray-400">{note}</p>
                  </div>
                  <span className={`text-sm font-bold ${val > 0 ? 'text-blue-600' : 'text-gray-300'}`}>{val > 0 ? formatWon(val) : '-'}</span>
                </div>
              ))}
              <div className="flex justify-between bg-blue-600 rounded-xl px-4 py-3">
                <span className="text-sm font-bold text-white">월 합계</span>
                <span className="text-sm font-bold text-white">{formatWon(r.total)}</span>
              </div>
            </div>
          ))}
          {children.length > 1 && totalAll > 0 && (
            <div className="flex justify-between bg-slate-800 rounded-2xl px-5 py-4">
              <span className="font-bold text-white">전체 자녀 월 합계</span>
              <span className="font-bold text-blue-300 text-lg">{formatWon(totalAll)}</span>
            </div>
          )}
          <p className="text-xs text-gray-400 text-center">2024년 기준 · 소득 무관 전 가구 지급 · 실제 지급액은 복지로 확인</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

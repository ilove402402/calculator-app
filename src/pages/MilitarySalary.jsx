import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { formatWon } from '../utils/calculations'

// 2025년 기준 (2026년 추가 인상 예정, 추후 업데이트)
const ENLISTED = [
  { rank: '이병', monthly: 750_000, period: '입대 후 2개월 이내' },
  { rank: '일병', monthly: 840_000, period: '3개월 ~ 12개월' },
  { rank: '상병', monthly: 1_000_000, period: '13개월 ~ 20개월' },
  { rank: '병장', monthly: 1_250_000, period: '21개월 ~ 전역' },
]

const OFFICERS = [
  { rank: '소위',  pay: [1_737_900, 1_799_200, 1_861_900, 1_926_200] },
  { rank: '중위',  pay: [1_862_900, 1_930_400, 2_000_300, 2_072_200] },
  { rank: '대위',  pay: [2_145_300, 2_223_400, 2_303_900, 2_386_700] },
  { rank: '소령',  pay: [2_652_700, 2_749_700, 2_849_900, 2_953_100] },
  { rank: '중령',  pay: [3_190_900, 3_308_900, 3_430_500, 3_556_000] },
  { rank: '대령',  pay: [3_782_500, 3_923_900, 4_070_000, 4_220_800] },
  { rank: '준장',  pay: [4_374_500, 4_541_900, 4_715_300, 4_894_800] },
  { rank: '소장',  pay: [4_998_900, 5_193_600, 5_395_000, 5_603_600] },
  { rank: '중장',  pay: [5_623_300, 5_846_400, 6_076_800, 6_315_400] },
  { rank: '대장',  pay: [6_332_100, 6_585_900, 6_848_000, 7_119_600] },
]

const NCO = [
  { rank: '하사', pay: [1_625_200, 1_681_800, 1_740_300, 1_800_800] },
  { rank: '중사', pay: [1_840_600, 1_906_300, 1_974_400, 2_044_900] },
  { rank: '상사', pay: [2_213_300, 2_294_300, 2_378_000, 2_464_400] },
  { rank: '원사', pay: [2_651_200, 2_749_100, 2_850_500, 2_954_900] },
  { rank: '준위', pay: [2_299_600, 2_383_400, 2_469_900, 2_558_900] },
]

export default function MilitarySalary() {
  const [type, setType] = useState('enlisted')
  const [rank, setRank] = useState('이병')
  const [hosu, setHosu] = useState(1)

  const rankList = type === 'enlisted' ? ENLISTED : type === 'officer' ? OFFICERS : NCO

  const result = useMemo(() => {
    if (type === 'enlisted') {
      const found = ENLISTED.find(e => e.rank === rank)
      if (!found) return null
      return { base: found.monthly, period: found.period, type: 'enlisted' }
    } else {
      const list = type === 'officer' ? OFFICERS : NCO
      const found = list.find(o => o.rank === rank)
      if (!found) return null
      const idx = Math.min(Math.max(hosu - 1, 0), found.pay.length - 1)
      return { base: found.pay[idx], hosu: idx + 1, type }
    }
  }, [type, rank, hosu])

  function handleTypeChange(t) {
    setType(t)
    const list = t === 'enlisted' ? ENLISTED : t === 'officer' ? OFFICERS : NCO
    setRank(list[0].rank)
    setHosu(1)
  }

  return (
    <CalcPageLayout id="military-salary" icon="🪖" title="군인 월급 계산기" description="2025년 기준 병사/부사관/장교 계급별 기본급">
      <div className="calc-card mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">구분</label>
            <div className="grid grid-cols-3 gap-2">
              {[['enlisted', '병사'], ['nco', '부사관'], ['officer', '장교']].map(([val, label]) => (
                <button key={val} onClick={() => handleTypeChange(val)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${type === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">계급</label>
            <select value={rank} onChange={e => setRank(e.target.value)} className="input-field">
              {rankList.map(r => (
                <option key={r.rank} value={r.rank}>{r.rank}</option>
              ))}
            </select>
          </div>
          {type !== 'enlisted' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">호봉</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(h => (
                  <button key={h} onClick={() => setHosu(h)}
                    className={`py-2 rounded-xl text-sm font-semibold transition-colors
                      ${hosu === h ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {h}호봉
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">1~4호봉 기준 표시 (실제 호봉은 복무 기간에 따라 더 높을 수 있음)</p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">
              {rank} {result.type !== 'enlisted' ? `${result.hosu}호봉` : ''} 기본급
            </div>
            <div className="text-4xl font-bold text-blue-600">{formatWon(result.base)}</div>
            <div className="text-xs text-gray-400 mt-1">/월</div>
          </div>
          {result.period && (
            <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-600">복무 시기</span>
              <span className="text-sm font-semibold text-gray-800">{result.period}</span>
            </div>
          )}
          <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
            <span className="text-sm text-gray-600">연간 수령 (기본급 기준)</span>
            <span className="text-sm font-semibold text-gray-800">{formatWon(result.base * 12)}</span>
          </div>
          <p className="text-xs text-gray-400 text-center">2025년 기준 · 수당 별도 · 2026년 인상 후 업데이트 예정</p>
        </div>
      )}

      {/* 병사 전 계급 비교 */}
      {type === 'enlisted' && (
        <div className="calc-card mt-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">2025년 병사 월급 현황</h3>
          <div className="space-y-2">
            {ENLISTED.map(e => (
              <div key={e.rank} className={`flex justify-between items-center px-3 py-2.5 rounded-xl transition-colors
                ${rank === e.rank ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <div>
                  <span className="text-sm font-semibold text-gray-700">{e.rank}</span>
                  <span className="text-xs text-gray-400 ml-2">{e.period}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{e.monthly.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </CalcPageLayout>
  )
}

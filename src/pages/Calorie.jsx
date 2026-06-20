import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

const EXERCISES = [
  { id: 'walk_slow',    name: '천천히 걷기',  met: 2.5 },
  { id: 'walk_normal',  name: '보통 걷기',    met: 3.5 },
  { id: 'walk_fast',    name: '빠르게 걷기',  met: 4.5 },
  { id: 'jog',          name: '조깅',         met: 7.0 },
  { id: 'run',          name: '달리기',        met: 10.0 },
  { id: 'bike',         name: '자전거',        met: 6.0 },
  { id: 'swim',         name: '수영',          met: 6.0 },
  { id: 'jump_rope',    name: '줄넘기',        met: 10.0 },
  { id: 'hiit',         name: 'HIIT',         met: 12.0 },
  { id: 'yoga',         name: '요가',          met: 3.0 },
  { id: 'pilates',      name: '필라테스',      met: 3.5 },
  { id: 'weight',       name: '웨이트 트레이닝', met: 5.0 },
  { id: 'squat',        name: '스쿼트',        met: 5.5 },
  { id: 'stairs',       name: '계단 오르기',   met: 8.0 },
  { id: 'housework',    name: '집안일',        met: 3.0 },
]

const FOODS = [
  { name: '공기밥 (210g)', cal: 315 }, { name: '라면 (1봉)', cal: 500 },
  { name: '삼겹살 (200g)', cal: 640 }, { name: '치킨 (반마리)', cal: 750 },
  { name: '피자 (2조각)', cal: 500 }, { name: '빵 (식빵 2장)', cal: 180 },
  { name: '계란 (2개)', cal: 140 }, { name: '바나나 (1개)', cal: 90 },
  { name: '아메리카노', cal: 10 }, { name: '카페라떼', cal: 130 },
  { name: '아이스크림 (1개)', cal: 200 }, { name: '맥주 (500ml)', cal: 215 },
]

export default function Calorie() {
  const [weight, setWeight] = useState('')
  const [exercise, setExercise] = useState('walk_normal')
  const [minutes, setMinutes] = useState('30')
  const [selectedFoods, setSelectedFoods] = useState([])

  const result = useMemo(() => {
    const w = Number(weight)
    const m = Number(minutes)
    if (!w || !m) return null
    const ex = EXERCISES.find(e => e.id === exercise)
    const burned = Math.round(ex.met * w * (m / 60))
    const foodCal = selectedFoods.reduce((sum, f) => sum + f.cal, 0)
    return { burned, foodCal, net: foodCal - burned, ex }
  }, [weight, exercise, minutes, selectedFoods])

  function toggleFood(food) {
    setSelectedFoods(prev =>
      prev.some(f => f.name === food.name) ? prev.filter(f => f.name !== food.name) : [...prev, food]
    )
  }

  return (
    <CalcPageLayout id="calorie" icon="🍎" title="칼로리 계산기" description="운동 소모 칼로리 + 음식 섭취 칼로리 비교">
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">🏃 운동 소모 칼로리</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">체중</label>
            <div className="relative">
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                className="input-field pr-8" placeholder="70" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">운동 종목</label>
            <select value={exercise} onChange={e => setExercise(e.target.value)} className="input-field">
              {EXERCISES.map(e => (
                <option key={e.id} value={e.id}>{e.name} (MET {e.met})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">운동 시간</label>
            <div className="flex gap-2 mb-2">
              {[15, 30, 45, 60].map(m => (
                <button key={m} onClick={() => setMinutes(String(m))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors
                    ${minutes === String(m) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {m}분
                </button>
              ))}
            </div>
            <div className="relative">
              <input type="number" value={minutes} onChange={e => setMinutes(e.target.value)}
                className="input-field pr-8" min="1" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">분</span>
            </div>
          </div>
        </div>
      </div>

      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-3">🍽️ 섭취 칼로리 (선택)</h2>
        <div className="grid grid-cols-2 gap-2">
          {FOODS.map(food => {
            const selected = selectedFoods.some(f => f.name === food.name)
            return (
              <button key={food.name} onClick={() => toggleFood(food)}
                className={`text-left px-3 py-2 rounded-xl border-2 text-sm transition-all
                  ${selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="block text-gray-700 font-medium">{food.name}</span>
                <span className={`text-xs ${selected ? 'text-blue-600' : 'text-gray-400'}`}>{food.cal} kcal</span>
              </button>
            )
          })}
        </div>
        {selectedFoods.length > 0 && (
          <button onClick={() => setSelectedFoods([])} className="mt-2 text-xs text-gray-400 hover:text-red-400 transition-colors">
            선택 초기화
          </button>
        )}
      </div>

      {result && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">운동 소모 칼로리</div>
            <div className="text-4xl font-bold text-blue-600">{result.burned.toLocaleString()} kcal</div>
            <div className="text-xs text-gray-400 mt-1">{result.ex?.name} {minutes}분</div>
          </div>
          {result.foodCal > 0 && (
            <>
              <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">섭취 칼로리</span>
                <span className="text-sm font-semibold text-orange-600">+{result.foodCal.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">칼로리 차이 (섭취-소모)</span>
                <span className={`text-sm font-bold ${result.net > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {result.net > 0 ? '+' : ''}{result.net.toLocaleString()} kcal
                </span>
              </div>
            </>
          )}
          <p className="text-xs text-gray-400 text-center">MET 공식 기반 추정치 · 개인차 있음</p>
        </div>
      )}
    </CalcPageLayout>
  )
}

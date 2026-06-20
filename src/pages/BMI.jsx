import { useState, useMemo } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'
import { calculateBMI } from '../utils/calculations'

const GAUGE_STOPS = [
  { label: '저체중', range: '~18.4',   color: '#3b82f6' },
  { label: '정상',   range: '18.5~22.9', color: '#22c55e' },
  { label: '과체중', range: '23~24.9',  color: '#eab308' },
  { label: '비만',   range: '25~29.9',  color: '#f97316' },
  { label: '고도비만', range: '30~',   color: '#ef4444' },
]

const GENDER_INFO = {
  male: {
    label: '남성',
    fatRange: '10~20%',
    fatLow: '10%',
    fatHigh: '20%',
    advice: {
      저체중:  ['단백질 섭취를 늘리고 근력 운동을 시작하세요.', '하루 3끼 규칙적인 식사가 중요합니다.', '체중 미달은 면역력 저하와 골다공증 위험을 높입니다.'],
      정상:    ['현재 건강 체중을 잘 유지하고 있습니다!', '유산소 + 근력 운동을 주 3~4회 꾸준히 하세요.', '균형 잡힌 식단으로 현재 상태를 유지하세요.'],
      과체중:  ['생활 습관 개선이 필요한 시기입니다.', '하루 30분 이상 유산소 운동을 시작해보세요.', '야식과 과음을 줄이고 채소 섭취를 늘리세요.'],
      비만:    ['복부 비만이 심혈관 질환 위험을 높입니다.', '저탄수화물·고단백 식단과 근력 운동을 병행하세요.', '전문의 상담을 통한 체계적인 감량을 권장합니다.'],
      고도비만: ['전문 의료진과 함께 체계적인 감량 계획이 필요합니다.', '당뇨, 고혈압, 고지혈증 등의 합병증 위험이 높습니다.', '급격한 다이어트보다 의학적 관리를 우선하세요.'],
    },
  },
  female: {
    label: '여성',
    fatRange: '18~28%',
    fatLow: '18%',
    fatHigh: '28%',
    advice: {
      저체중:  ['에너지와 영양이 부족한 상태일 수 있습니다.', '호르몬 불균형과 골다공증 위험에 주의하세요.', '칼슘·철분이 풍부한 균형 잡힌 식단을 섭취하세요.'],
      정상:    ['건강한 체중 범위를 유지하고 있습니다!', '근력 운동으로 기초 대사량을 높이는 것을 추천합니다.', '충분한 수면과 스트레스 관리도 체중 유지에 도움이 됩니다.'],
      과체중:  ['식습관 점검과 가벼운 운동 시작을 권장합니다.', '걷기·수영 등 관절에 부담 없는 운동이 효과적입니다.', '당분과 가공식품 섭취를 줄여보세요.'],
      비만:    ['만성 질환 위험이 증가하는 수준입니다.', '유산소 운동과 식이 조절을 병행하세요.', '하루 식사를 소식 다횟수로 나눠 먹는 것이 효과적입니다.'],
      고도비만: ['전문 의료진과 함께 체계적인 감량 계획이 필요합니다.', '관절·심혈관·생식 건강에 복합적인 영향을 줄 수 있습니다.', '의학적 관리를 통한 안전한 감량을 우선하세요.'],
    },
  },
}

export default function BMI() {
  const [height, setHeight] = useState('165')
  const [weight, setWeight] = useState('60')
  const [gender, setGender] = useState('female')

  const result = useMemo(() => calculateBMI(height, weight), [height, weight])
  const genderInfo = GENDER_INFO[gender]
  const advice = result ? genderInfo.advice[result.classification] ?? [] : []

  return (
    <CalcPageLayout
      id="bmi"
      icon="⚖️"
      title="BMI 체질량지수 계산기"
      description="키·몸무게·성별로 비만도와 건강 체중 범위를 확인합니다"
    >
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          {/* 성별 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">성별</label>
            <div className="grid grid-cols-2 gap-3">
              {[['male', '남성 👨'], ['female', '여성 👩']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setGender(val)}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    gender === val
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 키/몸무게 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">키</label>
              <div className="relative">
                <input type="number" value={height} onChange={e => setHeight(e.target.value)}
                  className="input-field pr-8" placeholder="165" min="100" max="250" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">몸무게</label>
              <div className="relative">
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                  className="input-field pr-8" placeholder="60" min="10" max="300" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {result ? (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">계산 결과</h2>

          {/* BMI 수치 */}
          <div className="bg-white rounded-xl p-5 text-center shadow-sm">
            <div className="text-sm text-gray-500 mb-1">체질량지수 (BMI) · {genderInfo.label}</div>
            <div className={`text-5xl font-bold ${result.color} mb-1`}>{result.bmi.toFixed(1)}</div>
            <div className={`text-lg font-semibold ${result.color}`}>{result.classification}</div>
          </div>

          {/* 게이지 바 */}
          <div>
            <div className="relative h-7 rounded-full overflow-hidden"
              style={{ background: 'linear-gradient(to right, #3b82f6 0%, #22c55e 30%, #eab308 55%, #f97316 70%, #ef4444 85%, #ef4444 100%)' }}>
              <div className="absolute top-0 bottom-0 flex items-center transition-all duration-500"
                style={{ left: `calc(${result.gaugePos}% - 2px)` }}>
                <div className="w-1 h-full bg-white rounded-full shadow-md" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
              <span>10</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          {/* 비만도 표 */}
          <div className="grid grid-cols-5 gap-1">
            {GAUGE_STOPS.map(stop => (
              <div key={stop.label}
                className={`rounded-lg p-2 text-center transition-all ${
                  result.classification === stop.label ? 'ring-2 ring-offset-1 opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: stop.color + '22',
                  outlineColor: stop.color,
                }}>
                <div className="text-xs font-bold" style={{ color: stop.color }}>{stop.label}</div>
                <div className="text-xs text-gray-500">{stop.range}</div>
              </div>
            ))}
          </div>

          {/* 정상 체중 범위 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-700 mb-3">키 {height}cm 기준 정상 체중 범위</div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-0.5">최소 (BMI 18.5)</div>
                <div className="text-xl font-bold text-green-600">{result.normalWeightMin.toFixed(1)}kg</div>
              </div>
              <div className="text-gray-300 text-2xl">~</div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-0.5">최대 (BMI 22.9)</div>
                <div className="text-xl font-bold text-green-600">{result.normalWeightMax.toFixed(1)}kg</div>
              </div>
            </div>
            <div className="text-center">
              <span className={`text-sm font-semibold ${result.bmi >= 18.5 && result.bmi <= 22.9 ? 'text-green-600' : 'text-orange-500'}`}>
                {result.bmi < 18.5
                  ? `정상 체중까지 ${(result.normalWeightMin - Number(weight)).toFixed(1)}kg 증량 권장`
                  : result.bmi > 22.9
                  ? `정상 체중까지 ${(Number(weight) - result.normalWeightMax).toFixed(1)}kg 감량 권장`
                  : '정상 체중입니다 👍'}
              </span>
            </div>
          </div>

          {/* 성별 체지방률 기준 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              {genderInfo.label} 정상 체지방률 기준
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-green-400 rounded-full"
                  style={{ width: gender === 'male' ? '20%' : '28%' }} />
              </div>
              <span className="text-sm font-bold text-green-600 shrink-0">{genderInfo.fatRange}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>저체지방 (~{genderInfo.fatLow})</span>
              <span>정상</span>
              <span>과체지방 ({genderInfo.fatHigh}~)</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">※ 체지방률은 체성분 측정 기기로 별도 측정 필요</p>
          </div>

          {/* 성별 건강 조언 */}
          {advice.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                {genderInfo.label} {result.classification} 건강 조언
              </div>
              <ul className="space-y-2">
                {advice.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          키와 몸무게를 입력하면 자동으로 계산됩니다
        </div>
      )}
    </CalcPageLayout>
  )
}

import { useMemo, useState } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

export default function AgeCalc() {
  const [birthDate, setBirthDate] = useState('')

  const result = useMemo(() => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    if (isNaN(birth) || birth > today) return null

    const byy = birth.getFullYear(), bmm = birth.getMonth(), bdd = birth.getDate()
    const tyy = today.getFullYear(), tmm = today.getMonth(), tdd = today.getDate()

    const hasBirthdayPassed = tmm > bmm || (tmm === bmm && tdd >= bdd)
    const fullAge = tyy - byy - (hasBirthdayPassed ? 0 : 1)
    const koreanAge = tyy - byy + 1

    // 다음 생일
    let nextBirthday = new Date(tyy, bmm, bdd)
    if (nextBirthday <= today) nextBirthday = new Date(tyy + 1, bmm, bdd)
    const daysUntil = Math.ceil((nextBirthday - today) / 86400000)

    // 살아온 날수
    const livedDays = Math.floor((today - birth) / 86400000)

    // 띠
    const ZODIAC = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양']
    const zodiac = ZODIAC[byy % 12]

    // 별자리
    const SIGNS = [
      { name: '염소자리', end: [1, 19] }, { name: '물병자리', end: [2, 18] },
      { name: '물고기자리', end: [3, 20] }, { name: '양자리', end: [4, 19] },
      { name: '황소자리', end: [5, 20] }, { name: '쌍둥이자리', end: [6, 21] },
      { name: '게자리', end: [7, 22] }, { name: '사자자리', end: [8, 22] },
      { name: '처녀자리', end: [9, 22] }, { name: '천칭자리', end: [10, 23] },
      { name: '전갈자리', end: [11, 22] }, { name: '사수자리', end: [12, 31] },
    ]
    const m = bmm + 1
    const star = SIGNS.find(s => m < s.end[0] || (m === s.end[0] && bdd <= s.end[1]))?.name || '염소자리'

    return { fullAge, koreanAge, daysUntil, livedDays, zodiac, star, nextBirthday }
  }, [birthDate])

  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <CalcPageLayout id="age-calc" icon="🎂" title="나이 계산기" description="만 나이 · 세는 나이 · 다음 생일까지 D-day · 띠 · 별자리">
      <div className="calc-card mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1.5">생년월일</label>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
          max={maxDate} className="input-field" />
        <p className="text-xs text-gray-400 mt-1.5">2023년 6월부터 공식 나이는 만 나이 기준입니다</p>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">만 나이 (법적 기준)</div>
              <div className="text-4xl font-bold text-blue-600">{result.fullAge}</div>
              <div className="text-xs text-gray-400 mt-1">세</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">세는 나이 (한국 전통)</div>
              <div className="text-4xl font-bold text-gray-600">{result.koreanAge}</div>
              <div className="text-xs text-gray-400 mt-1">세</div>
            </div>
          </div>
          <div className="calc-card space-y-3">
            {[
              ['🎂 다음 생일', `${result.daysUntil}일 후 (${result.nextBirthday.toLocaleDateString('ko-KR')})`],
              ['📅 살아온 날수', `${result.livedDays.toLocaleString()}일`],
              ['🐾 띠', result.zodiac],
              ['⭐ 별자리', result.star],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </CalcPageLayout>
  )
}

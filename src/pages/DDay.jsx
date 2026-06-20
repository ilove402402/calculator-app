import { useState, useEffect, useCallback } from 'react'
import CalcPageLayout from '../components/CalcPageLayout'

function useCountdown(targetDate) {
  const calcDiff = useCallback(() => {
    const now = new Date()
    const target = new Date(targetDate)
    const diff = target - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true, totalDays: Math.abs(Math.floor(diff / 86400000)) }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      passed: false,
    }
  }, [targetDate])

  const [diff, setDiff] = useState(calcDiff)
  useEffect(() => {
    const id = setInterval(() => setDiff(calcDiff()), 1000)
    return () => clearInterval(id)
  }, [calcDiff])

  return diff
}

function DDayItem({ item, onDelete }) {
  const diff = useCountdown(item.date)
  const today = new Date().toISOString().split('T')[0]
  const isToday = item.date === today

  return (
    <div className="calc-card relative group">
      <button onClick={() => onDelete(item.id)}
        className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg">
        ✕
      </button>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{item.emoji || '📅'}</span>
        <div>
          <div className="font-bold text-gray-800">{item.name}</div>
          <div className="text-sm text-gray-400">{item.date}</div>
        </div>
      </div>

      {isToday ? (
        <div className="text-center py-2">
          <div className="text-3xl font-bold text-blue-600">D-Day!</div>
          <div className="text-sm text-gray-500 mt-1">오늘이 바로 그 날입니다 🎉</div>
        </div>
      ) : diff.passed ? (
        <div className="text-center py-2">
          <div className="text-sm text-gray-500">지난 지</div>
          <div className="text-3xl font-bold text-gray-400">D+{diff.totalDays}</div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              D-{diff.days}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[
              [diff.days, '일'],
              [diff.hours, '시간'],
              [diff.minutes, '분'],
              [diff.seconds, '초'],
            ].map(([val, unit]) => (
              <div key={unit} className="bg-blue-600 rounded-xl p-2 text-center text-white">
                <div className="text-2xl font-bold leading-none">{String(val).padStart(2, '0')}</div>
                <div className="text-xs opacity-70 mt-1">{unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const EMOJIS = ['📅', '🎂', '💍', '🎓', '✈️', '🎯', '🏆', '💪', '🎉', '❤️']

export default function DDay() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ddays') || '[]') } catch { return [] }
  })
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [emoji, setEmoji] = useState('📅')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem('ddays', JSON.stringify(items))
  }, [items])

  function addItem() {
    if (!name.trim() || !date) return
    setItems(prev => [...prev, { id: Date.now(), name: name.trim(), date, emoji }])
    setName('')
    setDate('')
    setEmoji('📅')
    setShowForm(false)
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <CalcPageLayout
      id="dday"
      icon="📅"
      title="D-day 카운터"
      description="중요한 날까지 실시간으로 카운트다운합니다. 여러 개 저장 가능"
    >
      {/* 추가 폼 */}
      {showForm ? (
        <div className="calc-card mb-4">
          <h2 className="font-semibold text-gray-700 mb-4">새 D-day 추가</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">이름</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="input-field" placeholder="예: 수능, 생일, 결혼기념일" maxLength={20} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">목표 날짜</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">아이콘</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setEmoji(e)}
                    className={`text-2xl p-1.5 rounded-lg transition-colors ${emoji === e ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addItem} disabled={!name.trim() || !date}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                추가하기
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                취소
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full mb-4 py-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-2xl
                     hover:border-blue-500 hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2">
          <span className="text-xl">+</span> 새 D-day 추가
        </button>
      )}

      {/* D-day 목록 */}
      {items.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          <div className="text-4xl mb-3">📅</div>
          <p className="font-medium">저장된 D-day가 없습니다</p>
          <p className="text-sm mt-1">위 버튼을 눌러 추가해보세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items
            .sort((a, b) => {
              const dA = new Date(a.date) - new Date()
              const dB = new Date(b.date) - new Date()
              if (dA >= 0 && dB >= 0) return dA - dB
              if (dA < 0 && dB < 0) return dB - dA
              return dA >= 0 ? -1 : 1
            })
            .map(item => (
              <DDayItem key={item.id} item={item} onDelete={deleteItem} />
            ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-600">
        ℹ️ D-day 정보는 이 기기의 브라우저에 저장됩니다 (localStorage)
      </div>
    </CalcPageLayout>
  )
}

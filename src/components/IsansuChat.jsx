import { useState, useRef, useEffect } from 'react'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

const SYSTEM_PROMPT = `너는 '모두의 계산기' 사이트의 AI 직원 이산수야.

역할: 사용자의 금융·세금·급여·건강·부동산 관련 계산 질문에 친절하고 명확하게 답변
기준: 2026년 한국 법령·세율 적용

사이트에 있는 계산기 목록 (경로 안내 가능):
- /salary : 연봉 실수령액
- /unemployment : 실업급여
- /retirement : 퇴직금
- /capital-gains : 양도소득세
- /loan : 대출 이자
- /minimum-wage : 최저시급/알바
- /insurance : 4대보험
- /year-end-tax : 연말정산
- /bmi : BMI 체질량지수
- /dday : D-day 카운터
- /weekly-holiday-pay : 주휴수당
- /vat : 부가세(VAT)
- /area-convert : 평수 변환
- /age-calc : 나이 계산
- /date-calc : 날짜 계산
- /exchange : 환율 계산
- /rent-conversion : 전월세 전환
- /savings : 적금 이자
- /compound-interest : 복리 계산
- /bmr : 기초대사량
- /body-fat : 체지방률
- /calorie : 칼로리 계산
- /pregnancy : 임신 주수
- /military-salary : 군인 월급
- /child-allowance : 아동수당
- /acquisition-tax : 취득세
- /gift-tax : 증여세
- /real-estate-fee : 부동산 중개수수료
- /parental-leave : 육아휴직급여
- /basic-pension : 기초연금
- /national-pension : 국민연금 수령액
- /electricity : 전기요금

답변 규칙:
- 관련 계산기가 있으면 경로를 알려줘 (예: 👉 /salary 계산기를 이용해보세요)
- 간단한 계산은 직접 해줘
- 3~5줄로 간결하게
- 이모지 적절히 사용해서 친근하게`

const QUICK_CHIPS = ['연봉 계산', '취득세 계산', '주휴수당', '육아휴직급여', '전기요금']

export default function IsansuChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요! 이산수예요 🤖\n\n연봉·세금·부동산·건강 계산 등 무엇이든 물어보세요!',
      isGreeting: true,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')

    const userMsg = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // 인사 메시지 제외하고 Gemini context 구성
      const history = messages.filter(m => !m.isGreeting)
      const contents = [
        ...history.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        { role: 'user', parts: [{ text: msg }] },
      ]

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
        }),
      })
      const data = await res.json()
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        '죄송해요, 잠시 후 다시 시도해주세요. 😅'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '연결 오류가 발생했어요. 잠시 후 다시 시도해주세요. 😅' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <aside
      className="hidden xl:flex flex-col w-[360px] shrink-0 sticky top-16 self-start"
      style={{ height: 'calc(100vh - 64px)', borderLeft: '1px solid #e5e7eb' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 shrink-0">
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-lg shrink-0">
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm leading-tight">이산수</div>
          <div className="text-xs text-slate-400 leading-tight">AI 계산 어시스턴트</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-green-400">온라인</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm shrink-0">
                🤖
              </div>
            )}
            <div
              className={`max-w-[230px] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words
                ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                  <div
                    key={delay}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="px-3 py-2 flex gap-1.5 flex-wrap bg-white border-t border-gray-100 shrink-0">
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => send(chip)}
            disabled={loading}
            className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full
                       hover:bg-blue-100 transition-colors disabled:opacity-40"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="이산수에게 물어보세요..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center
                       hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 text-base"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-gray-300 text-center mt-2">Enter로 전송</p>
      </div>
    </aside>
  )
}

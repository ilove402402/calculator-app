import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getRequests, getGenerated, saveGenerated, updateRequestStatus } from '../utils/storage'

const ADMIN_ID = 'admin'
const ADMIN_PASSWORD = 'admin1234'
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

const GENERATION_PROMPT = (name, description, category) => `당신은 계산기 JSON 스펙 생성 전문가입니다.
아래 형식의 JSON만 응답하세요. 마크다운, 설명, 코드블록 없이 순수 JSON만 응답하세요.

{
  "icon": "관련 이모지 1개",
  "description": "한 줄 설명 (20자 이내)",
  "inputs": [
    {
      "id": "camelCase영문변수명",
      "label": "한국어 라벨",
      "type": "number 또는 select 또는 date",
      "unit": "원/년/개월 등 (없으면 생략)",
      "placeholder": "예시 숫자값",
      "options": ["옵션1", "옵션2"]
    }
  ],
  "formula": "function calculate(inputs) {\\n  const price = Number(inputs.price) || 0;\\n  return { tax: price * 0.04 };\\n}",
  "outputs": [
    {
      "id": "결과변수명",
      "label": "결과 라벨",
      "format": "won 또는 number 또는 percent",
      "highlight": true
    }
  ]
}

계산기 요청:
- 이름: ${name}
- 설명: ${description || '없음'}
- 카테고리: ${category}

규칙:
1. formula는 반드시 순수 자바스크립트 (외부 라이브러리 금지)
2. 2026년 한국 기준 세율/법령 사용
3. inputs 값은 문자열로 오므로 Number() 변환 필수, 빈 값은 || 0 처리
4. options 필드는 type이 select일 때만 포함
5. highlight: true 는 가장 중요한 결과 1~2개만
6. 모든 출력값은 formula의 return 객체 key와 일치해야 함`

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative">
      <button onClick={copy}
        className="absolute top-2 right-2 text-xs px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors">
        {copied ? '복사됨 ✓' : '복사'}
      </button>
      <pre className="bg-slate-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto max-h-64 font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [requests, setRequests] = useState([])
  const [generated, setGenerated] = useState([])
  const [generating, setGenerating] = useState(null)
  const [preview, setPreview] = useState({})
  const [error, setError] = useState({})
  const [addStatus, setAddStatus] = useState({})

  useEffect(() => {
    if (authed) {
      setRequests(getRequests())
      setGenerated(getGenerated())
    }
  }, [authed])

  function login() {
    if (id === ADMIN_ID && pw === ADMIN_PASSWORD) { setAuthed(true); setLoginError(false) }
    else { setLoginError(true) }
  }

  async function generate(req) {
    if (!GEMINI_KEY) { alert('VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다.'); return }
    setGenerating(req.id)
    setError(p => ({ ...p, [req.id]: null }))
    setPreview(p => ({ ...p, [req.id]: null }))

    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: GENERATION_PROMPT(req.name, req.description, req.category) }]
          }],
          generationConfig: { temperature: 0.3 },
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody?.error?.message || `API 오류 (${res.status})`)
      }

      const data = await res.json()
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
      const spec = JSON.parse(cleaned)
      spec.name = req.name

      setPreview(p => ({ ...p, [req.id]: { spec, raw: cleaned } }))
    } catch (e) {
      setError(p => ({ ...p, [req.id]: e.message }))
    } finally {
      setGenerating(null)
    }
  }

  function addToSite(req) {
    const p = preview[req.id]
    if (!p) return
    const calc = saveGenerated({ requestId: req.id, name: req.name, spec: p.spec })
    updateRequestStatus(req.id, 'generated', calc.id)
    setGenerated(getGenerated())
    setRequests(getRequests())
    setAddStatus(p => ({ ...p, [req.id]: calc.path }))
  }

  if (!authed) {
    return (
      <Layout>
        <div className="max-w-sm mx-auto px-4 py-24">
          <div className="calc-card text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">이산수 관리자</h1>
            <p className="text-sm text-gray-400 mb-6">관리자 계정으로 로그인하세요</p>
            <input
              type="text"
              value={id}
              onChange={e => { setId(e.target.value); setLoginError(false) }}
              onKeyDown={e => e.key === 'Enter' && login()}
              className={`input-field mb-3 ${loginError ? 'border-red-400' : ''}`}
              placeholder="아이디"
              autoFocus
            />
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setLoginError(false) }}
              onKeyDown={e => e.key === 'Enter' && login()}
              className={`input-field mb-3 ${loginError ? 'border-red-400' : ''}`}
              placeholder="비밀번호"
            />
            {loginError && <p className="text-red-500 text-sm mb-3">아이디 또는 비밀번호가 틀렸습니다</p>}
            <button onClick={login}
              className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors">
              로그인
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const pending = requests.filter(r => r.status === 'pending' || r.status === 'generating')
    .sort((a, b) => b.votes - a.votes)
  const done = requests.filter(r => r.status === 'generated' || r.status === 'live')
    .sort((a, b) => b.votes - a.votes)

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold">이산수 관리자 패널</h1>
              <p className="text-slate-400 text-sm">요청 {requests.length}개 · 생성됨 {generated.length}개</p>
            </div>
          </div>
          <Link to="/request" className="text-sm text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded-full transition-colors">
            요청 페이지 →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Gemini 상태 */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${GEMINI_KEY ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <span className="text-lg">{GEMINI_KEY ? '✅' : '❌'}</span>
          <div className="flex-1">
            <p className={`text-sm font-semibold ${GEMINI_KEY ? 'text-green-700' : 'text-red-700'}`}>
              {GEMINI_KEY ? 'Gemini API 연결됨' : 'Gemini API 키 없음'}
            </p>
            <p className="text-xs text-gray-500">
              {GEMINI_KEY
                ? `키: ${GEMINI_KEY.slice(0, 6)}${'*'.repeat(10)} · gemini-2.5-flash 모델 사용`
                : '.env 파일에 VITE_GEMINI_API_KEY를 추가하세요'}
            </p>
          </div>
          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border">Google Gemini</span>
        </div>

        {/* 대기 중인 요청 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            대기 중인 요청 <span className="text-sm font-normal text-gray-400">({pending.length}개 · 투표순)</span>
          </h2>

          {pending.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl">
              대기 중인 요청이 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map(req => (
                <div key={req.id} className="calc-card">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{req.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          {req.votes}명 요청
                        </span>
                      </div>
                      {req.description && <p className="text-sm text-gray-500 mt-1">{req.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">카테고리: {req.category}</p>
                    </div>
                    <button
                      onClick={() => generate(req)}
                      disabled={generating === req.id || !GEMINI_KEY}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl
                                 text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {generating === req.id ? (
                        <><span className="animate-spin">⟳</span> 생성 중...</>
                      ) : '🤖 이산수가 생성'}
                    </button>
                  </div>

                  {error[req.id] && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      ❌ 오류: {error[req.id]}
                    </div>
                  )}

                  {preview[req.id] && (
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">생성된 계산기 미리보기</p>
                        <div className="flex items-center gap-2">
                          {addStatus[req.id] ? (
                            <Link to={addStatus[req.id]}
                              className="text-sm text-green-600 font-semibold hover:underline">
                              ✅ 추가됨 → 바로가기
                            </Link>
                          ) : (
                            <button
                              onClick={() => addToSite(req)}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                            >
                              ✅ 사이트에 추가
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 스펙 요약 */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">{preview[req.id].spec.icon}</div>
                          <div className="text-xs text-gray-500">{preview[req.id].spec.name}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="text-xs font-semibold text-gray-500 mb-1">입력 {preview[req.id].spec.inputs?.length}개</div>
                          {preview[req.id].spec.inputs?.map(inp => (
                            <div key={inp.id} className="text-xs text-gray-600">· {inp.label}</div>
                          ))}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="text-xs font-semibold text-gray-500 mb-1">출력 {preview[req.id].spec.outputs?.length}개</div>
                          {preview[req.id].spec.outputs?.map(out => (
                            <div key={out.id} className="text-xs text-gray-600">· {out.label}</div>
                          ))}
                        </div>
                      </div>

                      <CodeBlock code={JSON.stringify(preview[req.id].spec, null, 2)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 생성 완료된 계산기 */}
        {generated.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              생성 완료된 계산기 <span className="text-sm font-normal text-gray-400">({generated.length}개)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {generated.map(calc => (
                <Link key={calc.id} to={calc.path}
                  className="calc-card hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{calc.spec.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {calc.name}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(calc.createdAt).toLocaleDateString('ko-KR')} 생성</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                    <span>🤖</span> 이산수 자동 생성
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

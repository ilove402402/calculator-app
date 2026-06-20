import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { addRequest, getRequests, voteRequest, hasVoted } from '../utils/storage'

const CATEGORIES = [
  { slug: 'salary-labor', name: '💼 급여/노동' },
  { slug: 'real-estate',  name: '🏠 부동산/세금' },
  { slug: 'finance',      name: '💰 금융/재테크' },
  { slug: 'life-welfare', name: '👶 생활/복지' },
  { slug: 'health',       name: '❤️ 건강' },
  { slug: 'convenience',  name: '🧮 생활편의' },
]

function RequestCard({ req, onVote }) {
  const voted = hasVoted(req.id)
  const statusMap = {
    pending: { label: '검토 중', color: 'bg-gray-100 text-gray-500' },
    generating: { label: '생성 중 🤖', color: 'bg-blue-100 text-blue-600' },
    generated: { label: '생성 완료 ✅', color: 'bg-green-100 text-green-600' },
    live: { label: '서비스 중 🎉', color: 'bg-purple-100 text-purple-600' },
  }
  const status = statusMap[req.status] || statusMap.pending

  return (
    <div className="calc-card flex items-start gap-4">
      {/* 투표 */}
      <button
        onClick={() => onVote(req.id)}
        disabled={voted}
        className={`flex flex-col items-center min-w-[52px] py-2 px-3 rounded-xl border-2 transition-all
          ${voted
            ? 'border-blue-300 bg-blue-50 text-blue-600 cursor-default'
            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
          }`}
      >
        <span className="text-lg leading-none">{voted ? '▲' : '△'}</span>
        <span className="text-sm font-bold mt-0.5">{req.votes}</span>
      </button>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-gray-800">{req.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        {req.description && (
          <p className="text-sm text-gray-500 mt-1">{req.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400">
            {CATEGORIES.find(c => c.slug === req.category)?.name || req.category}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">
            {new Date(req.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
        {req.status === 'generated' && req.generatedId && (
          <Link
            to={`/dynamic/${req.generatedId}`}
            className="inline-block mt-2 text-xs text-blue-600 hover:underline font-medium"
          >
            → 계산기 바로가기
          </Link>
        )}
      </div>
    </div>
  )
}

export default function RequestPage() {
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({ name: '', description: '', category: 'salary-labor' })
  const [submitted, setSubmitted] = useState(false)
  const [sort, setSort] = useState('votes')

  useEffect(() => {
    setRequests(getRequests())
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    addRequest(form)
    setRequests(getRequests())
    setForm({ name: '', description: '', category: 'salary-labor' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  function handleVote(id) {
    voteRequest(id)
    setRequests(getRequests())
  }

  const sorted = [...requests].sort((a, b) =>
    sort === 'votes' ? b.votes - a.votes : new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-bold mb-2">이산수에게 요청하기</h1>
          <p className="text-slate-300">원하는 계산기를 요청하면 이산수가 검토 후 빠르게 추가합니다</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* 요청 폼 */}
        <div className="calc-card mb-8">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            ✏️ 새 계산기 요청
          </h2>
          {submitted && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
              🤖 요청이 접수되었습니다! 이산수가 검토 후 추가할게요.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                계산기 이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field"
                placeholder="예: 취득세 계산기, 군인 월급 계산기"
                maxLength={30}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">설명 (선택)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="input-field resize-none h-20"
                placeholder="어떤 기능이 필요한지 자세히 적어주세요"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">카테고리</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="input-field"
              >
                {CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={!form.name.trim()}
              className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold
                         hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              🤖 이산수에게 요청 보내기
            </button>
          </form>
        </div>

        {/* 요청 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">
              전체 요청 <span className="text-gray-400 font-normal text-sm">({requests.length}개)</span>
            </h2>
            <div className="flex gap-2">
              {[['votes', '인기순'], ['date', '최신순']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSort(val)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    sort === val ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>아직 요청이 없습니다. 첫 번째 요청을 보내보세요!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map(req => (
                <RequestCard key={req.id} req={req} onVote={handleVote} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

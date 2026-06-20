import { useState } from 'react'

export default function IsansuModal({ onClose, categoryName }) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!text.trim()) return
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                🤖
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">이산수에게 요청하기</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {categoryName ? `${categoryName} 카테고리` : ''}에 원하는 계산기를 알려주세요
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-gray-500 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="어떤 계산기가 필요하신가요?&#10;(예: 전기요금 계산기, 건강보험료 계산기...)"
              className="w-full border border-gray-200 rounded-xl p-4 text-sm h-28 resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="w-full mt-3 py-3 bg-blue-600 text-white rounded-xl font-semibold
                         hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              🤖 이산수에게 요청 보내기
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              이산수가 요청을 검토하고 빠르게 반영합니다
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🤖</div>
            <div className="text-xl font-bold text-gray-800 mb-2">요청이 접수되었습니다!</div>
            <p className="text-sm text-gray-500 mb-1">이산수가 열심히 분석해서</p>
            <p className="text-sm text-gray-500 mb-6">빠르게 추가할게요 😊</p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

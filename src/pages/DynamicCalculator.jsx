import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import CalcPageLayout from '../components/CalcPageLayout'
import { getGenerated } from '../utils/storage'
import { formatWon } from '../utils/calculations'

function formatValue(value, format) {
  if (value === undefined || value === null || value === '') return '-'
  if (format === 'won') return formatWon(Number(value))
  if (format === 'percent') return `${Number(value).toFixed(1)}%`
  if (format === 'number') return Number(value).toLocaleString('ko-KR')
  return String(value)
}

export default function DynamicCalculator() {
  const { id } = useParams()
  const [entry, setEntry] = useState(null)
  const [inputs, setInputs] = useState({})
  const [result, setResult] = useState(null)
  const [calcError, setCalcError] = useState(null)

  useEffect(() => {
    const found = getGenerated().find(c => c.id === id)
    if (found) {
      setEntry(found)
      const init = {}
      found.spec.inputs.forEach(inp => {
        init[inp.id] = inp.placeholder ?? (inp.type === 'select' ? inp.options?.[0] ?? '' : '')
      })
      setInputs(init)
    }
  }, [id])

  useEffect(() => {
    if (!entry?.spec?.formula) return
    try {
      // eslint-disable-next-line no-new-func
      const calcFn = new Function('return (' + entry.spec.formula + ')')()
      setResult(calcFn(inputs))
      setCalcError(null)
    } catch (e) {
      setCalcError(e.message)
      setResult(null)
    }
  }, [inputs, entry])

  if (!entry) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center text-gray-400">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-xl font-bold text-gray-600 mb-2">계산기를 찾을 수 없습니다</p>
          <Link to="/" className="text-blue-600 hover:underline text-sm mt-2 block">홈으로 돌아가기</Link>
        </div>
      </Layout>
    )
  }

  const { spec } = entry

  return (
    <CalcPageLayout
      id={`dynamic-${id}`}
      icon={spec.icon || '🤖'}
      title={spec.name}
      description={spec.description}
      badge="🤖 이산수 생성"
    >
      {/* 입력 */}
      <div className="calc-card mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">입력</h2>
        <div className="space-y-4">
          {spec.inputs.map(inp => (
            <div key={inp.id}>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">{inp.label}</label>
              {inp.type === 'select' ? (
                <select
                  value={inputs[inp.id] ?? ''}
                  onChange={e => setInputs(p => ({ ...p, [inp.id]: e.target.value }))}
                  className="input-field"
                >
                  {(inp.options || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input
                    type={inp.type === 'date' ? 'date' : 'number'}
                    value={inputs[inp.id] ?? ''}
                    onChange={e => setInputs(p => ({ ...p, [inp.id]: e.target.value }))}
                    className={`input-field ${inp.unit ? 'pr-10' : ''}`}
                    placeholder={inp.placeholder}
                    min={inp.min}
                    step={inp.step}
                  />
                  {inp.unit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {inp.unit}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {calcError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ⚠️ 계산 오류: {calcError}
        </div>
      ) : result ? (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700">계산 결과</h2>
          {spec.outputs.map(out => (
            out.highlight ? (
              <div key={out.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">{out.label}</div>
                <div className="text-4xl font-bold text-blue-600">
                  {formatValue(result[out.id], out.format)}
                </div>
              </div>
            ) : (
              <div key={out.id} className="flex justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <span className="text-sm text-gray-600">{out.label}</span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatValue(result[out.id], out.format)}
                </span>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          값을 입력하면 자동으로 계산됩니다
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
        <span>🤖</span>
        <span>이 계산기는 이산수 AI가 자동 생성했습니다 · {new Date(entry.createdAt).toLocaleDateString('ko-KR')} 추가</span>
      </div>
    </CalcPageLayout>
  )
}

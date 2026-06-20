import { Link } from 'react-router-dom'
import Layout from './Layout'
import RelatedCalculators from './RelatedCalculators'

export default function CalcPageLayout({ id, icon, title, description, badge, children }) {
  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('링크가 복사되었습니다!'))
        .catch(() => alert('공유 링크: ' + window.location.href))
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-blue-600 transition-colors">홈</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{title}</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2.5 py-1 rounded-full">
              ⚡ 자동계산
            </span>
            {badge && <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-full">{badge}</span>}
          </div>
        </div>

        {/* Content */}
        {children}

        {/* Share */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-2.5 border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <span>🔗</span> 결과 공유하기
          </button>
        </div>

        <RelatedCalculators currentId={id} />
      </div>
    </Layout>
  )
}

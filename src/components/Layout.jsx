import Header from './Header'
import Footer from './Footer'
import IsansuChat from './IsansuChat'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex">
        <div className="w-full max-w-[1600px] mx-auto flex items-start">
          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* 이산수 채팅 사이드바 (xl 이상에서만 표시) */}
          <IsansuChat />
        </div>
      </div>

      <Footer />
    </div>
  )
}

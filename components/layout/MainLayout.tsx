import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  pageTitle: string
  pageDescription?: string
}

export function MainLayout({ children, pageTitle, pageDescription }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} description={pageDescription} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

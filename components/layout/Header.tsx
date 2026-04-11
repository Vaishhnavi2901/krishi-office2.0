'use client'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm md:text-base mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}

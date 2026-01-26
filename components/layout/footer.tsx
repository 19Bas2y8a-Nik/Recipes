import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 px-4 md:flex-row">
        <div className="text-sm text-muted-foreground">
          © {currentYear} Recipes. Все права защищены.
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/policy"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Политика
          </Link>
          <Link
            href="/contacts"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Контакты
          </Link>
        </nav>
      </div>
    </footer>
  )
}

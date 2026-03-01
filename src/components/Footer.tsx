export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-white/[0.08] px-4 py-10">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p className="m-0">&copy; {year} AI Slop. All rights reserved.</p>
        <p className="m-0 text-muted-light">Built with TanStack Start</p>
      </div>
    </footer>
  )
}

export default Footer

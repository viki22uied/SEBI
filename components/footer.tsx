import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-16 px-6 md:px-20 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">SEBI Guardian AI</span>
          </div>

          {/* Links */}
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground luxury-transition">
              About
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground luxury-transition">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground luxury-transition">
              Contact
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground luxury-transition">
              Documentation
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-muted-foreground text-sm">© 2025 SEBI Guardian AI. Built with precision and purpose.</p>
        </div>
      </div>
    </footer>
  )
}

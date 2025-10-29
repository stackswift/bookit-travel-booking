import { Link } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="glass-strong border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-smooth"></div>
            <div className="relative bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl group-hover:scale-110 transition-bounce shadow-primary">
              <Compass className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              BookIt
            </span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="relative text-sm font-semibold text-foreground/80 hover:text-primary transition-smooth group">
            <span>Experiences</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/about" className="relative text-sm font-semibold text-foreground/80 hover:text-secondary transition-smooth group">
            <span>About</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-accent group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/contact" className="relative text-sm font-semibold text-foreground/80 hover:text-accent transition-smooth group">
            <span>Contact</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

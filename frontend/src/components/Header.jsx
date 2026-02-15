import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Header({ isAuthenticated, onLogout }) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 flex items-center justify-between bg-cosmic-black/80 backdrop-blur-sm border-b border-cosmic-border/50"
    >
      <Link to="/" className="font-display font-semibold text-lg tracking-widest uppercase text-cosmic-white hover:text-white transition-colors">
        Cosmic Watch
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/#mission" className="text-sm uppercase tracking-wider text-cosmic-muted hover:text-white transition-colors">
          Mission
        </Link>
        <Link to="/#monitoring" className="text-sm uppercase tracking-wider text-cosmic-muted hover:text-white transition-colors">
          Live
        </Link>
        <Link to="/#risk" className="text-sm uppercase tracking-wider text-cosmic-muted hover:text-white transition-colors">
          Risk
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-sm uppercase tracking-wider text-cosmic-muted hover:text-white transition-colors">
              Dashboard
            </Link>
            <button type="button" onClick={onLogout} className="text-sm uppercase tracking-wider text-cosmic-muted hover:text-white transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm uppercase tracking-wider text-cosmic-muted hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="border border-cosmic-border px-4 py-2 text-sm uppercase tracking-wider hover:border-white hover:text-white transition-colors">
              Register
            </Link>
          </>
        )}
      </nav>
    </motion.header>
  );
}

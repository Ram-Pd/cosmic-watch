import { motion } from 'framer-motion';

export function Button({ children, variant = 'outline', className = '', as: Component = 'button', ...props }) {
  const base = 'inline-block px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200';
  const variants = {
    outline: 'border border-cosmic-border text-cosmic-white hover:border-white hover:text-white',
    primary: 'border border-white bg-white/5 text-white hover:bg-white/10',
    ghost: 'text-cosmic-muted hover:text-white',
  };
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Component className={`${base} ${variants[variant]} ${className}`} {...props}>
        {children}
      </Component>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export function SectionWrapper({ id, children, className = '', ...props }) {
  return (
    <motion.section
      id={id}
      className={`min-h-screen flex flex-col justify-center py-24 px-6 md:px-12 lg:px-24 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

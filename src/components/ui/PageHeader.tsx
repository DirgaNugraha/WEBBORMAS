import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
<div className="relative overflow-hidden bg-white border-b border-slate-200 pt-32 pb-20 md:pt-36 md:pb-24">
<div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-[0.03]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-100/40 rounded-full blur-3xl" />
      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 mb-5">
              {icon}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{title}</h1>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </motion.div>
      </div>
    </div>
  );
}

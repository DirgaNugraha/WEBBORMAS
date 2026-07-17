import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-3xl',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="
            fixed inset-0 z-[60]
            bg-black/60 backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative
              bg-white dark:bg-slate-900
              rounded-2xl
              shadow-2xl
              w-full
              ${maxWidth}
              max-h-[90vh]
              overflow-y-auto
            `}
          >
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                w-10 h-10
                rounded-full
                bg-black/40
                backdrop-blur-md
                flex items-center justify-center
                text-white
                hover:bg-black/60
                transition-colors
                z-20
              "
            >
              <X className="w-5 h-5" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
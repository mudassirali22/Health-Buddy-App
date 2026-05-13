import { AlertTriangle, Info, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  type = "danger" 
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: <AlertTriangle className="text-red-500" size={16} />,
      bg: "bg-red-50",
      btn: "bg-red-600 hover:bg-red-700",
      accent: "text-red-600"
    },
    warning: {
      icon: <AlertTriangle className="text-amber-500" size={16} />,
      bg: "bg-amber-50",
      btn: "bg-amber-500 hover:bg-amber-600",
      accent: "text-amber-600"
    },
    info: {
      icon: <Info className="text-emerald-500" size={16} />,
      bg: "bg-emerald-50",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      accent: "text-emerald-600"
    },
    logout: {
      icon: <LogOut className="text-red-500" size={16} />,
      bg: "bg-red-50",
      btn: "bg-red-600 hover:bg-red-700",
      accent: "text-red-600"
    }
  };

  const theme = themes[type] || themes.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-center items-start pt-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100 flex items-center p-2 pl-4 gap-4 max-w-md w-full mx-4 overflow-hidden"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
               type === 'logout' || type === 'danger' ? 'bg-red-500' : 'bg-emerald-500'
            }`}></div>
            
            <div className="flex-1 flex items-center gap-3">
              <div className={`w-8 h-8 ${theme.bg} rounded-lg flex items-center justify-center shrink-0`}>
                {theme.icon}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-tight text-slate-800 leading-none">{title}</p>
                <p className="text-[9px] font-bold text-slate-500 mt-1 leading-normal max-w-[220px]">{message}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={onCancel}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm}
                className={`px-4 py-2 ${theme.btn} text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 shadow-lg `}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

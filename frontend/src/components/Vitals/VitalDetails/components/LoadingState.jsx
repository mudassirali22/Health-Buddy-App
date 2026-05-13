import { Activity } from "lucide-react";

const LoadingState = () => {
    return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Loading Health Intelligence...</p>
    </div>
    );
  }

export default LoadingState;
import { Activity} from "lucide-react";


const LoadingState = () => {
    return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center overflow-hidden">
      <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-green-400 border-b-transparent rounded-full animate-spin animate-reverse absolute top-2 left-1/2 -translate-x-1/2"></div>
            <Activity className="absolute inset-0 m-auto text-emerald-600 text-2xl animate-pulse" />
          </div>
          <div className="space-y-3">
            <p className="text-xl text-gray-700 font-medium">
              Loading your health journey...
            </p>
          </div>
          <div className="mt-6 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
      </div>
    </div>
    );
  }

export default LoadingState;
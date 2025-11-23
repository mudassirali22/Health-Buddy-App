import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Brain,
  Shield,
  LineChart,
  Clock,
  CheckCircle,
  User,
  Activity,
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Health Analysis",
      description: "Real-time insights from your medical reports with 98% accuracy",
      stats: "50K+ Reports Analyzed",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Smart Vitals Tracking",
      description: "Monitor blood pressure, sugar levels, and heart rate trends",
      stats: "10K+ Active Trackers",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Health Analytics",
      description: "Visual progress tracking with predictive health insights",
      stats: "95% User Satisfaction",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Health Vault",
      description: "Military-grade encryption for your sensitive health data",
      stats: "100% Data Protected",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const quickStats = [
    { icon: <User className="w-4 h-4" />, value: "10,000+", label: "Active Users" },
    { icon: <CheckCircle className="w-4 h-4" />, value: "98%", label: "Accuracy Rate" },
    { icon: <Clock className="w-4 h-4" />, value: "24/7", label: "AI Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 text-sm overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-300 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* Glass Morphism Header */}
      <div className={`relative bg-white/90 backdrop-blur-md border-b border-emerald-100/50 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm sm:text-md h-20">
            <NavLink to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  HealthBuddy
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 p-0.1 sm:-mt-1">Your Smart Friend for  Health</p>
              </div>
            </NavLink>

            <div className="items-center ">
              <NavLink to="/register">
                <p className='text-gray-600 text-xs sm:text-sm  sm:block'>Don't have an account?</p>
              </NavLink>
              <NavLink
                to="/register"
                className=" text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 sm:px-8  rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                Sign up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[80vh]">
          
          {/* Feature Showcase */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Main Hero Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-lg">
                <span className="text-emerald-700 text-sm font-medium">Welcome Back, Health Champion</span>
              </div>
              
              <div>
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Continue Your
                  <span className="text-transparent bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text block">Health Journey</span>
                </h2>
                <p className="text-xl text-gray-600 mt-6 max-w-lg leading-relaxed">
                  Your AI health assistant has been monitoring trends and is ready with new insights.
                </p>
              </div>
            </div>

            {/* Interactive Feature Carousel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-10 px-10 shadow-2xl border border-emerald-100 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  {features[activeFeature].icon}
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">{features[activeFeature].title}</h3>
                  <p className="text-emerald-600 text-sm font-medium">{features[activeFeature].stats}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {features[activeFeature].description}
              </p>
              
              <div className="flex pt-8 gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      index === activeFeature 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 text-center hover:shadow-xl transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 text-white group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-gray-900 font-bold text-sm">{stat.value}</div>
                  <div className="text-gray-600 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/*Login Form */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl p-10 border border-emerald-200/50 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/50 to-cyan-50/50"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full -translate-y-20 translate-x-20 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-200/30 rounded-full translate-y-20 -translate-x-20 blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Form Header */}
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
                  <p className="text-gray-600 text-lg">Sign in to your account</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-sm font-bold">!</span>
                      </div>
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-3">
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-4 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 hover:border-emerald-300 focus:bg-white backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-4 pr-12 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 hover:border-emerald-300 focus:bg-white backdrop-blur-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Forgot Buttons */}
                  <div className="flex items-center justify-between">
                    <NavLink 
                      to="/forgot-password" 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 group"
                    >
                      Forgot password?
                    </NavLink>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-5 px-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="relative z-10">Accessing Health Dashboard...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Log in</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className=" text-emerald-700">Your health data is encrypted end-to-end</p>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="text-center pt-6 border-t border-emerald-200 mt-8">
                  <p className="text-gray-600">
                    New to HealthBuddy?
                    <NavLink
                      to="/register"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 group inline-flex items-center gap-1"
                    >
                      Start your health journey
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </NavLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
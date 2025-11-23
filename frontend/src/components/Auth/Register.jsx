import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle,
  Shield,
  Brain,
  BrainCircuit,
  Star,
  Activity
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return 'from-green-500 to-emerald-600';
    if (passwordStrength >= 50) return 'from-yellow-500 to-amber-600';
    if (passwordStrength >= 25) return 'from-orange-500 to-red-600';
    return 'from-gray-300 to-gray-400';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return 'Strong';
    if (passwordStrength >= 50) return 'Good';
    if (passwordStrength >= 25) return 'Weak';
    return 'Very Weak';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains number', met: /[0-9]/.test(formData.password) },
  ];

  const onboardingSteps = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up in 30 seconds",
      icon: <User className="w-5 h-5" />,
      status: "current"
    },
    {
      step: "02",
      title: "Setup Profile",
      description: "Tell us about your health",
      icon: <Activity className="w-5 h-5" />,
      status: "upcoming"
    },
    {
      step: "03",
      title: "Get AI Insights",
      description: "Start your health journey",
      icon: <Brain className="w-5 h-5" />,
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-gradient-to-r from-cyan-200 to-blue-300 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* Brand Header */}
      <div className={`bg-white/90 backdrop-blur-md border-b border-emerald-100/50 text-sm sm:text-md  transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <NavLink to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  HealthBuddy
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 p-0.1 sm:-mt-1">Your Smart Friend for Health</p>
              </div>
            </NavLink>
            
            <div className="items-center gap-4">
              <NavLink to='/login'>
              <p className="text-xs sm:text-sm text-gray-600  sm:block">
                Already joined us?
              </p>
              </NavLink>
              <NavLink
                to="/login"
                className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Side */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-lg">
                <span className="text-emerald-700 text-sm font-medium">Join 10,000+ Health Champions</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Start Your Health Journey
              </h3>
              <div className="pb-5">
                <p className="text-xl text-gray-600 mt-6 max-w-lg leading-relaxed">
                  Take control of your health with AI-powered insights, smart tracking, and personalized recommendations designed for your wellness journey.
                </p>
             </div>
              <div className="space-y-6">
                {onboardingSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                      step.status === 'current' 
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-md' 
                        : 'bg-gray-50/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      step.status === 'current'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-sm font-semibold ${
                          step.status === 'current' ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          STEP {step.step}
                        </span>
                        {step.status === 'current' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <h4 className={`font-semibold ${
                        step.status === 'current' ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Health Assistant</h3>
                    <p className="text-emerald-100 text-sm">Personalized insights from day one</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">Free Forever</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    4.9/5 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: "50K+", label: "Health Reports", color: "text-emerald-600" },
                { value: "98%", label: "Accuracy", color: "text-green-600" },
                { value: "24/7", label: "AI Support", color: "text-cyan-600" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl p-10 border border-emerald-200/50 relative overflow-hidden">
              {/* Form Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/50 to-cyan-50/50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                {/* Form Header */}
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/25">
                    <BrainCircuit className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Join HealthBuddy</h2>
                  <p className="text-gray-600 text-lg">Create your account in seconds</p>
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
                    {/* Name Field */}
                    <div className="space-y-3">
                      <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <User className="w-4 h-4 text-emerald-600" />
                        Full Name
                      </label>
                      <div className="relative group">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative group">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <div className="relative group">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm hover:shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      {formData.password && (
                        <div className="space-y-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Password strength</span>
                            <span className={`font-semibold ${
                              passwordStrength >= 75 ? 'text-green-600' :
                              passwordStrength >= 50 ? 'text-yellow-600' :
                              passwordStrength >= 25 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-500`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                          
                          {/* Password Requirements */}
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {passwordRequirements.map((req, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                {req.met ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
                                )}
                                <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                                  {req.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-3">
                      <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm hover:shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-5 px-6 rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="relative z-10">Creating Your Health Profile...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Sign up</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Terms Agreement */}
                  <p className="text-center text-sm text-gray-500">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </form>
                <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 text-center">
                  <div className="flex items-center justify-center gap-2  text-sm text-emerald-700">
                    <Shield className="w-5 h-5" />
                    <div>
                      <p className="text-md text-emerald-600">Your health data is encrypted end-to-end</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

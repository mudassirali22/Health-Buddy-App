import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  FileText,  
  Shield, 
  Star, 
  ArrowRight,
  Upload,
  BarChart3,
  Brain,
  Cpu,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowUpRight,
  Menu,
  X,
  Target,
  Dot,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Digital Health Reports",
      description: "Upload and store all your medical reports securely in one place with easy access anytime",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Vitals Tracking",
      description: "Monitor and track your vital signs, blood pressure, sugar levels, and other health metrics",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Report Analysis",
      description: "Get intelligent insights from your medical reports with our advanced AI analysis",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Health Analytics",
      description: "Get insights from your health data with visual charts and progress tracking",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Report Management",
      description: "Organize all your medical documents, lab reports, and prescriptions systematically",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Data Security",
      description: "Your health data is encrypted and protected with enterprise-grade security",
      gradient: "from-gray-500 to-slate-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Health Records", icon: <FileText className="w-6 h-6" /> },
    { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "98%", label: "User Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "24/7", label: "AI Analysis", icon: <Cpu className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Jessica Williams",
      role: "Diabetes Patient",
      content: "The AI analysis helped me understand my blood reports better than ever before",
      rating: 5,
    },
    {

      name: "Lisa Thompson",
      role: "Health Monitor User",
      content: "Finally, a health app that explains complex medical data in simple terms I can understand.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Regular User",
      content: "Finally, all my family's medical records in one secure place with smart AI analysis.",
      rating: 5,
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Upload Medical Reports",
      description: "Upload your lab reports, prescriptions, and medical documents securely",
      icon: <Upload className="w-6 h-6" />
    },
    {
      step: "02",
      title: "AI Analysis & Insights",
      description: "Our AI analyzes your reports and provides intelligent health insights",
      icon: <Brain className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Track & Monitor",
      description: "Monitor your health progress with AI-powered recommendations",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 overflow-hidden">
      {/* Animated Background*/}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-purple-200 to-indigo-300 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100/50 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center text-sm sm:text-md justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 hover:scale-105 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">HealthBuddy</span>
                <p className="text-xs sm:text-sm text-gray-600 p-0.1 sm:-mt-1">Your Smart Friend for Health</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 pl-3">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105">
                How it Works
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105">
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <NavLink 
                to="/login" 
                className="hidden md:block text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105"
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white  sm:px-6 pl-3 pr-3  py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Sign up
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> 
              </NavLink>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden sm:p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <NavLink 
                to="/login" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
            </div>
          </div>)}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 i">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-lg">
                  <span className="text-emerald-700 text-sm font-medium">AI-Powered Health Insights</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Smart Health
                  <span className="text-transparent bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text block"> With AI</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Manage medical reports, track vitals, and get AI-powered insights for better health decisions. Your intelligent health companion.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink 
                  to="/register" 
                  className="group bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                <div 
                  to="/features" 
                  className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <a href='#features'>Explore Features</a>
                </div>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full border-4 border-white shadow-lg"
                    ></div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">10,000+</span> users getting AI health insights
                </div>
              </div>
            </div>

            {/*Hero Visual */}
             <div className={`relative transition-all  duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/90 backdrop-blur-xl rounded-4xl p-10 shadow-3xl border border-emerald-200/50 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-blue-50/50 to-purple-50/50"></div>
                {/* AI Analysis Header */}
                <div className="relative  z-10 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Brain className="w-13 sm:w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">AI Health Analysis</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="sm:w-2 w-3 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-600 font-semibold">Live Analysis Active</span>
                          <div className="w-3 sm:w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                          <span className="text-gray-500 flex">Real-time Monitoring</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Capabilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 relative z-10">
                  {[
                    { 
                      icon: FileText, 
                      color: "purple", 
                      label: "Report AI", 
                      sublabel: "Medical Analysis",
                      status: "98% Accuracy",
                      statusColor: "text-green-600"
                    },
                    { 
                      icon: Activity, 
                      color: "green", 
                      label: "Vitals AI", 
                      sublabel: "Real-time Monitoring",
                      status: "Live Tracking",
                      statusColor: "text-blue-600"
                    },].map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xs font-semibold ${item.statusColor} bg-${item.color}-50 px-2 py-1 rounded-lg`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.sublabel}</div>
                    </div>
                  ))}
                </div>

                {/* AI Insights Panel */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-gray-200 mb-8 relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-800">AI Health Insights</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        label: "Blood Report Analysis", 
                        status: "Optimal", 
                        color: "text-green-600",
                        icon: <CheckCircle className='text-green-600'/>,
                        trend: "+5% improvement"
                      },
                      { 
                        label: "Vital Signs Monitoring", 
                        status: "Stable", 
                        color: "text-blue-600",
                        icon: <BarChart3 className='text-blue-600'/>,
                        trend: "Normal range"
                      },
                      { 
                        label: "Health Risk Assessment", 
                        status: "Low Risk", 
                        color: "text-emerald-600",
                        icon: <Shield/>,
                        trend: "AI Protected"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg sm:text-xl bg-green-100 rounded ">{item.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-700">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.trend}</div>
                          </div>
                        </div>
                        <span className={`font-semibold text-sm sm:text-md ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <NavLink 
                  to="/register" 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-4 sm:p-6 text-white text-center hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 block group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center space-x-4 relative z-10">
                    <span className="text-lg font-semibold">Start AI Health Analysis</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Stats Section */}
      <section className="py-1 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Features Section */}
      <section id="features" className="py-10 sm:py-20 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Health Management
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Smart features to manage your health with artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-2  sm:py-20 bg-gradient-to-br from-gray-50 to-emerald-50/50 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Smart Health in 3 Steps
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              From upload to AI insights - simple and powerful
            </p>
          </div>

          <div className="space-y-12 ">

            {howItWorks.map((item, index) => (
              <div 
                key={index}
                className={`flex flex-col lg:flex-row items-start lg:items-center space-y-8 lg:space-y-0 lg:space-x-12 relative ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                {/* Steps*/}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-emerald-500/25 relative z-10">
                    {item.step}
                  </div>
                  <div className="absolute -inset-4 bg-emerald-200 rounded-3xl blur-lg opacity-50 animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Testimonials Section */}
      <section id="testimonials" className=" py-10 sm:py-20 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Loved for AI Health Insights
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Users love our intelligent health analysis features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
               >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {testimonial.content}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-semibold">
                    {testimonial.name.toUpperCase().slice(0,2.)}
                  </div>  
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-emerald-600 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Ready for Smarter Health Management?
          </h2>
          <p className="text-emerald-100 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users getting AI-powered health insights with HealthBuddy
          </p>
          <div className="flex justify-center">
            <NavLink 
              to="/register" 
              className="bg-white text-emerald-600 px-30 py-5 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
            >
              Start  Today
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>
      </section>

      {/*Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900/30"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">HealthBuddy</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-8">
                Your AI-powered health companion for smart report analysis, vitals tracking, and intelligent health insights.
              </p>
              <div className="flex space-x-4">
                <a href='https://www.linkedin.com/in/mudassir-a-ba721830b' target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href='https://github.com/mudassirali22' target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <FaGithub className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-8">Features</h3>
              <ul className="space-y-4 cursor-pointer">
                {['AI Report Analysis', 'Vitals Tracking', 'Health Analytics', 'Report Management'].map((item) => (
                  <li key={item}>
                    <a className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-8">Support</h3>
              <ul className="space-y-4">
                <li>
                  <NavLink to="/login" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Login 
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Sign up
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-2 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              © {new Date().getFullYear()} HealthBuddy. A portfolio project by 
              <a href="https://www.linkedin.com/in/mudassir-a-ba721830b" target='_blank' className="text-emerald-600 hover:text-emerald-700 pl-2 underline">
               Mudassir Ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
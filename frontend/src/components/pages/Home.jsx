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
   ShieldCheck,
   Sparkles,
   Bell,
   Clock,
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
         icon: <Brain className="w-8 h-8" />,
         title: "AI Report Analysis",
         description: "Get intelligent, easy-to-understand insights from your clinical lab reports using advanced AI.",
         color: "text-emerald-600",
         bg: "bg-emerald-50"
      },
      {
         icon: <Activity className="w-8 h-8" />,
         title: "Smart Vitals Tracking",
         description: "Monitor blood pressure, heart rate, and sugar levels with interactive real-time charts.",
         color: "text-blue-600",
         bg: "bg-blue-50"
      },
      {
         icon: <Users className="w-8 h-8" />,
         title: "Family Management",
         description: "Add family members and track their health metrics in one unified dashboard.",
         color: "text-purple-600",
         bg: "bg-purple-50"
      },
      {
         icon: <Cpu className="w-8 h-8" />,
         title: "AI Symptom Checker",
         description: "Describe your symptoms and get immediate AI-powered health guidance and preliminary analysis.",
         color: "text-orange-600",
         bg: "bg-orange-50"
      },
      {
         icon: <ShieldCheck className="w-8 h-8" />,
         title: "Secure Health Vault",
         description: "Your sensitive medical data is encrypted and protected with enterprise-grade security protocols.",
         color: "text-slate-700",
         bg: "bg-slate-100"
      },
      {
         icon: <TrendingUp className="w-8 h-8" />,
         title: "Health Analytics",
         description: "Visualize long-term health trends and progress with professional medical-grade analytics.",
         color: "text-pink-600",
         bg: "bg-pink-50"
      }
   ];

   const stats = [
      { number: "50K+", label: "Health Records", icon: <FileText className="w-6 h-6" /> },
      { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
      { number: "98%", label: "User Satisfaction", icon: <Star className="w-6 h-6" /> },
      { number: "24/7", label: "Smart Monitoring", icon: <Activity className="w-6 h-6" /> }
   ];

   const testimonials = [
      {
         name: "Jessica Williams",
         role: "Diabetes Patient",
         content: "The AI analysis helped me understand my blood reports, and the vitals tracking keeps my sugar levels in check.",
         rating: 5,
      },
      {
         name: "Lisa Thompson",
         role: "Health Monitor User",
         content: "The medicine reminders are a lifesaver. I never miss a dose anymore, and the family sync is amazing.",
         rating: 5,
      },
      {
         name: "Sarah Johnson",
         role: "Caregiver",
         content: "Finally, I can monitor my elderly parents' health remotely. The real-time vitals and reports give me peace of mind.",
         rating: 5,
      }
   ];

   const howItWorks = [
      {
         step: "01",
         title: "Sync Your Data",
         description: "Upload reports or connect vitals tracking for a complete health overview",
         icon: <Activity className="w-6 h-6" />
      },
      {
         step: "02",
         title: "AI Analysis",
         description: "Our intelligent engine processes your data for deep clinical insights",
         icon: <Brain className="w-6 h-6" />
      },
      {
         step: "03",
         title: "Take Control",
         description: "Track family health, and monitor progress in real-time",
         icon: <Target className="w-6 h-6" />
      }
   ];

   return (
      <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
         {/* Navigation */}
         <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-white/90 backdrop-blur-md border-b border-slate-100`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg ">
                     <Heart size={20} fill="currentColor" />
                  </div>
                  <span className="text-2xl font-black text-slate-800 tracking-tighter">HealthBuddy</span>
               </div>

               <div className="hidden md:flex items-center gap-8">
                  {['Features', 'Process', 'Reviews'].map((item) => (
                     <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                        {item}
                     </a>
                  ))}
               </div>

               <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-4">
                     <NavLink to="/auth" state={{ isLogin: true }} className="text-sm font-bold text-slate-600 hover:text-emerald-600 px-2 transition-colors">
                        Login
                     </NavLink>
                     <NavLink to="/auth" state={{ isLogin: false }} className="bg-emerald-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg  active:scale-95 flex items-center gap-2">
                        Get Started <ArrowRight size={16} />
                     </NavLink>
                  </div>
                  <button 
                     onClick={() => setIsMenuOpen(true)}
                     className="md:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600"
                  >
                     <Menu size={20} />
                  </button>
               </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
               <div className="absolute inset-0 bg-slate-800/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
               <div className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-lg transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                  <div className="p-6 flex flex-col h-full">
                     <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-2">
                           <Heart className="text-emerald-600" size={24} fill="currentColor" />
                           <span className="font-black text-slate-800 tracking-tighter">HealthBuddy</span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                           <X size={20} />
                        </button>
                     </div>

                     <div className="space-y-4 flex-1">
                        {['Features', 'Process', 'Reviews'].map((item) => (
                           <a 
                              key={item} 
                              href={`#${item.toLowerCase()}`} 
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-600 font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                           >
                              {item}
                              <ArrowRight size={16} />
                           </a>
                        ))}
                     </div>

                     <div className="pt-6 border-t border-slate-100 space-y-3">
                        <NavLink to="/auth" state={{ isLogin: true }} className="flex items-center justify-center w-full py-4 rounded-2xl text-slate-600 font-black text-xs uppercase tracking-widest bg-slate-50">
                           Login
                        </NavLink>
                        <NavLink to="/auth" state={{ isLogin: false }} className="flex items-center justify-center w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest bg-emerald-600 shadow-md ">
                           Sign Up
                        </NavLink>
                     </div>
                  </div>
               </div>
            </div>
         </nav>

         {/* Hero Section */}
         <section className="relative pt-25 pb-15 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
               <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                     Manage Your Health <br />
                     <span className="text-emerald-600">With Intelligence.</span>
                  </h1>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                     Take control of your wellness with AI-powered report analysis, real-time vitals tracking, and personalized health insights designed for your journey.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <NavLink to="/auth" state={{ isLogin: false }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-md  active:scale-95 flex items-center gap-2">
                        Start Today <ArrowRight size={20} />
                     </NavLink>
                     <a href="#features" className="bg-white border-2 border-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold text-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95">
                        Learn More
                     </a>
                  </div>
               </div>

                <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {/* Dashboard Mockup - Compact Version */}
                  <div className="relative max-w-full sm:max-w-lg mx-auto bg-slate-50/50 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-md ">
                     {/* Header Section */}
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                           <Brain size={24} />
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none">AI Health Analysis</h4>
                           <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                 <p className="text-[10px] font-bold text-emerald-600 uppercase">Live Active</p>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                 <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                 <p className="text-[10px] font-bold uppercase tracking-tight">Real-time</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Top Grid Cards */}
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Card 1: Report AI */}
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative group hover:border-purple-200 transition-all duration-300">
                           <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-md ">
                              <FileText size={18} />
                           </div>
                           <div className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider">
                              98% Acc
                           </div>
                           <h5 className="text-base font-black text-slate-800">Report AI</h5>
                           <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Medical Analysis</p>
                        </div>

                        {/* Card 2: Vitals AI */}
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative group hover:border-emerald-200 transition-all duration-300">
                           <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-md ">
                              <Activity size={18} />
                           </div>
                           <div className="absolute top-4 right-4 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-wider">
                              Live
                           </div>
                           <h5 className="text-base font-black text-slate-800">Vitals AI</h5>
                           <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Monitoring</p>
                        </div>
                     </div>

                     {/* AI Health Insights Bottom Card */}
                     <div className="bg-white/60 rounded-[2rem] p-5 border border-slate-100">
                        <div className="flex items-center gap-2 mb-5">
                           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm border border-slate-100">
                              <Target size={16} />
                           </div>
                           <h5 className="text-lg font-black text-slate-800 tracking-tight">Health Insights</h5>
                        </div>

                        <div className="space-y-3">
                           {/* Insight 1 */}
                           <div className="bg-white p-3.5 rounded-xl border border-slate-50 flex items-center justify-between group hover:border-emerald-100 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle size={16} />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-slate-800">Blood Report</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">+5% improvement</p>
                                 </div>
                              </div>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-widest">Optimal</span>
                           </div>

                           {/* Insight 2 */}
                           <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-100 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                                    <BarChart3 size={16} />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-slate-800">Vital Signs</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Normal range</p>
                                 </div>
                              </div>
                              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-widest">Stable</span>
                           </div>

                           {/* Insight 3 */}
                           <div className="bg-white p-3.5 rounded-xl border border-slate-50 flex items-center justify-between group hover:border-slate-200 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center">
                                    <Shield size={16} />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-slate-800">Risk Assessment</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">AI Protected</p>
                                 </div>
                              </div>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-widest">Low Risk</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Stats Section */}
         <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
               {stats.map((stat, idx) => (
                  <div key={idx} className="text-center space-y-2">
                     <div className="text-emerald-600 flex justify-center mb-4">{stat.icon}</div>
                     <div className="text-4xl font-black text-slate-900">{stat.number}</div>
                     <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
               ))}
            </div>
         </section>

         {/* Features Section */}
         <section id="features" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
               <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                  <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">Powerful Features</h2>
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Everything You Need For <br /> Your Health Journey.</h3>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, idx) => (
                     <div key={idx} className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover: transition-all duration-500">
                        <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                           {feature.icon}
                        </div>
                        <h4 className="text-xl font-black text-slate-800 mb-4">{feature.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* How It Works Section */}
         <section id="process" className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
               <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight text-center">Simple Process</h2>
               </div>

               <div className="grid md:grid-cols-3 gap-12 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden lg:block absolute top-1/3 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                  
                  {howItWorks.map((item, idx) => (
                     <div key={idx} className="relative bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center space-y-6 hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-16 h-16 bg-slate-800 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto shadow-lg">
                           {item.step}
                        </div>
                        <h4 className="text-xl font-black text-slate-800">{item.title}</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.description}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Testimonials */}
         <section id="reviews" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-4xl font-black text-slate-900">User Reviews</h2>
               </div>
               <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((t, idx) => (
                     <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 hover:bg-white hover:shadow-md transition-all duration-300">
                        <div className="flex gap-1 text-amber-400">
                           {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-600 font-medium italic">"{t.content}"</p>
                        <div>
                           <p className="font-black text-slate-900 text-lg">{t.name}</p>
                           <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t.role}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Final CTA */}
         <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto bg-slate-800 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-x-32 -translate-y-32"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-x-32 translate-y-32"></div>
               
               <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                     Join the Future of <br />
                     <span className="text-emerald-400">Health Management.</span>
                  </h2>
                  <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                     Experience the most advanced AI-powered health companion today. It's free to get started.
                  </p>
                  <NavLink to="/auth" state={{ isLogin: false }} className="inline-flex bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-lg  active:scale-95 items-center gap-2">
                     Start Today <ArrowRight size={20} />
                  </NavLink>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="bg-slate-50 pt-24 pb-12 px-6 border-t border-slate-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
               <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Heart size={24} fill="currentColor" />
                     </div>
                     <span className="text-3xl font-black text-slate-800 tracking-tighter">HealthBuddy</span>
                  </div>
                  <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
                     Your AI-powered health companion for smart report analysis, vitals tracking, and intelligent health insights.
                  </p>
                  <div className="flex gap-4">
                     <a href='https://www.linkedin.com/in/mudassir-a-ba721830b' target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                        <FaLinkedin size={20} />
                     </a>
                     <a href='https://github.com/mudassirali22' target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                        <FaGithub size={20} />
                     </a>
                  </div>
               </div>

                <div>
                  <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8">Features</h5>
                  <ul className="space-y-4">
                     {['AI Report Analysis', 'Vitals Tracking', 'Medicine Reminders', 'Family Management'].map(item => (
                        <li key={item}>
                           <a href="#features" className="text-slate-500 hover:text-emerald-600 font-bold transition-colors">{item}</a>
                        </li>
                     ))}
                  </ul>
               </div>

               <div>
                  <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8">Account</h5>
                   <ul className="space-y-4">
                     <li><NavLink to="/auth" state={{ isLogin: true }} className="text-slate-500 hover:text-emerald-600 font-bold transition-colors">Login</NavLink></li>
                     <li><NavLink to="/auth" state={{ isLogin: false }} className="text-slate-500 hover:text-emerald-600 font-bold transition-colors">Sign up</NavLink></li>
                  </ul>
               </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 text-center">
               <p className="text-slate-400 font-bold">
                  © {new Date().getFullYear()} HealthBuddy. A portfolio project by{' '}
                  <a href="https://www.linkedin.com/in/mudassir-a-ba721830b" target='_blank' className="text-emerald-600 hover:underline">Mudassir Ali</a>
               </p>
            </div>
         </footer>
      </div>
   );
};

export default Home;
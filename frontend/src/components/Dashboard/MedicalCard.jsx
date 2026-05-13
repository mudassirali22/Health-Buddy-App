import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  User, 
  QrCode, 
  Download,
  Share2,
  Heart,
  Plus
} from 'lucide-react';

const MedicalCard = ({ member, user }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const activeProfile = member || { 
    name: user?.name, 
    relation: 'Primary Account', 
    age: user?.age || 'N/A', 
    gender: user?.gender || 'N/A', 
    bloodGroup: user?.bloodGroup || 'N/A' 
  };

  return (
    <div className="perspective-1000 w-full h-[320px] md:h-[280px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="h-1.5 bg-emerald-600"></div>
            
            <div className="p-6 flex gap-6 items-start flex-1">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  {activeProfile.profilePicture ? (
                    <img src={activeProfile.profilePicture} alt={activeProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-slate-300" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg shadow-sm flex items-center justify-center border border-emerald-50 text-emerald-600">
                  <ShieldCheck size={12} />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-800">{activeProfile.name}</h2>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-widest rounded-md border border-emerald-100">
                      {activeProfile.relation}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium">Profile Verified</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Blood</p>
                    <span className="text-xs font-bold text-slate-800">{activeProfile.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Age</p>
                    <span className="text-xs font-bold text-slate-800">{activeProfile.age || 'N/A'} Yrs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Tap to see Health ID
              </div>
              <Heart size={12} className="text-slate-300" />
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
          <div className="relative h-full bg-slate-800 rounded-2xl overflow-hidden shadow-sm p-6 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Health ID Number</p>
                  <p className="text-md font-mono font-bold tracking-widest">
                    {activeProfile.mrNumber || 'HB-MASTER'}
                  </p>
               </div>
               <QrCode size={40} className="text-emerald-500" />
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Emergency Contact</p>
              <p className="text-xs font-medium">Contact administrator for health records and allergy info.</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <Download size={14} />
                </button>
                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">HealthBuddy Pro</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MedicalCard;

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Trash2, 
  ArrowRight, 
  Stethoscope, 
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  Droplets,
  Scale,
  Heart,
  Thermometer,
  FileText,
  ShieldCheck,
  BrainCircuit,
  Pencil
} from 'lucide-react';
import { formatDate } from './dateUtils';
import { getMetricCount } from './healthAnalysis';

const VitalsCard = ({ vital, analysis, trend, isSelected, onToggleSelection, onDelete }) => {
  const [showAllWarnings, setShowAllWarnings] = useState(false);
  const metricCount = getMetricCount(vital);

  return (
    <div className={`standard-card p-6 transition-all duration-300 group ${
      isSelected 
        ? 'border-emerald-500 ring-4 ring-emerald-500/10' 
        : 'hover:border-emerald-300'
    }`}>
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 pb-6 border-b border-slate-50">
        <div className="flex items-start gap-4 flex-1">
          <div className="mt-1 flex items-center">
             <input
               type="checkbox"
               checked={isSelected}
               onChange={onToggleSelection}
               className="w-5 h-5 text-emerald-600 bg-slate-50 border-slate-200 rounded focus:ring-emerald-500 cursor-pointer"
             />
          </div>
          
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shrink-0">
            <Calendar size={24} />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                {formatDate(vital.date).split(',')[0]}
              </h3>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                analysis.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                analysis.color === 'yellow' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-red-50 text-red-700 border-red-100'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  analysis.color === 'emerald' ? 'bg-emerald-500' :
                  analysis.color === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{analysis.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Stethoscope size={14} className="text-emerald-500" />
                {metricCount} Metrics Recorded
              </span>
              
              {trend.trend !== 'new' && (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  trend.trend === 'improving' ? 'bg-emerald-50 text-emerald-700' :
                  trend.trend === 'declining' ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'
                }`}>
                  {trend.trend === 'improving' && <TrendingUp size={12} />}
                  {trend.trend === 'declining' && <TrendingDown size={12} />}
                  {trend.trend === 'stable' && <Minus size={12} />}
                  {trend.trend}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <NavLink
            to={`/edit-vital/${vital._id}`}
            className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm border border-slate-100 hover:border-emerald-100"
            title="Edit Record"
          >
            <Pencil size={18} />
          </NavLink>
          
          <NavLink
            to={`/vitals/${vital._id}`}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 shadow-md  transition-all"
          >
            <BrainCircuit size={16} /> View Details
          </NavLink>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2.5 bg-white text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100 shadow-sm"
            title="Delete Record"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { key: 'bloodPressure', icon: Activity, label: 'BP', unit: 'mmHg', color: 'red', 
            val: vital.bloodPressure ? `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}` : null },
          { key: 'bloodSugar', icon: Droplets, label: 'Glucose', unit: 'mg/dL', color: 'blue', val: vital.bloodSugar },
          { key: 'heartRate', icon: Heart, label: 'Pulse', unit: 'BPM', color: 'emerald', val: vital.heartRate },
          { key: 'temperature', icon: Thermometer, label: 'Temp', unit: '°F', color: 'amber', val: vital.temperature },
          { key: 'weight', icon: Scale, label: 'Weight', unit: 'kg', color: 'indigo', val: vital.weight }
        ].map(metric => metric.val && (
          <div key={metric.key} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-${metric.color}-600 bg-${metric.color}-50 shrink-0`}>
              <metric.icon size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-800">{metric.val}</span>
                <span className="text-[10px] font-black text-slate-300 uppercase">{metric.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Notes/Warnings */}
      {(vital.notes || (analysis.warnings && analysis.warnings.length > 0)) && (
        <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
           {vital.notes && (
             <div className="flex items-start gap-3">
               <FileText size={14} className="text-slate-300 shrink-0 mt-0.5" />
               <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-2">
                 {vital.notes}
               </p>
             </div>
           )}
           {analysis.warnings && analysis.warnings.length > 0 && (
             <div className="bg-red-600/5 rounded-2xl p-4 flex flex-col gap-4 border border-red-500/10 shadow-sm relative overflow-hidden group/warning">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
               <div className="flex items-start gap-4">
                 <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0 text-red-600 group-hover/warning:scale-110 transition-transform">
                   <AlertTriangle size={16} />
                 </div>
                 <div className="flex-1">
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 opacity-80">Critical Health Warning</p>
                   <div className="space-y-2">
                     {showAllWarnings ? (
                       analysis.warnings.map((warning, i) => (
                         <p key={i} className="text-xs font-bold text-red-900 leading-snug flex items-start gap-2">
                           <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 shrink-0"></span>
                           {warning}
                         </p>
                       ))
                     ) : (
                       <p className="text-xs font-bold text-red-900 leading-snug">
                         {analysis.warnings[0]}
                       </p>
                     )}
                     
                     {analysis.warnings.length > 1 && (
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setShowAllWarnings(!showAllWarnings);
                         }}
                         className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline mt-1"
                       >
                         {showAllWarnings ? 'Show Less' : `+${analysis.warnings.length - 1} more markers detected`}
                       </button>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default VitalsCard;
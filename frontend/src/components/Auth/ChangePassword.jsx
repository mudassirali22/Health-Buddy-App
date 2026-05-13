import { useState } from "react";
import { useNavigate} from "react-router-dom";
import {
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lock,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import api from "../../services/api";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const navigate = useNavigate();

  // Check password strength
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    });
  };

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    const allRequirementsMet = Object.values(passwordStrength).every(Boolean);
    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setMessage("Security credentials updated successfully.");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordStrength({
          hasMinLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
        });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${met ? "text-emerald-600" : "text-slate-300"}`}>
      {met ? <CheckCircle size={12} className="text-emerald-500" /> : <div className="w-2 h-2 border border-slate-300 rounded-full" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Unified Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <KeyRound size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Security Center</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Maintain the integrity of your clinical account credentials.
            </p>
          </div>
        </div>
        
        <button onClick={() => navigate(-1)} className="bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 flex items-center gap-2 text-xs uppercase tracking-wider relative z-10">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="standard-card p-6 sm:p-8">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-8">
               <Shield size={16} className="text-emerald-600" /> Credential Management
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest">{message}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
                  <XCircle size={20} className="text-red-500" />
                  <p className="text-red-700 text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="Required for verification"
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="hidden md:block"></div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleNewPasswordChange}
                      placeholder="Strong unique password"
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Identity</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Verify new password"
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {formData.newPassword && (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PasswordRequirement met={passwordStrength.hasMinLength} text="Min 8 Characters" />
                  <PasswordRequirement met={passwordStrength.hasUpperCase} text="Uppercase Letter" />
                  <PasswordRequirement met={passwordStrength.hasLowerCase} text="Lowercase Letter" />
                  <PasswordRequirement met={passwordStrength.hasNumber} text="One Number" />
                  <PasswordRequirement met={passwordStrength.hasSpecialChar} text="Special Character (@$!%)" />
                </div>
              )}

              <div className="pt-4 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="bg-slate-800 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-md  transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShieldCheck size={18} />}
                  {loading ? "Updating Identity..." : "Update Security Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="standard-card p-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" /> Security Best Practices
            </h3>
            <div className="space-y-4">
              {[
                "Use a combination of letters, numbers, and symbols.",
                "Avoid using common words or personal information.",
                "Never share your clinical credentials with anyone.",
                "Change your password every 90 days for optimal security."
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
             
             <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Encryption Status</h3>
             <p className="text-xs font-medium opacity-80 leading-relaxed">
                Your credentials are encrypted using industry-standard clinical security protocols (AES-256).
             </p>
             <div className="mt-6 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <Lock size={16} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Secured</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

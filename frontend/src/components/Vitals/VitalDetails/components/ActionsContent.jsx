import { CheckCircle, Activity, Calendar, Target, Clock, Star, Award } from 'lucide-react';

const ActionsContent = ({ aiAnalysis }) => {
  const getActionPlan = () => {
    const recommendations = aiAnalysis?.aiRecommendations || {};
    
    return {
      monitoringPlan: recommendations.monitoringSuggestions || [
        'Regular blood pressure checks twice daily',
        'Heart rate monitoring during exercise',
        'Weekly weight tracking',
        'Sleep quality assessment'
      ],
      lifestylePlan: recommendations.lifestyleChanges || [
        'Implement Mediterranean diet principles',
        'Establish consistent sleep schedule',
        'Incorporate daily physical activity',
        'Practice stress management techniques'
      ],
      medicalPlan: recommendations.medicalConsultation || [
        'Schedule annual physical examination',
        'Consult with nutrition specialist',
        'Follow up with primary care physician',
        'Consider preventive screenings'
      ],
      timeline: [
        { period: 'Immediate', tasks: ['Start daily monitoring', 'Schedule appointments'] },
        { period: '1-4 Weeks', tasks: ['Implement lifestyle changes', 'Establish routines'] },
        { period: '1-3 Months', tasks: ['Assess progress', 'Adjust strategies'] },
        { period: 'Ongoing', tasks: ['Maintain healthy habits', 'Regular check-ups'] }
      ]
    };
  };

  const actionPlan = getActionPlan();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-200">
      <h3 className="text-md sm:text-2xl  font-bold mb-8 flex items-center gap-3 text-gray-800">
        <CheckCircle className="w-7 h-7 text-green-600" />
        Comprehensive Action Plan
      </h3>
      
      {aiAnalysis ? (
        <div className="space-y-8">
          {/* Monitoring Plan */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-blue-700">
              <Activity className="w-5 h-5" />
              Health Monitoring Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionPlan.monitoringPlan.map((suggestion, index) => (
                <div key={index} className="flex gap-3 p-4 bg-white rounded-xl border border-blue-100">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle Implementation */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-green-700">
              <Award className="w-5 h-5" />
              Lifestyle Implementation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionPlan.lifestylePlan.map((change, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-green-100">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Follow-up */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-purple-700">
              <Calendar className="w-5 h-5" />
              Medical Follow-up Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionPlan.medicalPlan.map((consult, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-purple-100">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">{consult}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Timeline */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <h4 className="font-bold text-md sm:text-lg mb-6 flex items-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              Implementation Timeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {actionPlan.timeline.map((phase, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <h5 className="font-semibold text-amber-700">{phase.period}</h5>
                  </div>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-gray-700 leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
            <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-emerald-700">
              <Target className="w-5 h-5" />
              Progress Tracking
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <div className="text-lg sm:text-2xl font-bold text-emerald-600 mb-1">Daily</div>
                <div className="text-sm text-gray-600">Vital Signs</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <div className="text-lg sm:text-2xl  font-bold text-emerald-600 mb-1">Weekly</div>
                <div className="text-sm text-gray-600">Lifestyle Review</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <div className="text-lg sm:text-2xl font-bold text-emerald-600 mb-1">Monthly</div>
                <div className="text-sm text-gray-600">Progress Assessment</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg mb-2">No action plan available</p>
          <p className="text-gray-500 text-sm">Generate AI analysis to get personalized action plan</p>
        </div>
      )}
    </div>
  );
};

export default ActionsContent;
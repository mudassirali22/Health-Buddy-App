import { Brain, Zap, TrendingUp, Target, Lightbulb, Clock, Users, Award } from 'lucide-react';

const InsightsContent = ({ aiAnalysis, getAIAnalysis }) => {
  const getAllInsights = () => {
    const recommendations = aiAnalysis?.aiRecommendations || {};
    
    return {
      immediateActions: recommendations.immediateActions || [
        'Schedule comprehensive health assessment',
        'Implement personalized wellness plan',
        'Set up continuous monitoring system'
      ],
      lifestyleChanges: recommendations.lifestyleChanges || [
        'Personalized nutrition plan based on metabolic profile',
        'Structured exercise regimen with heart rate zones',
        'Sleep optimization and stress reduction techniques'
      ],
      medicalConsultation: recommendations.medicalConsultation || [
        'Comprehensive metabolic panel testing',
        'Cardiovascular risk assessment',
        'Preventive health screening schedule'
      ],
      monitoringSuggestions: recommendations.monitoringSuggestions || [
        'Continuous vital signs tracking',
        'Sleep quality and duration monitoring',
        'Activity and recovery balance tracking'
      ],
      dietaryRecommendations: recommendations.dietaryRecommendations || [
        'Balanced macronutrient distribution',
        'Adequate hydration and electrolyte balance',
        'Micronutrient optimization through whole foods'
      ],
      exerciseRecommendations: recommendations.exerciseRecommendations || [
        'Cardiovascular training 3-5 times weekly',
        'Strength training 2-3 times per week',
        'Flexibility and mobility exercises daily'
      ]
    };
  };

  const allInsights = getAllInsights();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-200">
      <h3 className="text-md sm:text-2xl  font-bold mb-8 flex items-center gap-3 text-gray-800">
        <Brain className="w-7 h-7 text-emerald-600" />
        AI Insights & Smart Recommendations
      </h3>
      
      {aiAnalysis ? (
        <div className="space-y-8">
          {/* Priority Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-amber-700">
                <Zap className="w-5 h-5" />
                Priority Actions
                <span className="text-xs  bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                  High Impact
                </span>
              </div>
              <ul className="space-y-3">
                {allInsights.immediateActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-green-700">
                <TrendingUp className="w-5 h-5" />
                Lifestyle Optimization
              </h4>
              <ul className="space-y-3">
                {allInsights.lifestyleChanges.map((change, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Professional Guidance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-blue-700">
                <Users className="w-5 h-5" />
                Professional Consultation
              </h4>
              <ul className="space-y-3">
                {allInsights.medicalConsultation.map((consult, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">{consult}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-purple-700">
                <Target className="w-5 h-5" />
                Monitoring Strategy
              </h4>
              <ul className="space-y-3">
                {allInsights.monitoringSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-orange-700">
                <Lightbulb className="w-5 h-5" />
                Nutrition Guidance
              </h4>
              <ul className="space-y-2">
                {allInsights.dietaryRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
              <h4 className="font-bold text-md sm:text-lg mb-4 flex items-center gap-2 text-cyan-700">
                <Award className="w-5 h-5" />
                Fitness Plan
              </h4>
              <ul className="space-y-2">
                {allInsights.exerciseRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Analysis Information section */}
          {aiAnalysis.aiMetadata && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700">
                <Brain className="w-5 h-5" />
                Analysis Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className='flex gap-2'>
                  <div className="text-gray-600">Analyzed on :</div>
                  <div className="font-medium text-gray-800">
                    {new Date(aiAnalysis.aiMetadata.analyzedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg mb-4">No AI insights available</p>
          <p className="text-gray-500 text-sm mb-6">Generate comprehensive AI analysis to get personalized health insights</p>
          <button
            onClick={getAIAnalysis}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Generate AI Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightsContent;
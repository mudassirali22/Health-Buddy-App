import { Apple, UtensilsCrossed, CheckCircle, XCircle, Home } from 'lucide-react';

const DietTab = ({ aiSummary }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
          <Apple className="text-orange-600 text-xl" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Diet & Lifestyle Recommendations</h2>
          <p className="text-gray-600 text-sm sm:text-md">Personalized suggestions based on your report</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {aiSummary.foodsToAvoid?.length > 0 && (
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-orange-600 w-4 h-4" />
              </div>
              Foods to Avoid
            </h3>
            <div className="space-y-3">
              {aiSummary.foodsToAvoid.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-orange-100">
                  <XCircle className="text-orange-500 w-4 h-4 flex-shrink-0" />
                  <span className="text-orange-800">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiSummary.foodsToEat?.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Apple className="text-green-600 w-4 h-4" />
              </div>
              Beneficial Foods
            </h3>
            <div className="space-y-3">
              {aiSummary.foodsToEat.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-green-100">
                  <CheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                  <span className="text-green-800">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {aiSummary.homeRemedies?.length > 0 && (
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Home className="text-purple-600 w-4 h-4" />
            </div>
            Home Remedies
          </h3>
          <div className="grid gap-3">
            {aiSummary.homeRemedies.map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-purple-100">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-purple-800">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DietTab;
import { MessageCircleQuestion } from 'lucide-react';

const QuestionsTab = ({ questionsForDoctor }) => {
  if (!questionsForDoctor?.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <MessageCircleQuestion className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Questions for Your Doctor</h2>
          <p className="text-gray-600 text-sm sm:text-md">Important questions to discuss during your next visit</p>
        </div>
      </div>

      <div className="grid gap-4">
        {questionsForDoctor.map((q, i) => (
          <div key={i} className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-blue-800  font-medium">{q}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsTab;
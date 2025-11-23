import { Download, FileText } from "lucide-react";

const ReportPreview = ({ fileUrl }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <FileText className="text-blue-600 w-4 h-4" />
      </div>
      Report Preview
    </h2>
    {fileUrl.toLowerCase().endsWith('.pdf') ? (
      <div className="border-2 border-green-100 rounded-2xl overflow-hidden bg-gray-50">
        <iframe 
          src={fileUrl} 
          className="w-full h-96 rounded-t-2xl" 
          title="Report PDF"
        />
        <div className="bg-white p-4 border-t border-green-100">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
          >
            Open PDF in new tab
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    ) : (
      <div className="border-2 border-green-100 rounded-2xl overflow-hidden bg-gray-50">
        <img src={fileUrl} alt="Report" className="w-full h-auto max-h-96 object-contain" />
      </div>
    )}
  </div>
);

export default ReportPreview
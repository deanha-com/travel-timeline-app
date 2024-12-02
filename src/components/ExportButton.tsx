import React from 'react';
import { Download } from 'lucide-react';
import { TravelEntry } from '../data/travels';

interface ExportButtonProps {
  travels: TravelEntry[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ travels }) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(travels, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel-timeline.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
    >
      <Download className="w-4 h-4" />
      Export Timeline
    </button>
  );
};

export default ExportButton;
interface Props {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ title, content, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2 py-1"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 prose prose-sm max-w-none">
          {content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h3 key={i} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.slice(3)}</h3>;
            }
            if (line.startsWith('### ')) {
              return <h4 key={i} className="text-base font-semibold text-gray-700 mt-3 mb-1">{line.slice(4)}</h4>;
            }
            if (line.trim() === '') {
              return <div key={i} className="h-2" />;
            }
            return <p key={i} className="text-sm text-gray-600 leading-relaxed">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

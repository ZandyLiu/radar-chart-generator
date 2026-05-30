import { useTranslation } from '../i18n';
import type { Dimension } from '../types';

interface Props {
  dim: Dimension;
  index: number;
  total: number;
  scaleMin: number;
  scaleMax: number;
  seriesValues: { seriesId: string; seriesName: string; value: number; color: string }[];
  onLabelChange: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onValueChange: (seriesId: string, dimId: string, value: number) => void;
}

export default function DimensionEditor({
  dim, index, total, scaleMin, scaleMax,
  seriesValues, onLabelChange, onRemove, onValueChange,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
        <input
          type="text"
          value={dim.label}
          onChange={(e) => onLabelChange(dim.id, e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={t.dimensionName}
        />
        {total > 3 && (
          <button
            onClick={() => onRemove(dim.id)}
            className="text-red-400 hover:text-red-600 text-lg leading-none px-1"
            title={t.remove}
          >
            ×
          </button>
        )}
      </div>
      <div className="space-y-1.5">
        {seriesValues.map((sv) => (
          <div key={sv.seriesId} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: sv.color }}
            />
            <span className="text-xs text-gray-600 w-14 truncate" title={sv.seriesName}>
              {sv.seriesName}
            </span>
            <input
              type="range"
              min={scaleMin}
              max={scaleMax}
              value={sv.value}
              onChange={(e) => onValueChange(sv.seriesId, dim.id, Number(e.target.value))}
              className="flex-1 h-1.5 accent-blue-500"
            />
            <input
              type="number"
              min={scaleMin}
              max={scaleMax}
              value={sv.value}
              onChange={(e) => {
                const v = Math.min(scaleMax, Math.max(scaleMin, Number(e.target.value)));
                onValueChange(sv.seriesId, dim.id, v);
              }}
              className="w-14 px-1 py-0.5 text-xs border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

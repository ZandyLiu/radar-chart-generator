import type { Series } from '../types';

interface Props {
  ser: Series;
  onChange: (id: string, patch: Partial<Omit<Series, 'id'>>) => void;
  onRemove: (id: string) => void;
  totalSeries: number;
}

export default function SeriesEditor({ ser, onChange, onRemove, totalSeries }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white" style={{ borderLeftColor: ser.color, borderLeftWidth: 3 }}>
      <div className="flex items-center gap-2 mb-2">
        {/* Color picker */}
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={ser.color}
            onChange={(e) => onChange(ser.id, { color: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0 overflow-hidden"
            style={{ backgroundColor: 'transparent' }}
            title="选择颜色"
          />
        </div>
        <input
          type="text"
          value={ser.name}
          onChange={(e) => onChange(ser.id, { name: e.target.value })}
          className="flex-1 px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="系列名称"
        />
        {totalSeries > 1 && (
          <button
            onClick={() => onRemove(ser.id)}
            className="text-red-500 hover:text-red-700 text-xl leading-none px-2 py-1 rounded hover:bg-red-50 transition-colors"
            title="删除系列"
          >
            ×
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 whitespace-nowrap">
          透明度
        </label>
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.05}
          value={ser.fillOpacity}
          onChange={(e) => onChange(ser.id, { fillOpacity: Number(e.target.value) })}
          className="flex-1 h-1.5 accent-blue-500"
        />
        <span className="text-xs text-gray-400 w-8 text-right">
          {Math.round(ser.fillOpacity * 100)}%
        </span>
      </div>
    </div>
  );
}

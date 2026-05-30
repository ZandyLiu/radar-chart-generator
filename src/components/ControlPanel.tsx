import { useRef, useState } from 'react';
import type { Dimension, Series, ChartStyle, Snapshot } from '../types';
import { useTranslation } from '../i18n';
import DimensionEditor from './DimensionEditor';
import SeriesEditor from './SeriesEditor';
import { exportChart } from '../utils/export';
import { renderRadarSvg, downloadSvg } from '../utils/renderSvg';
import { encodeState } from '../utils/shareUrl';
import { parseCsv } from '../utils/parseCsv';
import { presets } from '../data/presets';
import { palettes, FONT_OPTIONS } from '../data/palettes';
import EmbedCode from './EmbedCode';

interface Props {
  dimensions: Dimension[];
  series: Series[];
  scaleMin: number;
  scaleMax: number;
  chartStyle: ChartStyle;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddDimension: () => void;
  onRemoveDimension: (id: string) => void;
  onUpdateDimension: (id: string, label: string) => void;
  onAddSeries: () => void;
  onRemoveSeries: (id: string) => void;
  onUpdateSeries: (id: string, patch: Partial<Omit<Series, 'id'>>) => void;
  onUpdateSeriesValue: (seriesId: string, dimId: string, value: number) => void;
  onSetScaleMin: (v: number) => void;
  onSetScaleMax: (v: number) => void;
  onUpdateChartStyle: (patch: Partial<ChartStyle>) => void;
  onLoadPreset: (dims: string[], sers: { name: string; color: string; values: number[] }[]) => void;
  onRestoreFromState: (state: Snapshot) => void;
  exportState: () => Snapshot;
  chartRef: React.RefObject<HTMLDivElement>;
}

export default function ControlPanel({
  dimensions, series, scaleMin, scaleMax, chartStyle,
  canUndo, canRedo, onUndo, onRedo,
  onAddDimension, onRemoveDimension, onUpdateDimension,
  onAddSeries, onRemoveSeries, onUpdateSeries, onUpdateSeriesValue,
  onSetScaleMin, onSetScaleMax, onUpdateChartStyle,
  onLoadPreset, onRestoreFromState, exportState, chartRef,
}: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'dimensions' | 'series' | 'settings'>('dimensions');
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [csvText, setCsvText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPng = async () => {
    if (!chartRef.current) return;
    setExporting(true);
    try {
      await exportChart(chartRef.current);
    } finally {
      setExporting(false);
    }
  };

  const handleExportSvg = () => {
    const svg = renderRadarSvg({
      width: 600,
      height: 600,
      dimensions,
      series,
      scaleMin,
      scaleMax,
      style: chartStyle,
    });
    downloadSvg(svg);
  };

  const handleExportJson = () => {
    const state = exportState();
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'radar-chart.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = JSON.parse(reader.result as string);
        if (state.dimensions && state.series) {
          onRestoreFromState(state);
        }
      } catch {
        alert(t.jsonError);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyLink = async () => {
    const state = exportState();
    const hash = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCsvImport = () => {
    const result = parseCsv(csvText);
    if (result) {
      onLoadPreset(result.dimensions, result.series);
      setCsvText('');
      setShowCsv(false);
    } else {
      alert(t.csvParseError);
    }
  };

  const applyPalette = (colors: string[]) => {
    series.forEach((ser, index) => {
      const color = colors[index % colors.length];
      onUpdateSeries(ser.id, { color });
    });
  };

  const tabs = [
    { key: 'dimensions' as const, label: t.dimensions, count: dimensions.length },
    { key: 'series' as const, label: t.series, count: series.length },
    { key: 'settings' as const, label: t.settings, count: undefined },
  ];

  return (
    <div className="lg:w-96 flex-shrink-0 space-y-4">
      {/* Presets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.presets}</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const presetNameMap: Record<string, string> = {
              'Ability Assessment': t.presetAbility,
              'Product Comparison': t.presetProduct,
              'Sports Ability': t.presetSports,
              'Project Evaluation': t.presetProject,
            };
            const presetName = presetNameMap[p.name] || p.name;
            return (
              <button
                key={p.name}
                onClick={() => onLoadPreset(p.dimensions, p.series)}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
                title={p.description}
              >
                {presetName}
              </button>
            );
          })}
          <button
            onClick={() => setShowCsv(!showCsv)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-green-50 hover:text-green-600 rounded-full transition-colors"
          >
            {t.pasteData}
          </button>
        </div>
        {showCsv && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500">{t.pasteDataDesc}</p>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full h-24 text-xs font-mono p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={t.pasteDataPlaceholder}
            />
            <button
              onClick={handleCsvImport}
              className="w-full py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              {t.importData}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1 text-xs">({t.count})</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3">
          {activeTab === 'dimensions' && (
            <>
              <button
                onClick={onAddDimension}
                className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                + {t.addDimension}
              </button>
              {dimensions.map((dim, i) => (
                <DimensionEditor
                  key={dim.id}
                  dim={dim}
                  index={i}
                  total={dimensions.length}
                  scaleMin={scaleMin}
                  scaleMax={scaleMax}
                  seriesValues={series.map((s) => ({
                    seriesId: s.id,
                    seriesName: s.name,
                    value: s.values[dim.id] ?? scaleMin,
                    color: s.color,
                  }))}
                  onLabelChange={onUpdateDimension}
                  onRemove={onRemoveDimension}
                  onValueChange={onUpdateSeriesValue}
                />
              ))}
            </>
          )}

          {activeTab === 'series' && (
            <>
              <button
                onClick={onAddSeries}
                className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                + {t.addSeries}
              </button>

              {/* Quick Palette */}
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">{t.quickPalette}</label>
                <div className="flex flex-wrap gap-1.5">
                  {palettes.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => applyPalette(p.colors)}
                      className="group relative w-8 h-8 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors overflow-hidden"
                      title={p.name}
                    >
                      <div className="absolute inset-0 flex flex-wrap">
                        {p.colors.slice(0, 4).map((c, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {series.map((ser) => (
                <SeriesEditor
                  key={ser.id}
                  ser={ser}
                  onChange={onUpdateSeries}
                  onRemove={onRemoveSeries}
                  totalSeries={series.length}
                />
              ))}
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Undo/Redo */}
              <div className="flex gap-2">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="flex-1 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={`${t.undo} (Ctrl+Z)`}
                >
                  ↩ {t.undo}
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="flex-1 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={`${t.redo} (Ctrl+Shift+Z)`}
                >
                  ↪ {t.redo}
                </button>
              </div>

              {/* Scale */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  {t.scaleRange}: {scaleMin} - {scaleMax}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={scaleMin}
                    onChange={(e) => onSetScaleMin(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={scaleMax}
                    onChange={(e) => onSetScaleMax(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Font */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">{t.font}</label>
                <select
                  value={chartStyle.fontFamily}
                  onChange={(e) => onUpdateChartStyle({ fontFamily: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid & Angle Line Style */}
              <div className="space-y-3">
                <label className="text-sm text-gray-600 block">{t.gridStyle}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={chartStyle.gridColor}
                    onChange={(e) => onUpdateChartStyle({ gridColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    title={t.color}
                  />
                  <span className="text-xs text-gray-500">{t.color}</span>
                  <input
                    type="range"
                    min={0.5}
                    max={4}
                    step={0.5}
                    value={chartStyle.gridWidth}
                    onChange={(e) => onUpdateChartStyle({ gridWidth: Number(e.target.value) })}
                    className="flex-1 h-1.5 accent-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-8 text-right">{chartStyle.gridWidth}px</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-gray-600 block">{t.angleStyle}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={chartStyle.angleLineColor}
                    onChange={(e) => onUpdateChartStyle({ angleLineColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    title={t.color}
                  />
                  <span className="text-xs text-gray-500">{t.color}</span>
                  <input
                    type="range"
                    min={0.5}
                    max={4}
                    step={0.5}
                    value={chartStyle.angleLineWidth}
                    onChange={(e) => onUpdateChartStyle({ angleLineWidth: Number(e.target.value) })}
                    className="flex-1 h-1.5 accent-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-8 text-right">{chartStyle.angleLineWidth}px</span>
                </div>
              </div>

              {/* Chart Style */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 block">{t.chartOptions}</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartStyle.circular}
                    onChange={(e) => onUpdateChartStyle({ circular: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm text-gray-700">{t.circularGrid}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartStyle.fillArea}
                    onChange={(e) => onUpdateChartStyle({ fillArea: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm text-gray-700">{t.fillArea}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartStyle.showPoints}
                    onChange={(e) => onUpdateChartStyle({ showPoints: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm text-gray-700">{t.showPoints}</span>
                </label>
              </div>

              {/* Export buttons */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 block">{t.export}</label>
                <button
                  onClick={handleExportPng}
                  disabled={exporting}
                  className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {exporting ? '...' : t.exportPng}
                </button>
                <button
                  onClick={handleExportSvg}
                  className="w-full py-2 text-sm font-medium text-blue-600 border border-blue-300 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {t.exportSvg}
                </button>
                <button
                  onClick={handleExportJson}
                  className="w-full py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {t.exportJson}
                </button>
                <button
                  onClick={handleImportJson}
                  className="w-full py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {t.importJson}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Share */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">{t.share}</label>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  {copied ? t.copied : t.copyLink}
                </button>
              </div>

              {/* Embed */}
              <EmbedCode exportState={exportState} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

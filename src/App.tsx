import { useRef, useEffect, useState } from 'react';
import { useChartData } from './hooks/useChartData';
import ControlPanel from './components/ControlPanel';
import RadarChart from './components/RadarChart';
import SiteLogo from './components/SiteLogo';
import LegalModal from './components/LegalModal';
import { decodeState, encodeState } from './utils/shareUrl';
import { legalPages } from './data/legalContent';

export default function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useChartData();
  const isEmbed = new URLSearchParams(window.location.search).has('embed');
  const restoredRef = useRef(false);
  const [modalPage, setModalPage] = useState<string | null>(null);

  // Restore from URL hash on mount
  useEffect(() => {
    if (restoredRef.current) return;
    const hash = window.location.hash;
    if (hash) {
      const state = decodeState(hash);
      if (state) {
        restoredRef.current = true;
        chart.restoreFromState(state);
      }
    }
  }, [chart]);

  // Update URL hash when state changes (debounced)
  useEffect(() => {
    if (restoredRef.current === false && !window.location.hash) return;
    restoredRef.current = true;

    const timer = setTimeout(() => {
      const state = chart.exportState();
      const hash = encodeState(state);
      window.history.replaceState(null, '', `#${hash}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [chart.exportState]);

  const openModal = (key: string) => setModalPage(key);
  const closeModal = () => setModalPage(null);

  const activeLegal = modalPage ? legalPages[modalPage] : null;

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <RadarChart
            dimensions={chart.dimensions}
            series={chart.series}
            scaleMin={chart.scaleMin}
            scaleMax={chart.scaleMax}
            chartStyle={chart.chartStyle}
            chartRef={chartRef}
          />
          <p className="text-center text-xs text-gray-400 mt-2">
            Powered by 雷达图生成器
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SiteLogo />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <ControlPanel
            dimensions={chart.dimensions}
            series={chart.series}
            scaleMin={chart.scaleMin}
            scaleMax={chart.scaleMax}
            chartStyle={chart.chartStyle}
            canUndo={chart.canUndo}
            canRedo={chart.canRedo}
            onUndo={chart.undo}
            onRedo={chart.redo}
            onAddDimension={chart.addDimension}
            onRemoveDimension={chart.removeDimension}
            onUpdateDimension={chart.updateDimension}
            onAddSeries={chart.addSeries}
            onRemoveSeries={chart.removeSeries}
            onUpdateSeries={chart.updateSeries}
            onUpdateSeriesValue={chart.updateSeriesValue}
            onSetScaleMin={chart.setScaleMin}
            onSetScaleMax={chart.setScaleMax}
            onUpdateChartStyle={chart.updateChartStyle}
            onLoadPreset={chart.loadPreset}
            onRestoreFromState={chart.restoreFromState}
            exportState={chart.exportState}
            chartRef={chartRef}
          />

          <div className="flex-1 min-w-0">
            <RadarChart
              dimensions={chart.dimensions}
              series={chart.series}
              scaleMin={chart.scaleMin}
              scaleMax={chart.scaleMax}
              chartStyle={chart.chartStyle}
              chartRef={chartRef}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              <p>雷达图生成器 — 免费在线工具，支持多维度、多系列数据对比</p>
              <p className="mt-1">
                &copy; {new Date().getFullYear()} Radar Chart Generator. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <button
                onClick={() => openModal('privacy')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                隐私政策
              </button>
              <button
                onClick={() => openModal('terms')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                服务条款
              </button>
              <button
                onClick={() => openModal('about')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                关于我们
              </button>
              <button
                onClick={() => openModal('contact')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                联系我们
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <LegalModal
        title={activeLegal?.title || ''}
        content={activeLegal?.content || ''}
        isOpen={!!modalPage}
        onClose={closeModal}
      />
    </div>
  );
}

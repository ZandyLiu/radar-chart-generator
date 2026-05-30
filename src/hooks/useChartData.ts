import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dimension, Series, ChartStyle, Snapshot } from '../types';

let nextId = 1;
function uid(): string {
  return `id_${nextId++}`;
}

const DEFAULT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const DEFAULT_DIMENSIONS: Dimension[] = [
  { id: uid(), label: 'Dimension 1' },
  { id: uid(), label: 'Dimension 2' },
  { id: uid(), label: 'Dimension 3' },
  { id: uid(), label: 'Dimension 4' },
  { id: uid(), label: 'Dimension 5' },
];

const DEFAULT_STYLE: ChartStyle = {
  circular: false,
  fillArea: true,
  showPoints: true,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  gridColor: '#e5e7eb',
  gridWidth: 1,
  angleLineColor: '#e5e7eb',
  angleLineWidth: 1,
};

function makeDefaultSeries(dimensions: Dimension[], index: number): Series {
  const values: Record<string, number> = {};
  dimensions.forEach((d) => { values[d.id] = 70; });
  return {
    id: uid(),
    name: `Series ${index + 1}`,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    fillOpacity: 0.2,
    values,
  };
}

function takeSnapshot(
  dimensions: Dimension[],
  series: Series[],
  scaleMin: number,
  scaleMax: number,
  chartStyle: ChartStyle,
): Snapshot {
  return {
    dimensions: dimensions.map((d) => ({ ...d })),
    series: series.map((s) => ({ ...s, values: { ...s.values } })),
    scaleMin,
    scaleMax,
    chartStyle: { ...chartStyle },
  };
}

function applySnapshot(snapshot: Snapshot) {
  return {
    dimensions: snapshot.dimensions.map((d) => ({ ...d })),
    series: snapshot.series.map((s) => ({ ...s, values: { ...s.values } })),
    scaleMin: snapshot.scaleMin,
    scaleMax: snapshot.scaleMax,
    chartStyle: { ...snapshot.chartStyle },
  };
}

const MAX_HISTORY = 50;

export function useChartData() {
  const [dimensions, setDimensions] = useState<Dimension[]>(DEFAULT_DIMENSIONS);
  const [series, setSeries] = useState<Series[]>([makeDefaultSeries(DEFAULT_DIMENSIONS, 0)]);
  const [scaleMin, setScaleMin] = useState(0);
  const [scaleMax, setScaleMax] = useState(100);
  const [chartStyle, setChartStyle] = useState<ChartStyle>(DEFAULT_STYLE);

  const historyRef = useRef<Snapshot[]>([]);
  const historyIndexRef = useRef(-1);
  const skipHistoryRef = useRef(false);

  const pushHistory = useCallback(() => {
    if (skipHistoryRef.current) return;
    const snap = takeSnapshot(dimensions, series, scaleMin, scaleMax, chartStyle);
    const hist = historyRef.current;
    const idx = historyIndexRef.current;
    // Truncate any future history if we're not at the end
    const newHist = idx < hist.length - 1 ? hist.slice(0, idx + 1) : hist;
    newHist.push(snap);
    if (newHist.length > MAX_HISTORY) newHist.shift();
    historyRef.current = newHist;
    historyIndexRef.current = newHist.length - 1;
  }, [dimensions, series, scaleMin, scaleMax, chartStyle]);

  // Push initial state
  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current = [takeSnapshot(DEFAULT_DIMENSIONS, [makeDefaultSeries(DEFAULT_DIMENSIONS, 0)], 0, 100, DEFAULT_STYLE)];
      historyIndexRef.current = 0;
    }
  }, []);

  const undo = useCallback(() => {
    const hist = historyRef.current;
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    historyIndexRef.current = newIdx;
    const restored = applySnapshot(hist[newIdx]);
    skipHistoryRef.current = true;
    setDimensions(restored.dimensions);
    setSeries(restored.series);
    setScaleMin(restored.scaleMin);
    setScaleMax(restored.scaleMax);
    setChartStyle(restored.chartStyle);
    setTimeout(() => { skipHistoryRef.current = false; }, 0);
  }, []);

  const redo = useCallback(() => {
    const hist = historyRef.current;
    const idx = historyIndexRef.current;
    if (idx >= hist.length - 1) return;
    const newIdx = idx + 1;
    historyIndexRef.current = newIdx;
    const restored = applySnapshot(hist[newIdx]);
    skipHistoryRef.current = true;
    setDimensions(restored.dimensions);
    setSeries(restored.series);
    setScaleMin(restored.scaleMin);
    setScaleMax(restored.scaleMax);
    setChartStyle(restored.chartStyle);
    setTimeout(() => { skipHistoryRef.current = false; }, 0);
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Z') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const addDimension = useCallback(() => {
    pushHistory();
    const dim: Dimension = { id: uid(), label: `Dimension ${dimensions.length + 1}` };
    setDimensions((prev) => [...prev, dim]);
    setSeries((prev) =>
      prev.map((ser) => ({ ...ser, values: { ...ser.values, [dim.id]: 50 } }))
    );
  }, [pushHistory, dimensions]);

  const removeDimension = useCallback((id: string) => {
    pushHistory();
    setDimensions((prev) => {
      if (prev.length <= 3) return prev;
      return prev.filter((d) => d.id !== id);
    });
    setSeries((prev) =>
      prev.map((ser) => {
        const vals = { ...ser.values };
        delete vals[id];
        return { ...ser, values: vals };
      })
    );
  }, [pushHistory]);

  const updateDimension = useCallback((id: string, label: string) => {
    pushHistory();
    setDimensions((prev) => prev.map((d) => (d.id === id ? { ...d, label } : d)));
  }, [pushHistory]);

  const addSeries = useCallback(() => {
    pushHistory();
    setSeries((prev) => {
      const s = makeDefaultSeries(dimensions, prev.length);
      return [...prev, s];
    });
  }, [pushHistory, dimensions]);

  const removeSeries = useCallback((id: string) => {
    pushHistory();
    setSeries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((s) => s.id !== id);
    });
  }, [pushHistory]);

  const updateSeries = useCallback((id: string, patch: Partial<Omit<Series, 'id'>>) => {
    pushHistory();
    setSeries((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, [pushHistory]);

  const updateSeriesValue = useCallback((seriesId: string, dimId: string, value: number) => {
    pushHistory();
    setSeries((prev) =>
      prev.map((s) =>
        s.id === seriesId ? { ...s, values: { ...s.values, [dimId]: value } } : s
      )
    );
  }, [pushHistory]);

  const updateChartStyle = useCallback((patch: Partial<ChartStyle>) => {
    pushHistory();
    setChartStyle((prev) => ({ ...prev, ...patch }));
  }, [pushHistory]);

  const loadPreset = useCallback(
    (dims: string[], sers: { name: string; color: string; values: number[] }[]) => {
      pushHistory();
      const newDims: Dimension[] = dims.map((label) => ({ id: uid(), label }));
      const newSeries: Series[] = sers.map((ser) => {
        const values: Record<string, number> = {};
        newDims.forEach((d, j) => { values[d.id] = ser.values[j] ?? 50; });
        return {
          id: uid(),
          name: ser.name,
          color: ser.color,
          fillOpacity: 0.2,
          values,
        };
      });
      setDimensions(newDims);
      setSeries(newSeries);
    },
    [pushHistory]
  );

  const exportState = useCallback((): Snapshot => {
    return takeSnapshot(dimensions, series, scaleMin, scaleMax, chartStyle);
  }, [dimensions, series, scaleMin, scaleMax, chartStyle]);

  const restoreFromState = useCallback((state: Snapshot) => {
    pushHistory();
    const restored = applySnapshot(state);
    setDimensions(restored.dimensions);
    setSeries(restored.series);
    setScaleMin(restored.scaleMin);
    setScaleMax(restored.scaleMax);
    setChartStyle(restored.chartStyle);
  }, [pushHistory]);

  return {
    dimensions,
    series,
    scaleMin,
    scaleMax,
    chartStyle,
    canUndo,
    canRedo,
    undo,
    redo,
    setScaleMin,
    setScaleMax,
    updateChartStyle,
    addDimension,
    removeDimension,
    updateDimension,
    addSeries,
    removeSeries,
    updateSeries,
    updateSeriesValue,
    loadPreset,
    exportState,
    restoreFromState,
  };
}

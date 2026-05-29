import type { Dimension, Series, ChartStyle } from '../types';

interface SvgOptions {
  width: number;
  height: number;
  dimensions: Dimension[];
  series: Series[];
  scaleMin: number;
  scaleMax: number;
  style: ChartStyle;
}

export function renderRadarSvg(opts: SvgOptions): string {
  const { width, height, dimensions, series, scaleMin, scaleMax, style } = opts;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 60;
  const levels = 5;
  const count = dimensions.length;
  if (count < 3) return '';

  const angleStep = (Math.PI * 2) / count;
  const startAngle = -Math.PI / 2;

  function point(i: number, r: number): [number, number] {
    const a = startAngle + i * angleStep;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Grid
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l;
    if (style.circular) {
      svg += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${style.gridColor}" stroke-width="${style.gridWidth}"/>`;
    } else {
      const pts = Array.from({ length: count }, (_, i) => point(i, r).join(',')).join(' ');
      svg += `<polygon points="${pts}" fill="none" stroke="${style.gridColor}" stroke-width="${style.gridWidth}"/>`;
    }
  }

  // Axis lines
  for (let i = 0; i < count; i++) {
    const [x, y] = point(i, radius);
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${style.angleLineColor}" stroke-width="${style.angleLineWidth}"/>`;
  }

  // Data series (reverse so first series is on top)
  for (let si = series.length - 1; si >= 0; si--) {
    const ser = series[si];
    const pts = dimensions.map((d, i) => {
      const val = ser.values[d.id] ?? scaleMin;
      const ratio = (val - scaleMin) / (scaleMax - scaleMin);
      return point(i, radius * ratio).join(',');
    }).join(' ');

    const fillAlpha = style.fillArea ? ser.fillOpacity : 0;
    const fillHex = Math.round(fillAlpha * 255).toString(16).padStart(2, '0');

    svg += `<polygon points="${pts}" fill="${ser.color}${fillHex}" stroke="${ser.color}" stroke-width="2" stroke-linejoin="round"/>`;

    // Data points
    if (style.showPoints) {
      for (let i = 0; i < count; i++) {
        const val = ser.values[dimensions[i].id] ?? scaleMin;
        const ratio = (val - scaleMin) / (scaleMax - scaleMin);
        const [px, py] = point(i, radius * ratio);
        svg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="${ser.color}" stroke="white" stroke-width="1.5"/>`;
      }
    }
  }

  // Labels
  for (let i = 0; i < count; i++) {
    const [lx, ly] = point(i, radius + 18);
    const label = escapeXml(dimensions[i].label);
    svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="bold" fill="#374151" font-family="${style.fontFamily}">${label}</text>`;
  }

  // Scale labels
  for (let l = 1; l <= levels; l++) {
    const val = scaleMin + ((scaleMax - scaleMin) / levels) * l;
    const [lx] = point(0, (radius / levels) * l);
    svg += `<text x="${lx.toFixed(1)}" y="${cy - (radius / levels) * l - 4}" text-anchor="middle" font-size="9" fill="#9ca3af" font-family="${style.fontFamily}">${Math.round(val)}</text>`;
  }

  svg += '</svg>';
  return svg;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function downloadSvg(svgString: string, filename: string = 'radar-chart.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

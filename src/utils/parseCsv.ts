interface CsvResult {
  dimensions: string[];
  series: { name: string; color: string; values: number[] }[];
}

const CSV_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export function parseCsv(text: string): CsvResult | null {
  const lines = text
    .trim()
    .split(/\n|\r\n/)
    .filter((l) => l.trim());

  if (lines.length < 2) return null;

  const parseLine = (line: string): string[] => {
    // Try comma first, then tab
    const sep = line.includes(',') ? ',' : '\t';
    return line.split(sep).map((s) => s.trim().replace(/^"|"$/g, ''));
  };

  const header = parseLine(lines[0]);
  // First column is series name column
  const dimensions = header.slice(1);
  if (dimensions.length < 3) return null;

  const series: CsvResult['series'] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const name = cols[0];
    const values = cols.slice(1).map(Number);
    // Pad or trim to dimension count
    while (values.length < dimensions.length) values.push(50);
    const trimmed = values.slice(0, dimensions.length);
    if (trimmed.some(isNaN)) continue;
    series.push({
      name,
      color: CSV_COLORS[(i - 1) % CSV_COLORS.length],
      values: trimmed,
    });
  }

  if (series.length === 0) return null;
  return { dimensions, series };
}

import html2canvas from 'html2canvas';

export async function exportChart(element: HTMLElement, filename: string = 'radar-chart.png') {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

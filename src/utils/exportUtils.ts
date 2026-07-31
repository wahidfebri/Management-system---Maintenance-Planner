export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToCsv(filename: string, dataArray: Record<string, any>[]) {
  if (!dataArray || dataArray.length === 0) return;
  const headers = Object.keys(dataArray[0]);
  const rows = dataArray.map((item) =>
    headers.map((h) => {
      const val = item[h];
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val);
      }
      return val ?? '';
    })
  );
  exportToCSV(filename, headers, rows);
}

export function triggerPrintReport() {
  window.print();
}

export function printReport() {
  window.print();
}

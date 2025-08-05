// ==============================
// detail_backup.js - mit Chart Import
// ==============================

import Chart from 'chart.js/auto';

// Backup-Version der Chart-Initialisierung
const ctx = document.getElementById('myChartBackup');

if (ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'Backup Dataset',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
} else {
  console.warn("Kein Canvas-Element mit ID 'myChartBackup' gefunden.");
}
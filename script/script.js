const ctx1 = document.getElementById('myChart');
new Chart(ctx1, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 des artistes (Nombres de morceaux)',
      },
      legend: {
        display: false // Désactiver la légende
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }
});

const ctx2 = document.getElementById('myChart2');
new Chart(ctx2, {
  type: 'pie',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: 'Distribution des genres musicaux'
      }
    }
  }
});

let spotifyData = [];

fetch('./data/data.json')
  .then(response => response.json())
  .then(data => {
    spotifyData = data;
    renderTopArtists(data);
    renderGenres(data);
  })
  .catch(error => console.error("Erreur chargement JSON :", error));

// === GRAPH BARRES : TOP 10 ARTISTES (horizontal) ===
function renderTopArtists(data) {
  const artistCount = {};

  data.forEach(track => {
    track.artists.forEach(artist => {
      if (!artist.name) return;
      artistCount[artist.name] = (artistCount[artist.name] || 0) + 1;
    });
  });

  const topArtists = Object.entries(artistCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = topArtists.map(a => a[0]);
  const values = topArtists.map(a => a[1]);

  new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nombre de morceaux',
        data: values,
        backgroundColor: '#0d6efd'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top 10 des artistes (nombre de morceaux)'
        },
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
}

// === CAMEMBERT : GENRES ===
function renderGenres(data) {
  const genreCount = {};

  // Les genres sont dans data.artists (niveau racine du fichier)
  data.forEach(entry => {
    if (entry.artists && Array.isArray(entry.artists)) {
      entry.artists.forEach(artist => {
        if (artist.genres && Array.isArray(artist.genres)) {
          artist.genres.forEach(genre => {
            if (genre) {
              genreCount[genre] = (genreCount[genre] || 0) + 1;
            }
          });
        }
      });
    }
  });

  const labels = Object.keys(genreCount);
  const values = Object.values(genreCount);

  if (labels.length === 0) return; // Rien à afficher

  new Chart(document.getElementById('myChart2'), {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#f87171', '#60a5fa', '#facc15', '#4ade80',
          '#c084fc', '#fb923c', '#0ea5e9', '#a3a3a3'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        title: {
          display: true,
          text: 'Distribution des genres musicaux'
        }
      }
    }
  });
}

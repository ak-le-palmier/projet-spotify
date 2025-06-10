let spotifyData = [];

fetch('./data/data.json')
  .then(response => response.json())
  .then(data => {
    spotifyData = data;
    renderTopArtists(data);
    renderGenres(data);
    renderTrackList(data);
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

  if (labels.length === 0) return;

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

// === TABLE DES MORCEAUX + BOUTON DÉTAILS ===
function renderTrackList(data) {
  const tbody = document.querySelector("#morceauxTable tbody");
  tbody.innerHTML = "";

  data.forEach((track, index) => {
    const title = track.name || "Sans titre";
    const artists = track.artists?.map(a => a.name).join(", ") || "Inconnu";
    const album = track.album?.name || "Inconnu";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${title}</td>
      <td>${artists}</td>
      <td>${album}</td>
      <td><button class="btn btn-sm btn-primary" data-index="${index}">Détails</button></td>
    `;
    tbody.appendChild(tr);
  });

  const table = $('#morceauxTable').DataTable({
    paging: false,
    info: false,
    searching: true,
    responsive: true,
    language: {
      zeroRecords: "Aucun morceau trouvé",
      search: "",
    }
  });

  $('#searchInput').on('keyup', function () {
    table.search(this.value).draw();
  });

  $('#morceauxTable').on('click', 'button[data-index]', function () {
    const track = spotifyData[this.dataset.index];
    showTrackModal(track);
  });
}

// === MODAL DÉTAIL DU MORCEAU ===
function showTrackModal(track) {
  document.getElementById("modal-track-title").textContent = track.name || "Sans titre";

  const preview = document.getElementById("modal-preview");
  preview.src = track.preview_url || "";
  preview.style.display = track.preview_url ? "block" : "none";

  document.getElementById("modal-album-name").textContent = track.album?.name || "Inconnu";
  document.getElementById("modal-release-date").textContent = track.album?.release_date || "";
  document.getElementById("modal-cover").src = track.album?.images?.[0]?.url || "";

  document.getElementById("modal-album-popularity").textContent = `Popularité: ${track.album?.popularity || 0}/100`;

  const durationSec = Math.floor((track.duration_ms || 0) / 1000);
  const min = Math.floor(durationSec / 60);
  const sec = String(durationSec % 60).padStart(2, "0");
  document.getElementById("modal-duration").textContent = `${min}:${sec}`;

  const popularity = track.popularity || 0;
  document.getElementById("modal-popularity-bar").style.width = `${popularity}%`;
  document.getElementById("modal-popularity-value").textContent = `${popularity}/100`;

  document.getElementById("modal-track-number").textContent = track.track_number || "-";
  document.getElementById("modal-explicit").textContent = track.explicit ? "Oui" : "Non";

  const artistList = document.getElementById("modal-artists");
  artistList.innerHTML = "";
  track.artists?.forEach(artist => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${artist.name}</strong>`;
    artistList.appendChild(li);
  });

  const genreWrap = document.getElementById("modal-genres");
  genreWrap.innerHTML = "";
  let genres = [];
  if (track.album?.artists) {
    track.album.artists.forEach(a => {
      if (a.genres) genres.push(...a.genres);
    });
  }
  [...new Set(genres)].forEach(genre => {
    const span = document.createElement("span");
    span.className = "badge bg-secondary";
    span.textContent = genre;
    genreWrap.appendChild(span);
  });

  document.getElementById("modal-spotify-link").href = track.external_urls?.spotify || "#";

  const modal = new bootstrap.Modal(document.getElementById('trackModal'));
  modal.show();
}

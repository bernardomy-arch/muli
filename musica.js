document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-player');
    const fileInput = document.getElementById('file-input');
    const btnCargar = document.getElementById('btn-cargar');
    const btnPlay = document.getElementById('btn-play');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const playlistEl = document.getElementById('playlist');
    const trackTitle = document.getElementById('track-title');
    const trackStatus = document.getElementById('track-status');

    let playlist = []; // Array de objetos { file, name, url, played }
    let currentIndex = -1;

    // 1. Botón "Cargar": Abrir el selector de archivos local
    btnCargar.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            playlist.push({
                file: file,
                name: file.name,
                url: URL.createObjectURL(file),
                played: false
            });
        });

        renderPlaylist();

        // Cargar automáticamente la primera canción si no hay ninguna activa
        if (currentIndex === -1 && playlist.length > 0) {
            loadTrack(0);
        }
    });

    // 2. Renderizar la lista de reproducción
    function renderPlaylist() {
        playlistEl.innerHTML = '';

        if (playlist.length === 0) {
            playlistEl.innerHTML = '<li class="playlist-empty">La lista está vacía</li>';
            return;
        }

        playlist.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            
            if (index === currentIndex) li.classList.add('active');
            if (item.played) li.classList.add('played');

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${index + 1}. ${item.name}`;
            nameSpan.style.overflow = 'hidden';
            nameSpan.style.textOverflow = 'ellipsis';
            nameSpan.style.whiteSpace = 'nowrap';

            const statusSpan = document.createElement('span');
            if (index === currentIndex && !audio.paused) {
                statusSpan.textContent = '▶ Sonando';
            } else if (item.played) {
                statusSpan.textContent = '✔ Escuchada';
            } else {
                statusSpan.textContent = '⏳ En espera';
            }

            li.appendChild(nameSpan);
            li.appendChild(statusSpan);

            // Hacer clic en cualquier tema de la lista para reproducirlo
            li.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
            });

            playlistEl.appendChild(li);
        });
    }

    // 3. Cargar pista seleccionada
    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        currentIndex = index;
        audio.src = playlist[currentIndex].url;
        trackTitle.textContent = playlist[currentIndex].name;
        trackStatus.textContent = 'Listo para reproducir';
        renderPlaylist();
    }

    // 4. Reproducir pista
    function playTrack() {
        if (currentIndex === -1) return;
        audio.play().then(() => {
            btnPlay.textContent = '⏸️ Pausa';
            trackStatus.textContent = 'Reproduciendo...';
            renderPlaylist();
        }).catch(err => {
            console.error("Error al reproducir:", err);
        });
    }

    // 5. Pausar pista
    function pauseTrack() {
        audio.pause();
        btnPlay.textContent = '▶️ Play';
        trackStatus.textContent = 'Pausado';
        renderPlaylist();
    }

    // 6. Botón "Reproducir / Pausar"
    btnPlay.addEventListener('click', () => {
        if (currentIndex === -1) {
            alert('Carga al menos un archivo de audio/vídeo primero.');
            return;
        }
        if (audio.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    });

    // 7. Botón "Siguiente"
    btnSiguiente.addEventListener('click', () => {
        if (playlist.length === 0) return;
        
        // Marcar la actual como escuchada antes de avanzar
        if (currentIndex !== -1) {
            playlist[currentIndex].played = true;
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex >= playlist.length) {
            nextIndex = 0; // Regresa al inicio si llega al final
        }
        loadTrack(nextIndex);
        playTrack();
    });

    // 8. Evento: Al terminar la canción
    audio.addEventListener('ended', () => {
        if (currentIndex !== -1) {
            playlist[currentIndex].played = true; // Marcar como reproducida/escuchada
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
            loadTrack(nextIndex);
            playTrack();
        } else {
            pauseTrack();
            trackStatus.textContent = 'Fin de la lista de reproducción';
            renderPlaylist();
        }
    });
});
// --- CONFIG: add your tracks here ---
// If you uploaded files to assets/audio/, list filenames like "assets/audio/track1.mp3"
// You can also use public MP3 URLs for testing.
const tracks = [
  { title: "Sample Song 1", artist: "Artist A", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Sample Song 2", artist: "Artist B", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      // Example local file if you uploaded: { title: "My Local Track", artist: "Me", src: "assets/audio/mytrack.mp3" }
      ];

      // --- DOM references ---
      const trackTitle = document.getElementById("track-title");
      const trackArtist = document.getElementById("track-artist");
      const playPauseBtn = document.getElementById("playPauseBtn");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const progress = document.getElementById("progress");
      const currentTimeEl = document.getElementById("currentTime");
      const durationEl = document.getElementById("duration");
      const volume = document.getElementById("volume");
      const shuffleBtn = document.getElementById("shuffleBtn");
      const repeatBtn = document.getElementById("repeatBtn");
      const trackListEl = document.getElementById("trackList");
      const cover = document.getElementById("cover");

      // --- Player state ---
      let audio = new Audio();
      let current = 0;
      let isPlaying = false;
      let isShuffle = false;
      let repeatMode = 0; // 0 = off, 1 = repeat one, 2 = repeat all

      // --- Build playlist UI ---
      function renderPlaylist() {
        trackListEl.innerHTML = "";
          tracks.forEach((t, i) => {
              const li = document.createElement("li");
                  li.innerHTML = `<div><strong>${t.title}</strong><div style="color:var(--muted);font-size:.9rem">${t.artist}</div></div>
                        <div>
                                <button data-i="${i}" class="play-now">Play</button>
                                      </div>`;
                                          if (i === current) li.classList.add("active");
                                              trackListEl.appendChild(li);
                                                });
                                                }
                                                renderPlaylist();

                                                // --- Load track ---
                                                function loadTrack(index) {
                                                  if (!tracks[index]) return;
                                                    current = index;
                                                      audio.src = tracks[index].src;
                                                        audio.load();
                                                          trackTitle.textContent = tracks[index].title;
                                                            trackArtist.textContent = tracks[index].artist;
                                                              // optional: set cover color or image:
                                                                cover.style.background = `linear-gradient(120deg, ${index%2? "#2b2b6b":"#143a70"}, ${index%2? "#4D7CFF":"#2a5eff"})`;
                                                                  updateActiveInList();
                                                                  }

                                                                  // --- Update playlist highlight ---
                                                                  function updateActiveInList() {
                                                                    Array.from(trackListEl.children).forEach((li, i) => {
                                                                        li.classList.toggle("active", i === current);
                                                                          });
                                                                          }

                                                                          // --- Play / Pause ---
                                                                          function play() {
                                                                            audio.play().catch(()=>{});
                                                                              isPlaying = true;
                                                                                playPauseBtn.textContent = "⏸";
                                                                                  playPauseBtn.classList.remove("play");
                                                                                  }
                                                                                  function pause() {
                                                                                    audio.pause();
                                                                                      isPlaying = false;
                                                                                        playPauseBtn.textContent = "▶";
                                                                                          playPauseBtn.classList.add("play");
                                                                                          }
                                                                                          playPauseBtn.addEventListener("click", () => {
                                                                                            if (!audio.src) loadTrack(current);
                                                                                              if (isPlaying) pause(); else play();
                                                                                              });

                                                                                              // --- Prev / Next ---
                                                                                              prevBtn.addEventListener("click", () => {
                                                                                                if (audio.currentTime > 3) {
                                                                                                    audio.currentTime = 0;
                                                                                                      } else {
                                                                                                          changeTrack(-1);
                                                                                                            }
                                                                                                            });
                                                                                                            nextBtn.addEventListener("click", () => changeTrack(1));

                                                                                                            function changeTrack(dir) {
                                                                                                              if (isShuffle) {
                                                                                                                  current = Math.floor(Math.random() * tracks.length);
                                                                                                                    } else {
                                                                                                                        current = (current + dir + tracks.length) % tracks.length;
                                                                                                                          }
                                                                                                                            loadTrack(current);
                                                                                                                              play();
                                                                                                                              }

                                                                                                                              // --- Progress updating ---
                                                                                                                              audio.addEventListener("loadedmetadata", () => {
                                                                                                                                durationEl.textContent = formatTime(audio.duration || 0);
                                                                                                                                  progress.max = Math.floor(audio.duration || 0);
                                                                                                                                  });
                                                                                                                                  audio.addEventListener("timeupdate", () => {
                                                                                                                                    progress.value = Math.floor(audio.currentTime);
                                                                                                                                      currentTimeEl.textContent = formatTime(audio.currentTime);
                                                                                                                                      });

                                                                                                                                      // Seek by progress slider
                                                                                                                                      progress.addEventListener("input", () => {
                                                                                                                                        audio.currentTime = progress.value;
                                                                                                                                        });

                                                                                                                                        // Format time helper
                                                                                                                                        function formatTime(sec = 0) {
                                                                                                                                          sec = Math.floor(sec);
                                                                                                                                            const m = Math.floor(sec / 60);
                                                                                                                                              const s = sec % 60;
                                                                                                                                                return `${m}:${s.toString().padStart(2,"0")}`;
                                                                                                                                                }

                                                                                                                                                // --- Volume ---
                                                                                                                                                volume.addEventListener("input", () => {
                                                                                                                                                  audio.volume = Number(volume.value);
                                                                                                                                                  });
                                                                                                                                                  audio.volume = Number(volume.value);

                                                                                                                                                  // --- Shuffle / Repeat ---
                                                                                                                                                  shuffleBtn.addEventListener("click", () => {
                                                                                                                                                    isShuffle = !isShuffle;
                                                                                                                                                      shuffleBtn.style.opacity = isShuffle ? "1" : "0.65";
                                                                                                                                                      });
                                                                                                                                                      repeatBtn.addEventListener("click", () => {
                                                                                                                                                        repeatMode = (repeatMode + 1) % 3;
                                                                                                                                                          repeatBtn.style.opacity = repeatMode ? "1" : "0.65";
                                                                                                                                                          });

                                                                                                                                                          // --- End of track behavior ---
                                                                                                                                                          audio.addEventListener("ended", () => {
                                                                                                                                                            if (repeatMode === 1) {
                                                                                                                                                                audio.currentTime = 0;
                                                                                                                                                                    play();
                                                                                                                                                                      } else if (repeatMode === 2) {
                                                                                                                                                                          changeTrack(1);
                                                                                                                                                                            } else {
                                                                                                                                                                                // no repeat: move next by default or stop at end
                                                                                                                                                                                    if (current < tracks.length - 1) changeTrack(1); else pause();
                                                                                                                                                                                      }
                                                                                                                                                                                      });

                                                                                                                                                                                      // --- Click playlist play-now →
                                                                                                                                                                                      trackListEl.addEventListener("click", (e) => {
                                                                                                                                                                                        const btn = e.target.closest("button[data-i]");
                                                                                                                                                                                          if (!btn) return;
                                                                                                                                                                                            const i = Number(btn.dataset.i);
                                                                                                                                                                                              loadTrack(i);
                                                                                                                                                                                                play();
                                                                                                                                                                                                });

                                                                                                                                                                                                // --- Initialize first track if any ---
                                                                                                                                                                                                if (tracks.length) loadTrack(0);
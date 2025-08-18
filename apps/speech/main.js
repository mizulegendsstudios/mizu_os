let speechHTML = '';
let speechCSS = '';

function loadSpeechAssets() {
  if (speechHTML && speechCSS) return Promise.resolve();
  return Promise.all([
    fetch('apps/speech/index.html').then(r => r.text()).then(txt => { speechHTML = txt; }),
    fetch('apps/speech/styles.css').then(r => r.text()).then(txt => { speechCSS = txt; })
  ]);
}

window.initAppSpeech = function(container) {
  loadSpeechAssets().then(() => {
    container.innerHTML = speechHTML;
    if (!document.getElementById('speech-styles')) {
      const style = document.createElement('style');
      style.id = 'speech-styles';
      style.textContent = speechCSS;
      document.head.appendChild(style);
    }
    // Toda la lógica JS adaptada para #app-speech
    const root = container.querySelector('#app-speech');
    if (!root) return;
    const $ = s => root.querySelector(s);
    const $$ = s => root.querySelectorAll(s);
    const mainBox = $("#mainBox"), compInfo = $("#compatibilityInfo"), txt = $("#textInput"), st = $("#status");
    const btnPlay = $("#btnPlay"), btnStop = $("#btnStop"), btnConfig = $("#btnConfig"), modal = $("#configModal");
    const voiceSel = $("#voiceSelect"), rateR = $("#rateR"), pitchR = $("#pitchR"), volR = $("#volumeR");
    const rateV = $("#rateValue"), pitchV = $("#pitchValue"), volV = $("#volumeValue");
    const skipSym = $("#skipSymbols"), skipEmoji = $("#skipEmojis"), themeSel = $("#themeSel"), langSel = $("#langSel");
    const compatThemeSel = $("#compatThemeSel"), compatLangSel = $("#compatLangSel");
    const STORAGE_KEY = "mizuSpeechSettings";
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      lang: "en-US", rate: 1, pitch: 1, volume: 1, theme: "dark",
      voiceURI: null, skipSymbols: true, skipEmojis: true
    };
    const translations = {
      "es-ES": {
        appTitle: "Mizu Speech", statusReady: "Preparado. Escribe algo para narrar...",
        placeholder: "Escribe aquí el texto que quieres que narre...", play: "Reproducir", stop: "Detener", config: "Configuración",
        compatible: "Compatibles", incompatible: "No compatibles", settings: "Configuración", modalTitle: "Configuración",
        voice: "Voz:", rate: "Velocidad:", pitch: "Tono:", volume: "Volumen:",
        skipSymbols: "Omitir símbolos:", skipEmojis: "Omitir emojis:",
        theme: "Tema:", language: "Idioma:", dark: "Oscuro", light: "Claro", daltonic: "Daltonico",
        spanish: "Español", english: "English", noText: "No hay texto para narrar",
        filteredEmpty: "Texto filtrado está vacío", narrating: "Narrando...",
        narrationCompleted: "Narración completada", narrationStopped: "Narración detenida",
        errorNarrating: "Error al narrar", voicesDetected: "voces detectadas"
      },
      "en-US": {
        appTitle: "Mizu Speech", statusReady: "Ready. Write something to narrate...",
        placeholder: "Write here the text you want to narrate...", play: "Play", stop: "Stop", config: "Settings",
        compatible: "Compatible", incompatible: "Incompatible", settings: "Settings", modalTitle: "Settings",
        voice: "Voice:", rate: "Rate:", pitch: "Pitch:", volume: "Volume:",
        skipSymbols: "Skip symbols:", skipEmojis: "Skip emojis:",
        theme: "Theme:", language: "Language:", dark: "Dark", light: "Light", daltonic: "Colorblind",
        spanish: "Spanish", english: "English", noText: "No text to narrate",
        filteredEmpty: "Filtered text is empty", narrating: "Narrating...",
        narrationCompleted: "Narration completed", narrationStopped: "Narration stopped",
        errorNarrating: "Error narrating", voicesDetected: "voices detected"
      }
    };
    // pestañas
    $$(".main-tab").forEach(tab => tab.addEventListener("click", () => {
      $$(".main-tab").forEach(t => t.classList.remove("active"));
      $$(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      root.querySelector(`#${tab.dataset.tab}-tab`).classList.add("active");
      const firstOs = root.querySelector(`#${tab.dataset.tab}-tab .os-tab`);
      if (firstOs) {
        $$(".os-tab").forEach(t => t.classList.remove("active"));
        $$(".os-content").forEach(c => c.classList.remove("active"));
        firstOs.classList.add("active");
        root.querySelector(`#${firstOs.dataset.os}`).classList.add("active");
      }
    }));
    $$(".os-tab").forEach(tab => tab.addEventListener("click", () => {
      const container = tab.parentElement;
      container.querySelectorAll(".os-tab").forEach(t => t.classList.remove("active"));
      container.parentElement.querySelectorAll(".os-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      root.querySelector(`#${tab.dataset.os}`).classList.add("active");
    }));
    const checkCompatibility = () => {
      if (!window.speechSynthesis || window.speechSynthesis.getVoices().length === 0) {
        mainBox.style.display = "none"; compInfo.style.display = "block"; return false;
      }
      mainBox.style.display = "block"; compInfo.style.display = "none"; return true;
    };
    const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const applyTheme = () => root.className = settings.theme;
    const applyLang = () => {
      const t = translations[settings.lang];
      $("#appTitle").textContent = t.appTitle;
      txt.placeholder = t.placeholder;
      $(".play-text").textContent = t.play; $(".stop-text").textContent = t.stop; $(".config-text").textContent = t.config;
      root.querySelector(".modal h2").textContent = t.modalTitle;
      $$(".main-tab")[0].textContent = t.compatible; $$(".main-tab")[1].textContent = t.incompatible; $$(".main-tab")[2].textContent = t.settings;
      root.querySelectorAll(".modal>div>span:first-child")[0].textContent = t.voice; root.querySelectorAll(".modal>div>span:first-child")[1].textContent = t.rate;
      root.querySelectorAll(".modal>div>span:first-child")[2].textContent = t.pitch; root.querySelectorAll(".modal>div>span:first-child")[3].textContent = t.volume;
      root.querySelectorAll(".modal>div>span:first-child")[4].textContent = t.skipSymbols; root.querySelectorAll(".modal>div>span:first-child")[5].textContent = t.skipEmojis;
      root.querySelectorAll(".modal>div>span:first-child")[6].textContent = t.theme; root.querySelectorAll(".modal>div>span:first-child")[7].textContent = t.language;
      root.querySelectorAll("#settings-tab>div>span:first-child")[0].textContent = t.language; root.querySelectorAll("#settings-tab>div>span:first-child")[1].textContent = t.theme;
      root.querySelectorAll(".voices-detected").forEach(el => el.textContent = t.voicesDetected);
      st.textContent = t.statusReady;
    };
    const loadVoices = () => {
      if (!checkCompatibility()) return;
      const voices = speechSynthesis.getVoices();
      voiceSel.innerHTML = "";
      voices.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.voiceURI;
        opt.textContent = `${v.name} (${v.lang})${v.default?" - Default":""}`;
        opt.selected = v.voiceURI === settings.voiceURI;
        voiceSel.appendChild(opt);
      });
    };
    const filterText = str => {
      let out = str;
      if (settings.skipSymbols) {
        out = out.replace(/[^ - - \p{L}\p{N}\s.,;¿?¡!áéíóúüñÁÉÍÓÚÜÑ]/gu, ' ');
      }
      if (settings.skipEmojis) {
        out = out.replace(/[\u{1F600}-\u{1F6FF}]/gu, ' ');
      }
      return out.trim().replace(/\s+/g, ' ');
    };
    const speak = () => {
      const t = translations[settings.lang];
      if (!txt.value.trim()) { st.textContent = t.noText; return; }
      const filtered = filterText(txt.value);
      if (!filtered) { st.textContent = t.filteredEmpty; return; }
      const u = new SpeechSynthesisUtterance(filtered);
      const voices = speechSynthesis.getVoices();
      const v = voices.find(v => v.voiceURI === settings.voiceURI) ||
                voices.find(v => v.lang.startsWith(settings.lang)) ||
                voices.find(v => v.default);
      if (v) { u.voice = v; u.lang = settings.lang; }
      u.rate = settings.rate; u.pitch = settings.pitch; u.volume = settings.volume;
      u.onstart = () => { btnPlay.disabled = true; btnStop.disabled = false; st.textContent = t.narrating; };
      u.onend = () => { btnPlay.disabled = false; btnStop.disabled = true; st.textContent = t.narrationCompleted; };
      u.onerror = () => { btnPlay.disabled = false; btnStop.disabled = true; st.textContent = t.errorNarrating; };
      speechSynthesis.speak(u);
    };
    const stop = () => {
      speechSynthesis.cancel();
      btnPlay.disabled = false; btnStop.disabled = true;
      st.textContent = translations[settings.lang].narrationStopped;
    };
    btnPlay.addEventListener("click", speak);
    btnStop.addEventListener("click", stop);
    btnConfig.addEventListener("click", () => { modal.style.display = "flex"; loadVoices(); });
    root.querySelector(".closeBtn").addEventListener("click", () => modal.style.display = "none");
    [rateR,pitchR,volR].forEach(sl => sl.addEventListener("input", () => {
      settings[sl.id.replace('R','')] = parseFloat(sl.value);
      root.querySelector("#"+sl.id.replace('R','Value')).textContent = parseFloat(sl.value).toFixed(1);
      save();
    }));
    voiceSel.addEventListener("change", e => { settings.voiceURI = e.target.value; save(); });
    skipSym.addEventListener("change", e => { settings.skipSymbols = e.target.checked; save(); });
    skipEmoji.addEventListener("change", e => { settings.skipEmojis = e.target.checked; save(); });
    themeSel.addEventListener("change", e => { settings.theme = e.target.value; applyTheme(); save(); });
    langSel.addEventListener("change", e => { settings.lang = e.target.value; save(); applyLang(); loadVoices(); });
    compatThemeSel.addEventListener("change", e => { settings.theme = e.target.value; applyTheme(); save(); });
    compatLangSel.addEventListener("change", e => { settings.lang = e.target.value; save(); applyLang(); });
    rateR.value = settings.rate; pitchR.value = settings.pitch; volR.value = settings.volume;
    rateV.textContent = settings.rate.toFixed(1); pitchV.textContent = settings.pitch.toFixed(1); volV.textContent = settings.volume.toFixed(1);
    skipSym.checked = settings.skipSymbols; skipEmoji.checked = settings.skipEmojis;
    applyLang(); applyTheme();
    if (checkCompatibility()) loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  });
};
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
    // Lógica de speech synthesis
    const settings = JSON.parse(localStorage.getItem("speech-settings")) || {
      lang: "es-ES", rate: 1, pitch: 1, volume: 1
    };
    // ... aquí va la lógica de reconocimiento o síntesis de voz ...
    // Ejemplo demo:
    const btn = container.querySelector('.speech-btn');
    const result = container.querySelector('.speech-result');
    if (btn && result) {
      btn.onclick = () => {
        result.textContent = 'Reconocimiento simulado: "Hola, Mizu OS!"';
      };
    }
  });
};
window.initAppSpeech = function(container) {
  fetch('apps/speech/index.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      // Cargar estilos solo una vez
      if (!document.getElementById('speech-style')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'speech-style';
        link.href = 'apps/speech/styles.css';
        document.head.appendChild(link);
      }
      // Lógica demo: mostrar texto simulado
      const btn = container.querySelector('.speech-btn');
      const result = container.querySelector('.speech-result');
      if (btn && result) {
        btn.onclick = () => {
          result.textContent = 'Reconocimiento simulado: "Hola, Mizu OS!"';
        };
      }
    });
};
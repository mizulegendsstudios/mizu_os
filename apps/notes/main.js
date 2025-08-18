window.initAppNotes = function(container) {
  fetch('apps/notes/index.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      // Cargar estilos solo una vez
      if (!document.getElementById('notes-style')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'notes-style';
        link.href = 'apps/notes/styles.css';
        document.head.appendChild(link);
      }
    });
};
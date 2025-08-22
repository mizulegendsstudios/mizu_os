let settingsHTML = '';
let settingsCSS = '';
function loadSettingsAssets() {
  if (settingsHTML && settingsCSS) return Promise.resolve();
  return Promise.all([
    fetch('apps/settings/index.html').then(r => r.text()).then(txt => { settingsHTML = txt; }),
    fetch('apps/settings/styles.css').then(r => r.text()).then(txt => { settingsCSS = txt; })
  ]);
}
window.initAppSettings = function(container) {
  loadSettingsAssets().then(() => {
    container.innerHTML = settingsHTML;
    if (!document.getElementById('settings-styles')) {
      const style = document.createElement('style');
      style.id = 'settings-styles';
      style.textContent = settingsCSS;
      document.head.appendChild(style);
    }
    // Lógica de configuración
    const root = container.querySelector('#app-settings');
    if (!root) return;
    const themeSelect = root.querySelector('#themeSelect');
    const langSelect = root.querySelector('#langSelect');
    const fontSizeSelect = root.querySelector('#fontSizeSelect');
    const resetBtn = root.querySelector('#resetBtn');
    // Cargar preferencias
    const prefs = JSON.parse(localStorage.getItem('mizuOS-settings') || '{}');
    if (prefs.theme) themeSelect.value = prefs.theme;
    if (prefs.lang) langSelect.value = prefs.lang;
    if (prefs.fontSize) fontSizeSelect.value = prefs.fontSize;
    // Aplicar preferencias
    function applyPrefs() {
      document.body.classList.remove('theme-dark','theme-light','theme-daltonic');
      document.body.classList.add('theme-' + themeSelect.value);
      document.documentElement.lang = langSelect.value;
      document.body.style.fontSize = fontSizeSelect.value === 'small' ? '14px' : fontSizeSelect.value === 'large' ? '20px' : '16px';
      localStorage.setItem('mizuOS-settings', JSON.stringify({
        theme: themeSelect.value,
        lang: langSelect.value,
        fontSize: fontSizeSelect.value
      }));
    }
    themeSelect.onchange = applyPrefs;
    langSelect.onchange = applyPrefs;
    fontSizeSelect.onchange = applyPrefs;
    resetBtn.onclick = () => {
      localStorage.removeItem('mizuOS-settings');
      themeSelect.value = 'dark';
      langSelect.value = 'es';
      fontSizeSelect.value = 'medium';
      applyPrefs();
    };
    applyPrefs();
  });
};
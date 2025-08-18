let notesHTML = '';
let notesCSS = '';

function loadNotesAssets() {
  if (notesHTML && notesCSS) return Promise.resolve();
  return Promise.all([
    fetch('apps/notes/index.html').then(r => r.text()).then(txt => { notesHTML = txt; }),
    fetch('apps/notes/styles.css').then(r => r.text()).then(txt => { notesCSS = txt; })
  ]);
}

window.initAppNotes = function(container) {
  loadNotesAssets().then(() => {
    container.innerHTML = notesHTML;
    if (!document.getElementById('notes-styles')) {
      const style = document.createElement('style');
      style.id = 'notes-styles';
      style.textContent = notesCSS;
      document.head.appendChild(style);
    }
    // Toda la lógica JS adaptada para #app-notes
    const root = container.querySelector('#app-notes');
    if (!root) return;
    const $ = s => root.querySelector(s);
    const tabsContainer = $("#tabs");
    const editor = $("#editor");
    const newTabBtn = $("#newTab");
    const exportBtn = $("#exportBtn");
    const exportType = $("#exportType");
    const filenameInput = $("#filename");
    const searchBar = $("#searchBar");
    const searchInput = $("#searchInput");
    const searchPrevBtn = $("#searchPrev");
    const searchNextBtn = $("#searchNext");
    const closeSearchBtn = $("#closeSearch");
    const searchInfo = $("#searchInfo");
    const helpBtn = $("#helpBtn");
    const linkBtn = $("#linkBtn");
    const shortcutsInfo = $("#shortcutsInfo");
    const overlay = $("#overlay");
    const closeShortcutsBtn = $("#closeShortcuts");
    let tabs = JSON.parse(localStorage.getItem("notes-tabs")) || [{ name: "Archivo 1", content: "" }];
    let currentTab = 0;
    let searchResults = [];
    let currentSearchIndex = -1;
    let searchQuery = "";
    function renderTabs() {
      tabsContainer.innerHTML = "";
      tabs.forEach((tab, i) => {
        const tabEl = document.createElement("div");
        tabEl.className = "tab" + (i === currentTab ? " active" : "");
        tabEl.textContent = tab.name || `Archivo ${i + 1}`;
        tabEl.onclick = () => switchTab(i);
        const closeBtn = document.createElement("button");
        closeBtn.className = "tab-close";
        closeBtn.innerHTML = "×";
        closeBtn.onclick = (e) => { e.stopPropagation(); closeTab(i); };
        tabEl.appendChild(closeBtn);
        tabsContainer.appendChild(tabEl);
      });
      filenameInput.value = tabs[currentTab]?.name || `Archivo${currentTab + 1}`;
    }
    function switchTab(index) {
      saveCurrentContent();
      currentTab = index;
      editor.value = tabs[currentTab].content;
      renderTabs();
      hideSearchBar();
    }
    function closeTab(index) {
      if (tabs.length <= 1) return;
      saveCurrentContent();
      tabs.splice(index, 1);
      if (currentTab >= tabs.length) {
        currentTab = tabs.length - 1;
      } else if (currentTab > index) {
        currentTab--;
      }
      editor.value = tabs[currentTab].content;
      renderTabs();
      localStorage.setItem("notes-tabs", JSON.stringify(tabs));
    }
    function saveCurrentContent() {
      if (tabs[currentTab]) {
        tabs[currentTab].content = editor.value;
        tabs[currentTab].name = filenameInput.value || `Archivo${currentTab + 1}`;
        localStorage.setItem("notes-tabs", JSON.stringify(tabs));
      }
    }
    function showSearchBar() {
      searchBar.classList.add("active");
      setTimeout(() => { searchInput.focus(); searchInput.select(); }, 100);
    }
    function hideSearchBar() {
      searchBar.classList.remove("active");
      searchResults = [];
      currentSearchIndex = -1;
      searchQuery = "";
    }
    function performSearch() {
      const query = searchInput.value;
      searchQuery = query;
      if (!query) { searchResults = []; currentSearchIndex = -1; updateSearchInfo(); return; }
      const content = editor.value;
      searchResults = [];
      let index = 0;
      while ((index = content.toLowerCase().indexOf(query.toLowerCase(), index)) !== -1) {
        searchResults.push(index);
        index += query.length;
      }
      currentSearchIndex = searchResults.length > 0 ? 0 : -1;
      updateSearchInfo();
      if (currentSearchIndex >= 0) highlightSearchResult();
    }
    function highlightSearchResult() {
      if (currentSearchIndex < 0 || currentSearchIndex >= searchResults.length) return;
      const start = searchResults[currentSearchIndex];
      const end = start + searchQuery.length;
      editor.focus();
      editor.setSelectionRange(start, end);
      const lineHeight = parseInt(getComputedStyle(editor).lineHeight);
      const lines = editor.value.substring(0, start).split('\n').length - 1;
      editor.scrollTop = lines * lineHeight;
    }
    function updateSearchInfo() {
      if (searchResults.length === 0) {
        searchInfo.textContent = "No se encontraron resultados";
      } else {
        searchInfo.textContent = `${currentSearchIndex + 1} de ${searchResults.length}`;
      }
    }
    function nextSearchResult() {
      if (searchResults.length === 0) return;
      currentSearchIndex = (currentSearchIndex + 1) % searchResults.length;
      updateSearchInfo();
      highlightSearchResult();
    }
    function prevSearchResult() {
      if (searchResults.length === 0) return;
      currentSearchIndex = currentSearchIndex <= 0 ? searchResults.length - 1 : currentSearchIndex - 1;
      updateSearchInfo();
      highlightSearchResult();
    }
    function showShortcuts() {
      shortcutsInfo.style.display = "block";
      overlay.style.display = "block";
    }
    function hideShortcuts() {
      shortcutsInfo.style.display = "none";
      overlay.style.display = "none";
    }
    function showSaveFeedback() {
      const originalText = exportBtn.textContent;
      exportBtn.textContent = "✅ Guardado";
      exportBtn.style.background = "#4CAF50";
      setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.style.background = "#555";
      }, 1000);
    }
    function createHyperlink() {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      if (start === end) { alert("Selecciona el texto que quieres convertir en enlace"); return; }
      const selectedText = editor.value.substring(start, end);
      const url = prompt("Ingresa la URL del enlace:");
      if (!url) return;
      const before = editor.value.substring(0, start);
      const after = editor.value.substring(end);
      const linkText = `[${selectedText}](${url})`;
      editor.value = before + linkText + after;
      editor.setSelectionRange(start, start + linkText.length);
      editor.focus();
      saveCurrentContent();
    }
    newTabBtn.onclick = () => {
      saveCurrentContent();
      tabs.push({ name: `Archivo ${tabs.length + 1}`, content: "" });
      currentTab = tabs.length - 1;
      editor.value = "";
      renderTabs();
      localStorage.setItem("notes-tabs", JSON.stringify(tabs));
    };
    editor.oninput = () => saveCurrentContent();
    filenameInput.oninput = () => saveCurrentContent();
    exportBtn.onclick = () => {
      const blob = new Blob([editor.value], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${filenameInput.value || "archivo"}.${exportType.value}`;
      a.click();
    };
    searchInput.oninput = performSearch;
    searchInput.onkeydown = (e) => { if (e.key === 'Escape') { hideSearchBar(); } };
    searchNextBtn.onclick = nextSearchResult;
    searchPrevBtn.onclick = prevSearchResult;
    closeSearchBtn.onclick = hideSearchBar;
    linkBtn.onclick = createHyperlink;
    helpBtn.onclick = showShortcuts;
    closeShortcutsBtn.onclick = hideShortcuts;
    overlay.onclick = hideShortcuts;
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n': e.preventDefault(); e.stopPropagation(); newTabBtn.click(); break;
          case 'w': e.preventDefault(); e.stopPropagation(); if (tabs.length > 1) { closeTab(currentTab); } break;
          case 'f': e.preventDefault(); e.stopPropagation(); showSearchBar(); break;
          case 's': e.preventDefault(); e.stopPropagation(); saveCurrentContent(); showSaveFeedback(); break;
        }
      } else {
        switch (e.key) {
          case 'F1': e.preventDefault(); showShortcuts(); break;
          case 'F3': e.preventDefault(); if (searchBar.classList.contains('active')) { nextSearchResult(); } break;
          case 'Escape': if (searchBar.classList.contains('active')) { hideSearchBar(); } else if (shortcutsInfo.style.display === 'block') { hideShortcuts(); } break;
        }
      }
      if (e.key === 'F3' && e.shiftKey) { e.preventDefault(); if (searchBar.classList.contains('active')) { prevSearchResult(); } }
    });
    editor.value = tabs[currentTab].content;
    renderTabs();
  });
};
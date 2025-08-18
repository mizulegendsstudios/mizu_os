let pixelHTML = '';
let pixelCSS = '';

function loadPixelAssets() {
  if (pixelHTML && pixelCSS) return Promise.resolve();
  return Promise.all([
    fetch('apps/pixel/index.html').then(r => r.text()).then(txt => { pixelHTML = txt; }),
    fetch('apps/pixel/styles.css').then(r => r.text()).then(txt => { pixelCSS = txt; })
  ]);
}

window.initAppPixel = function(container) {
  loadPixelAssets().then(() => {
    container.innerHTML = pixelHTML;
    if (!document.getElementById('pixel-styles')) {
      const style = document.createElement('style');
      style.id = 'pixel-styles';
      style.textContent = pixelCSS;
      document.head.appendChild(style);
    }
    // Toda la lógica JS adaptada para #app-pixel
    const root = container.querySelector('#app-pixel');
    if (!root) return;
    const $ = s => root.querySelector(s);
    const tabsContainer = $("#tabs");
    const newTabBtn = $("#newTab");
    const colorPicker = $("#colorPicker");
    const brushSize = $("#brushSize");
    const clearBtn = $("#clearBtn");
    const exportBtn = $("#exportBtn");
    const alphaSlider = $("#alphaSlider");
    const lightSlider = $("#lightSlider");
    const hslPreview = $("#hslPreview");
    const resizeSelect = $("#resizeSelect");
    const zoomInBtn = $("#zoomInBtn");
    const zoomOutBtn = $("#zoomOutBtn");
    const resetZoomBtn = $("#resetZoomBtn");
    const toggleGridBtn = $("#toggleGridBtn");
    const gridOverlay = $("#gridOverlay");
    const canvasContainer = $("#canvasContainer");
    const canvas = $("#pixelCanvas");
    const ctx = canvas.getContext("2d");
    let drawings = JSON.parse(localStorage.getItem("pixel-drawings")) || [];
    let currentTab = 0;
    let scale = 1;
    let isGridVisible = false;
    function createEmptyDrawing(size) {
      const pixels = Array(size).fill().map(() => Array(size).fill("rgba(0,0,0,0)"));
      return { name: `Dibujo ${drawings.length + 1}`, width: size, height: size, pixels, saved: true };
    }
    function renderTabs() {
      tabsContainer.innerHTML = "";
      drawings.forEach((drawing, i) => {
        const tab = document.createElement("div");
        tab.className = "tab" + (i === currentTab ? " active" : "");
        tab.innerHTML = `<span>${drawing.name}</span>`;
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "❌";
        closeBtn.className = "closeTab";
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          if (!drawing.saved && !confirm("¿Guardar antes de cerrar?")) {
            drawings.splice(i, 1);
            if (currentTab >= drawings.length) currentTab = drawings.length - 1;
            renderTabs();
            loadDrawing();
            saveAll();
          } else {
            saveDrawing();
            drawings.splice(i, 1);
            if (currentTab >= drawings.length) currentTab = drawings.length - 1;
            renderTabs();
            loadDrawing();
            saveAll();
          }
        };
        tab.onclick = () => switchTab(i);
        tab.appendChild(closeBtn);
        tabsContainer.appendChild(tab);
      });
    }
    function switchTab(index) {
      saveDrawing();
      currentTab = index;
      loadDrawing();
      renderTabs();
    }
    function saveDrawing() {
      drawings[currentTab].saved = true;
      localStorage.setItem("pixel-drawings", JSON.stringify(drawings));
    }
    function saveAll() {
      localStorage.setItem("pixel-drawings", JSON.stringify(drawings));
    }
    function loadDrawing() {
      const drawing = drawings[currentTab];
      canvas.width = drawing.width;
      canvas.height = drawing.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawing.pixels.forEach((row, y) => {
        row.forEach((color, x) => {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        });
      });
      updateGrid();
    }
    newTabBtn.onclick = () => {
      const size = parseInt(resizeSelect.value);
      drawings.push(createEmptyDrawing(size));
      currentTab = drawings.length - 1;
      renderTabs();
      loadDrawing();
      saveAll();
    };
    clearBtn.onclick = () => {
      const drawing = drawings[currentTab];
      drawing.pixels = createEmptyDrawing(drawing.width).pixels;
      drawing.saved = false;
      loadDrawing();
    };
    exportBtn.onclick = () => {
      const link = document.createElement("a");
      link.download = `${drawings[currentTab].name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    function applyZoom() {
      canvas.style.transform = `scale(${scale})`;
      updateGrid();
    }
    function zoomIn() { if (scale < 8) { scale *= 1.5; applyZoom(); } }
    function zoomOut() { if (scale > 0.5) { scale /= 1.5; applyZoom(); } }
    function resetZoom() { scale = 1; applyZoom(); }
    function updateGrid() {
      const drawing = drawings[currentTab];
      const cellSize = (canvas.width > 0 && canvas.height > 0) ? Math.min(canvasContainer.clientWidth / drawing.width, canvasContainer.clientHeight / drawing.height) * scale : 0;
      gridOverlay.style.setProperty('--cell-size', `${cellSize}px`);
    }
    function toggleGrid() {
      isGridVisible = !isGridVisible;
      gridOverlay.style.display = isGridVisible ? "block" : "none";
      toggleGridBtn.textContent = isGridVisible ? "#️⃣ Malla" : "⬜ Malla";
    }
    canvas.addEventListener("pointerdown", draw);
    canvas.addEventListener("pointermove", e => { if (e.buttons) draw(e); });
    function draw(e) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) * canvas.width / rect.width);
      const y = Math.floor((e.clientY - rect.top) * canvas.height / rect.height);
      const size = parseInt(brushSize.value);
      const alpha = parseFloat(alphaSlider.value);
      const light = parseInt(lightSlider.value);
      const baseColor = colorPicker.value;
      const hsl = hexToHSL(baseColor);
      const color = `hsla(${hsl.h}, ${hsl.s}%, ${light}%, ${alpha})`;
      ctx.fillStyle = color;
      for (let dx = 0; dx < size; dx++) {
        for (let dy = 0; dy < size; dy++) {
          const px = x + dx;
          const py = y + dy;
          if (px < canvas.width && py < canvas.height) {
            ctx.fillRect(px, py, 1, 1);
            drawings[currentTab].pixels[py][px] = color;
          }
        }
      }
      drawings[currentTab].saved = false;
    }
    function hexToHSL(hex) {
      let r = 0, g = 0, b = 0;
      if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16) / 255;
        g = parseInt(hex.slice(3, 5), 16) / 255;
        b = parseInt(hex.slice(5, 7), 16) / 255;
      }
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }
      return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    function updateHSLPreview() {
      const baseColor = colorPicker.value;
      const hsl = hexToHSL(baseColor);
      const light = parseInt(lightSlider.value);
      const alpha = parseFloat(alphaSlider.value);
      hslPreview.style.backgroundColor = `hsla(${hsl.h}, ${hsl.s}%, ${light}%, ${alpha})`;
    }
    colorPicker.addEventListener("input", updateHSLPreview);
    lightSlider.addEventListener("input", updateHSLPreview);
    alphaSlider.addEventListener("input", updateHSLPreview);
    resizeSelect.addEventListener("change", () => {
      const size = parseInt(resizeSelect.value);
      canvas.width = size;
      canvas.height = size;
      if (drawings[currentTab]) {
        drawings[currentTab] = createEmptyDrawing(size);
        loadDrawing();
        renderTabs();
        saveAll();
      }
    });
    zoomInBtn.addEventListener("click", zoomIn);
    zoomOutBtn.addEventListener("click", zoomOut);
    resetZoomBtn.addEventListener("click", resetZoom);
    toggleGridBtn.addEventListener("click", toggleGrid);
    window.addEventListener("resize", updateGrid);
    if (drawings.length === 0) {
      drawings.push(createEmptyDrawing(parseInt(resizeSelect.value)));
    }
    renderTabs();
    loadDrawing();
    updateHSLPreview();
    applyZoom();
  });
};
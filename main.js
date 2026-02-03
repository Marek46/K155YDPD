// ====== NASTAV SI ZDE SPRÁVNÉ CESTY K PANORAMATŮM ======
// Pokud máš obrázky ve složce assets, nech assets/...
// Pokud je máš vedle index.html, dej jen "pano1.jpg" atd.
const PANOS = [
  { src: "pano12.jpg", title: "Nádvoří" },
  { src: "pano2.jpg", title: "Celý hrad" },
  { src: "pano3.png", title: "Předhradí" },
];

let index = 0;
let viewer = null;

function $(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function loadPano(newIndex) {
  if (!PANOS.length) return;

  index = (newIndex + PANOS.length) % PANOS.length;

  // Znič starý viewer
  if (viewer && typeof viewer.destroy === "function") {
    viewer.destroy();
    viewer = null;
  }

  // Vytvoř nový viewer
  viewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama: PANOS[index].src,
    autoLoad: true,
    showControls: true,
    // Pokud chceš autorotate, nech -2, jinak dej 0
    autoRotate: ($("chkRotate")?.checked ?? true) ? -2 : 0,
    hfov: 90,
  });

  setText("panoTitle", PANOS[index].title);
  setText("panoCounter", `${index + 1} / ${PANOS.length}`);
}

function bindUI() {
  const prevBtn = $("prevPano");
  const nextBtn = $("nextPano");
  const resetBtn = $("btnReset");
  const rotateChk = $("chkRotate");

  if (prevBtn) prevBtn.addEventListener("click", () => loadPano(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => loadPano(index + 1));

  // klávesy ← →
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") loadPano(index - 1);
    if (e.key === "ArrowRight") loadPano(index + 1);
  });

  // reset
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!viewer) return;
      viewer.setYaw(0);
      viewer.setPitch(0);
      viewer.setHfov(90);
    });
  }

  // autorotate
  if (rotateChk) {
    rotateChk.addEventListener("change", () => {
      if (!viewer) return;
      viewer.setAutoRotate(rotateChk.checked ? -2 : 0);
    });
  }

  // rok
  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();
}

function start() {
  // kontrola, že existuje panorama element
  const panoDiv = $("panorama");
  if (!panoDiv) {
    console.error('Chybí <div id="panorama"></div> v index.html');
    return;
  }

  // kontrola, že Pannellum je dostupný
  if (typeof pannellum === "undefined") {
    console.error("Pannellum se nenačetl (zkontroluj <script src=...pannellum.js>)");
    return;
  }

  bindUI();
  loadPano(0);
}

document.addEventListener("DOMContentLoaded", start);

// Safe console polyfill: ensures console.* calls won't throw when devtools are closed (older browsers)
(function(){
  try {
    if (!window.console) window.console = {};
    var methods = ['log','debug','info','warn','error','assert','clear','count','dir','dirxml','exception','group','groupCollapsed','groupEnd','profile','profileEnd','time','timeEnd','trace'];
    for (var i=0;i<methods.length;i++){
      if (!window.console[methods[i]]) window.console[methods[i]] = function(){};
    }
  } catch (e) {
    // ignore
  }
})();

// --- VARIABLES GLOBALES ---
const baseImg = document.getElementById("lamp-base");
const shadeImg = document.getElementById("lamp-shade");
const bulbImg = document.getElementById("lamp-bulb");
const optionButtons = document.querySelectorAll(".option-btn");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const receiptEl = document.getElementById("receipt");
const askAiBtn = document.getElementById('ask-ai');
const clearAiBtn = document.getElementById('clear-ai');
const suggestionsOutput = document.getElementById('suggestions-output');

// Ruta base para las imágenes grandes
const imagePaths = {
  base: {
    "base-modern": "images/base-modern.png",
    "base-classic": "images/base-classic.png",
    "base-wood": "images/base-wood.png",
  },
  shade: {
    "shade-cone": "images/shade-cone.png",
    "shade-drum": "images/shade-drum.png",
    "shade-fabric": "images/shade-fabric.png",
  },
  bulb: {
    "bulb-led": "images/bulb-led.png",
    "bulb-incandescent": "images/bulb-incandescent.png",
  },
};

// --- ESTADO DEL DISEÑO ACTUAL ---
let currentDesign = {
  base: null,
  shade: null,
  bulb: null,
  totalPrice: 0,
};

// --- MANEJADOR DE CLIC EN BOTONES (selección de partes) ---
optionButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const part = btn.dataset.part || btn.getAttribute('data-part');
    const value = btn.dataset.value || btn.getAttribute('data-value');
    const price = parseFloat(btn.dataset.price || btn.getAttribute('data-price') || '0');

    // Quitar selección previa del mismo grupo
    document.querySelectorAll(`.option-btn[data-part="${part}"]`).forEach((b) => b.classList.remove('selected'));

    // Marcar el botón actual como seleccionado
    btn.classList.add('selected');

    // Actualizar imagen correspondiente en la previsualización
    const imgElement = part === 'base' ? baseImg : part === 'shade' ? shadeImg : bulbImg;
    // Preferir la miniatura del botón (si existe) para evitar recuadros vacíos o rutas distintas
    const thumb = btn.querySelector('img');
    let thumbSrc = thumb && thumb.getAttribute('src') ? thumb.getAttribute('src') : (thumb && thumb.src ? thumb.src : '');
    if (thumbSrc) {
      // encode spaces or special chars
      try { thumbSrc = encodeURI(thumbSrc); } catch (e) { /* ignore */ }
      imgElement.src = thumbSrc;
    } else if (imagePaths[part] && imagePaths[part][value]) {
      imgElement.src = imagePaths[part][value];
    } else {
      imgElement.src = '';
    }

    // manejar imagen rota: esconder si no carga
    imgElement.onload = () => { imgElement.style.display = 'block'; };
    imgElement.onerror = () => { imgElement.src = ''; imgElement.style.display = 'none'; };

    // Actualizar estado
    currentDesign[part] = { value, price };
    updateTotalPrice();
  });
});

// --- FUNCION PARA ACTUALIZAR PRECIO ---
function updateTotalPrice() {
  let total = 0;
  ["base", "shade", "bulb"].forEach((part) => {
    if (currentDesign[part]) {
      total += currentDesign[part].price;
    }
  });
  currentDesign.totalPrice = total;

  // Mostrar el precio
  let priceDisplay = document.getElementById("price-display");
  if (!priceDisplay) {
    priceDisplay = document.createElement("div");
    priceDisplay.id = "price-display";
    document.querySelector(".lamp-preview").appendChild(priceDisplay);
  }
  priceDisplay.textContent = `Precio total: $${total.toFixed(2)}`;
}

// --- EVENTO: AÑADIR AL CARRITO ---
addToCartBtn.addEventListener("click", () => {
  if (!currentDesign.base || !currentDesign.shade || !currentDesign.bulb) {
    alert("Por favor selecciona todas las partes antes de añadir al carrito.");
    return;
  }
  // Generar comprobante en DOM
  renderReceipt(currentDesign);
});

function renderReceipt(design) {
  if (!receiptEl) return;
  const date = new Date().toLocaleString();
  // Determine image sources (if images in preview use data-src or src)
  // Prefer the preview image; if empty, try to get the thumbnail from the selected option button
  const getSelectedThumb = (part) => {
    const sel = document.querySelector(`.option-btn[data-part="${part}"].selected`);
    if (sel) {
      const img = sel.querySelector('img');
      if (img && img.src) return img.src;
    }
    // fallback: find by data-value stored in currentDesign
    const val = currentDesign[part]?.value;
    if (val) {
      const btn = document.querySelector(`.option-btn[data-part="${part}"][data-value="${val}"]`);
      if (btn) {
        const img = btn.querySelector('img');
        if (img && img.src) return img.src;
      }
    }
    return '';
  };

  const baseSrc = (document.getElementById('lamp-base')?.src || '').trim() || getSelectedThumb('base');
  const shadeSrc = (document.getElementById('lamp-shade')?.src || '').trim() || getSelectedThumb('shade');
  const bulbSrc = (document.getElementById('lamp-bulb')?.src || '').trim() || getSelectedThumb('bulb');

  const html = `
    <div class="receipt-card">
      <h3>Comprobante de armado</h3>
      <div class="receipt-row"><strong>Fecha:</strong> ${date}</div>
      <div class="receipt-thumbs">
        ${baseSrc ? `<div class="thumb"><img src="${baseSrc}" alt="Base"></div>` : ''}
        ${shadeSrc ? `<div class="thumb"><img src="${shadeSrc}" alt="Pantalla"></div>` : ''}
        ${bulbSrc ? `<div class="thumb"><img src="${bulbSrc}" alt="Bombilla"></div>` : ''}
      </div>
      <div class="receipt-row"><strong>Base:</strong> ${design.base.value} - $${design.base.price.toFixed(2)}</div>
      <div class="receipt-row"><strong>Pantalla:</strong> ${design.shade.value} - $${design.shade.price.toFixed(2)}</div>
      <div class="receipt-row"><strong>Bombilla:</strong> ${design.bulb.value} - $${design.bulb.price.toFixed(2)}</div>
      <div class="receipt-row"><strong>Total:</strong> $${design.totalPrice.toFixed(2)}</div>
      <div class="receipt-actions">
        <button id="print-receipt" type="button" onclick="window.print()">Imprimir</button>
      </div>
    </div>
  `;
  // Create or reuse a modal container attached to body so nothing overlays it
  let modal = document.getElementById('receipt-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'receipt-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div class="receipt-backdrop" id="receipt-backdrop"></div><div class="receipt" id="receipt-content">${html}</div>`;
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.zIndex = '9999';
  modal.style.pointerEvents = 'auto';
  // store a reference to the content area for later operations
  const receiptContent = document.getElementById('receipt-content');

  // Ensure the original #receipt element is hidden (for ARIA/compat)
  if (receiptEl) { receiptEl.hidden = true; }

  // After inserting HTML ensure buttons are focusable and accept pointer events
  // Buttons are inside the modal's content
  const printBtn = document.getElementById('print-receipt');
  if (printBtn) {
    printBtn.tabIndex = 0;
    printBtn.style.pointerEvents = 'auto';
  }
  // no confirm button anymore

  // small visible click counter to help debug click behavior without console
  // attach the click counter inside the modal content
  let counter = receiptContent.querySelector('.receipt-click-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'receipt-click-counter';
    counter.style.fontSize = '0.8rem';
    counter.style.color = '#666';
    counter.style.marginTop = '0.5rem';
    counter.textContent = 'Clicks: 0';
    receiptContent.querySelector('.receipt-card').appendChild(counter);
  }
  // helper to bump counter when actions happen
  function bumpCounter() {
  const el = receiptContent.querySelector('.receipt-click-counter');
    if (!el) return;
    const n = parseInt(el.textContent.replace(/[^0-9]/g, '') || '0', 10) + 1;
    el.textContent = `Clicks: ${n}`;
  }
  // Track clicks on the two action buttons specifically
  if (printBtn) printBtn.addEventListener('click', bumpCounter);

  // Close modal helper when order confirmed or when backdrop clicked
  const backdrop = document.getElementById('receipt-backdrop');
  function closeModal() {
    const m = document.getElementById('receipt-modal');
    if (m) m.parentNode.removeChild(m);
    if (receiptEl) receiptEl.hidden = true;
  }
  if (backdrop) backdrop.addEventListener('click', closeModal);
}

// Receipt actions are handled directly on the modal buttons now (print only)

// confirmOrder removed: confirmation flow replaced by print-only receipt

function resetDesign() {
  optionButtons.forEach((b) => b.classList.remove("selected"));
  if (baseImg) baseImg.src = "";
  if (shadeImg) shadeImg.src = "";
  if (bulbImg) bulbImg.src = "";
  currentDesign = { base: null, shade: null, bulb: null, totalPrice: 0 };
  updateTotalPrice();
  if (receiptEl) {
    receiptEl.innerHTML = "";
    receiptEl.hidden = true;
  }
}

// Generador local de sugerencias (fallback cuando no hay backend)
function localSuggestion(design) {
  const parts = [];
  if (design.base) parts.push(`base: ${design.base}`);
  if (design.shade) parts.push(`pantalla: ${design.shade}`);
  if (design.bulb) parts.push(`bombilla: ${design.bulb}`);

  const lines = [];
  lines.push(`Sugerencias para tu lámpara (${parts.join(', ')}):`);
  if (design.shade && design.shade.includes('fabric')) {
    lines.push('- Usa una bombilla LED cálida para realzar las texturas de la pantalla de tela.');
  } else {
    lines.push('- Considera una pantalla de tela si buscas una luz más difusa y ambiental.');
  }
  if (design.base && design.base.includes('wood')) {
    lines.push('- La base de madera queda bien con tonos cálidos; prueba una pantalla clara.');
  }
  lines.push(`- Precio estimado: $${(design.price || 0).toFixed(2)}.`);
  // removed informational note per user request
  return lines.join('\n');
}

// --- IA: pedir sugerencias al backend ---
async function askAiSuggestion() {
  console.debug('askAiSuggestion called');
  if (!askAiBtn) {
    console.debug('askAiBtn not found');
    return;
  }
  const payload = {
    design: {
      base: currentDesign.base?.value || null,
      shade: currentDesign.shade?.value || null,
      bulb: currentDesign.bulb?.value || null,
      price: currentDesign.totalPrice || 0,
    }
  };

  try {
    askAiBtn.disabled = true;
    askAiBtn.textContent = 'Cargando...';
    suggestionsOutput.textContent = 'Solicitando sugerencia...';

    // Intenta ruta relativa primero; si la respuesta es no-ok (405/404/500) intenta el backend en localhost:3001
    let res;
    try {
      res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn('Relative endpoint returned non-ok status', res.status, res.statusText);
        // intenta fallback
        try {
          res = await fetch('http://localhost:3001/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e2) {
          console.error('Fallback fetch failed (network)', e2);
          // proceed to error handling below
        }
      }
    } catch (e) {
        console.warn('Relative fetch failed (network), trying http://localhost:3001', e);
        try {
          res = await fetch('http://localhost:3001/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e2) {
          console.error('Fallback fetch also failed', e2);
          // Use local fallback suggestions so the feature works offline without backend
          const local = localSuggestion(payload.design);
          suggestionsOutput.textContent = local;
          return;
        }
    }

    if (!res || !res.ok) {
      // if remote failed, fall back to local suggestion generator
      const local = localSuggestion(payload.design);
      suggestionsOutput.textContent = local;
      return;
    }
    const data = await res.json();
    suggestionsOutput.textContent = data.suggestion || 'Sin respuesta.';
  } catch (err) {
    suggestionsOutput.textContent = 'Error: ' + (err.message || err);
  } finally {
    askAiBtn.disabled = false;
    askAiBtn.textContent = 'Pedir sugerencia';
  }
}

if (askAiBtn) askAiBtn.addEventListener('click', askAiSuggestion);
if (clearAiBtn) clearAiBtn.addEventListener('click', () => { suggestionsOutput.textContent = ''; });

// Expose for inline onclick calls
window.askAiSuggestion = askAiSuggestion;

// --- Small visual init to apply catalog look & animations ---
(function applyCatalogLook(){
  try {
    document.body.classList.add('catalog-look');
    // If there are any catalog-card elements, reveal them with the animation
    const cards = document.querySelectorAll('.catalog-card');
    cards.forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 80));
  } catch (e) {
    /* ignore */
  }
})();

/**
 * Lógica do cardápio digital — Lanchonete e Sorveteria do Gordo
 * Renderização, busca, carrinho, e checkout via WhatsApp.
 */

(function () {
  "use strict";

  const ICONS = {
    burger: "icon-burger",
    hotdog: "icon-hotdog",
    pastel: "icon-pastel",
    combo: "icon-combo",
    fries: "icon-fries",
    acai: "icon-acai",
    drink: "icon-drink",
  };

  /** @type {Array<any>} carrinho em memória (persistido em localStorage) */
  let cart = [];
  let fulfillment = "entrega";
  // Apenas o grupo "Adicionais" tem limite por tamanho (é o número impresso
  // como "X ADC." em cada tamanho no cardápio de Açaí). Coberturas e Frutas
  // não têm limite indicado no cardápio original, por isso ficam livres.
  let acaiSelection = {
    sizeId: null,
    adicionais: new Set(),
    coberturas: new Set(),
    frutas: new Set(),
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem("gordo_cart");
      if (raw) cart = JSON.parse(raw);
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem("gordo_cart", JSON.stringify(cart));
    } catch (e) {
      /* ignora falha de storage (modo privado, etc.) */
    }
  }

  // ================= RENDER: HEADER / CONTATO =================
  function renderContact() {
    const waUrl = `https://wa.me/${STORE.whatsapp}`;
    const hw = $("#headerWhatsapp");
    const fw = $("#footerWhatsapp");
    if (hw) hw.href = waUrl;
    if (fw) fw.href = waUrl;
    $("#headerWhatsappLabel").textContent = STORE.whatsappDisplay;
    $("#footerWhatsappLabel").textContent = STORE.whatsappDisplay;

    $("#addressLine").textContent = STORE.address
      ? `Endereço: ${STORE.address}`
      : "Endereço: a confirmar (em breve)";
    $("#mapsLinkBtn").href = STORE.mapsLink;
    $("#mapsEmbed").src = STORE.mapsEmbedSrc;

    if (STORE.hoursLabel) {
      $("#hoursLineText").textContent = STORE.hoursLabel;
    } else {
      $("#hoursLine").style.display = "none";
    }

    const paymentEl = $("#paymentMethods");
    if (STORE.paymentMethods && STORE.paymentMethods.length) {
      paymentEl.innerHTML = STORE.paymentMethods
        .map(
          (m) => `<span class="payment-badge"><svg viewBox="0 0 24 24"><use href="#icon-card"/></svg>${m}</span>`
        )
        .join("");
    }
  }

  // ================= RENDER: NAV DE CATEGORIAS =================
  function renderCategoryNav() {
    const nav = $("#categoryNav");
    nav.innerHTML = MENU.map(
      (cat) => `
      <a href="#cat-${cat.id}" class="cat-chip" data-cat="${cat.id}">
        <svg viewBox="0 0 24 24"><use href="#${ICONS[cat.icon] || "icon-burger"}"/></svg>
        ${cat.shortName}
      </a>`
    ).join("");

    nav.addEventListener("click", (e) => {
      const chip = e.target.closest(".cat-chip");
      if (!chip) return;
      e.preventDefault();
      const id = chip.dataset.cat;
      const target = document.getElementById(
        id === "acai" ? "acai" : `cat-${id}`
      );
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 118;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  }

  function setActiveChip(id) {
    $$(".cat-chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === id));
  }

  // ================= RENDER: PRODUTOS =================
  function productCardHTML(cat, product) {
    // Categoria "priceless" (ex.: Bebidas) é só informativa: sem preço
    // confirmado, não dá pra somar no carrinho, então o card não é
    // clicável e mostra "Sob consulta" no lugar do valor.
    if (cat.priceless) {
      return `
        <div class="product-card product-card-info">
          <div class="product-card-top">
            <h4 class="product-name">${product.name}</h4>
          </div>
          ${product.description ? `<p class="product-desc">${product.description}</p>` : ""}
          <div class="product-bottom">
            <span class="product-price product-price-consult">Sob consulta</span>
          </div>
        </div>`;
    }
    return `
      <button class="product-card ${product.featured ? "featured" : ""}" data-cat="${cat.id}" data-product="${product.id}">
        <div class="product-card-top">
          <h4 class="product-name">${product.name}</h4>
        </div>
        <p class="product-desc">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatBRL(product.price)}</span>
          <span class="product-add-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24"><use href="#icon-plus"/></svg>
          </span>
        </div>
      </button>`;
  }

  function renderMenu(filterText = "") {
    const root = $("#menuRoot");
    const q = filterText.trim().toLowerCase();
    let anyVisible = false;

    root.innerHTML = MENU.filter((c) => c.type !== "buildable")
      .map((cat) => {
        const products = cat.products.filter((p) => {
          if (!q) return true;
          return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q)
          );
        });
        if (products.length === 0) return "";
        anyVisible = true;
        return `
        <section class="category-section" id="cat-${cat.id}">
          <div class="category-head">
            <div class="category-title-wrap">
              <span class="category-title-icon"><svg viewBox="0 0 24 24"><use href="#${ICONS[cat.icon] || "icon-burger"}"/></svg></span>
              <h3 class="category-title">${cat.name}</h3>
            </div>
            <div class="category-badges">
              ${cat.weekendOnly ? '<span class="badge badge-weekend">Fins de semana</span>' : ""}
            </div>
          </div>
          ${cat.notice ? `<p class="category-notice">${cat.notice}</p>` : ""}
          <div class="product-grid">
            ${products.map((p) => productCardHTML(cat, p)).join("")}
          </div>
        </section>`;
      })
      .join("");

    if (!anyVisible) {
      root.innerHTML = `<div class="empty-state">Nenhum item encontrado para "<strong>${filterText}</strong>". Tente outro termo, ou confira o Açaí logo abaixo. 🍇</div>`;
    }

    // liga clique nos cards
    $$(".product-card:not(.product-card-info)", root).forEach((card) => {
      card.addEventListener("click", () => {
        const cat = MENU.find((c) => c.id === card.dataset.cat);
        const product = cat.products.find((p) => p.id === card.dataset.product);
        openProductModal(cat, product);
      });
    });
  }

  // ================= AÇAÍ BUILDER =================
  function acaiCategory() {
    return MENU.find((c) => c.id === "acai");
  }

  // grupos do açaí: só "adicionais" tem limite (o número impresso como
  // "X ADC." em cada tamanho); coberturas e frutas ficam livres.
  const ACAI_GROUPS = [
    { key: "adicionais", label: "Adicionais", capped: true },
    { key: "coberturas", label: "Coberturas", capped: false },
    { key: "frutas", label: "Frutas", capped: false },
  ];

  function renderAcai() {
    const cat = acaiCategory();
    const root = $("#acaiRoot");
    if (!acaiSelection.sizeId) acaiSelection.sizeId = cat.sizes[0].id;
    const size = cat.sizes.find((s) => s.id === acaiSelection.sizeId);

    const chipList = (items, groupKey) =>
      items
        .map(
          (item) => `
        <button type="button" class="acai-chip ${acaiSelection[groupKey].has(item) ? "selected" : ""}" data-extra="${item}" data-group="${groupKey}">
          ${item}
        </button>`
        )
        .join("");

    root.innerHTML = `
      <div class="acai-card">
        <div class="acai-sizes">
          ${cat.sizes
            .map(
              (s) => `
            <button type="button" class="acai-size-opt ${s.id === acaiSelection.sizeId ? "active" : ""}" data-size="${s.id}">
              <div class="sz-label">${s.label}</div>
              <div class="sz-price">${formatBRL(s.price)}</div>
              <div class="sz-extras">${s.includedExtras} adc. inclusos</div>
            </button>`
            )
            .join("")}
        </div>

        <div class="acai-groups">
          <div class="acai-group">
            <h4>Adicionais</h4>
            <div class="acai-chip-list">${chipList(cat.adicionais, "adicionais")}</div>
          </div>
          <div class="acai-group">
            <h4>Coberturas</h4>
            <div class="acai-chip-list">${chipList(cat.coberturas, "coberturas")}</div>
          </div>
          <div class="acai-group">
            <h4>Frutas</h4>
            <div class="acai-chip-list">${chipList(cat.frutas, "frutas")}</div>
          </div>
        </div>

        <p class="acai-extras-counter"><strong>${acaiSelection.adicionais.size}</strong> de <strong>${size.includedExtras}</strong> adicionais escolhidos</p>

        <div class="acai-footer">
          <div class="acai-total">Total: <strong>${formatBRL(size.price)}</strong></div>
          <button class="btn-acai-add" id="acaiAddBtn">
            <svg viewBox="0 0 24 24" class="icon"><use href="#icon-plus"/></svg>
            Adicionar ao carrinho
          </button>
        </div>
      </div>`;

    $$(".acai-size-opt", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        acaiSelection.sizeId = btn.dataset.size;
        const newSize = cat.sizes.find((s) => s.id === acaiSelection.sizeId);
        // se reduziu o tamanho, corta excedente de adicionais
        if (acaiSelection.adicionais.size > newSize.includedExtras) {
          acaiSelection.adicionais = new Set(
            Array.from(acaiSelection.adicionais).slice(0, newSize.includedExtras)
          );
        }
        renderAcai();
      })
    );

    $$(".acai-chip", root).forEach((chip) =>
      chip.addEventListener("click", () => {
        const val = chip.dataset.extra;
        const group = chip.dataset.group;
        const groupSet = acaiSelection[group];
        const groupDef = ACAI_GROUPS.find((g) => g.key === group);
        if (groupSet.has(val)) {
          groupSet.delete(val);
        } else {
          if (groupDef.capped && groupSet.size >= size.includedExtras) {
            showToast(`Limite de ${size.includedExtras} adicionais para o ${size.label}`);
            return;
          }
          groupSet.add(val);
        }
        renderAcai();
      })
    );

    $("#acaiAddBtn", root).addEventListener("click", () => {
      const extraGroups = ACAI_GROUPS.map((g) => ({
        label: g.label,
        items: Array.from(acaiSelection[g.key]),
      })).filter((g) => g.items.length);

      addToCart({
        uid: uid(),
        categoryId: "acai",
        productName: `Açaí ${size.label}`,
        variant: null,
        addons: [],
        extraGroups,
        unitBase: size.price,
        qty: 1,
        notes: "",
      });
      showToast("Açaí adicionado ao carrinho! 🍇");
      acaiSelection = {
        sizeId: acaiSelection.sizeId,
        adicionais: new Set(),
        coberturas: new Set(),
        frutas: new Set(),
      };
      renderAcai();
    });
  }

  // ================= MODAL DE PRODUTO =================
  let modalState = null;

  function openProductModal(cat, product) {
    modalState = {
      cat,
      product,
      addons: (cat.addons || []).map((a) => ({ ...a, checked: false })),
      qty: 1,
      notes: "",
    };
    renderProductModal();
    toggleOverlay("#productOverlay", true);
  }

  function computeModalSubtotal() {
    const addonsSum = modalState.addons
      .filter((a) => a.checked)
      .reduce((sum, a) => sum + a.price, 0);
    return (modalState.product.price + addonsSum) * modalState.qty;
  }

  function renderProductModal() {
    const { product, addons, qty } = modalState;
    const body = $("#productModalBody");
    body.innerHTML = `
      <h3 class="pm-name">${product.name}</h3>
      <p class="pm-desc">${product.description}</p>
      <div class="pm-price">${formatBRL(product.price)}</div>

      ${
        addons.length
          ? `<div class="pm-section">
              <p class="pm-section-title">Adicionais (opcional)</p>
              ${addons
                .map(
                  (a, i) => `
                <div class="pm-addon-row" data-addon="${i}">
                  <span class="pm-addon-label">
                    <span class="pm-checkbox ${a.checked ? "checked" : ""}">${
                    a.checked ? '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""
                  }</span>
                    ${a.name}
                  </span>
                  <span class="pm-addon-price">+ ${formatBRL(a.price)}</span>
                </div>`
                )
                .join("")}
            </div>`
          : ""
      }

      <div class="pm-section">
        <p class="pm-section-title">Quantidade</p>
        <div class="pm-qty-row">
          <div class="qty-stepper">
            <button class="qty-btn" id="qtyMinus" aria-label="Diminuir"><svg viewBox="0 0 24 24"><use href="#icon-minus"/></svg></button>
            <span class="qty-value" id="qtyValue">${qty}</span>
            <button class="qty-btn" id="qtyPlus" aria-label="Aumentar"><svg viewBox="0 0 24 24"><use href="#icon-plus"/></svg></button>
          </div>
        </div>
      </div>

      <div class="pm-section">
        <p class="pm-section-title">Observações</p>
        <textarea class="pm-notes" id="pmNotes" placeholder="Ex: sem cebola, ponto da carne, etc." aria-label="Observações do item">${modalState.notes}</textarea>
      </div>

      <div class="pm-footer">
        <div class="pm-subtotal">Subtotal<br/><strong id="pmSubtotal">${formatBRL(computeModalSubtotal())}</strong></div>
        <button class="btn-add-cart" id="pmAddBtn">Adicionar</button>
      </div>
    `;

    $$(".pm-addon-row", body).forEach((row) =>
      row.addEventListener("click", () => {
        const i = Number(row.dataset.addon);
        modalState.addons[i].checked = !modalState.addons[i].checked;
        renderProductModal();
      })
    );
    $("#qtyMinus", body).addEventListener("click", () => {
      modalState.qty = Math.max(1, modalState.qty - 1);
      renderProductModal();
    });
    $("#qtyPlus", body).addEventListener("click", () => {
      modalState.qty += 1;
      renderProductModal();
    });
    $("#pmNotes", body).addEventListener("input", (e) => {
      modalState.notes = e.target.value;
    });
    $("#pmAddBtn", body).addEventListener("click", () => {
      const chosenAddons = modalState.addons.filter((a) => a.checked).map((a) => ({ name: a.name, price: a.price }));
      addToCart({
        uid: uid(),
        categoryId: modalState.cat.id,
        productName: modalState.product.name,
        variant: null,
        addons: chosenAddons,
        unitBase: modalState.product.price,
        qty: modalState.qty,
        notes: modalState.notes,
      });
      showToast(`${modalState.product.name} adicionado ao carrinho! 🛒`);
      toggleOverlay("#productOverlay", false);
    });
  }

  // ================= CARRINHO =================
  function addToCart(item) {
    cart.push(item);
    saveCart();
    renderCartFab();
  }

  function itemUnitPrice(item) {
    return item.unitBase + item.addons.reduce((s, a) => s + a.price, 0);
  }
  function itemLineTotal(item) {
    return itemUnitPrice(item) * item.qty;
  }
  function cartTotal() {
    return cart.reduce((s, it) => s + itemLineTotal(it), 0);
  }
  function cartCount() {
    return cart.reduce((s, it) => s + it.qty, 0);
  }

  function renderCartFab() {
    const fab = $("#cartFab");
    const count = cartCount();
    $("#cartFabCount").textContent = count;
    $("#cartFabTotal").textContent = formatBRL(cartTotal());
    fab.classList.toggle("visible", count > 0);
  }

  function renderCartDrawer() {
    const list = $("#cartItems");
    const empty = cart.length === 0;
    $("#cartEmpty").style.display = empty ? "block" : "none";
    $("#cartFooter").style.display = empty ? "none" : "block";

    list.innerHTML = empty
      ? ""
      : cart
          .map((item, idx) => {
            const meta = [];
            if (item.addons.length) meta.push("+ " + item.addons.map((a) => a.name).join(", "));
            if (item.extraGroups && item.extraGroups.length) {
              item.extraGroups.forEach((g) => meta.push(`${g.label}: ${g.items.join(", ")}`));
            }
            if (item.notes) meta.push(`Obs: ${item.notes}`);
            return `
        <div class="cart-item" data-idx="${idx}">
          <div class="cart-item-main">
            <p class="cart-item-name">${item.productName}</p>
            ${meta.length ? `<p class="cart-item-meta">${meta.join(" · ")}</p>` : ""}
            <div class="cart-item-bottom">
              <span class="cart-item-price">${formatBRL(itemLineTotal(item))}</span>
              <div class="cart-item-actions">
                <div class="cart-mini-qty">
                  <button class="cart-mini-btn cart-qty-minus" aria-label="Diminuir"><svg viewBox="0 0 24 24"><use href="#icon-minus"/></svg></button>
                  <span>${item.qty}</span>
                  <button class="cart-mini-btn cart-qty-plus" aria-label="Aumentar"><svg viewBox="0 0 24 24"><use href="#icon-plus"/></svg></button>
                </div>
                <button class="cart-remove" aria-label="Remover"><svg viewBox="0 0 24 24"><use href="#icon-trash"/></svg></button>
              </div>
            </div>
          </div>
        </div>`;
          })
          .join("");

    $$(".cart-qty-minus", list).forEach((btn) =>
      btn.addEventListener("click", () => {
        const idx = Number(btn.closest(".cart-item").dataset.idx);
        cart[idx].qty = Math.max(1, cart[idx].qty - 1);
        saveCart();
        renderCartDrawer();
        renderCartFab();
      })
    );
    $$(".cart-qty-plus", list).forEach((btn) =>
      btn.addEventListener("click", () => {
        const idx = Number(btn.closest(".cart-item").dataset.idx);
        cart[idx].qty += 1;
        saveCart();
        renderCartDrawer();
        renderCartFab();
      })
    );
    $$(".cart-remove", list).forEach((btn) =>
      btn.addEventListener("click", () => {
        const idx = Number(btn.closest(".cart-item").dataset.idx);
        cart.splice(idx, 1);
        saveCart();
        renderCartDrawer();
        renderCartFab();
      })
    );

    $("#cartTotal").textContent = formatBRL(cartTotal());
  }

  // ================= WHATSAPP CHECKOUT =================
  function buildWhatsAppMessage() {
    const lines = [];
    lines.push(`Olá! Gostaria de fazer um pedido na *${STORE.name}*:`);
    lines.push("");
    cart.forEach((item, i) => {
      lines.push(`${i + 1}) ${item.qty}x ${item.productName}`);
      if (item.addons.length) {
        lines.push(`   Adicionais: ${item.addons.map((a) => a.name).join(", ")}`);
      }
      if (item.extraGroups && item.extraGroups.length) {
        item.extraGroups.forEach((g) => lines.push(`   ${g.label}: ${g.items.join(", ")}`));
      }
      if (item.notes) lines.push(`   Obs: ${item.notes}`);
      lines.push(`   Subtotal: ${formatBRL(itemLineTotal(item))}`);
    });
    lines.push("");
    lines.push(`Modalidade: ${fulfillment === "entrega" ? "Entrega" : "Retirada no balcão"}`);
    const notes = $("#cartNotes").value.trim();
    if (notes) lines.push(`Observações do pedido: ${notes}`);
    lines.push("");
    lines.push(`*Total: ${formatBRL(cartTotal())}*`);
    return lines.join("\n");
  }

  function checkout() {
    if (cart.length === 0) return;
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  // ================= UI HELPERS =================
  function toggleOverlay(sel, open) {
    $(sel).classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) $("#toast").classList.remove("visible"); // evita sobrepor o modal/carrinho
  }

  let toastTimer;
  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
  }

  // ================= EVENTOS GLOBAIS =================
  function bindEvents() {
    $("#searchInput").addEventListener("input", (e) => renderMenu(e.target.value));

    $("#productClose").addEventListener("click", () => toggleOverlay("#productOverlay", false));
    $("#productOverlay").addEventListener("click", (e) => {
      if (e.target.id === "productOverlay") toggleOverlay("#productOverlay", false);
    });

    $("#cartFab").addEventListener("click", () => {
      renderCartDrawer();
      toggleOverlay("#cartOverlay", true);
    });
    $("#cartClose").addEventListener("click", () => toggleOverlay("#cartOverlay", false));
    $("#cartOverlay").addEventListener("click", (e) => {
      if (e.target.id === "cartOverlay") toggleOverlay("#cartOverlay", false);
    });

    $("#optEntrega").addEventListener("click", () => setFulfillment("entrega"));
    $("#optRetirada").addEventListener("click", () => setFulfillment("retirada"));

    $("#checkoutBtn").addEventListener("click", checkout);

    // realça a categoria ativa ao rolar (recalcula a partir do DOM atual,
    // então continua funcionando mesmo depois de re-renderizações da busca)
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateActiveChipFromScroll();
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  function updateActiveChipFromScroll() {
    const sections = [
      ...$$(".category-section").map((el) => ({ id: el.id.replace("cat-", ""), el })),
      ...(document.getElementById("acai") ? [{ id: "acai", el: document.getElementById("acai") }] : []),
    ];
    if (!sections.length) return;
    const probeY = 150; // linha de referência logo abaixo do header fixo
    let current = sections[0].id;
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top - probeY <= 0) current = s.id;
    }
    setActiveChip(current);
  }

  function setFulfillment(mode) {
    fulfillment = mode;
    $("#optEntrega").classList.toggle("active", mode === "entrega");
    $("#optRetirada").classList.toggle("active", mode === "retirada");
  }

  // ================= INIT =================
  function init() {
    loadCart();
    renderContact();
    renderCategoryNav();
    renderMenu();
    renderAcai();
    bindEvents();
    renderCartFab();
    updateActiveChipFromScroll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

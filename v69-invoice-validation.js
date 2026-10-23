/* FOOD COST V6.9 — FACTURES V1
   L'OCR reste une proposition. La validation humaine est obligatoire.
   Ajoute un total HT de ligne et bloque toute validation incohérente.
*/
(function () {
  "use strict";

  const rows = document.getElementById("invoiceRows");
  const form = document.getElementById("invoiceForm");
  const dialog = document.getElementById("invoiceDialog");
  if (!rows || !form) return;

  const n = v => {
    const x = Number(String(v ?? "").trim().replace(",", "."));
    return Number.isFinite(x) ? x : NaN;
  };
  const eur = v => Number(v).toLocaleString("fr-FR", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }) + " €";
  const coherent = (a,b) => Math.abs(a-b) <= Math.max(0.02, Math.abs(b)*0.005);

  function enhanceRow(row) {
    if (!row || !row.classList.contains("invrow")) return;
    const qty = row.querySelector(".vQty");
    const price = row.querySelector(".vPrice");
    if (!qty || !price) return;

    let total = row.querySelector(".v69Total");
    if (!total) {
      const label = document.createElement("label");
      label.className = "v69-total-label";
      label.innerHTML = 'Total ligne HT (€)<input class="v69Total" type="number" min="0" step=".01" inputmode="decimal" placeholder="Total HT de la ligne">';
      const match = row.querySelector(".matchinfo");
      row.insertBefore(label, match || row.lastChild);
      total = label.querySelector(".v69Total");
    }

    let status = row.querySelector(".v69Status");
    if (!status) {
      status = document.createElement("div");
      status.className = "v69Status";
      status.style.cssText = "margin:8px 0;padding:9px 10px;border-radius:10px;font-size:13px;font-weight:700";
      total.closest("label").insertAdjacentElement("afterend", status);
    }

    function refresh() {
      const q = n(qty.value), p = n(price.value), t = n(total.value);
      if (!(q > 0) || !(p >= 0)) {
        status.textContent = "À compléter : quantité et prix unitaire.";
        status.style.background = "#fff3cd";
        status.dataset.ok = "0";
        return;
      }
      const expected = q * p;
      if (!(t >= 0)) {
        status.textContent = "Calcul attendu : " + eur(expected) + " — saisis le total de la facture pour contrôler.";
        status.style.background = "#e8f0ff";
        status.dataset.ok = "0";
        return;
      }
      if (coherent(expected, t)) {
        status.textContent = "✓ Ligne cohérente : " + eur(expected);
        status.style.background = "#dff5e5";
        status.dataset.ok = "1";
      } else {
        status.textContent = "⚠ Incohérent : Qté × PU = " + eur(expected) + " mais total saisi = " + eur(t);
        status.style.background = "#ffdfe1";
        status.dataset.ok = "0";
      }
    }

    ["input","change"].forEach(ev => {
      qty.addEventListener(ev, refresh);
      price.addEventListener(ev, refresh);
      total.addEventListener(ev, refresh);
    });
    refresh();
  }

  function enhanceAll() {
    [...rows.querySelectorAll(".invrow")].forEach(enhanceRow);
  }

  new MutationObserver(enhanceAll).observe(rows, {childList:true, subtree:true});
  enhanceAll();

  const add = document.getElementById("addInvoiceRow");
  if (add) add.addEventListener("click", () => setTimeout(enhanceAll, 0));

  const create = document.getElementById("newInvoiceBtn");
  if (create) create.addEventListener("click", () => setTimeout(enhanceAll, 50));

  if (dialog) dialog.addEventListener("toggle", enhanceAll);

  // Passe avant le gestionnaire V6.0 : rien n'est enregistré si une ligne n'est pas contrôlée.
  form.addEventListener("submit", function(e) {
    enhanceAll();
    const activeRows = [...rows.querySelectorAll(".invrow")].filter(r => {
      const name = r.querySelector(".vName")?.value.trim();
      const price = n(r.querySelector(".vPrice")?.value);
      return name && price > 0;
    });

    if (!activeRows.length) return;

    const incomplete = activeRows.some(r => r.querySelector(".v69Status")?.dataset.ok !== "1");
    if (incomplete) {
      e.preventDefault();
      e.stopImmediatePropagation();
      alert("Validation bloquée : vérifie chaque ligne. Le total HT doit correspondre à Quantité × Prix unitaire.");
      return false;
    }
  }, true);

  // Petit rappel visible : aucune mise à jour automatique avant validation finale.
  const title = form.querySelector("h2");
  if (title && !document.getElementById("v69Notice")) {
    const p = document.createElement("p");
    p.id = "v69Notice";
    p.className = "muted small";
    p.textContent = "OCR = préremplissage uniquement. Corrige les champs puis contrôle chaque total. Les prix fournisseurs ne changent qu'après « Valider définitivement la facture ».";
    title.insertAdjacentElement("afterend", p);
  }
})();
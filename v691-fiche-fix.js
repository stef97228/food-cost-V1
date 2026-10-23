/* FOOD COST V6.9.1 — correctif page blanche fiche facture */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const btn = $("newInvoiceBtn"), dlg = $("invoiceDialog"), form = $("invoiceForm"), rows = $("invoiceRows");
  if (!btn || !dlg || !form || !rows) return;

  const clean = s => String(s ?? "").trim();
  const num = v => {
    const x = parseFloat(String(v ?? "").replace(/\s/g,"").replace(",","."));
    return Number.isFinite(x) ? x : 0;
  };
  const esc = s => clean(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const isoDate = s => {
    const m = clean(s).match(/(\d{2})[\/.-](\d{2})[\/.-](\d{4})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : (/^\d{4}-\d{2}-\d{2}$/.test(clean(s)) ? clean(s) : "");
  };

  function proposalText(){
    return clean($("ocrStructured")?.innerText) + "\n" + clean($("ocrText")?.value);
  }
  function metadata(){
    const t = proposalText();
    const supplier = (t.match(/Fournisseur\s*:\s*([^\n]+)/i)||[])[1] || "";
    const ref = (t.match(/N[°ºo]?\s*facture\s*:\s*([A-Z0-9-]+)/i)||[])[1] || "";
    const date = (t.match(/Date\s*:\s*(\d{2}[\/.-]\d{2}[\/.-]\d{4})/i)||[])[1] || "";
    return {supplier:clean(supplier), ref:clean(ref), date:isoDate(date)};
  }
  function makeRow(name="", qty="", unit="kg", price="", total=""){
    const r=document.createElement("div");
    r.className="invrow";
    r.innerHTML=`
      <label>Produit<input class="vName" value="${esc(name)}" placeholder="Nom du produit"></label>
      <div class="inggrid">
        <label>Quantité<input class="vQty" type="number" min="0" step=".001" inputmode="decimal" value="${esc(qty)}"></label>
        <label>Unité<select class="vUnit">
          <option value="kg"${unit==="kg"?" selected":""}>kg</option>
          <option value="g"${unit==="g"?" selected":""}>g</option>
          <option value="L"${unit==="L"?" selected":""}>L</option>
          <option value="cl"${unit==="cl"?" selected":""}>cL</option>
          <option value="ml"${unit==="ml"?" selected":""}>mL</option>
          <option value="piece"${unit==="piece"?" selected":""}>pièce</option>
        </select></label>
      </div>
      <label>Prix unitaire HT (€)<input class="vPrice" type="number" min="0" step=".001" inputmode="decimal" value="${esc(price)}"></label>
      <label>Total ligne HT (€)<input class="vTotal" type="number" min="0" step=".01" inputmode="decimal" value="${esc(total)}"></label>
      <div class="vCheck" style="margin:8px 0;padding:9px 10px;border-radius:10px;font-size:13px;font-weight:700;background:#fff3cd">À contrôler</div>
      <div class="matchinfo muted small"></div>
      <button type="button" class="danger vRemove">Supprimer cette ligne</button>`;
    const q=r.querySelector(".vQty"), p=r.querySelector(".vPrice"), tot=r.querySelector(".vTotal"), check=r.querySelector(".vCheck");
    const refresh=()=>{
      const qv=num(q.value), pv=num(p.value), tv=num(tot.value), expected=qv*pv;
      if(!(qv>0) || !(pv>=0) || !(tv>=0)){check.dataset.ok="0";check.textContent="À compléter et contrôler.";check.style.background="#fff3cd";return;}
      const ok=Math.abs(expected-tv)<=Math.max(.02,Math.abs(tv)*.005);
      check.dataset.ok=ok?"1":"0";
      check.style.background=ok?"#dff5e5":"#ffdfe1";
      check.textContent=ok ? `✓ Cohérent : ${expected.toFixed(2)} €` : `⚠ Qté × PU = ${expected.toFixed(2)} € ; total saisi = ${tv.toFixed(2)} €`;
    };
    [q,p,tot].forEach(x=>{x.addEventListener("input",refresh);x.addEventListener("change",refresh)});
    r.querySelector(".vRemove").onclick=()=>r.remove();
    refresh();
    return r;
  }

  // Capture le clic AVANT l'ancien code : évite le plantage qui produisait la page blanche.
  btn.addEventListener("click", e=>{
    e.preventDefault(); e.stopImmediatePropagation();
    const m=metadata();
    $("invSupplier").value = m.supplier || "";
    $("invDate").value = m.date || "";
    $("invRef").value = m.ref || "";
    rows.innerHTML="";
    rows.appendChild(makeRow()); // volontairement vide : OCR imparfait, correction humaine sûre
    try { dlg.showModal(); } catch(_) { dlg.setAttribute("open",""); }
  }, true);

  $("addInvoiceRow")?.addEventListener("click", e=>{
    e.preventDefault(); e.stopImmediatePropagation(); rows.appendChild(makeRow());
  }, true);
  $("cancelInvoice")?.addEventListener("click", e=>{
    e.preventDefault(); e.stopImmediatePropagation(); try{dlg.close()}catch(_){dlg.removeAttribute("open")}
  }, true);

  // Contrôle final avant que le code existant enregistre quoi que ce soit.
  form.addEventListener("submit", e=>{
    const rs=[...rows.querySelectorAll(".invrow")];
    const bad=rs.length===0 || rs.some(r=>{
      const name=clean(r.querySelector(".vName")?.value);
      const q=num(r.querySelector(".vQty")?.value), p=num(r.querySelector(".vPrice")?.value), t=num(r.querySelector(".vTotal")?.value);
      return !name || !(q>0) || !(p>=0) || !(t>=0) || Math.abs(q*p-t)>Math.max(.02,Math.abs(t)*.005);
    });
    if(bad){
      e.preventDefault(); e.stopImmediatePropagation();
      alert("Validation bloquée : complète chaque ligne et vérifie que Quantité × Prix unitaire = Total HT.");
    }
  }, true);
})();
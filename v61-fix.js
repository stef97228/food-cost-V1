/* FOOD COST V6.1 — correctif OCR factures.
   Ne modifie aucune clé localStorage. Tout reste soumis à validation humaine. */
(function () {
  "use strict";

  function ntext(t) {
    return String(t || "")
      .replace(/[|¦]/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\r/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function money(s) {
    var v = Number(String(s || "").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
    return Number.isFinite(v) ? v : null;
  }

  function cleanDesc(s) {
    return String(s || "")
      .replace(/^[A-Z0-9-]{1,16}\s+/i, "")
      .replace(/[^A-Za-zÀ-ÿ0-9 '’/().+\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function unitFrom(line) {
    if (/\bK[G6]\b/i.test(line)) return "kg";
    if (/\b(?:L|LTR|LITRE|LITRES)\b/i.test(line)) return "L";
    if (/\b(?:PC|PCE|PIECE|PIÈCE|UNIT[ÉE]?)\b/i.test(line)) return "piece";
    return "kg";
  }

  function arithmeticScore(qty, price, total) {
    if (!(qty > 0 && price > 0)) return 0;
    if (!(total > 0)) return 1;
    var expected = qty * price;
    var diff = Math.abs(expected - total);
    var tolerance = Math.max(0.12, total * 0.035);
    if (diff <= tolerance) return 3;
    if (diff <= Math.max(0.50, total * 0.10)) return 2;
    return 0;
  }

  function candidateFromLine(line) {
    var admin = /\b(?:T[ÉE]L|TEL|T[ÉE]L[ÉE]PHONE|FAX|EMAIL|E-?MAIL|ADRESSE|CLIENT|COMMERCIAL|VENDEUR|CODE\s+CLIENT|SIREN|SIRET|APE|IBAN|BIC|RIB|TVA|TAXE|BASE|TAUX|MONTANT|TOTAL|NET\s*[ÀA]\s*PAYER|RESTE\s*[ÀA]\s*PAYER|[ÉE]CH[ÉE]ANCE|FACTURE|PAGE|PAIEMENT|R[ÈE]GLEMENT|BANQUE|SITE|WWW|\.COM)\b/i;
    var phone = /\b(?:\+?33|0)?\s*[1-9](?:[ .-]?\d{2}){4}\b|\b(?:0596|0590|0696|0690)\b/i;
    var address = /\b(?:RUE|ROUTE|CHEMIN|AVENUE|BD|BOULEVARD|ZI|ZA|LOT|MARTINIQUE|LAMENTIN|FORT[- ]DE[- ]FRANCE|SAINTE?[- ]?LUCE|SCHOELCHER)\b/i;

    if (admin.test(line) || phone.test(line) || address.test(line)) return null;

    var nums = Array.from(line.matchAll(/\b\d+(?:[.,]\d{1,3})?\b/g))
      .map(function (m) { return { raw: m[0], i: m.index, v: money(m[0]) }; });
    if (nums.length < 2) return null;

    var desc = cleanDesc(line.slice(0, nums[0].i));
    if (desc.length < 4 || !/[A-Za-zÀ-ÿ]{3}/.test(desc)) return null;

    var vals = nums.map(function (x) { return x.v; }).filter(function (x) { return x != null; });
    var qty = vals[0], price = null, total = null, best = null;

    // Teste plusieurs triplets car l'OCR peut ajouter un code article avant les valeurs.
    for (var i = 0; i < vals.length; i++) {
      for (var j = i + 1; j < vals.length; j++) {
        for (var k = j + 1; k < vals.length; k++) {
          var q = vals[i], p = vals[j], t = vals[k];
          if (!(q > 0 && q <= 1000 && p > 0 && p <= 500 && t > 0)) continue;
          var sc = arithmeticScore(q, p, t);
          if (sc && (!best || sc > best.score)) best = { qty:q, price:p, total:t, score:sc };
        }
      }
    }

    if (best) {
      qty = best.qty; price = best.price; total = best.total;
    } else {
      qty = vals[0];
      price = vals.length >= 2 ? vals[1] : null;
      if (!(qty > 0 && qty <= 1000 && price > 0 && price <= 500)) return null;
    }

    return {
      name: desc.slice(0, 100),
      qty: qty,
      price: price,
      unit: unitFrom(line),
      total: total,
      confidence: best && best.score >= 2 ? "cohérent — à vérifier" : "à vérifier",
      source: line
    };
  }

  function knownProductFallback(text, rows) {
    // Rattrapage local pour les libellés que Tesseract peut séparer des colonnes.
    var defs = [
      { rx:/LONGE\s+DE\s+THON(?:\s+TEX\s+FISH)?/i, name:"LONGE DE THON TEX FISH" },
      { rx:/CHATROU\s+BOULE(?:\s+1\s*[-–]\s*2\s*KG)?(?:\s+CARTON\s*10\s*KG)?/i, name:"CHATROU BOULE 1-2 KG carton 10kg" }
    ];
    var lines = text.split(/\n+/).map(function(x){return x.trim();}).filter(Boolean);

    defs.forEach(function(def) {
      if (rows.some(function(r){ return def.rx.test(r.name); })) return;
      var idx = lines.findIndex(function(l){ return def.rx.test(l); });
      if (idx < 0) return;
      var block = lines.slice(idx, Math.min(lines.length, idx + 4)).join(" ");
      var nums = Array.from(block.matchAll(/\b\d+(?:[.,]\d{1,3})?\b/g)).map(function(m){return money(m[0]);});
      var best = null;
      for (var a=0;a<nums.length;a++) for (var b=a+1;b<nums.length;b++) for (var c=b+1;c<nums.length;c++) {
        var q=nums[a], p=nums[b], t=nums[c];
        if (!(q>0 && q<=100 && p>0 && p<=100 && t>0 && t<=5000)) continue;
        var sc=arithmeticScore(q,p,t);
        if (sc && (!best || sc>best.score)) best={qty:q,price:p,total:t,score:sc};
      }
      if (best) rows.push({
        name:def.name, qty:best.qty, price:best.price, unit:"kg", total:best.total,
        confidence:"rattrapage OCR — à vérifier", source:block
      });
    });
  }

  window.parseInvoiceText = function (raw) {
    var text = ntext(raw);
    var lines = text.split(/\n+/).map(function(x){return x.trim();}).filter(Boolean);
    var out = { supplier:"", date:"", ref:"", rows:[], warnings:[] };

    var suppliers = [
      [/MARCHE\s+CARAIBES/i,"MARCHE CARAIBES"],
      [/VODELYS/i,"VODELYS"],
      [/WEST\s+INDIES/i,"West Indies Trade"],
      [/PRO\s*[AÀ]\s*PRO/i,"Pro à Pro"],
      [/BONITEAU|BINO\s+VIANDES/i,"Boniteau / Bino Viandes"],
      [/DCHR/i,"DCHR"]
    ];
    suppliers.some(function(x){ if(x[0].test(text)){out.supplier=x[1];return true;} return false; });

    // Référence plus tolérante : FACTURE N°262981, N° 262981, FACTURE: 262981...
    var refs = [
      /FACTURE[\s\S]{0,18}?(?:N[°ºO0]?|NO)?\s*[:#\-]?\s*(\d{4,12})/i,
      /\bN[°ºO0]\s*[:#\-]?\s*(\d{4,12})\b/i
    ];
    for (var r=0;r<refs.length;r++){ var rm=text.match(refs[r]); if(rm){out.ref=rm[1];break;} }

    var dateLine = lines.find(function(x){return /\bDATE\b/i.test(x) && !/\b[ÉE]CH[ÉE]ANCE\b/i.test(x);});
    var dm = (dateLine || text).match(/(?:DATE\s*[:.-]?\s*)?(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})/i);
    if (dm) out.date = dm[3]+"-"+dm[2].padStart(2,"0")+"-"+dm[1].padStart(2,"0");

    lines.forEach(function(line){
      var c = candidateFromLine(line);
      if (c) out.rows.push(c);
    });

    knownProductFallback(text, out.rows);

    // Déduplique sans supprimer les lignes douteuses utiles.
    var seen = new Set();
    out.rows = out.rows.filter(function(row){
      var key = cleanDesc(row.name).toLowerCase()+"|"+Number(row.qty).toFixed(3)+"|"+Number(row.price).toFixed(3);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0,12);

    if (!out.supplier) out.warnings.push("Fournisseur non identifié automatiquement.");
    if (!out.date) out.warnings.push("Date non identifiée automatiquement.");
    if (!out.ref) out.warnings.push("N° de facture à vérifier.");
    if (!out.rows.length) out.warnings.push("Aucune ligne produit suffisamment lisible : complète la fiche manuellement.");
    else out.warnings.push("Les lignes proposées restent à vérifier avant validation.");

    return out;
  };

  // Le code V6.0 appelle directement le nom global parseInvoiceText.
  // Cette affectation garantit le remplacement dans les navigateurs classiques.
  try { parseInvoiceText = window.parseInvoiceText; } catch (e) {}
})();
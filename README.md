# FOOD COST V6.10 — UNITÉS

Correctif ciblé des unités, sans réinitialiser les données.

- Répare la valeur connue de Sauce gorgonzola : 2000 L -> 2 L.
- Une quantité saisie en L reste affichée en L.
- Ajoute cL aux unités de volume.
- Conversions internes : 1 L = 100 cL = 1000 mL.
- Conversions internes : 1 kg = 1000 g.
- Aucune conversion g <-> mL : FOOD COST ne suppose jamais 1 g = 1 mL.
- Les factures, produits, recettes et historiques existants restent dans localStorage.

Téléverser les 4 fichiers à la racine de la branche `principal`.

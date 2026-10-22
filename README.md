# FOOD COST V6.5
Garde le prétraitement OCR V6.4 qui a permis de lire correctement 10,6 / 13,00 et 10 / 11,50.
Le nouveau filtre :
- privilégie Date facture et ignore Échéance ;
- récupère les fournisseurs connus ;
- conserve les lignes produits reconnues ;
- rejette les lignes OCR incohérentes ;
- exige toujours une validation humaine avant enregistrement.
Aucune donnée localStorage n'est réinitialisée.

# FOOD COST — V6.1

Correctif OCR factures sur la base V6.0.

- Conserve toutes les clés localStorage V6.0 : aucune remise à zéro.
- N° de facture détecté avec une règle plus tolérante.
- Lignes produits récupérées avec contrôle quantité × prix ≈ total.
- Les lignes ambiguës restent « à vérifier » au lieu d'être enregistrées automatiquement.
- Filtrage conservé pour téléphone, adresse, TVA, totaux et informations administratives.
- Aucun prix fournisseur n'est modifié avant validation explicite.
- Aucune API IA payante connectée.

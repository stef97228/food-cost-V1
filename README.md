# FOOD COST — V6.0

Version de finalisation locale avant connexion à une IA payante.

- Scan plat en premier et relié aux recettes existantes.
- Factures : validation explicite, correction manuelle et suppression sécurisée des factures de test.
- Lors de la suppression d’une facture test, FOOD COST peut proposer de retirer uniquement les produits correspondants qui ne sont utilisés dans aucune recette/sous-recette.
- Sauvegarde/restauration JSON des données locales.
- Recettes, sous-recettes, fournisseurs, coûts, coefficients, ratios, inventaire et historique conservés.
- Aucune API IA payante connectée.
- Les clés localStorage existantes sont conservées : pas de remise à zéro automatique.

# FOOD COST V7.1 — VERSION CONSOLIDÉE

Une seule base, sans empilement des anciens fichiers de correctifs.

Inclus : recettes, sous-recettes, unités g/kg/mL/cL/L/pièce, correctif 60 mL, rendement 2 L, fournisseurs, factures avec validation humaine et contrôle quantité × prix = total, inventaire, scan plat local, sauvegarde/restauration et préparation de la connexion IA sécurisée.

## OpenAI
Aucune clé API n'est incluse dans l'application publique. La V7 est préparée pour un endpoint serveur sécurisé `/api/food-cost-ai`. La configuration de l'hébergement et du secret OpenAI se fera demain. Sans serveur IA, FOOD COST continue de fonctionner en mode local.

## Installation
Téléverser à la racine de `principal` les 4 fichiers :
- app.js
- index.html
- sw.js
- README.md

Les anciens fichiers `v61-fix.js`, `v63-invoice.js`, etc. peuvent rester dans GitHub pour l'instant : V7.1 ne les charge plus.

Les données existantes restent dans le localStorage de l'iPhone.


## V7.1 — Design
Interface plus moderne et colorée : cartes, navigation, boutons, indicateurs, formulaires et affichage mobile améliorés. Aucune donnée métier n'est modifiée.

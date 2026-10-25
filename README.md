# FOOD COST V7.3 — consolidée

- Scan plat raccordé à `/api/food-cost-ai` (photo → proposition IA → validation humaine).
- Statut IA corrigé sur la même route Vercel.
- Factures : normalisation des fournisseurs connus à la validation.
- Inventaire : produits regroupés automatiquement par fournisseur.
- Aucun prix fournisseur n’est inventé par l’IA.
- Les données restent en localStorage et sont compatibles avec la sauvegarde/restauration existante.

Important : conserver `OPENAI_API_KEY` uniquement dans les variables d’environnement Vercel.

# FOOD COST V7.2.2 — installation iPhone simplifiée

Tous les fichiers à téléverser sont à la racine : aucun dossier `api` à créer.

Vercel détecte automatiquement `server.js` à la racine et l'exécute comme serveur Node.
Le serveur :
- sert FOOD COST ;
- répond à `/api/food-cost-ai/status` ;
- répond à `/api/food-cost-ai` ;
- garde `OPENAI_API_KEY` uniquement côté serveur.

Variable Vercel obligatoire : `OPENAI_API_KEY`.
Modèle par défaut : `gpt-6-luna`, avec image en détail `low` pour limiter le coût.
Aucun prix fournisseur n'est inventé et les grammages IA restent à valider.


## Correctif V7.2.2
Le marqueur visible dans `index.html` est maintenant **V7.2.2** et les ressources utilisent un cache-buster `v=722`.

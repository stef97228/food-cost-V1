# FOOD COST V7.2 — OpenAI prêt pour Vercel

Cette version reprend V7.1 et ajoute la connexion IA côté serveur.

## Sécurité
La clé OpenAI n'est jamais dans `app.js`, GitHub ou le navigateur.
Vercel doit recevoir une variable secrète nommée `OPENAI_API_KEY`.

## API incluse
- `/api/food-cost-ai/status` : vérifie si le secret est configuré.
- `/api/food-cost-ai` : analyse une photo de plat et propose composants + grammages estimés.
- Les grammages restent toujours à valider manuellement.
- Aucun prix fournisseur n'est inventé.

## À téléverser sur la branche déployée par Vercel
Fichiers racine :
- app.js
- index.html
- styles.css
- sw.js
- README.md
- vercel.json

Dossier :
- api/
  - food-cost-ai.js
  - food-cost-ai/status.js

## Vercel
Créer une variable de type Secret :
`OPENAI_API_KEY` = la clé API OpenAI.
Puis redéployer.

Optionnel :
`OPENAI_MODEL` permet de changer le modèle sans modifier le code.

V7.2 fonctionne toujours en mode manuel si l'IA est indisponible.

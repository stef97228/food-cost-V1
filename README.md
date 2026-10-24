# FOOD COST V7.2.3

Correctif Vercel : le serveur Node est maintenant `server.ts` à la racine afin d'être détecté automatiquement par Vercel.

Test attendu après déploiement :
`/api/food-cost-ai/status` doit répondre en JSON.

La clé OpenAI reste uniquement dans la variable d'environnement `OPENAI_API_KEY` de Vercel.

# FOOD COST V6.3
Correctif propre du lecteur de factures.

- remplace la logique de parsing après OCR sans toucher aux données localStorage ;
- fournisseur, date et numéro de facture détectés séparément ;
- lignes produits reconstruites par contrôle quantité × prix unitaire ≈ total ;
- aucune mise à jour fournisseur automatique : validation humaine obligatoire ;
- aucun service IA payant connecté.

Téléverser les 4 fichiers du ZIP à la racine du dépôt.
Conserver tous les autres fichiers existants, notamment app.js, styles.css et v61-fix.js.
Le fichier v62-fix.js peut rester dans le dépôt : V6.3 ne le charge plus.

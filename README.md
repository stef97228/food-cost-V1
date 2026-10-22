# FOOD COST V5.8

Version locale-first pour GitHub Pages.

Nouveautés :
- Scan plat / Recette réellement utilisable sans API payante.
- Photo du plat fini avec aperçu.
- Choix d'une recette existante ou création d'une nouvelle recette.
- Saisie/correction des composants et grammages.
- Liaison aux produits fournisseurs ou sous-recettes et calcul du coût quand les prix existent.
- Validation obligatoire avant enregistrement.
- Photo conservée localement sur l'appareil quand la capacité de stockage le permet.
- Factures : si l'OCR ne trouve pas la date, la date reste vide au lieu d'utiliser automatiquement la date du jour.

Les clés localStorage existantes de V5.5 sont conservées afin de ne pas effacer les recettes, produits, factures et inventaires déjà présents.


V5.7 : formulaire Scan plat visible sans photo, photo facultative, suppression manuelle des faux produits/doublons du catalogue.


V5.8 : correction du sélecteur Scan plat sur iPhone/Safari. La liste est reconstruite à chaque ouverture de l’onglet et contient toujours « + Nouvelle recette » puis les recettes locales existantes. La sélection d’une recette charge automatiquement ses composants.

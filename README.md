# Node and Npm versions

Node : v15.14.0

npm  : 7.9.0

Lien de la Demo : https://teamsmanager-trainingapp.web.app/#/management/teams

### Informations

- Par defaut il y a 3 équipes de cochées, les utilisateurs affichés seront donc seulement les membres des ces différentes équipes
- Si vous avez cochez certaines équipes et que vous ajouter un utilisateur qui n'est pas dans une de ces équipes il ne sera par défaut pas affiché dans le tableau d'utilisateur. N'oubliez pas de décocher toutes les équipes pour voir tout les utilisateurs dans l'application ou de cocher l'équipe où ce trouve ce nouvel utilisateur.
- Pour l'instant une équipe ne peux avoir que 2 Sous-Equipes ( en profondeur )
- Les utilisateurs affichés à droite sont filtré en fonction de la recherche textuel + les équipes actives. C'est à dire que seul les utilisateurs affectés à une équipe cochée seront affiché
- Chaques modifications sur une Equipe ou un Utilisateur est détectée, par la suite la liste des Equipes et Utilisateurs sont sauvegardé sur le localStorage
- Pour l'instant, les photos des utilisateurs sont générés aléatoirement
- Sur chaque équipe il y a un compteur d'utilisateurs, 
           - A FAIRE : Mettre le compteur d'utilisateurs sur les équipes Parent --> Attention: Si un utilisateur est dans les 2 sous équipes d'une Equipe, il ne dois être compté qu'une seule fois
- J'ai utilisé Eslint Babel avec Typescript pour tout le projet

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

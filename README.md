# SAE_4.01_FramaDocker
Outil de sondage qui permet d'organiser une date et un horaire de rencontre avec d'autres personnes au sein d'un association.


## Concept

Ce projet a pour but de faciliter la gestion des disponibilités de plusieurs personnes dans le cadre d'une rencontre.


#### Fonctionnalités essentielles:

- Créer un sondage avec pluseurs créneaux horaires/dates
- Pouvoir facilement partager le sondage
- Voter pour ses disponibilités
- Visualiser les résultats
- Identifier et proposer les créneaux correspondants


## Lancement de l'appli

Sur votre PC/serveur :

git clone https://github.com/NathanEyer/SAE_4.02_FramaDocker.git

Se placer dans la racine du projet et executer :

docker compose up -d

Les dockers tournent en tache de fond. Pour s'assurer qu'ils tournent bien, faire :

docker ps 


### Choix techniques

Listing des ports utilisés :

Frontend : 3000
Backend (API) : 4000
DB : 5432

Conception dockerisée :
![framadocker1](https://github.com/user-attachments/assets/e1e416cc-47ac-45e6-8bea-56dfdfda3dd2)

### API

Créer sondage   post
Update Sondage  put ID
Voir sondage    get ID


### Contribution (pull request)

Vous pouvez contribuer en faisant une Pull Request et en complétant les informations demandées par le template

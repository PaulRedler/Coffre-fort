# Module Coffre-Fort Documentaire – Défi National

**Version:** 1.0  
**Date:** 2025-12-05  
**Auteur:** [Ton Nom]

---

## Table des matières

1. [Introduction](#1-introduction)
2. [Prérequis](#2-prérequis)
3. [Structure du projet](#3-structure-du-projet)
4. [Installation des services](#4-installation-des-services)
5. [Configuration Backend](#5-configuration-backend)
6. [Configuration Frontend](#6-configuration-frontend)
7. [Intégration Mayan EDMS](#7-intégration-mayan-edms)
8. [Intégration LocalAI (IA)](#8-intégration-localai-ia)
9. [Docker – Conteneurisation](#9-docker--conteneurisation)
10. [Déploiement](#10-déploiement)
11. [Gestion des utilisateurs et rôles](#11-gestion-des-utilisateurs-et-rôles)
12. [Gestion des fenêtres d'accès temporaires](#12-gestion-des-fenêtres-daccès-temporaires)
13. [Routes Backend](#13-routes-backend)
14. [Frontend – Interfaces utilisateur et Admin](#14-frontend--interfaces-utilisateur-et-admin)
15. [Intégration SSO OIDC (Bonus)](#15-intégration-sso-oidc-bonus)
16. [Tests & Vérification](#16-tests--vérification)
17. [Démonstration vidéo](#17-démonstration-vidéo)
18. [FAQ et dépannage](#18-faq-et-dépannage)
19. [Bonnes pratiques](#19-bonnes-pratiques)
20. [Conclusion](#20-conclusion)

---

## 1. Introduction

Ce projet implémente un module "Coffre-Fort Documentaire" qui s'intègre à l'écosystème du Défi National. Il permet :

- Stockage sécurisé et recherche avancée de documents via Mayan EDMS
- Analyse de contenu par IA locale (résumés et mots-clés)
- Gestion des rôles et accès temporaires
- Interface frontend pour utilisateurs et portail admin
- Déploiement conteneurisé via docker-compose

---

## 2. Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- Node.js >=18
- npm >=9
- Docker >=24
- Docker Compose >=2.17
- Git
- Un éditeur de code (VSCode recommandé)
- Accès réseau pour télécharger les images Docker

---

## 3. Structure du projet

Le projet doit respecter cette arborescence :

```
mon-projet/
│
├── frontend/               # Application React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # API Node.js
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   ├── documents.js
│   │   │   ├── analyze.js
│   │   │   └── oidc.js
│   │   ├── services/
│   │   │   ├── mayan.js
│   │   │   ├── ai.js
│   │   │   └── oidc.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── utils/
│   │       └── timeWindow.js
│   └── package.json
│
├── models/                 # Modèles IA pour LocalAI
│
├── docker-compose.yml
├── README.md
└── .env                    # Fichier pour variables d'environnement
```

---

## 4. Installation des services

### Étapes détaillées

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ton-compte/module-coffre-fort.git
   cd module-coffre-fort
   ```

2. **Créer le fichier `.env` à la racine**
   ```env
   BACKEND_PORT=4000
   FRONTEND_PORT=3000
   MAYAN_PORT=8000
   LOCALAI_PORT=8081
   MAYAN_API_KEY=TON_API_KEY_ICI
   OIDC_CLIENT_ID=demo-client
   OIDC_CLIENT_SECRET=secret
   OIDC_REDIRECT_URI=http://localhost:4000/api/auth/oidc/callback
   ```

3. **Installer les dépendances du backend**
   ```bash
   cd backend
   npm install
   ```

4. **Installer les dépendances du frontend**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 5. Configuration Backend

### 1. `backend/src/app.js`
- Import express, cors
- Définir les routes : `/api/documents`, `/api/analyze`, `/api/auth/oidc`

### 2. `backend/src/routes/documents.js`
- `GET /api/documents`
- Appelle `getDocumentsFromMayan()`

### 3. `backend/src/routes/analyze.js`
- `GET /api/analyze/:id`
- Récupère l'OCR depuis Mayan
- Appelle `analyzeWithAI()`

### 4. `backend/src/services/mayan.js`
- Configuration URL et token Mayan
- Fonctions : `getDocumentsFromMayan()`, `getOCRFromMayan(id)`

### 5. `backend/src/services/ai.js`
- Fonction `analyzeWithAI(text)`
- POST vers LocalAI
- Retourne résumé + mots-clés

### 6. `backend/src/services/oidc.js`
- Configuration OpenID client pour SSO (Keycloak)
- Découverte de l'issuer
- Création du client avec client_id, secret et redirect_uris

### 7. `backend/src/middleware/auth.js`
- Middleware d'authentification
- Vérifie token / session
- Appel `timeWindow()` pour accès temporaire

---

## 6. Configuration Frontend

### 1. `frontend/src/main.jsx`
- Point d'entrée Vite + React
- App.jsx monté dans root div

### 2. `frontend/src/App.jsx`
- Routes React Router
- Pages : Login, Documents, Admin

### 3. `frontend/src/components/`
- **DocumentList.jsx** : liste documents avec lien analyse
- **DocumentAnalysis.jsx** : affiche résumé + mots-clés
- **AdminPanel.jsx** : gestion utilisateurs, rôles, fenêtres d'accès

### 4. `frontend/src/pages/`
- **LoginPage.jsx** : formulaire login + intégration OIDC
- **DocumentsPage.jsx** : liste des documents
- **AnalysisPage.jsx** : affichage résumé IA

---

## 7. Intégration Mayan EDMS

1. Docker image officielle : `mayanedms/mayanedms:latest`
2. Ports : exposé 8000
3. Création utilisateur admin via interface
4. Activer API REST
5. Ajouter documents de test pour démonstration
6. Vérifier OCR automatique sur documents PDF
7. Backend utilise Token API pour interroger Mayan

---

## 8. Intégration LocalAI (IA)

1. Docker image : `ghcr.io/go-skynet/localai:latest`
2. Volumes : `./models:/models`
3. Variables d'environnement : `MODELS_PATH=/models`
4. Port exposé : 8081
5. Test via curl POST sur `/v1/chat/completions`
6. Backend envoie texte OCR et récupère résumé + mots-clés
7. **Aucun texte ne sort du serveur (Privacy First)**

---

## 9. Docker – Conteneurisation

### `docker-compose.yml`

```yaml
version: "3.8"
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    depends_on:
      - mayan
      - localai
  
  mayan:
    image: mayanedms/mayanedms:latest
    ports:
      - "8000:8000"
  
  localai:
    image: ghcr.io/go-skynet/localai:latest
    ports:
      - "8081:8080"
    volumes:
      - ./models:/models
    environment:
      - MODELS_PATH=/models
  
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      - KEYCLOAK_USER=admin
      - KEYCLOAK_PASSWORD=admin
    ports:
      - "8080:8080"
    command: start-dev
```

---

## 10. Déploiement

### 1. Lancer tous les services
```bash
docker-compose up --build
```

### 2. Vérifier les logs
Assurez-vous que tous les services sont opérationnels

### 3. Accéder aux services
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:4000/api
- **Mayan** : http://localhost:8000
- **LocalAI** : http://localhost:8081
- **Keycloak** : http://localhost:8080

---

## 11. Gestion des utilisateurs et rôles

### Rôles

- **Administrateur** : gestion documents, accès temporaires, utilisateurs
- **Utilisateur simple** : consultation documents + IA

Backend vérifie les rôles sur chaque endpoint. Frontend adapte l'interface selon rôle.

---

## 12. Gestion des fenêtres d'accès temporaires

- `backend/src/utils/timeWindow.js`
- Fonction vérifie si la date actuelle est incluse dans les plages autorisées
- Middleware auth appelle `timeWindow()` pour chaque requête protégée

---

## 13. Routes Backend

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/documents` | GET | Liste documents |
| `/api/analyze/:id` | GET | Analyse IA document |
| `/api/auth/login` | POST | Login local |
| `/api/auth/oidc/login` | GET | Redirection Keycloak |
| `/api/auth/oidc/callback` | GET | Callback SSO OIDC |

---

## 14. Frontend – Interfaces utilisateur et Admin

- **LoginPage.jsx** : formulaire login + bouton OIDC
- **DocumentsPage.jsx** : liste documents avec recherche OCR
- **AnalysisPage.jsx** : résumé IA et mots-clés
- **AdminPanel.jsx** : gestion utilisateurs et fenêtres d'accès
- Navigation conditionnelle selon rôle

---

## 15. Intégration SSO OIDC (Bonus)

1. Lancer Keycloak dans docker-compose
2. Créer realm et client "demo-client"
3. Configurer redirect URI : `http://localhost:4000/api/auth/oidc/callback`
4. `backend/src/services/oidc.js`
   - Découverte issuer
   - Création client avec client_id et secret
5. `backend/src/routes/oidc.js`
   - `GET /login` : redirige vers Keycloak
   - `GET /callback` : reçoit code et récupère id_token
6. Frontend récupère session et accède automatiquement à Mayan via SSO

---

## 16. Tests & Vérification

- Vérifier logs docker-compose
- Tester endpoints backend avec Postman ou curl
- Vérifier affichage frontend
- Upload d'un document dans Mayan et OCR
- Analyse IA : résumé + mots-clés corrects
- Test SSO : login unique sur frontend + accès Mayan

---

## 17. Démonstration vidéo

### Contenu à montrer

- Montrer `docker-compose up`
- Accès à Mayan
- Upload d'un document
- Recherche OCR
- Analyse IA
- Gestion rôles et fenêtres
- SSO OIDC (bonus)

**Durée :** 3-5 minutes  
**À fournir :** vidéo pour le jury

---

## 18. FAQ et dépannage

### Q : Backend ne démarre pas ?
**R :** Vérifier Node.js et `npm install`

### Q : Frontend reste sur page Vite + React ?
**R :** `npm run dev` depuis dossier frontend

### Q : Docker Compose échoue ?
**R :** Vérifier ports et supprimer containers existants

### Q : LocalAI ne répond pas ?
**R :** Vérifier volumes `./models` et `MODELS_PATH`

### Q : SSO OIDC ne fonctionne pas ?
**R :** Vérifier Keycloak URL et client_id / secret / redirect_uri

---

## 19. Bonnes pratiques

- Utiliser des branches Git pour chaque fonctionnalité
- Documenter chaque modification
- Séparer logique backend et frontend
- Maintenir IA et Mayan dans des containers séparés
- Ne jamais exposer token API Mayan dans le frontend

---

## 20. Conclusion

Ce module est prêt pour intégration dans l'écosystème du Défi National.

✅ Conteneurisé  
✅ Sécurisé  
✅ IA locale  
✅ Support SSO OIDC  
✅ Frontend réactif et administrable

---

**Fin du README**

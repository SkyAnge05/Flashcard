<div align="center">
  <img src="https://raw.githubusercontent.com/tosh/flashlingo/main/assets/icon.png" width="100" height="100" alt="FlashLingo Logo" style="filter: drop-shadow(0 0 10px #8a2be2);">
  
  <h1>⚡ FlashLingo</h1>
  
  <p><strong>Apprends du vocabulaire, une carte à la fois.</strong></p>
  <p>Une application moderne de flashcards conçue pour être belle, fluide et efficace sur toutes tes plateformes.</p>

  <p>
    <img src="https://img.shields.io/badge/Version-1.0.0-blueviolet" alt="Version">
    <img src="https://img.shields.io/badge/Plateformes-Web%20%7C%20Windows%20%7C%20Linux%20%7C%20Android-success" alt="Plateformes">
  </p>
</div>

---

## ✨ Fonctionnalités

*   📖 **Mode Étude** : Fais défiler tes cartes de vocabulaire, retourne-les pour voir la traduction, et évalue ta propre mémorisation.
*   🧠 **Mode Quiz** : Teste tes connaissances sérieusement. L'application te donne le mot et tu dois taper la traduction exacte.
*   📋 **Gestion des Cartes** : Ajoute de nouvelles cartes, modifie-les, ou supprime-les facilement depuis ton espace "Liste".
*   💾 **Sauvegarde Locale & Import/Export** : Tes données sont enregistrées en sécurité sur ton appareil. Tu peux exporter toutes tes cartes au format `.json` ou importer des listes massives de mots avec un simple copier/coller.
*   🌙 **Design Premium** : Un design moderne avec "Glassmorphism", un mode sombre natif apaisant pour les yeux, et des transitions d'écrans extrêmement fluides.

## 🚀 Installation & Utilisation

FlashLingo fonctionne partout grâce aux technologies web, Electron et Android WebView !

### Option 1 : Dans ton navigateur (Web)
C'est la méthode la plus simple pour tester tout de suite.
1. Clone ce dépôt ou télécharge le code.
2. Ouvre simplement le fichier `index.html` dans n'importe quel navigateur web.
3. Tes cartes seront sauvegardées dans la mémoire locale de ton navigateur.

### Option 2 : Application Bureau (Windows / Linux)
Construite avec Electron pour une expérience Desktop native.
1. Assure-toi d'avoir installé [Node.js](https://nodejs.org/).
2. Ouvre un terminal dans ce dossier et lance l'installation :
   ```bash
   npm install
   ```
3. Lancer l'application en mode développement :
   ```bash
   npm start
   ```
4. **Compiler les exécutables** (`.exe` pour Windows, `.AppImage` pour Linux) :
   ```bash
   npm run build
   ```
   Les fichiers générés se trouveront dans le dossier `dist/`.

### Option 3 : Application Mobile (Android)
L'application est 100% compatible Android (Smartphone et Tablette) grâce à une WebView très optimisée.
1. Ouvre le sous-dossier `android-app/` avec **Android Studio**.
2. Attends que Gradle synchronise le projet.
3. Clique sur **Run** pour la lancer sur ton téléphone ou sur un émulateur, ou génère un APK depuis le menu *Build > Build Bundle(s) / APK(s)*.

## 🛠️ Stack Technique

*   **Frontend Vanilla** : HTML5 sémantique, CSS3 (Flexbox/Grid, Animations CSS), JavaScript (ES6+).
*   **Desktop** : [Electron](https://www.electronjs.org/) & `electron-builder`.
*   **Mobile** : Kotlin (Android WebView) & Gradle.

## 🤝 Contribuer

Les contributions, issues et pull requests sont les bienvenues ! N'hésite pas à proposer de nouvelles fonctionnalités ou des améliorations de l'interface.

---
*Créé avec passion.*
# FlashLingo

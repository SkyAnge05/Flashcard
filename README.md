<div align="center">
  <img src="https://raw.githubusercontent.com/SkyAnge05/Flashcard/main/build/icon.png" width="120" height="120" alt="FlashLingo Logo" style="filter: drop-shadow(0 0 10px rgba(138, 43, 226, 0.5)); border-radius: 20px;">
  
  <h1>⚡ FlashLingo</h1>
  
  <p><strong>Ton outil ultime pour apprendre du vocabulaire, une carte à la fois.</strong></p>
  <p>Une application moderne de flashcards conçue pour être belle, fluide et redoutablement efficace sur toutes tes plateformes.</p>

  <p>
    <a href="https://github.com/SkyAnge05/Flashcard/releases">
      <img src="https://img.shields.io/github/v/release/SkyAnge05/Flashcard?style=for-the-badge&color=blueviolet" alt="Dernière Version">
    </a>
    <img src="https://img.shields.io/badge/Plateformes-Web%20%7C%20Windows%20%7C%20Linux%20%7C%20Android-success?style=for-the-badge" alt="Plateformes">
  </p>
</div>

---

## ✨ Fonctionnalités Principales

*   📖 **Mode Étude** : Fais défiler tes cartes de vocabulaire. Essaie de deviner, retourne-les pour voir la traduction, et évalue toi-même ta mémorisation.
*   🧠 **Mode Quiz Intransigeant** : Teste tes connaissances sérieusement. L'application te donne le mot et tu dois taper la traduction à la lettre près !
*   📋 **Gestion Facile des Cartes** : Ajoute de nouvelles cartes, modifie-les pour corriger une faute, ou supprime-les facilement depuis ton espace "Liste".
*   💾 **Sécurité & Import/Export** : Tes données sont enregistrées en sécurité localement. Tu peux exporter toutes tes cartes au format `.json` ou importer des listes massives de mots d'un coup.
*   🌙 **Design Premium** : Profite d'une interface inspirée des meilleures applications natives avec des effets "Glassmorphism", un mode sombre apaisant, et des transitions d'écrans animées et fluides.

---

## 🚀 Installation & Utilisation

**FlashLingo** a été pensée pour être universelle. Choisis la plateforme qui te convient :

### 🌐 Option 1 : Directement dans ton navigateur (Web)
C'est la méthode la plus rapide pour commencer tout de suite.
1. [Télécharge le code ZIP](https://github.com/SkyAnge05/Flashcard/archive/refs/heads/main.zip) ou clone le dépôt.
2. Ouvre le fichier `index.html` dans n'importe quel navigateur web (Chrome, Firefox, Edge...).
3. Tes cartes seront sauvegardées de façon permanente dans la mémoire locale de ton navigateur.

### 💻 Option 2 : Application Bureau (Windows / Linux)
Profite de l'expérience native complète grâce à Electron.
1. Installe [Node.js](https://nodejs.org/).
2. Ouvre un terminal dans le dossier du projet et installe les dépendances :
   ```bash
   npm install
   ```
3. Lancer l'application en mode développement :
   ```bash
   npm start
   ```
4. **Créer ton exécutable final** (`.exe` ou `.AppImage`) :
   ```bash
   npm run build
   ```
   *Les fichiers finaux seront disponibles dans le dossier `dist/`.*

### 📱 Option 3 : Application Mobile (Android)
Emmène tes révisions partout avec toi. L'interface s'adapte parfaitement au tactile avec des transitions optimisées !
1. Ouvre le dossier `android-app/` avec **Android Studio**.
2. Attends que Gradle télécharge les dépendances.
3. Branche ton téléphone Android ou lance un émulateur, puis clique sur **Run**.
4. *Ou bien*, génère le fichier installable depuis le menu : **Build > Build Bundle(s) / APK(s)**.

---

## 🛠️ Stack Technique

*   **Frontend Vanilla** : L'interface est codée de manière pure pour une légèreté maximale (HTML5 sémantique, animations CSS3, JavaScript ES6+).
*   **Desktop** : Propulsé par le framework [Electron](https://www.electronjs.org/) & généré avec `electron-builder`.
*   **Mobile** : Application native Kotlin intégrant une WebView pour rendre le code web compatible sur Android.

---

## 🤝 Contribution
Tu veux améliorer FlashLingo ? N'hésite pas à ouvrir une *Issue* ou proposer une *Pull Request* pour corriger un bug ou rajouter une super fonctionnalité !

<div align="center">
  <br>
  <i>Développé avec passion.</i>
</div>

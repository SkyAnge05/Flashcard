/* ============================================
   FlashLingo — Application Logic (Complete)
   ============================================ */

'use strict';

// ─── State ──────────────────────────────────────
const STORAGE_KEY = 'flashlingo_cards';

let cards = [];
let currentIndex = 0;
let currentView = 'study'; // 'study' | 'quiz' | 'list'
let editingCardId = null; // null = adding, string = editing

// Session tracking
let sessionCorrect = 0;
let sessionWrong = 0;

// Quiz state
let quizCards = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

// ─── DOM References ─────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  // Sections
  emptyState: $('#empty-state'),
  studyMode: $('#study-mode'),
  quizMode: $('#quiz-mode'),
  cardsListSection: $('#cards-list-section'),
  viewToggle: $('#view-toggle'),

  // Stats
  statTotal: $('#stat-total'),
  statMastered: $('#stat-mastered'),

  // Controls
  btnAddCard: $('#btn-add-card'),
  btnShuffle: $('#btn-shuffle'),
  btnExport: $('#btn-export'),
  btnImport: $('#btn-import'),
  btnClearAll: $('#btn-clear-all'),
  btnStudy: $('#btn-study'),
  btnCreateFirst: $('#btn-create-first'),

  // Flashcard
  flashcard: $('#flashcard'),
  flashcardInner: $('#flashcard-inner'),
  cardFrontWord: $('#card-front-word'),
  cardBackWord: $('#card-back-word'),

  // Progress
  progressFill: $('#progress-fill'),
  progressText: $('#progress-text'),

  // Navigation
  btnPrev: $('#btn-prev'),
  btnNext: $('#btn-next'),
  btnFail: $('#btn-fail'),
  btnSuccess: $('#btn-success'),

  // Session score
  sessionCorrect: $('#session-correct'),
  sessionWrong: $('#session-wrong'),

  // Dialog — Add/Edit
  dialog: $('#dialog-add-card'),
  dialogTitle: $('#dialog-title'),
  formAddCard: $('#form-add-card'),
  inputWord: $('#input-word'),
  inputTranslation: $('#input-translation'),
  btnCloseDialog: $('#btn-close-dialog'),
  btnCancelDialog: $('#btn-cancel-dialog'),
  btnSubmitCard: $('#btn-submit-card'),
  btnSubmitText: $('#btn-submit-text'),

  // Dialog — Import
  dialogImport: $('#dialog-import'),
  formImport: $('#form-import'),
  importTextarea: $('#import-textarea'),
  btnCloseImport: $('#btn-close-import'),
  btnCancelImport: $('#btn-cancel-import'),

  // Cards grid
  cardsGrid: $('#cards-grid'),

  // View toggle
  toggleStudy: $('#toggle-study'),
  toggleQuiz: $('#toggle-quiz'),
  toggleList: $('#toggle-list'),

  // Quiz
  quizCard: $('#quiz-card'),
  quizWord: $('#quiz-word'),
  quizInput: $('#quiz-input'),
  quizCurrent: $('#quiz-current'),
  quizTotal: $('#quiz-total'),
  btnQuizCheck: $('#btn-quiz-check'),
  quizFeedback: $('#quiz-feedback'),
  quizFeedbackContent: $('#quiz-feedback-content'),
  btnQuizNext: $('#btn-quiz-next'),
  quizResults: $('#quiz-results'),
  quizScoreNumber: $('#quiz-score-number'),
  quizScoreTotal: $('#quiz-score-total'),
  quizScoreLabel: $('#quiz-score-label'),
  btnQuizRestart: $('#btn-quiz-restart'),
  btnQuizBack: $('#btn-quiz-back'),

  // Toast
  toastContainer: $('#toast-container'),
};

// ─── Persistence ────────────────────────────────
function loadCards() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    cards = data ? JSON.parse(data) : [];
  } catch {
    cards = [];
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// ─── Card CRUD ──────────────────────────────────
function addCard(word, translation) {
  const card = {
    id: crypto.randomUUID(),
    word: word.trim(),
    translation: translation.trim(),
    mastered: false,
    createdAt: Date.now(),
  };
  cards.push(card);
  saveCards();
  return card;
}

function updateCard(id, word, translation) {
  const card = cards.find((c) => c.id === id);
  if (!card) return null;
  card.word = word.trim();
  card.translation = translation.trim();
  saveCards();
  return card;
}

function deleteCard(id) {
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return;
  cards.splice(index, 1);
  saveCards();

  // Adjust currentIndex if necessary
  if (currentIndex >= cards.length) {
    currentIndex = Math.max(0, cards.length - 1);
  }
}

function clearAllCards() {
  cards = [];
  currentIndex = 0;
  saveCards();
}

function shuffleArray(arr) {
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleCards() {
  shuffleArray(cards);
  currentIndex = 0;
  saveCards();
}

// ─── Export / Import ────────────────────────────
function exportCards() {
  if (cards.length === 0) return;

  const data = JSON.stringify(cards, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `flashlingo_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`${cards.length} cartes exportées ! 📤`);
}

function importFromText(text) {
  const lines = text.split('\n').filter((l) => l.trim());
  let imported = 0;
  let duplicates = 0;

  for (const line of lines) {
    // Support ; or tab as separator
    const parts = line.includes(';') ? line.split(';') : line.split('\t');
    if (parts.length < 2) continue;

    const word = parts[0].trim();
    const translation = parts[1].trim();
    if (!word || !translation) continue;

    // Skip duplicates
    const exists = cards.find((c) => c.word.toLowerCase() === word.toLowerCase());
    if (exists) {
      duplicates++;
      continue;
    }

    addCard(word, translation);
    imported++;
  }

  return { imported, duplicates };
}

// ─── UI Updates ─────────────────────────────────
function updateStats() {
  const total = cards.length;
  const mastered = cards.filter((c) => c.mastered).length;

  dom.statTotal.innerHTML = `<span class="stat-number">${total}</span> carte${total !== 1 ? 's' : ''}`;
  dom.statMastered.innerHTML = `<span class="stat-number">${mastered}</span> maîtrisée${mastered !== 1 ? 's' : ''}`;

  // Enable / disable buttons
  const hasCards = total > 0;
  dom.btnShuffle.disabled = !hasCards;
  dom.btnExport.disabled = !hasCards;
  dom.btnClearAll.disabled = !hasCards;
  dom.btnStudy.disabled = !hasCards;
}

function updateSessionDisplay() {
  dom.sessionCorrect.textContent = sessionCorrect;
  dom.sessionWrong.textContent = sessionWrong;
}

function updateVisibility(oldView, newView) {
  const hasCards = cards.length > 0;

  // Toggle empty state visibility in study mode
  dom.emptyState.hidden = hasCards;
  document.getElementById('study-active-content').hidden = !hasCards;
  dom.viewToggle.hidden = !hasCards;

  if (!hasCards && !newView) {
    currentView = 'list';
    setActiveToggle('list');
  }

  const targetView = newView || currentView;

  const sections = {
    'study': dom.studyMode,
    'quiz': dom.quizMode,
    'list': dom.cardsListSection
  };

  for (const [key, section] of Object.entries(sections)) {
    if (key === targetView) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  }
}

function renderCurrentCard() {
  if (cards.length === 0) return;

  const card = cards[currentIndex];
  if (!card) return;

  dom.cardFrontWord.textContent = card.word;
  dom.cardBackWord.textContent = card.translation;

  // Reset flip
  dom.flashcard.classList.remove('flipped');

  // Update progress
  const pct = ((currentIndex + 1) / cards.length) * 100;
  dom.progressFill.style.width = `${pct}%`;
  dom.progressText.textContent = `${currentIndex + 1} / ${cards.length}`;

  // Update nav buttons
  dom.btnPrev.disabled = currentIndex === 0;
  dom.btnNext.disabled = currentIndex === cards.length - 1;
}

function renderCardsList() {
  dom.cardsGrid.innerHTML = '';

  cards.forEach((card, index) => {
    const el = document.createElement('div');
    el.className = `card-item${card.mastered ? ' mastered' : ''}`;
    el.style.animationDelay = `${index * 0.04}s`;
    el.innerHTML = `
      <div class="card-item-words" data-id="${card.id}" title="Cliquer pour modifier">
        <span class="card-item-word">${escapeHTML(card.word)}</span>
        <span class="card-item-arrow">→</span>
        <span class="card-item-translation">${escapeHTML(card.translation)}</span>
      </div>
      <div class="card-item-footer">
        <span class="card-item-status ${card.mastered ? 'mastered' : 'learning'}">
          ${card.mastered ? '✓ Maîtrisé' : '📖 À apprendre'}
        </span>
        <div class="card-item-actions">
          <button class="card-item-btn edit" data-id="${card.id}" title="Modifier" aria-label="Modifier ${escapeHTML(card.word)}">
            ✏️
          </button>
          <button class="card-item-btn delete" data-id="${card.id}" title="Supprimer" aria-label="Supprimer ${escapeHTML(card.word)}">
            🗑️
          </button>
        </div>
      </div>
    `;
    dom.cardsGrid.appendChild(el);
  });
}

function refreshUI() {
  updateStats();
  updateVisibility();
  updateSessionDisplay();
  renderCurrentCard();
  if (currentView === 'list') {
    renderCardsList();
  }
}

// ─── View Toggle ────────────────────────────────
function setActiveToggle(view) {
  dom.toggleStudy.classList.toggle('active', view === 'study');
  dom.toggleQuiz.classList.toggle('active', view === 'quiz');
  dom.toggleList.classList.toggle('active', view === 'list');
}

function switchView(view) {
  if (view === currentView) return;
  const oldView = currentView;
  currentView = view;
  setActiveToggle(view);
  updateVisibility(oldView, view);

  if (view === 'study') {
    renderCurrentCard();
  } else if (view === 'list') {
    renderCardsList();
  } else if (view === 'quiz') {
    startQuiz();
  }
}

// ─── Dialog Management ──────────────────────────
function openAddDialog() {
  editingCardId = null;
  dom.dialogTitle.textContent = 'Nouvelle carte';
  dom.btnSubmitText.textContent = 'Ajouter';
  dom.inputWord.value = '';
  dom.inputTranslation.value = '';
  dom.dialog.showModal();
  setTimeout(() => dom.inputWord.focus(), 100);
}

function openEditDialog(id) {
  const card = cards.find((c) => c.id === id);
  if (!card) return;

  editingCardId = id;
  dom.dialogTitle.textContent = 'Modifier la carte';
  dom.btnSubmitText.textContent = 'Enregistrer';
  dom.inputWord.value = card.word;
  dom.inputTranslation.value = card.translation;
  dom.dialog.showModal();
  setTimeout(() => dom.inputWord.focus(), 100);
}

function closeDialog() {
  dom.dialog.close();
  editingCardId = null;
}

function openImportDialog() {
  dom.importTextarea.value = '';
  dom.dialogImport.showModal();
  setTimeout(() => dom.importTextarea.focus(), 100);
}

function closeImportDialog() {
  dom.dialogImport.close();
}

// ─── Quiz Logic ─────────────────────────────────
function startQuiz() {
  if (cards.length === 0) {
    switchView('study');
    return;
  }

  quizCards = shuffleArray([...cards]);
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;

  dom.quizResults.hidden = true;
  dom.quizCard.hidden = false;
  dom.quizInput.parentElement.hidden = false;
  dom.quizFeedback.hidden = true;
  dom.quizTotal.textContent = quizCards.length;

  renderQuizCard();
}

function renderQuizCard() {
  if (quizIndex >= quizCards.length) {
    showQuizResults();
    return;
  }

  const card = quizCards[quizIndex];
  dom.quizWord.textContent = card.word;
  dom.quizInput.value = '';
  dom.quizInput.disabled = false;
  dom.quizCurrent.textContent = quizIndex + 1;
  dom.quizFeedback.hidden = true;
  dom.quizInput.parentElement.hidden = false;
  dom.btnQuizCheck.disabled = false;
  quizAnswered = false;

  setTimeout(() => dom.quizInput.focus(), 100);
}

function checkQuizAnswer() {
  if (quizAnswered) return;
  quizAnswered = true;

  const card = quizCards[quizIndex];
  const userAnswer = dom.quizInput.value.trim().toLowerCase();
  const correctAnswer = card.translation.trim().toLowerCase();

  // Tolerant comparison: remove accents for comparison
  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const isCorrect = normalize(userAnswer) === normalize(correctAnswer);

  if (isCorrect) {
    quizScore++;
    dom.quizFeedback.className = 'quiz-feedback correct';
    dom.quizFeedbackContent.textContent = `✓ Correct ! C'est bien « ${card.translation} »`;
  } else {
    dom.quizFeedback.className = 'quiz-feedback wrong';
    dom.quizFeedbackContent.innerHTML = `✗ La bonne réponse était : <strong>${escapeHTML(card.translation)}</strong>`;
  }

  dom.quizFeedback.hidden = false;
  dom.quizInput.disabled = true;
  dom.btnQuizCheck.disabled = true;

  // Focus the next button
  setTimeout(() => dom.btnQuizNext.focus(), 100);
}

function nextQuizCard() {
  quizIndex++;
  if (quizIndex >= quizCards.length) {
    showQuizResults();
  } else {
    renderQuizCard();
  }
}

function showQuizResults() {
  dom.quizCard.hidden = true;
  dom.quizInput.parentElement.hidden = true;
  dom.quizFeedback.hidden = true;
  dom.quizResults.hidden = false;

  dom.quizScoreNumber.textContent = quizScore;
  dom.quizScoreTotal.textContent = quizCards.length;

  const pct = quizCards.length > 0 ? (quizScore / quizCards.length) * 100 : 0;
  if (pct === 100) {
    dom.quizScoreLabel.textContent = '🏆 Parfait ! Tu maîtrises tout !';
  } else if (pct >= 80) {
    dom.quizScoreLabel.textContent = '🌟 Excellent travail !';
  } else if (pct >= 60) {
    dom.quizScoreLabel.textContent = '👍 Bien joué, continue !';
  } else if (pct >= 40) {
    dom.quizScoreLabel.textContent = '📖 Encore un effort !';
  } else {
    dom.quizScoreLabel.textContent = '💪 Révise un peu plus !';
  }
}

// ─── Toast Notification ─────────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 2500);
}

// ─── Helpers ────────────────────────────────────
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Event Handlers ─────────────────────────────

// Add / Edit card form submission
dom.formAddCard.addEventListener('submit', (e) => {
  e.preventDefault();
  const word = dom.inputWord.value.trim();
  const translation = dom.inputTranslation.value.trim();

  if (!word || !translation) {
    showToast('Remplis les deux champs !', 'danger');
    return;
  }

  if (editingCardId) {
    // Editing existing card
    // Check for duplicates (exclude current card)
    const duplicate = cards.find(
      (c) => c.word.toLowerCase() === word.toLowerCase() && c.id !== editingCardId
    );
    if (duplicate) {
      showToast(`"${word}" existe déjà !`, 'danger');
      dom.inputWord.focus();
      dom.inputWord.parentElement.classList.add('shake');
      setTimeout(() => dom.inputWord.parentElement.classList.remove('shake'), 500);
      return;
    }

    updateCard(editingCardId, word, translation);
    closeDialog();
    showToast(`Carte modifiée ! ✏️`);
  } else {
    // Adding new card
    const duplicate = cards.find(
      (c) => c.word.toLowerCase() === word.toLowerCase()
    );
    if (duplicate) {
      showToast(`"${word}" existe déjà !`, 'danger');
      dom.inputWord.focus();
      dom.inputWord.parentElement.classList.add('shake');
      setTimeout(() => dom.inputWord.parentElement.classList.remove('shake'), 500);
      return;
    }

    addCard(word, translation);
    closeDialog();
    showToast(`Carte "${word}" ajoutée !`);

    // If this is the first card, go to study view
    if (cards.length === 1) {
      currentIndex = 0;
      switchView('study');
    }
  }

  refreshUI();
});

// Open add dialog buttons
dom.btnAddCard.addEventListener('click', () => openAddDialog());
dom.btnCreateFirst.addEventListener('click', () => openAddDialog());

// Close dialog
dom.btnCloseDialog.addEventListener('click', closeDialog);
dom.btnCancelDialog.addEventListener('click', closeDialog);
dom.dialog.addEventListener('click', (e) => {
  if (e.target === dom.dialog) closeDialog();
});

// Import dialog
dom.btnImport.addEventListener('click', () => openImportDialog());
dom.btnCloseImport.addEventListener('click', closeImportDialog);
dom.btnCancelImport.addEventListener('click', closeImportDialog);
dom.dialogImport.addEventListener('click', (e) => {
  if (e.target === dom.dialogImport) closeImportDialog();
});

dom.formImport.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = dom.importTextarea.value.trim();
  if (!text) {
    showToast('Colle du texte à importer !', 'danger');
    return;
  }

  const result = importFromText(text);
  closeImportDialog();

  if (result.imported === 0) {
    showToast(`Aucune carte importée ${result.duplicates > 0 ? `(${result.duplicates} doublon${result.duplicates > 1 ? 's' : ''})` : ''}`, 'danger');
  } else {
    let msg = `${result.imported} carte${result.imported > 1 ? 's' : ''} importée${result.imported > 1 ? 's' : ''} !`;
    if (result.duplicates > 0) {
      msg += ` (${result.duplicates} doublon${result.duplicates > 1 ? 's' : ''} ignoré${result.duplicates > 1 ? 's' : ''})`;
    }
    showToast(msg);
  }

  if (cards.length > 0 && currentView !== 'list') {
    switchView('study');
  }
  refreshUI();
});

// Export
dom.btnExport.addEventListener('click', exportCards);

// Flashcard flip
dom.flashcard.addEventListener('click', () => {
  dom.flashcard.classList.toggle('flipped');
});

dom.flashcard.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    dom.flashcard.classList.toggle('flipped');
  }
});

// Navigation
dom.btnPrev.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrentCard();
  }
});

dom.btnNext.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    renderCurrentCard();
  }
});

// Mastery actions
dom.btnSuccess.addEventListener('click', () => {
  if (cards.length === 0) return;
  const card = cards[currentIndex];
  if (!card) return;
  card.mastered = true;
  saveCards();
  sessionCorrect++;
  showToast(`"${card.word}" maîtrisé ! 🎉`);
  refreshUI();

  // Auto-advance to next card
  if (currentIndex < cards.length - 1) {
    setTimeout(() => {
      currentIndex++;
      renderCurrentCard();
    }, 600);
  }
});

dom.btnFail.addEventListener('click', () => {
  if (cards.length === 0) return;
  const card = cards[currentIndex];
  if (!card) return;
  card.mastered = false;
  saveCards();
  sessionWrong++;
  showToast(`"${card.word}" à revoir 📖`, 'danger');
  refreshUI();
});

// Shuffle
dom.btnShuffle.addEventListener('click', () => {
  if (cards.length < 2) return;
  shuffleCards();
  showToast('Cartes mélangées ! 🔀');
  refreshUI();
});

// Clear all
dom.btnClearAll.addEventListener('click', () => {
  if (cards.length === 0) return;
  if (!confirm('Supprimer toutes les cartes ? Cette action est irréversible.')) return;
  clearAllCards();
  showToast('Toutes les cartes ont été supprimées', 'danger');
  refreshUI();
});

// Cards grid — edit & delete (event delegation)
dom.cardsGrid.addEventListener('click', (e) => {
  // Edit button
  const editBtn = e.target.closest('.card-item-btn.edit');
  if (editBtn) {
    openEditDialog(editBtn.dataset.id);
    return;
  }

  // Delete button
  const deleteBtn = e.target.closest('.card-item-btn.delete');
  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    deleteCard(id);
    showToast(`"${card.word}" supprimée`, 'danger');
    refreshUI();
    return;
  }

  // Click on word row to edit
  const wordRow = e.target.closest('.card-item-words');
  if (wordRow) {
    openEditDialog(wordRow.dataset.id);
  }
});

// View toggle
dom.toggleStudy.addEventListener('click', () => switchView('study'));
dom.toggleQuiz.addEventListener('click', () => switchView('quiz'));
dom.toggleList.addEventListener('click', () => switchView('list'));

// Study button in list view
dom.btnStudy.addEventListener('click', () => {
  currentIndex = 0;
  switchView('study');
});

// ─── Quiz Event Handlers ────────────────────────
dom.btnQuizCheck.addEventListener('click', checkQuizAnswer);

dom.quizInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!quizAnswered) {
      checkQuizAnswer();
    } else {
      nextQuizCard();
    }
  }
});

dom.btnQuizNext.addEventListener('click', nextQuizCard);

dom.btnQuizRestart.addEventListener('click', () => {
  startQuiz();
});

dom.btnQuizBack.addEventListener('click', () => {
  switchView('study');
});

// ─── Keyboard Shortcuts ─────────────────────────
document.addEventListener('keydown', (e) => {
  // Don't handle if dialog is open or user is typing
  if (dom.dialog.open || dom.dialogImport.open) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      if (currentIndex > 0 && currentView === 'study') {
        currentIndex--;
        renderCurrentCard();
      }
      break;

    case 'ArrowRight':
      e.preventDefault();
      if (currentIndex < cards.length - 1 && currentView === 'study') {
        currentIndex++;
        renderCurrentCard();
      }
      break;

    case ' ':
      e.preventDefault();
      if (currentView === 'study' && cards.length > 0) {
        dom.flashcard.classList.toggle('flipped');
      }
      break;

    case 'n':
    case 'N':
      if (!e.ctrlKey && !e.metaKey) {
        openAddDialog();
      }
      break;
  }
});

// ─── Swipe Support (Touch) ──────────────────────
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 60;

dom.flashcard.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

dom.flashcard.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  // Only horizontal swipes
  if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && currentIndex > 0) {
      currentIndex--;
      renderCurrentCard();
    } else if (dx < 0 && currentIndex < cards.length - 1) {
      currentIndex++;
      renderCurrentCard();
    }
  }
}, { passive: true });

// ─── Initialize ─────────────────────────────────
function init() {
  loadCards();
  currentIndex = 0;
  refreshUI();
}

init();

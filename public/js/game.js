const translations = {
  de: {
    subtitle: 'Willkommen zu den Hungerspielen',
    langLabel: 'Sprache / Language',
    btnQuiz: 'Quiz starten',
    btnFavspot: 'Lieblingsstelle',
    btnSummary: 'Zusammenfassung',
    btnGame: 'Spiel',
    btnBackFavspot: 'Zur\u00fcck zum Men\u00fc',
    next: 'Weiter',
    resultTitle: 'Ergebnis',
    backMenu: 'Zur\u00fcck zum Men\u00fc',
    correct: 'Richtig!',
    wrong: 'Falsch!',
    progress: 'Frage {n} / {total}',
    score: '{score} / {total} richtig',
    favspotPlaceholder: 'Lieblingsstelle wird hier erscheinen...',
    summaryPlaceholder: 'Zusammenfassung wird hier erscheinen...',
  },
  en: {
    subtitle: 'Welcome to the Hunger Games',
    langLabel: 'Language',
    btnQuiz: 'Start Quiz',
    btnFavspot: 'Favorite Spot',
    btnSummary: 'Summary',
    btnGame: 'Game',
    btnBackFavspot: 'Back to Menu',
    next: 'Next',
    resultTitle: 'Result',
    backMenu: 'Back to Menu',
    correct: 'Correct!',
    wrong: 'Wrong!',
    progress: 'Question {n} / {total}',
    score: '{score} / {total} correct',
    favspotPlaceholder: 'Favorite spot will appear here...',
    summaryPlaceholder: 'Summary will appear here...',
  },
  fr: {
    subtitle: 'Bienvenue aux Hunger Games',
    langLabel: 'Langue',
    btnQuiz: 'Commencer le quiz',
    btnFavspot: 'Endroit favori',
    btnSummary: 'Résumé',
    btnGame: 'Jeu',
    btnBackFavspot: 'Retour au menu',
    next: 'Suivant',
    resultTitle: 'R\u00e9sultat',
    backMenu: 'Retour au menu',
    correct: 'Correct!',
    wrong: 'Faux!',
    progress: 'Question {n} / {total}',
    score: '{score} / {total} correct',
    favspotPlaceholder: 'L\'endroit favori appara\u00eetra ici...',
    summaryPlaceholder: 'Le résumé apparaîtra ici...',
  },
  es: {
    subtitle: 'Bienvenido a los Juegos del Hambre',
    langLabel: 'Idioma',
    btnQuiz: 'Comenzar cuestionario',
    btnFavspot: 'Lugar favorito',
    btnSummary: 'Resumen',
    btnGame: 'Juego',
    btnBackFavspot: 'Volver al men\u00fa',
    next: 'Siguiente',
    resultTitle: 'Resultado',
    backMenu: 'Volver al men\u00fa',
    correct: '\u00a1Correcto!',
    wrong: '\u00a1Incorrecto!',
    progress: 'Pregunta {n} / {total}',
    score: '{score} / {total} correctas',
    favspotPlaceholder: 'El lugar favorito aparecer\u00e1 aqu\u00ed...',
    summaryPlaceholder: 'El resumen aparecer\u00e1 aqu\u00ed...',
  },
};

const langSelect = document.getElementById('lang-select');
const subtitle = document.getElementById('subtitle');
const langLabel = document.getElementById('lang-label');
const btnQuiz = document.getElementById('btn-quiz');
const btnFavspot = document.getElementById('btn-favspot');

const welcome = document.getElementById('welcome');
const quizScreen = document.getElementById('quiz-screen');
const quizProgress = document.getElementById('quiz-progress');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizNext = document.getElementById('quiz-next');
const quizResult = document.getElementById('quiz-result');
const quizScore = document.getElementById('quiz-score');
const resultTitle = document.getElementById('result-title');
const btnBackMenu = document.getElementById('btn-back-menu');
const favspotScreen = document.getElementById('favspot-screen');
const favspotText = document.getElementById('favspot-text');
const btnBackFavspot = document.getElementById('btn-back-favspot');
const summaryScreen = document.getElementById('summary-screen');
const summaryText = document.getElementById('summary-text');
const btnBackSummary = document.getElementById('btn-back-summary');
const btnSummary = document.getElementById('btn-summary');
const btnGame = document.getElementById('btn-game');
const langTop = document.getElementById('lang-top');

let currentQuiz = null;

function applyLanguage(lang) {
  const t = translations[lang];
  subtitle.textContent = t.subtitle;
  langLabel.textContent = t.langLabel;
  btnQuiz.textContent = t.btnQuiz;
  btnFavspot.textContent = t.btnFavspot;
  btnSummary.textContent = t.btnSummary;
  btnGame.textContent = t.btnGame;
  btnBackFavspot.textContent = t.btnBackFavspot;
  quizNext.textContent = t.next;
  resultTitle.textContent = t.resultTitle;
  btnBackMenu.textContent = t.backMenu;
  favspotText.innerHTML = t.favspotPlaceholder;
  summaryText.innerHTML = t.summaryPlaceholder;
  btnBackSummary.textContent = t.btnBackFavspot;
}

function applyQuizLanguage(lang) {
  const t = translations[lang];
  if (currentQuiz) {
    const n = currentQuiz.currentIndex + 1;
    const total = currentQuiz.questions.length;
    quizProgress.textContent = t.progress.replace('{n}', n).replace('{total}', total);
  }
  quizNext.textContent = t.next;
  resultTitle.textContent = t.resultTitle;
  btnBackMenu.textContent = t.backMenu;
}

function setLanguage(lang) {
  langSelect.value = lang;
  langTop.value = lang;
  applyLanguage(lang);
  if (currentQuiz) {
    const prevIndex = currentQuiz.currentIndex;
    const prevScore = currentQuiz.score;
    const prevAnswered = currentQuiz.answered;
    const prevSelected = currentQuiz.selectedAnswer;
    currentQuiz = new Quiz(lang);
    currentQuiz.currentIndex = prevIndex;
    currentQuiz.score = prevScore;
    currentQuiz.answered = prevAnswered;
    currentQuiz.selectedAnswer = prevSelected;
    renderQuestion();
    if (prevAnswered) {
      selectAnswer(prevSelected);
    }
  }
  if (favspotScreen.classList.contains('active')) {
    const t = translations[lang];
    favspotText.innerHTML = t.favspotPlaceholder;
    fetch(favspotFile(lang))
      .then(r => r.text())
      .then(text => { favspotText.innerHTML = text; })
      .catch(() => { favspotText.innerHTML = t.favspotPlaceholder; });
  }
  if (summaryScreen.classList.contains('active')) {
    const t = translations[lang];
    summaryText.innerHTML = t.summaryPlaceholder;
    fetch(summaryFile(lang))
      .then(r => r.text())
      .then(text => { summaryText.innerHTML = text; })
      .catch(() => { summaryText.innerHTML = t.summaryPlaceholder; });
  }
}

langSelect.addEventListener('change', () => setLanguage(langSelect.value));
langTop.addEventListener('change', () => setLanguage(langTop.value));

function showWelcome() {
  welcome.style.display = 'flex';
  quizScreen.classList.remove('active');
  favspotScreen.classList.remove('active');
  summaryScreen.classList.remove('active');
  langTop.classList.remove('visible');
  currentQuiz = null;
}

function startQuiz() {
  const lang = langSelect.value;
  currentQuiz = new Quiz(lang);
  welcome.style.display = 'none';
  favspotScreen.classList.remove('active');
  summaryScreen.classList.remove('active');
  quizScreen.classList.add('active');
  langTop.classList.add('visible');
  renderQuestion();
}

function favspotFile(lang) {
  const map = { de: 'page_de.txt', en: 'page_en.txt', fr: 'page_fr.txt', es: 'page_es.txt' };
  return '/assets/' + (map[lang] || 'page_de.txt');
}

function summaryFile(lang) {
  const map = { de: 'summary_de.txt', en: 'summary_en.txt', fr: 'summary_fr.txt', es: 'summary_es.txt' };
  return '/assets/' + (map[lang] || 'summary_de.txt');
}

function showFavspot() {
  const lang = langSelect.value;
  const t = translations[lang];
  welcome.style.display = 'none';
  quizScreen.classList.remove('active');
  summaryScreen.classList.remove('active');
  favspotScreen.classList.add('active');
  langTop.classList.add('visible');
  favspotText.innerHTML = t.favspotPlaceholder;
  fetch(favspotFile(lang))
    .then(r => r.text())
    .then(text => { favspotText.innerHTML = text; })
    .catch(() => { favspotText.innerHTML = t.favspotPlaceholder; });
}

function hideFavspot() {
  favspotScreen.classList.remove('active');
  showWelcome();
}

function showSummary() {
  const lang = langSelect.value;
  const t = translations[lang];
  welcome.style.display = 'none';
  quizScreen.classList.remove('active');
  favspotScreen.classList.remove('active');
  summaryScreen.classList.add('active');
  langTop.classList.add('visible');
  summaryText.innerHTML = t.summaryPlaceholder;
  fetch(summaryFile(lang))
    .then(r => r.text())
    .then(text => { summaryText.innerHTML = text; })
    .catch(() => { summaryText.innerHTML = t.summaryPlaceholder; });
}

function hideSummary() {
  summaryScreen.classList.remove('active');
  showWelcome();
}

function renderQuestion() {
  const lang = langSelect.value;
  const t = translations[lang];
  const q = currentQuiz.getCurrentQuestion();
  quizProgress.textContent = t.progress.replace('{n}', currentQuiz.currentIndex + 1).replace('{total}', currentQuiz.questions.length);
  quizQuestion.textContent = q.question;
  quizFeedback.className = 'quiz-feedback';
  quizFeedback.style.display = 'none';
  quizNext.style.display = 'none';
  quizResult.classList.remove('active');

  quizOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    quizOptions.appendChild(btn);
  });
}

function selectAnswer(index) {
  const lang = langSelect.value;
  const t = translations[lang];
  let result = currentQuiz.submitAnswer(index);
  if (!result && currentQuiz.answered) {
    const q = currentQuiz.getCurrentQuestion();
    result = index === q.correct ? 'correct' : 'wrong';
  }
  if (!result) return;

  const options = quizOptions.querySelectorAll('.quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === currentQuiz.getCurrentQuestion().correct) {
      btn.classList.add('correct');
    } else if (i === index && result === 'wrong') {
      btn.classList.add('wrong');
    }
  });

  quizFeedback.textContent = result === 'correct' ? t.correct : t.wrong;
  quizFeedback.className = 'quiz-feedback ' + result;
  quizFeedback.style.display = 'block';

  if (currentQuiz.isComplete()) {
    showResult();
  } else {
    quizNext.style.display = 'block';
  }
}

quizNext.addEventListener('click', () => {
  currentQuiz.nextQuestion();
  renderQuestion();
});

function showResult() {
  const lang = langSelect.value;
  const t = translations[lang];
  quizOptions.innerHTML = '';
  quizFeedback.style.display = 'none';
  quizNext.style.display = 'none';
  quizProgress.textContent = '';
  quizResult.classList.add('active');
  quizScore.textContent = t.score.replace('{score}', currentQuiz.score).replace('{total}', currentQuiz.questions.length);
}

btnQuiz.addEventListener('click', startQuiz);
btnFavspot.addEventListener('click', showFavspot);
btnSummary.addEventListener('click', showSummary);
btnGame.addEventListener('click', startGame);

btnBackMenu.addEventListener('click', showWelcome);
btnBackFavspot.addEventListener('click', hideFavspot);
btnBackSummary.addEventListener('click', hideSummary);

const browserLang = (navigator.language || 'en').slice(0, 2);
const supported = ['de', 'en', 'fr', 'es'];
if (supported.includes(browserLang)) {
  langSelect.value = browserLang;
  langTop.value = browserLang;
}
applyLanguage(langSelect.value);
document.documentElement.lang = langSelect.value;



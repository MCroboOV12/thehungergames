const quizData = {
  de: [
    {
      question: 'Wie hei\u00dft die Hauptfigur der Tribute von Panem?',
      options: ['Katniss Everdeen', 'Primrose Everdeen', 'Effie Trinket', 'Johanna Mason'],
      correct: 0,
    },
    {
      question: 'Aus welchem Distrikt kommt Katniss?',
      options: ['Distrikt 4', 'Distrikt 7', 'Distrikt 11', 'Distrikt 12'],
      correct: 3,
    },
    {
      question: 'Wer meldet sich freiwillig, um Prim zu ersetzen?',
      options: ['Katniss', 'Peeta', 'Gale', 'Haymitch'],
      correct: 0,
    },
    {
      question: 'Wie hei\u00dft der m\u00e4nnliche Tribut aus Distrikt 12?',
      options: ['Gale Hawthorne', 'Peeta Mellark', 'Haymitch Abernathy', 'Cinna'],
      correct: 1,
    },
    {
      question: 'Wof\u00fcr steht der T\u00f6tervogel als Symbol?',
      options: ['F\u00fcr die Spiele', 'F\u00fcr die Rebellion', 'F\u00fcr das Kapitol', 'F\u00fcr den Frieden'],
      correct: 1,
    },
    {
      question: 'Wer ist der Mentor von Katniss und Peeta?',
      options: ['Effie Trinket', 'Cinna', 'Haymitch Abernathy', 'Plutarch Heavensbee'],
      correct: 2,
    },
    {
      question: 'Wie hei\u00dft der Spielleiter der 74. Hungerspiele?',
      options: ['Plutarch Heavensbee', 'Seneca Crane', 'President Snow', 'Caesar Flickerman'],
      correct: 1,
    },
    {
      question: 'Weshalb klettert Katniss im Spiel auf einen Baum?',
      options: ['Um Fr\u00fcchte zu sammeln', 'Um Feinde zu beobachten', 'Um den Karrieren zu entkommen', 'Um Wasser zu finden'],
      correct: 2,
    },
    {
      question: 'Woher bekommt Katniss Pfeil und Bogen in der Arena?',
      options: ['Von Haymitch', 'Von Glimmer', 'Von Rue', 'Sie baut sie selbst'],
      correct: 1,
    },
    {
      question: 'Wie enden die 74. Hungerspiele?',
      options: ['Katniss t\u00f6tet Peeta', 'Peeta t\u00f6tet Katniss', 'Beide fliehen aus der Arena', 'Katniss und Peeta drohen mit Giftbeeren'],
      correct: 3,
    },
  ],
  en: [
    {
      question: 'What is the name of the main character?',
      options: ['Katniss Everdeen', 'Primrose Everdeen', 'Effie Trinket', 'Johanna Mason'],
      correct: 0,
    },
    {
      question: 'Which district is Katniss from?',
      options: ['District 4', 'District 7', 'District 11', 'District 12'],
      correct: 3,
    },
    {
      question: 'Who volunteers to take Prim\u2019s place?',
      options: ['Katniss', 'Peeta', 'Gale', 'Haymitch'],
      correct: 0,
    },
    {
      question: 'What is the name of the male tribute from District 12?',
      options: ['Gale Hawthorne', 'Peeta Mellark', 'Haymitch Abernathy', 'Cinna'],
      correct: 1,
    },
    {
      question: 'What does the mockingjay pin symbolize?',
      options: ['The Games', 'The Rebellion', 'The Capitol', 'Peace'],
      correct: 1,
    },
    {
      question: 'Who is the mentor for Katniss and Peeta?',
      options: ['Effie Trinket', 'Cinna', 'Haymitch Abernathy', 'Plutarch Heavensbee'],
      correct: 2,
    },
    {
      question: 'What is the name of the Head Gamemaker for the 74th Hunger Games?',
      options: ['Plutarch Heavensbee', 'Seneca Crane', 'President Snow', 'Caesar Flickerman'],
      correct: 1,
    },
    {
      question: 'Why does Katniss climb a tree in the arena?',
      options: ['To gather fruit', 'To spot enemies', 'To escape the Careers', 'To find water'],
      correct: 2,
    },
    {
      question: 'Where does Katniss get a bow and arrow in the arena?',
      options: ['From Haymitch', 'From Glimmer', 'From Rue', 'She makes them herself'],
      correct: 1,
    },
    {
      question: 'How do the 74th Hunger Games end?',
      options: ['Katniss kills Peeta', 'Peeta kills Katniss', 'They both flee the arena', 'Katniss and Peeta threaten with poison berries'],
      correct: 3,
    },
  ],
  fr: [
    {
      question: 'Quel est le nom du personnage principal ?',
      options: ['Katniss Everdeen', 'Primrose Everdeen', 'Effie Trinket', 'Johanna Mason'],
      correct: 0,
    },
    {
      question: 'De quel district vient Katniss ?',
      options: ['District 4', 'District 7', 'District 11', 'District 12'],
      correct: 3,
    },
    {
      question: 'Qui se porte volontaire pour remplacer Prim ?',
      options: ['Katniss', 'Peeta', 'Gale', 'Haymitch'],
      correct: 0,
    },
    {
      question: 'Quel est le nom du tribut masculin du District 12 ?',
      options: ['Gale Hawthorne', 'Peeta Mellark', 'Haymitch Abernathy', 'Cinna'],
      correct: 1,
    },
    {
      question: 'Que symbolise le pin\u2019s du geai moqueur ?',
      options: ['Les Jeux', 'La R\u00e9bellion', 'Le Capitole', 'La Paix'],
      correct: 1,
    },
    {
      question: 'Qui est le mentor de Katniss et Peeta ?',
      options: ['Effie Trinket', 'Cinna', 'Haymitch Abernathy', 'Plutarch Heavensbee'],
      correct: 2,
    },
    {
      question: 'Quel est le nom du cr\u00e9ateur des jeux pour la 74e \u00e9dition ?',
      options: ['Plutarch Heavensbee', 'Seneca Crane', 'Pr\u00e9sident Snow', 'Caesar Flickerman'],
      correct: 1,
    },
    {
      question: 'Pourquoi Katniss grimpe-t-elle \u00e0 un arbre dans l\u2019ar\u00e8ne ?',
      options: ['Pour cueillir des fruits', 'Pour rep\u00e9rer des ennemis', 'Pour \u00e9chapper aux Carrires', 'Pour trouver de l\u2019eau'],
      correct: 2,
    },
    {
      question: 'O\u00f9 Katniss trouve-t-elle un arc et des fl\u00e8ches dans l\u2019ar\u00e8ne ?',
      options: ['De Haymitch', 'De Glimmer', 'De Rue', 'Elle les fabrique elle-m\u00eame'],
      correct: 1,
    },
    {
      question: 'Comment se terminent les 74e Jeux de la Faim ?',
      options: ['Katniss tue Peeta', 'Peeta tue Katniss', 'Les deux fuient l\u2019ar\u00e8ne', 'Katniss et Peeta menacent avec des baies empoisonn\u00e9es'],
      correct: 3,
    },
  ],
  es: [
    {
      question: '\u00bfCu\u00e1l es el nombre del personaje principal?',
      options: ['Katniss Everdeen', 'Primrose Everdeen', 'Effie Trinket', 'Johanna Mason'],
      correct: 0,
    },
    {
      question: '\u00bfDe qu\u00e9 distrito es Katniss?',
      options: ['Distrito 4', 'Distrito 7', 'Distrito 11', 'Distrito 12'],
      correct: 3,
    },
    {
      question: '\u00bfQui\u00e9n se ofrece como voluntario para reemplazar a Prim?',
      options: ['Katniss', 'Peeta', 'Gale', 'Haymitch'],
      correct: 0,
    },
    {
      question: '\u00bfCu\u00e1l es el nombre del tributo masculino del Distrito 12?',
      options: ['Gale Hawthorne', 'Peeta Mellark', 'Haymitch Abernathy', 'Cinna'],
      correct: 1,
    },
    {
      question: '\u00bfQu\u00e9 simboliza el pin del sinsajo?',
      options: ['Los Juegos', 'La Rebeli\u00f3n', 'El Capitolio', 'La Paz'],
      correct: 1,
    },
    {
      question: '\u00bfQui\u00e9n es el mentor de Katniss y Peeta?',
      options: ['Effie Trinket', 'Cinna', 'Haymitch Abernathy', 'Plutarch Heavensbee'],
      correct: 2,
    },
    {
      question: '\u00bfCu\u00e1l es el nombre del Jefe de los Juegos de la 74\u00aa edici\u00f3n?',
      options: ['Plutarch Heavensbee', 'Seneca Crane', 'Presidente Snow', 'Caesar Flickerman'],
      correct: 1,
    },
    {
      question: '\u00bfPor qu\u00e9 Katniss trepa a un \u00e1rbol en la arena?',
      options: ['Para recoger fruta', 'Para observar enemigos', 'Para escapar de los Carrera', 'Para encontrar agua'],
      correct: 2,
    },
    {
      question: '\u00bfD\u00f3nde consigue Katniss un arco y flechas en la arena?',
      options: ['De Haymitch', 'De Glimmer', 'De Rue', 'Ella misma los fabrica'],
      correct: 1,
    },
    {
      question: '\u00bfC\u00f3mo terminan los 74\u00ba Juegos del Hambre?',
      options: ['Katniss mata a Peeta', 'Peeta mata a Katniss', 'Ambos huyen de la arena', 'Katniss y Peeta amenazan con bayas venenosas'],
      correct: 3,
    },
  ],
};

class Quiz {
  constructor(lang) {
    this.lang = lang;
    this.questions = quizData[lang] || quizData.de;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  isLastQuestion() {
    return this.currentIndex >= this.questions.length - 1;
  }

  submitAnswer(selectedIndex) {
    if (this.answered) return;
    this.answered = true;
    this.selectedAnswer = selectedIndex;
    const q = this.getCurrentQuestion();
    if (selectedIndex === q.correct) {
      this.score++;
      return 'correct';
    }
    return 'wrong';
  }

  nextQuestion() {
    if (this.isLastQuestion()) return 'done';
    this.currentIndex++;
    this.answered = false;
    this.selectedAnswer = undefined;
    return 'continue';
  }

  isComplete() {
    return this.answered && this.isLastQuestion();
  }
}

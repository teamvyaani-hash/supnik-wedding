/* =====================================================
   SUPNIK.IN
   Wedding website interactions
===================================================== */


/* =====================================================
   ENTER THE CELEBRATION
===================================================== */

const enterButton = document.querySelector('.primary-button');

if (enterButton) {
  enterButton.addEventListener('click', (event) => {
    event.preventDefault();

    const target = document.querySelector('#celebration');

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
}


/* =====================================================
   COUNTDOWN
===================================================== */

const weddingDate = new Date('2026-11-21T10:30:00+05:30');

const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const countdownMessage = document.getElementById('countdownMessage');


function padNumber(number) {
  return String(number).padStart(2, '0');
}


function updateCountdownMessage(daysLeft) {
  if (!countdownMessage) return;

  if (daysLeft > 100) {
    countdownMessage.textContent =
      'Plenty of time. At least that is what we keep telling ourselves.';
  } else if (daysLeft > 30) {
    countdownMessage.textContent =
      'This is getting very real.';
  } else if (daysLeft > 7) {
    countdownMessage.textContent =
      'Outfits ready? Dance moves questionable? Perfect.';
  } else if (daysLeft > 1) {
    countdownMessage.textContent =
      'Okay. Everybody panic gracefully.';
  } else if (daysLeft === 1) {
    countdownMessage.textContent =
      'See you tomorrow.';
  } else {
    countdownMessage.textContent =
      'TODAY’S THE DAY.';
  }
}


function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {
    if (daysElement) daysElement.textContent = '00';
    if (hoursElement) hoursElement.textContent = '00';
    if (minutesElement) minutesElement.textContent = '00';
    if (secondsElement) secondsElement.textContent = '00';

    if (countdownMessage) {
      countdownMessage.textContent =
        'TODAY’S THE DAY.';
    }

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  if (daysElement) {
    daysElement.textContent = padNumber(days);
  }

  if (hoursElement) {
    hoursElement.textContent = padNumber(hours);
  }

  if (minutesElement) {
    minutesElement.textContent = padNumber(minutes);
  }

  if (secondsElement) {
    secondsElement.textContent = padNumber(seconds);
  }

  updateCountdownMessage(days);
}


updateCountdown();
setInterval(updateCountdown, 1000);


/* =====================================================
   SCROLL REVEALS
===================================================== */

const revealElements = document.querySelectorAll('.reveal');


if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add('visible');
  });
}


/* =====================================================
   TEAM NIKHIL / TEAM SUPRIYA
===================================================== */

const teamButtons = document.querySelectorAll('.team-button');
const teamResponse = document.getElementById('teamResponse');


const teamMessages = {
  nikhil:
    'Excellent choice. Slightly questionable judgment, but excellent choice.',
  supriya:
    'You clearly know who runs this wedding.'
};


teamButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedTeam = button.dataset.team;

    teamButtons.forEach((item) => {
      item.classList.remove('selected');
    });

    button.classList.add('selected');

    if (teamResponse && teamMessages[selectedTeam]) {
      teamResponse.textContent =
        teamMessages[selectedTeam];
    }
  });
});


/* =====================================================
   EASTER EGG
===================================================== */

const secretTrigger = document.getElementById('secretTrigger');
const secretMessage = document.getElementById('secretMessage');
const petalContainer = document.getElementById('petalContainer');


function createPetals() {
  if (!petalContainer) return;

  const petalSymbols = ['✿', '❀', '✾'];

  for (let index = 0; index < 34; index += 1) {
    const petal = document.createElement('span');

    petal.className = 'petal';

    petal.textContent =
      petalSymbols[
        Math.floor(Math.random() * petalSymbols.length)
      ];

    petal.style.left =
      `${Math.random() * 100}%`;

    petal.style.setProperty(
      '--drift',
      `${Math.random() * 180 - 90}px`
    );

    petal.style.animationDuration =
      `${3.4 + Math.random() * 3.3}s`;

    petal.style.animationDelay =
      `${Math.random() * 1.2}s`;

    petal.style.fontSize =
      `${12 + Math.random() * 14}px`;

    petal.style.opacity =
      `${0.55 + Math.random() * 0.4}`;

    petalContainer.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 8000);
  }
}


function showSecretMessage() {
  if (!secretMessage) return;

  secretMessage.classList.add('show');
  secretMessage.setAttribute('aria-hidden', 'false');

  createPetals();

  setTimeout(() => {
    secretMessage.classList.remove('show');
    secretMessage.setAttribute('aria-hidden', 'true');
  }, 2600);
}


if (secretTrigger) {
  secretTrigger.addEventListener('click', showSecretMessage);
}


if (secretMessage) {
  secretMessage.addEventListener('click', () => {
    secretMessage.classList.remove('show');
    secretMessage.setAttribute('aria-hidden', 'true');
  });
}


/* =====================================================
   COUPLE QUIZ
===================================================== */

const quizQuestions = [
  {
    question:
      'Where did our story begin?',
    options: [
      'KPMG',
      'At a wedding',
      'Instagram',
      'College'
    ],
    answer: 'KPMG',
    feedback:
      'Correct. Corporate India has finally produced something romantic.'
  },

  {
    question:
      'Where did we first meet outside work?',
    options: [
      'Watson’s, Bangalore',
      'Cubbon Park',
      'Church Street',
      'At the airport'
    ],
    answer: 'Watson’s, Bangalore',
    feedback:
      'Correct. A completely innocent work meeting, obviously.'
  },

  {
    question:
      'What came next?',
    options: [
      'Long distance',
      'We moved to Chennai immediately',
      'We stopped talking',
      'A destination wedding'
    ],
    answer: 'Long distance',
    feedback:
      'Correct. Airports became a little too familiar.'
  },

  {
    question:
      'Which city eventually became home for both of us?',
    options: [
      'Bangalore',
      'Chennai',
      'Mumbai',
      'Hyderabad'
    ],
    answer: 'Bangalore',
    feedback:
      'Correct. Finally, one city and significantly fewer airport goodbyes.'
  },

  {
    question:
      'Where are we getting married?',
    options: [
      'MGM Beach Resort, Chennai',
      'Bangalore Palace',
      'Goa',
      'Mahabalipuram Temple'
    ],
    answer: 'MGM Beach Resort, Chennai',
    feedback:
      'Correct. See you by the sea.'
  }
];


let currentQuestionIndex = 0;
let quizScore = 0;
let questionLocked = false;


const quizProgress = document.getElementById('quizProgress');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizQuestionArea = document.getElementById('quizQuestionArea');
const quizResult = document.getElementById('quizResult');
const quizScoreElement = document.getElementById('quizScore');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultText = document.getElementById('quizResultText');
const restartQuiz = document.getElementById('restartQuiz');


function loadQuizQuestion() {
  const currentQuestion =
    quizQuestions[currentQuestionIndex];

  questionLocked = false;

  if (quizProgress) {
    quizProgress.textContent =
      `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
  }

  if (quizProgressBar) {
    quizProgressBar.style.width =
      `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
  }

  if (quizQuestion) {
    quizQuestion.textContent =
      currentQuestion.question;
  }

  if (quizFeedback) {
    quizFeedback.textContent = '';
  }

  if (!quizOptions) return;

  quizOptions.innerHTML = '';

  currentQuestion.options.forEach((option) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = option;

    button.addEventListener('click', () => {
      selectQuizAnswer(
        button,
        option,
        currentQuestion
      );
    });

    quizOptions.appendChild(button);
  });
}


function selectQuizAnswer(
  selectedButton,
  selectedAnswer,
  currentQuestion
) {
  if (questionLocked) return;

  questionLocked = true;

  const optionButtons =
    quizOptions.querySelectorAll('.quiz-option');

  optionButtons.forEach((button) => {
    button.disabled = true;

    if (
      button.textContent === currentQuestion.answer
    ) {
      button.classList.add('correct');
    }
  });

  if (selectedAnswer === currentQuestion.answer) {
    quizScore += 1;

    selectedButton.classList.add('correct');

    if (quizFeedback) {
      quizFeedback.textContent =
        currentQuestion.feedback;
    }
  } else {
    selectedButton.classList.add('wrong');

    if (quizFeedback) {
      quizFeedback.textContent =
        `Not quite. The answer is ${currentQuestion.answer}.`;
    }
  }

  setTimeout(() => {
    currentQuestionIndex += 1;

    if (
      currentQuestionIndex <
      quizQuestions.length
    ) {
      loadQuizQuestion();
    } else {
      showQuizResult();
    }
  }, 1500);
}


function showQuizResult() {
  if (quizQuestionArea) {
    quizQuestionArea.hidden = true;
  }

  if (quizResult) {
    quizResult.hidden = false;
  }

  if (quizScoreElement) {
    quizScoreElement.textContent =
      `${quizScore} / ${quizQuestions.length}`;
  }

  if (
    quizResultTitle &&
    quizResultText
  ) {
    if (quizScore === 5) {
      quizResultTitle.textContent =
        'Okay, you definitely belong here.';

      quizResultText.textContent =
        'Perfect score. You either know us very well or you are suspiciously good at guessing.';
    } else if (quizScore >= 3) {
      quizResultTitle.textContent =
        'Very respectable.';

      quizResultText.textContent =
        'You know enough to keep your invitation.';
    } else {
      quizResultTitle.textContent =
        'We may need to talk.';

      quizResultText.textContent =
        'Good news: there is still time to study before November.';
    }
  }
}


function resetQuiz() {
  currentQuestionIndex = 0;
  quizScore = 0;
  questionLocked = false;

  if (quizQuestionArea) {
    quizQuestionArea.hidden = false;
  }

  if (quizResult) {
    quizResult.hidden = true;
  }

  loadQuizQuestion();
}


if (restartQuiz) {
  restartQuiz.addEventListener(
    'click',
    resetQuiz
  );
}


if (
  quizQuestion &&
  quizOptions
) {
  loadQuizQuestion();
}


/* =====================================================
   INDIVIDUAL CALENDAR EVENTS
===================================================== */

const calendarEvents = {
  engagement: {
    fileName:
      'Nikhil-Supriya-Engagement.ics',

    title:
      'Nikhil & Supriya | Engagement',

    start:
      '20261121T050000Z',

    end:
      '20261121T063000Z',

    location:
      'Lake Lawn, MGM Beach Resort, ECR, Chennai, Tamil Nadu',

    description:
      'Engagement celebration of Nikhil and Supriya. Saturday, 21 November 2026 at 10:30 AM. Lake Lawn, MGM Beach Resort, ECR, Chennai.'
  },

  reception: {
    fileName:
      'Nikhil-Supriya-Reception.ics',

    title:
      'Nikhil & Supriya | Reception',

    start:
      '20261121T123000Z',

    end:
      '20261121T160000Z',

    location:
      'Lake Lawn, MGM Beach Resort, ECR, Chennai, Tamil Nadu',

    description:
      'Wedding reception of Nikhil and Supriya. Saturday, 21 November 2026 at 6:00 PM. Lake Lawn, MGM Beach Resort, ECR, Chennai.'
  },

  muhurtham: {
    fileName:
      'Nikhil-Supriya-Muhurtham.ics',

    title:
      'Nikhil & Supriya | Muhurtham',

    start:
      '20261122T030000Z',

    end:
      '20261122T043000Z',

    location:
      'Palm Beach Lawn, MGM Beach Resort, ECR, Chennai, Tamil Nadu',

    description:
      'Muhurtham ceremony of Nikhil and Supriya. Sunday, 22 November 2026 from 8:30 AM to 10:00 AM. Palm Beach Lawn, MGM Beach Resort, ECR, Chennai.'
  }
};


function escapeICSText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}


function downloadCalendarEvent(eventData) {
  const now =
    new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z');

  const uid =
    `${Date.now()}-${Math.random().toString(36).slice(2)}@supnik.in`;

  const calendarContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SUPNIK.IN//Nikhil and Supriya Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',

    'BEGIN:VEVENT',

    `UID:${uid}`,

    `DTSTAMP:${now}`,

    `DTSTART:${eventData.start}`,

    `DTEND:${eventData.end}`,

    `SUMMARY:${escapeICSText(eventData.title)}`,

    `LOCATION:${escapeICSText(eventData.location)}`,

    `DESCRIPTION:${escapeICSText(eventData.description)}`,

    'URL:https://supnik.in',

    'STATUS:CONFIRMED',

    'END:VEVENT',

    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob(
    [calendarContent],
    {
      type: 'text/calendar;charset=utf-8'
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;
  link.download =
    eventData.fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


const calendarButtons =
  document.querySelectorAll('.calendar-button');


calendarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const eventName =
      button.dataset.event;

    const eventData =
      calendarEvents[eventName];

    if (eventData) {
      downloadCalendarEvent(eventData);
    }
  });
});


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const mobileNav = document.getElementById('mobileNav');
const navLinks = document.querySelectorAll('.nav-link');


navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const targetSelector =
      link.getAttribute('href');

    const target =
      document.querySelector(targetSelector);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});


const sectionsForNavigation = [
  document.getElementById('home'),
  document.getElementById('story'),
  document.getElementById('events'),
  document.getElementById('venue')
].filter(Boolean);


if ('IntersectionObserver' in window) {
  const navObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId =
            entry.target.id;

          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.dataset.section === sectionId
            );
          });
        });
      },
      {
        threshold: 0.35
      }
    );

  sectionsForNavigation.forEach((section) => {
    navObserver.observe(section);
  });
}


/* =====================================================
   HERO PARALLAX
===================================================== */

const heroImage =
  document.querySelector('.hero-image');

const heroContent =
  document.querySelector('.hero-content');

const bananaLeft =
  document.querySelector('.banana-left');

const bananaRight =
  document.querySelector('.banana-right');


let ticking = false;


function updateScrollEffects() {
  const scrollY =
    window.scrollY;

  if (scrollY < window.innerHeight * 1.2) {
    if (heroImage) {
      heroImage.style.transform =
        `translateY(${scrollY * 0.08}px) scale(1.04)`;
    }

    if (heroContent) {
      heroContent.style.transform =
        `translateY(${scrollY * 0.035}px)`;
    }

    if (bananaLeft) {
      bananaLeft.style.marginLeft =
        `${Math.min(scrollY * 0.015, 10)}px`;
    }

    if (bananaRight) {
      bananaRight.style.marginRight =
        `${Math.min(scrollY * 0.015, 10)}px`;
    }
  }

  ticking = false;
}


window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      window.requestAnimationFrame(
        updateScrollEffects
      );

      ticking = true;
    }
  },
  {
    passive: true
  }
);


/* =====================================================
   STORY IMAGE MOVEMENT
===================================================== */

const storyImages =
  document.querySelectorAll('.story-image');


function updateStoryImages() {
  storyImages.forEach((image) => {
    const rect =
      image.getBoundingClientRect();

    const viewportCenter =
      window.innerHeight / 2;

    const imageCenter =
      rect.top + rect.height / 2;

    const distance =
      imageCenter - viewportCenter;

    const movement =
      Math.max(
        -18,
        Math.min(18, distance * -0.025)
      );

    image.style.objectPosition =
      `center calc(50% + ${movement}px)`;
  });
}


window.addEventListener(
  'scroll',
  () => {
    window.requestAnimationFrame(
      updateStoryImages
    );
  },
  {
    passive: true
  }
);


/* =====================================================
   EVENT CARD TOUCH FEEDBACK
===================================================== */

const eventCards =
  document.querySelectorAll('.event-card');


eventCards.forEach((card) => {
  card.addEventListener(
    'touchstart',
    () => {
      card.classList.add('touched');
    },
    {
      passive: true
    }
  );

  card.addEventListener(
    'touchend',
    () => {
      setTimeout(() => {
        card.classList.remove('touched');
      }, 300);
    },
    {
      passive: true
    }
  );
});


/* =====================================================
   HIDE MOBILE NAV NEAR END
===================================================== */

function handleMobileNavVisibility() {
  if (!mobileNav) return;

  const distanceFromBottom =
    document.documentElement.scrollHeight -
    (window.scrollY + window.innerHeight);

  mobileNav.classList.toggle(
    'hidden',
    distanceFromBottom < 180
  );
}


window.addEventListener(
  'scroll',
  handleMobileNavVisibility,
  {
    passive: true
  }
);


handleMobileNavVisibility();


/* =====================================================
   INITIAL PAGE SETUP
===================================================== */

window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  updateStoryImages();

  setTimeout(() => {
    const heroRevealElements =
      document.querySelectorAll(
        '.hero .reveal'
      );

    heroRevealElements.forEach(
      (element) => {
        element.classList.add('visible');
      }
    );
  }, 150);
});

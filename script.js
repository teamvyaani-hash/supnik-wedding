/* =========================================================
   SUPNIK.IN
   Nikhil & Supriya
========================================================= */


/* =========================================================
   ENTER BUTTON
========================================================= */

const enterCelebration = document.getElementById("enterCelebration");

if (enterCelebration) {
  enterCelebration.addEventListener("click", () => {
    document.getElementById("intro")?.scrollIntoView({
      behavior: "smooth"
    });
  });
}


/* =========================================================
   COUNTDOWN
========================================================= */

const weddingDate = new Date("2026-11-21T10:30:00+05:30");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdownMessage");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";

    if (countdownMessage) {
      countdownMessage.textContent =
        "Well. The countdown has officially lost its job.";
    }

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  /*
    You asked for 2 digits on days.
    If it is above 99, it will still show the real number.
    Once below 100 it will show 99, 98, 07, etc.
  */

  if (daysEl) {
    daysEl.textContent =
      days < 100
        ? String(days).padStart(2, "0")
        : String(days);
  }

  if (hoursEl) {
    hoursEl.textContent =
      String(hours).padStart(2, "0");
  }

  if (minutesEl) {
    minutesEl.textContent =
      String(minutes).padStart(2, "0");
  }

  if (secondsEl) {
    secondsEl.textContent =
      String(seconds).padStart(2, "0");
  }

  if (!countdownMessage) return;

  if (days > 100) {
    countdownMessage.textContent =
      "Plenty of time. This is what we’re telling ourselves.";
  } else if (days > 30) {
    countdownMessage.textContent =
      "Close enough to be exciting. Far enough away to keep pretending we’re organised.";
  } else if (days > 7) {
    countdownMessage.textContent =
      "Okay. This is becoming extremely real.";
  } else if (days > 1) {
    countdownMessage.textContent =
      "This would be an excellent time to remember where your outfit is.";
  } else {
    countdownMessage.textContent =
      "See you very, very soon.";
  }
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* =========================================================
   TEAM NIKHIL / TEAM SUPRIYA
========================================================= */

const teamNikhil =
  document.getElementById("teamNikhil");

const teamSupriya =
  document.getElementById("teamSupriya");

const teamResponse =
  document.getElementById("teamResponse");

let nikhilClicks = 0;
let supriyaClicks = 0;

if (teamNikhil) {
  teamNikhil.addEventListener("click", () => {
    nikhilClicks += 1;

    if (!teamResponse) return;

    if (nikhilClicks >= 5) {
      teamResponse.textContent =
        "Okay bro, we get it.";

      nikhilClicks = 0;

      return;
    }

    teamResponse.textContent =
      "Excellent choice. Slightly questionable judgment, but excellent choice.";
  });
}

if (teamSupriya) {
  teamSupriya.addEventListener("click", () => {
    supriyaClicks += 1;

    if (!teamResponse) return;

    if (supriyaClicks >= 5) {
      teamResponse.textContent =
        "Commitment noted. Respect.";

      supriyaClicks = 0;

      return;
    }

    teamResponse.textContent =
      "You clearly know who runs this wedding.";
  });
}


/* =========================================================
   SECRET EASTER EGG
========================================================= */

const secretTrigger =
  document.getElementById("secretTrigger");

const secretMessage =
  document.getElementById("secretMessage");

const secretClose =
  document.getElementById("secretClose");

const heartContainer =
  document.getElementById("heartContainer");

let heartInterval;

function createHeart() {
  if (!heartContainer) return;

  const heart =
    document.createElement("span");

  heart.className =
    "secret-heart";

  heart.textContent =
    "♡";

  heart.style.left =
    `${Math.random() * 100}%`;

  heart.style.fontSize =
    `${14 + Math.random() * 24}px`;

  heart.style.animationDuration =
    `${4 + Math.random() * 4}s`;

  heartContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8500);
}

function openSecret() {
  if (!secretMessage) return;

  secretMessage.classList.add("open");

  secretMessage.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  clearInterval(heartInterval);

  for (let i = 0; i < 7; i++) {
    setTimeout(
      createHeart,
      i * 130
    );
  }

  heartInterval =
    setInterval(
      createHeart,
      700
    );
}

function closeSecret() {
  if (!secretMessage) return;

  secretMessage.classList.remove("open");

  secretMessage.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

  clearInterval(heartInterval);

  if (heartContainer) {
    heartContainer.innerHTML = "";
  }
}

secretTrigger?.addEventListener(
  "click",
  openSecret
);

secretClose?.addEventListener(
  "click",
  closeSecret
);

secretMessage?.addEventListener(
  "click",
  (event) => {
    if (
      event.target ===
      secretMessage
    ) {
      closeSecret();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeSecret();
    }
  }
);


/* =========================================================
   STORY SCROLLER
========================================================= */

const storyScroller =
  document.getElementById("storyScroller");

const storyDots =
  document.querySelectorAll(".story-dot");

const storyCards =
  document.querySelectorAll(".story-card");

function updateStoryState() {
  if (
    !storyScroller ||
    !storyCards.length
  ) {
    return;
  }

  const scrollerCenter =
    storyScroller.scrollLeft +
    storyScroller.clientWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  storyCards.forEach(
    (card, index) => {
      const cardCenter =
        card.offsetLeft +
        card.offsetWidth / 2;

      const distance =
        Math.abs(
          scrollerCenter -
          cardCenter
        );

      if (
        distance <
        closestDistance
      ) {
        closestDistance =
          distance;

        closestIndex =
          index;
      }
    }
  );

  storyDots.forEach(
    (dot, index) => {
      dot.classList.toggle(
        "active",
        index === closestIndex
      );
    }
  );

  storyCards.forEach(
    (card, index) => {
      if (
        index === closestIndex
      ) {
        card.style.transform =
          "translateY(-3px)";
      } else {
        card.style.transform =
          "";
      }
    }
  );
}

if (storyScroller) {
  storyScroller.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(
        updateStoryState
      );
    },
    {
      passive: true
    }
  );
}

storyDots.forEach((dot) => {
  dot.addEventListener(
    "click",
    () => {
      const index =
        Number(
          dot.dataset.slide
        );

      const targetCard =
        storyCards[index];

      targetCard?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  );
});


/* =========================================================
   QUIZ
========================================================= */

const quizBank = [
  {
    question:
      "Where did this story technically begin?",

    options: [
      "KPMG",
      "Watson’s",
      "Bangalore traffic",
      "A very dramatic airport terminal"
    ],

    answer: 0,

    reaction:
      "Correct. HR was not consulted."
  },

  {
    question:
      "Where did things become suspiciously less professional?",

    options: [
      "An office meeting room",
      "Watson’s",
      "The airport",
      "MGM Beach Resort"
    ],

    answer: 1,

    reaction:
      "Exactly. Allegedly just a casual catch-up."
  },

  {
    question:
      "What became a recurring feature of the long-distance era?",

    options: [
      "Flights",
      "Calls",
      "‘When are you coming?’",
      "All of the above"
    ],

    answer: 3,

    reaction:
      "Correct. Frequent-flyer points should probably be in the wedding party."
  },

  {
    question:
      "What eventually replaced the boarding passes?",

    options: [
      "Peace and quiet",
      "Bangalore traffic jams",
      "A private jet",
      "Better life decisions"
    ],

    answer: 1,

    reaction:
      "Correct. Romantic? Debatable. Accurate? Unfortunately."
  },

  {
    question:
      "Where does the story finally bring everyone together?",

    options: [
      "Back at KPMG",
      "Goa",
      "MGM Beach Resort",
      "Another Zoom call"
    ],

    answer: 2,

    reaction:
      "Correct. Considerably better than a conference room."
  },

  {
    question:
      "What is the 2026 plot twist?",

    options: [
      "Another long-distance chapter",
      "Everyone else has to travel now",
      "We cancel the wedding",
      "Nobody mentions traffic"
    ],

    answer: 1,

    reaction:
      "Correct. Our turn to inconvenience everyone else."
  },

  {
    question:
      "Which phrase best describes the road from KPMG to Chennai?",

    options: [
      "Efficient and well planned",
      "Completely straightforward",
      "A suspicious amount of logistics",
      "No travel involved"
    ],

    answer: 2,

    reaction:
      "Correct. There have been spreadsheets. Many spreadsheets."
  },

  {
    question:
      "What is the safest prediction for 21–22 November?",

    options: [
      "Everyone arrives early",
      "Nobody asks for directions",
      "Nikhil and Supriya get married",
      "Zero family WhatsApp messages"
    ],

    answer: 2,

    reaction:
      "Correct. We’re fairly confident about this one."
  }
];

const startQuiz =
  document.getElementById("startQuiz");

const restartQuiz =
  document.getElementById("restartQuiz");

const quizStart =
  document.getElementById("quizStart");

const quizGame =
  document.getElementById("quizGame");

const quizResult =
  document.getElementById("quizResult");

const quizProgress =
  document.getElementById("quizProgress");

const quizScoreEl =
  document.getElementById("quizScore");

const quizQuestion =
  document.getElementById("quizQuestion");

const quizOptions =
  document.getElementById("quizOptions");

const quizReaction =
  document.getElementById("quizReaction");

const quizResultTitle =
  document.getElementById("quizResultTitle");

const quizResultText =
  document.getElementById("quizResultText");

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerLocked = false;

function shuffle(array) {
  return [...array].sort(
    () =>
      Math.random() - 0.5
  );
}

function startQuizGame() {
  selectedQuestions =
    shuffle(quizBank).slice(
      0,
      6
    );

  currentQuestionIndex = 0;
  score = 0;
  answerLocked = false;

  quizStart?.classList.add(
    "hidden"
  );

  quizResult?.classList.add(
    "hidden"
  );

  quizGame?.classList.remove(
    "hidden"
  );

  showQuizQuestion();
}

function showQuizQuestion() {
  if (!selectedQuestions.length) {
    return;
  }

  answerLocked = false;

  const currentQuestion =
    selectedQuestions[
      currentQuestionIndex
    ];

  if (quizProgress) {
    quizProgress.textContent =
      `Question ${currentQuestionIndex + 1} of 6`;
  }

  if (quizScoreEl) {
    quizScoreEl.textContent =
      `${score} correct`;
  }

  if (quizQuestion) {
    quizQuestion.textContent =
      currentQuestion.question;
  }

  if (quizReaction) {
    quizReaction.textContent =
      "";
  }

  if (!quizOptions) return;

  quizOptions.innerHTML =
    "";

  currentQuestion.options.forEach(
    (option, optionIndex) => {
      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.textContent =
        option;

      button.addEventListener(
        "click",
        () => {
          handleQuizAnswer(
            button,
            optionIndex,
            currentQuestion
          );
        }
      );

      quizOptions.appendChild(
        button
      );
    }
  );
}

function handleQuizAnswer(
  clickedButton,
  selectedIndex,
  currentQuestion
) {
  if (answerLocked) return;

  answerLocked = true;

  const buttons =
    quizOptions?.querySelectorAll(
      "button"
    ) || [];

  const isCorrect =
    selectedIndex ===
    currentQuestion.answer;

  if (isCorrect) {
    score += 1;

    clickedButton.classList.add(
      "correct"
    );
  } else {
    clickedButton.classList.add(
      "wrong"
    );

    const correctButton =
      buttons[
        currentQuestion.answer
      ];

    correctButton?.classList.add(
      "correct"
    );
  }

  if (quizScoreEl) {
    quizScoreEl.textContent =
      `${score} correct`;
  }

  if (quizReaction) {
    quizReaction.textContent =
      isCorrect
        ? currentQuestion.reaction
        : "Not quite. We’ll pretend nobody saw that.";
  }

  buttons.forEach(
    (button) => {
      button.disabled = true;
    }
  );

  setTimeout(
    () => {
      currentQuestionIndex += 1;

      if (
        currentQuestionIndex >=
        selectedQuestions.length
      ) {
        finishQuiz();
      } else {
        showQuizQuestion();
      }
    },
    1250
  );
}

function finishQuiz() {
  quizGame?.classList.add(
    "hidden"
  );

  quizResult?.classList.remove(
    "hidden"
  );

  if (score === 6) {
    if (quizResultTitle) {
      quizResultTitle.textContent =
        "Suspicious.";
    }

    if (quizResultText) {
      quizResultText.textContent =
        "Perfect score. Either you know us extremely well or you have somehow been studying this website.";
    }

    return;
  }

  if (score >= 4) {
    if (quizResultTitle) {
      quizResultTitle.textContent =
        "You actually know us.";
    }

    if (quizResultText) {
      quizResultText.textContent =
        `${score}/6. Respectable. Your invitation remains fully valid.`;
    }

    return;
  }

  if (score >= 2) {
    if (quizResultTitle) {
      quizResultTitle.textContent =
        "We’ll allow it.";
    }

    if (quizResultText) {
      quizResultText.textContent =
        `${score}/6. Enough knowledge to attend. Possibly not enough to give a speech.`;
    }

    return;
  }

  if (quizResultTitle) {
    quizResultTitle.textContent =
      "Interesting.";
  }

  if (quizResultText) {
    quizResultText.textContent =
      `${score}/6. Still invited. Barely.`;
  }
}

startQuiz?.addEventListener(
  "click",
  startQuizGame
);

restartQuiz?.addEventListener(
  "click",
  startQuizGame
);


/* =========================================================
   CALENDAR INVITES
========================================================= */

const calendarEvents = {
  engagement: {
    title:
      "Nikhil & Supriya - Engagement",

    start:
      "20261121T050000Z",

    end:
      "20261121T063000Z",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai",

    description:
      "Nikhil & Supriya's Engagement at MGM Beach Resort."
  },

  reception: {
    title:
      "Nikhil & Supriya - Reception",

    start:
      "20261121T123000Z",

    end:
      "20261121T160000Z",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai",

    description:
      "Nikhil & Supriya's Reception at MGM Beach Resort."
  },

  muhurtham: {
    title:
      "Nikhil & Supriya - Muhurtham",

    start:
      "20261122T030000Z",

    end:
      "20261122T043000Z",

    location:
      "Palm Beach Lawn, MGM Beach Resort, ECR, Chennai",

    description:
      "Nikhil & Supriya's Muhurtham at MGM Beach Resort."
  }
};

function escapeICS(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function downloadICS(eventKey) {
  const event =
    calendarEvents[eventKey];

  if (!event) return;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SUPNIK//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",

    "BEGIN:VEVENT",

    `UID:${eventKey}-20261121@supnik.in`,

    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z")}`,

    `DTSTART:${event.start}`,
    `DTEND:${event.end}`,

    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,

    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob =
    new Blob(
      [icsContent],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    `nikhil-supriya-${eventKey}.ics`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  setTimeout(
    () => {
      URL.revokeObjectURL(
        url
      );
    },
    1000
  );
}

document
  .querySelectorAll(
    ".calendar-button"
  )
  .forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          downloadICS(
            button.dataset.event
          );
        }
      );
    }
  );


/* =========================================================
   WEDDING WISDOM
========================================================= */

const wisdomButton =
  document.getElementById(
    "wisdomButton"
  );

const wisdomText =
  document.getElementById(
    "wisdomText"
  );

const wisdomBank = [
  "If someone says ‘quick photo’, emotionally prepare for seventeen.",

  "Never trust anyone who says the family group photo will take five minutes.",

  "The correct wedding arrival time is earlier than whatever time you were planning.",

  "Comfortable shoes are a personality trait now.",

  "If you are lost, walk confidently. People may assume you are helping.",

  "Charge your phone. Someone will eventually ask you to take a photo.",

  "If you hear music from the dance floor, resistance is probably temporary.",

  "The phrase ‘we’re almost ready’ has no measurable relationship with time.",

  "If an auntie tells you to eat, the discussion has already ended.",

  "When in doubt, smile and follow the person who looks like they know what’s happening.",

  "Do not start an IPL argument unless you have cleared your schedule.",

  "Never underestimate the power of one enthusiastic relative with a camera.",

  "If Nikhil says everything is under control, confirm independently.",

  "If Supriya says everything is under control, it probably is."
];

let previousWisdomIndex =
  -1;

wisdomButton?.addEventListener(
  "click",
  () => {
    if (!wisdomText) return;

    let newIndex;

    do {
      newIndex =
        Math.floor(
          Math.random() *
          wisdomBank.length
        );
    } while (
      wisdomBank.length > 1 &&
      newIndex ===
        previousWisdomIndex
    );

    previousWisdomIndex =
      newIndex;

    wisdomText.style.opacity =
      "0";

    wisdomText.style.transform =
      "translateY(6px)";

    setTimeout(
      () => {
        wisdomText.textContent =
          wisdomBank[newIndex];

        wisdomText.style.opacity =
          "1";

        wisdomText.style.transform =
          "translateY(0)";
      },
      180
    );
  }
);


/* =========================================================
   FLOATING NAVIGATION
========================================================= */

const navLinks =
  document.querySelectorAll(
    ".nav-link"
  );

navLinks.forEach(
  (link) => {
    link.addEventListener(
      "click",
      (event) => {
        const href =
          link.getAttribute(
            "href"
          );

        if (
          !href?.startsWith("#")
        ) {
          return;
        }

        const target =
          document.querySelector(
            href
          );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    );
  }
);

const sectionMap = [
  {
    id: "home",
    element:
      document.getElementById(
        "home"
      )
  },

  {
    id: "story",
    element:
      document.getElementById(
        "story"
      )
  },

  {
    id: "events",
    element:
      document.getElementById(
        "events"
      )
  },

  {
    id: "venue",
    element:
      document.getElementById(
        "venue"
      )
  }
].filter(
  (section) =>
    section.element
);

if (
  "IntersectionObserver" in
  window
) {
  const navObserver =
    new IntersectionObserver(
      (entries) => {
        const visibleEntries =
          entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );

        if (
          !visibleEntries.length
        ) {
          return;
        }

        const activeId =
          visibleEntries[0]
            .target.id;

        navLinks.forEach(
          (link) => {
            link.classList.toggle(
              "active",
              link.dataset.section ===
                activeId
            );
          }
        );
      },
      {
        rootMargin:
          "-25% 0px -55% 0px",

        threshold: [
          0.05,
          0.2,
          0.4,
          0.6
        ]
      }
    );

  sectionMap.forEach(
    (section) => {
      navObserver.observe(
        section.element
      );
    }
  );
}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
  document.getElementById(
    "backToTop"
  );

function updateBackToTop() {
  if (!backToTop) return;

  backToTop.classList.toggle(
    "visible",
    window.scrollY > 650
  );
}

window.addEventListener(
  "scroll",
  updateBackToTop,
  {
    passive: true
  }
);

updateBackToTop();

backToTop?.addEventListener(
  "click",
  () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);


/* =========================================================
   HIDE NAV NEAR CLOSING
========================================================= */

const floatingNav =
  document.getElementById(
    "mobileNav"
  );

const closingSection =
  document.querySelector(
    ".closing-section"
  );

if (
  floatingNav &&
  closingSection &&
  "IntersectionObserver" in window
) {
  const closingObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            floatingNav.classList.toggle(
              "nav-hidden",
              entry.isIntersecting &&
                entry.intersectionRatio >
                  0.16
            );
          }
        );
      },
      {
        threshold: [
          0,
          0.16,
          0.35
        ]
      }
    );

  closingObserver.observe(
    closingSection
  );
}


/* =========================================================
   HERO PARALLAX
========================================================= */

const heroImage =
  document.querySelector(
    ".hero-image"
  );

let heroScrollTicking =
  false;

function updateHeroParallax() {
  if (!heroImage) return;

  const scrollY =
    window.scrollY;

  const maxMovement =
    Math.min(
      scrollY * 0.035,
      18
    );

  heroImage.style.backgroundPosition =
    `center calc(50% + ${maxMovement}px)`;

  heroScrollTicking =
    false;
}

window.addEventListener(
  "scroll",
  () => {
    if (
      heroScrollTicking
    ) {
      return;
    }

    window.requestAnimationFrame(
      updateHeroParallax
    );

    heroScrollTicking =
      true;
  },
  {
    passive: true
  }
);


/* =========================================================
   SUBTLE DESKTOP HERO MOVEMENT
========================================================= */

const hero =
  document.querySelector(
    ".hero"
  );

if (
  hero &&
  heroImage &&
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {
  hero.addEventListener(
    "mousemove",
    (event) => {
      const rect =
        hero.getBoundingClientRect();

      const x =
        (
          event.clientX -
          rect.left
        ) /
        rect.width -
        0.5;

      const y =
        (
          event.clientY -
          rect.top
        ) /
        rect.height -
        0.5;

      heroImage.style.backgroundPosition =
        `${50 + x * 1.5}% ${50 + y * 1.2}%`;
    }
  );

  hero.addEventListener(
    "mouseleave",
    () => {
      heroImage.style.backgroundPosition =
        "center center";
    }
  );
}


/* =========================================================
   EVENT CARD TOUCH EFFECT
========================================================= */

document
  .querySelectorAll(
    ".event-card"
  )
  .forEach(
    (card) => {
      card.addEventListener(
        "touchstart",
        () => {
          card.style.transform =
            "translateY(-4px)";
        },
        {
          passive: true
        }
      );

      card.addEventListener(
        "touchend",
        () => {
          setTimeout(
            () => {
              card.style.transform =
                "";
            },
            160
          );
        },
        {
          passive: true
        }
      );
    }
  );


/* =========================================================
   PAGE READY
========================================================= */

window.addEventListener(
  "load",
  () => {
    updateStoryState();
    updateBackToTop();
  }
);

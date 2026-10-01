/* =========================================================
   SUPNIK.IN
   Nikhil & Supriya
========================================================= */


/* =========================================================
   ENTER
========================================================= */

const enterButton =
  document.getElementById(
    "enterCelebration"
  );

enterButton?.addEventListener(
  "click",
  () => {

    document
      .getElementById("intro")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* =========================================================
   COUNTDOWN
========================================================= */

const weddingDate =
  new Date(
    "2026-11-21T10:30:00+05:30"
  );


const daysEl =
  document.getElementById("days");

const hoursEl =
  document.getElementById("hours");

const minutesEl =
  document.getElementById("minutes");

const secondsEl =
  document.getElementById("seconds");

const countdownMessage =
  document.getElementById(
    "countdownMessage"
  );


function twoDigits(number) {

  return String(number)
    .padStart(2, "0");

}


function updateCountdown() {

  const now =
    new Date();

  const distance =
    weddingDate - now;


  if (distance <= 0) {

    daysEl.textContent =
      "00";

    hoursEl.textContent =
      "00";

    minutesEl.textContent =
      "00";

    secondsEl.textContent =
      "00";


    countdownMessage.textContent =
      "The big day is here.";

    return;

  }


  const days =
    Math.floor(
      distance /
      (
        1000 *
        60 *
        60 *
        24
      )
    );


  const hours =
    Math.floor(
      (
        distance /
        (
          1000 *
          60 *
          60
        )
      ) % 24
    );


  const minutes =
    Math.floor(
      (
        distance /
        (
          1000 *
          60
        )
      ) % 60
    );


  const seconds =
    Math.floor(
      (
        distance /
        1000
      ) % 60
    );


  /*
    We are now within 99 days,
    so DAYS stays visually at
    two digits as requested.
  */

  daysEl.textContent =
    twoDigits(days);

  hoursEl.textContent =
    twoDigits(hours);

  minutesEl.textContent =
    twoDigits(minutes);

  secondsEl.textContent =
    twoDigits(seconds);


  if (days > 30) {

    countdownMessage.textContent =
      "Close enough to be exciting.";

  } else if (days > 7) {

    countdownMessage.textContent =
      "Okay. This is getting very real.";

  } else if (days > 1) {

    countdownMessage.textContent =
      "This would be a good time to locate your outfit.";

  } else {

    countdownMessage.textContent =
      "See you very, very soon.";

  }

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const reveals =
  document.querySelectorAll(
    ".reveal"
  );


if (
  "IntersectionObserver"
  in window
) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target
              .classList
              .add("visible");


            observer.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.11,

        rootMargin:
          "0px 0px -35px 0px"
      }
    );


  reveals.forEach(
    (element, index) => {

      element.style
        .transitionDelay =
          `${Math.min(
            index % 3,
            2
          ) * 50}ms`;


      revealObserver.observe(
        element
      );

    }
  );

} else {

  reveals.forEach(
    element => {

      element.classList.add(
        "visible"
      );

    }
  );

}


/* =========================================================
   HERO SPARKLES
========================================================= */

const heroSparkles =
  document.getElementById(
    "heroSparkles"
  );


if (heroSparkles) {

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const sparkle =
      document.createElement(
        "span"
      );


    sparkle.className =
      "hero-sparkle";


    sparkle.textContent =
      Math.random() > 0.5
        ? "✦"
        : "·";


    sparkle.style.left =
      `${5 + Math.random() * 90}%`;


    sparkle.style.top =
      `${25 + Math.random() * 65}%`;


    sparkle.style.animationDuration =
      `${4 + Math.random() * 5}s`;


    sparkle.style.animationDelay =
      `${Math.random() * 5}s`;


    sparkle.style.fontSize =
      `${6 + Math.random() * 8}px`;


    heroSparkles.appendChild(
      sparkle
    );

  }

}


/* =========================================================
   TEAM NIKHIL / SUPRIYA
========================================================= */

const teamNikhil =
  document.getElementById(
    "teamNikhil"
  );

const teamSupriya =
  document.getElementById(
    "teamSupriya"
  );

const teamResponse =
  document.getElementById(
    "teamResponse"
  );


let nikhilClicks = 0;

let supriyaClicks = 0;


teamNikhil?.addEventListener(
  "click",
  () => {

    nikhilClicks++;


    if (nikhilClicks >= 5) {

      teamResponse.textContent =
        "Okay bro, we get it.";

      nikhilClicks = 0;

      return;

    }


    teamResponse.textContent =
      "Excellent choice. Slightly questionable judgment, but excellent choice.";

  }
);


teamSupriya?.addEventListener(
  "click",
  () => {

    supriyaClicks++;


    if (supriyaClicks >= 5) {

      teamResponse.textContent =
        "Commitment noted. Respect.";

      supriyaClicks = 0;

      return;

    }


    teamResponse.textContent =
      "You clearly know who runs this wedding.";

  }
);


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
      "An airport"
    ],

    answer: 0,

    reaction:
      "Correct. HR was not consulted."
  },


  {
    question:
      "Where did things become suspiciously less professional?",

    options: [
      "A meeting room",
      "Watson’s",
      "An airport",
      "MGM Beach Resort"
    ],

    answer: 1,

    reaction:
      "Exactly. Allegedly just a casual catch-up."
  },


  {
    question:
      "What became a recurring feature of the long-distance chapter?",

    options: [
      "Flights",
      "Calls",
      "When are you coming?",
      "All of the above"
    ],

    answer: 3,

    reaction:
      "Correct. Frequent-flyer points deserve a wedding invitation."
  },


  {
    question:
      "What eventually replaced the boarding passes?",

    options: [
      "Peace and quiet",
      "Bangalore traffic",
      "A private jet",
      "Good planning"
    ],

    answer: 1,

    reaction:
      "Correct. Romantic? Debatable."
  },


  {
    question:
      "Where are we getting married?",

    options: [
      "KPMG",
      "Goa",
      "MGM Beach Resort",
      "Watson’s"
    ],

    answer: 2,

    reaction:
      "Correct. Slightly better than a conference room."
  },


  {
    question:
      "What is the 2026 plot twist?",

    options: [
      "More long distance",
      "Everyone else travels now",
      "Nobody mentions traffic",
      "We move back to KPMG"
    ],

    answer: 1,

    reaction:
      "Correct. Our turn to inconvenience everyone."
  },


  {
    question:
      "Which phrase best describes the road from KPMG to Chennai?",

    options: [
      "Simple",
      "Efficient",
      "A suspicious amount of logistics",
      "Zero travel"
    ],

    answer: 2,

    reaction:
      "Correct. There have been spreadsheets."
  },


  {
    question:
      "What is the safest prediction for November 21–22?",

    options: [
      "Everyone arrives early",
      "Nobody asks directions",
      "Nikhil and Supriya get married",
      "Zero WhatsApp messages"
    ],

    answer: 2,

    reaction:
      "Correct. We’re reasonably confident about that one."
  }

];


const startQuiz =
  document.getElementById(
    "startQuiz"
  );

const restartQuiz =
  document.getElementById(
    "restartQuiz"
  );

const quizStart =
  document.getElementById(
    "quizStart"
  );

const quizGame =
  document.getElementById(
    "quizGame"
  );

const quizResult =
  document.getElementById(
    "quizResult"
  );

const quizProgress =
  document.getElementById(
    "quizProgress"
  );

const quizScore =
  document.getElementById(
    "quizScore"
  );

const quizQuestion =
  document.getElementById(
    "quizQuestion"
  );

const quizOptions =
  document.getElementById(
    "quizOptions"
  );

const quizReaction =
  document.getElementById(
    "quizReaction"
  );

const quizResultTitle =
  document.getElementById(
    "quizResultTitle"
  );

const quizResultText =
  document.getElementById(
    "quizResultText"
  );


let quizQuestions = [];

let quizIndex = 0;

let score = 0;

let locked = false;


function shuffle(
  array
) {

  const copy =
    [...array];


  for (
    let i =
      copy.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      copy[i],
      copy[j]
    ] =
    [
      copy[j],
      copy[i]
    ];

  }


  return copy;

}


function beginQuiz() {

  quizQuestions =
    shuffle(
      quizBank
    ).slice(
      0,
      6
    );


  quizIndex = 0;

  score = 0;

  locked = false;


  quizStart
    ?.classList
    .add("hidden");


  quizResult
    ?.classList
    .add("hidden");


  quizGame
    ?.classList
    .remove("hidden");


  renderQuestion();

}


function renderQuestion() {

  locked = false;


  const current =
    quizQuestions[
      quizIndex
    ];


  if (!current) {
    return;
  }


  quizProgress.textContent =
    `Question ${quizIndex + 1} of 6`;


  quizScore.textContent =
    `${score} correct`;


  quizQuestion.textContent =
    current.question;


  quizReaction.textContent =
    "";


  quizOptions.innerHTML =
    "";


  current.options
    .forEach(
      (
        option,
        optionIndex
      ) => {

        const button =
          document
            .createElement(
              "button"
            );


        button.type =
          "button";


        button.textContent =
          option;


        button.addEventListener(
          "click",
          () => {

            answerQuestion(
              button,
              optionIndex,
              current
            );

          }
        );


        quizOptions.appendChild(
          button
        );

      }
    );

}


function answerQuestion(
  button,
  selected,
  current
) {

  if (locked) {
    return;
  }


  locked = true;


  const buttons =
    quizOptions
      .querySelectorAll(
        "button"
      );


  const correct =
    selected ===
    current.answer;


  if (correct) {

    score++;

    button.classList.add(
      "correct"
    );

  } else {

    button.classList.add(
      "wrong"
    );


    buttons[
      current.answer
    ]
      ?.classList
      .add(
        "correct"
      );

  }


  quizScore.textContent =
    `${score} correct`;


  quizReaction.textContent =
    correct
      ? current.reaction
      : "Not quite. We’ll pretend nobody saw that.";


  buttons.forEach(
    btn => {

      btn.disabled =
        true;

    }
  );


  setTimeout(
    () => {

      quizIndex++;


      if (
        quizIndex >=
        quizQuestions.length
      ) {

        finishQuiz();

      } else {

        renderQuestion();

      }

    },
    1100
  );

}


function finishQuiz() {

  quizGame
    ?.classList
    .add(
      "hidden"
    );


  quizResult
    ?.classList
    .remove(
      "hidden"
    );


  if (score === 6) {

    quizResultTitle.textContent =
      "Suspicious.";

    quizResultText.textContent =
      "Perfect score. Either you know us extremely well or you studied this website.";

  } else if (
    score >= 4
  ) {

    quizResultTitle.textContent =
      "You actually know us.";

    quizResultText.textContent =
      `${score}/6. Respectable. Your invitation remains valid.`;

  } else if (
    score >= 2
  ) {

    quizResultTitle.textContent =
      "We’ll allow it.";

    quizResultText.textContent =
      `${score}/6. Enough knowledge to attend. Probably not enough to give a speech.`;

  } else {

    quizResultTitle.textContent =
      "Interesting.";

    quizResultText.textContent =
      `${score}/6. Still invited. Barely.`;

  }

}


startQuiz?.addEventListener(
  "click",
  beginQuiz
);


restartQuiz?.addEventListener(
  "click",
  beginQuiz
);


/* =========================================================
   CALENDAR FILES
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
      "Nikhil & Supriya's Engagement"

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
      "Nikhil & Supriya's Reception"

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
      "Nikhil & Supriya's Muhurtham"

  }

};


function escapeICS(
  value
) {

  return String(value)

    .replace(
      /\\/g,
      "\\\\"
    )

    .replace(
      /\n/g,
      "\\n"
    )

    .replace(
      /,/g,
      "\\,"
    )

    .replace(
      /;/g,
      "\\;"
    );

}


function downloadCalendar(
  type
) {

  const event =
    calendarEvents[type];


  if (!event) {
    return;
  }


  const stamp =
    new Date()
      .toISOString()
      .replace(
        /[-:]/g,
        ""
      )
      .replace(
        /\.\d{3}Z$/,
        "Z"
      );


  const content = [

    "BEGIN:VCALENDAR",

    "VERSION:2.0",

    "PRODID:-//SUPNIK//Wedding//EN",

    "CALSCALE:GREGORIAN",

    "BEGIN:VEVENT",

    `UID:${type}-2026@supnik.in`,

    `DTSTAMP:${stamp}`,

    `DTSTART:${event.start}`,

    `DTEND:${event.end}`,

    `SUMMARY:${escapeICS(event.title)}`,

    `LOCATION:${escapeICS(event.location)}`,

    `DESCRIPTION:${escapeICS(event.description)}`,

    "END:VEVENT",

    "END:VCALENDAR"

  ].join(
    "\r\n"
  );


  const blob =
    new Blob(
      [content],
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
    `nikhil-supriya-${type}.ics`;


  document.body
    .appendChild(
      link
    );


  link.click();


  link.remove();


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
    button => {

      button.addEventListener(
        "click",
        () => {

          downloadCalendar(
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


const wisdom = [

  "If someone says ‘quick photo’, emotionally prepare for seventeen.",

  "Never trust anyone who says the family group photo will take five minutes.",

  "Comfortable shoes are a personality trait now.",

  "If you are lost, walk confidently. People may assume you are helping.",

  "Charge your phone. Someone will eventually ask you to take a photo.",

  "The phrase ‘we’re almost ready’ has no measurable relationship with time.",

  "When in doubt, follow the person who looks like they know what is happening.",

  "Do not start an IPL argument unless you have cleared your schedule.",

  "If Nikhil says everything is under control, confirm independently.",

  "If Supriya says everything is under control, it probably is.",

  "One enthusiastic relative is enough to start a dance floor.",

  "Someone will ask where the venue is despite being sent the location several times."

];


let lastWisdom =
  -1;


wisdomButton?.addEventListener(
  "click",
  () => {

    let index;


    do {

      index =
        Math.floor(
          Math.random() *
          wisdom.length
        );

    } while (
      index ===
        lastWisdom &&
      wisdom.length > 1
    );


    lastWisdom =
      index;


    wisdomText.style.opacity =
      "0";


    wisdomText.style.transform =
      "translateY(6px)";


    setTimeout(
      () => {

        wisdomText.textContent =
          wisdom[index];


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
   FLOATING NAV
========================================================= */

const navLinks =
  document.querySelectorAll(
    ".nav-link"
  );


navLinks.forEach(
  link => {

    link.addEventListener(
      "click",
      event => {

        const selector =
          link.getAttribute(
            "href"
          );


        if (
          !selector
          ?.startsWith("#")
        ) {
          return;
        }


        const target =
          document.querySelector(
            selector
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior:
            "smooth",

          block:
            "start"
        });

      }
    );

  }
);


const navSections = [

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
  item =>
    item.element
);


function updateActiveNav() {

  const position =
    window.scrollY +
    window.innerHeight *
    0.38;


  let active =
    "home";


  navSections.forEach(
    section => {

      if (
        position >=
        section.element.offsetTop
      ) {

        active =
          section.id;

      }

    }
  );


  navLinks.forEach(
    link => {

      link.classList.toggle(
        "active",

        link.dataset.section ===
          active
      );

    }
  );

}


window.addEventListener(
  "scroll",
  updateActiveNav,
  {
    passive: true
  }
);


updateActiveNav();


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
  document.getElementById(
    "backToTop"
  );


function updateBackToTop() {

  backToTop
    ?.classList
    .toggle(
      "visible",

      window.scrollY >
        750
    );

}


window.addEventListener(
  "scroll",
  updateBackToTop,
  {
    passive: true
  }
);


backToTop?.addEventListener(
  "click",
  () => {

    window.scrollTo({
      top: 0,

      behavior:
        "smooth"
    });

  }
);


/* =========================================================
   HIDE NAV AT CLOSING
========================================================= */

const floatingNav =
  document.getElementById(
    "mobileNav"
  );

const closing =
  document.querySelector(
    ".closing-section"
  );


if (
  floatingNav &&
  closing &&
  "IntersectionObserver"
  in window
) {

  const closingObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            floatingNav
              .classList
              .toggle(
                "nav-hidden",

                entry.isIntersecting &&
                entry.intersectionRatio >
                  0.22
              );

          }
        );

      },
      {
        threshold: [
          0,
          0.22,
          0.45
        ]
      }
    );


  closingObserver.observe(
    closing
  );

}


/* =========================================================
   SECRET LOGO EASTER EGG
========================================================= */

const secretTrigger =
  document.getElementById(
    "secretTrigger"
  );

const secretOverlay =
  document.getElementById(
    "secretMessage"
  );

const secretClose =
  document.getElementById(
    "secretClose"
  );

const heartContainer =
  document.getElementById(
    "heartContainer"
  );


let heartsInterval;


function createHeart() {

  if (!heartContainer) {
    return;
  }


  const heart =
    document.createElement(
      "span"
    );


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


  heartContainer.appendChild(
    heart
  );


  setTimeout(
    () => {

      heart.remove();

    },
    8500
  );

}


function openSecret() {

  secretOverlay
    ?.classList
    .add("open");


  secretOverlay
    ?.setAttribute(
      "aria-hidden",
      "false"
    );


  document.body
    .style
    .overflow =
      "hidden";


  clearInterval(
    heartsInterval
  );


  heartsInterval =
    setInterval(
      createHeart,
      700
    );


  for (
    let i = 0;
    i < 6;
    i++
  ) {

    setTimeout(
      createHeart,
      i * 120
    );

  }

}


function closeSecret() {

  secretOverlay
    ?.classList
    .remove("open");


  secretOverlay
    ?.setAttribute(
      "aria-hidden",
      "true"
    );


  document.body
    .style
    .overflow =
      "";


  clearInterval(
    heartsInterval
  );


  if (heartContainer) {

    heartContainer.innerHTML =
      "";

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


secretOverlay?.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      secretOverlay
    ) {

      closeSecret();

    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeSecret();

    }

  }
);


/* =========================================================
   LIGHT HERO PARALLAX
========================================================= */

const heroBg =
  document.querySelector(
    ".hero-bg"
  );


let ticking =
  false;


function heroParallax() {

  if (!heroBg) {
    return;
  }


  const movement =
    Math.min(
      window.scrollY *
      0.025,
      15
    );


  heroBg.style.backgroundPosition =
    `center calc(50% + ${movement}px)`;


  ticking =
    false;

}


window.addEventListener(
  "scroll",
  () => {

    if (ticking) {
      return;
    }


    ticking =
      true;


    requestAnimationFrame(
      heroParallax
    );

  },
  {
    passive: true
  }
);


/* =========================================================
   READY
========================================================= */

window.addEventListener(
  "load",
  () => {

    updateCountdown();

    updateActiveNav();

    updateBackToTop();

  }
);

/* =========================================================
   SUPNIK.IN
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


function pad(number) {

  return String(number)
    .padStart(2, "0");

}


/*
   One different line for
   each of the final 50 days.
*/

const dailyCountdownLines = [

  "Fifty days. Plenty of time. This confidence will age badly.",

  "Forty-nine days. Someone has definitely started a wedding spreadsheet.",

  "Forty-eight days. We still believe everything is under control. Adorable.",

  "Forty-seven days. Outfit decisions are entering committee review.",

  "Forty-six days. Family WhatsApp activity has increased by approximately 800%.",

  "Forty-five days. The phrase ‘small change’ is becoming increasingly dangerous.",

  "Forty-four days. Somebody has asked about the guest list again.",

  "Forty-three days. We are still accepting unsolicited opinions. Unfortunately.",

  "Forty-two days. The answer to life, the universe and whether the décor is final: apparently no.",

  "Forty-one days. Nikhil has probably opened another tab.",

  "Forty days. We have entered the ‘that’s actually quite soon’ phase.",

  "Thirty-nine days. The wedding is now closer than several unfinished tasks would prefer.",

  "Thirty-eight days. Someone somewhere is saying, ‘We have time.’",

  "Thirty-seven days. This is your reminder to stop saying you’ll buy the outfit next week.",

  "Thirty-six days. We are officially too close to casually change the entire plan.",

  "Thirty-five days. Five weeks. That sounded better before we calculated it.",

  "Thirty-four days. Family coordination is now a competitive sport.",

  "Thirty-three days. The wedding group chats have developed subplots.",

  "Thirty-two days. Someone has absolutely forgotten to book something.",

  "Thirty-one days. One month-ish. Excellent time to begin mild panic.",

  "Thirty days. This is no longer a future event. This is a situation.",

  "Twenty-nine days. If your outfit is still ‘almost decided’, good luck.",

  "Twenty-eight days. Four weeks. Suddenly everyone has questions.",

  "Twenty-seven days. We have begun using the phrase ‘after the wedding’ as a scheduling system.",

  "Twenty-six days. Someone just suggested one tiny last-minute addition.",

  "Twenty-five days. Halfway through the final fifty. Dignity remains optional.",

  "Twenty-four days. The calendar is starting to look personally threatening.",

  "Twenty-three days. Everybody remain calm. Especially the people telling everyone to remain calm.",

  "Twenty-two days. The number of screenshots in the wedding folder is concerning.",

  "Twenty-one days. Three weeks. If you are still deciding what to wear, this message is about you.",

  "Twenty days. Twenty. That is not a lot of days.",

  "Nineteen days. Somebody has started checking the weather far too early.",

  "Eighteen days. We have reached the point where every phone call begins with ‘quick thing’.",

  "Seventeen days. No new ideas. Please. We have enough ideas.",

  "Sixteen days. Everything is fine, provided nobody asks a follow-up question.",

  "Fifteen days. Two weeks and change. The change is panic.",

  "Fourteen days. Two weeks. This website is now emotionally invested.",

  "Thirteen days. Bad luck only if you still haven’t sorted your outfit.",

  "Twelve days. We are now measuring time in sleeps.",

  "Eleven days. Somebody say something reassuring.",

  "Ten days. DOUBLE DIGITS ARE OVER AFTER TODAY.",

  "Nine days. Single digits. We would like to unsubscribe.",

  "Eight days. The wedding is closer than your next lazy Sunday.",

  "Seven days. ONE WEEK. Nobody make any new plans.",

  "Six days. This is officially happening whether we are ready or not.",

  "Five days. If you need Nikhil, perhaps reconsider.",

  "Four days. There are now too many people asking ‘anything I can help with?’",

  "Three days. Sleep is becoming more of a concept.",

  "Two days. Pack. Charge your phone. Locate your clothes. Good luck.",

  "Tomorrow. TOMORROW. This website is no longer calm."

];


/*
   Final 48 hours.
   One line for every hour.
*/

const final48Lines = [

  "48 hours. We have entered the no-new-ideas zone.",

  "47 hours. Somewhere, a garment bag is being aggressively zipped.",

  "46 hours. Someone has just asked a question that was answered three weeks ago.",

  "45 hours. Phone battery anxiety has officially begun.",

  "44 hours. The phrase ‘where is it?’ is gaining momentum.",

  "43 hours. This is a terrible time to discover you forgot something.",

  "42 hours. Everything is fine. The spreadsheet says so.",

  "41 hours. The family group chat has become mission control.",

  "40 hours. Nikhil is probably checking something that was already checked.",

  "39 hours. Supriya is probably wondering why it needed checking again.",

  "38 hours. Someone is currently ironing something at an unreasonable hour.",

  "37 hours. Wedding logistics have achieved sentience.",

  "36 hours. One and a half days. Deeply unnecessary levels of excitement.",

  "35 hours. If you are travelling, this would be a great time to know where your ID is.",

  "34 hours. Someone has definitely packed three outfits for one event.",

  "33 hours. The weather app has been refreshed. Again.",

  "32 hours. We are accepting compliments and absolutely no additional suggestions.",

  "31 hours. This countdown is now moving disrespectfully fast.",

  "30 hours. You can still pretend you have everything organised.",

  "29 hours. That pretence is becoming harder.",

  "28 hours. Nobody mention last-minute changes.",

  "27 hours. A charger has already gone missing.",

  "26 hours. Somebody has asked what time the event starts. The website feels insulted.",

  "25 hours. Almost one day. Fantastic. Terrifying.",

  "24 hours. ONE DAY. Everybody behave.",

  "23 hours. This is your final warning to locate your clothes.",

  "22 hours. There is absolutely no reason to begin a new skincare experiment now.",

  "21 hours. Wedding brain has replaced normal brain.",

  "20 hours. People are arriving. Things are happening. Excellent.",

  "19 hours. Someone has already misplaced a room key.",

  "18 hours. The phrase ‘quick photo’ is about to become dangerous.",

  "17 hours. We are running entirely on excitement and questionable sleep.",

  "16 hours. This seemed very far away when we built this website.",

  "15 hours. If you have a logistical question, please first ask yourself if you truly need the answer.",

  "14 hours. We are entering full wedding mode.",

  "13 hours. Everything is ready. Do not fact-check that statement.",

  "12 hours. TWELVE HOURS. Go sleep. Seriously.",

  "11 hours. Why are you still awake?",

  "10 hours. If you are reading this instead of sleeping, we have concerns.",

  "9 hours. The alarm clocks have been armed.",

  "8 hours. Somebody is definitely awake already.",

  "7 hours. Wedding morning energy has entered the building.",

  "6 hours. Coffee. Clothes. Confidence.",

  "5 hours. We are past the point of solving problems elegantly.",

  "4 hours. If it cannot be fixed in four hours, it is now décor.",

  "3 hours. THREE HOURS. Stop refreshing the website.",

  "2 hours. At this point, just show up.",

  "1 hour. Okay. This is actually happening."

];


function updateCountdown() {

  const now =
    new Date();


  const difference =
    weddingDate - now;


  if (difference <= 0) {

    daysEl.textContent =
      "00";

    hoursEl.textContent =
      "00";

    minutesEl.textContent =
      "00";

    secondsEl.textContent =
      "00";


    countdownMessage.textContent =
      "THE DAY IS HERE. Stop looking at the countdown and come celebrate.";

    return;
  }


  const totalHours =
    Math.ceil(
      difference /
      (
        1000 *
        60 *
        60
      )
    );


  const days =
    Math.floor(
      difference /
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
        difference /
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
        difference /
        (
          1000 *
          60
        )
      ) % 60
    );


  const seconds =
    Math.floor(
      (
        difference /
        1000
      ) % 60
    );


  daysEl.textContent =
    pad(days);

  hoursEl.textContent =
    pad(hours);

  minutesEl.textContent =
    pad(minutes);

  secondsEl.textContent =
    pad(seconds);


  /*
     Last 48 hours gets
     hour-specific nonsense.
  */

  if (
    totalHours <= 48 &&
    totalHours >= 1
  ) {

    countdownMessage.textContent =
      final48Lines[
        48 - totalHours
      ];

    return;
  }


  /*
     Final 50 days gets
     a different joke each day.
  */

  if (
    days <= 50 &&
    days >= 1
  ) {

    countdownMessage.textContent =
      dailyCountdownLines[
        50 - days
      ];

    return;
  }


  countdownMessage.textContent =
    `${days} days to go. Plenty of time to pretend we are completely organised.`;

}


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   REVEALS
========================================================= */

const reveals =
  document.querySelectorAll(
    ".reveal"
  );


if (
  "IntersectionObserver"
  in window
) {

  const observer =
    new IntersectionObserver(
      (
        entries,
        revealObserver
      ) => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target
                .classList
                .add(
                  "visible"
                );


              revealObserver
                .unobserve(
                  entry.target
                );

            }

          }
        );

      },
      {
        threshold: 0.11
      }
    );


  reveals.forEach(
    item => {

      observer.observe(
        item
      );

    }
  );

} else {

  reveals.forEach(
    item => {

      item.classList.add(
        "visible"
      );

    }
  );

}


/* =========================================================
   HERO SPARKLES
========================================================= */

const sparkles =
  document.getElementById(
    "heroSparkles"
  );


if (sparkles) {

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
      Math.random() > 0.45
        ? "✦"
        : "·";


    sparkle.style.left =
      `${5 + Math.random() * 90}%`;


    sparkle.style.top =
      `${20 + Math.random() * 70}%`;


    sparkle.style.fontSize =
      `${6 + Math.random() * 7}px`;


    sparkle.style.animationDuration =
      `${4 + Math.random() * 5}s`;


    sparkle.style.animationDelay =
      `${Math.random() * 5}s`;


    sparkles.appendChild(
      sparkle
    );

  }

}


/* =========================================================
   PICK A SIDE
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


    const lines = [

      "Interesting. Nikhil will be informed immediately.",

      "Excellent. Your judgment appears mostly functional.",

      "Team Nikhil gains one completely unofficial vote.",

      "You clicked it again. This is becoming political.",

      "Okay bro. We get it."

    ];


    teamResponse.textContent =
      lines[
        Math.min(
          nikhilClicks - 1,
          lines.length - 1
        )
      ];

  }
);


teamSupriya?.addEventListener(
  "click",
  () => {

    supriyaClicks++;


    const lines = [

      "A very safe diplomatic decision.",

      "Supriya appreciates your excellent survival instincts.",

      "Another vote. Nikhil would like to request a recount.",

      "You seem extremely confident about this.",

      "Commitment noted. Respect."

    ];


    teamResponse.textContent =
      lines[
        Math.min(
          supriyaClicks - 1,
          lines.length - 1
        )
      ];

  }
);


/* =========================================================
   HORIZONTAL STORY
========================================================= */

const storyScroller =
  document.getElementById(
    "storyScroller"
  );

const storyCards =
  document.querySelectorAll(
    ".story-card"
  );

const storyDots =
  document.querySelectorAll(
    "#storyDots span"
  );


function updateStoryPosition() {

  if (!storyScroller) {
    return;
  }


  const scrollerCenter =
    storyScroller.scrollLeft +
    storyScroller.clientWidth / 2;


  let closestIndex = 0;

  let closestDistance =
    Infinity;


  storyCards.forEach(
    (
      card,
      index
    ) => {

      const cardCenter =
        card.offsetLeft +
        card.offsetWidth / 2;


      const distance =
        Math.abs(
          cardCenter -
          scrollerCenter
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


  storyCards.forEach(
    (
      card,
      index
    ) => {

      card.classList.toggle(
        "active",
        index === closestIndex
      );

    }
  );


  storyDots.forEach(
    (
      dot,
      index
    ) => {

      dot.classList.toggle(
        "active",
        index === closestIndex
      );

    }
  );

}


storyScroller?.addEventListener(
  "scroll",
  () => {

    requestAnimationFrame(
      updateStoryPosition
    );

  },
  {
    passive: true
  }
);


updateStoryPosition();


/* =========================================================
   QUIZ
========================================================= */

const quizQuestions = [

  {
    question:
      "Who is more likely to turn one tiny decision into a full research project?",

    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],

    answer: 0,

    reaction:
      "Correct. There were probably tabs, comparisons and at least one spreadsheet."
  },


  {
    question:
      "Who is more likely to eventually say, ‘Just pick one’?",

    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],

    answer: 1,

    reaction:
      "Correct. Every project eventually requires executive intervention."
  },


  {
    question:
      "Who is more likely to still be changing something on this website one week before the wedding?",

    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],

    answer: 0,

    reaction:
      "Correct. Please confiscate his GitHub access in November."
  },


  {
    question:
      "Who is more likely to survive Chennai weather without immediately complaining?",

    options: [
      "Nikhil",
      "Supriya",
      "Absolutely neither"
    ],

    answer: 1,

    reaction:
      "Correct. One of them has home-ground advantage."
  },


  {
    question:
      "Who is more likely to know where something actually is when everybody else is looking for it?",

    options: [
      "Nikhil",
      "Supriya",
      "Nobody. We are doomed."
    ],

    answer: 1,

    reaction:
      "Correct. There is usually one functioning operations department."
  },


  {
    question:
      "Who is more likely to say, ‘It’ll take five minutes’ immediately before a twenty-minute task?",

    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],

    answer: 0,

    reaction:
      "Correct. Time estimates are currently under investigation."
  },


  {
    question:
      "Who is more likely to remember a tiny detail from a conversation six months ago?",

    options: [
      "Nikhil",
      "Supriya",
      "Depends who is winning the argument"
    ],

    answer: 2,

    reaction:
      "Correct. Memory is remarkably powerful when evidence is required."
  },


  {
    question:
      "Who is more likely to be calm right until the exact second everyone else starts panicking?",

    options: [
      "Nikhil",
      "Supriya",
      "Neither"
    ],

    answer: 1,

    reaction:
      "Correct. Somebody has to maintain operational stability."
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


let quizDeck = [];

let currentQuestion = 0;

let score = 0;

let quizLocked = false;


function shuffleArray(
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

  quizDeck =
    shuffleArray(
      quizQuestions
    ).slice(
      0,
      6
    );


  currentQuestion = 0;

  score = 0;


  quizStart
    ?.classList
    .add(
      "hidden"
    );


  quizResult
    ?.classList
    .add(
      "hidden"
    );


  quizGame
    ?.classList
    .remove(
      "hidden"
    );


  renderQuestion();

}


function renderQuestion() {

  quizLocked = false;


  const question =
    quizDeck[
      currentQuestion
    ];


  quizProgress.textContent =
    `QUESTION ${currentQuestion + 1} OF 6`;


  quizScore.textContent =
    `${score} CORRECT`;


  quizQuestion.textContent =
    question.question;


  quizReaction.textContent =
    "";


  quizOptions.innerHTML =
    "";


  question.options.forEach(
    (
      option,
      index
    ) => {

      const button =
        document.createElement(
          "button"
        );


      button.textContent =
        option;


      button.addEventListener(
        "click",
        () => {

          answerQuiz(
            button,
            index,
            question
          );

        }
      );


      quizOptions.appendChild(
        button
      );

    }
  );

}


function answerQuiz(
  button,
  selected,
  question
) {

  if (quizLocked) {
    return;
  }


  quizLocked = true;


  const buttons =
    quizOptions
      .querySelectorAll(
        "button"
      );


  if (
    selected ===
    question.answer
  ) {

    score++;

    button.classList.add(
      "correct"
    );


    quizReaction.textContent =
      question.reaction;

  } else {

    button.classList.add(
      "wrong"
    );


    buttons[
      question.answer
    ]
      ?.classList
      .add(
        "correct"
      );


    quizReaction.textContent =
      "Incorrect. Please reconsider how well you know these people.";

  }


  quizScore.textContent =
    `${score} CORRECT`;


  buttons.forEach(
    item => {

      item.disabled =
        true;

    }
  );


  setTimeout(
    () => {

      currentQuestion++;


      if (
        currentQuestion >=
        quizDeck.length
      ) {

        finishQuiz();

      } else {

        renderQuestion();

      }

    },
    1200
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


  if (
    score === 6
  ) {

    quizResultTitle.textContent =
      "Disturbingly accurate.";

    quizResultText.textContent =
      "6/6. Either you know us extremely well or you have been taking notes.";

  } else if (
    score >= 4
  ) {

    quizResultTitle.textContent =
      "You may stay.";

    quizResultText.textContent =
      `${score}/6. Strong performance. Your invitation remains fully valid.`;

  } else if (
    score >= 2
  ) {

    quizResultTitle.textContent =
      "Concerning, but recoverable.";

    quizResultText.textContent =
      `${score}/6. Spend more time with us before volunteering to give a speech.`;

  } else {

    quizResultTitle.textContent =
      "Who invited you?";

    quizResultText.textContent =
      `${score}/6. The wedding information is elsewhere on this website. Please begin there.`;

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
   CALENDAR
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
      "Lake Lawn, MGM Beach Resort, ECR, Chennai"

  },


  reception: {

    title:
      "Nikhil & Supriya - Reception",

    start:
      "20261121T123000Z",

    end:
      "20261121T160000Z",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai"

  },


  muhurtham: {

    title:
      "Nikhil & Supriya - Muhurtham",

    start:
      "20261122T030000Z",

    end:
      "20261122T043000Z",

    location:
      "Palm Beach Lawn, MGM Beach Resort, ECR, Chennai"

  }

};


function downloadCalendar(
  type
) {

  const event =
    calendarEvents[type];


  if (!event) {
    return;
  }


  const content = [

    "BEGIN:VCALENDAR",

    "VERSION:2.0",

    "PRODID:-//SUPNIK//Wedding//EN",

    "BEGIN:VEVENT",

    `DTSTART:${event.start}`,

    `DTEND:${event.end}`,

    `SUMMARY:${event.title}`,

    `LOCATION:${event.location}`,

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
          "text/calendar"
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
    `${type}.ics`;


  link.click();


  URL.revokeObjectURL(
    url
  );

}


document
  .querySelectorAll(
    ".calendar-button-photo"
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
   WEDDING HELP DESK
========================================================= */

const helpAnswer =
  document.getElementById(
    "helpAnswer"
  );


const helpResponses = {

  lost:
    "Open Maps. Search MGM Beach Resort. If you still cannot find it, follow the suspicious number of well-dressed people.",

  late:
    "First rule: do not announce it dramatically in the family WhatsApp group. Second rule: start moving.",

  outfit:
    "At this point, confidence is part of the outfit. Put it on and come.",

  confused:
    "Find somebody who looks like they know what is happening. They probably do not, but confidence is useful."

};


document
  .querySelectorAll(
    "[data-help]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const response =
            helpResponses[
              button.dataset.help
            ];


          helpAnswer.innerHTML =
            `
              <span>OFFICIAL RESPONSE</span>
              <p>${response}</p>
            `;

        }
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

        const targetId =
          link.getAttribute(
            "href"
          );


        if (
          !targetId
            ?.startsWith("#")
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior:
            "smooth"
        });

      }
    );

  }
);


const sections = [

  "home",
  "story",
  "events",
  "venue"

];


function updateNav() {

  const position =
    window.scrollY +
    window.innerHeight *
    0.4;


  let active =
    "home";


  sections.forEach(
    id => {

      const element =
        document.getElementById(
          id
        );


      if (
        element &&
        position >=
        element.offsetTop
      ) {

        active =
          id;

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
  updateNav,
  {
    passive: true
  }
);


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
  document.getElementById(
    "backToTop"
  );


window.addEventListener(
  "scroll",
  () => {

    backToTop
      ?.classList
      .toggle(
        "visible",

        window.scrollY >
          700
      );

  },
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
   HIDE NAV ON ENDING
========================================================= */

const nav =
  document.getElementById(
    "mobileNav"
  );

const closing =
  document.querySelector(
    ".closing-section"
  );


if (
  nav &&
  closing &&
  "IntersectionObserver"
  in window
) {

  const closingObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            nav.classList.toggle(
              "nav-hidden",

              entry.isIntersecting &&
              entry.intersectionRatio >
                0.25
            );

          }
        );

      },
      {
        threshold: [
          0,
          0.25
        ]
      }
    );


  closingObserver.observe(
    closing
  );

}


/* =========================================================
   SECRET
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


let heartTimer;


function createHeart() {

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
    `${15 + Math.random() * 20}px`;


  heart.style.animationDuration =
    `${4 + Math.random() * 4}s`;


  heartContainer
    ?.appendChild(
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
    .add(
      "open"
    );


  document.body.style.overflow =
    "hidden";


  heartTimer =
    setInterval(
      createHeart,
      600
    );

}


function closeSecret() {

  secretOverlay
    ?.classList
    .remove(
      "open"
    );


  document.body.style.overflow =
    "";


  clearInterval(
    heartTimer
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


/* =========================================================
   INITIAL
========================================================= */

window.addEventListener(
  "load",
  () => {

    updateCountdown();

    updateStoryPosition();

    updateNav();

  }
);

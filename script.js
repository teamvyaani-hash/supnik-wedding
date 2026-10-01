/* =========================================================
   SUPNIK.IN
   Nikhil & Supriya
   Main Website Interactions
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

function padNumber(number) {
  return String(number).padStart(2, "0");
}


/* =========================================================
   ENTER THE CELEBRATION
========================================================= */

const enterButton = document.querySelector(".primary-button");

if (enterButton) {
  enterButton.addEventListener("click", function (event) {
    event.preventDefault();

    const celebration = document.getElementById("celebration");

    if (celebration) {
      celebration.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
}


/* =========================================================
   COUNTDOWN
========================================================= */

const weddingDate = new Date("2026-11-21T10:30:00+05:30");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdownMessage");


function updateCountdownMessage(daysLeft) {

  if (!countdownMessage) {
    return;
  }

  if (daysLeft > 100) {

    countdownMessage.textContent =
      "Plenty of time. At least that is what we keep telling ourselves.";

  } else if (daysLeft > 30) {

    countdownMessage.textContent =
      "This is getting very real.";

  } else if (daysLeft > 7) {

    countdownMessage.textContent =
      "Outfits ready. Plans questionable. Excellent.";

  } else if (daysLeft > 1) {

    countdownMessage.textContent =
      "Everybody panic gracefully.";

  } else if (daysLeft === 1) {

    countdownMessage.textContent =
      "See you tomorrow.";

  } else {

    countdownMessage.textContent =
      "TODAY'S THE DAY.";

  }

}


function updateCountdown() {

  const now = new Date();

  const difference =
    weddingDate.getTime() - now.getTime();


  if (difference <= 0) {

    if (daysElement) daysElement.textContent = "00";
    if (hoursElement) hoursElement.textContent = "00";
    if (minutesElement) minutesElement.textContent = "00";
    if (secondsElement) secondsElement.textContent = "00";

    if (countdownMessage) {
      countdownMessage.textContent =
        "TODAY'S THE DAY.";
    }

    return;
  }


  const totalSeconds =
    Math.floor(difference / 1000);

  const days =
    Math.floor(totalSeconds / 86400);

  const hours =
    Math.floor(
      (totalSeconds % 86400) / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;


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

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   SCROLL REVEALS
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(

      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },

      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
      }

    );


  revealElements.forEach(function (element) {

    revealObserver.observe(element);

  });

} else {

  revealElements.forEach(function (element) {

    element.classList.add("visible");

  });

}


/* =========================================================
   TEAM NIKHIL / TEAM SUPRIYA
========================================================= */

const teamButtons =
  document.querySelectorAll(".team-button");

const teamResponse =
  document.getElementById("teamResponse");


let nikhilTapCount = 0;
let supriyaTapCount = 0;


const teamMessages = {

  nikhil:
    "Excellent choice. Slightly questionable judgment, but excellent choice.",

  supriya:
    "You clearly know who runs this wedding."

};


teamButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    const selectedTeam =
      button.dataset.team;


    teamButtons.forEach(function (item) {

      item.classList.remove("selected");

    });


    button.classList.add("selected");


    if (selectedTeam === "nikhil") {

      nikhilTapCount += 1;

      supriyaTapCount = 0;


      if (nikhilTapCount >= 5) {

        teamResponse.textContent =
          "Okay bro, we get it.";

        nikhilTapCount = 0;

      } else {

        teamResponse.textContent =
          teamMessages.nikhil;

      }

    }


    if (selectedTeam === "supriya") {

      supriyaTapCount += 1;

      nikhilTapCount = 0;


      if (supriyaTapCount >= 5) {

        teamResponse.textContent =
          "Commitment noted. Respect.";

        supriyaTapCount = 0;

      } else {

        teamResponse.textContent =
          teamMessages.supriya;

      }

    }

  });

});


/* =========================================================
   SECRET N & S EASTER EGG
========================================================= */

const secretTrigger =
  document.getElementById("secretTrigger");

const secretMessage =
  document.getElementById("secretMessage");

const heartContainer =
  document.getElementById("heartContainer");


function createFloatingHearts() {

  if (!heartContainer) {
    return;
  }


  const hearts = [
    "♡",
    "♥",
    "♡",
    "♡",
    "♥"
  ];


  for (let index = 0; index < 14; index += 1) {

    const heart =
      document.createElement("span");


    heart.className =
      "floating-heart";


    heart.textContent =
      hearts[
        Math.floor(
          Math.random() * hearts.length
        )
      ];


    heart.style.left =
      `${5 + Math.random() * 90}%`;


    heart.style.setProperty(
      "--drift",
      `${Math.random() * 160 - 80}px`
    );


    heart.style.animationDuration =
      `${3 + Math.random() * 2.5}s`;


    heart.style.animationDelay =
      `${Math.random() * 0.8}s`;


    heart.style.fontSize =
      `${14 + Math.random() * 14}px`;


    heartContainer.appendChild(heart);


    setTimeout(
      function () {
        heart.remove();
      },
      7000
    );

  }

}


function openSecret() {

  if (!secretMessage) {
    return;
  }


  secretMessage.classList.add("show");

  secretMessage.setAttribute(
    "aria-hidden",
    "false"
  );


  createFloatingHearts();


  setTimeout(
    function () {

      secretMessage.classList.remove("show");

      secretMessage.setAttribute(
        "aria-hidden",
        "true"
      );

    },
    3300
  );

}


if (secretTrigger) {

  secretTrigger.addEventListener(
    "click",
    openSecret
  );

}


if (secretMessage) {

  secretMessage.addEventListener(
    "click",
    function () {

      secretMessage.classList.remove("show");

      secretMessage.setAttribute(
        "aria-hidden",
        "true"
      );

    }
  );

}


/* =========================================================
   HORIZONTAL STORY
========================================================= */

const storyScroller =
  document.getElementById("storyScroller");

const storyCards =
  document.querySelectorAll(".story-card");

const storyDots =
  document.querySelectorAll(".story-dot");


function updateStoryDot() {

  if (
    !storyScroller ||
    storyCards.length === 0
  ) {
    return;
  }


  const scrollerCenter =
    storyScroller.scrollLeft +
    storyScroller.clientWidth / 2;


  let closestIndex = 0;
  let closestDistance = Infinity;


  storyCards.forEach(
    function (card, index) {

      const cardCenter =
        card.offsetLeft +
        card.offsetWidth / 2;


      const distance =
        Math.abs(
          cardCenter - scrollerCenter
        );


      if (distance < closestDistance) {

        closestDistance = distance;
        closestIndex = index;

      }

    }
  );


  storyDots.forEach(
    function (dot, index) {

      dot.classList.toggle(
        "active",
        index === closestIndex
      );

    }
  );

}


if (storyScroller) {

  let storyScrollTimer;


  storyScroller.addEventListener(
    "scroll",
    function () {

      clearTimeout(storyScrollTimer);

      storyScrollTimer =
        setTimeout(
          updateStoryDot,
          60
        );

    },
    {
      passive: true
    }
  );

}


storyDots.forEach(
  function (dot) {

    dot.addEventListener(
      "click",
      function () {

        const index =
          Number(dot.dataset.storyIndex);


        const card =
          storyCards[index];


        if (
          storyScroller &&
          card
        ) {

          storyScroller.scrollTo({
            left:
              card.offsetLeft -
              (
                storyScroller.clientWidth -
                card.offsetWidth
              ) / 2,

            behavior: "smooth"
          });

        }

      }
    );

  }
);


/* =========================================================
   NIKHIL & SUPRIYA QUIZ
========================================================= */

const quizBank = [

  {
    question:
      "Where did this whole story technically begin?",

    options: [
      "KPMG",
      "Watson's",
      "Bangalore traffic",
      "Someone accidentally replied-all"
    ],

    answer:
      "KPMG",

    reaction:
      "Corporate romance. HR was not consulted."
  },


  {
    question:
      "Where did things start becoming suspiciously less professional?",

    options: [
      "A meeting room",
      "Watson's, Bangalore",
      "An office Teams call",
      "The printer area"
    ],

    answer:
      "Watson's, Bangalore",

    reaction:
      "Watson's. Where 'just catching up' started doing a lot of heavy lifting."
  },


  {
    question:
      "What became a recurring theme during long distance?",

    options: [
      "When are you coming?",
      "Did you book the tickets?",
      "How many days?",
      "All of the above"
    ],

    answer:
      "All of the above",

    reaction:
      "Long distance had excellent repetition value."
  },


  {
    question:
      "What eventually replaced all those boarding passes?",

    options: [
      "Peace and quiet",
      "Bangalore traffic",
      "A private helicopter",
      "More airports"
    ],

    answer:
      "Bangalore traffic",

    reaction:
      "Finally in the same city. We traded boarding passes for Bangalore traffic jams."
  },


  {
    question:
      "Where does the corporate-calendar story eventually end up?",

    options: [
      "Another KPMG meeting",
      "Watson's again",
      "MGM Beach Resort",
      "A conference room"
    ],

    answer:
      "MGM Beach Resort",

    reaction:
      "From corporate calendars to wedding calendars. Character development."
  },


  {
    question:
      "After years of travelling to see each other, what is the 2026 plot twist?",

    options: [
      "Nobody travels",
      "We make all of you travel instead",
      "The wedding moves to Bangalore",
      "We meet on Teams"
    ],

    answer:
      "We make all of you travel instead",

    reaction:
      "Our turn. See you in Chennai."
  },


  {
    question:
      "What is most likely to survive anything this relationship throws at it?",

    options: [
      "Flight schedules",
      "Bangalore traffic",
      "The two of us",
      "Airport Wi-Fi"
    ],

    answer:
      "The two of us",

    reaction:
      "Correct. Slightly sentimental. We'll allow it."
  },


  {
    question:
      "What is the safest prediction for 21–22 November 2026?",

    options: [
      "Everything runs exactly to schedule",
      "Nobody changes anything",
      "Chennai has zero humidity",
      "Nikhil and Supriya get married regardless"
    ],

    answer:
      "Nikhil and Supriya get married regardless",

    reaction:
      "Finally, one requirement that cannot be changed."
  }

];


/*
   We have 8 questions in the bank.

   Each play selects 6 at random.

   Play again and you may get a slightly
   different set.
*/


function shuffleArray(array) {

  const copy =
    [...array];


  for (
    let index = copy.length - 1;
    index > 0;
    index -= 1
  ) {

    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );


    [
      copy[index],
      copy[randomIndex]
    ] = [
      copy[randomIndex],
      copy[index]
    ];

  }


  return copy;

}


let quizQuestions =
  shuffleArray(quizBank).slice(0, 6);

let currentQuestionIndex = 0;
let quizScore = 0;
let questionLocked = false;


const quizProgress =
  document.getElementById("quizProgress");

const quizProgressBar =
  document.getElementById("quizProgressBar");

const quizQuestion =
  document.getElementById("quizQuestion");

const quizOptions =
  document.getElementById("quizOptions");

const quizFeedback =
  document.getElementById("quizFeedback");

const quizQuestionArea =
  document.getElementById("quizQuestionArea");

const quizResult =
  document.getElementById("quizResult");

const quizScoreElement =
  document.getElementById("quizScore");

const quizResultTitle =
  document.getElementById("quizResultTitle");

const quizResultText =
  document.getElementById("quizResultText");

const restartQuiz =
  document.getElementById("restartQuiz");


function loadQuizQuestion() {

  const currentQuestion =
    quizQuestions[currentQuestionIndex];


  if (!currentQuestion) {
    return;
  }


  questionLocked = false;


  if (quizProgress) {

    quizProgress.textContent =
      `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

  }


  if (quizProgressBar) {

    quizProgressBar.style.width =
      `${
        (
          (currentQuestionIndex + 1) /
          quizQuestions.length
        ) * 100
      }%`;

  }


  if (quizQuestion) {

    quizQuestion.textContent =
      currentQuestion.question;

  }


  if (quizFeedback) {

    quizFeedback.textContent = "";

  }


  if (!quizOptions) {
    return;
  }


  quizOptions.innerHTML = "";


  currentQuestion.options.forEach(
    function (option) {

      const button =
        document.createElement("button");


      button.type = "button";

      button.className =
        "quiz-option";

      button.textContent =
        option;


      button.addEventListener(
        "click",
        function () {

          chooseQuizAnswer(
            button,
            option,
            currentQuestion
          );

        }
      );


      quizOptions.appendChild(button);

    }
  );

}


function chooseQuizAnswer(
  selectedButton,
  selectedAnswer,
  currentQuestion
) {

  if (questionLocked) {
    return;
  }


  questionLocked = true;


  const buttons =
    quizOptions.querySelectorAll(
      ".quiz-option"
    );


  buttons.forEach(
    function (button) {

      button.disabled = true;


      if (
        button.textContent ===
        currentQuestion.answer
      ) {

        button.classList.add(
          "correct"
        );

      }

    }
  );


  if (
    selectedAnswer ===
    currentQuestion.answer
  ) {

    quizScore += 1;

    selectedButton.classList.add(
      "correct"
    );


    if (quizFeedback) {

      quizFeedback.textContent =
        currentQuestion.reaction;

    }

  } else {

    selectedButton.classList.add(
      "wrong"
    );


    if (quizFeedback) {

      quizFeedback.textContent =
        `Not quite. ${currentQuestion.reaction}`;

    }

  }


  setTimeout(
    function () {

      currentQuestionIndex += 1;


      if (
        currentQuestionIndex <
        quizQuestions.length
      ) {

        loadQuizQuestion();

      } else {

        showQuizResult();

      }

    },
    1700
  );

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
    !quizResultTitle ||
    !quizResultText
  ) {
    return;
  }


  if (quizScore === 6) {

    quizResultTitle.textContent =
      "Suspicious.";

    quizResultText.textContent =
      "Perfect score. You know far too much. We are keeping an eye on you.";

  } else if (quizScore >= 4) {

    quizResultTitle.textContent =
      "You actually know us.";

    quizResultText.textContent =
      "Very respectable. Your invitation remains completely safe.";

  } else if (quizScore >= 2) {

    quizResultTitle.textContent =
      "We'll allow it.";

    quizResultText.textContent =
      "Not terrible. A little revision before November wouldn't hurt.";

  } else {

    quizResultTitle.textContent =
      "Interesting.";

    quizResultText.textContent =
      "Still invited. Barely.";

  }

}


function resetQuiz() {

  quizQuestions =
    shuffleArray(quizBank).slice(0, 6);

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
    "click",
    resetQuiz
  );

}


if (
  quizQuestion &&
  quizOptions
) {

  loadQuizQuestion();

}


/* =========================================================
   INDIVIDUAL CALENDAR INVITES
========================================================= */

/*
   Times below are in UTC.

   Chennai is UTC +05:30.

   Engagement:
   10:30 AM IST

   Reception:
   6:00 PM IST

   Muhurtham:
   8:30 AM - 10:00 AM IST
*/


const calendarEvents = {

  engagement: {

    fileName:
      "Nikhil-Supriya-Engagement.ics",

    title:
      "Nikhil & Supriya | Engagement",

    start:
      "20261121T050000Z",

    duration:
      "PT90M",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai, Tamil Nadu",

    description:
      "Engagement celebration of Nikhil and Supriya. Saturday, 21 November 2026 at 10:30 AM."
  },


  reception: {

    fileName:
      "Nikhil-Supriya-Reception.ics",

    title:
      "Nikhil & Supriya | Reception",

    start:
      "20261121T123000Z",

    duration:
      "PT3H30M",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai, Tamil Nadu",

    description:
      "Wedding reception of Nikhil and Supriya. Saturday, 21 November 2026 at 6:00 PM."
  },


  muhurtham: {

    fileName:
      "Nikhil-Supriya-Muhurtham.ics",

    title:
      "Nikhil & Supriya | Muhurtham",

    start:
      "20261122T030000Z",

    end:
      "20261122T043000Z",

    location:
      "Palm Beach Lawn, MGM Beach Resort, ECR, Chennai, Tamil Nadu",

    description:
      "Muhurtham ceremony of Nikhil and Supriya. Sunday, 22 November 2026 from 8:30 AM to 10:00 AM."
  }

};


function escapeICSText(text) {

  return text
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");

}


function downloadCalendarEvent(
  eventData
) {

  const now =
    new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");


  const uid =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@supnik.in`;


  const lines = [

    "BEGIN:VCALENDAR",

    "VERSION:2.0",

    "PRODID:-//SUPNIK.IN//Nikhil and Supriya Wedding//EN",

    "CALSCALE:GREGORIAN",

    "METHOD:PUBLISH",

    "BEGIN:VEVENT",

    `UID:${uid}`,

    `DTSTAMP:${now}`,

    `DTSTART:${eventData.start}`

  ];


  if (eventData.end) {

    lines.push(
      `DTEND:${eventData.end}`
    );

  } else if (eventData.duration) {

    lines.push(
      `DURATION:${eventData.duration}`
    );

  }


  lines.push(

    `SUMMARY:${escapeICSText(
      eventData.title
    )}`,

    `LOCATION:${escapeICSText(
      eventData.location
    )}`,

    `DESCRIPTION:${escapeICSText(
      eventData.description
    )}`,

    "URL:https://supnik.in",

    "STATUS:CONFIRMED",

    "END:VEVENT",

    "END:VCALENDAR"

  );


  const calendarContent =
    lines.join("\r\n");


  const blob =
    new Blob(
      [calendarContent],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    eventData.fileName;


  document.body.appendChild(link);

  link.click();

  link.remove();


  setTimeout(
    function () {
      URL.revokeObjectURL(url);
    },
    500
  );

}


const calendarButtons =
  document.querySelectorAll(
    ".calendar-button"
  );


calendarButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const eventName =
          button.dataset.event;


        const eventData =
          calendarEvents[eventName];


        if (eventData) {

          downloadCalendarEvent(
            eventData
          );

        }

      }
    );

  }
);


/* =========================================================
   WEDDING WISDOM
========================================================= */

const weddingWisdom = [

  "Never trust the phrase 'five minutes away.'",

  "A confident walk can disguise the fact that you have absolutely no idea where you're going.",

  "The schedule is a document. Reality is a separate department.",

  "If someone says 'one quick photo', mentally clear the next fifteen minutes.",

  "If you don't know what's happening, find someone who looks confident and stand next to them.",

  "When someone says 'small change only', prepare emotionally.",

  "If the DJ plays your song, pretending you didn't hear it will not save you.",

  "Nobody truly knows what time everyone is leaving. Accept this early.",

  "If three different relatives give you three different instructions, congratulations. The wedding has begun.",

  "Walk with purpose. Nobody needs to know you're lost."

];


const wisdomButton =
  document.getElementById(
    "wisdomButton"
  );

const wisdomResult =
  document.getElementById(
    "wisdomResult"
  );


let lastWisdomIndex = -1;


if (
  wisdomButton &&
  wisdomResult
) {

  wisdomButton.addEventListener(
    "click",
    function () {

      let randomIndex;


      do {

        randomIndex =
          Math.floor(
            Math.random() *
            weddingWisdom.length
          );

      } while (
        randomIndex ===
          lastWisdomIndex &&
        weddingWisdom.length > 1
      );


      lastWisdomIndex =
        randomIndex;


      wisdomResult.style.opacity =
        "0";


      wisdomResult.style.transform =
        "translateY(8px)";


      setTimeout(
        function () {

          wisdomResult.textContent =
            weddingWisdom[randomIndex];


          wisdomResult.style.opacity =
            "1";


          wisdomResult.style.transform =
            "translateY(0)";

        },
        180
      );

  });

}


/* =========================================================
   MOBILE NAV
========================================================= */

const mobileNav =
  document.getElementById(
    "mobileNav"
  );

const navLinks =
  document.querySelectorAll(
    ".nav-link"
  );


navLinks.forEach(
  function (link) {

    link.addEventListener(
      "click",
      function (event) {

        event.preventDefault();


        const selector =
          link.getAttribute("href");


        const target =
          document.querySelector(selector);


        if (target) {

          target.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  }
);


/* =========================================================
   ACTIVE NAV SECTION
========================================================= */

const navSections = [

  document.getElementById("home"),

  document.getElementById("story"),

  document.getElementById("events"),

  document.getElementById("venue")

].filter(Boolean);


if ("IntersectionObserver" in window) {

  const navigationObserver =
    new IntersectionObserver(

      function (entries) {

        entries.forEach(
          function (entry) {

            if (!entry.isIntersecting) {
              return;
            }


            const id =
              entry.target.id;


            navLinks.forEach(
              function (link) {

                link.classList.toggle(
                  "active",
                  link.dataset.section === id
                );

              }
            );

          }
        );

      },

      {
        threshold: 0.38
      }

    );


  navSections.forEach(
    function (section) {

      navigationObserver.observe(
        section
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

  if (!backToTop) {
    return;
  }


  backToTop.classList.toggle(
    "show",
    window.scrollY > 900
  );

}


if (backToTop) {

  backToTop.addEventListener(
    "click",
    function () {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
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


/* =========================================================
   HIDE NAV NEAR VERY BOTTOM
========================================================= */

function updateNavVisibility() {

  if (!mobileNav) {
    return;
  }


  const distanceFromBottom =

    document.documentElement.scrollHeight -

    (
      window.scrollY +
      window.innerHeight
    );


  mobileNav.classList.toggle(
    "hidden",
    distanceFromBottom < 160
  );

}


window.addEventListener(
  "scroll",
  updateNavVisibility,
  {
    passive: true
  }
);


updateNavVisibility();


/* =========================================================
   LIGHT HERO PARALLAX
========================================================= */

const heroImage =
  document.querySelector(
    ".hero-image"
  );

const heroContent =
  document.querySelector(
    ".hero-content"
  );


let scrollTicking = false;


function updateHeroMovement() {

  const scrollY =
    window.scrollY;


  if (
    scrollY <
    window.innerHeight * 1.1
  ) {

    if (heroImage) {

      heroImage.style.transform =
        `translateY(${scrollY * 0.045}px) scale(1.035)`;

    }


    if (heroContent) {

      heroContent.style.transform =
        `translateY(${scrollY * 0.018}px)`;

    }

  }


  scrollTicking = false;

}


window.addEventListener(
  "scroll",
  function () {

    if (!scrollTicking) {

      window.requestAnimationFrame(
        updateHeroMovement
      );


      scrollTicking = true;

    }

  },
  {
    passive: true
  }
);


/* =========================================================
   EVENT TOUCH EFFECT
========================================================= */

const eventCards =
  document.querySelectorAll(
    ".event-card"
  );


eventCards.forEach(
  function (card) {

    card.addEventListener(
      "touchstart",
      function () {

        const image =
          card.querySelector(
            ".event-image"
          );


        if (image) {

          image.style.transform =
            "scale(1.035)";

        }

      },
      {
        passive: true
      }
    );


    card.addEventListener(
      "touchend",
      function () {

        const image =
          card.querySelector(
            ".event-image"
          );


        if (image) {

          setTimeout(
            function () {

              image.style.transform =
                "";

            },
            250
          );

        }

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
  function () {

    document.body.classList.add(
      "loaded"
    );


    updateStoryDot();

    updateBackToTop();

    updateNavVisibility();

  }
);

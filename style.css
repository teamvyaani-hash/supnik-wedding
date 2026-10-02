/* =========================================================
   NIKHIL & SUPRIYA
   MAIN WEBSITE SCRIPT
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) =>
  document.querySelector(selector);

const $$ = (selector) =>
  [...document.querySelectorAll(selector)];


function safeName(value) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30);
}


function firstName(value) {
  return safeName(value).split(" ")[0] || "friend";
}


/* =========================================================
   GUEST PERSONALISATION
========================================================= */

const STORAGE_NAME = "nsGuestName";
const STORAGE_SIDE = "nsGuestSide";
const STORAGE_TEAM = "nsGuestTeam";


let guestName =
  localStorage.getItem(STORAGE_NAME) || "";

let guestSide =
  localStorage.getItem(STORAGE_SIDE) || "";

let guestTeam =
  localStorage.getItem(STORAGE_TEAM) || "";


const guestGate =
  $("#guestGate");

const guestNameStep =
  $("#guestNameStep");

const guestSideStep =
  $("#guestSideStep");

const guestWelcomeStep =
  $("#guestWelcomeStep");

const guestNameForm =
  $("#guestNameForm");

const guestNameInput =
  $("#guestNameInput");

const gateGuestName =
  $("#gateGuestName");

const welcomeGuestName =
  $("#welcomeGuestName");

const gateWelcomeMessage =
  $("#gateWelcomeMessage");

const changeGuest =
  $("#changeGuest");


function getSideWelcome(side, name) {

  if (side === "bride") {
    return `${name}, Supriya has excellent taste in people. We're assuming you're evidence.`;
  }

  if (side === "groom") {
    return `${name}, thank you for agreeing to supervise Nikhil for the weekend.`;
  }

  return `${name}, diplomatic immunity granted. Choose your alliances carefully.`;
}


function applyPersonalisation() {

  const name =
    firstName(guestName);


  const heroPersonal =
    $("#heroPersonal");

  const countdownHeading =
    $("#countdownHeading");

  const quizIntroTitle =
    $("#quizIntroTitle");

  const blrPersonal =
    $("#blrPersonal");

  const closingGuestName =
    $("#closingGuestName");


  if (heroPersonal) {
    heroPersonal.textContent =
      `${name}, we're really glad you're here.`;
  }


  if (countdownHeading) {
    countdownHeading.textContent =
      `${name}, the countdown is officially on.`;
  }


  if (quizIntroTitle) {
    quizIntroTitle.textContent =
      `Alright ${name}, how well do you know us?`;
  }


  if (blrPersonal) {
    blrPersonal.textContent =
      `${name}, your completely unofficial cultural orientation awaits.`;
  }


  if (closingGuestName) {
    closingGuestName.textContent =
      name;
  }

}


function hideGateImmediately() {

  if (!guestGate) {
    return;
  }

  guestGate.style.display =
    "none";

  document.body.classList.remove(
    "gate-open"
  );

}


function openWebsite() {

  applyPersonalisation();


  if (!guestGate) {
    return;
  }


  guestGate.classList.add(
    "gate-leaving"
  );


  document.body.classList.remove(
    "gate-open"
  );


  setTimeout(() => {

    guestGate.style.display =
      "none";

  }, 800);

}


function showWelcomeStep() {

  const name =
    firstName(guestName);


  guestNameStep?.classList.add(
    "hidden"
  );

  guestSideStep?.classList.add(
    "hidden"
  );

  guestWelcomeStep?.classList.remove(
    "hidden"
  );


  if (welcomeGuestName) {
    welcomeGuestName.textContent =
      name;
  }


  if (gateWelcomeMessage) {
    gateWelcomeMessage.textContent =
      getSideWelcome(
        guestSide,
        name
      );
  }


  setTimeout(
    openWebsite,
    1800
  );

}


/* =========================================================
   INITIAL GUEST STATE
========================================================= */

if (
  guestName &&
  guestSide
) {

  hideGateImmediately();

  applyPersonalisation();

} else {

  document.body.classList.add(
    "gate-open"
  );

}


/* =========================================================
   NAME FORM
========================================================= */

guestNameForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const enteredName =
      safeName(
        guestNameInput?.value || ""
      );


    if (!enteredName) {
      guestNameInput?.focus();
      return;
    }


    guestName =
      enteredName;


    localStorage.setItem(
      STORAGE_NAME,
      guestName
    );


    if (gateGuestName) {
      gateGuestName.textContent =
        firstName(guestName);
    }


    guestNameStep?.classList.add(
      "hidden"
    );

    guestSideStep?.classList.remove(
      "hidden"
    );

  }
);


/* =========================================================
   BRIDE / GROOM / BOTH
========================================================= */

$$("[data-guest-side]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        guestSide =
          button.dataset.guestSide || "both";


        localStorage.setItem(
          STORAGE_SIDE,
          guestSide
        );


        showWelcomeStep();

      }
    );

  }
);


/* =========================================================
   CHANGE GUEST
========================================================= */

changeGuest?.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      STORAGE_NAME
    );

    localStorage.removeItem(
      STORAGE_SIDE
    );

    localStorage.removeItem(
      STORAGE_TEAM
    );


    window.location.reload();

  }
);


/* =========================================================
   ENTER CELEBRATION
========================================================= */

$("#enterCelebration")?.addEventListener(
  "click",
  () => {

    $("#intro")?.scrollIntoView({
      behavior: "smooth"
    });

  }
);


/* =========================================================
   PICK A SIDE
========================================================= */

const teamNikhil =
  $("#teamNikhil");

const teamSupriya =
  $("#teamSupriya");

const teamResponse =
  $("#teamResponse");


function selectTeam(team) {

  guestTeam =
    team;


  localStorage.setItem(
    STORAGE_TEAM,
    team
  );


  const name =
    firstName(guestName);


  teamNikhil?.classList.remove(
    "selected"
  );

  teamSupriya?.classList.remove(
    "selected"
  );


  if (team === "nikhil") {

    teamNikhil?.classList.add(
      "selected"
    );


    if (teamResponse) {
      teamResponse.textContent =
        `${name} chose Team Nikhil. A bold decision. This information has been forwarded to Supriya.`;
    }

  } else {

    teamSupriya?.classList.add(
      "selected"
    );


    if (teamResponse) {
      teamResponse.textContent =
        `${name} chose Team Supriya. Sensible. Nikhil has requested an investigation.`;
    }

  }

}


teamNikhil?.addEventListener(
  "click",
  () => selectTeam("nikhil")
);


teamSupriya?.addEventListener(
  "click",
  () => selectTeam("supriya")
);


if (guestTeam) {
  selectTeam(guestTeam);
}


/* =========================================================
   COUNTDOWN
========================================================= */

const weddingDate =
  new Date(
    "2026-11-21T10:30:00+05:30"
  );


/*
   ONE DIFFERENT LINE FOR EACH OF
   THE FINAL 50 DAYS.
*/

const final50DayLines = [

  "50 days. Plenty of time to plan your outfit. Probably.",

  "49 days. The wedding is now close enough to start pretending you've planned everything.",

  "48 days. Somewhere, somebody has already started a wedding WhatsApp group.",

  "47 days. Still enough time to say you'll shop next weekend.",

  "46 days. Outfit confidence remains suspiciously high for someone who hasn't bought anything.",

  "45 days. The countdown has officially become mildly threatening.",

  "44 days. You may now begin asking people what they're wearing.",

  "43 days. The phrase “I'll figure it out” remains technically available.",

  "42 days. Six weeks. That sounded much further away when we said fifty days.",

  "41 days. Your calendar would like to remind you this is actually happening.",

  "40 days. Forty. Nice round number. Absolutely no reason to panic.",

  "39 days. If you need tailoring, this would be an excellent time to stop procrastinating.",

  "38 days. The wedding Pinterest boards are becoming operational documents.",

  "37 days. Someone has already planned three outfits and a backup. Learn from them.",

  "36 days. We're approaching the point where “I'll order it online” becomes a gamble.",

  "35 days. Five weeks. Your future self is beginning to judge your current self.",

  "34 days. This website remains calmer than the people organising the wedding.",

  "33 days. You still have time. We repeat: you still have time.",

  "32 days. Thirty-two days until several hundred photos nobody was emotionally prepared for.",

  "31 days. One month-ish. The word “soon” is now legally accurate.",

  "30 days. ONE MONTH. Please locate your wedding clothes.",

  "29 days. Less than a month. That sentence was intentionally alarming.",

  "28 days. Four weeks. Somewhere, a tailor has just sensed a disturbance.",

  "27 days. Start breaking in the shoes you claimed were comfortable.",

  "26 days. This is your reminder that ironing clothes on the wedding morning is not a plan.",

  "25 days. Halfway from fifty. Things are getting suspiciously real.",

  "24 days. Have you booked what needs booking? This website is judging silently.",

  "23 days. The group chats are about to become significantly more active.",

  "22 days. If your outfit still says “out for delivery,” we wish you strength.",

  "21 days. Three weeks. We have entered serious calendar territory.",

  "20 days. Twenty days until Chennai gets considerably better dressed.",

  "19 days. You may now begin practising your family-photo smile.",

  "18 days. Somewhere an aunty is already asking who is arriving when.",

  "17 days. Your suitcase can no longer remain a theoretical concept.",

  "16 days. Two weeks and change. “I'll do it later” has been officially discontinued.",

  "15 days. Fifteen days. Locate jewellery, shoes, chargers and patience.",

  "14 days. TWO WEEKS. This is not a drill. It is, however, still a wedding.",

  "13 days. The final fortnight has begun. Good luck to everyone involved.",

  "12 days. If you haven't decided what you're wearing, congratulations on your confidence.",

  "11 days. Eleven. We're now counting with the intensity of a rocket launch.",

  "10 days. SINGLE DIGITS TOMORROW. Somebody inform the family WhatsApp groups.",

  "9 days. Single digits. There is officially no room left for casual behaviour.",

  "8 days. One week and one bonus day. Chennai, prepare yourself.",

  "7 days. ONE WEEK. We hope you know where your clothes are.",

  "6 days. Less than a week. The phrase “next weekend” has become dangerously relevant.",

  "5 days. Five. The wedding machinery is now operating at full Indian-family capacity.",

  "4 days. Four days. If you've forgotten something, now is an excellent time to remember it.",

  "3 days. THREE DAYS. Suitcases. Chargers. Clothes. Sanity. Check.",

  "2 days. Forty-eight hours. We are officially entering chaos mode.",

  "1 day. Tomorrow. TOMORROW. We hope you're more prepared than this website."

];


/*
   FINAL 48 HOURS:
   A DIFFERENT LINE FOR EACH HOUR.
*/

const final48HourLines = [

  "48 hours. Two days. Everyone remain completely calm. Nobody is going to do that.",

  "47 hours. The wedding is now closer than your next sensible life decision.",

  "46 hours. Somewhere, somebody is asking where the safety pins are.",

  "45 hours. We have entered the phase where every phone call begins with “small thing.”",

  "44 hours. If your suitcase is still empty, we admire the confidence.",

  "43 hours. The family WhatsApp groups are approaching maximum operating capacity.",

  "42 hours. This would be an excellent time to confirm you actually know where MGM Beach Resort is.",

  "41 hours. Somebody has already asked what time everyone is leaving. Nobody knows.",

  "40 hours. Less than two days. The spreadsheet people are thriving.",

  "39 hours. The non-spreadsheet people are pretending everything is fine.",

  "38 hours. Please charge your phone. There will be approximately 4,000 photos.",

  "37 hours. Somewhere, an outfit is being altered at a speed not recommended by professionals.",

  "36 hours. A day and a half. The wedding has officially become tomorrow-adjacent.",

  "35 hours. Have you packed? That pause before answering was concerning.",

  "34 hours. Someone is currently saying “we'll leave on time” without evidence.",

  "33 hours. The number of incoming calls is increasing. This is normal. Allegedly.",

  "32 hours. Reminder: “ECR traffic” is not a fictional concept.",

  "31 hours. We are now measuring time in outfits and ceremonies.",

  "30 hours. Thirty hours. Enough time to sleep. Whether anyone actually will is another matter.",

  "29 hours. Somebody's mother has already asked them to leave earlier.",

  "28 hours. Wedding logistics have officially reached air-traffic-control complexity.",

  "27 hours. If you forgot something, decide now whether you truly needed it.",

  "26 hours. The phrase “where are you?” will soon become the weekend's official greeting.",

  "25 hours. Twenty-five hours. One final hour before the dramatic 24-hour announcement.",

  "24 hours. TOMORROW. There is no longer any respectable amount of procrastination available.",

  "23 hours. Under one day. If you're still shopping, we have questions.",

  "22 hours. Somewhere, somebody is steaming an outfit and regretting every life choice.",

  "21 hours. The countdown has stopped being cute.",

  "20 hours. Twenty hours. Please begin moving in the general direction of preparedness.",

  "19 hours. At this point even the website is checking whether you're ready.",

  "18 hours. The alarms are being set. The alarms will later be ignored.",

  "17 hours. We hope your clothes fit. This is a terrible time to discover otherwise.",

  "16 hours. Sixteen hours. Chennai is warming up. Literally and metaphorically.",

  "15 hours. Somewhere, somebody has packed everything except the one thing they actually need.",

  "14 hours. Fourteen hours. Sleep is becoming an increasingly ambitious proposal.",

  "13 hours. The calm before the extremely well-dressed storm.",

  "12 hours. TWELVE HOURS. We have reached capital-letter territory.",

  "11 hours. Your future self would appreciate it if you went to bed.",

  "10 hours. Ten. If you're awake reading this at an unreasonable hour, that's between you and your decisions.",

  "9 hours. Nine hours. The wedding is basically loading.",

  "8 hours. Eight. Coffee is about to become a strategic resource.",

  "7 hours. Seven hours. Someone's alarm is already preparing to ruin their morning.",

  "6 hours. SIX HOURS. Good morning to everyone except whoever stayed up too late.",

  "5 hours. Five hours. The getting-ready Olympics have begun.",

  "4 hours. Four hours. Hair, clothes, jewellery, phone, dignity. Let's move.",

  "3 hours. THREE HOURS. If you're not getting ready, we'd love to hear the strategy.",

  "2 hours. TWO HOURS. Please stop reading the website and start moving.",

  "1 hour. ONE HOUR. Why are you still here? GO GET READY."

];


/* =========================================================
   COUNTDOWN MESSAGE
========================================================= */

function getCountdownMessage(diff) {

  const name =
    firstName(guestName);


  const hour =
    60 * 60 * 1000;

  const day =
    24 * hour;


  if (diff <= 0) {

    return `${name}, the celebration has begun. See you by the sea.`;

  }


  const hoursRemaining =
    Math.ceil(diff / hour);

  const daysRemaining =
    Math.ceil(diff / day);


  /*
     FINAL 48 HOURS
  */

  if (hoursRemaining <= 48) {

    const index =
      Math.max(
        0,
        Math.min(
          47,
          48 - hoursRemaining
        )
      );


    return `${name}, ${final48HourLines[index]}`;

  }


  /*
     FINAL 50 DAYS
  */

  if (daysRemaining <= 50) {

    const index =
      Math.max(
        0,
        Math.min(
          49,
          50 - daysRemaining
        )
      );


    return `${name}, ${final50DayLines[index]}`;

  }


  /*
     MORE THAN 50 DAYS
  */

  return `${name}, plenty of time. Please don't use that as an excuse to leave everything until November.`;

}


/* =========================================================
   UPDATE COUNTDOWN
========================================================= */

function updateCountdown() {

  const now =
    new Date();


  const diff =
    weddingDate.getTime() -
    now.getTime();


  const daysElement =
    $("#days");

  const hoursElement =
    $("#hours");

  const minutesElement =
    $("#minutes");

  const secondsElement =
    $("#seconds");

  const messageElement =
    $("#countdownMessage");


  if (diff <= 0) {

    if (daysElement) {
      daysElement.textContent = "00";
    }

    if (hoursElement) {
      hoursElement.textContent = "00";
    }

    if (minutesElement) {
      minutesElement.textContent = "00";
    }

    if (secondsElement) {
      secondsElement.textContent = "00";
    }

    if (messageElement) {
      messageElement.textContent =
        getCountdownMessage(diff);
    }

    return;

  }


  const totalSeconds =
    Math.floor(diff / 1000);


  const days =
    Math.floor(
      totalSeconds / 86400
    );


  const hours =
    Math.floor(
      (totalSeconds % 86400) /
      3600
    );


  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
      60
    );


  const seconds =
    totalSeconds % 60;


  if (daysElement) {
    daysElement.textContent =
      String(days).padStart(2, "0");
  }


  if (hoursElement) {
    hoursElement.textContent =
      String(hours).padStart(2, "0");
  }


  if (minutesElement) {
    minutesElement.textContent =
      String(minutes).padStart(2, "0");
  }


  if (secondsElement) {
    secondsElement.textContent =
      String(seconds).padStart(2, "0");
  }


  if (messageElement) {
    messageElement.textContent =
      getCountdownMessage(diff);
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

const revealElements =
  $$(".reveal");


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );


            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.10
      }
    );


  revealElements.forEach(element => {

    revealObserver.observe(
      element
    );

  });

} else {

  revealElements.forEach(element => {

    element.classList.add(
      "visible"
    );

  });

}


/* =========================================================
   STORY SCROLLER + DOTS
========================================================= */

const storyScroller =
  $("#storyScroller");

const storyCards =
  $$(".story-card");

const storyDots =
  $("#storyDots");


let storyDotElements = [];


if (
  storyScroller &&
  storyCards.length &&
  storyDots
) {

  storyCards.forEach(
    (_, index) => {

      const dot =
        document.createElement(
          "button"
        );


      dot.className =
        "story-dot";


      dot.type =
        "button";


      dot.setAttribute(
        "aria-label",
        `Go to story ${index + 1}`
      );


      if (index === 0) {
        dot.classList.add("active");
      }


      dot.addEventListener(
        "click",
        () => {

          storyCards[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });

        }
      );


      storyDots.appendChild(dot);

      storyDotElements.push(dot);

    }
  );


  function updateStoryDots() {

    const scrollerCenter =
      storyScroller.scrollLeft +
      storyScroller.clientWidth / 2;


    let closestIndex = 0;

    let closestDistance =
      Infinity;


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


        if (distance < closestDistance) {

          closestDistance =
            distance;

          closestIndex =
            index;

        }

      }
    );


    storyDotElements.forEach(
      (dot, index) => {

        dot.classList.toggle(
          "active",
          index === closestIndex
        );

      }
    );

  }


  storyScroller.addEventListener(
    "scroll",
    updateStoryDots,
    {
      passive: true
    }
  );

}


/* =========================================================
   COUPLE QUIZ

   These are intentionally personality-style questions,
   not obvious KPMG / Watson's trivia.
========================================================= */

const quizQuestions = [

  {
    question:
      "Who is more likely to say “I'm ready” while very clearly not being ready?",
    options: [
      "Nikhil",
      "Supriya",
      "Both. Obviously."
    ],
    answer:
      "Both. Obviously.",
    reaction:
      "Correct. Time is a flexible concept."
  },

  {
    question:
      "Who is more likely to turn a five-minute decision into a full committee meeting?",
    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],
    answer:
      "Nikhil",
    reaction:
      "The committee has accepted your answer."
  },

  {
    question:
      "Who is more likely to remember the tiny detail everybody else forgot?",
    options: [
      "Nikhil",
      "Supriya",
      "Neither. That's why phones exist."
    ],
    answer:
      "Supriya",
    reaction:
      "Somebody has to keep this operation functional."
  },

  {
    question:
      "Who is more likely to say “we don't need anything else” and then buy something else?",
    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],
    answer:
      "Both",
    reaction:
      "Financial discipline has left the chat."
  },

  {
    question:
      "Who is more likely to start planning something way earlier than necessary?",
    options: [
      "Nikhil",
      "Supriya",
      "Both, but in completely different ways"
    ],
    answer:
      "Both, but in completely different ways",
    reaction:
      "This website itself may be supporting evidence."
  },

  {
    question:
      "Who is more likely to insist they know the route and then quietly check Google Maps?",
    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],
    answer:
      "Nikhil",
    reaction:
      "Google Maps appreciates the eventual recognition."
  },

  {
    question:
      "Who is more likely to notice immediately when something is slightly out of place?",
    options: [
      "Nikhil",
      "Supriya",
      "Depends who moved it"
    ],
    answer:
      "Supriya",
    reaction:
      "Nothing escapes quality control."
  },

  {
    question:
      "Who is more likely to say “keep it simple” immediately before making it more elaborate?",
    options: [
      "Nikhil",
      "Supriya",
      "Both"
    ],
    answer:
      "Nikhil",
    reaction:
      "Please observe: this entire wedding website."
  }

];


/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {

  const copy =
    [...array];


  for (
    let i = copy.length - 1;
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
    ] = [
      copy[j],
      copy[i]
    ];

  }


  return copy;

}


/* =========================================================
   QUIZ STATE
========================================================= */

let activeQuizQuestions = [];

let currentQuizIndex = 0;

let quizScore = 0;

let quizLocked = false;


const quizStart =
  $("#quizStart");

const quizGame =
  $("#quizGame");

const quizResult =
  $("#quizResult");

const startQuizButton =
  $("#startQuiz");

const restartQuizButton =
  $("#restartQuiz");

const quizProgress =
  $("#quizProgress");

const quizScoreElement =
  $("#quizScore");

const quizQuestion =
  $("#quizQuestion");

const quizOptions =
  $("#quizOptions");

const quizReaction =
  $("#quizReaction");

const quizResultTitle =
  $("#quizResultTitle");

const quizResultText =
  $("#quizResultText");


/* =========================================================
   START QUIZ
========================================================= */

function startQuiz() {

  activeQuizQuestions =
    shuffleArray(
      quizQuestions
    ).slice(0, 6);


  currentQuizIndex = 0;

  quizScore = 0;

  quizLocked = false;


  quizStart?.classList.add(
    "hidden"
  );


  quizResult?.classList.add(
    "hidden"
  );


  quizGame?.classList.remove(
    "hidden"
  );


  renderQuizQuestion();

}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuizQuestion() {

  const current =
    activeQuizQuestions[
      currentQuizIndex
    ];


  if (!current) {
    finishQuiz();
    return;
  }


  quizLocked = false;


  if (quizProgress) {

    quizProgress.textContent =
      `${currentQuizIndex + 1} / ${activeQuizQuestions.length}`;

  }


  if (quizScoreElement) {

    quizScoreElement.textContent =
      `SCORE · ${quizScore}`;

  }


  if (quizQuestion) {

    quizQuestion.textContent =
      current.question;

  }


  if (quizReaction) {

    quizReaction.textContent = "";

  }


  if (!quizOptions) {
    return;
  }


  quizOptions.innerHTML = "";


  current.options.forEach(
    optionText => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "quiz-option";


      button.textContent =
        optionText;


      button.addEventListener(
        "click",
        () => {

          handleQuizAnswer(
            optionText,
            button
          );

        }
      );


      quizOptions.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   QUIZ ANSWER
========================================================= */

function handleQuizAnswer(
  selectedAnswer,
  selectedButton
) {

  if (quizLocked) {
    return;
  }


  quizLocked = true;


  const current =
    activeQuizQuestions[
      currentQuizIndex
    ];


  const correct =
    selectedAnswer ===
    current.answer;


  if (correct) {

    quizScore++;


    selectedButton.style.background =
      "#493631";


    selectedButton.style.color =
      "#ffffff";


    if (quizReaction) {

      quizReaction.textContent =
        current.reaction;

    }

  } else {

    selectedButton.style.opacity =
      "0.58";


    if (quizReaction) {

      quizReaction.textContent =
        `Interesting choice. The official answer is “${current.answer}.” We will allow it.`;

    }

  }


  if (quizScoreElement) {

    quizScoreElement.textContent =
      `SCORE · ${quizScore}`;

  }


  setTimeout(
    () => {

      currentQuizIndex++;


      if (
        currentQuizIndex >=
        activeQuizQuestions.length
      ) {

        finishQuiz();

      } else {

        renderQuizQuestion();

      }

    },
    1450
  );

}


/* =========================================================
   QUIZ RESULT
========================================================= */

function finishQuiz() {

  quizGame?.classList.add(
    "hidden"
  );


  quizResult?.classList.remove(
    "hidden"
  );


  const name =
    firstName(guestName);


  if (
    !quizResultTitle ||
    !quizResultText
  ) {
    return;
  }


  if (quizScore === 6) {

    quizResultTitle.textContent =
      `${name} knows too much.`;


    quizResultText.textContent =
      "6/6. Impressive. Slightly concerning. We may need to review exactly what we've told you.";

    return;

  }


  if (quizScore >= 4) {

    quizResultTitle.textContent =
      `Not bad, ${name}.`;


    quizResultText.textContent =
      `${quizScore}/6. You may attend the wedding with full guest privileges.`;

    return;

  }


  if (quizScore >= 2) {

    quizResultTitle.textContent =
      `${name}, we need to talk.`;


    quizResultText.textContent =
      `${quizScore}/6. You're still invited, but this performance has been documented.`;

    return;

  }


  quizResultTitle.textContent =
    `This is concerning, ${name}.`;


  quizResultText.textContent =
    `${quizScore}/6. Please spend more time with us before November.`;

}


startQuizButton?.addEventListener(
  "click",
  startQuiz
);


restartQuizButton?.addEventListener(
  "click",
  startQuiz
);


/* =========================================================
   CALENDAR EVENTS
========================================================= */

const calendarEvents = {

  engagement: {

    title:
      "Nikhil & Supriya — Engagement",

    start:
      "20261121T050000Z",

    end:
      "20261121T063000Z",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai",

    description:
      "Engagement celebration for Nikhil & Supriya."

  },


  reception: {

    title:
      "Nikhil & Supriya — Reception",

    start:
      "20261121T123000Z",

    end:
      "20261121T160000Z",

    location:
      "Lake Lawn, MGM Beach Resort, ECR, Chennai",

    description:
      "Wedding reception for Nikhil & Supriya."

  },


  muhurtham: {

    title:
      "Nikhil & Supriya — Muhurtham",

    start:
      "20261122T030000Z",

    end:
      "20261122T043000Z",

    location:
      "Palm Beach Lawn, MGM Beach Resort, ECR, Chennai",

    description:
      "Muhurtham ceremony for Nikhil & Supriya."

  }

};


/* =========================================================
   ICS DOWNLOAD
========================================================= */

function escapeICS(value) {

  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");

}


function downloadCalendarEvent(
  eventKey
) {

  const event =
    calendarEvents[eventKey];


  if (!event) {
    return;
  }


  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nikhil and Supriya Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${eventKey}-2026@supnik.in`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
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
      [ics],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const anchor =
    document.createElement("a");


  anchor.href =
    url;


  anchor.download =
    `${eventKey}-nikhil-supriya.ics`;


  document.body.appendChild(
    anchor
  );


  anchor.click();


  anchor.remove();


  setTimeout(
    () => URL.revokeObjectURL(url),
    1000
  );

}


$$("[data-calendar]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        downloadCalendarEvent(
          button.dataset.calendar
        );

      }
    );

  }
);


/* =========================================================
   WEDDING HELP DESK
========================================================= */

const helpStatus =
  $("#helpStatus");


const helpResponses = {

  late:
    "Running late? Excellent. You have unlocked the authentic Indian-wedding experience. Please still come.",

  outfit:
    "Outfit crisis detected. Official guidance: wear the thing you feel best in and walk in like it was always the plan.",

  lost:
    "Lost? Search MGM Beach Resort, ECR, Chennai in Maps. If you somehow reach Bangalore, you've gone too far.",

  hungry:
    "The most important question on this website. Please proceed toward the celebration and trust the process."

};


$$("[data-help]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const type =
          button.dataset.help;


        const name =
          firstName(guestName);


        if (helpStatus) {

          helpStatus.textContent =
            `${name}: ${helpResponses[type] || "We are escalating this to the appropriate wedding department."}`;

        }

      }
    );

  }
);


/* =========================================================
   FLOATING NAVIGATION
========================================================= */

const navLinks =
  $$(".nav-link");


navLinks.forEach(
  link => {

    link.addEventListener(
      "click",
      event => {

        const href =
          link.getAttribute("href");


        if (
          !href ||
          !href.startsWith("#")
        ) {
          return;
        }


        const target =
          $(href);


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth"
        });

      }
    );

  }
);


/* =========================================================
   ACTIVE NAV ITEM
========================================================= */

const navigationSections = [

  {
    id: "home",
    nav: "home"
  },

  {
    id: "story",
    nav: "story"
  },

  {
    id: "events",
    nav: "events"
  },

  {
    id: "venue",
    nav: "venue"
  }

];


function updateActiveNavigation() {

  const scrollPosition =
    window.scrollY +
    window.innerHeight * 0.42;


  let active =
    "home";


  navigationSections.forEach(
    section => {

      const element =
        document.getElementById(
          section.id
        );


      if (
        element &&
        element.offsetTop <=
        scrollPosition
      ) {

        active =
          section.nav;

      }

    }
  );


  navLinks.forEach(
    link => {

      link.classList.toggle(
        "active",
        link.dataset.nav === active
      );

    }
  );

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
  $("#backToTop");


function updateBackToTop() {

  if (!backToTop) {
    return;
  }


  backToTop.classList.toggle(
    "visible",
    window.scrollY > 650
  );

}


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
   SCROLL EVENTS
========================================================= */

let scrollTicking = false;


window.addEventListener(
  "scroll",
  () => {

    if (scrollTicking) {
      return;
    }


    scrollTicking = true;


    requestAnimationFrame(
      () => {

        updateActiveNavigation();

        updateBackToTop();

        scrollTicking = false;

      }
    );

  },
  {
    passive: true
  }
);


updateActiveNavigation();

updateBackToTop();


/* =========================================================
   SECRET N&S EASTER EGG
========================================================= */

let secretClicks = 0;

let secretTimer = null;


$("#secretTrigger")?.addEventListener(
  "click",
  () => {

    secretClicks++;


    clearTimeout(
      secretTimer
    );


    secretTimer =
      setTimeout(
        () => {

          secretClicks = 0;

        },
        1800
      );


    if (secretClicks < 5) {
      return;
    }


    secretClicks = 0;


    const existing =
      $(".secret-toast");


    if (existing) {
      existing.remove();
    }


    const toast =
      document.createElement(
        "div"
      );


    toast.className =
      "secret-toast";


    toast.innerHTML = `
      <strong>You found it.</strong>
      <span>
        There is no prize.
        We spent the budget on the wedding.
      </span>
    `;


    document.body.appendChild(
      toast
    );


    setTimeout(
      () => {

        toast.remove();

      },
      3500
    );

  }
);


/* =========================================================
   PERSONALISE AGAIN ON PAGE LOAD
========================================================= */

window.addEventListener(
  "load",
  () => {

    if (guestName) {
      applyPersonalisation();
    }

  }
);

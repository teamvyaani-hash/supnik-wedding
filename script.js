/* =========================================================
   NIKHIL & SUPRIYA
   WEDDING WEBSITE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     HELPERS
  ======================================================= */

  const $ = (selector) => document.querySelector(selector);

  const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));


  function cleanName(value) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30);
  }


  function firstName(value) {
    const cleaned = cleanName(value);

    if (!cleaned) {
      return "friend";
    }

    return cleaned.split(" ")[0];
  }


  function storageGet(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }


  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* Continue without local storage */
    }
  }


  function storageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      /* Nothing required */
    }
  }


  function sessionGet(key) {
    try {
      return sessionStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }


  function sessionSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      /* Continue without session storage */
    }
  }


  function sessionRemove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      /* Nothing required */
    }
  }


  const ACTIVITY_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSf9dI--LeJV0ZYcRWCN8iDaazydrszNWXkMYluN-7MzUlyDaQ/formResponse";

  const ACTIVITY_NAME_FIELD =
    "entry.1466085471";

  const ACTIVITY_FIELD =
    "entry.441812958";


  function logActivity(activity) {

    if (!guestName || !activity) {
      return;
    }

    try {

      const formData =
        new FormData();

      formData.append(
        ACTIVITY_NAME_FIELD,
        cleanName(guestName)
      );

      formData.append(
        ACTIVITY_FIELD,
        String(activity)
      );

      fetch(
        ACTIVITY_FORM_URL,
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
          keepalive: true
        }
      ).catch(function () {
        /* Tracking must never interrupt the website */
      });

    } catch (error) {
      /* Tracking must never interrupt the website */
    }
  }


  function safeFilename(value) {
    return cleanName(value)
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "Guest";
  }


  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1500);
  }


  /* =======================================================
     STOP BROWSER RESTORING A RANDOM SCROLL POSITION
  ======================================================= */

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }


  /* =======================================================
     GUEST DATA
  ======================================================= */

  const NAME_KEY = "nsGuestName";
  const SIDE_KEY = "nsGuestSide";

  const BLR_SCROLL_KEY = "nsMainScrollY";
  const BLR_RETURN_KEY = "nsReturnFromBlr";
  const MAIN_LOGGED_KEY = "nsMainEnteredLogged";

  let guestName = storageGet(NAME_KEY);
  let guestSide = storageGet(SIDE_KEY);


  const guestGate = $("#guestGate");
  const nameStep = $("#guestNameStep");
  const sideStep = $("#guestSideStep");
  const welcomeStep = $("#guestWelcomeStep");

  const nameForm = $("#guestNameForm");
  const nameInput = $("#guestNameInput");

  const gateGuestName = $("#gateGuestName");
  const welcomeGuestName = $("#welcomeGuestName");
  const gateWelcomeMessage = $("#gateWelcomeMessage");

  const changeGuest = $("#changeGuest");


  function sideLabel(side) {

    if (side === "groom") {
      return "Nikhil";
    }

    if (side === "bride") {
      return "Supriya";
    }

    return "Both";
  }


  function logMainEntry() {

    if (
      !guestName ||
      !guestSide ||
      sessionGet(MAIN_LOGGED_KEY)
    ) {
      return;
    }

    sessionSet(
      MAIN_LOGGED_KEY,
      "1"
    );

    logActivity(
      `main_entered | side=${sideLabel(guestSide)}`
    );
  }


  /* =======================================================
     PERSONALISATION
  ======================================================= */

  function entranceMessage(side, name) {

    if (side === "groom") {
      return (
        `${name}. Team Nikhil confirmed. ` +
        `Supriya has been notified of your questionable judgement.`
      );
    }

    if (side === "bride") {
      return (
        `${name}. Team Supriya confirmed. ` +
        `Excellent. Someone here is making sensible decisions.`
      );
    }

    return (
      `${name}. You know both of them? ` +
      `Then you already know what you're getting into. ` +
      `Diplomatic immunity granted.`
    );
  }


  function applyPersonalisation() {

    if (!guestName) {
      return;
    }

    const name = firstName(guestName);

    const heroPersonal = $("#heroPersonal");
    const countdownHeading = $("#countdownHeading");
    const quizIntroTitle = $("#quizIntroTitle");
    const closingGuestName = $("#closingGuestName");

    const invitePreviewGuest = $("#invitePreviewGuest");
    const inviteFloatLabel = $("#inviteFloatLabel");


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
        `Alright ${name}, let's make some accusations.`;
    }


    if (closingGuestName) {
      closingGuestName.textContent = name;
    }


    if (changeGuest) {
      changeGuest.textContent =
        `Not ${name}? Change guest`;
    }


    if (invitePreviewGuest) {
      invitePreviewGuest.textContent =
        `${name}, you're on the list.`;
    }


    if (inviteFloatLabel) {
      inviteFloatLabel.textContent =
        `${name}'s Invite`;
    }
  }


  /* =======================================================
     ENTRANCE
  ======================================================= */

  function hardResetToHeroTop() {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }


  function showNameStep() {

    if (!guestGate) {
      return;
    }

    hardResetToHeroTop();

    guestGate.style.display = "flex";
    guestGate.classList.remove("gate-leaving");

    nameStep?.classList.remove("hidden");
    sideStep?.classList.add("hidden");
    welcomeStep?.classList.add("hidden");

    document.body.classList.add("gate-open");

    setTimeout(function () {
      nameInput?.focus();
    }, 150);
  }


  function showSideStep() {

    const name = firstName(guestName);

    if (gateGuestName) {
      gateGuestName.textContent = name;
    }

    nameStep?.classList.add("hidden");
    welcomeStep?.classList.add("hidden");
    sideStep?.classList.remove("hidden");
  }


  function finishEntrance(side) {

    guestSide = side;

    storageSet(SIDE_KEY, side);

    const name = firstName(guestName);


    if (welcomeGuestName) {
      welcomeGuestName.textContent =
        `${name}. There you are.`;
    }


    if (gateWelcomeMessage) {
      gateWelcomeMessage.textContent =
        entranceMessage(side, name);
    }


    nameStep?.classList.add("hidden");
    sideStep?.classList.add("hidden");
    welcomeStep?.classList.remove("hidden");

    applyPersonalisation();

    logMainEntry();


    /*
      IMPORTANT:
      Keep the personalised message visible for ~3 seconds.
    */

    setTimeout(function () {

      /*
        Put the underlying website at the absolute beginning
        BEFORE revealing it.
      */

      hardResetToHeroTop();

      guestGate?.classList.add("gate-leaving");

      document.body.classList.remove("gate-open");


      setTimeout(function () {

        if (guestGate) {
          guestGate.style.display = "none";
        }

        /*
          Second reset prevents mobile browsers from restoring
          the previous layout position during the fade.
        */

        hardResetToHeroTop();


        requestAnimationFrame(function () {

          hardResetToHeroTop();

          setTimeout(
            hardResetToHeroTop,
            80
          );

        });

      }, 700);

    }, 3000);
  }


  /* NAME SUBMIT */

  nameForm?.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      const enteredName =
        cleanName(nameInput?.value);


      if (!enteredName) {
        nameInput?.focus();
        return;
      }


      guestName = enteredName;

      storageSet(
        NAME_KEY,
        guestName
      );

      showSideStep();
    }
  );


  /* SIDE CHOICE */

  $$("[data-guest-side]").forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const side =
            button.dataset.guestSide || "both";

          finishEntrance(side);
        }
      );
    }
  );


  /* RETURNING GUEST */

  const returningFromBlr =
    sessionGet(BLR_RETURN_KEY) === "1";

  const savedMainScroll =
    Number(
      sessionGet(BLR_SCROLL_KEY)
    ) || 0;


  if (returningFromBlr) {
    sessionRemove(BLR_RETURN_KEY);
  }


  if (guestName && guestSide) {

    if (guestGate) {
      guestGate.style.display = "none";
    }

    document.body.classList.remove("gate-open");

    applyPersonalisation();

    logMainEntry();


    if (returningFromBlr) {

      const restoreMainPosition =
        function () {

          window.scrollTo({
            top: savedMainScroll,
            left: 0,
            behavior: "auto"
          });
        };


      requestAnimationFrame(
        function () {

          restoreMainPosition();

          setTimeout(
            restoreMainPosition,
            80
          );

          setTimeout(
            restoreMainPosition,
            250
          );
        }
      );

    } else {

      hardResetToHeroTop();

      requestAnimationFrame(
        hardResetToHeroTop
      );
    }

  } else if (guestName && !guestSide) {

    if (guestGate) {
      guestGate.style.display = "flex";
    }

    document.body.classList.add("gate-open");

    hardResetToHeroTop();

    showSideStep();

  } else {

    showNameStep();
  }


  /* CHANGE GUEST */

  changeGuest?.addEventListener(
    "click",
    function () {

      storageRemove(NAME_KEY);
      storageRemove(SIDE_KEY);

      guestName = "";
      guestSide = "";

      if (nameInput) {
        nameInput.value = "";
      }

      showNameStep();
    }
  );


  /* =======================================================
     ENTER CELEBRATION
  ======================================================= */

  $("#enterCelebration")?.addEventListener(
    "click",
    function () {

      $("#intro")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  );


  /* =======================================================
     COUNTDOWN
  ======================================================= */

  const weddingDate =
    new Date("2026-11-21T10:30:00+05:30");


  const dailyMessages = [

    "Fifty days. Plenty of time to pretend the outfit is already sorted.",

    "Forty-nine days. Somewhere, a family WhatsApp group has started warming up.",

    "Forty-eight days. The wedding is officially close enough to mention in every conversation.",

    "Forty-seven days. Still enough time to say you'll shop next weekend.",

    "Forty-six days. Outfit confidence remains suspiciously high.",

    "Forty-five days. The countdown has become mildly threatening.",

    "Forty-four days. You may now begin asking everyone else what they're wearing.",

    "Forty-three days. “I'll figure it out” remains technically available.",

    "Forty-two days. Six weeks sounded much further away.",

    "Forty-one days. Your calendar would like to remind you this is actually happening.",

    "Forty days. Nice round number. Absolutely no reason to panic.",

    "Thirty-nine days. If tailoring is involved, procrastination is becoming a strategy.",

    "Thirty-eight days. Pinterest boards are becoming operational documents.",

    "Thirty-seven days. Someone already has three outfits and a backup.",

    "Thirty-six days. “I'll order it online” is becoming increasingly adventurous.",

    "Thirty-five days. Five weeks. Future-you has started judging present-you.",

    "Thirty-four days. This website remains calmer than the people organising the wedding.",

    "Thirty-three days. Still time. We repeat: still time.",

    "Thirty-two days. Approximately 4,000 wedding photos are approaching.",

    "Thirty-one days. The word “soon” is now legally accurate.",

    "Thirty days. ONE MONTH. Please locate your wedding clothes.",

    "Twenty-nine days. Less than a month. That sentence was intentionally alarming.",

    "Twenty-eight days. Somewhere, a tailor just sensed a disturbance.",

    "Twenty-seven days. Start breaking in the shoes you claimed were comfortable.",

    "Twenty-six days. Ironing everything on the wedding morning is not a plan.",

    "Twenty-five days. Halfway from fifty. Things are getting suspiciously real.",

    "Twenty-four days. The phrase “I'll sort it later” is losing credibility.",

    "Twenty-three days. Family group-chat activity is expected to increase sharply.",

    "Twenty-two days. If your outfit says “out for delivery,” we wish you strength.",

    "Twenty-one days. Three weeks. Serious calendar territory.",

    "Twenty days. Chennai is about to become considerably better dressed.",

    "Nineteen days. Begin practising the family-photo smile.",

    "Eighteen days. Somewhere, an aunty has started asking who is arriving when.",

    "Seventeen days. Your suitcase can no longer remain theoretical.",

    "Sixteen days. “I'll do it later” has officially been discontinued.",

    "Fifteen days. Locate jewellery, shoes, chargers and patience.",

    "Fourteen days. TWO WEEKS. This is not a drill.",

    "Thirteen days. The final fortnight has begun. Good luck to everyone involved.",

    "Twelve days. No outfit yet? Your confidence is inspiring.",

    "Eleven days. We're now counting with rocket-launch intensity.",

    "Ten days. SINGLE DIGITS TOMORROW.",

    "Nine days. Single digits. Casual behaviour is no longer authorised.",

    "Eight days. One week and one bonus day. Chennai, prepare yourself.",

    "Seven days. ONE WEEK. We hope you know where your clothes are.",

    "Six days. “Next weekend” has become dangerously relevant.",

    "Five days. Wedding machinery is operating at full Indian-family capacity.",

    "Four days. If you've forgotten something, now would be a lovely time to remember it.",

    "Three days. Suitcases. Chargers. Clothes. Sanity. Check.",

    "Two days. We are officially entering chaos mode.",

    "One day. TOMORROW. We hope you're more prepared than this website."

  ];


  const hourlyMessages = [

    "48 hours. Everyone remain calm. Nobody is going to do that.",

    "47 hours. The wedding is closer than your next sensible life decision.",

    "46 hours. Somewhere, somebody is asking where the safety pins are.",

    "45 hours. Every phone call now begins with “small thing.”",

    "44 hours. Empty suitcase? We admire the confidence.",

    "43 hours. Family WhatsApp groups are approaching maximum capacity.",

    "42 hours. Confirm that you actually know where MGM Beach Resort is.",

    "41 hours. Somebody has asked what time everyone is leaving. Nobody knows.",

    "40 hours. The spreadsheet people are thriving.",

    "39 hours. The non-spreadsheet people are pretending everything is fine.",

    "38 hours. Charge your phone. There will be photos. Many photos.",

    "37 hours. Somewhere, an outfit is being altered at dangerous speed.",

    "36 hours. Tomorrow-adjacent territory.",

    "35 hours. Have you packed? That pause was concerning.",

    "34 hours. Someone is saying “we'll leave on time” without evidence.",

    "33 hours. Incoming calls are increasing. Allegedly normal.",

    "32 hours. Reminder: ECR traffic is not fictional.",

    "31 hours. Time is now being measured in ceremonies and outfit changes.",

    "30 hours. Enough time to sleep. Whether anyone does is another matter.",

    "29 hours. Somebody's mother has already told them to leave earlier.",

    "28 hours. Logistics have reached air-traffic-control complexity.",

    "27 hours. Forgot something? Decide whether you truly needed it.",

    "26 hours. “Where are you?” will soon become the official greeting.",

    "25 hours. One hour until the dramatic 24-hour announcement.",

    "24 hours. TOMORROW. Procrastination privileges have been revoked.",

    "23 hours. If you're still shopping, we have questions.",

    "22 hours. Somewhere, someone is steaming an outfit and regretting everything.",

    "21 hours. The countdown has stopped being cute.",

    "20 hours. Please begin moving toward preparedness.",

    "19 hours. Even the website is checking whether you're ready.",

    "18 hours. Alarms are being set. Some will later be ignored.",

    "17 hours. We hope the outfit fits. Awful time to discover otherwise.",

    "16 hours. Chennai is warming up. Literally and metaphorically.",

    "15 hours. Someone packed everything except the thing they actually need.",

    "14 hours. Sleep is becoming an ambitious proposal.",

    "13 hours. The calm before the extremely well-dressed storm.",

    "12 hours. TWELVE HOURS. Capital-letter territory.",

    "11 hours. Future-you would appreciate it if you went to bed.",

    "10 hours. If you're reading this at an unreasonable hour, that's between you and your decisions.",

    "9 hours. The wedding is basically loading.",

    "8 hours. Coffee is becoming a strategic resource.",

    "7 hours. Someone's alarm is preparing to ruin their morning.",

    "6 hours. Good morning to everyone except whoever stayed up too late.",

    "5 hours. The getting-ready Olympics have begun.",

    "4 hours. Hair. Clothes. Jewellery. Phone. Dignity. Let's move.",

    "3 hours. If you're not getting ready, we'd love to hear the strategy.",

    "2 hours. Please stop reading this website and start moving.",

    "1 hour. WHY ARE YOU STILL HERE? GO GET READY."

  ];


  function getCountdownMessage(diff) {

    const hour =
      60 * 60 * 1000;

    const day =
      24 * hour;


    if (diff <= 0) {
      return (
        "It's wedding time. Stop scrolling. Come say hi."
      );
    }


    const hoursLeft =
      Math.ceil(diff / hour);

    const daysLeft =
      Math.ceil(diff / day);


    if (hoursLeft <= 48) {

      const index =
        Math.max(
          0,
          Math.min(
            47,
            48 - hoursLeft
          )
        );

      return hourlyMessages[index];
    }


    if (daysLeft <= 50) {

      const index =
        Math.max(
          0,
          Math.min(
            49,
            50 - daysLeft
          )
        );

      return dailyMessages[index];
    }


    return (
      "The outfits have time. The group chats do not need to panic yet."
    );
  }


  function updateCountdown() {

    const now = new Date();

    const diff =
      weddingDate.getTime() -
      now.getTime();


    const daysElement = $("#days");
    const hoursElement = $("#hours");
    const minutesElement = $("#minutes");
    const secondsElement = $("#seconds");
    const messageElement = $("#countdownMessage");


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


  /* =======================================================
     REVEAL ANIMATION
  ======================================================= */

  const revealElements =
    $$(".reveal");


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (entry.isIntersecting) {

                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );

        },
        {
          threshold: 0.08
        }
      );


    revealElements.forEach(
      function (element) {
        observer.observe(element);
      }
    );

  } else {

    revealElements.forEach(
      function (element) {

        element.classList.add(
          "visible"
        );
      }
    );
  }


  /* =======================================================
     OUR STORY
  ======================================================= */

  const storyScroller =
    $("#storyScroller");

  const storyCards =
    $$(".story-card");

  const storyDots =
    $("#storyDots");

  const dotElements = [];


  if (
    storyScroller &&
    storyDots &&
    storyCards.length
  ) {

    storyCards.forEach(
      function (card, index) {

        const dot =
          document.createElement(
            "button"
          );


        dot.type = "button";

        dot.className =
          "story-dot";


        dot.setAttribute(
          "aria-label",
          `Story ${index + 1}`
        );


        if (index === 0) {
          dot.classList.add(
            "active"
          );
        }


        dot.addEventListener(
          "click",
          function () {

            card.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center"
            });
          }
        );


        storyDots.appendChild(dot);

        dotElements.push(dot);
      }
    );


    function updateStoryDots() {

      const center =
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
              center - cardCenter
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


      dotElements.forEach(
        function (dot, index) {

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


  /* =======================================================
     COUPLE QUIZ
     NO RIGHT OR WRONG ANSWERS
  ======================================================= */

  const quizQuestions = [

    "Who is more likely to say “I'm ready” while clearly not being ready?",

    "Who is more likely to remember exactly what you said three years ago?",

    "Who is more likely to turn a quick errand into a full itinerary?",

    "Who is more likely to create the spreadsheet?",

    "Who is more likely to start dancing first?",

    "Who is more likely to insist they know the route while Google Maps is already open?",

    "Who is more likely to say “I'm not hungry” and then immediately reconsider?",

    "Who is more likely to make a five-minute decision require a forty-minute discussion?",

    "Who is more likely to befriend a complete stranger while waiting somewhere?",

    "Who is more likely to say “keep it simple” immediately before making it more elaborate?"

  ];


  function shuffle(array) {

    const copy =
      [...array];


    for (
      let index =
        copy.length - 1;

      index > 0;

      index--
    ) {

      const randomIndex =
        Math.floor(
          Math.random() *
          (index + 1)
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


  let quizSet = [];

  let quizIndex = 0;

  let quizLocked = false;


  let votes = {
    nikhil: 0,
    supriya: 0,
    both: 0
  };


  const quizStart =
    $("#quizStart");

  const quizGame =
    $("#quizGame");

  const quizResult =
    $("#quizResult");

  const startQuiz =
    $("#startQuiz");

  const restartQuiz =
    $("#restartQuiz");

  const quizProgress =
    $("#quizProgress");

  const quizScore =
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


  function beginQuiz() {

    quizSet =
      shuffle(
        quizQuestions
      ).slice(0, 6);


    quizIndex = 0;

    quizLocked = false;


    votes = {
      nikhil: 0,
      supriya: 0,
      both: 0
    };


    quizStart?.classList.add(
      "hidden"
    );

    quizResult?.classList.add(
      "hidden"
    );

    quizGame?.classList.remove(
      "hidden"
    );


    renderQuiz();
  }


  function renderQuiz() {

    if (
      quizIndex >=
      quizSet.length
    ) {

      finishQuiz();

      return;
    }


    quizLocked = false;


    if (quizProgress) {
      quizProgress.textContent =
        `${quizIndex + 1} / 6`;
    }


    if (quizScore) {
      quizScore.textContent =
        `ACCUSATION · ${quizIndex + 1}`;
    }


    if (quizQuestion) {
      quizQuestion.textContent =
        quizSet[quizIndex];
    }


    if (quizReaction) {
      quizReaction.textContent =
        "";
    }


    if (!quizOptions) {
      return;
    }


    quizOptions.innerHTML = "";


    const options = [

      {
        label: "Nikhil",
        value: "nikhil"
      },

      {
        label: "Supriya",
        value: "supriya"
      },

      {
        label: "Both. Obviously.",
        value: "both"
      }

    ];


    options.forEach(
      function (option) {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";

        button.className =
          "quiz-option";

        button.textContent =
          option.label;


        button.addEventListener(
          "click",
          function () {

            if (quizLocked) {
              return;
            }


            quizLocked = true;

            votes[
              option.value
            ]++;


            if (
              option.value ===
              "nikhil"
            ) {

              quizReaction.textContent =
                "A confident Nikhil accusation. Filed without comment.";

            } else if (
              option.value ===
              "supriya"
            ) {

              quizReaction.textContent =
                "Supriya gets the vote. The official record has been updated.";

            } else {

              quizReaction.textContent =
                "Diplomatic answer. Strong wedding-survival instincts.";
            }


            button.style.background =
              "#49332d";

            button.style.color =
              "#ffffff";


            setTimeout(
              function () {

                quizIndex++;

                renderQuiz();

              },
              750
            );
          }
        );


        quizOptions.appendChild(
          button
        );
      }
    );
  }


  function finishQuiz() {

    quizGame?.classList.add(
      "hidden"
    );

    quizResult?.classList.remove(
      "hidden"
    );


    const name =
      firstName(guestName);


    const highest =
      Math.max(
        votes.nikhil,
        votes.supriya,
        votes.both
      );


    const leaders =
      Object.keys(
        votes
      ).filter(
        function (key) {

          return (
            votes[key] ===
            highest
          );
        }
      );


    if (
      leaders.length > 1
    ) {

      if (quizResultTitle) {
        quizResultTitle.textContent =
          `${name}, perfectly balanced.`;
      }


      if (quizResultText) {
        quizResultText.textContent =
          "Six questions and you still refused to establish a clear pattern. Excellent diplomatic instincts.";
      }

      return;
    }


    if (
      leaders[0] ===
      "nikhil"
    ) {

      if (quizResultTitle) {
        quizResultTitle.textContent =
          `${name}, you kept pointing at Nikhil.`;
      }


      if (quizResultText) {
        quizResultText.textContent =
          "We are not confirming or denying anything. Your voting record has been noted.";
      }

      return;
    }


    if (
      leaders[0] ===
      "supriya"
    ) {

      if (quizResultTitle) {
        quizResultTitle.textContent =
          `${name}, Supriya received most of your accusations.`;
      }


      if (quizResultText) {
        quizResultText.textContent =
          "Interesting. Very interesting. This information may or may not be used against you at the wedding.";
      }

      return;
    }


    if (quizResultTitle) {
      quizResultTitle.textContent =
        `${name}, diplomacy wins.`;
    }


    if (quizResultText) {
      quizResultText.textContent =
        "You spent six questions blaming both of them equally. Probably the safest possible strategy.";
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


  /* =======================================================
     CALENDAR
  ======================================================= */

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

      details:
        "Nikhil & Supriya · Engagement · 21 November 2026 · 10:30 AM"
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

      details:
        "Nikhil & Supriya · Reception · 21 November 2026 · 6:00 PM"
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

      details:
        "Nikhil & Supriya · Muhurtham · 22 November 2026 · 8:30–10:00 AM"
    }

  };


  function escapeICS(value) {

    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");
  }


  function buildCalendar(keys) {

    const lines = [

      "BEGIN:VCALENDAR",

      "VERSION:2.0",

      "PRODID:-//Nikhil and Supriya Wedding//EN",

      "CALSCALE:GREGORIAN",

      "METHOD:PUBLISH"

    ];


    keys.forEach(
      function (key) {

        const event =
          calendarEvents[key];


        if (!event) {
          return;
        }


        lines.push(
          "BEGIN:VEVENT",

          `UID:${key}-2026@supnik.in`,

          `DTSTAMP:${event.start}`,

          `DTSTART:${event.start}`,

          `DTEND:${event.end}`,

          `SUMMARY:${escapeICS(event.title)}`,

          `LOCATION:${escapeICS(event.location)}`,

          `DESCRIPTION:${escapeICS(event.details)}`,

          "STATUS:CONFIRMED",

          "END:VEVENT"
        );
      }
    );


    lines.push(
      "END:VCALENDAR"
    );


    return lines.join(
      "\r\n"
    );
  }


  function googleCalendarUrl(key) {

    const event =
      calendarEvents[key];


    if (!event) {
      return "";
    }


    const params =
      new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        dates:
          `${event.start}/${event.end}`,
        details: event.details,
        location: event.location,
        ctz: "Asia/Kolkata"
      });


    return (
      "https://calendar.google.com/calendar/render?" +
      params.toString()
    );
  }


  function openSingleCalendar(key) {

    if (!calendarEvents[key]) {
      return;
    }


    logActivity(
      `calendar_added | ${key}`
    );


    const url =
      googleCalendarUrl(key);


    const opened =
      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );


    if (!opened) {
      window.location.href = url;
    }
  }


  function downloadAllCalendar() {

    const blob =
      new Blob(
        [
          buildCalendar([
            "engagement",
            "reception",
            "muhurtham"
          ])
        ],
        {
          type:
            "text/calendar;charset=utf-8"
        }
      );


    logActivity(
      "calendar_added | all"
    );


    downloadBlob(
      blob,
      "Nikhil-Supriya-Wedding.ics"
    );
  }


  $$("[data-calendar]").forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          openSingleCalendar(
            button.dataset.calendar
          );
        }
      );
    }
  );


  $("#addAllCalendar")?.addEventListener(
    "click",
    downloadAllCalendar
  );


  /* =======================================================
     BLR × CHENNAI
  ======================================================= */

  $("#blrChnLink")?.addEventListener(
    "click",
    function () {

      sessionSet(
        BLR_SCROLL_KEY,
        String(window.scrollY)
      );

      sessionRemove(
        BLR_RETURN_KEY
      );

      logActivity(
        "blr_opened"
      );
    }
  );


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navLinks =
    $$(".nav-link");


  navLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const href =
            link.getAttribute(
              "href"
            );


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
            behavior: "smooth",
            block: "start"
          });
        }
      );
    }
  );


  const navSections = [

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


  function updateNavigation() {

    const position =
      window.scrollY +
      window.innerHeight *
      0.4;


    let active =
      "home";


    navSections.forEach(
      function (section) {

        const element =
          document.getElementById(
            section.id
          );


        if (
          element &&
          element.offsetTop <=
          position
        ) {

          active =
            section.nav;
        }
      }
    );


    navLinks.forEach(
      function (link) {

        link.classList.toggle(
          "active",
          link.dataset.nav ===
          active
        );
      }
    );
  }


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const backToTop =
    $("#backToTop");


  function updateBackToTop() {

    backToTop?.classList.toggle(
      "visible",
      window.scrollY > 650
    );
  }


  backToTop?.addEventListener(
    "click",
    function () {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );


  window.addEventListener(
    "scroll",
    function () {

      updateNavigation();

      updateBackToTop();

    },
    {
      passive: true
    }
  );


  updateNavigation();

  updateBackToTop();


  /* =======================================================
     SECRET EASTER EGG
  ======================================================= */

  let secretClicks = 0;

  let secretReset;


  $("#secretTrigger")?.addEventListener(
    "click",
    function () {

      secretClicks++;


      clearTimeout(
        secretReset
      );


      secretReset =
        setTimeout(
          function () {

            secretClicks = 0;

          },
          1800
        );


      if (
        secretClicks < 5
      ) {
        return;
      }


      secretClicks = 0;


      $(".secret-toast")?.remove();


      const toast =
        document.createElement(
          "div"
        );


      toast.className =
        "secret-toast";


      const title =
        document.createElement(
          "strong"
        );


      title.textContent =
        "You found the secret.";


      const message =
        document.createElement(
          "span"
        );


      message.textContent =
        "There is no prize. We spent the budget on the wedding.";


      toast.appendChild(
        title
      );

      toast.appendChild(
        message
      );


      document.body.appendChild(
        toast
      );


      setTimeout(
        function () {

          toast.remove();

        },
        3500
      );
    }
  );


  /* =======================================================
     PERSONALISED INVITATION MODAL
  ======================================================= */

  const inviteModal =
    $("#inviteModal");

  const inviteFloat =
    $("#inviteFloat");

  let inviteScrollPosition = 0;


  function openInvite() {

    if (!inviteModal) {
      return;
    }


    inviteScrollPosition =
      window.scrollY;


    applyPersonalisation();


    inviteModal.classList.add(
      "open"
    );


    inviteModal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "invite-open"
    );
  }


  function closeInvite() {

    if (!inviteModal) {
      return;
    }


    inviteModal.classList.remove(
      "open"
    );


    inviteModal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "invite-open"
    );


    /*
      Put guest exactly back where they were.
    */

    window.scrollTo({
      top: inviteScrollPosition,
      left: 0,
      behavior: "auto"
    });
  }


  inviteFloat?.addEventListener(
    "click",
    openInvite
  );


  $$("[data-invite-close]").forEach(
    function (element) {

      element.addEventListener(
        "click",
        closeInvite
      );
    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        inviteModal?.classList.contains(
          "open"
        )
      ) {

        closeInvite();
      }
    }
  );


  /* =======================================================
     INVITATION IMAGE HELPERS
  ======================================================= */

  function loadImage(source) {

    return new Promise(
      function (resolve, reject) {

        const image =
          new Image();


        image.onload =
          function () {

            resolve(image);
          };


        image.onerror =
          function () {

            reject(
              new Error(
                `Unable to load ${source}`
              )
            );
          };


        image.src =
          source;
      }
    );
  }


  function coverImage(
    context,
    image,
    x,
    y,
    width,
    height
  ) {

    const imageRatio =
      image.width /
      image.height;


    const targetRatio =
      width /
      height;


    let sourceWidth;
    let sourceHeight;
    let sourceX;
    let sourceY;


    if (
      imageRatio >
      targetRatio
    ) {

      sourceHeight =
        image.height;

      sourceWidth =
        sourceHeight *
        targetRatio;

      sourceX =
        (
          image.width -
          sourceWidth
        ) / 2;

      sourceY = 0;

    } else {

      sourceWidth =
        image.width;

      sourceHeight =
        sourceWidth /
        targetRatio;

      sourceX = 0;

      sourceY =
        (
          image.height -
          sourceHeight
        ) / 2;
    }


    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );
  }


  function fitCanvasText(
    context,
    text,
    maxWidth,
    startSize,
    minimumSize,
    fontFamily,
    weight
  ) {

    let size =
      startSize;


    while (
      size >
      minimumSize
    ) {

      context.font =
        `${weight} ${size}px ${fontFamily}`;


      if (
        context.measureText(text)
          .width <=
        maxWidth
      ) {

        break;
      }


      size -= 2;
    }


    return size;
  }


  function canvasLine(
    context,
    x1,
    y1,
    x2,
    y2,
    colour,
    width
  ) {

    context.beginPath();

    context.moveTo(
      x1,
      y1
    );

    context.lineTo(
      x2,
      y2
    );

    context.strokeStyle =
      colour;

    context.lineWidth =
      width;

    context.stroke();
  }


  function drawOrnament(
    context,
    centreX,
    centreY
  ) {

    context.save();

    context.translate(
      centreX,
      centreY
    );


    context.strokeStyle =
      "#b68a4b";

    context.fillStyle =
      "#b68a4b";

    context.lineWidth = 3;


    canvasLine(
      context,
      -115,
      0,
      -35,
      0,
      "#b68a4b",
      2
    );


    canvasLine(
      context,
      35,
      0,
      115,
      0,
      "#b68a4b",
      2
    );


    context.beginPath();

    context.arc(
      0,
      0,
      9,
      0,
      Math.PI * 2
    );

    context.fill();


    context.beginPath();

    context.arc(
      -24,
      0,
      4,
      0,
      Math.PI * 2
    );

    context.fill();


    context.beginPath();

    context.arc(
      24,
      0,
      4,
      0,
      Math.PI * 2
    );

    context.fill();


    context.restore();
  }


  function drawEventBlock(
    context,
    number,
    title,
    date,
    time,
    place,
    x,
    y
  ) {

    context.textAlign =
      "left";


    context.fillStyle =
      "#b68a4b";

    context.font =
      '500 30px "Cinzel", Georgia, serif';

    context.fillText(
      number,
      x,
      y
    );


    context.fillStyle =
      "#49332d";

    context.font =
      '600 42px "Cinzel", Georgia, serif';

    context.fillText(
      title,
      x,
      y + 62
    );


    context.fillStyle =
      "#806860";

    context.font =
      '600 23px "Manrope", Arial, sans-serif';

    context.fillText(
      date,
      x,
      y + 110
    );


    context.fillStyle =
      "#49332d";

    context.font =
      '700 25px "Manrope", Arial, sans-serif';

    context.fillText(
      time,
      x,
      y + 151
    );


    context.fillStyle =
      "#8a736b";

    context.font =
      '500 22px "Manrope", Arial, sans-serif';

    context.fillText(
      place,
      x,
      y + 190
    );
  }


  /* =======================================================
     GENERATE THE COOL FRIENDS INVITE
     1800 × 2400 JPG
  ======================================================= */

  async function createInviteImage() {

    const saveButton =
      $("#saveInvite");


    const originalButtonText =
      saveButton?.textContent;


    if (saveButton) {

      saveButton.disabled =
        true;

      saveButton.textContent =
        "MAKING IT PRETTY...";
    }


    try {

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }


      const [
        templeImage,
        coastImage
      ] =
        await Promise.all([
          loadImage(
            "./images/hero-temple.png"
          ),
          loadImage(
            "./images/venue-coast.png"
          )
        ]);


      const canvas =
        document.createElement(
          "canvas"
        );


      canvas.width =
        1800;

      canvas.height =
        2400;


      const context =
        canvas.getContext(
          "2d"
        );


      if (!context) {
        throw new Error(
          "Canvas is not available."
        );
      }


      /*
        BASE
      */

      context.fillStyle =
        "#fffaf5";

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      /*
        TOP TEMPLE ARTWORK
      */

      coverImage(
        context,
        templeImage,
        0,
        0,
        1800,
        880
      );


      const templeGradient =
        context.createLinearGradient(
          0,
          0,
          0,
          950
        );


      templeGradient.addColorStop(
        0,
        "rgba(255,250,245,0.05)"
      );

      templeGradient.addColorStop(
        0.48,
        "rgba(255,248,241,0.50)"
      );

      templeGradient.addColorStop(
        1,
        "#fffaf5"
      );


      context.fillStyle =
        templeGradient;

      context.fillRect(
        0,
        0,
        1800,
        980
      );


      /*
        COASTAL BOTTOM
      */

      coverImage(
        context,
        coastImage,
        0,
        1780,
        1800,
        620
      );


      const coastGradient =
        context.createLinearGradient(
          0,
          1720,
          0,
          2400
        );


      coastGradient.addColorStop(
        0,
        "#fffaf5"
      );

      coastGradient.addColorStop(
        0.25,
        "rgba(255,250,245,0.72)"
      );

      coastGradient.addColorStop(
        1,
        "rgba(48,29,23,0.34)"
      );


      context.fillStyle =
        coastGradient;

      context.fillRect(
        0,
        1700,
        1800,
        700
      );


      /*
        OUTER POSTER BORDER
      */

      context.strokeStyle =
        "rgba(164,119,62,0.72)";

      context.lineWidth =
        3;


      context.strokeRect(
        65,
        65,
        1670,
        2270
      );


      context.strokeStyle =
        "rgba(164,119,62,0.30)";

      context.lineWidth =
        1;


      context.strokeRect(
        83,
        83,
        1634,
        2234
      );


      /*
        MONOGRAM
      */

      context.beginPath();

      context.arc(
        900,
        245,
        77,
        0,
        Math.PI * 2
      );


      context.fillStyle =
        "rgba(255,250,245,0.76)";

      context.fill();


      context.strokeStyle =
        "#a4773e";

      context.lineWidth =
        3;

      context.stroke();


      context.fillStyle =
        "#49332d";

      context.textAlign =
        "center";

      context.textBaseline =
        "middle";

      context.font =
        '500 34px "Cinzel", Georgia, serif';


      context.fillText(
        "N & S",
        900,
        248
      );


      /*
        KICKER
      */

      context.textBaseline =
        "alphabetic";


      context.fillStyle =
        "#a4773e";

      context.font =
        '700 24px "Manrope", Arial, sans-serif';


      context.fillText(
        "THE WEDDING OF",
        900,
        385
      );


      /*
        NAMES
      */

      context.fillStyle =
        "#49332d";

      context.font =
        '600 125px "Cinzel", Georgia, serif';


      context.fillText(
        "NIKHIL",
        900,
        525
      );


      context.fillStyle =
        "#a4773e";

      context.font =
        '400 52px "Cinzel", Georgia, serif';


      context.fillText(
        "&",
        900,
        602
      );


      context.fillStyle =
        "#49332d";

      context.font =
        '600 125px "Cinzel", Georgia, serif';


      context.fillText(
        "SUPRIYA",
        900,
        728
      );


      drawOrnament(
        context,
        900,
        810
      );


      /*
        PERSONALISED GUEST LINE
      */

      const displayGuest =
        firstName(guestName)
          .toUpperCase();


      const guestLine =
        `${displayGuest}, YOU'RE ON THE LIST.`;


      const guestFontSize =
        fitCanvasText(
          context,
          guestLine,
          1400,
          70,
          42,
          '"Cinzel", Georgia, serif',
          600
        );


      context.font =
        `600 ${guestFontSize}px "Cinzel", Georgia, serif`;


      context.fillStyle =
        "#49332d";


      context.fillText(
        guestLine,
        900,
        940
      );


      context.fillStyle =
        "#8a736b";

      context.font =
        '500 25px "Manrope", Arial, sans-serif';


      context.fillText(
        "THIS ONE IS OFFICIALLY YOURS.",
        900,
        997
      );


      /*
        DATE
      */

      context.fillStyle =
        "#a4773e";

      context.font =
        '500 53px "Cinzel", Georgia, serif';


      context.fillText(
        "21 — 22 NOVEMBER 2026",
        900,
        1100
      );


      context.fillStyle =
        "#684b42";

      context.font =
        '700 25px "Manrope", Arial, sans-serif';


      context.fillText(
        "MGM BEACH RESORT · ECR · CHENNAI",
        900,
        1155
      );


      /*
        EVENTS
      */

      canvasLine(
        context,
        235,
        1230,
        1565,
        1230,
        "rgba(164,119,62,0.30)",
        2
      );


      drawEventBlock(
        context,
        "01",
        "ENGAGEMENT",
        "21 NOVEMBER",
        "10:30 AM",
        "LAKE LAWN",
        250,
        1310
      );


      drawEventBlock(
        context,
        "02",
        "RECEPTION",
        "21 NOVEMBER",
        "6:00 PM",
        "LAKE LAWN",
        720,
        1310
      );


      drawEventBlock(
        context,
        "03",
        "MUHURTHAM",
        "22 NOVEMBER",
        "8:30 – 10:00 AM",
        "PALM BEACH LAWN",
        1190,
        1310
      );


      /*
        LOWER EDITORIAL STATEMENT
      */

      drawOrnament(
        context,
        900,
        1590
      );


      context.textAlign =
        "center";


      context.fillStyle =
        "#49332d";

      context.font =
        '500 51px "Cinzel", Georgia, serif';


      context.fillText(
        "TWO FAMILIES.",
        900,
        1685
      );


      context.fillText(
        "TWO CITIES.",
        900,
        1747
      );


      context.fillStyle =
        "#a4773e";

      context.font =
        '600 58px "Cinzel", Georgia, serif';


      context.fillText(
        "ONE CELEBRATION.",
        900,
        1820
      );


      /*
        BOTTOM COASTAL CAPTION
      */

      context.fillStyle =
        "#fffaf5";

      context.font =
        '700 23px "Manrope", Arial, sans-serif';


      context.fillText(
        "SEE YOU BY THE SEA.",
        900,
        2200
      );


      context.font =
        '500 20px "Manrope", Arial, sans-serif';


      context.fillText(
        "MGM BEACH RESORT · ECR · CHENNAI",
        900,
        2248
      );


      /*
        JPG
      */

      const blob =
        await new Promise(
          function (resolve) {

            canvas.toBlob(
              resolve,
              "image/jpeg",
              0.96
            );
          }
        );


      if (!blob) {
        throw new Error(
          "Invitation could not be generated."
        );
      }


      const filename =
        `Nikhil-Supriya-Invitation-${safeFilename(firstName(guestName))}.jpg`;


      /*
        MOBILE SHARE SHEET WHEN AVAILABLE.
        OTHERWISE NORMAL DOWNLOAD.
      */

      const file =
        new File(
          [blob],
          filename,
          {
            type: "image/jpeg"
          }
        );


      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file]
        })
      ) {

        try {

          await navigator.share({
            files: [file],
            title:
              "Nikhil & Supriya",
            text:
              "21–22 November 2026 · MGM Beach Resort · ECR Chennai"
          });


          logActivity(
            "invite_saved"
          );

        } catch (shareError) {

          /*
            If guest simply closes Share,
            don't force a second download.
          */

          if (
            shareError?.name !==
            "AbortError"
          ) {

            downloadBlob(
              blob,
              filename
            );


            logActivity(
              "invite_saved"
            );
          }
        }

      } else {

        downloadBlob(
          blob,
          filename
        );


        logActivity(
          "invite_saved"
        );
      }


    } catch (error) {

      console.error(
        "Invite generation failed:",
        error
      );


      alert(
        "Your invite could not be generated just now. Please try again."
      );

    } finally {

      if (saveButton) {

        saveButton.disabled =
          false;

        saveButton.textContent =
          originalButtonText ||
          "SAVE MY INVITE ↓";
      }
    }
  }


  $("#saveInvite")?.addEventListener(
    "click",
    createInviteImage
  );


  /* =======================================================
     FINAL PERSONALISATION
  ======================================================= */

  applyPersonalisation();

});

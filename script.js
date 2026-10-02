/* =========================================================
   NIKHIL + SUPRIYA
   WEDDING WEBSITE — SCRIPT.JS
   21–22 NOVEMBER 2026
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. HELPERS
     ========================================================= */

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const weddingDate = new Date("2026-11-21T10:30:00+05:30");


  /* =========================================================
     2. ENTER THE CELEBRATION
     ========================================================= */

  const enterButton = $("#enterCelebration");

  if (enterButton) {
    enterButton.addEventListener("click", () => {
      const target =
        $("#intro") ||
        $(".save-date-section") ||
        $("#story");

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }


  /* =========================================================
     3. COUNTDOWN
     ========================================================= */

  const daysEl = $("#days");
  const hoursEl = $("#hours");
  const minutesEl = $("#minutes");
  const secondsEl = $("#seconds");

  const countdownMessage =
    $("#countdownMessage") ||
    $(".countdown-message");

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  const normalCountdownLines = [
    "Plenty of time. Nobody panic. Especially Nikhil.",
    "The wedding is approaching at a socially acceptable speed.",
    "Still enough time to pretend everything is completely under control.",
    "Somewhere, somebody has just remembered one more thing for the wedding.",
    "The countdown continues. The family WhatsApp groups remain undefeated.",
    "Time is moving. The to-do list has chosen not to.",
    "Another day closer to Chennai, flowers, food and organised chaos.",
    "We have entered the 'that sounds like a problem for future us' phase.",
    "Current status: excited, organised-ish, and absolutely fine.",
    "One day closer to everyone asking Nikhil the same five questions.",
    "Supriya has a plan. Nikhil has confidence. Together, this should work.",
    "The wedding is getting closer. So is everyone's unsolicited advice.",
    "There is still time to practise saying, 'Yes, everything is sorted.'",
    "Preparations continue. Opinions continue faster.",
    "Another day gone. Somehow there are now more things on the list.",
    "The sea is ready. Chennai is ready. We are... getting there.",
    "Friendly reminder: this is a wedding, not a military operation. Allegedly.",
    "The countdown is shrinking. The guest list somehow is not.",
    "At this point, caffeine counts as wedding planning.",
    "We checked. November is still coming."
  ];

  const finalWeekLines = [
    "ONE WEEK. This has officially stopped being a future problem.",
    "Less than a week. Everybody act natural.",
    "The bags should probably be packed now. Probably.",
    "We are now measuring time in outfits, phone calls and mild panic.",
    "If anyone needs us, please submit a ticket after the wedding.",
    "Chennai loading. Patience no longer available.",
    "This is your reminder to charge your phone and bring your dancing confidence."
  ];

  function getCountdownMessage(diff, days, hours) {
    if (diff <= 0) {
      return "IT'S WEDDING TIME. Stop reading this and come celebrate.";
    }

    const totalHours = diff / (1000 * 60 * 60);

    // LAST 48 HOURS
    if (totalHours <= 48) {
      if (totalHours <= 6) {
        return "THIS IS NOT A DRILL. If you are not ready now, just come anyway.";
      }

      if (totalHours <= 12) {
        return "Under 12 hours. Nikhil is no longer accepting new problems.";
      }

      if (totalHours <= 24) {
        return "TOMORROW. Sleep is now optional. Looking good is not.";
      }

      if (totalHours <= 36) {
        return "We are inside 36 hours. Please direct all panic to someone else.";
      }

      return "48 HOURS. Whatever is not done now has officially become 'part of the charm.'";
    }

    // FINAL WEEK
    if (days <= 7) {
      return finalWeekLines[Math.min(7 - days, finalWeekLines.length - 1)];
    }

    // Deterministic daily rotating joke
    const dayIndex = Math.abs(
      Math.floor(Date.now() / 86400000)
    ) % normalCountdownLines.length;

    return normalCountdownLines[dayIndex];
  }

  function updateCountdown() {
    if (!daysEl && !hoursEl && !minutesEl && !secondsEl) return;

    const now = new Date();
    let difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";

      if (countdownMessage) {
        countdownMessage.textContent =
          "IT'S WEDDING TIME. Stop reading this and come celebrate.";
      }

      return;
    }

    const days = Math.floor(difference / 86400000);
    difference %= 86400000;

    const hours = Math.floor(difference / 3600000);
    difference %= 3600000;

    const minutes = Math.floor(difference / 60000);
    difference %= 60000;

    const seconds = Math.floor(difference / 1000);

    if (daysEl) {
      daysEl.textContent =
        days < 100 ? pad(days) : String(days);
    }

    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    if (countdownMessage) {
      countdownMessage.textContent =
        getCountdownMessage(
          weddingDate.getTime() - now.getTime(),
          days,
          hours
        );
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =========================================================
     4. REVEAL ANIMATIONS
     ========================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
      element.classList.add("is-visible");
    });
  }


  /* =========================================================
     5. PICK A SIDE
     ========================================================= */

  const teamNikhil = $("#teamNikhil");
  const teamSupriya = $("#teamSupriya");
  const teamResponse = $("#teamResponse");

  let teamClicks = 0;

  const nikhilResponses = [
    "Team Nikhil. Bold choice. We respect the confidence.",
    "Nikhil has been informed. His confidence has increased unnecessarily.",
    "Another vote for Nikhil. Supriya would like to review the methodology.",
    "Team Nikhil is growing. Nobody tell him.",
    "Okay, that's enough. He's going to become unbearable."
  ];

  const supriyaResponses = [
    "Team Supriya. A statistically sensible decision.",
    "Supriya approves. Nikhil has requested a recount.",
    "Another one for Supriya. The evidence continues to mount.",
    "Team Supriya is looking suspiciously organised.",
    "At this point Nikhil would like to remind everyone this is his website too."
  ];

  function chooseTeam(team) {
    teamClicks++;

    const responses =
      team === "nikhil"
        ? nikhilResponses
        : supriyaResponses;

    const index = Math.min(
      teamClicks - 1,
      responses.length - 1
    );

    if (teamResponse) {
      teamResponse.textContent = responses[index];
      teamResponse.classList.add("show");

      setTimeout(() => {
        teamResponse.classList.remove("show");
      }, 2500);
    }

    if (teamNikhil) {
      teamNikhil.classList.toggle(
        "selected",
        team === "nikhil"
      );
    }

    if (teamSupriya) {
      teamSupriya.classList.toggle(
        "selected",
        team === "supriya"
      );
    }
  }

  if (teamNikhil) {
    teamNikhil.addEventListener("click", () =>
      chooseTeam("nikhil")
    );
  }

  if (teamSupriya) {
    teamSupriya.addEventListener("click", () =>
      chooseTeam("supriya")
    );
  }


  /* =========================================================
     6. OUR STORY — SIDEWAYS SCROLLER
     TEXT REMAINS INSIDE IMAGE
     ========================================================= */

  const storyScroller =
    $("#storyScroller") ||
    $(".story-scroller");

  const storyCards = storyScroller
    ? $$(".story-card", storyScroller)
    : [];

  const storyDotsContainer = $("#storyDots");

  let storyDots = [];

  if (
    storyScroller &&
    storyCards.length &&
    storyDotsContainer
  ) {
    storyDotsContainer.innerHTML = "";

    storyCards.forEach((card, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "story-dot";
      dot.setAttribute(
        "aria-label",
        `Go to story ${index + 1}`
      );

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      });

      storyDotsContainer.appendChild(dot);
    });

    storyDots = $$(".story-dot", storyDotsContainer);
  }

  function updateStoryCard() {
    if (!storyScroller || !storyCards.length) return;

    const scrollerBox =
      storyScroller.getBoundingClientRect();

    const scrollerCenter =
      scrollerBox.left + scrollerBox.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    storyCards.forEach((card, index) => {
      const cardBox = card.getBoundingClientRect();
      const cardCenter =
        cardBox.left + cardBox.width / 2;

      const distance = Math.abs(
        cardCenter - scrollerCenter
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    storyCards.forEach((card, index) => {
      card.classList.toggle(
        "active",
        index === closestIndex
      );
    });

    storyDots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === closestIndex
      );
    });
  }

  if (storyScroller) {
    storyScroller.addEventListener(
      "scroll",
      updateStoryCard,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateStoryCard
    );

    setTimeout(updateStoryCard, 150);
  }


  /* =========================================================
     7. COUPLE QUIZ
     "WHO IS MORE LIKELY TO..."
     ========================================================= */

  const quizStart = $("#quizStart");
  const startQuiz = $("#startQuiz");
  const quizGame = $("#quizGame");
  const quizProgress = $("#quizProgress");
  const quizScore = $("#quizScore");
  const quizQuestion = $("#quizQuestion");
  const quizOptions = $("#quizOptions");
  const quizReaction = $("#quizReaction");
  const quizResult = $("#quizResult");
  const quizResultTitle = $("#quizResultTitle");
  const quizResultText = $("#quizResultText");
  const restartQuiz = $("#restartQuiz");

  const quizBank = [
    {
      question:
        "Who is more likely to say “we’re leaving in five minutes” while still getting ready?",
      answer: "Nikhil",
      reaction:
        "Five minutes is a concept, not a legally binding commitment."
    },
    {
      question:
        "Who is more likely to remember the one tiny detail everybody else forgot?",
      answer: "Supriya",
      reaction:
        "There was a spreadsheet. Of course there was."
    },
    {
      question:
        "Who is more likely to order food and then steal from the other person's plate?",
      answer: "Supriya",
      reaction:
        "Apparently your food becomes community property after marriage."
    },
    {
      question:
        "Who is more likely to confidently take the wrong route and defend it?",
      answer: "Nikhil",
      reaction:
        "Not lost. Exploring an alternative route."
    },
    {
      question:
        "Who is more likely to say “don't buy anything” and then approve three more wedding purchases?",
      answer: "Nikhil",
      reaction:
        "Budget management, but make it emotional."
    },
    {
      question:
        "Who is more likely to actually know where the important document is?",
      answer: "Supriya",
      reaction:
        "Nikhil knows approximately which room it may exist in."
    },
    {
      question:
        "Who is more likely to fall asleep halfway through a movie they insisted on watching?",
      answer: "Nikhil",
      reaction:
        "The movie was excellent. Allegedly."
    },
    {
      question:
        "Who is more likely to win an argument using screenshots as evidence?",
      answer: "Supriya",
      reaction:
        "Exhibit A has entered the chat."
    },
    {
      question:
        "Who is more likely to make friends with a complete stranger at a wedding?",
      answer: "Nikhil",
      reaction:
        "By dessert, they will somehow know his entire life story."
    },
    {
      question:
        "Who is more likely to say “I'm not hungry” and then ask for a bite?",
      answer: "Supriya",
      reaction:
        "A bite. Followed by several legally distinct bites."
    },
    {
      question:
        "Who is more likely to turn a simple plan into a 14-step operation?",
      answer: "Supriya",
      reaction:
        "Step 15 is explaining why all 14 steps were necessary."
    },
    {
      question:
        "Who is more likely to start dancing first when the DJ finally gets it right?",
      answer: "Nikhil",
      reaction:
        "Confidence first. Rhythm to be reviewed separately."
    }
  ];

  let quizQuestions = [];
  let currentQuizIndex = 0;
  let score = 0;
  let answerLocked = false;

  function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [copy[i], copy[j]] = [
        copy[j],
        copy[i]
      ];
    }

    return copy;
  }

  function beginQuiz() {
    quizQuestions = shuffle(quizBank).slice(0, 6);

    currentQuizIndex = 0;
    score = 0;
    answerLocked = false;

    if (quizStart) {
      quizStart.hidden = true;
      quizStart.style.display = "none";
    }

    if (quizResult) {
      quizResult.hidden = true;
      quizResult.style.display = "none";
    }

    if (quizGame) {
      quizGame.hidden = false;
      quizGame.style.display = "";
    }

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    if (
      !quizQuestion ||
      !quizOptions ||
      !quizQuestions.length
    ) {
      return;
    }

    answerLocked = false;

    const item =
      quizQuestions[currentQuizIndex];

    if (quizProgress) {
      quizProgress.textContent =
        `${currentQuizIndex + 1} / ${quizQuestions.length}`;
    }

    if (quizScore) {
      quizScore.textContent =
        `${score} correct`;
    }

    quizQuestion.textContent =
      item.question;

    quizOptions.innerHTML = "";

    if (quizReaction) {
      quizReaction.textContent = "";
      quizReaction.classList.remove("show");
    }

    ["Nikhil", "Supriya"].forEach(name => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "quiz-option";
      button.textContent = name;

      button.addEventListener("click", () => {
        handleQuizAnswer(name, button);
      });

      quizOptions.appendChild(button);
    });
  }

  function handleQuizAnswer(choice, clickedButton) {
    if (answerLocked) return;

    answerLocked = true;

    const item =
      quizQuestions[currentQuizIndex];

    const correct =
      choice === item.answer;

    if (correct) {
      score++;
      clickedButton.classList.add("correct");
    } else {
      clickedButton.classList.add("wrong");

      $$(".quiz-option", quizOptions).forEach(
        button => {
          if (
            button.textContent.trim() ===
            item.answer
          ) {
            button.classList.add("correct");
          }
        }
      );
    }

    if (quizScore) {
      quizScore.textContent =
        `${score} correct`;
    }

    if (quizReaction) {
      quizReaction.textContent =
        `${correct ? "Correct. " : "Nope. "}${item.reaction}`;

      quizReaction.classList.add("show");
    }

    setTimeout(() => {
      currentQuizIndex++;

      if (
        currentQuizIndex <
        quizQuestions.length
      ) {
        renderQuizQuestion();
      } else {
        finishQuiz();
      }
    }, 1450);
  }

  function finishQuiz() {
    if (quizGame) {
      quizGame.hidden = true;
      quizGame.style.display = "none";
    }

    if (quizResult) {
      quizResult.hidden = false;
      quizResult.style.display = "";
    }

    let title;
    let text;

    if (score === 6) {
      title = "Suspiciously good.";
      text =
        "6/6. Either you know us extremely well or somebody leaked the answers.";
    } else if (score >= 4) {
      title = "Inner-circle behaviour.";
      text =
        `${score}/6. Strong performance. You may be trusted with moderately important wedding information.`;
    } else if (score >= 2) {
      title = "You know enough.";
      text =
        `${score}/6. Not terrible. Come to the wedding and conduct further research.`;
    } else {
      title = "Have we met?";
      text =
        `${score}/6. It's okay. The wedding is basically your orientation programme.`;
    }

    if (quizResultTitle) {
      quizResultTitle.textContent = title;
    }

    if (quizResultText) {
      quizResultText.textContent = text;
    }
  }

  if (startQuiz) {
    startQuiz.addEventListener(
      "click",
      beginQuiz
    );
  }

  if (restartQuiz) {
    restartQuiz.addEventListener(
      "click",
      beginQuiz
    );
  }


  /* =========================================================
     8. ADD EVENTS TO CALENDAR
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

  function escapeICS(value) {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function downloadCalendar(eventKey) {
    const event =
      calendarEvents[eventKey];

    if (!event) return;

    const now = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nikhil and Supriya//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${eventKey}-${Date.now()}@supnik.in`,
      `DTSTAMP:${now}`,
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `SUMMARY:${escapeICS(event.title)}`,
      `LOCATION:${escapeICS(event.location)}`,
      `DESCRIPTION:${escapeICS(event.description)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob(
      [ics],
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
      `${eventKey}-nikhil-supriya.ics`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  $$("[data-calendar]").forEach(button => {
    button.addEventListener("click", () => {
      downloadCalendar(
        button.dataset.calendar
      );
    });
  });


  /* =========================================================
     9. WEDDING HELP DESK
     ========================================================= */

  const helpStatus =
    $("#helpStatus") ||
    $("#emergencyStatus") ||
    $(".help-status");

  const helpReplies = {
    lost:
      "Excellent start. Open Maps, search MGM Beach Resort, ECR, Chennai, and follow the blue line like your dignity depends on it.",

    late:
      "Indian wedding protocol activated: arrive confidently and behave as though this was always the plan.",

    outfit:
      "Emergency ruling: wear the outfit. Add confidence. Nobody has time for a wardrobe tribunal now.",

    confused:
      "Perfect. You have understood the Indian wedding experience. Follow someone who looks like they know where they're going."
  };

  $$("[data-help]").forEach(button => {
    button.addEventListener("click", () => {
      const key =
        button.dataset.help;

      if (
        helpStatus &&
        helpReplies[key]
      ) {
        helpStatus.textContent =
          helpReplies[key];

        helpStatus.classList.add("show");
      }
    });
  });


  /* =========================================================
     10. RANDOM WEDDING LINE / WISDOM
     Only activates if the section still exists.
     ========================================================= */

  const wisdomText =
    $("#wisdomText");

  const wisdomButton =
    $("#wisdomButton");

  const wisdomLines = [
    "If someone says 'quick photo', clear the next twenty minutes.",
    "There is always room for dessert. This is not advice. It is policy.",
    "If you don't know what is happening, smile and follow the aunties.",
    "The correct number of wedding photos is apparently all of them.",
    "Never underestimate an Indian family's ability to create one more ceremony.",
    "If the DJ plays your song, all prior commitments are temporarily suspended.",
    "Comfortable shoes are not cowardice. They are strategy.",
    "At some point someone will ask when you're getting married. Redirect immediately.",
    "The buffet line is temporary. Regret is forever.",
    "Nobody remembers whether you arrived five minutes late. They remember whether you danced.",
    "When in doubt: eat first, ask questions later.",
    "The person carrying safety pins is the real VIP.",
    "If a relative says 'come, one photo', resistance is futile.",
    "Hydrate. Especially if your definition of hydration changes after 6 PM."
  ];

  let lastWisdom = -1;

  function showRandomWisdom() {
    if (!wisdomText) return;

    let index;

    do {
      index =
        Math.floor(
          Math.random() *
          wisdomLines.length
        );
    } while (
      index === lastWisdom &&
      wisdomLines.length > 1
    );

    lastWisdom = index;

    wisdomText.textContent =
      wisdomLines[index];
  }

  if (wisdomButton) {
    wisdomButton.addEventListener(
      "click",
      showRandomWisdom
    );
  }


  /* =========================================================
     11. SMOOTH NAVIGATION
     ========================================================= */

  const navLinks =
    $$(".floating-nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
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

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });


  /* =========================================================
     12. ACTIVE FLOATING NAV
     ========================================================= */

  const navSections = [
    {
      id: "home",
      element: $("#home")
    },
    {
      id: "story",
      element: $("#story")
    },
    {
      id: "events",
      element: $("#events")
    },
    {
      id: "venue",
      element: $("#venue")
    }
  ].filter(item => item.element);

  function setActiveNav(id) {
    navLinks.forEach(link => {
      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${id}`
      );
    });
  }

  if (
    "IntersectionObserver" in window &&
    navSections.length
  ) {
    const navObserver =
      new IntersectionObserver(
        entries => {
          const visible =
            entries
              .filter(
                entry =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (visible.length) {
            setActiveNav(
              visible[0].target.id
            );
          }
        },
        {
          threshold: [
            0.2,
            0.35,
            0.5,
            0.7
          ],
          rootMargin:
            "-15% 0px -55% 0px"
        }
      );

    navSections.forEach(item => {
      navObserver.observe(item.element);
    });
  }


  /* =========================================================
     13. BACK TO TOP
     ========================================================= */

  const backToTop =
    $("#backToTop") ||
    $(".back-to-top");

  function updateBackToTop() {
    if (!backToTop) return;

    const show =
      window.scrollY > 650;

    backToTop.classList.toggle(
      "show",
      show
    );
  }

  if (backToTop) {
    backToTop.addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );

    updateBackToTop();

    window.addEventListener(
      "scroll",
      updateBackToTop,
      { passive: true }
    );
  }


  /* =========================================================
     14. VENUE / GOOGLE MAPS
     ========================================================= */

  $$("[data-maps]").forEach(button => {
    button.addEventListener("click", event => {
      if (
        button.tagName.toLowerCase() === "a" &&
        button.getAttribute("href")
      ) {
        return;
      }

      event.preventDefault();

      window.open(
        "https://www.google.com/maps/search/?api=1&query=MGM+Beach+Resort+ECR+Chennai",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });


  /* =========================================================
     15. SECRET N&S EASTER EGG
     ========================================================= */

  const secretTrigger =
    $("#secretTrigger");

  let secretClicks = 0;
  let secretTimer;

  function createHeart() {
    const heart =
      document.createElement("span");

    heart.textContent =
      Math.random() > 0.5
        ? "♥"
        : "✦";

    heart.style.position = "fixed";
    heart.style.left =
      `${10 + Math.random() * 80}%`;

    heart.style.bottom = "-30px";
    heart.style.zIndex = "99999";
    heart.style.pointerEvents = "none";

    heart.style.fontSize =
      `${18 + Math.random() * 24}px`;

    heart.style.opacity = "0.85";

    heart.style.transition =
      "transform 2.8s ease-out, opacity 2.8s ease-out";

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform =
        `translateY(-${window.innerHeight * 0.75}px) rotate(${Math.random() * 120 - 60}deg)`;

      heart.style.opacity = "0";
    });

    setTimeout(() => {
      heart.remove();
    }, 3000);
  }

  if (secretTrigger) {
    secretTrigger.addEventListener(
      "click",
      () => {
        secretClicks++;

        clearTimeout(secretTimer);

        secretTimer = setTimeout(() => {
          secretClicks = 0;
        }, 1800);

        if (secretClicks >= 5) {
          secretClicks = 0;

          for (let i = 0; i < 24; i++) {
            setTimeout(
              createHeart,
              i * 75
            );
          }
        }
      }
    );
  }


  /* =========================================================
     16. EVENT CARD TOUCH FEEDBACK
     ========================================================= */

  $$(".event-card").forEach(card => {
    card.addEventListener(
      "touchstart",
      () => {
        card.classList.add(
          "touching"
        );
      },
      { passive: true }
    );

    card.addEventListener(
      "touchend",
      () => {
        setTimeout(() => {
          card.classList.remove(
            "touching"
          );
        }, 120);
      },
      { passive: true }
    );
  });


  /* =========================================================
     17. MOBILE STORY MOUSE/WHEEL SUPPORT
     Desktop trackpads can move story sideways naturally.
     ========================================================= */

  if (storyScroller) {
    storyScroller.addEventListener(
      "wheel",
      event => {
        const canScrollHorizontally =
          storyScroller.scrollWidth >
          storyScroller.clientWidth;

        if (!canScrollHorizontally) {
          return;
        }

        if (
          Math.abs(event.deltaY) >
          Math.abs(event.deltaX)
        ) {
          storyScroller.scrollLeft +=
            event.deltaY * 0.75;
        }
      },
      {
        passive: true
      }
    );
  }


  /* =========================================================
     18. INITIAL STATE
     ========================================================= */

  setActiveNav("home");
  updateStoryCard();

});

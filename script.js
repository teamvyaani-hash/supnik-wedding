// =========================================================
// SUPNIK.IN
// Nikhil & Supriya
// Interactive Wedding Website
// =========================================================


// =========================================================
// 1. ENTER THE CELEBRATION
// =========================================================

const enterButton = document.getElementById("enterButton");

if (enterButton) {
  enterButton.addEventListener("click", () => {
    const celebrationSection =
      document.getElementById("celebration");

    if (celebrationSection) {
      celebrationSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


// =========================================================
// 2. LIVE WEDDING COUNTDOWN
// 21 November 2026
// 10:30 AM India Standard Time
// =========================================================

const weddingDate =
  new Date("2026-11-21T10:30:00+05:30");


function updateCountdown() {

  const now = new Date();

  const difference =
    weddingDate.getTime() -
    now.getTime();


  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");


  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  if (difference <= 0) {

    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    return;
  }


  const days = Math.floor(
    difference /
    (1000 * 60 * 60 * 24)
  );


  const hours = Math.floor(
    (
      difference /
      (1000 * 60 * 60)
    ) % 24
  );


  const minutes = Math.floor(
    (
      difference /
      (1000 * 60)
    ) % 60
  );


  const seconds = Math.floor(
    (
      difference /
      1000
    ) % 60
  );


  daysElement.textContent =
    String(days).padStart(2, "0");


  hoursElement.textContent =
    String(hours).padStart(2, "0");


  minutesElement.textContent =
    String(minutes).padStart(2, "0");


  secondsElement.textContent =
    String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


// =========================================================
// 3. SCROLL REVEAL ANIMATIONS
// =========================================================

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

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
      threshold: 0.12,

      rootMargin:
        "0px 0px -30px 0px"
    }

  );


revealElements.forEach(
  (element) => {

    revealObserver.observe(element);

  }
);


// =========================================================
// 4. MOBILE NAVIGATION
// =========================================================

const navLinks =
  document.querySelectorAll(".nav-link");


const trackedSections = [

  document.getElementById("home"),

  document.getElementById("story"),

  document.getElementById("events"),

  document.getElementById("venue")

].filter(Boolean);


function updateNavigation() {

  const position =
    window.scrollY +
    window.innerHeight * 0.42;


  let activeSection = "home";


  trackedSections.forEach(
    (section) => {

      if (
        section.offsetTop <= position
      ) {

        activeSection =
          section.id;

      }

    }
  );


  navLinks.forEach(
    (link) => {

      link.classList.remove(
        "active"
      );


      if (
        link.getAttribute("href") ===
        `#${activeSection}`
      ) {

        link.classList.add(
          "active"
        );

      }

    }
  );

}


navLinks.forEach(
  (link) => {

    link.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        const destination =
          document.querySelector(
            link.getAttribute("href")
          );


        if (destination) {

          destination.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }
);


window.addEventListener(
  "scroll",
  updateNavigation,
  { passive: true }
);


updateNavigation();


// =========================================================
// 5. HERO PARALLAX
// =========================================================

const heroImage =
  document.querySelector(
    ".hero-image"
  );


const heroContent =
  document.querySelector(
    ".hero-content"
  );


const leftLeaves =
  document.querySelector(
    ".hero-leaves-left"
  );


const rightLeaves =
  document.querySelector(
    ".hero-leaves-right"
  );


function updateHeroParallax() {

  const scroll =
    window.scrollY;


  const heroHeight =
    window.innerHeight;


  if (scroll > heroHeight) {
    return;
  }


  if (heroImage) {

    heroImage.style.marginTop =
      `${scroll * 0.11}px`;

  }


  if (heroContent) {

    heroContent.style.marginTop =
      `${scroll * 0.045}px`;

  }


  if (leftLeaves) {

    leftLeaves.style.marginBottom =
      `${scroll * 0.035}px`;

  }


  if (rightLeaves) {

    rightLeaves.style.marginBottom =
      `${scroll * 0.055}px`;

  }

}


window.addEventListener(
  "scroll",
  updateHeroParallax,
  { passive: true }
);


// =========================================================
// 6. STORY IMAGE PARALLAX
// =========================================================

const storyImages =
  document.querySelectorAll(
    ".story-image"
  );


function updateStoryParallax() {

  storyImages.forEach(
    (image) => {

      const box =
        image
          .parentElement
          .getBoundingClientRect();


      if (
        box.bottom > 0 &&
        box.top < window.innerHeight
      ) {

        const movement =
          (
            window.innerHeight / 2 -
            box.top
          ) * 0.015;


        image.style.objectPosition =
          `center calc(50% + ${movement}px)`;

      }

    }
  );

}


window.addEventListener(
  "scroll",
  updateStoryParallax,
  { passive: true }
);


// =========================================================
// 7. EVENT CARD TOUCH EFFECT
// =========================================================

const eventCards =
  document.querySelectorAll(
    ".event-card"
  );


eventCards.forEach(
  (card) => {

    card.addEventListener(
      "touchstart",
      () => {

        card.style.transform =
          "scale(0.985)";

      },
      { passive: true }
    );


    card.addEventListener(
      "touchend",
      () => {

        card.style.transform = "";

      },
      { passive: true }
    );

  }
);


// =========================================================
// 8. WEDDING WEEKEND CALENDAR
// =========================================================

const calendarButton =
  document.getElementById(
    "calendarButton"
  );


function downloadWeddingCalendar() {

  const calendarContent =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SUPNIK.IN//Nikhil and Supriya Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:nikhil-supriya-wedding-2026@supnik.in
DTSTAMP:20261001T000000Z
DTSTART:20261121T050000Z
DTEND:20261122T043000Z
SUMMARY:Nikhil & Supriya Wedding Weekend
LOCATION:MGM Beach Resort\\, ECR\\, Chennai\\, Tamil Nadu
DESCRIPTION:Join us for Nikhil & Supriya's wedding weekend.\\n\\nEngagement: Saturday 21 November 2026 at 10:30 AM - Lake Lawn\\nReception: Saturday 21 November 2026 at 6:00 PM - Lake Lawn\\nMuhurtham: Sunday 22 November 2026 from 8:30 AM to 10:00 AM - Palm Beach Lawn\\n\\nVenue: MGM Beach Resort\\, ECR\\, Chennai.
URL:https://supnik.in
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;


  const calendarBlob =
    new Blob(
      [calendarContent],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );


  const calendarUrl =
    URL.createObjectURL(
      calendarBlob
    );


  const downloadLink =
    document.createElement("a");


  downloadLink.href =
    calendarUrl;


  downloadLink.download =
    "Nikhil-Supriya-Wedding-Weekend.ics";


  document.body.appendChild(
    downloadLink
  );


  downloadLink.click();


  document.body.removeChild(
    downloadLink
  );


  setTimeout(
    () => {

      URL.revokeObjectURL(
        calendarUrl
      );

    },
    1000
  );

}


if (calendarButton) {

  calendarButton.addEventListener(
    "click",
    downloadWeddingCalendar
  );

}


// =========================================================
// 9. FLOATING JASMINE MOVEMENT
// =========================================================

const jasmineLeft =
  document.querySelector(
    ".floating-jasmine-left"
  );


const jasmineRight =
  document.querySelector(
    ".floating-jasmine-right"
  );


function moveFloatingFlowers() {

  const scroll =
    window.scrollY;


  if (jasmineLeft) {

    jasmineLeft.style.marginTop =
      `${scroll * 0.012}px`;

  }


  if (jasmineRight) {

    jasmineRight.style.marginTop =
      `${scroll * 0.017}px`;

  }

}


window.addEventListener(
  "scroll",
  moveFloatingFlowers,
  { passive: true }
);


// =========================================================
// 10. HIDE MOBILE NAV NEAR PAGE BOTTOM
// =========================================================

const mobileNav =
  document.querySelector(
    ".mobile-nav"
  );


function handleNavVisibility() {

  if (!mobileNav) {
    return;
  }


  const pageBottom =
    window.scrollY +
    window.innerHeight;


  const documentHeight =
    document.documentElement.scrollHeight;


  const distanceFromBottom =
    documentHeight -
    pageBottom;


  if (distanceFromBottom < 90) {

    mobileNav.style.opacity =
      "0";


    mobileNav.style.pointerEvents =
      "none";

  }

  else {

    mobileNav.style.opacity =
      "1";


    mobileNav.style.pointerEvents =
      "auto";

  }

}


window.addEventListener(
  "scroll",
  handleNavVisibility,
  { passive: true }
);


// =========================================================
// 11. PAGE LOAD
// =========================================================

window.addEventListener(
  "load",
  () => {

    document.body.classList.add(
      "loaded"
    );


    updateNavigation();

    updateHeroParallax();

    updateStoryParallax();

    handleNavVisibility();

  }
);

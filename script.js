const enterButton = document.getElementById("enterButton");

if (enterButton) {
  enterButton.addEventListener("click", () => {
    document.getElementById("celebration").scrollIntoView({
      behavior: "smooth"
    });
  });
}


// SCROLL REVEAL

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


// COUNTDOWN
// Starts 21 November 2026 at 10:30 AM IST

const weddingDate = new Date("2026-11-21T10:30:00+05:30");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

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
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
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

setInterval(updateCountdown, 1000);


// MOBILE NAVIGATION

const navLinks = document.querySelectorAll(".nav-link");

const sectionMap = [
  {
    section: document.getElementById("home")
  },
  {
    section: document.getElementById("story")
  },
  {
    section: document.getElementById("events")
  },
  {
    section: document.getElementById("venue")
  }
];

function setActiveNavigation() {
  const scrollPosition =
    window.scrollY + window.innerHeight * 0.4;

  let currentSection = "home";

  sectionMap.forEach((item) => {
    if (
      item.section &&
      item.section.offsetTop <= scrollPosition
    ) {
      currentSection = item.section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (
      link.getAttribute("href") ===
      `#${currentSection}`
    ) {
      link.classList.add("active");
    }
  });
}

window.addEventListener(
  "scroll",
  setActiveNavigation,
  { passive: true }
);

setActiveNavigation();


// SMOOTH NAVIGATION

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


// GENTLE HERO PARALLAX

const heroContent =
  document.querySelector(".hero-content");

const jasmineLeft =
  document.querySelector(".jasmine-left");

const jasmineRight =
  document.querySelector(".jasmine-right");

function updateParallax() {
  const scroll = window.scrollY;

  if (scroll < window.innerHeight) {
    if (heroContent) {
      heroContent.style.transform =
        `translateY(${scroll * 0.06}px)`;
    }

    if (jasmineLeft) {
      jasmineLeft.style.marginTop =
        `${scroll * 0.02}px`;
    }

    if (jasmineRight) {
      jasmineRight.style.marginTop =
        `${scroll * 0.03}px`;
    }
  }
}

window.addEventListener(
  "scroll",
  updateParallax,
  { passive: true }
);


// EVENT CARD TOUCH EFFECT

const eventCards =
  document.querySelectorAll(".event-card");

eventCards.forEach((card) => {
  card.addEventListener(
    "touchstart",
    () => {
      card.style.transform = "scale(0.985)";
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
});


// PAGE READY

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

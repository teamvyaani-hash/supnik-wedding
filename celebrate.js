
/*
  NIKHIL × SUPRIYA
  THE WEDDING PASS
  Single QR experience — IST only

  Event schedule:
  Engagement: 21 Nov 2026, 10:30 AM IST
  Reception:  21 Nov 2026, 6:00 PM IST
  Muhurtham:  22 Nov 2026, 8:30 AM IST
*/

(() => {
  "use strict";

  const CONFIG = {
    timezone: "Asia/Kolkata",

    events: {
      engagement: {
        name: "Engagement",
        subtitle: "The Beginning",
        date: "21 November 2026",
        time: "10:30 AM IST",
        venue: "Lake Lawn",
        startsAt: "2026-11-21T10:30:00+05:30",
        activeFrom: "2026-11-21T06:00:00+05:30"
      },

      reception: {
        name: "Reception",
        subtitle: "The Celebration",
        date: "21 November 2026",
        time: "6:00 PM IST",
        venue: "Lake Lawn",
        startsAt: "2026-11-21T18:00:00+05:30",
        activeFrom: "2026-11-21T17:00:00+05:30"
      },

      muhurtham: {
        name: "Muhurtham",
        subtitle: "The Forever",
        date: "22 November 2026",
        time: "8:30–10:00 AM IST",
        venue: "Palm Beach Lawn",
        startsAt: "2026-11-22T08:30:00+05:30",
        activeFrom: "2026-11-22T05:00:00+05:30"
      }
    },

    weddingEndsAt: "2026-11-22T23:59:59+05:30"
  };

  const STORAGE = {
    name: "nsGuestName",
    selectedEvent: "nsWeddingPassEvent"
  };

  const EVENT_ORDER = [
    "engagement",
    "reception",
    "muhurtham"
  ];

  const $ = selector => document.querySelector(selector);

  function readStorage(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }

  function cleanName(value) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30);
  }

  function getISTTime() {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: CONFIG.timezone,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(new Date());
  }

  function getAutomaticEvent() {
    const now = Date.now();

    if (now > Date.parse(CONFIG.weddingEndsAt)) {
      return "completed";
    }

    if (
      now >= Date.parse(
        CONFIG.events.muhurtham.activeFrom
      )
    ) {
      return "muhurtham";
    }

    if (
      now >= Date.parse(
        CONFIG.events.reception.activeFrom
      )
    ) {
      return "reception";
    }

    if (
      now >= Date.parse(
        CONFIG.events.engagement.activeFrom
      )
    ) {
      return "engagement";
    }

    return "upcoming";
  }

  function getSelectedEvent() {
    const selected = readStorage(STORAGE.selectedEvent);

    if (EVENT_ORDER.includes(selected)) {
      return selected;
    }

    const automatic = getAutomaticEvent();

    if (EVENT_ORDER.includes(automatic)) {
      return automatic;
    }

    return automatic === "completed"
      ? "muhurtham"
      : "engagement";
  }

  function setSelectedEvent(eventId) {
    if (!EVENT_ORDER.includes(eventId)) {
      return false;
    }

    writeStorage(STORAGE.selectedEvent, eventId);
    render();

    return true;
  }

  function clearEventOverride() {
    try {
      localStorage.removeItem(STORAGE.selectedEvent);
    } catch {}

    render();
  }

  function getGuestName() {
    return cleanName(readStorage(STORAGE.name));
  }

  function setGuestName(value) {
    const name = cleanName(value);

    if (!name) return false;

    writeStorage(STORAGE.name, name);
    render();

    return true;
  }

  function setText(selector, value) {
    const element = $(selector);

    if (element) {
      element.textContent = value;
    }
  }

  function setVisible(selector, visible) {
    const element = $(selector);

    if (element) {
      element.hidden = !visible;
    }
  }

  function renderEventSelector(selectedEvent) {
    document
      .querySelectorAll("[data-select-event]")
      .forEach(button => {
        const eventId =
          button.dataset.selectEvent;

        const selected =
          eventId === selectedEvent;

        button.classList.toggle(
          "is-selected",
          selected
        );

        button.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });
  }

  function render() {
    const automatic = getAutomaticEvent();
    const selected = getSelectedEvent();
    const event = CONFIG.events[selected];

    const guestName = getGuestName();

    setText(
      "[data-guest-name]",
      guestName
        ? guestName.split(" ")[0]
        : "Guest"
    );

    setText("[data-event-name]", event.name);
    setText("[data-event-subtitle]", event.subtitle);
    setText("[data-event-date]", event.date);
    setText("[data-event-time]", event.time);
    setText("[data-event-venue]", event.venue);

    setText("[data-ist-clock]", getISTTime());

    setText(
      "[data-event-status]",
      automatic === "upcoming"
        ? "The celebrations are almost here."
        : automatic === "completed"
          ? "Three celebrations. Countless memories."
          : automatic === selected
            ? "Happening today"
            : "Viewing another celebration"
    );

    document.body.dataset.event = selected;
    document.body.dataset.phase = automatic;

    renderEventSelector(selected);

    const receptionIsActive =
      automatic === "reception";

    setVisible(
      "[data-reception-only]",
      receptionIsActive
    );

    setVisible(
      "[data-guest-welcome]",
      Boolean(guestName)
    );

    setVisible(
      "[data-guest-entry]",
      !guestName
    );

    document.dispatchEvent(
      new CustomEvent("weddingpass:change", {
        detail: {
          selectedEvent: selected,
          automaticEvent: automatic,
          guestName: guestName,
          event: { ...event }
        }
      })
    );
  }

  function bindControls() {
    document
      .querySelectorAll("[data-select-event]")
      .forEach(button => {
        button.addEventListener("click", () => {
          setSelectedEvent(
            button.dataset.selectEvent
          );
        });
      });

    const automaticButton =
      $("[data-use-current-event]");

    if (automaticButton) {
      automaticButton.addEventListener(
        "click",
        clearEventOverride
      );
    }

    const nameForm = $("[data-guest-form]");

    if (nameForm) {
      nameForm.addEventListener(
        "submit",
        event => {
          event.preventDefault();

          const input =
            nameForm.querySelector(
              'input[name="guestName"]'
            );

          if (input) {
            setGuestName(input.value);
          }
        }
      );
    }

    const changeGuest =
      $("[data-change-guest]");

    if (changeGuest) {
      changeGuest.addEventListener(
        "click",
        () => {
          try {
            localStorage.removeItem(
              STORAGE.name
            );
          } catch {}

          render();
        }
      );
    }
  }

  function start() {
    bindControls();
    render();

    // Keep event mode and IST display current
    // while the page remains open.
    setInterval(render, 30000);
  }

  window.WeddingPass = Object.freeze({
    config: CONFIG,
    getAutomaticEvent,
    getSelectedEvent,
    setSelectedEvent,
    clearEventOverride,
    getGuestName,
    setGuestName,
    getISTTime
  });

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }
})();

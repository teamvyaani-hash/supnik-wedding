
/*
 SUPNIK Wedding WhatsApp Component
 Admin and family coordinators only.
 Requires the existing Wedding Control Center
 session token in sessionStorage.
*/

(function () {
  "use strict";

  const API = "/api/wedding-contacts";
  const CATEGORIES = [
    "Vendors",
    "Friends",
    "Family"
  ];

  let contacts = [];
  let vendors = [];
  let canManage = false;
  let initialized = false;

  const byId = id => document.getElementById(id);

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  function token() {
    return sessionStorage.getItem("wc_token") || "";
  }

  async function request(action, payload = {}) {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token()
      },
      body: JSON.stringify({
        action,
        ...payload
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Request failed."
      );
    }

    return data;
  }

  function normalizePhone(value) {
    const digits = String(value || "")
      .replace(/\D/g, "");

    if (digits.length === 10) {
      return "91" + digits;
    }

    if (
      digits.length >= 11 &&
      digits.length <= 15
    ) {
      return digits;
    }

    return "";
  }

  function currentCategory() {
    return byId("wcWaCategory").value;
  }

  function filteredContacts() {
    const category = currentCategory();

    if (category === "Vendors") {
      return vendors.map(person => ({
        id: person.id,
        name: person.name,
        phone: person.phone || "",
        category: "Vendors",
        notes: person.team || ""
      }));
    }

    return contacts.filter(
      person => person.category === category
    );
  }

  function renderRecipients() {
    const select = byId("wcWaRecipient");
    const list = filteredContacts();

    select.replaceChildren(
      new Option("Manual entry", "")
    );

    for (const person of list) {
      const description = person.notes
        ? " — " + person.notes
        : "";

      select.add(
        new Option(
          person.name + description,
          person.id
        )
      );
    }

    byId("wcWaCount").textContent =
      list.length + " saved contact(s)";
  }

  function selectRecipient() {
    const selected = byId("wcWaRecipient").value;
    const person = filteredContacts().find(
      item => item.id === selected
    );

    byId("wcWaName").value =
      person?.name || "";

    byId("wcWaPhone").value =
      person?.phone || "";

    generateMessage();
  }

  function generateMessage() {
    const name =
      byId("wcWaName").value.trim() || "there";

    const details =
      byId("wcWaDetails").value.trim();

    const category = currentCategory();
    const type = byId("wcWaType").value;

    const dashboard =
      "https://supnik.in/wedding-control.html";

    const templates = {
      reminder:
`Hi ${name},

A quick reminder regarding Nikhil and Supriya's wedding preparations.

${details || "Please review the pending arrangements."}

Kindly confirm once completed.

Thank you!`,

      deadline:
`Hi ${name},

Following up on an upcoming wedding deadline.

${details || "Please share a status update."}

Let us know if you need any assistance.

Thank you!`,

      urgent:
`Hi ${name},

IMPORTANT WEDDING UPDATE

${details || "Please contact the wedding coordinator as soon as possible."}

Kindly acknowledge this message.

Thank you!`,

      invitation:
`Hi ${name},

We would love to have you join us for Nikhil and Supriya's wedding!

21 & 22 November 2026
MGM Beach Resort, ECR, Chennai

Wedding invitation:
https://supnik.in

Looking forward to celebrating with you!`,

      custom:
`Hi ${name},

${details || "Sharing a quick update regarding the wedding."}

Thank you!`
    };

    let message = templates[type] || templates.custom;

    if (
      category === "Vendors" &&
      ["reminder", "deadline", "urgent"].includes(type)
    ) {
      message +=
        "\n\nWedding Control Center:\n" +
        dashboard;
    }

    byId("wcWaMessage").value = message;
  }

  function showStatus(message) {
    byId("wcWaStatus").textContent = message;
  }

  async function refreshContacts() {
    showStatus("Loading contacts...");

    const data = await request("list");

    contacts = data.contacts || [];
    vendors = data.vendors || [];
    canManage = data.canManage === true;

    byId("wcWaManage").hidden = !canManage;

    renderRecipients();
    showStatus("Contacts updated.");
  }

  async function saveContact(event) {
    event.preventDefault();

    if (!canManage) {
      showStatus("Administrator access required.");
      return;
    }

    const category =
      byId("wcWaSaveCategory").value;

    const name =
      byId("wcWaSaveName").value.trim();

    const phone =
      byId("wcWaSavePhone").value.trim();

    const notes =
      byId("wcWaSaveNotes").value.trim();

    try {
      await request("save", {
        category,
        name,
        phone,
        notes
      });

      byId("wcWaSaveForm").reset();

      await refreshContacts();

      byId("wcWaCategory").value = category;
      renderRecipients();

      showStatus("Contact saved successfully.");
    } catch (error) {
      showStatus(error.message);
    }
  }

  function openWhatsApp() {
    const phone = normalizePhone(
      byId("wcWaPhone").value
    );

    const message =
      byId("wcWaMessage").value.trim();

    if (!phone) {
      showStatus(
        "Enter a valid WhatsApp number."
      );
      return;
    }

    if (!message) {
      showStatus(
        "Generate or enter a message first."
      );
      return;
    }

    const url =
      "https://wa.me/" +
      phone +
      "?text=" +
      encodeURIComponent(message);

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    showStatus(
      "WhatsApp opened. Press Send in WhatsApp."
    );
  }

  function render(container) {
    container.innerHTML = `
      <section class="panel">
        <h2>WhatsApp Message Center</h2>

        <p class="muted">
          Message approved vendors, friends and family.
          Messages are not sent automatically.
        </p>

        <div class="grid">
          <label>
            Contact Category
            <select id="wcWaCategory">
              ${CATEGORIES.map(category => `
                <option value="${category}">
                  ${category}
                </option>
              `).join("")}
            </select>
          </label>

          <label>
            Saved Recipient
            <select id="wcWaRecipient">
              <option value="">
                Manual entry
              </option>
            </select>
          </label>
        </div>

        <p class="muted" id="wcWaCount"></p>

        <div class="grid">
          <label>
            Recipient Name
            <input id="wcWaName"
              maxlength="120"
              placeholder="Contact name">
          </label>

          <label>
            WhatsApp Number
            <input id="wcWaPhone"
              type="tel"
              placeholder="+91 9876543210">
          </label>
        </div>

        <div class="grid">
          <label>
            Message Type
            <select id="wcWaType">
              <option value="reminder">
                Reminder
              </option>
              <option value="deadline">
                Deadline Follow-Up
              </option>
              <option value="urgent">
                Urgent Update
              </option>
              <option value="invitation">
                Wedding Invitation
              </option>
              <option value="custom">
                Custom Message
              </option>
            </select>
          </label>

          <label>
            Task / Message Details
            <input id="wcWaDetails"
              maxlength="500"
              placeholder="What would you like to say?">
          </label>
        </div>

        <label>
          Message Preview
          <textarea id="wcWaMessage"
            style="min-height:230px"></textarea>
        </label>

        <div class="row"
          style="justify-content:flex-start">
          <button class="btn secondary"
            type="button"
            id="wcWaRefresh">
            Refresh Contacts
          </button>

          <button class="btn secondary"
            type="button"
            id="wcWaGenerate">
            Generate Message
          </button>

          <button class="btn"
            type="button"
            id="wcWaOpen"
            style="background:#21724f">
            Open WhatsApp
          </button>
        </div>

        <p class="muted"
          id="wcWaStatus"
          role="status"></p>
      </section>

      <section class="panel" id="wcWaManage"
        hidden>
        <h2>Add Friend or Family Contact</h2>

        <p class="muted">
          Administrator only. Family coordinators
          can use saved contacts but cannot edit them.
        </p>

        <form id="wcWaSaveForm">
          <div class="grid">
            <label>
              Category
              <select id="wcWaSaveCategory">
                <option value="Friends">
                  Friends
                </option>
                <option value="Family">
                  Family
                </option>
              </select>
            </label>

            <label>
              Full Name
              <input id="wcWaSaveName"
                maxlength="120" required>
            </label>

            <label>
              WhatsApp Number
              <input id="wcWaSavePhone"
                type="tel" required>
            </label>

            <label>
              Notes
              <input id="wcWaSaveNotes"
                maxlength="500"
                placeholder="Optional">
            </label>
          </div>

          <button class="btn" type="submit">
            Save Contact
          </button>
        </form>
      </section>
    `;

    byId("wcWaCategory").onchange = () => {
      renderRecipients();
      byId("wcWaName").value = "";
      byId("wcWaPhone").value = "";
      generateMessage();
    };

    byId("wcWaRecipient").onchange =
      selectRecipient;

    byId("wcWaType").onchange =
      generateMessage;

    byId("wcWaGenerate").onclick =
      generateMessage;

    byId("wcWaOpen").onclick =
      openWhatsApp;

    byId("wcWaRefresh").onclick =
      async () => {
        try {
          await refreshContacts();
        } catch (error) {
          showStatus(error.message);
        }
      };

    byId("wcWaSaveForm").onsubmit =
      saveContact;

    generateMessage();
  }

  async function init() {
    const container = byId("whatsappTab");

    if (!container) return;

    const role = window.weddingControlRole;

    if (
      role !== "admin" &&
      role !== "family"
    ) {
      container.hidden = true;
      return;
    }

    if (!initialized) {
      render(container);
      initialized = true;
    }

    try {
      await refreshContacts();
    } catch (error) {
      showStatus(error.message);
    }
  }

  window.WeddingWhatsApp = {
    init
  };
})();


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Photo Moderation | Nikhil & Supriya</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #101015;
      --panel: #1b1a21;
      --line: #38333b;
      --gold: #e9c993;
      --muted: #b7adb5;
      --text: #fff8f0;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
    }

    header {
      border-bottom: 1px solid var(--line);
      padding: 25px 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand {
      font-family: Georgia, serif;
      color: var(--gold);
      font-size: 23px;
    }

    .eyebrow {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    main {
      width: min(1200px, 92%);
      margin: 45px auto 80px;
    }

    h1 {
      font-family: Georgia, serif;
      font-weight: normal;
      font-size: clamp(32px, 5vw, 50px);
      margin: 8px 0;
    }

    p { color: var(--muted); }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 25px;
    }

    .login {
      max-width: 430px;
      margin: 80px auto;
    }

    input, select, button {
      font: inherit;
      border-radius: 10px;
      padding: 12px 14px;
    }

    input, select {
      background: #121116;
      color: white;
      border: 1px solid var(--line);
    }

    input { width: 100%; }

    button {
      cursor: pointer;
      border: 1px solid var(--line);
      background: #302a30;
      color: white;
    }

    button.primary {
      background: var(--gold);
      border-color: var(--gold);
      color: #171218;
      font-weight: 700;
    }

    button.approve {
      background: #214b36;
      border-color: #3d815a;
    }

    button.reject {
      background: #582c37;
      border-color: #a64d62;
    }

    button:disabled {
      opacity: .5;
      cursor: wait;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 25px 0;
    }

    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 25px 0;
    }

    .stat {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px 20px;
      min-width: 110px;
    }

    .stat strong {
      display: block;
      color: var(--gold);
      font-size: 25px;
    }

    .stat span {
      color: var(--muted);
      font-size: 12px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
      gap: 20px;
    }

    .photo {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
    }

    .photo img {
      width: 100%;
      height: 260px;
      object-fit: contain;
      background: #09090c;
      display: block;
    }

    .details { padding: 16px; }

    .guest {
      font-size: 17px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .meta {
      color: var(--muted);
      font-size: 13px;
      margin-top: 5px;
    }

    .status {
      display: inline-block;
      border: 1px solid var(--line);
      border-radius: 30px;
      padding: 4px 10px;
      font-size: 12px;
      margin-top: 10px;
      text-transform: capitalize;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 15px;
    }

    .actions button {
      flex: 1;
      font-size: 13px;
      padding: 10px 8px;
    }

    .message {
      margin: 14px 0;
      color: var(--gold);
      min-height: 22px;
    }

    .hidden { display: none !important; }

    .empty {
      text-align: center;
      padding: 50px 20px;
      color: var(--muted);
      border: 1px dashed var(--line);
      border-radius: 16px;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <div class="eyebrow">The Wedding Pass</div>
      <div class="brand">Nikhil & Supriya</div>
    </div>
    <button id="logout" class="hidden">Sign out</button>
  </header>

  <main>
    <section id="loginPanel" class="panel login">
      <div class="eyebrow">Private administration</div>
      <h1>Photo Moderation</h1>
      <p>Only Nikhil and Supriya should have access to this dashboard.</p>

      <form id="loginForm">
        <label for="password">Admin password</label>
        <input
          id="password"
          type="password"
          autocomplete="current-password"
          required
          style="margin:10px 0 15px"
        >
        <button class="primary" type="submit" style="width:100%">
          Unlock dashboard
        </button>
      </form>

      <div id="loginMessage" class="message" role="status"></div>
    </section>

    <section id="dashboard" class="hidden">
      <div class="eyebrow">Private gallery control</div>
      <h1>Through Your Eyes</h1>
      <p>Review guest submissions before they appear on the Wedding Wall.</p>

      <div class="stats">
        <div class="stat">
          <strong id="pendingCount">0</strong>
          <span>Pending</span>
        </div>
        <div class="stat">
          <strong id="approvedCount">0</strong>
          <span>Approved</span>
        </div>
        <div class="stat">
          <strong id="rejectedCount">0</strong>
          <span>Rejected</span>
        </div>
      </div>

      <div class="toolbar">
        <select id="eventFilter" aria-label="Filter event">
          <option value="all">All events</option>
          <option value="engagement">Engagement</option>
          <option value="reception">Reception</option>
          <option value="muhurtham">Muhurtham</option>
        </select>

        <select id="statusFilter" aria-label="Filter status">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All statuses</option>
        </select>

        <button id="refresh">Refresh photos</button>
      </div>

      <div id="dashboardMessage" class="message" role="status"></div>
      <div id="photos" class="grid"></div>
    </section>
  </main>

  <script>
    const API = "/api/admin-photos";
    const $ = id => document.getElementById(id);
    let photos = [];

    async function request(action, options = {}) {
      const response = await fetch(
        `${API}?action=${encodeURIComponent(action)}`,
        {
          credentials: "same-origin",
          cache: "no-store",
          ...options
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.error || "Request failed.");
        error.status = response.status;
        throw error;
      }

      return data;
    }

    function showLogin() {
      $("loginPanel").classList.remove("hidden");
      $("dashboard").classList.add("hidden");
      $("logout").classList.add("hidden");
      photos = [];
      $("photos").replaceChildren();
    }

    function showDashboard() {
      $("loginPanel").classList.add("hidden");
      $("dashboard").classList.remove("hidden");
      $("logout").classList.remove("hidden");
    }

    async function loadPhotos() {
      $("dashboardMessage").textContent = "Loading photos...";

      try {
        const data = await request("list");
        photos = Array.isArray(data.photos) ? data.photos : [];
        render();

        $("dashboardMessage").textContent = data.truncated
          ? "Showing a partial list. More than 1,000 records may exist."
          : `${photos.length} photo record(s) loaded.`;
      } catch (error) {
        if (error.status === 401) {
          showLogin();
          $("loginMessage").textContent = "Session expired. Please sign in.";
        } else {
          $("dashboardMessage").textContent = error.message;
        }
      }
    }

    function textElement(tag, className, text) {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = text;
      return element;
    }

    function render() {
      const counts = { pending: 0, approved: 0, rejected: 0 };

      photos.forEach(photo => {
        if (Object.hasOwn(counts, photo.status)) {
          counts[photo.status]++;
        }
      });

      $("pendingCount").textContent = counts.pending;
      $("approvedCount").textContent = counts.approved;
      $("rejectedCount").textContent = counts.rejected;

      const event = $("eventFilter").value;
      const status = $("statusFilter").value;

      const visible = photos.filter(photo =>
        (event === "all" || photo.event === event) &&
        (status === "all" || photo.status === status)
      );

      const container = $("photos");
      container.replaceChildren();

      if (!visible.length) {
        container.appendChild(
          textElement("div", "empty", "No photos match these filters.")
        );
        return;
      }

      for (const photo of visible) {
        const card = document.createElement("article");
        card.className = "photo";

        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = `Photo submitted by ${photo.guestName || "Guest"}`;
        img.src = `${API}?action=image&id=${encodeURIComponent(photo.uploadId)}`;

        const details = document.createElement("div");
        details.className = "details";

        details.appendChild(
          textElement("div", "guest", photo.guestName || "Guest")
        );

        details.appendChild(
          textElement(
            "div",
            "meta",
            `${photo.event} · ${
              photo.uploadedAt
                ? new Date(photo.uploadedAt).toLocaleString("en-IN")
                : "Date unavailable"
            }`
          )
        );

        details.appendChild(
          textElement("span", "status", photo.status)
        );

        const actions = document.createElement("div");
        actions.className = "actions";

        for (const [label, value, css] of [
          ["Approve", "approved", "approve"],
          ["Reject", "rejected", "reject"],
          ["Pending", "pending", ""]
        ]) {
          if (photo.status === value) continue;

          const button = document.createElement("button");
          button.textContent = label;
          button.className = css;
          button.addEventListener("click", async () => {
            button.disabled = true;
            $("dashboardMessage").textContent = `Saving ${label.toLowerCase()}...`;

            try {
              await request("moderate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: photo.uploadId,
                  status: value
                })
              });

              photo.status = value;
              render();
              $("dashboardMessage").textContent = `Photo marked ${value}.`;
            } catch (error) {
              $("dashboardMessage").textContent = error.message;
              button.disabled = false;
            }
          });

          actions.appendChild(button);
        }

        details.appendChild(actions);
        card.appendChild(img);
        card.appendChild(details);
        container.appendChild(card);
      }
    }

    $("loginForm").addEventListener("submit", async event => {
      event.preventDefault();
      $("loginMessage").textContent = "Signing in...";

      try {
        await request("login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: $("password").value })
        });

        $("password").value = "";
        $("loginMessage").textContent = "";
        showDashboard();
        await loadPhotos();
      } catch (error) {
        $("loginMessage").textContent = error.message;
      }
    });

    $("logout").addEventListener("click", async () => {
      try {
        await request("logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}"
        });
      } catch {}

      showLogin();
    });

    $("refresh").addEventListener("click", loadPhotos);
    $("eventFilter").addEventListener("change", render);
    $("statusFilter").addEventListener("change", render);

    (async () => {
      try {
        await request("session");
        showDashboard();
        await loadPhotos();
      } catch {
        showLogin();
      }
    })();
  </script>
</body>
</html>

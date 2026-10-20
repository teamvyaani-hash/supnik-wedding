
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#211b20">
<title>Reception Wall | Nikhil & Supriya</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
:root {
  --bg:#211b20;
  --panel:#352833;
  --dark:#2b222b;
  --gold:#e4b78c;
  --cream:#fff5e9;
  --muted:#cbb8c2;
  --border:rgba(255,245,233,.17);
}
* {box-sizing:border-box}
body {
  margin:0;
  background:var(--bg);
  color:var(--cream);
  font-family:Manrope,sans-serif;
}
main {
  width:min(100% - 30px,820px);
  margin:auto;
  padding:25px 0 75px;
}
a {color:var(--gold);font-size:12px}
h1,h2,h3 {
  font-family:Cinzel,serif;
  font-weight:500;
}
h1 {
  font-size:clamp(38px,9vw,62px);
  margin:15px 0;
}
.eyebrow {
  color:var(--gold);
  font-size:10px;
  letter-spacing:3px;
  font-weight:700;
  text-transform:uppercase;
}
.muted {
  color:var(--muted);
  font-size:12px;
  line-height:1.8;
}
.hero {
  text-align:center;
  padding:45px 0 20px;
}
.panel {
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:20px;
  padding:24px;
  margin:20px 0;
}
label {
  display:block;
  margin:16px 0 7px;
  font-size:12px;
  color:var(--muted);
}
input,textarea,select {
  width:100%;
  padding:14px;
  border:1px solid var(--border);
  border-radius:12px;
  background:var(--dark);
  color:var(--cream);
  font:inherit;
}
textarea {
  resize:vertical;
  min-height:125px;
}
button {
  width:100%;
  margin-top:18px;
  padding:16px;
  border:0;
  border-radius:12px;
  background:var(--gold);
  color:var(--bg);
  font:inherit;
  font-size:12px;
  font-weight:800;
  cursor:pointer;
}
button:disabled {opacity:.55}
.status {
  color:var(--gold);
  font-size:12px;
  line-height:1.8;
}
.wall {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:14px;
}
.message-card {
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:18px;
  padding:22px;
  overflow-wrap:anywhere;
}
.message-card .category {
  color:var(--gold);
  font-size:10px;
  font-weight:700;
  letter-spacing:1px;
  text-transform:uppercase;
}
.message-card p {
  font-size:14px;
  line-height:1.9;
  white-space:pre-wrap;
}
.message-card footer {
  color:var(--muted);
  font-size:11px;
}
.empty {
  grid-column:1/-1;
  text-align:center;
  color:var(--muted);
  padding:30px;
}
.honey {
  position:absolute;
  left:-9999px;
}
@media(max-width:560px) {
  .wall {grid-template-columns:1fr}
  .panel {padding:18px}
}
</style>
</head>

<body>
<main>

<a href="./party.html">← Reception Mode</a>

<header class="hero">
  <div class="eyebrow">
    NIKHIL × SUPRIYA · 21 NOVEMBER 2026
  </div>

  <h1>The Reception Wall</h1>

  <p class="muted">
    A little advice. A funny observation.
    A memory worth keeping.
    <br>
    Leave something for the newlyweds.
  </p>
</header>

<section class="panel">
  <div class="eyebrow">LEAVE YOUR MARK</div>
  <h2>What would you like to say?</h2>

  <form id="messageForm">
    <label for="guestName">Your name</label>
    <input
      id="guestName"
      required
      minlength="2"
      maxlength="35"
      placeholder="Your name"
    >

    <label for="category">Choose a category</label>
    <select id="category" required>
      <option value="wishes">Wishes for the Couple</option>
      <option value="advice">Marriage Survival Advice</option>
      <option value="funny">Funny Observations</option>
      <option value="memory">A Favourite Memory</option>
    </select>

    <label for="message">Your message</label>
    <textarea
      id="message"
      minlength="8"
      maxlength="500"
      required
      placeholder="Make us laugh, smile, or cry happy tears..."
    ></textarea>

    <div class="honey" aria-hidden="true">
      <label for="website">Website</label>
      <input id="website" tabindex="-1" autocomplete="off">
    </div>

    <button id="submitButton" type="submit">
      SEND YOUR MESSAGE →
    </button>

    <p class="muted">
      Messages are reviewed before appearing publicly.
      Please keep them respectful and suitable for all ages.
    </p>

    <p class="status" id="submitStatus" role="status"></p>
  </form>
</section>

<section>
  <div class="hero">
    <div class="eyebrow">FROM OUR GUESTS</div>
    <h2>Messages & Memories</h2>
    <p class="muted">
      A collection of love, laughter and wedding wisdom.
    </p>
  </div>

  <div class="wall" id="wall">
    <div class="empty">Loading messages...</div>
  </div>
  <p class="status" id="wallStatus" role="status"></p>
</section>

</main>

<script>
(() => {
  const API = "/api/reception-wall";
  const $ = id => document.getElementById(id);

  const labels = {
    wishes: "Wishes for the Couple",
    advice: "Marriage Survival Advice",
    funny: "Funny Observations",
    memory: "A Favourite Memory"
  };

  async function request(data) {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const raw = await response.text();
    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(result.error || "Request failed.");
    }

    return result;
  }

  async function loadWall() {
    try {
      const result = await request({ action: "public" });
      const wall = $("wall");
      wall.replaceChildren();

      if (!result.messages.length) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent =
          "No approved messages yet. Be the first to leave one!";
        wall.append(empty);
        return;
      }

      result.messages.forEach(item => {
        const card = document.createElement("article");
        card.className = "message-card";

        const category = document.createElement("div");
        category.className = "category";
        category.textContent =
          labels[item.category] || "Wedding Message";

        const message = document.createElement("p");
        message.textContent = item.message;

        const footer = document.createElement("footer");
        footer.textContent = "— " + item.name;

        card.append(category, message, footer);
        wall.append(card);
      });

      $("wallStatus").textContent = "";
    } catch (error) {
      $("wallStatus").textContent = error.message;
    }
  }

  $("messageForm").addEventListener("submit", async event => {
    event.preventDefault();

    const button = $("submitButton");
    button.disabled = true;
    $("submitStatus").textContent = "";

    try {
      const result = await request({
        action: "submit",
        name: $("guestName").value.trim(),
        category: $("category").value,
        message: $("message").value.trim(),
        website: $("website").value
      });

      $("submitStatus").textContent =
        result.message || "Submitted for approval.";

      $("message").value = "";
    } catch (error) {
      $("submitStatus").textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  loadWall();

  setInterval(() => {
    if (document.visibilityState === "visible") {
      loadWall();
    }
  }, 30000);
})();
</script>
</body>
</html>

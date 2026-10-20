
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Secret Missions | Nikhil & Supriya</title>
<style>
:root {
  --bg:#211b20;
  --panel:#352833;
  --gold:#e4b78c;
  --cream:#fff5e9;
  --muted:#cbb8c2;
  --line:#65515f;
}
* {box-sizing:border-box}
body {
  margin:0;
  background:var(--bg);
  color:var(--cream);
  font-family:system-ui,sans-serif;
}
main {
  width:min(92%,760px);
  margin:auto;
  padding:25px 0 70px;
}
a {color:var(--gold)}
h1,h2 {
  font-family:Georgia,serif;
  font-weight:normal;
}
h1 {
  font-size:clamp(38px,8vw,62px);
  margin:15px 0;
}
.eyebrow {
  font-size:11px;
  letter-spacing:3px;
  color:var(--gold);
}
.muted {
  color:var(--muted);
  line-height:1.7;
  font-size:14px;
}
.panel {
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:18px;
  padding:22px;
  margin:18px 0;
}
label {
  display:block;
  font-size:13px;
  margin:12px 0 7px;
}
input {
  width:100%;
  background:#211b20;
  color:var(--cream);
  border:1px solid var(--line);
  border-radius:10px;
  padding:13px;
  font:inherit;
}
button {
  cursor:pointer;
  border:0;
  border-radius:10px;
  background:var(--gold);
  color:#211b20;
  padding:13px 18px;
  font:inherit;
  font-weight:700;
}
button:disabled {
  opacity:.55;
  cursor:default;
}
.teams {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.teams button {
  background:#211b20;
  color:var(--cream);
  border:1px solid var(--line);
  padding:18px 8px;
}
.teams button.selected {
  border:2px solid var(--gold);
  background:#59413c;
}
.wide {
  width:100%;
  margin-top:15px;
}
.code {
  font-size:36px;
  letter-spacing:6px;
  color:var(--gold);
  font-weight:700;
}
.mission {
  border-top:1px solid var(--line);
  padding:18px 0;
}
.mission h3 {margin:0 0 8px}
.mission p {
  color:var(--muted);
  font-size:13px;
  line-height:1.7;
}
.points {
  color:var(--gold);
  font-size:12px;
}
.row {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.status {
  min-height:20px;
  font-size:13px;
  color:var(--gold);
}
.score {
  font-size:24px;
  color:var(--gold);
}
[hidden] {display:none!important}
small {color:var(--muted)}
</style>
</head>

<body>
<main>
<a href="./party.html">← Reception Mode</a>

<div style="text-align:center;margin:35px 0">
  <div class="eyebrow">
    NIKHIL × SUPRIYA · 21 NOVEMBER 2026
  </div>
  <h1>Secret Missions</h1>
  <p class="muted">
    Meet someone new. Exchange codes.
    Earn points for yourself and your city.
  </p>
</div>

<section class="panel" id="register">
  <h2>Join the Showdown</h2>
  <p class="muted">
    Choose your wedding side.
    Your personal code will appear after registration.
  </p>

  <form id="join">
    <label for="name">Your name</label>
    <input
      id="name"
      maxlength="30"
      minlength="2"
      required
      placeholder="Enter your name"
    >

    <label>Choose your team</label>
    <div class="teams">
      <button type="button" data-team="bangalore">
        Bangalore
        <small>Groom's side</small>
      </button>
      <button type="button" data-team="chennai">
        Chennai
        <small>Bride's side</small>
      </button>
    </div>

    <button class="wide" type="submit">
      GET MY GUEST CODE →
    </button>
  </form>
</section>

<section class="panel" id="profile" hidden>
  <div class="row">
    <div>
      <div class="eyebrow">YOUR PLAYER PASS</div>
      <h2 id="playerName"></h2>
      <p class="muted" id="playerTeam"></p>
    </div>
    <button id="switch" type="button">Change</button>
  </div>

  <p class="muted">
    Show this code to guests you meet.
    Avoid sharing it publicly online.
  </p>

  <div class="code" id="myCode"></div>
  <p>Your points: <strong id="myPoints">0</strong></p>
</section>

<section class="panel" id="missions" hidden>
  <h2>Your Missions</h2>
  <p class="muted">
    Complete a challenge with another guest,
    then enter their six-digit code.
    Each mission can earn points once.
  </p>
  <div id="missionList"></div>
</section>

<section class="panel">
  <h2>City Showdown</h2>

  <div class="teams">
    <div>
      <strong>Bangalore</strong>
      <div class="score" id="bangalore">—</div>
    </div>
    <div>
      <strong>Chennai</strong>
      <div class="score" id="chennai">—</div>
    </div>
  </div>

  <p class="muted">
    Scores currently show total points earned.
    Team-size-adjusted rankings can be added later.
  </p>

  <h2>Individual Leaders</h2>
  <div id="leaders" class="muted">
    Sign in to view the leaderboard.
  </div>
</section>

<p class="status" id="status"
   role="status" aria-live="polite"></p>

</main>

<script>
const API = '/api/reception';
const KEY = 'nsReceptionToken';

let token = localStorage.getItem(KEY) || '';
let team = '';

const $ = id => document.getElementById(id);

async function request(action, extra = {}) {
  const response = await fetch(API, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      action,
      token,
      ...extra
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw Error(result.error || 'Request failed');
  }

  return result;
}

function message(text) {
  $('status').textContent = text;
}

function display(result) {
  $('register').hidden = true;
  $('profile').hidden = false;
  $('missions').hidden = false;

  const player = result.player;

  $('playerName').textContent = player.name;
  $('playerTeam').textContent =
    player.team === 'bangalore'
      ? "Team Bangalore · Groom's Side"
      : "Team Chennai · Bride's Side";

  $('myCode').textContent = player.code;
  $('myPoints').textContent = player.points;

  const completed = new Set(result.completed || []);
  $('missionList').replaceChildren();

  for (const mission of result.missions) {
    const container = document.createElement('div');
    container.className = 'mission';

    const title = document.createElement('h3');
    title.textContent = mission.title;

    const description = document.createElement('p');
    description.textContent = mission.description;

    const points = document.createElement('p');
    points.className = 'points';
    points.textContent = `+${mission.points} points`;

    container.append(title, description, points);

    if (completed.has(mission.id)) {
      const done = document.createElement('strong');
      done.textContent = '✓ Completed';
      container.append(done);
    } else {
      const form = document.createElement('form');
      const label = document.createElement('label');
      label.textContent = "Other guest's six-digit code";

      const input = document.createElement('input');
      input.required = true;
      input.inputMode = 'numeric';
      input.pattern = '[0-9]{6}';
      input.maxLength = 6;
      input.placeholder = '123456';

      const button = document.createElement('button');
      button.textContent = 'VERIFY & CLAIM POINTS';
      button.className = 'wide';

      form.append(label, input, button);

      form.addEventListener('submit', async event => {
        event.preventDefault();
        button.disabled = true;

        try {
          await request('claim', {
            missionId: mission.id,
            partnerCode: input.value.trim()
          });

          message('Mission complete! Points awarded.');
          await refresh();
        } catch (error) {
          message(error.message);
        } finally {
          button.disabled = false;
        }
      });

      container.append(form);
    }

    $('missionList').append(container);
  }

  if (result.leaderboard) {
    $('bangalore').textContent =
      result.leaderboard.teams.bangalore;

    $('chennai').textContent =
      result.leaderboard.teams.chennai;

    $('leaders').replaceChildren();

    result.leaderboard.players.forEach((player, index) => {
      const line = document.createElement('p');

      line.textContent =
        `${index + 1}. ${player.name} · ` +
        `${player.team === 'bangalore'
          ? 'Bangalore' : 'Chennai'} · ` +
        `${player.points} pts`;

      $('leaders').append(line);
    });
  }
}

async function refresh() {
  if (!token) return;

  const result = await request('state');
  display(result);
}

document.querySelectorAll('[data-team]').forEach(button => {
  button.addEventListener('click', () => {
    team = button.dataset.team;

    document.querySelectorAll('[data-team]')
      .forEach(item => {
        item.classList.toggle(
          'selected',
          item === button
        );
      });
  });
});

$('join').addEventListener('submit', async event => {
  event.preventDefault();

  if (!team) {
    message('Please choose a team.');
    return;
  }

  const button = event.submitter;
  button.disabled = true;

  try {
    const result = await request('join', {
      name: $('name').value.trim(),
      team
    });

    token = result.token;
    localStorage.setItem(KEY, token);

    message('Welcome to the showdown!');
    await refresh();
  } catch (error) {
    message(error.message);
  } finally {
    button.disabled = false;
  }
});

$('switch').addEventListener('click', () => {
  if (!confirm(
    'Register a different player on this device? ' +
    'Your existing points will remain on the server.'
  )) return;

  localStorage.removeItem(KEY);
  token = '';

  $('profile').hidden = true;
  $('missions').hidden = true;
  $('register').hidden = false;

  message('');
});

if (token) {
  refresh().catch(error => {
    message(error.message);

    if (error.message.includes('Player not found')) {
      localStorage.removeItem(KEY);
      token = '';
      $('register').hidden = false;
    }
  });
}

setInterval(() => {
  if (token && document.visibilityState === 'visible') {
    refresh().catch(() => {});
  }
}, 30000);
</script>
</body>
</html>

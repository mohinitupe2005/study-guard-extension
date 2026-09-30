const toggleBtn = document.getElementById("toggle-btn");
const statusLabel = document.getElementById("status-label");
const timerEl = document.getElementById("timer");
const thoughtsList = document.getElementById("thoughts-list");
const statsEl = document.getElementById("stats");

let timerInterval = null;

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function startTimerDisplay(startTime) {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerEl.textContent = formatTime(Date.now() - startTime);
  }, 1000);
}

async function render() {
  const { sessionActive, startTime, thoughts = [], sessionCount = 0 } =
    await chrome.storage.local.get(["sessionActive", "startTime", "thoughts", "sessionCount"]);

  if (sessionActive) {
    statusLabel.textContent = "Focusing";
    statusLabel.classList.add("active");
    toggleBtn.textContent = "Stop Session";
    toggleBtn.classList.add("active");
    timerEl.textContent = formatTime(Date.now() - startTime);
    startTimerDisplay(startTime);
  } else {
    statusLabel.textContent = "Not focusing";
    statusLabel.classList.remove("active");
    toggleBtn.textContent = "Start Focus Session";
    toggleBtn.classList.remove("active");
    clearInterval(timerInterval);
    timerEl.textContent = "00:00";
  }

  // Render thoughts (most recent first)
  const pending = [...thoughts].reverse();
  if (pending.length === 0) {
    thoughtsList.innerHTML = `<li class="empty-state">Nothing captured yet. Good sign, or you haven't tried.</li>`;
  } else {
    thoughtsList.innerHTML = "";
    pending.forEach((t) => {
      const li = document.createElement("li");
      const time = new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      li.innerHTML = `
        <span class="text" style="${t.done ? "text-decoration:line-through;color:#64748b" : ""}">${escapeHtml(t.text)}</span>
        <span class="time">${time}</span>
        <button class="done-btn" data-id="${t.id}" title="Mark done">${t.done ? "↺" : "✓"}</button>
      `;
      thoughtsList.appendChild(li);
    });

    thoughtsList.querySelectorAll(".done-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const data = await chrome.storage.local.get("thoughts");
        const updated = (data.thoughts || []).map((t) =>
          t.id === id ? { ...t, done: !t.done } : t
        );
        await chrome.storage.local.set({ thoughts: updated });
        render();
      });
    });
  }

  statsEl.textContent = `${sessionCount} session${sessionCount === 1 ? "" : "s"} · ${thoughts.length} thought${thoughts.length === 1 ? "" : "s"} captured`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

toggleBtn.addEventListener("click", async () => {
  const { sessionActive, sessionCount = 0 } = await chrome.storage.local.get(["sessionActive", "sessionCount"]);

  if (sessionActive) {
    await chrome.storage.local.set({ sessionActive: false, startTime: null });
  } else {
    await chrome.storage.local.set({
      sessionActive: true,
      startTime: Date.now(),
      sessionCount: sessionCount + 1,
    });
  }
  render();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") render();
});

render();

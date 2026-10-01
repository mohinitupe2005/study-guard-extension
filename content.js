// ---- Sarcastic lines (static for V1 — swap for AI-generated later) ----
const SARCASM_LINES = [
  "Oh good, you're here. Your grades were getting too high anyway.",
  "\"Just 5 minutes,\" said everyone, right before losing 40.",
  "Wow, Instagram missed you! It's been a whole hr!!",
  "Your future self just felt a disturbance in the force.",
  "Bold move opening this during a focus session! Confidence is nice👍",
  "This is the same brain that said 'I'll start studying at 9 sharp.'",
  "The algorithm thanks you for your sacrifice",
  "Loading... your excuses, that is!",
  "You could've written a whole paragraph of notes in the time it took to open this.",
  "Ah yes, 'research.' Very academic of you.",
  "Somewhere, your syllabus just sighed.",
  "Plot twist: the internship doesn't apply to itself.",
  "This tab again? We meet like old, disappointing friends.",
  "Your focus session called... It wants a divorce.",
  "Quick reminder: scrolling is not a study technique, no matter how it feels.",
  "You have the willpower of a browser tab. Multiple, actually.",
  "Impressive reflexes — instantly redirected the moment things got hard.",
  "Let me guess, 'just checking one notification',right?",
  "Your exam is not going to be impressed by this!!",
  "10/10 timing...Truly the moment your brain needed a break from thinking.",
];

const DISTRACTING_HOSTS = [
  "instagram.com",
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "reddit.com",
];

function isDistractingSite() {
  return DISTRACTING_HOSTS.some((host) => window.location.hostname.includes(host));
}

function randomLine() {
  return SARCASM_LINES[Math.floor(Math.random() * SARCASM_LINES.length)];
}

//Sarcasm interstitial overlay
function showSarcasmOverlay() {
  if (document.getElementById("sg-sarcasm-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "sg-sarcasm-overlay";
  overlay.innerHTML = `
    <div class="sg-card">
      <div class="sg-emoji">🙃</div>
      <div class="sg-line">${randomLine()}</div>
      <div class="sg-buttons">
        <button id="sg-back-to-work">Yeah, you're right. Back to work.</button>
        <button id="sg-going-anyway">I'm going anyway</button>
      </div>
    </div>
  `;
  document.documentElement.appendChild(overlay);

  document.getElementById("sg-back-to-work").addEventListener("click", () => {
    logInterruption("back_to_work");
    window.history.back();
    overlay.remove();
  });

  document.getElementById("sg-going-anyway").addEventListener("click", () => {
    logInterruption("went_anyway");
    overlay.remove();
  });
}

async function logInterruption(choice) {
  const data = await chrome.storage.local.get("interruptions");
  const interruptions = data.interruptions || [];
  interruptions.push({
    site: window.location.hostname,
    choice,
    timestamp: Date.now(),
  });
  await chrome.storage.local.set({ interruptions });
}

//Quick-capture overlay
function showCaptureOverlay() {
  if (document.getElementById("sg-capture-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "sg-capture-overlay";
  overlay.innerHTML = `
    <div class="sg-capture-card">
      <div class="sg-capture-label">Capture the thought. Get back to work.</div>
      <input id="sg-capture-input" type="text" placeholder="e.g. apply for PhonePe internship" autocomplete="off" />
      <div class="sg-capture-hint">Enter to save · Esc to cancel</div>
    </div>
  `;
  document.documentElement.appendChild(overlay);

  const input = document.getElementById("sg-capture-input");
  input.focus();

  function close() {
    overlay.remove();
  }

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      await saveThought(input.value.trim());
      showConfirmation();
      close();
    } else if (e.key === "Escape") {
      close();
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

async function saveThought(text) {
  const data = await chrome.storage.local.get("thoughts");
  const thoughts = data.thoughts || [];
  thoughts.push({
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    done: false,
  });
  await chrome.storage.local.set({ thoughts });
}

function showConfirmation() {
  const toast = document.createElement("div");
  toast.id = "sg-toast";
  toast.textContent = "Got it. You'll see this when your session ends.";
  document.documentElement.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

// Message listener
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "OPEN_CAPTURE_OVERLAY") {
    showCaptureOverlay();
  }
});

//Check on page load whether this is a distracting site during an active session
(async function init() {
  if (!isDistractingSite()) return;
  const { sessionActive } = await chrome.storage.local.get("sessionActive");
  if (sessionActive) {
    showSarcasmOverlay();
  }
})();

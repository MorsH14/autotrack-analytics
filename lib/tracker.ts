// lib/tracker.ts
export function initTracker() {
  // --- Session ID ---
  let sessionId = sessionStorage.getItem("autotrack_sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("autotrack_sessionId", sessionId);
  }

  // --- Device detection ---
  const device = /Mobi|Android/i.test(navigator.userAgent)
    ? "mobile"
    : /Tablet|iPad/i.test(navigator.userAgent)
      ? "tablet"
      : "desktop";

  // --- Send event function ---
  function sendEvent(eventType: string, data: Record<string, any> = {}) {
    fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        url: window.location.href,
        sessionId,
        referrer: document.referrer,
        device,
        ...data,
      }),
    }).catch((err) => console.error("AutoTrack error:", err));
  }

  // --- Page view ---
  sendEvent("page_view");

  // --- Click tracking ---
  document.addEventListener("click", (e) => {
    const el = e.target as HTMLElement;
    sendEvent("click", {
      element: el.tagName + (el.id ? "#" + el.id : ""),
      text: el.innerText.slice(0, 50),
    });
  });

  // --- Duration tracking ---
  let startTime = Date.now();
  setInterval(() => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    sendEvent("duration", { duration });
  }, 30000);
}

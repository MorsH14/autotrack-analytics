(function () {
  var script = document.currentScript;
  if (!script) return;

  // Auto-detect API endpoint from script src URL
  var src = script.getAttribute("src");
  var endpoint;
  try {
    var url = new URL(src, window.location.origin);
    endpoint = url.origin + "/api/events";
  } catch (e) {
    endpoint = "/api/events";
  }

  // Session ID
  var sessionId = sessionStorage.getItem("autotrack_sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("autotrack_sessionId", sessionId);
  }

  // Device detection
  var ua = navigator.userAgent;
  var device = /Mobi|Android/i.test(ua) ? "mobile" : /Tablet|iPad/i.test(ua) ? "tablet" : "desktop";

  function sendEvent(eventType, data) {
    var payload = Object.assign(
      {
        eventType: eventType,
        url: window.location.href,
        sessionId: sessionId,
        referrer: document.referrer,
        device: device,
      },
      data || {}
    );
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(function (err) {
      console.error("AutoTrack error:", err);
    });
  }

  // Page view
  sendEvent("page_view");

  // Click tracking
  document.addEventListener("click", function (e) {
    var el = e.target;
    sendEvent("click", {
      element: el.tagName + (el.id ? "#" + el.id : ""),
      text: (el.innerText || "").slice(0, 50),
    });
  });

  // Duration tracking (every 30s)
  var startTime = Date.now();
  setInterval(function () {
    var duration = Math.floor((Date.now() - startTime) / 1000);
    sendEvent("duration", { duration: duration });
  }, 30000);
})();

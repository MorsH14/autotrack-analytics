# Event Model (v1)

AutoTrack is built around a simple event-based data model. Each interaction on a tracked website is represented as an event.

## Event Types
- page_view: triggered when a page loads
- click: triggered when a tracked element is clicked
- duration: triggered when a user leaves a page

## Core Fields
- eventType: type of interaction
- url: page where the event occurred
- referrer: previous page or source (optional)
- sessionId: anonymous identifier for a browsing session
- timestamp: time the event occurred
- device: basic device category

## Privacy Considerations
AutoTrack does not collect personal data, IP addresses, or use third-party cookies. The goal is to provide useful insights while respecting user privacy.

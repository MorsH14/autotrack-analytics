import { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  domain: { type: String, required: true },
  eventType: {
    type: String,
    enum: ["page_view", "click", "duration"],
    required: true,
  },
  url: { type: String, required: true },
  referrer: { type: String, default: "" },
  sessionId: { type: String, required: true },
  userAgent: { type: String, required: true },
  device: {
    type: String,
    enum: ["desktop", "mobile", "tablet"],
    default: "desktop",
  },
  element: { type: String, default: "" }, // clicked element tag + id
  text: { type: String, default: "" }, // clicked element text
  duration: { type: Number, default: 0 }, // seconds on page
  timestamp: { type: Date, default: Date.now },
});

EventSchema.index({ domain: 1, eventType: 1, timestamp: 1 });

export default models.Event || model("Event", EventSchema);

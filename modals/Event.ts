import { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  eventType: {
    type: String,
    required: true,
    enum: ["page_view", "click", "duration"],
  },
  url: { type: String, required: true },
  referrer: { type: String, default: "" },
  sessionId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  device: {
    type: String,
    enum: ["desktop", "mobile", "tablet"],
    default: "desktop",
  },
});

const Event = models.Event || model("Event", EventSchema);

export default Event;

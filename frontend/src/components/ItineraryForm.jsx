import React, { useState } from "react";
import { generateItinerary, saveItinerary } from "../api/firebase-api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ItineraryForm() {
  const [form, setForm] = useState({
    budget: 10000,
    startDate: "",
    duration: 3,
    homePlace: "",
    transport: "car",
    arrival: "",
    preferredDestinations: ""
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      budget: Number(form.budget),
      startDate: form.startDate,
      duration: Number(form.duration),
      homePlace: form.homePlace,
      transport: form.transport,
      arrival: form.arrival,
      preferredDestinations: form.preferredDestinations
        ? form.preferredDestinations.split(",").map(s => s.trim())
        : []
    };
    try {
      const res = await generateItinerary(payload);
      if (res.success) {
        setPlan(res.plan); // plan should now be plain text (Markdown)
      } else {
        alert("Failed to generate");
      }
    } catch (err) {
      console.error(err);
      alert("Error");
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!plan) {
      alert("No plan to save");
      return;
    }
    try {
      const r = await saveItinerary({ itinerary: plan, userId: "demo-user" });
      if (r.success) alert("Saved! id: " + r.id);
      else alert("Failed to save itinerary");
    } catch (err) {
      console.error(err);
      alert("Error saving itinerary");
    }
  }

  return (
    <div className="card">
      <h3>Itinerary Planner</h3>
      <form onSubmit={handleGenerate}>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            className="input"
            value={form.homePlace}
            onChange={e => setForm({ ...form, homePlace: e.target.value })}
            placeholder="Your hometown (e.g. Ranchi)"
          />
          <input
            type="date"
            className="input"
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              type="number"
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
              placeholder="Duration (days)"
            />
            <input
              className="input"
              type="number"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="Budget (INR)"
            />
          </div>
          <select
            className="input"
            value={form.transport}
            onChange={e => setForm({ ...form, transport: e.target.value })}
          >
            <option value="car">Car</option>
            <option value="train">Train</option>
            <option value="flight">Flight</option>
          </select>
          <input
            className="input"
            value={form.arrival}
            onChange={e => setForm({ ...form, arrival: e.target.value })}
            placeholder="Arrival city (e.g. Ranchi)"
          />
          <input
            className="input"
            value={form.preferredDestinations}
            onChange={e =>
              setForm({ ...form, preferredDestinations: e.target.value })
            }
            placeholder="Preferred destinations (comma separated, optional)"
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleSave}
              style={{ background: "#0b8c54" }}
            >
              Save Itinerary
            </button>
          </div>
        </div>
      </form>

      {plan && (
        <div style={{ marginTop: 16 }}>
          <h4>Planned Itinerary</h4>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

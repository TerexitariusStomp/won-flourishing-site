import { useMemo, useState, type FormEvent } from "react";
import { Link } from "wouter";
import "./bridge.css";
import { projectCategoryOptions } from "@/data/projectCategories";

type FormState = {
  name: string;
  type: string;
  location: string;
  lat: string;
  lng: string;
  desc: string;
  website: string;
  contact: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const initialState: FormState = {
  name: "",
  type: "Community Submission",
  location: "",
  lat: "",
  lng: "",
  desc: "",
  website: "",
  contact: ""
};

export default function ProjectFormPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedForm = useMemo(
    () => ({
      ...form,
      name: form.name.trim(),
      location: form.location.trim(),
      desc: form.desc.trim(),
      website: form.website.trim(),
      contact: form.contact.trim()
    }),
    [form]
  );

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const lat = Number(trimmedForm.lat);
    const lng = Number(trimmedForm.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setStatus("error");
      setErrorMessage("Please provide valid latitude and longitude values.");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedForm.name,
          type: trimmedForm.type,
          location: trimmedForm.location,
          lat,
          lng,
          desc: trimmedForm.desc,
          website: trimmedForm.website || undefined,
          contact: trimmedForm.contact || undefined
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.message ?? "Submission failed. Please try again.";
        setStatus("error");
        setErrorMessage(message);
        return;
      }

      setStatus("success");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please try again in a moment.");
    }
  };

  return (
    <div className="bridge-shell">
      <div className="bridge-page">
        <div className="bridge-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
                alt="We Won Logo"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl">We Won</span>
            </div>
            <p className="bridge-eyebrow">Project submission</p>
            <h1 className="bridge-title">Share your regenerative project</h1>
            <p className="bridge-subhead">
              Submit your project details to appear on the global map. New
              submissions show up alongside existing regenerative sites.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
            <Link href="/map" className="bridge-nav-link">
              View map
            </Link>
          </div>
        </div>

        <div className="bridge-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bridge-input-row">
              <label className="bridge-field">
                <span className="bridge-label">Project name</span>
                <input
                  className="bridge-input"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Cahuita Mangrove Cooperative"
                  required
                />
              </label>
              <label className="bridge-field">
                <span className="bridge-label">Category</span>
                <select
                  className="bridge-select"
                  value={form.type}
                  onChange={(event) => updateField("type", event.target.value)}
                >
                  {projectCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="bridge-input-row">
              <label className="bridge-field">
                <span className="bridge-label">Location</span>
                <input
                  className="bridge-input"
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Limón, Costa Rica"
                  required
                />
              </label>
              <label className="bridge-field">
                <span className="bridge-label">Latitude</span>
                <input
                  className="bridge-input"
                  type="number"
                  step="0.0001"
                  value={form.lat}
                  onChange={(event) => updateField("lat", event.target.value)}
                  placeholder="9.9876"
                  required
                />
              </label>
              <label className="bridge-field">
                <span className="bridge-label">Longitude</span>
                <input
                  className="bridge-input"
                  type="number"
                  step="0.0001"
                  value={form.lng}
                  onChange={(event) => updateField("lng", event.target.value)}
                  placeholder="-83.045"
                  required
                />
              </label>
            </div>

            <label className="bridge-field">
              <span className="bridge-label">Project overview</span>
              <textarea
                className="bridge-input"
                value={form.desc}
                onChange={(event) => updateField("desc", event.target.value)}
                placeholder="Share impact metrics, partners, and what makes the project special."
                rows={4}
                required
              />
              <span className="bridge-muted">
                Keep it concise: this is what appears on the public map.
              </span>
            </label>

            <div className="bridge-input-row">
              <label className="bridge-field">
                <span className="bridge-label">Website (optional)</span>
                <input
                  className="bridge-input"
                  type="url"
                  value={form.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  placeholder="https://"
                />
              </label>
              <label className="bridge-field">
                <span className="bridge-label">Contact email (optional)</span>
                <input
                  className="bridge-input"
                  type="email"
                  value={form.contact}
                  onChange={(event) => updateField("contact", event.target.value)}
                  placeholder="hello@project.org"
                />
              </label>
            </div>

            {status !== "idle" && (
              <div
                className={`bridge-banner ${
                  status === "error"
                    ? "error"
                    : status === "success"
                      ? "success"
                      : ""
                }`}
              >
                {status === "submitting" && "Submitting your project..."}
                {status === "success" &&
                  "Thanks! Your project has been added to the map feed."}
                {status === "error" && errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="bridge-primary"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

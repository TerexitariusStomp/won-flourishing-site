import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.listProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Invalid project payload.",
      });
      return;
    }

    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.post("/api/trust-scores", (req, res) => {
    const { signals } = req.body ?? {};

    if (!Array.isArray(signals)) {
      res.status(400).json({ message: "Signals payload must be an array." });
      return;
    }

    const scores = signals
      .filter((item) => item && typeof item.id === "string")
      .map((item) => {
        const evidence = Number(item.evidence ?? 0);
        const delivery = Number(item.delivery ?? 0);
        const transparency = Number(item.transparency ?? 0);
        const community = Number(item.community ?? 0);

        const weightedScore =
          evidence * 0.3 + delivery * 0.3 + transparency * 0.2 + community * 0.2;
        const score = Math.max(0, Math.min(100, Math.round(weightedScore)));
        const confidence = Math.max(
          0,
          Math.min(1, (evidence + delivery + transparency + community) / 400)
        );

        return {
          id: item.id,
          score,
          confidence: Number(confidence.toFixed(2))
        };
      });

    res.json({ scores });
  });

  return httpServer;
}

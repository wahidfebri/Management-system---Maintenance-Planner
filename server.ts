import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Failure Diagnosis & Root Cause Analysis endpoint using Gemini 3.6 Flash
  app.post("/api/ai-diagnose", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const { assetName, failureCode, problemDescription, hm, component } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are an expert Reliability Engineer & Maintenance Planner for heavy equipment, mining, and industrial manufacturing plants.
Analyze the following failure report and provide structured maintenance recommendations:

Asset Name: ${assetName || "Heavy Machinery"}
Component Affected: ${component || "Unspecified Component"}
Failure Category: ${failureCode || "General Mechanical/Hydraulic"}
Problem Description: ${problemDescription}
Current Hour Meter (HM): ${hm || "N/A"}

Please respond in JSON format with:
1. "probableCauses": Array of 3 likely root causes
2. "fiveWhySteps": Array of 5 why steps building down to the root cause
3. "fishboneCategories": Object containing "Machine", "Manpower", "Method", "Material", "Environment" arrays of potential factors
4. "correctiveActions": Array of immediate repair steps
5. "preventiveActions": Array of long-term prevention recommendations
6. "recommendedParts": Array of suggested spare parts to check or replace
7. "estimatedDowntimeHours": Recommended downtime estimate (number)
8. "criticalityAssessment": "Low", "Medium", "High", or "Critical"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (!response.text) {
        throw new Error("No response received from Gemini model");
      }

      const parsedData = JSON.parse(response.text.trim());
      return res.json({ success: true, analysis: parsedData });
    } catch (err: any) {
      console.error("AI Diagnosis Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to generate AI diagnosis",
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MPRMS CMMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ context: z.string().max(8000), fallbackApproved: z.boolean() });

export type UnderwriterResult = { approved: boolean; summary: string; reasons: string[]; tips: string[] };

export const runUnderwriter = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }): Promise<UnderwriterResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    const fallback: UnderwriterResult = {
      approved: data.fallbackApproved,
      summary: data.fallbackApproved
        ? "Your finances look healthy enough for this loan."
        : "We can't approve this loan right now.",
      reasons: [],
      tips: [],
    };
    if (!key) return fallback;
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a senior microcredit underwriter. Review the automated analysis and make a final decision. Any hard rule failure or fraud score >= 50 means decline. Speak directly to the applicant in plain, friendly English, no jargon, no numbers like PD. Return JSON: {\"approved\": boolean, \"summary\": string (1 sentence), \"reasons\": string[] (2-4 short), \"tips\": string[] (0-3 short, how to improve; empty if approved)}.",
            },
            { role: "user", content: data.context },
          ],
        }),
      });
      if (!res.ok) {
        console.error("Underwriter gateway error", res.status);
        return fallback;
      }
      const json = await res.json();
      const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
      return {
        approved: Boolean(parsed.approved),
        summary: String(parsed.summary ?? fallback.summary),
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map(String).slice(0, 4) : [],
        tips: Array.isArray(parsed.tips) ? parsed.tips.map(String).slice(0, 3) : [],
      };
    } catch (e) {
      console.error(e);
      return fallback;
    }
  });

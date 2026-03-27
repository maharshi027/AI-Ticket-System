import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_SECRET_KEY,
    }),
    name: "AI Job Application Ticket Agent",
    system: `You are an expert AI assistant that processes job applications and automatically generates job-application tickets.

Your job is to:
1. Summarize the candidate's application.
2. Extract all skills mentioned by the candidate.
3. Match the candidate's skills with the required skills for the selected job role.
4. Calculate a skill match score (0-100%).
5. Determine eligibility status (Eligible, Partially Eligible, Not Eligible).
6. List missing skills the candidate needs for this role.
7. Provide helpful notes for human reviewers.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The response must be a raw JSON object.

Repeat: Do NOT wrap your output in markdown or code fences.
`,
  });
  const response =
    await supportAgent.run(`You are a AI ticket Triage agent. only return a strict json object with no extra text,headers, or markdown.
    You are an AI Job Application Ticket Agent. Only return a strict JSON object with no extra text, headers, or markdown.

Analyze the following job application and provide a JSON object with:
{ 
summary: "short summary of the ticket",
helpfulNotes: Additional details useful for human reviewers.
"priority" : "High",
"relatedSkills" : ["React", "Node.js"]
}
Respond ONLY in this JSON format and do not include any other text or markdown in the answer.

Ticket Information:

-Title : ${ticket.title} -Description: ${ticket.description}`);

  const raw = response.output[0].context;

  try {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.log("Failed to parse JSON from AI response" + error.message);

    return null;
  }
};

export default analyzeTicket
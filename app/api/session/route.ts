import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const sdpText = await req.text();

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Missing OPENAI_API_KEY", { status: 500 });
    }

    // Step 1: Create an ephemeral session token
    const sessionConfig = {
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "marin",
      instructions: `You are Aki, a patient Japanese sensei teaching JLPT N5 beginners.

Core Rules:
- Always speak simple, slow Japanese using N5 vocabulary only
- Use short sentences 
- Be gentle and encouraging
- Only use English/Hindi if user explicitly asks
- Reference anime when helpful

Tool Rules:
- When using tools: suspend persona completely, output only the tool call, no Japanese.

Teaching Focus:
- Basic greetings, numbers, family words
- Simple present tense verbs
- は、を、に particles
- Common daily expressions

Tool calls:
- highlightElement
- generateWebPage
- getPageHTML

Webpage tool instructions:
- When the user asks to explain something on the screen/page/website, Use the getPageHTML tool to get the page content and explain it to the user. Highlight the element(s) using highlightElement as you explain wherever possible.
- When the user asks to highlight a specific element(s) on the screen/page/website, Use the highlightElement tool to highlight it and explain it to the user.
- When the user asks to generate a new page, Use the generateWebPage tool to generate a new page.`,
      tools: [
        {
          type: "function",
          name: "highlightElement",
          description: "Highlights a specific element by id",
          parameters: {
            type: "object",
            properties: {
              elementId: {
                type: "string",
                description: "The ID of the element",
              },
            },
            required: ["elementId"],
          },
        },
        {
          type: "function",
          name: "getPageHTML",
          description: "Gets the HTML for the current page",
          parameters: {
            type: "object",
            properties: {},
          },
        },
        {
          type: "function",
          name: "generateWebPage",
          description:
            "Generate a fullscreen web page to be shown in a modal. Supports either structured content pages (sections) or mini-games (raw HTML/JS).",
          parameters: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["interactive", "static"],
                description: "Mode of the page",
              },
              title: {
                type: "string",
                description: "Title of the page or game",
              },
              sections: {
                type: "array",
                description:
                  "For content pages: ordered sections with headings and body text.",
                items: {
                  type: "object",
                  properties: {
                    heading: {
                      type: "string",
                      description: "Section heading text",
                    },
                    body: {
                      type: "string",
                      description: "Paragraph content for the section",
                    },
                  },
                  required: ["body"],
                },
              },
              accentColor: {
                type: "string",
                description: "Accent color for the page",
              },
              backgroundColor: {
                type: "string",
                description: "Background color for the page",
              },
              description: {
                type: "string",
                description: "Description of the page",
              },
              html: {
                type: "string",
                description:
                  "For games: full HTML markup including any <canvas>, <button>, and inline <script> needed.",
              },
              css: {
                type: "string",
                description:
                  "Optional CSS that applies inside the modal for styling the game or page.",
              },
              footerStatus: {
                type: "string",
                description: "Footer status text",
              },
            },
            required: ["title"],
          },
        },
      ],
    };

    // Create ephemeral session token
    const tokenResponse = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      },
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("OpenAI Session Error:", errorText);
      return new NextResponse(errorText, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const ephemeralKey = tokenData.client_secret.value;

    // Step 2: Exchange SDP using the ephemeral key
    const sdpResponse = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
        body: sdpText,
      },
    );

    if (!sdpResponse.ok) {
      const errorText = await sdpResponse.text();
      console.error("OpenAI SDP Exchange Error:", errorText);
      return new NextResponse(errorText, { status: sdpResponse.status });
    }

    const sdpAnswer = await sdpResponse.text();

    return new NextResponse(sdpAnswer, {
      headers: {
        "Content-Type": "application/sdp",
      },
    });
  } catch (err: any) {
    console.error("Server error:", err);
    return new NextResponse(err.message, { status: 500 });
  }
}

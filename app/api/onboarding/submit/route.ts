import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      japaneseLevel,
      takenCourse,
      instituteName,
      motivation,
      motivationDetails,
    } = body;

    // Validate environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"); // Handle newlines in env var
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      console.error("Missing Google Sheets credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append to sheet
    // Assumes columns: Timestamp, Japanese Level, Taken Course, Institute Name, Motivation, Motivation Details
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:F", // Adjust range as needed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            japaneseLevel,
            takenCourse === "true" ? "Yes" : "No",
            instituteName || "N/A",
            motivation,
            motivationDetails || "N/A",
          ],
        ],
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json(
      { error: "Failed to submit to Google Sheets" },
      { status: 500 },
    );
  }
}

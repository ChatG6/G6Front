import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
    const { textToSummary } = await request.json();
    console.log(textToSummary);
    
    const anthropic_api_key = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    
    const options = {
        method: "POST",
        url: "https://api.anthropic.com/v1/messages",
        data: {
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 4000,
            messages: [
                {
                    "role": "user",
                    "content": `Summarize the following paragraph:\n${textToSummary}`
                }
            ]
        },
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropic_api_key,
            'anthropic-version': '2023-06-01'
        },
    };

    try {
        const response = await axios(options);
        
        // Extract the summary from Claude's response structure
        const summarizedText = response.data.content[0].text;
        
        return NextResponse.json({ aiPrompt: summarizedText });
    } catch (error) {
        console.error(error);
        // Return a generic error message or handle the error as needed
        return NextResponse.json({ 
            error: "An error occurred while summarizing the text.",
        });
    }
}
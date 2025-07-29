import { NextResponse } from "next/server";
import axios from "axios";
import URLS from "@/app/config/urls";
//const API_BASE_URL = 'https://api.chatg6.ai';
//const API_BASE_URL = 'http://127.0.0.1:8000';
export async function POST(request: Request) {
    const { textTocomplete } = await request.json();
    const statement = textTocomplete
    const response = await axios.post(`${URLS.urls.backendUrl}/complete/`, { statement});
    console.log(response);
    return NextResponse.json({ aiPrompt: response.data });}
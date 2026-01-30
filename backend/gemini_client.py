import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

async def generate_gemini_response(prompt: str) -> str:
    if not api_key:
        return "Error: GEMINI_API_KEY not found in .env file."
    
    try:
        model = genai.GenerativeModel("gemini-flash-latest")
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Sorry, I couldn't connect to my brain right now. But let's keep going!"

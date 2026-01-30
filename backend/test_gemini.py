
import asyncio
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

async def test():
    try:
        model = genai.GenerativeModel("gemini-flash-latest")
        print("Sending request to gemini-flash-latest...")
        response = await model.generate_content_async("Hello, imply a test.")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())

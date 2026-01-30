from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from gemini_client import generate_gemini_response
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AiFeedbackRequest(BaseModel):
    step_id: str
    prompt_key: str
    input_data: Dict[str, Any]

# Template definitions based on docs/onboarding_flow.md
TEMPLATES = {
    "muscle_gain_feedback": """
SYSTEM: High-performance Human Performance Specialist.
Tone: Clinical, authoritative, concise.

USER PROFILE:
- Age: {age_group}
- Current: {current_body_type}
- Goal: {target_body_type}
- Motivation: {motivation}

TASK:
Provide a master insight under 20 words.
Connect {age_group} physiology and {current_body_type} to the need for precision.
Reject generic advice.

EXAMPLE:
"Your 30s metabolic signaling requires precise recovery windows; generic plans ignore hormonal shifts, stalling biomechanical efficiency."

CONSTRAINTS:
- MAX 20 WORDS.
- No advice.
- No fluff.
    """,
    "goal_reality_check": """
SYSTEM: Cybernetic Fitness Analyst.
Tone: Clinical, cold, insightful.

USER:
- Goal: {goal}
- Context: {current_body_type} to {target_body_type}
- Barrier: {main_barrier}

TASK:
Reflect on this profile in under 20 words.
Validate the barrier as structural, not personal.
End with a sharp question.

CONSTRAINTS:
- MAX 20 WORDS.
- No advice.
- Pure insight.
    """
}

def format_prompt(key: str, data: Dict[str, Any]) -> str:
    template = TEMPLATES.get(key)
    if not template:
        logger.warning(f"Template key '{key}' not found.")
        return f"Help the user with their {data.get('goal', 'fitness')} goal."
    
    # Safe formatting that ignores missing keys? No, better to be explicit or handle gracefully.
    # We'll use a safe dict get for formatting
    try:
        # Pre-process data for list handling (e.g. target_zones)
        formatted_data = {}
        for k, v in data.items():
            if isinstance(v, list):
                formatted_data[k] = ", ".join(v)
            else:
                formatted_data[k] = v
        
        # We need to ensure all keys expected by template are present, or default them
        # Simple string formatting
        return template.format(**formatted_data)
    except KeyError as e:
        logger.error(f"Missing key for template formatting: {e}")
        return f"Analyze the user's goal: {data.get('goal', 'unknown')}"

@app.post("/onboarding/ai-feedback")
async def get_ai_feedback(request: AiFeedbackRequest):
    logger.info(f"Received request for {request.step_id}")
    
    prompt = format_prompt(request.prompt_key, request.input_data)
    logger.info(f"Generated prompt: {prompt}")
    
    response_text = await generate_gemini_response(prompt)
    return {"text": response_text}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running"}

# System Architecture

# Architecture: AI Feedback Loop

## 1. Data Collection (Steps 1–8)
- User responses are stored in a transient SQLite session.
- **Computed Fields:** The backend calculates the `fitness_level` (Step 8) based on user inputs before the AI step.

## 2. The AI Hook (Step 9: `ai_feedback`)
When the user reaches `order_index: 9`, the backend triggers `openai_client.py`:
- **Payload:** Maps `input_keys` (age, body types, zones, motivation) into a structured prompt.
- **System Prompt:** "You are a high-performance fitness coach. Based on these metrics, provide a 2-sentence feedback that validates the user's goal and highlights how this app solves their 'main_barrier'."
- **Output:** Injected into the UI to create an "Aha!" moment before the final lifestyle questions and paywall.

## 3. Storage
- **SQLite Schema:** 
    - `users`: Basic info.
    - `onboarding_responses`: Raw JSON of user choices.
    - `ai_insights`: The generated motivation text.
* **Sessions Table:** `id`, `session_id`, `created_at`, `updated_at`.
* **Users Table:** `id`, `username`, `email`, `password`, `created_at`, `updated_at`, `session_id`.
* **Session Onboarding Responses Table:** `id`, `session_id`, `question`, `response`, `created_at`, `updated_at`.
* **Interactions Table:** `id`, `user_prompt`, `ai_response`, `timestamp`, `vibe_score`.

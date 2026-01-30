# API Integration Logic

## OpenAI Configuration
* **Model:** `gpt-4o`
* **Temperature:** 0.1 (Balanced creativity)
* **Stream:** Enabled for "vibe" responsiveness.

## Endpoint: `/onboarding`
* **Method:** POST
* **Payload:** `{ "prompt": string }`
* **Logic:** * Validate session.
    * Query SQLite for context.
    * Call OpenAI Chat Completions.
    * Update SQLite with result.
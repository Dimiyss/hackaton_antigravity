import type { Step, UserState } from '../types';

export const generateAIResponse = async (step: Step, state: UserState): Promise<string> => {
    try {
        const response = await fetch('http://localhost:8000/onboarding/ai-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                step_id: step.id,
                prompt_key: step.prompt_key,
                input_data: state.answers
            }),
        });

        if (!response.ok) {
            console.error('AI Service Error:', response.statusText);
            return "Unable to connect to your personal coach right now. Please check your connection.";
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Network Error:', error);
        return "I'm having trouble syncing with the server. Let's proceed with the standard plan.";
    }
};

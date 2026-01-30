import { useState, useMemo } from 'react';
import { ONBOARDING_STEPS } from '../data/steps';
import type { UserState } from '../types';

export function useOnboarding() {
    const [state, setState] = useState<UserState>(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const gender = searchParams.get('gender') || 'female'; // Default to female if not specified
        return {
            answers: { gender },
            currentStepIndex: 0
        };
    });

    const currentStep = useMemo(() => {
        // Filter steps based on conditions
        const filteredSteps = ONBOARDING_STEPS.filter(() => {
            // For simplicity in this v1, we aren't filtering the array itself dynamically, 
            // but checking validity during navigation would be better for a complex graph.
            // However, to support the "variants", we need to Resolve the current step's properties.
            return true;
        });

        const stepDef = filteredSteps[state.currentStepIndex];
        if (!stepDef) return null;

        // Resolve variants
        if (stepDef.variants) {
            for (const variant of stepDef.variants) {
                const matches = Object.entries(variant.when).every(([key, val]) => state.answers[key] === val);
                if (matches) {
                    return { ...stepDef, ...variant };
                }
            }
        }
        return stepDef;

    }, [state.currentStepIndex, state.answers]);

    const totalSteps = ONBOARDING_STEPS.length;
    const progress = ((state.currentStepIndex + 1) / totalSteps) * 100;

    const handleAnswer = (value: string | string[]) => {
        if (!currentStep) return;
        const key = currentStep.stores_as || currentStep.id;
        setState(prev => ({
            ...prev,
            answers: { ...prev.answers, [key]: value }
        }));
    };

    const nextStep = () => {
        setState(prev => ({
            ...prev,
            currentStepIndex: Math.min(prev.currentStepIndex + 1, totalSteps - 1)
        }));
    };

    // Auto-advance for single choice if desired, but we'll control that in UI

    return {
        currentStep,
        answers: state.answers,
        progress,
        handleAnswer,
        nextStep,
        isFirstStep: state.currentStepIndex === 0,
        isLastStep: state.currentStepIndex === totalSteps - 1
    };
}

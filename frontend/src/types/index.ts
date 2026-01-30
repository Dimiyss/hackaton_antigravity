export type StepType = 'single_choice' | 'multi_choice' | 'info' | 'ai_generated';

export interface Option {
    label: string;
    value: string;
}

export interface StepVariant {
    when: Record<string, string>;
    title: string;
    options: Option[];
}

export interface Step {
    order_index: number;
    id: string;
    type: StepType;
    title?: string;
    description?: string;
    options?: Option[];
    required?: boolean;
    stores_as?: string;
    variants?: StepVariant[];
    computed_from?: string[];
    prompt_key?: string;
    input_keys?: string[];
    max_length?: number;
    ui_style?: string;
}

export interface UserState {
    answers: Record<string, string | string[]>;
    currentStepIndex: number;
}

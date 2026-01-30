import type { Step } from '../types';

export const ONBOARDING_STEPS: Step[] = [
    {
        order_index: 0,
        id: "welcome",
        type: "info",
        title: "Your AI Personal Trainer",
        description: "Let's build a plan that adapts to your body, goals, and lifestyle.",
    },
    {
        order_index: 1,
        id: "age",
        type: "single_choice",
        title: "🎂 Select your age",
        options: [
            { label: "🧑 18–29", value: "18_29" },
            { label: "🧔 30–39", value: "30_39" },
            { label: "👨‍🦳 40–49", value: "40_49" },
            { label: "👴 50+", value: "50_plus" }
        ],
        required: true,
        stores_as: "age_group"
    },
    {
        order_index: 2,
        id: "social_proof",
        type: "info",
        title: "Join the Movement",
        description: "65+ million users have chosen us to transform their lives.",
    },
    {
        order_index: 3,
        id: "coach_vibe",
        type: "single_choice",
        title: "Choose your coach vibe",
        // Options will be handled specially in the UI, but we can define variants for logic if needed
        // or just use generic values referencing the avatars
        stores_as: "coach_vibe",
        required: true,
        variants: [
            {
                when: { gender: "male" },
                title: "Choose your coach vibe",
                options: [
                    { label: "Chris - Strict & Disciplined", value: "chris" },
                    { label: "Peter - Energetic & Uplifting", value: "peter" },
                    { label: "Mickey - Fun & Supportive", value: "mickey" }
                ]
            },
            {
                when: { gender: "female" },
                title: "Choose your coach vibe",
                options: [
                    { label: "Chealsy - Strict & Disciplined", value: "chealsy" },
                    { label: "Amanda - Energetic & Uplifting", value: "amanda" },
                    { label: "Heather - Fun & Supportive", value: "heather" }
                ]
            }
        ]
    },
    {
        order_index: 4,
        id: "goal",
        type: "single_choice",
        title: "🎯 What is your goal?",
        options: [
            { label: "💪 Muscle Gain", value: "muscle_gain" },
            { label: "⚖️ Weight Loss", value: "weight_loss" }
        ],
        required: true,
        stores_as: "goal"
    },
    {
        order_index: 5,
        id: "main_barrier",
        type: "single_choice",
        stores_as: "main_barrier",
        required: true,
        variants: [
            {
                when: { goal: "muscle_gain" },
                title: "What usually makes it hard for you to build muscle?",
                options: [
                    { label: "⏳ Muscle growth feels too slow", value: "slow_progress" },
                    { label: "🔥 I lose motivation along the way", value: "low_motivation" },
                    { label: "🤔 I'm not sure which workouts actually work", value: "lack_of_clarity" },
                    { label: "🔄 I struggle to train consistently", value: "low_consistency" }
                ]
            },
            {
                when: { goal: "weight_loss" },
                title: "What usually makes weight loss difficult for you?",
                options: [
                    { label: "⏳ The scale doesn't change even when I try", value: "slow_progress" },
                    { label: "🔥 I lose motivation after a while", value: "low_motivation" },
                    { label: "🤔 There's too much conflicting advice", value: "lack_of_clarity" },
                    { label: "🔄 I find it hard to stick to healthy habits", value: "low_consistency" }
                ]
            }
        ]
    },
    {
        order_index: 6,
        id: "current_body_type",
        type: "single_choice",
        stores_as: "current_body_type",
        required: true,
        variants: [
            {
                when: { goal: "muscle_gain" },
                title: "How would you describe your current body?",
                options: [
                    { label: "🪶 Skinny", value: "skinny" },
                    { label: "⚪ Average", value: "average" },
                    { label: "⬛ Overweight", value: "overweight" }
                ]
            },
            {
                when: { goal: "weight_loss" },
                title: "How would you describe your current body?",
                options: [
                    { label: "⬛ Overweight", value: "overweight" },
                    { label: "⚪ Average", value: "average" },
                    { label: "🪶 Skinny", value: "skinny" }
                ]
            }
        ]
    },
    {
        order_index: 7,
        id: "target_body_type",
        type: "single_choice",
        title: "✨ Choose your target body type",
        options: [
            { label: "🏃 Fit", value: "fit" },
            { label: "🏋️ Bulk", value: "bulk" },
            { label: "🦍 Extra bulk", value: "extra_bulk" }
        ],
        stores_as: "target_body_type",
        required: true
    },
    {
        order_index: 8,
        id: "ai_reality_check",
        type: "ai_generated",
        prompt_key: "goal_reality_check",
        input_keys: ["goal", "current_body_type", "target_body_type", "main_barrier"],
        ui_style: "reflection",
        max_length: 2,
        description: "This helps us understand what’s been holding you back — and what usually goes wrong without a clear plan."
    },
    {
        order_index: 9,
        id: "target_zones",
        type: "multi_choice",
        title: "📍 Choose your target zones",
        options: [
            { label: "💪 Arms", value: "arms" },
            { label: "🫀 Chest", value: "chest" },
            { label: "🔥 Abs", value: "abs" },
            { label: "🦵 Legs", value: "legs" }
        ],
        stores_as: "target_zones"
    },
    {
        order_index: 10,
        id: "motivation",
        type: "single_choice",
        title: "🚀 What motivates you to exercise?",
        options: [
            { label: "❤️ Improving health", value: "health" },
            { label: "👀 Looking better", value: "appearance" },
            { label: "💥 Building strength", value: "strength" }
        ],
        stores_as: "motivation"
    },
    {
        order_index: 11,
        id: "energy_between_meals",
        type: "single_choice",
        title: "How do you feel between meals?",
        description: "What’s your energy like at different times of the day?",
        options: [
            { label: "😴 I get sleepy when I’m hungry", value: "sleepy_hungry" },
            { label: "🥱 I am tired after I eat", value: "tired_after_eat" },
            { label: "⚡ I am always feeling energized", value: "always_energized" }
        ],
        stores_as: "lifestyle_energy_level",
        required: true
    },
    {
        order_index: 12,
        id: "exercise_regularity",
        type: "single_choice",
        title: "How regularly do you exercise?",
        description: "This will help us measure your workout consistency.",
        options: [
            { label: "❌ I have never done regular workouts before", value: "never" },
            { label: "📉 I do exercise, but not regularly", value: "irregular" },
            { label: "📈 Regularly — 1 or more workouts per week", value: "regular" }
        ],
        stores_as: "exercise_frequency",
        required: true
    },
    {
        order_index: 13,
        id: "fitness_level",
        type: "info",
        title: "Your fitness level is beginner",
        description: "Based on your current activity, we'll start with foundational movements.",
        computed_from: [
            "pushups",
            "endurance",
            "consistency"
        ]
    },
    {
        order_index: 14,
        id: "ai_feedback",
        type: "ai_generated",
        prompt_key: "muscle_gain_feedback",
        input_keys: ["age_group", "current_body_type", "target_body_type", "target_zones", "motivation"],
        max_length: 2
    },
    {
        order_index: 15,
        id: "paywall",
        type: "info",
        title: "Your Strategy is Ready",
        description: "Unlock your personalized plan and start your transformation today.",
    }
];

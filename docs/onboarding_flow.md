# Onboarding Flow Rules

## Gender Customization
- **Rule:** If `gender_focus` is "female", use background images from `/assets/female/` and feminine-coded emojis (e.g., 🧘‍♀️ instead of 🧘‍♂️).
- **Rule:** If `gender_focus` is "male", use `/assets/male/` and high-contrast neon blues/greens.

## AI Step Trigger
When `next_id` is `ai_feedback`:
1. **Backend:** Collects `age_group`, `goal`, and `main_barrier`.
2. **Prompt:** "You are an elite coach. Write 2 punchy neon-vibed sentences explaining why [Goal] is possible for a [Age] woman/man despite [Barrier]."
3. **Frontend:** Display a "Syncing with AI..." loader before showing the text.

## AI Prompt Templates
These templates are used by the backend when a step `type: ai_generated` is reached.

### Template: `muscle_gain_feedback`
SYSTEM:
You are a high-performance Human Performance Specialist. Your tone is calm, clinical, and authoritative. You value physiological precision over motivational clichés.

USER PROFILE:
- Demographic: {age_group}
- Physiological Starting Point: {current_body_type}
- Target Composition: {target_body_type}
- Specific Focus: {target_zones}
- Driving Factor: {motivation}

TASK:
Provide a 1–2 sentence master insight.
1. Connect how their {age_group} and {current_body_type} create a specific metabolic requirement for reaching {target_body_type}.
2. Explain that generic "one-size-fits-all" advice fails because it ignores the hormonal and recovery timing necessary for someone in their specific phase.
3. Use phrases that imply high-level expertise (e.g., "metabolic signaling," "recovery window," "biomechanical efficiency").

CONSTRAINTS: 
- Maximum 2 sentences. 
- No advice. 
- No selling. 
- Use "Expert Calm"
— no exclamation marks.

### Template: `ai_reality_check`
SYSTEM_PROMPT: 
You are a high-performance Cybernetic Fitness Analyst. Your tone is clinical yet empathetic, grounded in physiology and data. Avoid fluff, corporate cheerleading, and motivational quotes. Use sharp, insightful language.

USER_PROMPT:
The user's objective: {goal}.
Physiological context: {current_body_type} transitioning to {target_body_type}.
Identified friction point: {main_barrier}.

Reflect on this profile in exactly 1-2 sentences. 
1. Validate that their current path is a logical result of their body type and barrier.
2. Hint that their past failure was a structural issue, not a personal one.
3. Conclude with a single, sharp, thought-provoking question that makes them reconsider their current strategy.

Constraint: No advice. No app mentions. Pure insight.

# Onboarding JSON configuration
```json
[
  {
    "order_index": 1,
    "id": "age",
    "type": "single_choice",
    "title": ":birthday: Select your age",
    "options": [
      { "label": ":adult: 18–29", "value": "18_29" },
      { "label": ":bearded_person: 30–39", "value": "30_39" },
      { "label": ":white_haired_man: 40–49", "value": "40_49" },
      { "label": ":older_adult: 50+", "value": "50_plus" }
    ],
    "required": true,
    "stores_as": "age_group"
  },
  {
    "order_index": 2,
    "id": "goal",
    "type": "single_choice",
    "title": "🎯 What is your goal?",
    "options": [
      { "label": "💪 Muscle Gain", "value": "muscle_gain" },
      { "label": "⚖️ Weight Loss", "value": "weight_loss" }
    ],
    "required": true,
    "stores_as": "goal"
  },
  {
    "order_index": 3,
    "id": "main_barrier",
    "type": "single_choice",
    "stores_as": "main_barrier",
    "required": true,
    "variants": [
      {
        "when": { "goal": "muscle_gain" },
        "title": "What usually makes it hard for you to build muscle?",
        "options": [
          { "label": ":hourglass_flowing_sand: Muscle growth feels too slow", "value": "slow_progress" },
          { "label": ":fire: I lose motivation along the way", "value": "low_motivation" },
          { "label": ":thinking_face: I'm not sure which workouts actually work", "value": "lack_of_clarity" },
          { "label": ":repeat: I struggle to train consistently", "value": "low_consistency" }
        ]
      },
      {
        "when": { "goal": "weight_loss" },
        "title": "What usually makes weight loss difficult for you?",
        "options": [
          { "label": ":hourglass_flowing_sand: The scale doesn't change even when I try", "value": "slow_progress" },
          { "label": ":fire: I lose motivation after a while", "value": "low_motivation" },
          { "label": ":thinking_face: There's too much conflicting advice", "value": "lack_of_clarity" },
          { "label": ":repeat: I find it hard to stick to healthy habits", "value": "low_consistency" }
        ]
      }
    ]
  },
  {
    "order_index": 4,
    "id": "current_body_type",
    "type": "single_choice",
    "variants": [
      {
        "when": { "goal": "muscle_gain" },
        "title": "How would you describe your current body?",
        "options": [
          { "label": "🪶 Skinny", "value": "skinny" },
          { "label": "⚪ Average", "value": "average" },
          { "label": "⬛ Overweight", "value": "overweight" }
        ]
      },
      {
        "when": { "goal": "weight_loss" },
        "title": "How would you describe your current body?",
        "options": [
          { "label": "⬛ Overweight", "value": "overweight" },
          { "label": "⚪ Average", "value": "average" },
          { "label": "🪶 Skinny", "value": "skinny" }
        ]
      }
    ],
    "stores_as": "current_body_type",
    "required": true
  },
  {
    "order_index": 5,
    "id": "target_body_type",
    "type": "single_choice",
    "title": "✨ Choose your target body type",
    "options": [
      { "label": "🏃 Fit", "value": "fit" },
      { "label": "🏋️ Bulk", "value": "bulk" },
      { "label": "🦍 Extra bulk", "value": "extra_bulk" }
    ],
    "stores_as": "target_body_type",
    "required": true
  },

  {
    "order_index": 6,
    "id": "ai_reality_check",
    "type": "ai_generated",
    "prompt_key": "goal_reality_check",
    "input_keys": [
      "goal",
      "current_body_type",
      "target_body_type",
      "main_barrier"
    ],
    "ui_style": "reflection",
    "max_length": 2,
    "description": "This helps us understand what’s been holding you back — and what usually goes wrong without a clear plan."
  },

  {
    "order_index": 7,
    "id": "target_zones",
    "type": "multi_choice",
    "title": "📍 Choose your target zones",
    "options": [
      { "label": "💪 Arms", "value": "arms" },
      { "label": "🫀 Chest", "value": "chest" },
      { "label": "🔥 Abs", "value": "abs" },
      { "label": "🦵 Legs", "value": "legs" }
    ],
    "stores_as": "target_zones"
  },
  {
    "order_index": 8,
    "id": "motivation",
    "type": "single_choice",
    "title": "🚀 What motivates you to exercise?",
    "options": [
      { "label": "❤️ Improving health", "value": "health" },
      { "label": "👀 Looking better", "value": "appearance" },
      { "label": "💥 Building strength", "value": "strength" }
    ],
    "stores_as": "motivation"
  },
  {
    "order_index": 10,
    "id": "energy_between_meals",
    "type": "single_choice",
    "title": "How do you feel between meals?",
    "description": "What’s your energy like at different times of the day? Select the most appropriate option.",
    "options": [
      { "label": "I get sleepy when I’m hungry", "value": "sleepy_hungry" },
      { "label": "I am tired after I eat", "value": "tired_after_eat" },
      { "label": "I am always feeling energized", "value": "always_energized" }
    ],
    "stores_as": "lifestyle_energy_level",
    "required": true
  },
  {
  "order_index": 11,
  "id": "exercise_regularity",
  "type": "single_choice",
  "title": "How regularly do you exercise?",
  "description": "This will help us measure your workout consistency, which is vital for overall fitness",
  "variants": [
    {
      "options": [
        {
          "label": "I have never done regular workouts before",
          "value": "never"
        },
        {
          "label": "I do exercise, but not regularly",
          "value": "irregular"
        },
        {
          "label": "Regularly — 1 or more workouts per week",
          "value": "regular"
        }
      ]
    }
  ],
  "stores_as": "exercise_frequency",
  "required": true
},
  {
    "order_index": 12,
    "id": "fitness_level",
    "type": "info",
    "title": "Your fitness level is beginner",
    "computed_from": [
      "pushups",
      "endurance",
      "consistency"
    ]
  },
  {
    "order_index": 13,
    "id": "ai_feedback",
    "type": "ai_generated",
    "prompt_key": "muscle_gain_feedback",
    "input_keys": [
      "age_group",
      "current_body_type",
      "target_body_type",
      "target_zones",
      "motivation"
    ],
    "max_length": 2
  }

]


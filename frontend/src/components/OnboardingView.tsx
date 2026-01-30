import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../hooks/useOnboarding';
import { Button, Card, ProgressBar, Typewriter } from '../components/ui';
import { generateAIResponse } from '../hooks/mock_ai_service';

import { ArrowRight, Check } from 'lucide-react';

// New Pinguin Coach Images
import coachChris from '../assets/coach_chris.png';
import coachPeter from '../assets/coach_peter.png';
import coachMickey from '../assets/coach_mickey.png';
import coachChealsy from '../assets/coach_chealsy.png';
import coachAmanda from '../assets/coach_amanda.png';
import coachHeather from '../assets/coach_heather.png';

// Fallbacks or legacy
import coachMale from '../assets/coach_male.png';
import coachFemale from '../assets/coach_female.png';

import male18_29 from '../assets/male_18_29.png';
import male30_39 from '../assets/male_30_39.png';
import male40_49 from '../assets/male_40_49.png';
import male50_plus from '../assets/male_50_plus.png';
import female18_29 from '../assets/female_18_29.png';
import female30_39 from '../assets/female_30_39.png';
import female40_49 from '../assets/female_40_49.png';
import female50_plus from '../assets/female_50_plus.png';

// Import body images
import bodyMale from '../assets/body_male_athletic.png';
import bodyFemale from '../assets/body_female_athletic.png';

interface ChatMessage {
    role: 'coach' | 'user';
    content: string;
    id: string; // unique id to track messages
}

export default function OnboardingView() {
    const { currentStep, answers, progress, handleAnswer, nextStep } = useOnboarding();
    const gender = (answers.gender as string) || 'female';
    const coachVibe = (answers.coach_vibe as string) || 'chris'; // default fallback
    const [aiText, setAiText] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    // Chat History State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Resolve Coach Image helper
    const getCoachImage = () => {
        // If user hasn't selected a vibe yet, fallback based on gender or default
        // But usually chat starts AFTER coach selection now (index >= 4 usually)

        switch (coachVibe) {
            // Male Coaches
            case 'chris': return coachChris;
            case 'peter': return coachPeter;
            case 'mickey': return coachMickey;

            // Female Coaches
            case 'chealsy': return coachChealsy;
            case 'amanda': return coachAmanda;
            case 'heather': return coachHeather;

            default: return gender === 'male' ? coachMale : coachFemale;
        }
    };

    // Scroll to bottom when history changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, currentStep]);

    // Push new question to chat history when entering relevant steps
    useEffect(() => {
        if (!currentStep) return;

        // Only for steps >= 8 that are NOT AI generated loading screens (unless it's paywall or something else)
        // Adjust condition as needed: 
        const isChatStep = typeof currentStep.order_index === 'number' &&
            currentStep.order_index >= 11 &&  // Motivation starts at 11 now
            currentStep.type !== 'ai_generated';

        if (isChatStep) {
            setChatHistory(prev => {
                // Prevent duplicate question if it's already the last one (e.g. strict mode re-renders)
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === 'coach' && lastMsg.content === currentStep.title) {
                    return prev;
                }

                return [
                    ...prev,
                    {
                        role: 'coach',
                        content: currentStep.title || '',
                        id: `coach-${currentStep.id}`
                    }
                ];
            });
        }
    }, [currentStep?.id]);

    // Reset AI state when step changes
    useEffect(() => {
        setAiText(null);
        setIsTyping(false);
    }, [currentStep?.id]);

    // Handle AI Steps automatically
    useEffect(() => {
        if (currentStep?.type === 'ai_generated' && !aiText && !isTyping) {
            setIsTyping(true);
            generateAIResponse(currentStep, { answers, currentStepIndex: 0 }).then(text => {
                setAiText(text);
                setIsTyping(false);
            });
        }
    }, [currentStep, aiText, isTyping, answers]);

    if (!currentStep) return <div className="text-white">Loading...</div>;

    const renderChatInterface = () => {
        const coachImage = getCoachImage();

        return (
            <div className="w-full max-w-lg mx-auto flex flex-col h-full justify-end pb-4">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto space-y-6 mb-8 px-2 scrollbar-hide">
                    {/* Placeholder spacer to push content down if few messages */}
                    <div className="h-12" />

                    {chatHistory.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {msg.role === 'coach' && (
                                <img
                                    src={coachImage}
                                    className="w-10 h-10 rounded-full border border-neon-green/30 object-cover flex-shrink-0"
                                    alt="Coach"
                                />
                            )}

                            <div className={`
                                max-w-[80%] p-4 rounded-2xl text-lg leading-relaxed shadow-lg
                                ${msg.role === 'coach'
                                    ? 'bg-zinc-800/80 rounded-tl-none border border-zinc-700/50 text-gray-100'
                                    : 'bg-neon-green/10 rounded-tr-none border border-neon-green/20 text-white'}
                            `}>
                                {msg.role === 'coach' ? (
                                    // If it's the very last message, type it out. Otherwise show static.
                                    msg.id === chatHistory[chatHistory.length - 1].id ? (
                                        <Typewriter text={msg.content} speed={20} />
                                    ) : (
                                        msg.content
                                    )
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Current Step Options (Input Area) */}
                {currentStep.options ? (
                    <div className="flex flex-col items-end space-y-3 pl-12 animate-in slide-in-from-bottom-5 duration-500">
                        {currentStep.options.map(option => {
                            const key = currentStep.stores_as || currentStep.id;
                            const currentAnswer = answers[key];
                            const isMulti = currentStep.type === 'multi_choice';
                            const isSelected = isMulti
                                ? (currentAnswer as string[] || []).includes(option.value)
                                : currentAnswer === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        // 1. Add user answer to history locally for visual continuity
                                        setChatHistory(prev => [
                                            ...prev,
                                            { role: 'user', content: option.label, id: `user-${Date.now()}` }
                                        ]);

                                        // 2. Handle actual data
                                        if (isMulti) {
                                            const prev = (currentAnswer as string[]) || [];
                                            const newValue = prev.includes(option.value)
                                                ? prev.filter(v => v !== option.value)
                                                : [...prev, option.value];
                                            handleAnswer(newValue);
                                        } else {
                                            handleAnswer(option.value);
                                            // Short delay to let the user see their bubble before next question arrives
                                            setTimeout(nextStep, 500);
                                        }
                                    }}
                                    className={`
                                        px-6 py-3 rounded-2xl rounded-tr-none text-right transition-all duration-200 border text-lg
                                        ${isSelected
                                            ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(0,255,148,0.3)]'
                                            : 'bg-zinc-900 text-white border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800'}
                                    `}
                                >
                                    <Typewriter text={option.label} delay={500} speed={10} />
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    currentStep.type === 'info' && (
                        <div className="flex justify-end pt-4 animate-in slide-in-from-bottom-5 duration-500">
                            <Button onClick={nextStep} className="rounded-full px-6">
                                Continue <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    )
                )}
            </div>
        );
    };

    const renderVisualTargetZones = () => {
        const bodyImage = gender === 'male' ? bodyMale : bodyFemale;
        const key = currentStep.stores_as || currentStep.id;
        const currentSelection = (answers[key] as string[]) || [];

        const toggleZone = (zoneValue: string) => {
            const newValue = currentSelection.includes(zoneValue)
                ? currentSelection.filter(v => v !== zoneValue)
                : [...currentSelection, zoneValue];
            handleAnswer(newValue);
        };

        // Zones configuration
        const zones = [
            { id: 'chest', label: 'PECS', top: '28%', left: '50%' },
            { id: 'abs', label: 'BELLY', top: '42%', left: '50%' },
            { id: 'arms', label: 'ARMS', top: '32%', left: '25%' },
            { id: 'legs', label: 'LEGS', top: '65%', left: '75%' }
        ];

        return (
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2 text-center">
                    {currentStep.title}
                </h1>
                <p className="text-gray-400 mb-8 text-center">We'll prioritize these in your plan</p>

                <div className="relative h-[500px] w-full max-w-sm">
                    <img
                        src={bodyImage}
                        alt="Body selection"
                        className="h-full w-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    />

                    {/* SVG/Lines Overlay could go here, simplifying to absolute buttons for now */}

                    {zones.map(zone => {
                        const isSelected = currentSelection.includes(zone.id);
                        const isLeft = parseFloat(zone.left) < 50;

                        return (
                            <div
                                key={zone.id}
                                className="absolute pointer-events-auto"
                                style={{ top: zone.top, left: zone.left, transform: 'translate(-50%, -50%)' }}
                            >
                                {/* Dot on body */}
                                <div
                                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 z-20 relative
                                        ${isSelected ? 'bg-neon-green border-white shadow-[0_0_15px_#00ff94]' : 'bg-gray-500/50 border-gray-400'}
                                    `}
                                />

                                {/* Label with line */}
                                <div
                                    onClick={() => toggleZone(zone.id)}
                                    className={`
                                        absolute top-1/2 -translate-y-1/2 cursor-pointer
                                        ${isLeft ? 'right-full mr-8' : 'left-full ml-8'}
                                    `}
                                >
                                    {/* Connectivity Line (Pseudo) */}
                                    <div className={`
                                        absolute top-1/2 w-8 h-[1px] bg-gradient-to-r 
                                        ${isLeft ? 'right-[-32px] from-transparent to-gray-500' : 'left-[-32px] from-gray-500 to-transparent'}
                                        ${isSelected ? 'bg-neon-green h-[2px]' : ''}
                                    `} />

                                    <div className={`
                                        px-4 py-2 rounded-lg border backdrop-blur-md transition-all duration-300 whitespace-nowrap font-bold tracking-wider text-sm
                                        ${isSelected
                                            ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_10px_rgba(0,255,148,0.2)]'
                                            : 'bg-zinc-900/80 border-zinc-700 text-gray-400 hover:border-gray-500 hover:text-white'}
                                    `}>
                                        {zone.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="w-full max-w-xs mt-8 relative z-20">
                    <Button onClick={nextStep} className="w-full shadow-[0_0_30px_rgba(0,255,148,0.3)]">
                        CONTINUE <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderOptions = () => {
        if (!currentStep.options) return null;

        const isMulti = currentStep.type === 'multi_choice';
        const key = currentStep.stores_as || currentStep.id;
        const currentAnswer = answers[key];

        return (
            <div className="grid gap-3 mt-6">
                {currentStep.options.map(option => {
                    const isSelected = isMulti
                        ? (currentAnswer as string[] || []).includes(option.value)
                        : currentAnswer === option.value;

                    return (
                        <Card
                            key={option.value}
                            active={isSelected}
                            onClick={() => {
                                if (isMulti) {
                                    const prev = (currentAnswer as string[]) || [];
                                    const newValue = prev.includes(option.value)
                                        ? prev.filter(v => v !== option.value)
                                        : [...prev, option.value];
                                    handleAnswer(newValue);
                                } else {
                                    handleAnswer(option.value);
                                    // Auto advance for single choice after short delay
                                    setTimeout(nextStep, 300);
                                }
                            }}
                            className="flex items-center justify-between group"
                        >
                            <span className="font-medium text-lg">{option.label}</span>
                            {isSelected && <Check className="text-neon-green" />}
                        </Card>
                    );
                })}
            </div>
        );
    };

    const renderCoachSelection = () => {
        // Resolve which coaches to show based on gender
        const options = currentStep.options || [];

        return (
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-neon-green to-white bg-clip-text text-transparent">
                    {currentStep.title}
                </h1>

                <div className="grid grid-cols-1 gap-4 w-full">
                    {options.map((option) => {
                        let avatar = coachChris;
                        if (option.value === 'peter') avatar = coachPeter;
                        if (option.value === 'mickey') avatar = coachMickey;
                        if (option.value === 'chealsy') avatar = coachChealsy;
                        if (option.value === 'amanda') avatar = coachAmanda;
                        if (option.value === 'heather') avatar = coachHeather;

                        const isSelected = answers.coach_vibe === option.value;

                        return (
                            <Card
                                key={option.value}
                                active={isSelected}
                                onClick={() => {
                                    handleAnswer(option.value);
                                    setTimeout(nextStep, 300);
                                }}
                                className="flex items-center gap-4 p-4 hover:scale-[1.02] transition-transform"
                            >
                                <img src={avatar} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" alt={option.label} />
                                <div className="text-left flex-1">
                                    <div className="font-bold text-lg">{option.label.split(' - ')[0]}</div>
                                    <div className="text-sm text-gray-400">{option.label.split(' - ')[1]}</div>
                                </div>
                                {isSelected && <Check className="text-neon-green w-6 h-6" />}
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderSocialProof = () => {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="text-6xl mb-4">🌍</div>
                <h1 className="text-4xl font-black italic tracking-tighter">
                    JOIN THE <span className="text-neon-green">MOVEMENT</span>
                </h1>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full">
                    <div className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                        65M+
                    </div>
                    <p className="text-lg text-gray-400">Users have chosen us to transform their lives.</p>
                </div>

                <Button onClick={nextStep} className="w-full max-w-xs mt-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        );
    };

    const renderAIContent = () => {
        const coachImage = getCoachImage(); // Use Dynamic Coach

        if (isTyping) {
            return (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="flex items-end gap-2">
                        <img src={coachImage} className="w-10 h-10 rounded-full grayscale opacity-50" alt="Coach" />
                        <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="w-full max-w-lg mx-auto">
                <div className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <img
                        src={coachImage}
                        className="w-12 h-12 rounded-full border-2 border-neon-green/30 object-cover"
                        alt="Coach"
                    />
                    <div className="flex-1 space-y-4">
                        <div className="bg-zinc-800/80 backdrop-blur border border-neon-green/20 p-5 rounded-2xl rounded-tl-none text-lg leading-relaxed shadow-lg">
                            <span className="typing-effect">{aiText}</span>
                        </div>

                        {/* User "Response" Action */}
                        <div className="flex justify-end pt-4">
                            <Button onClick={nextStep} className="rounded-full px-6">
                                Got it <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Chat Interface routing for steps >= 11 (Motivation)
    // Note: Motivation is index 11
    if (typeof currentStep.order_index === 'number' && currentStep.order_index >= 11 && currentStep.type !== 'ai_generated' && currentStep.id !== 'paywall') {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-24 flex flex-col items-center justify-center">
                <ProgressBar progress={progress} />
                {renderChatInterface()}
            </div>
        );
    }

    // Social Proof
    if (currentStep.id === 'social_proof') {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-24 flex flex-col items-center justify-center">
                <ProgressBar progress={progress} />
                {renderSocialProof()}
            </div>
        );
    }

    // Coach Selection
    if (currentStep.id === 'coach_vibe') {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-24 flex flex-col items-center justify-center">
                <ProgressBar progress={progress} />
                {renderCoachSelection()}
            </div>
        );
    }

    // Visual Target Selection routing
    if (currentStep.id === 'target_zones') {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-24 flex flex-col items-center justify-center">
                <ProgressBar progress={progress} />
                {renderVisualTargetZones()}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 flex flex-col items-center justify-center">
            <ProgressBar progress={progress} />

            <div className="w-full max-w-md relative z-10">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header - Show for all except coach_vibe which has its own centered header inside the component */}
                        {currentStep.id !== 'coach_vibe' && (
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                                    {currentStep.title}
                                </h1>
                                {currentStep.description && (
                                    <p className="text-gray-400">{currentStep.description}</p>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        {currentStep.type === 'ai_generated' ? renderAIContent() : (
                            currentStep.id === 'age' ? (
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {currentStep.options?.map(option => {
                                        const key = currentStep.stores_as || currentStep.id;
                                        const isActive = answers[key] === option.value;

                                        // Resolve image for this specific option
                                        let optionImage = male30_39; // default fallback
                                        const ageValue = option.value;

                                        if (gender === 'male') {
                                            if (ageValue === '18_29') optionImage = male18_29;
                                            if (ageValue === '30_39') optionImage = male30_39;
                                            if (ageValue === '40_49') optionImage = male40_49;
                                            if (ageValue === '50_plus') optionImage = male50_plus;
                                        } else {
                                            if (ageValue === '18_29') optionImage = female18_29;
                                            if (ageValue === '30_39') optionImage = female30_39;
                                            if (ageValue === '40_49') optionImage = female40_49;
                                            if (ageValue === '50_plus') optionImage = female50_plus;
                                        }

                                        return (
                                            <Card
                                                key={option.value}
                                                active={isActive}
                                                onClick={() => {
                                                    handleAnswer(option.value);
                                                    setTimeout(nextStep, 300);
                                                }}
                                                className={`flex flex-col items-center p-0 overflow-hidden relative group transition-all duration-300 ${isActive ? 'ring-2 ring-neon-green' : 'hover:ring-1 hover:ring-white/30'}`}
                                            >
                                                <div className="w-full bg-zinc-900/50 flex items-end justify-center pt-4 h-40 relative">
                                                    <img
                                                        src={optionImage}
                                                        alt={option.label}
                                                        className="h-full object-contain object-bottom drop-shadow-2xl"
                                                    />
                                                    {/* Gradient overlay for text readability if needed */}
                                                </div>
                                                <div className={`w-full py-3 text-center font-bold text-lg transition-colors ${isActive ? 'bg-neon-green text-black' : 'bg-transparent text-white group-hover:bg-white/5'}`}>
                                                    {option.label.replace(/^[^\s]*\s/, '')} <span className="text-xs align-top">›</span>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : renderOptions()
                        )}

                        {/* Info Step Action */}
                        {currentStep.type === 'info' && (
                            <Button onClick={nextStep} className="mt-8 w-full" fullWidth>
                                Next <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}

                        {/* Manual Next for MultiChoice */}
                        {currentStep.type === 'multi_choice' && (
                            <Button onClick={nextStep} className="mt-8 w-full" variant="outline">
                                Confirm Selection
                            </Button>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Background ambient glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/10 blur-[100px] rounded-full pointer-events-none z-0" />
        </div>
    );
}

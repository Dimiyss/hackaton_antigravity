import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    className?: string;
}

export function Typewriter({
    text,
    speed = 30,
    delay = 0,
    onComplete,
    className = ""
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        let timeoutId: any;

        if (delay > 0 && !started) {
            timeoutId = setTimeout(() => {
                setStarted(true);
            }, delay);
            return () => clearTimeout(timeoutId);
        } else {
            setStarted(true);
        }
    }, [delay, started]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        setDisplayedText(''); // Reset on text change if needed, though usually new instance

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(prev => prev + text.charAt(currentIndex));
                currentIndex++;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed, started, onComplete]);

    return <span className={className}>{displayedText}</span>;
}

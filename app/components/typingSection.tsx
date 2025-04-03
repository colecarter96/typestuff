"use client";
import React, { useState, useEffect, useRef } from 'react';

interface TypingSectionProps {
    text: string;
    onComplete?: () => void;
}

const TypingSection = ({ text, onComplete }: TypingSectionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedChars, setTypedChars] = useState<{ char: string; correct: boolean }[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Focus the container when component mounts
        containerRef.current?.focus();
    }, []);

    const resetLevel = () => {
        setCurrentIndex(0);
        setTypedChars([]);
        setIsComplete(false);
        setStartTime(null);
        setEndTime(null);
    };

    const calculateMetrics = () => {
        if (!startTime || !endTime) return { wpm: 0, accuracy: 0 };
        
        const timeInMinutes = (endTime - startTime) / 60000; // Convert to minutes
        const totalChars = typedChars.length;
        const correctChars = typedChars.filter(char => char.correct).length;
        
        // Calculate WPM (assuming average word length of 5 characters)
        const wpm = Math.round((totalChars / 5) / timeInMinutes);
        
        // Calculate accuracy
        const accuracy = Math.round((correctChars / totalChars) * 100);
        
        return { wpm, accuracy };
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isComplete) return;

        // Start timing on first keypress
        if (!startTime) {
            setStartTime(Date.now());
        }

        const currentChar = text[currentIndex];
        const typedChar = e.key;

        if (typedChar === currentChar) {
            // Correct character typed
            setTypedChars(prev => [...prev, { char: typedChar, correct: true }]);
            setCurrentIndex(prev => prev + 1);

            // Check if we've completed the text
            if (currentIndex === text.length - 1) {
                setIsComplete(true);
                setEndTime(Date.now());
                onComplete?.();
            }
        } else {
            // Incorrect character typed
            setTypedChars(prev => [...prev, { char: typedChar, correct: false }]);
            setCurrentIndex(prev => prev + 1); // Move cursor along even with incorrect character
        }
    };

    const handleBackspace = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setTypedChars(prev => prev.slice(0, -1));
        }
    };

    // Split text into words while preserving spaces
    const words = text.split(/(\s+)/);
    let currentCharIndex = 0;
    const { wpm, accuracy } = calculateMetrics();

    return (
        <div 
            ref={containerRef}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    resetLevel();
                    return;
                }
                if (e.key === 'Backspace') {
                    handleBackspace(e);
                } else if (e.key.length === 1) { // Only handle single character keys
                    handleKeyDown(e);
                }
            }}
            className="w-full mx-auto p-6 focus:outline-none"
        >
            <div className="relative p-4">
                <div className="w-2/3 mx-auto text-3xl font-mono">
                    {words.map((word, wordIndex) => (
                        <span key={wordIndex} className="inline-block">
                            {word.split('').map((char, charIndex) => {
                                const isCurrentChar = currentCharIndex === currentIndex;
                                const isTyped = currentCharIndex < currentIndex;
                                const isCorrect = typedChars[currentCharIndex]?.correct ?? true;
                                const isSpace = char === ' ';
                                const isLastChar = charIndex === word.length - 1;

                                const charElement = (
                                    <span
                                        key={charIndex}
                                        className={`
                                            inline-block relative
                                            ${isSpace ? 'w-[1.2ch]' : 'w-[1ch]'}
                                            ${isTyped ? 'text-gray-600' : ''}
                                            ${!isCorrect ? 'text-red-500' : ''}
                                            ${isCurrentChar ? `
                                                before:absolute before:left-0 before:top-0 before:w-full before:h-full 
                                                before:border-l-2 before:border-black before:animate-pulse 
                                                before:transition-[transform,opacity] before:duration-700
                                                before:ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                                                before:transform before:translate-x-0 before:scale-y-102 
                                                before:opacity-90 hover:before:opacity-100
                                            ` : ''}
                                            ${!isLastChar ? 'mr-[0.1ch]' : ''}
                                        `}
                                    >
                                        {isSpace ? '\u00A0' : char}
                                    </span>
                                );

                                currentCharIndex++;
                                return charElement;
                            })}
                        </span>
                    ))}
                </div>
                {isComplete && (
                    <div className="mt-8 text-center space-y-4">
                        <div className="text-2xl font-semibold text-gray-800">
                            Typing Results
                        </div>
                        <div className="flex justify-center space-x-8">
                            <div className="text-xl">
                                <span className="text-gray-600">WPM:</span>
                                <span className="ml-2 font-mono text-2xl">{wpm}</span>
                            </div>
                            <div className="text-xl">
                                <span className="text-gray-600">Accuracy:</span>
                                <span className="ml-2 font-mono text-2xl">{accuracy}%</span>
                            </div>
                        </div>
                        <button
                            onClick={resetLevel}
                            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TypingSection;
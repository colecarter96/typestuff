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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Focus the container when component mounts
        containerRef.current?.focus();
    }, []);

    const resetLevel = () => {
        setCurrentIndex(0);
        setTypedChars([]);
        setIsComplete(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isComplete) return;

        const currentChar = text[currentIndex];
        const typedChar = e.key;

        if (typedChar === currentChar) {
            // Correct character typed
            setTypedChars(prev => [...prev, { char: typedChar, correct: true }]);
            setCurrentIndex(prev => prev + 1);

            // Check if we've completed the text
            if (currentIndex === text.length - 1) {
                setIsComplete(true);
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

                                // const charElement = (
                                //     <span
                                //         key={charIndex}
                                //         className={`
                                //             inline-block relative
                                //             ${isSpace ? 'w-[1.2ch]' : 'w-[1ch]'}
                                //             ${isTyped ? 'text-gray-600' : ''}
                                //             ${!isCorrect ? 'text-red-500' : ''}
                                //             ${isCurrentChar ? 'before:absolute before:left-0 before:top-0 before:w-full before:h-full before:border-l-2 before:border-black before:animate-pulse before:transition-[transform,opacity] before:duration-500 before:ease-[cubic-bezier(0.25, 1, 0.5, 1)] before:transform before:translate-x-0 before:scale-y-100 hover:before:translate-x-[0.5px] hover:before:scale-y-105' : ''}
                                //             ${!isLastChar ? 'mr-[0.1ch]' : ''}
                                //         `}
                                //     >
                                //         {isSpace ? '\u00A0' : char}
                                //     </span>
                                // );

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
            </div>
        </div>
    );
};

export default TypingSection;
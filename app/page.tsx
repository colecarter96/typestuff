"use client";
import Header from "./components/Header";
import TypingSection from "./components/typingSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-8">
        <TypingSection 
          text="Welcome to typestuff! This is a level oriented typing game that will test your typing speed, accuracy, editing, and more. At any point you can 
          click tab to restart the current level."
          onComplete={() => console.log('Level completed!')}
        />
      </div>
    </main>
  );
}

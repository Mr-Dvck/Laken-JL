"use client";

import { useEffect, useState } from "react";
import { getGreeting, randomEncouragement } from "@/lib/utils";

export default function LakenGreeting() {
  const [greeting, setGreeting] = useState({ greeting: "Hello", emoji: "💕" });
  const [encouragement, setEncouragement] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setEncouragement(randomEncouragement());
  }, []);

  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-800 mb-2">
        {greeting.emoji} {greeting.greeting},{" "}
        <span className="text-laken-500">Laken</span>!
      </h1>
      <p className="text-gray-500 text-lg animate-pulse-soft">
        {encouragement}
      </p>
    </div>
  );
}

import { useMemo, useState } from "react";
import "./App.css";

import TowerHeader from "./components/TowerHeader";
import AuthCard from "./components/AuthCard";
import GenerationView from "./components/GenerationView";

import { makeOneGeneration, INITIAL_ATTEMPTS, callLabels, callPrefaces } from "./utils/generator";
import type { Generation } from "./utils/generator";

function App() {
    const [enteredId, setEnteredId] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [attemptsLeft, setAttemptsLeft] = useState<number>(INITIAL_ATTEMPTS);
    const [generations, setGenerations] = useState<Generation[]>([]);

    // Default: show only the latest. At the end, user can reveal all.
    const [showAll, setShowAll] = useState<boolean>(false);

    function handleEnterSite() {
        const userId = enteredId.trim();
        if (!userId) return;
        setIsAuthenticated(true);
    }

    function getTask() {
        if (!isAuthenticated) return;
        if (attemptsLeft <= 0) return;

        const newGen = makeOneGeneration();
        setGenerations((prev) => [...prev, newGen]);
        setAttemptsLeft((prev) => prev - 1);
        setShowAll(false);
    }

    const callButtonText = useMemo(() => {
        const used = INITIAL_ATTEMPTS - attemptsLeft; // 0..3
        if (used <= 0) return "Heed the Tower's Call!";
        if (used === 1) return "Heed the Tower's Call again";
        if (used === 2) return "Heed the Tower's Call a third time";
        return "The Tower is silent";
    }, [attemptsLeft]);

    const latestIndex = generations.length - 1;
    const latestGen = latestIndex >= 0 ? generations[latestIndex] : null;

    const canRevealAllAtEnd = attemptsLeft === 0 && generations.length > 0 && !showAll;

    return (
        <div className="app-body">
            <TowerHeader />

            {!isAuthenticated ? (
                <div className="auth-container">
                    <AuthCard
                        enteredId={enteredId}
                        setEnteredId={setEnteredId}
                        onEnter={handleEnterSite}
                    />
                </div>
            ) : (
                <>
                    <div className="TowerTitle">Adventures in Dreamland!</div>

                    <div className="TowerMain">
                        <i>
                            The night grows old and you are weary. Your waking hours have been spent in the service of the Tower,
                            aiding your coven. Bleary-eyed, you climb the Tower stairs, feet dragging. All you can think about is
                            sleep. Once you reach your chambers, you kick off your shoes and collapse into bed. But as you drift off
                            to sleep, the Tower beckons; it is not done with you yet. You find yourself in a dream where things are
                            not as they seem in the waking world&mdash;and you have been given a task.
                            <br />
                            <br />
                            You get your bearings, and in your head, the Tower whispers your mission.
                        </i>
                    </div>

                    <div className="card">
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                            <button onClick={getTask} disabled={attemptsLeft === 0}>
                                {callButtonText}
                            </button>

                            {canRevealAllAtEnd && (
                                <button onClick={() => setShowAll(true)} type="button">
                                    Reveal all calls
                                </button>
                            )}
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <GenerationView
                                showAll={showAll}
                                generations={generations}
                                latestGen={latestGen}
                                latestIndex={latestIndex}
                                callLabels={callLabels}
                                callPrefaces={callPrefaces}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;

import { useMemo, useState } from "react";
import './index.css'
import './App.css'
import TowerHeader from "./components/TowerHeader";
import AuthCard from "./components/AuthCard";
import GenerationView from "./components/GenerationView";
import { getUserPromptCount, getUserPrompts, makeOneGeneration, INITIAL_ATTEMPTS, callLabels, callPrefaces } from "./utils/generator";
import type { Generation } from "./utils/generator";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyoLN_Lumr71jGChzbn4VJxfoYkdMqIMw_uvIBnK3AGNKvLx-JAaTy8-XAsq1ZOc5SaVw/exec";

function logEvent(robId: string, event: string, character?: string, location?: string, object?: string) {
    const params = new URLSearchParams({
        timestamp: new Date().toISOString(),
        robId,
        event,
        character: character ?? "",
        location: location ?? "",
        object: object ?? "",
    });
    fetch(`${APPS_SCRIPT_URL}?${params.toString()}`).catch(console.error);
}

function App() {
    const [enteredId, setEnteredId] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [attemptsLeft, setAttemptsLeft] = useState<number>(INITIAL_ATTEMPTS);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generationError, setGenerationError] = useState<string>("");

    const [showAll, setShowAll] = useState<boolean>(false);

    function handleEnterSite() {
        const userId = enteredId.trim();
        if (!userId) return;
        setGenerationError("");
        setIsAuthenticated(true);
        logEvent(userId, "Enter Site");
    }

    async function getTask() {
        if (!isAuthenticated) return;
        if (attemptsLeft <= 0 || isGenerating) return;

        const userId = enteredId.trim();
        if (!userId) return;

        setGenerationError("");
        setIsGenerating(true);

        try {
            const promptCount = await getUserPromptCount(userId);

            if (promptCount >= INITIAL_ATTEMPTS) {
                const existingPrompts = await getUserPrompts(userId);
                setGenerations(existingPrompts);
                setAttemptsLeft(0);
                setShowAll(true);
                setGenerationError("You already have 3 prompts for today. Showing all of today's prompts.");
                return;
            }

            const newGen = await makeOneGeneration(userId);
            const callLabel = callLabels[promptCount] ?? `Call ${promptCount + 1}`;
            logEvent(userId, callLabel, newGen.character, newGen.location, newGen.taskObject);
            setGenerations((prev) => [...prev, newGen]);
            setAttemptsLeft(INITIAL_ATTEMPTS - (promptCount + 1));
            setShowAll(false);
        } catch (error) {
            console.error("Failed to generate prompt", error);
            setGenerationError(error instanceof Error ? error.message : "Failed to generate prompt.");
        } finally {
            setIsGenerating(false);
        }
    }

    const callButtonText = useMemo(() => {
        const used = INITIAL_ATTEMPTS - attemptsLeft;
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
                            The night grows old, and you are weary. Your waking hours have been spent in service to the Tower, aiding your coven. Bleary-eyed, you climb the Tower stairs, feet dragging, thinking only of sleep.
                            <p></p>
                            At last, you reach your chambers. You kick off your shoes and collapse into bed. But just as you begin to drift off to sleep, the Tower beckons—it is not finished with you yet.
                            <p></p>
                            You find yourself in a dream where things are not as they seem in the waking world, and you have been given a task. You steady yourself, get your bearings, and in your mind, the Tower whispers your mission.
                            <p></p>
                            You get your bearings, and in your head, the Tower whispers your mission.
                        </i>
                    </div>

                    <div className="card">
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                            <button onClick={() => void getTask()} disabled={attemptsLeft === 0 || isGenerating}>
                                {isGenerating ? "The Tower speaks..." : callButtonText}
                            </button>

                            {canRevealAllAtEnd && (
                                <button onClick={() => setShowAll(true)} type="button">
                                    Reveal all calls
                                </button>
                            )}
                        </div>

                        {generationError ? (
                            <div style={{ marginTop: 12, textAlign: "center" }}>
                                <i>{generationError}</i>
                            </div>
                        ) : null}

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
import { useMemo, useState } from "react";
import towerHeader from "/TowerHeaderSmallerer.png";
import "./App.css";

type Generation = { character: string; location: string; taskObject: string };

const INITIAL_ATTEMPTS = 3;

function secureRandomInt(maxExclusive: number): number {
    if (maxExclusive <= 0) return 0;

    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] % maxExclusive;
    }

    return Math.floor(Math.random() * maxExclusive);
}

function getRandomKeyFromMap<K, V>(map: Map<K, V>): K {
    const keys = Array.from(map.keys());
    return keys[secureRandomInt(keys.length)];
}

const CharacterMap = new Map<number, string>([
    [1, "a clumsy wizard"],
    [2, "a fairy with two different-shaped wings"],
    [3, "a ghost who can't go through walls"],
    [4, "a ghost with unfinished business in the Tower"],
    [5, "a lawyer who plays the harmonica"],
    [6, "a merperson with a sweet tooth"],
    [7, "a pirate who wears a fedora"],
    [8, "a pirate with two eye patches"],
    [9, "a knight wearing weather-inappropriate shoes"],
    [10, "a troll wearing a hand-knit hat"],
    [11, "a unicorn with three horns having an identity crisis"],
    [12, "a witch with a Sony Walkman that keeps skipping"],
    [13, "an escaped circus lion turned into a person"],
    [14, "the mayor, who wears a silly cape,"],
    [15, "the Tower's window washer"],
    [16, "the Tower's dungeon master after a night out"],
    [17, "the Tower's landscaper"],
    [18, "a RoB player sucked into the game"],
    [19, "a clown obsessed with traffic laws"],
    [20, "a fae with a knee brace"],
    [21, "a knight afraid of the dark"],
    [22, "a demon on hold with customer service"],
    [23, "a prophet who lost their keys"],
    [24, "a witch expecting a package soon"],
    [25, "a dragon afraid of heights"],
    [26, "a ghost learning another language over the shoulder of the person they're haunting"],
    [27, "a bard taking night classes to learn algebra"],
    [28, "a necromancer trying to come up with the perfect response to a past arguement"],
    [29, "a snail granted legs by their fairy godmother"],
    [30, "a knight with two left feet"],
    [31, "a vampire who wears a jangly jester hat"],
    [32, "a person slowly but surely turning into a rubber duck"],
    [33, "a priest with marital problems"],
    [34, "a goblin with a hula hoop"],
    [35, "a unicorn obsessed with horror movies"],
    [36, "a king who really needs a nap"],
    [37, "a leprechaun bodybuilder"],
    [38, "a dwarf with a new manicure"],
    [39, "an elf with a cold"],
    [40, "a robot jewel-thief"],
    [41, "a vampire fratboy"],
    [42, "a giant who's read too many romance novels"],
    [43, "a nymph with a mango smoothie"],
    [44, "someone who just changed a tyre"],
    [45, "a werewolf obsessively taking selfies"],
    [46, "a prince with a mug of hot chocolate"],
    [47, "a witch with a corporate job"],
    [48, "a princess who can't turn on the vacuum cleaner"],
    [49, "a living suit of armour who longs to taste food"],
    [50, "a gremlin who's really into crosstrek"],
    [51, "a harpy who plays cello"],
    [52, "a vampire really into scrapbooking"],
    [53, "a robot currently learning how to drive"],
    [54, "an elf in the middle of carving a pumpkin"],
    [55, "a witch late to a birthday party"],
    [56, "a vampire cardshark"],
    [57, "a werewolf with a love of perfume"],
    [58, "a human with a plasma launcher"],
    [59, "a wizard who is always sick"],
    [60, "a robot in a badly styled wig"],
    [61, "a prince dressed like a bear"],
    [62, "a dwarf in a videochat with their mom"],
]);

const LocationMap = new Map<number, string>([
    [1, "the Dead City"],
    [2, "Vaden Hill"],
    [3, "Green Wood"],
    [4, "Ghost Town"],
    [5, "Spring Valley"],
    [6, "Death's Sanctuary"],
    [7, "the Realm of the Priestess"],
    [8, "the Magician's Abode"],
    [9, "the Lake of Awe"],
    [10, "the summit of Mount Tilia"],
    [11, "the base of Mount Tilia"],
    [12, "the caves under the Tower"],
    [13, "Redvale"],
    [14, "the Shack beside Petrik's"],
    [15, "across the road from Thermoden"],
    [16, "the Ghost Town landfill"],
    [17, "Mount Tilia"],
]);

const ObjectMap = new Map<number, string>([
    [1, "The Hanged Man's favorite piece of chalk"],
    [2, "The Queen of Swords' favorite katana"],
    [3, "Temperance's favorite set of cups"],
    [4, "The High Priestess' tome"],
    [5, "The Lover's Jar of Hearts"],
    [6, "The Hierophant's favorite dagger"],
    [7, "Justice's scales"],
    [8, "the key to that new weird door in the basement"],
    [9, "the left front door knocker"],
    [10, "the gardener's poison-resistant gloves"],
    [11, "the librarian's glasses' chain"],
    [12, "the maid's magic feather duster"],
    [13, "an ancient rusty sword from the armoury"],
    [14, "the dungeon cleaner's mop"],
    [15, "a strength potion from the coven storage"],
    [16, "a sack of gold from the coven vault"],
    [17, "the deed to the Tower"],
    [18, "de-icing salt for the stairs leading up to the Tower"],
    [19, "the dungeon masters' ring of teething keys for his young child"],
    [20, "the old crone's dentures"],
    [21, "the guard's back brace"],
    [22, "a suspicious piece of silver"],
    [23, "a lucky zinc-copper disc with a face on it"],
    [24, "a bat-sized coffin"],
    [25, "the key that locks a door no one can find anymore"],
    [26, "a raven feather quill that never runs out of ink"],
    [27, "an idol of an unknown god with the face worn away"],
    [28, "a shipwreck in a bottle"],
    [29, "a chair that faces the wrong way"],
    [30, "a key that has been turned too many times"],
    [31, "a candle that is always lit at night"],
    [32, "the guard's whetstone"],
    [33, "chew toys for the monsters on Mt Tilia"],
    [34, "a map to find the Tower&mdash;which always leads you off course"],
    [35, "a deck of tarot cards that reshuffle themselves"],
    [36, "the blacksmith's fire poker"],
    [37, "a candle that has burned crooked"],
    [38, "snacks for the creature who dwells in the basement"],
    [39, "a mislabled key"],
    [40, "a music box that plays off-key"],
    [41, "a bell that rings just a fraction of a second too late"],
    [42, "the armoury's missing anti-rust spell"],
    [43, "Vincent's fish food"],
    [44, "Vincent's indigestion medicine"],
    [45, "a mysteriously missing rotted corpse"],
    [46, "a screw from under Grim's workbench"],
    [47, "Judgment's hammer"],
    [48, "Death’s pair of khopesh"],
]);

function makeOneGeneration(): Generation {
    const characterKey = getRandomKeyFromMap(CharacterMap);
    const objectKey = getRandomKeyFromMap(ObjectMap);
    const locationKey = getRandomKeyFromMap(LocationMap);

    return {
        character: CharacterMap.get(characterKey) ?? "an unknown character",
        location: LocationMap.get(locationKey) ?? "an unknown location",
        taskObject: ObjectMap.get(objectKey) ?? "an unknown object",
    };
}

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

    const callLabels = ["Call One", "Call Two", "Call Three"];
    const callPrefaces = [
        "", // Call One: no preface
        "Dissatisfied? Hm... Not all gifts are offered twice. Perhaps you would prefer:",
        "Still unsatisfied? Hm... Some doors open only when knocked thrice. Let us see what's behind this one:",
    ];

    const latestIndex = generations.length - 1;
    const latestGen = latestIndex >= 0 ? generations[latestIndex] : null;

    const canRevealAllAtEnd = attemptsLeft === 0 && generations.length > 0 && !showAll;

    return (
        <>
            <div className="app-body">
                <div>
                    <img src={towerHeader} className="header-image" alt="Tower Header" />
                </div>

                {!isAuthenticated ? (
                    <div className="auth-container">
                        <div className="card auth-card">
                            <input
                                id="idInput"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={enteredId}
                                onChange={(e) => {
                                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                                    setEnteredId(digitsOnly);
                                }}
                                placeholder="Enter your ROB ID"
                            />
                            <div className="id-submit">
                                <button onClick={handleEnterSite} disabled={!enteredId.trim()}>
                                    Find the Tower
                                </button>
                            </div>
                        </div>
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
                                {!showAll && latestGen &&
                                    (() => {
                                        const label = callLabels[latestIndex] ?? `Call ${latestIndex + 1}`;
                                        const preface = latestIndex === 0 ? "" : (callPrefaces[latestIndex] ?? "");
                                        return (
                                            <div style={{ marginBottom: 8 }}>
                                                {preface ? <i className="call-preface">"{preface}"</i> : null}
                                                <span className="call-label">{label}:</span>{" "}
                                                <span className="call-text">
                                                    Behold! You are <b>{latestGen.character}</b> who hails from <b>{latestGen.location}</b>. The
                                                    Tower has tasked you to find <b>{latestGen.taskObject}</b>.
                                                </span>
                                            </div>
                                        );
                                    })()}

                                {showAll &&
                                    generations.map((g, i) => {
                                        const label = callLabels[i] ?? `Call ${i + 1}`;
                                        const preface = i === 0 ? "" : (callPrefaces[i] ?? "");
                                        return (
                                            <div key={i} style={{ marginBottom: 8 }}>
                                                {preface ? <i className="call-preface">"{preface}"</i> : null}
                                                <span className="call-label">{label}:</span>{" "}
                                                <span className="call-text">
                                                    Behold! You are <b>{g.character}</b> who hails from <b>{g.location}</b>. The Tower has tasked
                                                    you to find <b>{g.taskObject}</b>.
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default App;

import { useState } from 'react'
import towerHeader from '/TowerHeaderSmaller.png'
import './App.css'


function App() {
    // gating
    const [enteredId, setEnteredId] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // simple visible log of entries + generation attempts
    const [logs, setLogs] = useState<
        { id: string; event: 'entry' | 'generation'; timestamp: string; details?: string }[]
    >([]);

    // allow 3 total generations (initial + 2 rerolls)
    const INITIAL_ATTEMPTS = 3;
    const [attemptsLeft, setAttemptsLeft] = useState<number>(INITIAL_ATTEMPTS);

    // keep a history of generated tasks so each remains on screen
    const [generations, setGenerations] = useState<
        { character: string; location: string; taskObject: string }[]
    >([]);

    // secure random integer in [0, max)
    function secureRandomInt(max: number): number {
        if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return array[0] % max;
        }
        // fallback
        return Math.floor(Math.random() * max);
    }

    // pick a random key from a Map (avoids relying on numeric sequential keys)
    function getRandomKeyFromMap<K, V>(map: Map<K, V>): K {
        const keys = Array.from(map.keys());
        return keys[secureRandomInt(keys.length)];
    }

    // UK localised timestamp helper
    function nowUk(): string {
        return new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    }

    const CharacterMap = new Map([
        [1, 'a clumsy wizard'],
        [2, 'a fairy with two different-shaped wings'],
        [3, "a ghost who can't go through walls"],
        [4, 'a ghost with unfinished business in the Tower'],
        [5, 'a lawyer who plays the harmonica'],
        [6, 'a merperson with a sweet tooth'],
        [7, 'a pirate who wears a fedora'],
        [8, 'a pirate with two eye patches'],
        [9, 'a knight wearing weather-inappropriate shoes'],
        [10, 'a troll wearing a hand-knit hat'],
        [11, 'a unicorn with three horns having an identity crisis'],
        [12, 'a witch with a Sony Walkman that keeps skipping'],
        [13, 'an escaped circus lion turned into a person'],
        [14, 'the mayor, who wears a silly cape,'],
        [15, "the Tower's window washer"],
        [16, "the Tower's dungeon master after a night out"],
        [17, "the Tower's landscaper"],
        [18, 'a RoB player sucked into the game'],
        [19, 'a clown obsessed with traffic laws'],
        [20, 'a fae with a knee brace'],
        [21, 'a knight afraid of the dark'],
        [22, 'a demon on hold with customer service'],
        [23, 'a prophet who lost their keys'],
        [24, 'a witch expecting a package soon'],
        [25, 'a dragon afraid of heights'],
        [26, "a ghost learning another language over the shoulder of the person they're haunting"],
        [27, 'a bard taking night classes to learn algebra'],
        [28, 'a necromancer trying to come up with the perfect response to a past arguement'],
        [29, 'a snail granted legs by their fairy godmother'],
        [30, 'a knight with two left feet'],
        [31, 'a vampire who wears a jangly jester hat'],
    ]);

    const LocationMap = new Map([
        [1, 'the Dead City'],
        [2, 'Vaden Hill'],
        [3, 'Green Wood'],
        [4, 'Ghost Town'],
        [5, 'Spring Valley'],
        [6, "Death's Sanctuary"],
        [7, 'the Realm of the Priestess'],
        [8, "the Magician's Abode"],
        [9, 'the Lake of Awe'],
        [10, 'the summit of Mount Tilia'],
        [11, 'the base of Mount Tilia'],
        [12, 'the caves under the Tower'],
        [13, 'Redvale'],
        [14, "the Shack beside Petrik's"],
        [15, 'across the road from Thermoden'],
        [16, 'the Ghost Town landfill'],
        [17, 'Mount Tilia'],
    ]);

    const ObjectMap = new Map([
        [1, "The Hanged Man's favorite piece of chalk"],
        [2, "The Queen of Swords' favorite katana"],
        [3, "Temperance's favorite set of cups"],
        [4, "The High Priestess' tome"],
        [5, "The Lover's Jar of Hearts"],
        [6, "The Hierophant's favorite dagger"],
        [7, "Justice's scales"],
        [8, "the key to that new weird door in the basement"],
        [9, "the front left door knocker"],
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
    ]);

    // called when user submits their ID to enter
    function handleEnterSite() {
        if (!enteredId.trim()) return;
        const timestamp = nowUk();
        const entryLog = { id: enteredId.trim(), event: 'entry' as const, timestamp, details: 'Site entered' };
        setLogs(prev => [...prev, entryLog]);
        console.log('Gate log:', entryLog);
        setIsAuthenticated(true);
    }

    const getTask = () => {
        if (!isAuthenticated) return;
        if (attemptsLeft > 0) {
            const characterKey = getRandomKeyFromMap(CharacterMap);
            const objectKey = getRandomKeyFromMap(ObjectMap);
            const locationKey = getRandomKeyFromMap(LocationMap);

            const characterRandom = CharacterMap.get(characterKey) ?? 'an unknown character';
            const objectRandom = ObjectMap.get(objectKey) ?? 'an unknown object';
            const locationRandom = LocationMap.get(locationKey) ?? 'an unknown location';

            const newGen = {
                character: characterRandom,
                location: locationRandom,
                taskObject: objectRandom,
            };

            setGenerations(prev => [...prev, newGen]);
            setAttemptsLeft(prev => prev - 1);

            // log the generation attempt with UK time and entered id
            const genTimestamp = nowUk();
            const genLog = {
                id: enteredId.trim(),
                event: 'generation' as const,
                timestamp: genTimestamp,
                details: `Call ${generations.length + 1} generated: ${characterRandom} / ${locationRandom} / ${objectRandom}`,
            };
            setLogs(prev => [...prev, genLog]);
            console.log('Generation log:', genLog);
        }
    }

    function handleLogout() {
        setIsAuthenticated(false);
        setEnteredId('');
        // preserve logs but you can clear if you prefer
    }

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
                            value={enteredId}
                            onChange={e => setEnteredId(e.target.value)}
                            placeholder="Enter your ROB ID"
                          />
                          <div className="id-submit">
                              <button onClick={handleEnterSite} disabled={!enteredId.trim()}>
                                  Find the Tower
                              </button>
                          </div>

                          {logs.length > 0 && (
                              <div style={{ marginTop: 12, textAlign: 'left', maxWidth: 720, margin: '12px auto 0' }}>
                                  <b>Recent logs</b>
                                  <ul>
                                      {logs.slice(-5).map((l, idx) => (
                                          <li key={idx}>
                                              [{l.timestamp}] <b>{l.id}</b> — {l.event} {l.details ? `— ${l.details}` : ''}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="TowerTitle">
                          Adventures in Dreamland!
                      </div>
                      <div className="TowerMain">
                          <i>The night grows old and you are weary. Your waking hours have been spent in the service of the Tower, aiding your coven. Bleary-eyed, you climb the Tower stairs, feet dragging. All you can think about is sleep. Once you reach your chambers, you kick off your shoes and collapse into bed. But as you drift off to sleep, the Tower beckons; it is not done with you yet. You find yourself in a dream where things are not as they seem in the waking world&mdash;and you have been given a task.
                              <br />
                              <br />You get your bearings, and in your head, the Tower whispers your mission. </i>
                      </div>

                      <div className="card">
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                              <button onClick={() => getTask()} disabled={attemptsLeft === 0}>
                                  Heed the Tower's Calls!
                              </button>
                          </div>

                          <div style={{ marginTop: 12 }}>
                              {generations.length > 0 && (() => {
                                  const callLabels = ['Call One', 'Call Two', 'Call Three'];
                                  return generations.map((g, i) => (
                                      <div key={i} style={{ marginBottom: 8 }}>
                                          <b className="call-label">{callLabels[i] ?? `Call ${i + 1}`}:</b> <span className="call-text">Behold! You are <b>{g.character}</b> who hails from <b>{g.location}</b>. The Tower has tasked you to find <b>{g.taskObject}</b>.</span>
                                      </div>
                                  ));
                              })()}
                          </div>

                          <div style={{ marginTop: 12, textAlign: 'left', maxWidth: 720, margin: '12px auto 0' }}>
                              <b>Activity log</b>
                              <ul>
                                  {logs.map((l, idx) => (
                                      <li key={idx}>
                                          [{l.timestamp}] <b>{l.id}</b> — {l.event} {l.details ? `— ${l.details}` : ''}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </>
              )}
          </div>
    </>
  )
}

export default App

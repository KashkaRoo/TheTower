import { useState } from 'react'
import towerHeader from '/TowerHeader.jpg'
import './App.css'


function App() {
    //const [count, setCount] = useState(0)
    const [character, setCharacter] = useState<string | undefined>(undefined);
    const [object, setObject] = useState<string | undefined>(undefined);
    const [location, setLocation] = useState<string | undefined>(undefined);
    const [assigned, setAssigned] = useState(Boolean(false));
    function getRandomIndexFromMap<K, V>(map: Map<K, V>): number {
        return Math.floor(Math.random() * map.size) + 1;
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
        [26, "a ghost learning Spanish over the shoulder of the person they're haunting"],
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
        [23, "a lucky piece of a zinc-copper disc with a face on it"],
    ]);

    const getTask = () => {
        if (!assigned) {
            const characterRandom = CharacterMap.get(getRandomIndexFromMap(CharacterMap));
            const objectRandom = ObjectMap.get(getRandomIndexFromMap(ObjectMap));
            const locationRandom = LocationMap.get(getRandomIndexFromMap(LocationMap));

            setCharacter(characterRandom);
            setObject(objectRandom);
            setLocation(locationRandom);
            setAssigned(true);
        }
        return 
    }


  return (
      <>
          <body className="app-body">
              <div>
                  <img src={towerHeader} className="header-image" alt="Tower Header" />
              </div>
              <div className="TowerTitle">
                  Adventures in Dreamland!
              </div>
              <div className="TowerBody">
                  <i>The night grows old and you are weary. Your waking hours have been spent in the service of the Tower, aiding your coven. Bleary-eyed, you climb the Tower stairs, feet dragging. All you can think about is sleep. Once you reach your chambers, you kick off your shoes and collapse into bed. But as you drift off to sleep, the Tower beckons; it is not done with you yet. You find yourself in a dream where things are not as they seem in the waking world&mdash;and you have been given a task.
                      <br />
                      <br />You get your bearings, and in your head, the Tower whispers your mission. </i>
              </div>
              <div className="card">
                  <button  onClick={() => getTask()}>
                      Heed the Tower's call!
                  </button>
                  <p>
                      {assigned && (
                          <>
                          Behold! You are <b>{character}</b> who hails from <b>{location}</b>. The Tower has tasked you to find <b>{object}</b>.
                          </>
                      )
                      }

                      
                  </p>
              </div>
          </body>

    </>
  )
}

export default App

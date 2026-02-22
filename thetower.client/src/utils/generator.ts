export type Generation = { character: string; location: string; taskObject: string };

export const INITIAL_ATTEMPTS = 3;

function secureRandomInt(maxExclusive: number): number {
    if (maxExclusive <= 0) return 0;

    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
        const array = new Uint32Array(1);
        // @ts-ignore
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

export function makeOneGeneration(): Generation {
    const characterKey = getRandomKeyFromMap(CharacterMap);
    const objectKey = getRandomKeyFromMap(ObjectMap);
    const locationKey = getRandomKeyFromMap(LocationMap);

    return {
        character: CharacterMap.get(characterKey) ?? "an unknown character",
        location: LocationMap.get(locationKey) ?? "an unknown location",
        taskObject: ObjectMap.get(objectKey) ?? "an unknown object",
    };
}

export const callLabels = ["Call One", "Call Two", "Call Three"];
export const callPrefaces = [
    "",
    "Dissatisfied? Hm... Not all gifts are offered twice. Perhaps you would prefer:",
    "Still unsatisfied? Hm... Some doors open only when knocked thrice. Let us see what's behind this one:",
];

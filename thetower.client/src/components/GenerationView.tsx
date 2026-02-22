import type { Generation } from "../utils/generator";

interface Props {
    showAll: boolean;
    generations: Generation[];
    latestGen: Generation | null;
    latestIndex: number;
    callLabels: string[];
    callPrefaces: string[];
}

export default function GenerationView({ showAll, generations, latestGen, latestIndex, callLabels, callPrefaces }: Props) {
    if (!showAll && latestGen) {
        const label = callLabels[latestIndex] ?? `Call ${latestIndex + 1}`;
        const preface = latestIndex === 0 ? "" : (callPrefaces[latestIndex] ?? "");
        return (
            <div style={{ marginBottom: 8 }}>
                {preface ? <i className="call-preface">"{preface}"</i> : null}
                <span className="call-label">{label}:</span>{" "}
                <span className="call-text">
                    Behold! You are <b>{latestGen.character}</b> who hails from <b>{latestGen.location}</b>. The Tower has tasked you to find <b>{latestGen.taskObject}</b>.
                </span>
            </div>
        );
    }

    return (
        <>
            {generations.map((g, i) => {
                const label = callLabels[i] ?? `Call ${i + 1}`;
                const preface = i === 0 ? "" : (callPrefaces[i] ?? "");
                return (
                    <div key={i} style={{ marginBottom: 8 }}>
                        {preface ? <i className="call-preface">"{preface}"</i> : null}
                        <span className="call-label">{label}:</span>{" "}
                        <span className="call-text">
                            Behold! You are <b>{g.character}</b> who hails from <b>{g.location}</b>. The Tower has tasked you to find <b>{g.taskObject}</b>.
                        </span>
                    </div>
                );
            })}
        </>
    );
}

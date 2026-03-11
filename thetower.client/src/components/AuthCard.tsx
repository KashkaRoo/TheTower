import type { ChangeEvent } from "react";

interface Props {
    enteredId: string;
    setEnteredId: (v: string) => void;
    onEnter: () => void;
}

export default function AuthCard({ enteredId, setEnteredId, onEnter }: Props) {
    return (
        <div className="card auth-card">
            <input
                id="idInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={enteredId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setEnteredId(digitsOnly);
                }}
                placeholder="Enter your ROB ID"
            />
            <div className="id-submit">
                <button onClick={onEnter} disabled={!enteredId.trim()}>
                    Find the Tower
                </button>
            </div>
        </div>
    );
}

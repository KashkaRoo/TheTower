export type Generation = { character: string; location: string; taskObject: string };

type GenerationPromptResponse = {
    character?: { id?: number; name?: string | null };
    location?: { id?: number; name?: string | null };
    item?: { id?: number; name?: string | null };
};

type PromptCountResponse = {
    promptCount?: number;
};

type PromptListResponseItem = {
    character?: { id?: number; name?: string | null };
    location?: { id?: number; name?: string | null };
    item?: { id?: number; name?: string | null };
};

const generatePromptEndpoint = "https://towerapi-bxdrc5dthbdjhmb3.westus2-01.azurewebsites.net/api/Generation/generateprompt";
const promptApiBaseEndpoint = "https://towerapi-bxdrc5dthbdjhmb3.westus2-01.azurewebsites.net/api/Prompt/user";

export const INITIAL_ATTEMPTS = 3;

function normalizeUserId(userId: string | number): string {
    const value = String(userId).trim();

    if (!/^\d+$/.test(value)) {
        throw new Error("User ID must be numeric.");
    }

    return value;
}

function getName(value: string | null | undefined, fallback: string): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : fallback;
}

function toGeneration(item: PromptListResponseItem): Generation {
    return {
        character: getName(item.character?.name, "an unknown character"),
        location: getName(item.location?.name, "an unknown location"),
        taskObject: getName(item.item?.name, "an unknown object"),
    };
}

export async function getUserPromptCount(userId: string | number): Promise<number> {
    const normalizedUserId = normalizeUserId(userId);
    const response = await fetch(`${promptApiBaseEndpoint}/${encodeURIComponent(normalizedUserId)}/count`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Prompt count check failed with status ${response.status}.`);
    }

    const payload = await response.json() as PromptCountResponse;
    return Number.isFinite(payload.promptCount) ? Number(payload.promptCount) : 0;
}

export async function getUserPrompts(userId: string | number): Promise<Generation[]> {
    const normalizedUserId = normalizeUserId(userId);
    const response = await fetch(`${promptApiBaseEndpoint}/${encodeURIComponent(normalizedUserId)}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Fetching prompts failed with status ${response.status}.`);
    }

    const payload = await response.json() as PromptListResponseItem[];
    if (!Array.isArray(payload)) {
        return [];
    }

    return payload.map(toGeneration);
}

export async function makeOneGeneration(userId: string | number): Promise<Generation> {
    const normalizedUserId = normalizeUserId(userId);
    const response = await fetch(`${generatePromptEndpoint}/${encodeURIComponent(normalizedUserId)}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        let detail = "";

        try {
            const errorPayload = await response.json() as { message?: string };
            detail = errorPayload.message?.trim() ?? "";
        } catch {
            detail = response.statusText;
        }

        throw new Error(detail || `Prompt generation failed with status ${response.status}.`);
    }

    const payload = await response.json() as GenerationPromptResponse;

    return {
        character: getName(payload.character?.name, "an unknown character"),
        location: getName(payload.location?.name, "an unknown location"),
        taskObject: getName(payload.item?.name, "an unknown object"),
    };
}

export const callLabels = ["Call One", "Call Two", "Call Three"];
export const callPrefaces = [
    "",
    "Dissatisfied? Hm... Not all gifts are offered twice. Perhaps you would prefer:",
    "Still unsatisfied? Hm... Some doors open only when knocked thrice. Let us see what's behind this one:",
];

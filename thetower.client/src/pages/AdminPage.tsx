import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const GENERATION_API_BASE = "https://towerapi-bxdrc5dthbdjhmb3.westus2-01.azurewebsites.net/api/Generation";
const MAX_CREDENTIAL_LENGTH = 64;
const SAFE_CREDENTIAL_PATTERN = /^[A-Za-z0-9@._-]{1,64}$/;
const SQL_LIKE_PATTERN = /('|"|;|--|\/\*|\*\/|\b(OR|AND|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|EXEC)\b)/i;

type AddOption = "Character" | "Location" | "Object";
type EntityListItem = { id?: number; name?: string | null };
type EntityListRow = { id: number; name: string };

const addOptionToEndpoint: Record<AddOption, string> = {
    Character: "characters",
    Location: "locations",
    Object: "items",
};

function AdminPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [addType, setAddType] = useState<AddOption>("Character");
    const [newValue, setNewValue] = useState<string>("");
    const [addStatus, setAddStatus] = useState<string>("");
    const [isSubmittingAdd, setIsSubmittingAdd] = useState<boolean>(false);
    const [listType, setListType] = useState<AddOption>("Character");
    const [listItems, setListItems] = useState<EntityListRow[]>([]);
    const [listStatus, setListStatus] = useState<string>("");
    const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedUsername = username.trim();
        const normalizedPassword = password.trim();

        const hasUnsafeCharacters =
            !SAFE_CREDENTIAL_PATTERN.test(normalizedUsername) ||
            !SAFE_CREDENTIAL_PATTERN.test(normalizedPassword);

        const looksLikeSql =
            SQL_LIKE_PATTERN.test(normalizedUsername) ||
            SQL_LIKE_PATTERN.test(normalizedPassword);

        if (hasUnsafeCharacters || looksLikeSql) {
            setErrorMessage("Invalid admin credentials.");
            setIsAuthenticated(false);
            return;
        }

        const isValid = normalizedUsername === ADMIN_USERNAME && normalizedPassword === ADMIN_PASSWORD;

        if (!isValid) {
            setErrorMessage("Invalid admin credentials.");
            setIsAuthenticated(false);
            return;
        }

        setErrorMessage("");
        setIsAuthenticated(true);
    }

    async function handleAddSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedValue = newValue.trim();
        if (!trimmedValue) {
            setAddStatus("Please enter a value to add.");
            return;
        }

        setAddStatus("");
        setIsSubmittingAdd(true);

        try {
            const endpoint = addOptionToEndpoint[addType];
            const response = await fetch(`${GENERATION_API_BASE}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(trimmedValue),
            });

            if (!response.ok) {
                let detail = "";
                try {
                    const payload = await response.json() as { message?: string };
                    detail = payload.message?.trim() ?? "";
                } catch {
                    detail = response.statusText;
                }

                throw new Error(detail || `Add request failed with status ${response.status}.`);
            }

            setNewValue("");
            setAddStatus(`${addType} added successfully.`);

            if (listType === addType) {
                await loadEntityList(listType);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to add value.";
            setAddStatus(message);
        } finally {
            setIsSubmittingAdd(false);
        }
    }

    async function loadEntityList(selectedType: AddOption) {
        setListStatus("");
        setIsLoadingList(true);

        try {
            const endpoint = addOptionToEndpoint[selectedType];
            const response = await fetch(`${GENERATION_API_BASE}/${endpoint}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`List request failed with status ${response.status}.`);
            }

            const payload = await response.json() as EntityListItem[];
            if (!Array.isArray(payload)) {
                setListItems([]);
                setListStatus(`No ${selectedType.toLowerCase()} values found.`);
                return;
            }

            const rows = payload
                .filter((item): item is { id: number; name: string } =>
                    typeof item.id === "number" && Number.isFinite(item.id) && typeof item.name === "string",
                )
                .map((item) => ({ id: item.id, name: item.name.trim() }))
                .filter((item) => item.name.length > 0);

            setListItems(rows);
            if (rows.length === 0) {
                setListStatus(`No ${selectedType.toLowerCase()} values found.`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to load list.";
            setListItems([]);
            setListStatus(message);
        } finally {
            setIsLoadingList(false);
        }
    }

    async function handleDeleteItem(id: number) {
        setListStatus("");
        setDeletingId(id);

        try {
            const endpoint = addOptionToEndpoint[listType];
            const response = await fetch(`${GENERATION_API_BASE}/${endpoint}/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                let detail = "";
                try {
                    const payload = await response.json() as { message?: string };
                    detail = payload.message?.trim() ?? "";
                } catch {
                    detail = response.statusText;
                }

                throw new Error(detail || `Delete request failed with status ${response.status}.`);
            }

            await loadEntityList(listType);
            setListStatus(`${listType} deleted successfully.`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete value.";
            setListStatus(message);
        } finally {
            setDeletingId(null);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) return;
        void loadEntityList(listType);
    }, [isAuthenticated, listType]);

    if (!isAuthenticated) {
        return (
            <div className="admin-page">
                <form className="admin-login-card" onSubmit={handleLogin}>
                    <h1 className="admin-title">Admin Login</h1>

                    <label className="admin-input-label" htmlFor="admin-username">Username</label>
                    <input
                        id="admin-username"
                        className="admin-input"
                        type="text"
                        autoComplete="username"
                        maxLength={MAX_CREDENTIAL_LENGTH}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />

                    <label className="admin-input-label" htmlFor="admin-password">Password</label>
                    <input
                        id="admin-password"
                        className="admin-input"
                        type="password"
                        autoComplete="current-password"
                        maxLength={MAX_CREDENTIAL_LENGTH}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    {errorMessage ? <p className="admin-error">{errorMessage}</p> : null}

                    <button type="submit" className="admin-login-button">Log In</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <h1 className="admin-title">Admin</h1>
            <p className="admin-copy">
                This area is reserved for administrative tools. Add management features here as the project grows.
            </p>

            <section className="admin-section">
                <h2 className="admin-section-title">Add</h2>

                <form className="admin-add-form" onSubmit={handleAddSubmit}>
                    <label className="admin-input-label" htmlFor="admin-add-type">Type</label>
                    <select
                        id="admin-add-type"
                        className="admin-input"
                        value={addType}
                        onChange={(event) => setAddType(event.target.value as AddOption)}
                    >
                        <option value="Character">Character</option>
                        <option value="Location">Location</option>
                        <option value="Object">Object</option>
                    </select>

                    <label className="admin-input-label" htmlFor="admin-add-value">New value</label>
                    <input
                        id="admin-add-value"
                        className="admin-input"
                        type="text"
                        value={newValue}
                        maxLength={120}
                        onChange={(event) => setNewValue(event.target.value)}
                        placeholder={`Enter new ${addType.toLowerCase()}`}
                    />

                    <button type="submit" className="admin-login-button" disabled={isSubmittingAdd}>
                        {isSubmittingAdd ? "Adding..." : `Add ${addType}`}
                    </button>

                    {addStatus ? <p className="admin-add-status">{addStatus}</p> : null}
                </form>
            </section>

            <section className="admin-section">
                <h2 className="admin-section-title">Browse</h2>

                <div className="admin-add-form">
                    <label className="admin-input-label" htmlFor="admin-list-type">Type</label>
                    <select
                        id="admin-list-type"
                        className="admin-input"
                        value={listType}
                        onChange={(event) => setListType(event.target.value as AddOption)}
                    >
                        <option value="Character">Character</option>
                        <option value="Location">Location</option>
                        <option value="Object">Object</option>
                    </select>

                    {isLoadingList ? <p className="admin-add-status">Loading {listType.toLowerCase()}...</p> : null}
                    {listStatus ? <p className="admin-add-status">{listStatus}</p> : null}

                    {!isLoadingList && listItems.length > 0 ? (
                        <div className="admin-entity-list">
                            {listItems.map((item) => (
                                <div className="admin-entity-row" key={item.id}>
                                    <span>{item.name}</span>
                                    <button
                                        type="button"
                                        className="admin-trash-button"
                                        onClick={() => void handleDeleteItem(item.id)}
                                        disabled={deletingId === item.id}
                                        aria-label={`Delete ${listType} ${item.name}`}
                                        title={`Delete ${item.name}`}
                                    >
                                        {deletingId === item.id ? "..." : "🗑"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}

export default AdminPage;

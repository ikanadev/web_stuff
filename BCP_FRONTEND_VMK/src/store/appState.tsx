import type { AppMessage } from "@/domain";
import { MessageType } from "@/domain";
import { type ParentProps, createContext, createUniqueId, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";


type AppStoreActions = {
	addMessage: (message: string, type: MessageType) => void;
	addErrorMessage: (message: string) => void;
	addWarningMessage: (message: string) => void;
	addInfoMessage: (message: string) => void;
	addSuccessMessage: (message: string) => void;
	deleteMessage: (id: string) => void;
	clearAppState: () => void;
};

type AppStore = {
	messages: AppMessage[];
} & AppStoreActions;

export const AppStateContext = createContext<AppStore>({
	messages: [],
	addMessage: () => { },
	addErrorMessage: () => { },
	addWarningMessage: () => { },
	addInfoMessage: () => { },
	addSuccessMessage: () => { },
	deleteMessage: () => { },
	clearAppState: () => { },
});

export function AppStateProvider(props: ParentProps) {
	const [messages, setMessages] = createStore<AppMessage[]>([]);

	const addMessage = (message: string, type: MessageType) => {
		setMessages(produce((old) => {
			old.push({ id: createUniqueId(), message, type });
		}));
	};

	const addErrorMessage = (message: string) => addMessage(message, MessageType.ERROR);
	const addWarningMessage = (message: string) => addMessage(message, MessageType.WARNING);
	const addInfoMessage = (message: string) => addMessage(message, MessageType.INFO);
	const addSuccessMessage = (message: string) => addMessage(message, MessageType.SUCCESS);

	const deleteMessage = (id: string) => {
		setMessages(produce((old) => {
			const index = old.findIndex((message) => message.id === id);
			if (index >= 0) {
				old.splice(index, 1);
			}
		}));
	};

	const clearAppState = () => {
		setMessages([]);
	};

	const store = {
		messages,
		addMessage,
		deleteMessage,
		addErrorMessage,
		addWarningMessage,
		addInfoMessage,
		addSuccessMessage,
		clearAppState,
	};

	return (
		<AppStateContext.Provider value={store}>
			{props.children}
		</AppStateContext.Provider>
	);
}

export function useAppState() {
	return useContext(AppStateContext);
}

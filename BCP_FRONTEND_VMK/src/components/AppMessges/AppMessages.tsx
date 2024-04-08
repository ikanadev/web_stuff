import { For } from "solid-js";
import { Portal } from "solid-js/web";
import { useAppState } from "@/store";
import { Alert } from "@/components";
import { TransitionGroup } from "solid-transition-group";
import "./styles.css";

export default function AppMessages() {
	const { messages, deleteMessage } = useAppState();

	return (
		<Portal>
			<div class="absolute top-0 right-0 left-0 sm:left-auto w-full sm:w-[420px] max-w-full z-10">
				<div class="flex flex-col items-center sm:items-end">
					<TransitionGroup name="message">
						<For each={messages}>
							{(message) => (
								<div class="message mx-4 mt-2">
									<Alert message={message.message} variant={message.type} onClose={() => deleteMessage(message.id)} />
								</div>
							)}
						</For>
					</TransitionGroup>
				</div>
			</div>
		</Portal>
	);
}

export enum MessageType {
	INFO = "info",
	SUCCESS = "success",
	WARNING = "warning",
	ERROR = "error",
}
export type AppMessage = {
	id: string;
	message: string;
	type: MessageType;
};

export type JSXEvent<Ev, El> = Ev & { currentTarget: El, target: Element };

import { Switch, Match, Show, JSX } from "solid-js";
import { Alert as TAlert } from "terracotta";
import { MessageType } from "@/domain";


export function Close(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
		</svg>
  )
}
export function InfoRounded(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1-8h-2V7h2z"/>
		</svg>
  )
}
export function WarningTriangle(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3M12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1m1 4h-2v-2h2z"/>
		</svg>
  )
}
export function CheckCircle(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/>
		</svg>
  )
}
export function ErrorRounded(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1 4h-2v-2h2z"/>
		</svg>
  )
}

type Props = {
	message: string;
	variant?: MessageType;
	onClose?: VoidFunction;
}

export default function Alert(props: Props) {
	return (
		<TAlert
			class="alert shadow-lg pl-4 pr-2 py-1.5 gap-1 sm:gap-4"
			classList={{
				"alert-info": props.variant === MessageType.INFO,
				"alert-success": props.variant === MessageType.SUCCESS,
				"alert-warning": props.variant === MessageType.WARNING,
				"alert-error": props.variant === MessageType.ERROR,
			}}
		>
			<Switch fallback={<InfoRounded class="text-primary text-2xl" />}>
				<Match when={props.variant === MessageType.SUCCESS}>
					<CheckCircle class="text-2xl" />
				</Match>
				<Match when={props.variant === MessageType.INFO}>
					<InfoRounded class="text-2xl" />
				</Match>
				<Match when={props.variant === MessageType.WARNING}>
					<WarningTriangle class="text-2xl" />
				</Match>
				<Match when={props.variant === MessageType.ERROR}>
					<ErrorRounded class="text-2xl" />
				</Match>
			</Switch>
			{props.message}
			<Show when={props.onClose}>
				{(onClose) => (
					<button type="button" onClick={onClose()} class="btn btn-circle btn-ghost">
						<Close class="text-2xl" />
					</button>
				)}
			</Show>
		</TAlert>
	);
}

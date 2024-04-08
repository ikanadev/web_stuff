import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: lazy(() => import("./pages/Index")),
	},
	{
		path: "/nueva_cuenta",
		component: lazy(() => import("./pages/NuevaCuenta")),
	},
	{
		path: "/movimiento",
		component: lazy(() => import("./pages/Movimiento")),
	},
	{
		path: "/transferencia",
		component: lazy(() => import("./pages/Transferencia")),
	},
	{
		path: "/cuentas",
		component: lazy(() => import("./pages/Cuentas")),
	},
	{
		path: "/cuentas/:id/movimientos",
		component: lazy(() => import("./pages/Movimientos")),
	},
	{
		path: "/*404",
		component: lazy(() => import("./pages/NotFound/NotFound")),
	},
];

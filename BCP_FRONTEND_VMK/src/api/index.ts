import { Cuenta, Moneda, Movimiento } from "@/domain";
import { api } from "./mande";

export async function getCuentas(): Promise<Array<Cuenta>> {
  return await api.get("/cuentas");
}

export type CuentaData = {
  moneda_id: string,
  nro_cuenta: string,
  tipo: string,
  nombre: string,
};
export async function guardarCuenta(data: CuentaData): Promise<void> {
  return await api.post("/cuentas", data);
}

export type MovData = {
  cuenta_id: string,
  tipo: string,
  importe: number,
};
export async function guardarMovimiento(data: MovData): Promise<void> {
  return await api.post("/movimientos", data);
}

export type TData = {
  origen_id: string;
  destino_id: string;
  importe: number;
};
export async function guardarTransferencia(data: TData): Promise<void> {
  return await api.post("/transferencia", data);
}

export async function getMonedas(): Promise<Array<Moneda>> {
  return await api.get("/monedas");
}

export async function getMovimientos(cuenta_id: string): Promise<Array<Movimiento>> {
  return await api.get(`/movimientos/${cuenta_id}`);
}


export enum TipoCuenta {
	Ahorro = "AHO",
	Corriente = "CTE",
}
export type Moneda = {
	id: string;
	nombre: string;
}
export type Cuenta = {
	nro_cuenta: string;
	tipo: TipoCuenta;
	nombre: string;
	saldo: number;
	moneda: Moneda;
}
export enum TipoMovimiento {
	Abono = "A",
	Debito = "D",
}
export type Movimiento = {
	id: number;
	tipo: TipoMovimiento;
	fecha: string;
	importe: number;
}
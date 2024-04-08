export function parseCantidad(cantidad: number): string {
  const enteros = `${Math.floor(cantidad/100)}`
  const resto = cantidad % 100;
  const decimales = (resto < 9 ? '0' : '') + resto.toString();
  return `${enteros}.${decimales}`;
}

export function esMontoValido(monto: string): boolean {
  if (monto.length < 4) return false;
  const parts = monto.split(".");
  if (parts.length != 2) return false;
  if (parts[1].length != 2) return false; // always two decimal points
  const enteros = parseInt(parts[0], 10);
  if (isNaN(enteros)) return false;
  const decimales = parseInt(parts[1], 10);
  if (isNaN(decimales)) return false;
  return true;
}

// use it only if the ammount was already validated with esMontoValido
export function parseMonto(monto: string): number {
  const parts = monto.split(".");
  const enteros = parseInt(parts[0], 10);
  const decimales = parseInt(parts[1], 10);
  return enteros * 100 + decimales;
}
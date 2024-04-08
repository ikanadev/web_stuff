from enum import Enum
from datetime import datetime

class TipoCuenta(str, Enum):
    AHORRO = "AHO"
    CORRIENTE = "CTE"


class TipoMovimiento(str, Enum):
    DEBITO = "D"
    ABONO = "A"


class Moneda:
    def __init__(self, id: str, nombre: str):
        self.id = id
        self.nombre = nombre


class Cuenta:
    def __init__(self, nro_cuenta: str, tipo: TipoCuenta, nombre: str, saldo: int):
        self.nro_cuenta = nro_cuenta
        self.tipo = tipo
        self.nombre = nombre
        self.saldo = saldo

class CuentaMoneda(Cuenta):
    def __init__(self, nro_cuenta: str, tipo: TipoCuenta, nombre: str, moneda: Moneda, saldo: int):
        super().__init__(nro_cuenta, tipo, nombre, saldo)
        self.moneda = moneda


class Movimiento:
    def __init__(self, id: int, tipo: TipoMovimiento, fecha: datetime, importe: int):
        self.id = id
        self.tipo = tipo
        self.fecha = fecha
        self.importe = importe
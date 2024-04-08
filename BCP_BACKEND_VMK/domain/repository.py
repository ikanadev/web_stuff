from datetime import datetime
from abc import ABC, abstractmethod
from .models import Moneda, TipoCuenta, TipoMovimiento, Movimiento, CuentaMoneda

class BankRepository(ABC):
    @abstractmethod
    def listar_monedas(self) -> list[Moneda]:
        pass

    @abstractmethod
    def crear_cuenta(self, moneda_id: str, nro_cuenta: str, tipo: TipoCuenta, nombre: str):
        pass

    @abstractmethod
    def listar_cuentas(self) -> list[CuentaMoneda]:
        pass

    @abstractmethod
    def crear_movimiento(self, cuenta_id: str, tipo: TipoMovimiento, fecha: datetime, importe: int):
        pass

    @abstractmethod
    def crear_transferencia(self, origen_id: str, destino_id: str, fecha: datetime, importe: int):
        pass

    @abstractmethod
    def listar_movimientos(self, cuenta_id: str) -> list[Movimiento]:
        pass
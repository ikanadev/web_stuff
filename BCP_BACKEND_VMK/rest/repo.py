from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
import domain
import math
import db

class Repository(domain.BankRepository):
    def __init__(self, db: Session):
        self.db = db

    def listar_monedas(self) -> list[domain.Moneda]:
        db_monedas = self.db.query(db.DbMoneda).all()
        monedas: list[domain.Moneda] = []
        for db_moneda in db_monedas:
            monedas.append(domain.Moneda(db_moneda.id, db_moneda.nombre))
    
        return monedas


    def crear_cuenta(self, moneda_id: str, nro_cuenta: str, tipo: domain.TipoCuenta, nombre: str):
        db_cuenta = db.DbCuenta()
        db_cuenta.nro_cuenta = nro_cuenta
        if tipo == domain.TipoCuenta.AHORRO and len(nro_cuenta) != 14:
            raise HTTPException(status_code=400, detail="Cuenta de ahorro debe tener 14 caracteres.")
        if tipo == domain.TipoCuenta.CORRIENTE and len(nro_cuenta) != 13:
            raise HTTPException(status_code=400, detail="Cuenta de ahorro debe tener 14 caracteres.")
        db_cuenta.tipo = tipo
        db_cuenta.nombre = nombre
        db_cuenta.moneda_id = moneda_id

        self.db.add(db_cuenta)
        self.db.commit()


    def listar_cuentas(self) -> list[domain.CuentaMoneda]:
        db_cuentas = self.db.query(db.DbCuenta).join(db.DbCuenta.moneda).order_by(db.DbCuenta.nombre).all()
        cuentas: list[domain.CuentaMoneda] = []
        for db_cuenta in db_cuentas:
            tipo_cuenta = domain.TipoCuenta.AHORRO
            if db_cuenta.tipo == domain.TipoCuenta.CORRIENTE:
                tipo_cuenta = domain.TipoCuenta.CORRIENTE

            cuentas.append(domain.CuentaMoneda(
                db_cuenta.nro_cuenta,
                tipo_cuenta,
                db_cuenta.nombre,
                domain.Moneda(db_cuenta.moneda.id, db_cuenta.moneda.nombre),
                db_cuenta.saldo,
            ))

        return cuentas


    def crear_movimiento(self, cuenta_id: str, tipo: domain.TipoMovimiento, fecha: datetime, importe: int):
        db_cuenta = self.db.query(db.DbCuenta).get(cuenta_id)
        if db_cuenta is None:
            raise HTTPException(status_code=400, detail=f"La cuenta {cuenta_id} no existe")

        if tipo == domain.TipoMovimiento.DEBITO and db_cuenta.saldo < importe:
            raise HTTPException(status_code=400, detail=f"La cuenta {cuenta_id} no tiene saldo suficiente")

        if tipo == domain.TipoMovimiento.DEBITO:
            db_cuenta.saldo -= importe
        else:
            db_cuenta.saldo += importe

        db_mov = db.DbMovimiento()
        db_mov.nro_cuenta = cuenta_id
        db_mov.tipo = tipo
        db_mov.importe = importe
        db_mov.fecha = fecha

        self.db.add(db_mov)
        self.db.commit()


    def crear_transferencia(self, origen_id: str, destino_id: str, fecha: datetime, importe: int):
        cuenta_origen = self.db.query(db.DbCuenta).where(db.DbCuenta.nro_cuenta == origen_id).first()
        if cuenta_origen is None:
            raise HTTPException(status_code=400, detail=f"La cuenta {origen_id} no existe")
        cuenta_destino = self.db.query(db.DbCuenta).where(db.DbCuenta.nro_cuenta == destino_id).first()
        if cuenta_destino is None:
            raise HTTPException(status_code=400, detail=f"La cuenta {destino_id} no existe")
        tipo_cambio = self.db.query(db.DbTipoCambio).where(
                db.DbTipoCambio.moneda_origen_id == cuenta_origen.moneda_id,
                db.DbTipoCambio.moneda_destino_id == cuenta_destino.moneda_id,
        ).first()
        if tipo_cambio is None:
            tipo_cambio = self.db.query(db.DbTipoCambio).where(
                db.DbTipoCambio.moneda_origen_id == cuenta_destino.moneda_id,
                db.DbTipoCambio.moneda_destino_id == cuenta_origen.moneda_id,
            ).first()
        if tipo_cambio is None:
            raise HTTPException(status_code=400, detail=f"No hay tipo de cambio entre las monedas {origen_id} y {destino_id}")

        numerador = tipo_cambio.numerador
        denominador = tipo_cambio.denominador
        if tipo_cambio.moneda_origen_id != cuenta_origen.moneda_id:
            numerador = tipo_cambio.denominador
            denominador = tipo_cambio.numerador

        total = (importe * denominador) // numerador
        if total == 0:
            raise HTTPException(status_code=400, detail=f"El minimo posible a transferir es {math.ceil(numerador / denominador)}")
        resto = (importe * denominador) % numerador
        print("Resto no convertible: ", resto)
        self.crear_movimiento(origen_id, domain.TipoMovimiento.DEBITO, fecha, importe)
        self.crear_movimiento(destino_id, domain.TipoMovimiento.ABONO, fecha, total)


    def listar_movimientos(self, cuenta_id: str) -> list[domain.Movimiento]:
        db_movs = self.db.query(db.DbMovimiento).where(db.DbMovimiento.nro_cuenta == cuenta_id).order_by(db.DbMovimiento.fecha).all()
        movs: list[domain.Movimiento] = []
        for db_mov in db_movs:
            tipo = domain.TipoMovimiento.ABONO
            if db_mov.tipo == domain.TipoMovimiento.DEBITO:
                tipo = domain.TipoMovimiento.DEBITO
            movs.append(domain.Movimiento(
                db_mov.id,
                tipo,
                db_mov.fecha,
                db_mov.importe,
            ))
        return movs
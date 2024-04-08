from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime
from sqlalchemy import ForeignKey, String

class Base(DeclarativeBase):
    pass

class DbMoneda(Base):
    __tablename__ = "moneda"
    id: Mapped[str] = mapped_column(String(3), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50))


class DbCuenta(Base):
    __tablename__ = "cuenta"
    nro_cuenta: Mapped[str] = mapped_column(String(14), primary_key=True)
    tipo: Mapped[str] = mapped_column(String(3)) # AHO, CTE
    nombre: Mapped[str] = mapped_column(String(40))
    moneda_id: Mapped[str] = mapped_column(ForeignKey("moneda.id"))
    saldo: Mapped[int] = mapped_column(default=0)

    moneda: Mapped["DbMoneda"] = relationship()
    movimientos: Mapped[list["DbMovimiento"]] = relationship(back_populates="cuenta", cascade="all, delete")


class DbMovimiento(Base):
    __tablename__ = "movimiento"
    id: Mapped[int] = mapped_column(primary_key=True)
    nro_cuenta: Mapped[str] = mapped_column(ForeignKey("cuenta.nro_cuenta"))
    tipo: Mapped[str] = mapped_column(String(1)) # D: debito, A: abono
    fecha: Mapped[datetime]
    importe: Mapped[int]

    cuenta: Mapped["DbCuenta"] = relationship(back_populates="movimientos")


class DbTipoCambio(Base):
    __tablename__ = "tipo_cambio"
    moneda_origen_id: Mapped[str] = mapped_column(ForeignKey("moneda.id"), primary_key=True)
    moneda_destino_id: Mapped[str] = mapped_column(ForeignKey("moneda.id"), primary_key=True)
    numerador: Mapped[int]
    denominador: Mapped[int]
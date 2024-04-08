from datetime import datetime
import domain
from fastapi import Depends, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from db.engine import SessionLocal
from rest.repo import Repository
from pydantic import BaseModel, Field

def get_repo():
    db = SessionLocal()
    try:
        repo = Repository(db)
        yield repo
    finally:
        db.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/monedas")
def listar_monedas(repo: Repository = Depends(get_repo)):
    return repo.listar_monedas()


class CrearCuentaData(BaseModel):
    moneda_id: str = Field(min_length=3, max_length=3)
    nro_cuenta: str = Field(min_length=13, max_length=14)
    tipo: domain.TipoCuenta
    nombre: str = Field(max_length=40)

@app.post("/cuentas")
def crear_cuenta(data: CrearCuentaData, repo: Repository = Depends(get_repo)):
    repo.crear_cuenta(data.moneda_id, data.nro_cuenta, data.tipo, data.nombre)
    return Response(status_code=201)


@app.get("/cuentas")
def listar_cuentas(repo: Repository = Depends(get_repo)):
    return repo.listar_cuentas()


class CrearMovimientoData(BaseModel):
    cuenta_id: str = Field(min_length=13, max_length=14)
    tipo: domain.TipoMovimiento
    importe: int = Field(gt=0)

@app.post("/movimientos")
def crear_movimiento(data: CrearMovimientoData, repo: Repository = Depends(get_repo)):
    now = datetime.now()
    repo.crear_movimiento(data.cuenta_id, data.tipo, now, data.importe)

@app.get("/movimientos/{cuenta_id}")
def listar_movimiento(cuenta_id: str, repo: Repository = Depends(get_repo)):
    return repo.listar_movimientos(cuenta_id)

class CrearTransferenciaData(BaseModel):
    origen_id: str = Field(min_length=13, max_length=14)
    destino_id: str = Field(min_length=13, max_length=14)
    importe: int = Field(gt=0)

@app.post("/transferencia")
def crear_transferencia(data: CrearTransferenciaData, repo: Repository = Depends(get_repo)):
    now = datetime.now()
    repo.crear_transferencia(data.origen_id, data.destino_id, now, data.importe)
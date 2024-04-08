from db import Base, engine
from rest import app

Base.metadata.create_all(engine)

start = app
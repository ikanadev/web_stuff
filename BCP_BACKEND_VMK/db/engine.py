from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# engine = create_engine("sqlite:///./sql_app.db")
# engine = create_engine('mssql+pyodbc://DEVSLB00/BD_TRANSACCIONES_VMK?driver=ODBC Driver 17 for SQL Server?Trusted_Connection=yes')
engine = create_engine("mssql+pyodbc://:@DEVSLB00/BD_TRANSACCIONES_VMK?driver=ODBC Driver 17 for SQL Server")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
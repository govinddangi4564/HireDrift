import sys
import os

# Add current directory to path so we can import models
sys.path.append(os.getcwd())

try:
    from models.base import engine
    from sqlalchemy import text
    
    print("Attempting to connect to database...")
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print(f"Connection successful! Result: {result.scalar()}")
        
except Exception as e:
    print(f"Connection failed: {e}")
    # Print environment variables (masking password)
    from dotenv import load_dotenv, find_dotenv
    load_dotenv(find_dotenv())
    
    user = os.getenv("POSTGRES_USER")
    host = os.getenv("POSTGRES_HOST")
    port = os.getenv("POSTGRES_PORT")
    db = os.getenv("POSTGRES_DB")
    print(f"User: {user}, Host: {host}, Port: {port}, DB: {db}")

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Motion Comic API Running"}
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routes.user_route import user_router
from routes.resume_route import router as resume_router
from routes.jd_route import router as jd_router
from routes.company_route import router as company_router
from routes.candidate_route import router as candidate_router
from routes.shortlist_route import router as shortlist_router
from routes.matching_route import router as matching_router

from models.base import engine, session


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    yield
    engine.dispose()
    session.close()
    print("Shutting down...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}
    )

app.include_router(user_router, prefix="/api", tags=["User"])
app.include_router(resume_router, prefix="/api", tags=["Resume"])
app.include_router(jd_router, prefix="/api", tags=["Job Descriptions"])
app.include_router(company_router, prefix="/api", tags=["Company"])
app.include_router(candidate_router, prefix="/api", tags=["Candidates"])
app.include_router(shortlist_router, prefix="/api", tags=["Shortlist"])
app.include_router(matching_router, prefix="/api", tags=["Matching"])

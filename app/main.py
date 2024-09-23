import os

from fastapi.staticfiles import StaticFiles 
from app.dramatiq import set_host
set_host()
from fastapi import FastAPI
from starlette.responses import FileResponse
from app.routes import setup_routes
from app.utils.life_cycle_handler import setup_event_handlers
from app.utils.middlewares import setup_middlewares
app = FastAPI(title="Aura")

setup_routes(app)
setup_middlewares(app)
setup_event_handlers(app)

@app.get("/")
async def read_index():
    return FileResponse("../ui/index.html")



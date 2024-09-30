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

# Get the absolute path to the UI folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UI_DIR = os.path.join(BASE_DIR, "../ui")

app.mount("/ui", StaticFiles(directory=UI_DIR),name='ui')

@app.get("/", include_in_schema=False)
async def read_index():
    return FileResponse(os.path.join(UI_DIR, "index.html"))



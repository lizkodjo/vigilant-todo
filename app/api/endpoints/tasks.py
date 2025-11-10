from fastapi import APIRouter


router = APIRouter()


@router.get("/")
async def get_tasks():
    return {"message": "Get all tasks endpoint"}


@router.post("/")
async def create_task():
    return {"message": "Create task endpoint"}

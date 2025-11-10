from fastapi import APIRouter


router = APIRouter()


@router.post("/register")
async def register_user():
    return {"message": "User registration endpoint"}


@router.post("/login")
async def login():
    return {"message": "User login endpoint"}

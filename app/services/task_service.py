from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Task).filter(Task.owner_id == user_id).offset(skip).limit(limit).all()
    )


def get_task_by_id(db: Session, task_id: int, user_id: int):
    return db.query(Task).filter(Task.id == task_id, Task.owner_id == user_id).first()


def create_task(db: Session, task: TaskCreate, user_id: int):
    db_task = Task(**task.model_dump(), owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: TaskUpdate, user_id: int):
    db_task = get_task_by_id(db, task_id, user_id)
    if db_task:
        update_date = task_update.model_dump(exclude_unset=True)
        for field, value in update_date.items():
            setattr(db_task, field, value)
            db.commit()
            db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int, user_id: int):
    db_task = get_task_by_id(db, task_id, user_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

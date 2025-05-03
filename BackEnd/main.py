from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
import docker # type: ignore

app = FastAPI()

# CORS for local development 
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:5500",  
    "http://localhost:5500"   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Docker Client Init 
docker_client = docker.from_env()

# Pydantic Schemas 
class VMBase(BaseModel):
    name: str
    memory_mb: int
    cpu_count: int
    is_active: bool

class VMModel(VMBase):
    id: int

    model_config = {
        "from_attributes": True
    }

#  DB Dependency 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_depency = Annotated[Session, Depends(get_db)]

# Create Tables 
models.Base.metadata.create_all(bind=engine)

# Routes 
@app.post("/vms", response_model=VMModel)
async def create_vm(vm: VMBase, db: db_depency):
    # 1. Create Docker container
    try:
        container = docker_client.containers.run(
            "alpine",  # or "ubuntu" or "busybox"
            name=vm.name,
            command="sleep infinity",
            detach=True,
            tty=True,
            mem_limit=f"{vm.memory_mb}m",
            cpu_period=100000,
            cpu_quota=vm.cpu_count * 100000
        )
    except docker.errors.APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker error: {e.explanation}")

    # 2. Save metadata to DB
    db_vm = models.VirtualMachine(**vm.dict(), status="running")
    db.add(db_vm)
    db.commit()
    db.refresh(db_vm)
    return db_vm

@app.get("/vms", response_model=List[VMModel])
async def read_vms(db: db_depency, skip: int = 0, limit: int = 100):
    return db.query(models.VirtualMachine).offset(skip).limit(limit).all()

@app.get("/vms/{vm_id}", response_model=VMModel)
async def read_vm(vm_id: int, db: db_depency):
    db_vm = db.query(models.VirtualMachine).filter(models.VirtualMachine.id == vm_id).first()
    if db_vm is None:
        raise HTTPException(status_code=404, detail="VM not found")
    return db_vm

@app.put("/vms/{vm_id}", response_model=VMModel)
async def update_vm(vm_id: int, vm: VMBase, db: db_depency):
    db_vm = db.query(models.VirtualMachine).filter(models.VirtualMachine.id == vm_id).first()
    if db_vm is None:
        raise HTTPException(status_code=404, detail="VM not found")

    old_name = db_vm.name
    new_name = vm.name.strip()

    if old_name != new_name:
        try:
            container = docker_client.containers.get(old_name)
            container.rename(new_name)
        except docker.errors.APIError as e:
            raise HTTPException(status_code=500, detail=f"Error renaming container: {e.explanation}")

    db_vm.name = new_name            # type: ignore
    db_vm.memory_mb = vm.memory_mb   # type: ignore
    db_vm.cpu_count = vm.cpu_count   # type: ignore
    db_vm.is_active = vm.is_active   # type: ignore
 
    db.commit()
    db.refresh(db_vm)
    return db_vm


@app.delete("/vms/{vm_id}", response_model=VMModel)
async def delete_vm(vm_id: int, db: db_depency):
    db_vm = db.query(models.VirtualMachine).filter(models.VirtualMachine.id == vm_id).first()
    if db_vm is None:
        raise HTTPException(status_code=404, detail="VM not found")

    # Try removing container
    try:
        container = docker_client.containers.get(db_vm.name)
        container.remove(force=True)
    except docker.errors.NotFound:
        pass  # container already gone
    except docker.errors.APIError as e:
        raise HTTPException(status_code=500, detail=f"Error removing container: {e.explanation}")

    db.delete(db_vm)
    db.commit()
    return db_vm

@app.patch("/vms/{vm_id}/toggle", response_model=VMModel)
async def toggle_vm_state(vm_id: int, db: db_depency):
    db_vm = db.query(models.VirtualMachine).filter(models.VirtualMachine.id == vm_id).first()
    if db_vm is None:
        raise HTTPException(status_code=404, detail="VM not found")

    try:
        container = docker_client.containers.get(db_vm.name)
        if db_vm.is_active:
            container.stop()
            db_vm.status = "stopped"  # type: ignore
        else:
            container.start()
            db_vm.status = "running"    # type: ignore
    except docker.errors.APIError as e:
        raise HTTPException(status_code=500, detail=f"Docker toggle error: {e.explanation}")

    db_vm.is_active = not db_vm.is_active  # type: ignore
    db.commit()
    db.refresh(db_vm)
    return db_vm

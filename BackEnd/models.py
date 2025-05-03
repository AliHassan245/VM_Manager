from database import Base
from sqlalchemy import Column, Integer, String, Boolean

class VirtualMachine(Base):
    __tablename__ = "virtual_machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    cpu_count = Column(Integer)
    memory_mb = Column(Integer)
    status = Column(String)  
    is_active = Column(Boolean, default=True)

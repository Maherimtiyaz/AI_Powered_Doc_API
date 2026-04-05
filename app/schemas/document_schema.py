from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: str
    file_url: str
    status: str
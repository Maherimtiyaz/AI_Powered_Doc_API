from fastapi import APIRouter, UploadFile, Depends
from app.api.deps import get_db, get_current_user
from app.services.document_service import process_document

router = APIRouter()

@router.post("/upload")
def upload_doc(file: UploadFile,
               db=Depends(get_db),
               user=Depends(get_current_user)):

    return process_document(file, db, user.id)
from app.core.database import Base, engine
from app.models.user import User
from app.models.document import Document

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Done!")

from lib.model import Application
from lib.model.database.Database import Database

from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship

Base = Database.get_declarative_base()


class Analysis(Base):
    __tablename__ = 'analysis'

    id = Column(Integer, primary_key=True)
    uuid = Column(String)
    date = Column(Date)
    application = relationship("Application")

    def __repr__(self):
        return f'<Analysis(id={self.id},uuid="{self.uuid}",date="{self.date}")>'
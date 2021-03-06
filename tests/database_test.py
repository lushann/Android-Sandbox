from sqlalchemy import Column, Integer, String, Date, create_engine, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, scoped_session

from lib.model.Application import Application
from lib.model.Url import Url
from lib.model.database.Database import Database
from lib.model.Analysis import Analysis

import uuid
import datetime

import configparser

from lib.report.ReportGenerator import ReportGenerator

if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read("../config/config.ini")

    Database.set_configuration(config)
    print(Analysis,Application,Url)

    engine = Database.get_engine()
    session_factory = sessionmaker(bind=engine)
    Session = scoped_session(session_factory)
    session = Session()
    Session.remove()


    analysis = session.query(Analysis).all()[0]
    for i in range(len(analysis.application)):
        app = Application(analysis.application[i].path)
        app.url = analysis.application[i].url
        analysis.application[i] = app

    generator = ReportGenerator()
    generator.generate(analysis,)
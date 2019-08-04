from sqlalchemy import Column, Integer, String, Date, create_engine, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

from lib.model.Application import Application
from lib.model.Url import Url
from lib.model.Key import Key
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
    Database.get_declarative_base().metadata.create_all(engine)

    url = Url("http://www.google.com/test")
    key = Key("Instance","DES")
    application = Application("/home/romain/Documents/ici/PC Backup/Reverse/Android/MyCitroënScan/base.apk")
    application2 = Application("/home/romain/Documents/ici/PC Backup/Reverse/Android/ExtractedApks/Kicéo Tickizz_biz.ixxi.bimo.kiceo.apk")
    application3 = Application("/home/romain/Documents/ici/PC Backup/Reverse/BreizhCTF/4/cryptonik.apk")
    application.url.append(url)
    application.key.append(key)
    analysis = Analysis(uuid=str(uuid.uuid4()), date=datetime.datetime.now())
    analysis.application.append(application)
    analysis.application.append(application2)
    analysis.application.append(application3)

    Session = sessionmaker(bind=engine)
    session = Session()
    session.add(analysis)
    session.add(application)
    session.add(key)
    session.add(url)
    session.commit()

    generator = ReportGenerator()
    generator.generate(analysis, searchpath="../")
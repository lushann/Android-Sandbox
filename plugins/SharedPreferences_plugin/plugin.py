from sqlalchemy.orm import sessionmaker, scoped_session

from lib.model.database.Database import Database
from .lib.SharedPreferences import SharedPreferences
import logging
import os


current_path = os.path.dirname(os.path.realpath(__file__))

def onload():
    logging.debug("Shared_Prefs_plugin:loaded()")

def onunload():
    logging.debug("Shared_Prefs_plugin:unloaded()")

def parse(module,message):
    if(message.startswith("sharedprefs:")):
        logging.debug("SharedPreferences edited !")

        # Create a thread local session
        engine = Database.get_engine()

        session_factory = sessionmaker(bind=engine)
        Session = scoped_session(session_factory)
        session = Session()
        Session.remove()

        # Fetch application for this session ( could not use self.application
        # because the usage must be thread local )

        shared_pref = SharedPreferences(message[len("sharedprefs:"):])
        shared_pref.application_id = module.application.id
        logging.debug(repr(shared_pref))
        session.add(shared_pref)
        session.commit()

def get_frida_script():
    logging.debug("Shared_Prefs_plugin:get_frida_script()")
    with open(f"{current_path}/frida.js") as f:
        return ("SharedPreferences", f.read())
from sqlalchemy.orm import sessionmaker, scoped_session

from lib.model.database.Database import Database
from .lib.File import File
import logging
import os


current_path = os.path.dirname(os.path.realpath(__file__))

def onload():
    logging.debug("FileInteraction:loaded()")

def onunload():
    logging.debug("FileInteraction:unloaded()")

def parse(module,message):
    if(message.startswith("file:")):
        logging.debug("FileInteraction !")

        # Create a thread local session
        engine = Database.get_engine()

        session_factory = sessionmaker(bind=engine)
        Session = scoped_session(session_factory)
        session = Session()
        Session.remove()

        # Fetch application for this session ( could not use self.application
        # because the usage must be thread local )

        shared_pref = File(message[len("file:"):])
        shared_pref.application_id = module.application.id
        logging.debug(repr(shared_pref))
        session.add(shared_pref)
        session.commit()

def get_frida_script():
    logging.debug("Shared_Prefs_plugin:get_frida_script()")
    with open(f"{current_path}/frida.js") as f:
        return ("FileInteraction", f.read())
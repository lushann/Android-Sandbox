import importlib

from sqlalchemy.orm import sessionmaker, scoped_session

from lib.model import Application
from lib.model.Key import Key
from lib.model.Url import Url
from lib.model.database.Database import Database
from lib.modules.Module import Module

from pathlib import Path

import logging
import glob


class ModuleGeneral(Module):
    stop = True

    def __init__(self, application, plugins):
        Module.__init__(self, application)
        self.plugins = plugins

    @staticmethod
    def select(path, **kwargs):
        logging.debug('ModuleGeneral:select()')
        if Path(path).is_file():
            return [path]
        else:
            return glob.glob(f"{path}/*.apk")

    def parse(self, message):
        """
        Parse the message and call the according function
        :param message:
        :return:
        """
        print(message)
        logging.debug("ModuleGeneral:parse()")

        for plugin in self.plugins:
            plugin.parse(self,message)

        if message.startswith("to_string:"):
            message = message[10:]

            if message.startswith("http://") or message.startswith("https://"):
                self.url(message)
                return
            return

        if (message.startswith('url:')):
            self.url(message[4:])
            return

        keys_type = ['Key', 'IV', 'Instance']
        if (message.split(':')[0] in keys_type):
            type, key = message.split(':')
            self.key(type, key)
            return

    def url(self, url):
        '''
        Add an url to the database
        :param url:
        :return:
        '''
        logging.debug("ModuleGeneral:url()")

        # Create a thread local session
        engine = Database.get_engine()

        session_factory = sessionmaker(bind=engine)
        Session = scoped_session(session_factory)
        session = Session()
        Session.remove()

        url = Url(url)

        whitelist = ['0.0.0.0', '172.', '216.58.']
        # whitelist = []

        add = True
        if url.ip is not None:
            for i in whitelist:
                if url.ip.startswith(i):
                    add = False

        if add:
            # Fetch application for this session ( could not use self.application
            # because the usage must be thread local )
            application = session.query(Application.Application).get(self.application.id)

            logging.debug(repr(url))

            application.url.append(url)
            session.add(url)
            session.add(application)
            session.commit()

    def key(self, type, key):
        '''
        Add a key to the database
        :param type:
        :param key:
        :return:
        '''
        # Create a thread local session
        engine = Database.get_engine()

        session_factory = sessionmaker(bind=engine)
        Session = scoped_session(session_factory)
        session = Session()
        Session.remove()

        # Fetch application for this session ( could not use self.application
        # because the usage must be thread local )
        application = session.query(Application.Application).get(self.application.id)

        key = Key(type, key)

        logging.debug(repr(key))
        application.key.append(key)
        session.add(key)
        session.add(application)
        session.commit()

from lib.modules.Module import Module

from pathlib import Path

import logging
import glob


class ModuleGeneral(Module):

    def __init__(self, application):
        Module.__init__(self,application)

    @staticmethod
    def select(path):
        logging.debug('ModuleGeneral:select()')
        if Path(path).is_file():
            return path
        else:
            return glob.glob(f"{path}/*.apk")

    def parse(self,message):
        logging.debug("ModuleGeneral:parse()")
        print(message)

    def url(self, url):
        logging.debug("ModuleGeneral:url()")
        print(url.decode('utf8'))
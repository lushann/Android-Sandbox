import logging


class Module:

    def __init__(self,application):
        self.application = application

    def select(self, path):
        logging.error("Module:start() should not be called on the superclass")

from lib.receiver.Receiver import Receiver
import logging
import subprocess

import os
dirname = os.path.dirname(os.path.realpath(__file__)) + "/../../"

class Proxy(Receiver):

    def __init__(self, configuration, module):
        Receiver.__init__(self,"ProxyReceiver")
        self.proxy_port = configuration.get('port')
        self.module = module
        self.filename = f"{dirname}tmp/urls.txt"

    def start(self):
        logging.debug("Proxy:start()")

        # Emptying the file
        with open(self.filename, "w"):
            pass

        self.proxy_pid = subprocess.Popen(['mitmdump', '-p', self.proxy_port, '-s', f'{dirname}lib/proxy/HttpProxy.py'],
                                          stdout=subprocess.DEVNULL)
        logging.debug(f"Proxy listening on : {self.proxy_port}")

    def stop(self):
        self.proxy_pid.kill()
        logging.debug("Proxy:stop()")


        with open(self.filename, "r") as f:
            urls = f.read().split('\n')
            for url in urls:
                self.module.url(url)

        # Emptying the file
        with open(self.filename, "w"):
            pass




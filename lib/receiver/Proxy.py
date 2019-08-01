from lib.receiver.Receiver import Receiver
import logging
import subprocess


class Proxy(Receiver):

    def __init__(self, configuration, module):
        Receiver.__init__(self,"ProxyReceiver")
        self.proxy_port = configuration.get('port')
        self.module = module

    def start(self):
        self.proxy_pid = subprocess.Popen(['mitmdump', '-p', self.proxy_port, '-s', 'lib/proxy/HttpProxy.py'],
                                          stdout=subprocess.DEVNULL)
        logging.debug(f"Proxy listening on : {self.proxy_port}")

    def stop(self):
        self.proxy_pid.kill()
        logging.debug("Proxy:stop()")

        filename = "tmp/urls.txt"
        with open(filename, "rb") as f:
            urls = f.read().split(b'\n')
            for url in urls:
                self.module.url(url)

        # Emptying the file
        with open(filename, "w"):
            pass




from .Device import Device

import subprocess
import logging


class Physical(Device):

    def __init__(self,path_config,configuration,):
        Device.__init__(self, path_config, configuration, "Physical")

    def start(self):
        '''
        Set the device-id to the current plugged phone
        :return:
        '''
        logging.debug("Physiscal:launching_application()")
        devices = self.list_devices()

        if(len(devices['physical']) != 1):
            logging.error("No physical device plugged or too many ( only one can be pluuged at time )")
        else:
            self.device_id = devices['physical'][0]
            logging.debug(f"Device id : {self.device_id}")
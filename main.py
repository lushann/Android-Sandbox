from lib.adb import Physical, Emulator
from lib.model.database.Database import Database
from lib.modules import ModuleGeneral
from lib.analysis import Core
from config import config

import argparse
import logging

logging.basicConfig(level=config['GLOBAL'].get('logging_level'))
logger = logging.getLogger(__name__)


def main(args) -> None:
    """
    Function that create the process
    :param args:
    :return:
    """
    Database.set_configuration(config)

    device = None
    if config['GLOBAL'].getboolean('use_physical_device'):
        device = Physical.Physical(config['PATH'], config['PHYSICAL'])
    else:
        device = Emulator.Emulator(config['PATH'], config)

    logging.info("Launching device")
    device.start()
    core = Core.Core(config, device, ModuleGeneral.ModuleGeneral, args.path)
    core.start_analysis()
    device.kill_emulators()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Some shitty sandbox for Android malwares')
    parser.add_argument('path', metavar='file(s)', type=str, help='directory or file to process')
    args = parser.parse_args()

    main(args)

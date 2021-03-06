from mitmproxy import ctx
import os

dirname = os.path.dirname(os.path.realpath(__file__)) + "/../../"

class Addon():

    def request(self, flow):
        '''
        Addon used by mitmproxy that store each url in a file
        :param flow:
        :return:
        '''
        url_b = flow.request.url

        with open(f"{dirname}tmp/urls.txt","a") as f:
            ctx.log.info(f"Writing url : {url_b}")
            f.write(url_b +'\n')

    def response(self, flow):
        pass

addons = [
    Addon()
]
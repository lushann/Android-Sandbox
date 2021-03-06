from lib.model.Analysis import Analysis

import base64

import jinja2
import os

dirname = os.path.realpath(os.path.dirname(os.path.realpath(__file__))+'/../../')

class ReportGenerator:

    @staticmethod
    def b64encode(text):
        return base64.b64encode(text).decode('utf8')

    def generate(self, param):
        '''
        Generate the report by rendering with jinja2 template
        :param param:
        :param searchpath:
        :return:
        '''
        templateLoader = jinja2.FileSystemLoader(searchpath=dirname+'/templates/')
        templateEnv = jinja2.Environment(loader=templateLoader)

        templateEnv.filters['b64encode'] = ReportGenerator.b64encode

        TEMPLATE_FILE = f"index.jinja"
        template = templateEnv.get_template(TEMPLATE_FILE)

        outputText = template.render(param=param)

        path = f"{dirname}/reports/{param.uuid}.html"
        f = open(path,"w")
        f.write(outputText)
        f.close()
        return path
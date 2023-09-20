import tornado.web
import tornado.escape
# import methods.readdb as mrd
from handlers.base import BaseHandler

class InputdataHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata.html", user = user_infos[0])

class InputdatatimestampHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata_timestamp.html", user = user_infos[0])

# class OtherotherHandler(BaseHandler):
#     @tornado.web.authenticated
#     def get(self):
#         #username = self.get_argument("user")
#         username = tornado.escape.json_decode(self.current_user)
#         user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
#         self.render("attackshow_otherother.html", user = user_infos[0])

# class TimestampipHandler(BaseHandler):
#     @tornado.web.authenticated
#     def get(self):
#         #username = self.get_argument("user")
#         username = tornado.escape.json_decode(self.current_user)
#         user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
#         self.render("attackshow_timestampip.html", user = user_infos[0])

class InputdataipsHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata_ips.html", user = user_infos[0])

class Inputdataips1Handler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata_ips1.html", user = user_infos[0])

class Inputdataips2Handler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata_ips2.html", user = user_infos[0])

class Inputdataips3Handler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata_ips3.html", user = user_infos[0])

class Inputdataips4Handler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdata_ips4.html", user = user_infos[0])

# class AttacktypeHandler(BaseHandler):
#     @tornado.web.authenticated
#     def get(self):
#         #username = self.get_argument("user")
#         username = tornado.escape.json_decode(self.current_user)
#         user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
#         self.render("attackshow_attacktype.html", user = user_infos[0])



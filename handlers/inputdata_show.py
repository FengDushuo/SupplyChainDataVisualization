import tornado.escape
# import methods.readdb as mrd
from handlers.base import BaseHandler
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import define, options, parse_config_file
from tornado.web import Application, RequestHandler
import os
from methods.label_extract import extract_two_labels_quchong,twolabel_timestamp_reset,extract_three_labels_not_quchong_with_timestamp
from methods.csv_to_json import ips_csvtojson
from methods.csv_file_function import column_position,column_value
from operator import itemgetter
import xlrd,json
import random
import os

def read_xlsx_file(filename):
    # 打开Excel文件
    data = xlrd.open_workbook(filename)
    # 读取第一个工作表
    table = data.sheets()[0]
    # 统计行数
    rows = table.nrows
    data = {"all":[],"空气炸锅":[],"电蒸锅":[],"料理机":[],"榨汁机":[],"早餐机":[],"电炖锅":[],"电饼铛":[],"豆浆机":[],"count":0}  # 存放数据
    classes = ("空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机")
    
    count=0
    for i in range(1, rows):
        type_class = random.choice(classes)
        values = table.row_values(i) 
        if values[2]:
            money = int(values[2])
        else:
            money = 0
        data["all"].append(
            (
                {
                "name":str(values[0]),
                "ground":str(values[1]),    
                "property":str(values[3]), 
                "address":str(values[4]),
                "money":money,
                "category":type_class 
                }
            )
        )
        data[type_class].append(
            (
                {
                "name":str(values[0]),
                "ground":str(values[1]),    
                "property":str(values[3]), 
                "address":str(values[4]),
                "money":money,
                "category":type_class 
                }
            )
        )
        count+=1
    data["count"]=count
    return data

class Inputdatashow_ipsHandler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        filename = self.get_query_argument("filename")
        if filename.split('-')[0]=="原材料":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            # 可读可写，如果不存在则创建，如果有内容则覆盖
            if "上海" not in filename:
                outfile = filename.split('-')[1].split('省')[1].split('市')[0]
            else:
                outfile =filename.split('-')[1].split('城区')[1]
            jsFile = open("static/data/"+ outfile + ".json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" + outfile + "-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] == outfile:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips.html", user = user_infos[0],jsonoutputpath = "static/data/" + outfile + ".json")
        elif filename.split('-')[0]=="模具":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            # 可读可写，如果不存在则创建，如果有内容则覆盖
            if "上海" not in filename:
                outfile = filename.split('-')[1].split('省')[1].split('市')[0]
            else:
                outfile =filename.split('-')[1].split('城区')[1]
            jsFile = open("static/data/"+ outfile + "1.json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" + outfile + "1-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count1.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] == outfile:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count1.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips.html", user = user_infos[0],jsonoutputpath = "static/data/" + outfile + "1.json")
        

    def post(self):
        pass

class Inputdatashow_ips1Handler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        filename = self.get_query_argument("filename")
        if filename.split('-')[0]=="原材料":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True, ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            print(js)
            # 可读可写，如果不存在则创建，如果有内容则覆盖
            if "上海" not in filename:
                outfile = filename.split('-')[1].split('省')[1].split('市')[0]
            else:
                outfile =filename.split('-')[1].split('城区')[1]
            jsFile = open("static/data/"+ outfile + ".json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" + outfile + "-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] == outfile:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips.html", user = user_infos[0],jsonoutputpath = "static/data/" + outfile + ".json")
        elif filename.split('-')[0]=="模具":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            
            # 可读可写，如果不存在则创建，如果有内容则覆盖
            if "上海" not in filename:
                outfile = filename.split('-')[1].split('省')[1].split('市')[0]
            else:
                outfile =filename.split('-')[1].split('城区')[1]
            jsFile = open("static/data/"+ outfile + "1.json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" + outfile + "1-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count1.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] == outfile:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count1.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips1.html", user = user_infos[0],jsonoutputpath = "static/data/" + outfile + "1.json")
        

    def post(self):
        pass

class Inputdatashow_ips2Handler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        filename = self.get_query_argument("filename")
        if filename.split('-')[0]=="原材料":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True, ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            print(js)
            # 可读可写，如果不存在则创建，如果有内容则覆盖
            if "上海" not in filename:
                outfile = filename.split('-')[1].split('省')[1].split('市')[0]
            else:
                outfile =filename.split('-')[1].split('城区')[1]
            jsFile = open("static/data/"+ outfile + ".json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" + outfile + "-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] == outfile:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips.html", user = user_infos[0],jsonoutputpath = "static/data/" + outfile + ".json")
        elif filename.split('-')[0]=="注塑":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            
            # 可读可写，如果不存在则创建，如果有内容则覆盖
            if "上海" not in filename:
                outfile = filename.split('-')[1].split('省')[1].split('市')[0]
            else:
                outfile =filename.split('-')[1].split('城区')[1]
            jsFile = open("static/data/"+ outfile + "2.json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" + outfile + "2-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count2.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] == outfile:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count2.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips2.html", user = user_infos[0],jsonoutputpath = "static/data/" + outfile + "2.json")
        

    def post(self):
        pass

class Inputdatashow_ips3Handler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        filename = self.get_query_argument("filename")
        if filename.split('-')[0]=="会展":
            csvopenfilepath = "upload/"+filename
            d1 = read_xlsx_file(csvopenfilepath)
            # 字典中的数据都是单引号，但是标准的json需要双引号
            js = json.dumps(d1["all"],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
            # 前面的数据只是数组，加上外面的json格式大括号
            js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
            jsFile = open("static/data/"+ filename.split('-')[1].split('.')[0] + "3.json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
            classes = ["电饼铛","电炖锅","电蒸锅","豆浆机","空气炸锅","料理机","早餐机","榨汁机"]
            for i in classes:
                js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
                jsFile = open("static/data/" +filename.split('-')[1].split('.')[0] + "3-"+i+".json", "w+", encoding='utf-8')
                js = json.dumps(sorted(json.loads(js), key=itemgetter('money'),reverse=True))
                jsFile.write(js)
                jsFile.close()
            with open("static/data/count3.json", "r",encoding='utf-8') as jsonFile:
                data = json.load(jsonFile)
            for i in range(len(data)):
                if data[i]['country'] ==filename.split('-')[1].split('.')[0]:
                    data[i]['infected'] = d1['count']
                    print(data[i])
            # 再写入回去
            with open("static/data/count3.json",'w',encoding='utf8')as fp:
                json.dump(data,fp,ensure_ascii=False)
            username = tornado.escape.json_decode(self.current_user)
            # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
            user_infos=[[99,username,"123456","123456@11.com"]]
            self.render("inputdatashow_ips3.html", user = user_infos[0],jsonoutputpath = "static/data/" +filename.split('-')[1].split('.')[0] + "3.json")
        

    def post(self):
        pass



class Inputdatashow_timestampHandler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        
        filename = self.get_query_argument("filename")
        csvopenfilepath = "upload/"+filename
        with open(csvopenfilepath,"r") as csvfile:
            firstline = csvfile.readline()
        firstline = firstline.replace("\n","")
        firstlabels = firstline.split(",")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdatashow_timestamp.html", user = user_infos[0],firstlabels = firstlabels,filename=filename)
        

    def post(self):
        pass

class Inputdatashow_timestamp_onelabelHandler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        csvoutputfile = self.get_query_argument("csvoutputfile")
        timestamp_format = self.get_query_argument("timestamp_format")
        chosedlabel = self.get_query_argument("chosedlabel")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdatashow_timestamp_one.html", user = user_infos[0],timestamp_format=timestamp_format,csvoutputfile=csvoutputfile,chosedlabel=chosedlabel)
        

    def post(self):
        timestamplabel = self.get_argument("timestamp",default="Timestamp")
        chosedlabel = self.get_argument("chooselabel",default="Flow Duration")
        filename = self.get_argument("filename",default="1.csv")
        csvopenfilepath = "upload/"+filename
        with open(csvopenfilepath,"r") as csvfile:
            firstline = csvfile.readline()
            secondline = csvfile.readline()
        firstline=firstline.replace(" ","").replace("\n","")
        timestampmodel = column_value(secondline,firstline,timestamplabel)
        timestamp_list = timestampmodel.split(" ")
        if len(timestamp_list[1].split(":"))==2:
            timestamp_format = "%d/%m/%Y %I:%M"
        elif len(timestamp_list[1].split(":"))==3:
            timestamp_format = "%d/%m/%Y %I:%M:%S"
        csvoutputfiled = "static/onelabel_with_timestamp"
        csvoutputfile = twolabel_timestamp_reset(csvopenfilepath,csvoutputfiled,timestamplabel,chosedlabel)
        returndata = {"csvoutputfile":csvoutputfile,"timestamp_format":timestamp_format,"chosedlabel":chosedlabel}
        self.write(returndata)

class Inputdatashow_timestamp_twolabelHandler(BaseHandler):    #继承base.py中的类BaseHandler
    @tornado.web.authenticated
    def get(self):
        csvoutputfile = self.get_query_argument("csvoutputfile")
        timestamp_format = self.get_query_argument("timestamp_format")
        chosedlabel1 = self.get_query_argument("chosedlabel1")
        chosedlabel2 = self.get_query_argument("chosedlabel2")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("inputdatashow_timestamp_two.html", user = user_infos[0],timestamp_format=timestamp_format,csvoutputfile=csvoutputfile,chosedlabel1=chosedlabel1,chosedlabel2=chosedlabel2)
        

    def post(self):
        timestamplabel = self.get_argument("timestamp",default="Timestamp")
        chosedlabel1 = self.get_argument("chooselabel1",default="Total Fwd Packets")
        chosedlabel2 = self.get_argument("chooselabel2",default="Total Backward Packets")
        filename = self.get_argument("filename",default="1.csv")
        csvopenfilepath = "upload/"+filename
        with open(csvopenfilepath,"r") as csvfile:
            firstline = csvfile.readline()
            secondline = csvfile.readline()
        firstline=firstline.replace(" ","").replace("\n","")
        timestampmodel = column_value(secondline,firstline,timestamplabel)
        timestamp_list = timestampmodel.split(" ")
        if len(timestamp_list[1].split(":"))==2:
            timestamp_format = "%d/%m/%Y %I:%M"
        elif len(timestamp_list[1].split(":"))==3:
            timestamp_format = "%d/%m/%Y %I:%M:%S"
        csvoutputfiled = "static/twolabels_with_timestamp"
        print(timestamplabel,chosedlabel1,chosedlabel2)
        csvoutputfile = extract_three_labels_not_quchong_with_timestamp(csvopenfilepath,csvoutputfiled,timestamplabel,chosedlabel1,chosedlabel2)
        returndata = {"csvoutputfile":csvoutputfile,"timestamp_format":timestamp_format,"chosedlabel1":chosedlabel1,"chosedlabel2":chosedlabel2}
        self.write(returndata)
        

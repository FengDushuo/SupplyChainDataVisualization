import tornado.web
import tornado.escape
import os
# import methods.readdb as mrd
from handlers.base import BaseHandler
import json
import random

class KnowledgeHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #username = self.get_argument("user")
        username = tornado.escape.json_decode(self.current_user)
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("knowledge.html", user = user_infos[0])

    def post(self):
        username = tornado.escape.json_decode(self.current_user)
        
        # user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
        custom_want = self.request.body_arguments
        custom_want_str=custom_want['text'][0].decode('utf-8')+custom_want['text'][1].decode('utf-8')+custom_want['text'][2].decode('utf-8')+custom_want['text'][3].decode('utf-8')
        print(custom_want)
        country_list = [{"shengfen":"浙江", "countries":[{"country": "宁波", "infected": 355}, {"country": "台州", "infected": 240}, {"country": "温州", "infected": 41}, {"country": "绍兴", "infected": 37}, {"country": "杭州", "infected": 83}, {"country": "嘉兴", "infected": 43}, {"country": "金华", "infected": 12}, {"country": "湖州", "infected": 8}, {"country": "衢州", "infected": 5}, {"country": "丽水", "infected": 4}, {"country": "舟山", "infected": 2}]},{"shengfen":"江苏", "countries":[{"country": "苏州", "infected": 180}, {"country": "无锡", "infected": 48}, {"country": "常州", "infected": 28}, {"country": "南京", "infected": 17}, {"country": "南通", "infected": 17}, {"country": "扬州", "infected": 5}, {"country": "镇江", "infected": 7}, {"country": "泰州", "infected": 8}, {"country": "徐州", "infected": 8}, {"country": "盐城", "infected": 6}, {"country": "宿迁", "infected": 2}, {"country": "连云港", "infected": 2}, {"country": "淮安", "infected": 2}]}, {"shengfen":"上海", "countries":[{"country": "松江区", "infected": 68}, {"country": "嘉定区", "infected": 57}, {"country": "青浦区", "infected": 33}, {"country": "浦东新区", "infected": 26}, {"country": "闵行区", "infected": 47}, {"country": "宝山区", "infected": 40}, {"country": "金山区", "infected": 15}, {"country": "黄浦区", "infected": 22}, {"country": "普陀区", "infected": 12}, {"country": "徐汇区", "infected": 7}, {"country": "静安区", "infected": 17}, {"country": "杨浦区", "infected": 4}, {"country": "长宁区", "infected": 2}, {"country": "虹口区", "infected": 3}]}]
        property_list=['小微企业','高新技术企业','专精特新','无']
        country_inneed = country_list[0]["shengfen"]
        countries_inneed = []
        for i in range(len(country_list)):
            if country_list[i]["shengfen"] in custom_want_str:
                country_inneed=country_list[i]["shengfen"]
                countries_inneed = country_list[i]["countries"]
        if "浙江" in custom_want_str:
            exhabit="宁波国际会展中心"
        elif "江苏" in custom_want_str:
            exhabit="南京国际博览中心"
        else:
            exhabit=random.choice(("上海新国际会展中心","上海国家会展中心"))

        property_inneed = '无'
        for j in range(len(property_list)):
            if property_list[j] in custom_want_str:
                property_inneed = property_list[j]
                if property_inneed == "无":
                    property_inneed = ''

        size_list=['小于100万','100-500万','500-1000万','大于1000万']
        size_inneed = "小于100万"
        for j in range(len(size_list)):
            if size_list[j] in custom_want_str:
                size_inneed = size_list[j]

        product_list=['空气炸锅','电蒸锅','料理机','榨汁机','早餐机','电炖锅','电饼铛','豆浆机']
        product_inneed = "空气炸锅"
        for j in range(len(product_list)):
            if product_list[j] in custom_want_str:
                product_inneed = product_list[j]

        
        total_list = [[] for i in range(5)]
        namelist = [[]for i in range(5)]
        random_list=[[]for i in range(5)]
        
        for m in range(5):
            random_elements = []
            for i in range(len(countries_inneed)):
                jsonfile_inneed = 'static/data/'+countries_inneed[i]["country"]+'-'+product_inneed+'.json'
                if os.path.exists(jsonfile_inneed):
                    pass
                else:
                    jsonfile_inneed = 'static/data/宁波-电饼铛.json'
                
                with open(jsonfile_inneed, encoding='utf-8') as j:
                    demo_json = json.loads(j.read())

                
                for i in demo_json:
                    total_list[m].append(i["name"])
                    if size_inneed == "小于100万":
                        if i["property"]==property_inneed and int(i["money"])<100:
                            namelist[m].append(i["name"])
                    elif size_inneed == "100-500万":
                        if i["property"]==property_inneed and int(i["money"])>100 and i["money"]<500:
                            namelist[m].append(i["name"])
                    elif size_inneed == "500-1000万":
                        if i["property"]==property_inneed and int(i["money"])>500 and i["money"]<1000:
                            namelist[m].append(i["name"])
                    elif size_inneed == "大于1000万":
                        if i["property"]==property_inneed and int(i["money"])>1000:
                            namelist[m].append(i["name"])
                print(namelist[m])
                if len(namelist[m]) >= 5:
                    random_elements = random.sample(namelist[m], 5)
                elif len(namelist[m]) == 0:
                    random_elements = []
                else:
                    random_elements = random.sample(namelist[m], len(namelist[m]))
                if len(random_elements)>=5:
                    break
            random_list[m]=random_elements
        print(random_list)
        
        ret_list = []
        for j in range(len(random_list)):
            ret_str='--'
            for i in range(3):
                ret_str+=random.choice(random_list[i])+'--'
            ret_str+=exhabit
            ret_list.append(ret_str)


        user_infos=[[99,username,"123456","123456@11.com"]]
        self.render("knowledge_result.html", user = user_infos[0],recommends = ret_list)


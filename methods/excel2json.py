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
        if values[4]:
            money = int(values[4])
        else:
            money = 0
        data["all"].append(
            (
                {
                "name":str(values[0]),
                "ground":str(values[1]),    
                "people":str(values[3]), 
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
                "people":str(values[3]), 
                "money":money,
                "category":type_class 
                }
            )
        )
        count+=1
    data["count"]=count
    return data
 
if __name__ == '__main__':
    folder = r"D:\1_afterschool\web\all"
    for filename in os.listdir(folder):
        print(filename)
        d1 = read_xlsx_file(folder+"\\"+filename)
        # 字典中的数据都是单引号，但是标准的json需要双引号
        js = json.dumps(d1["all"],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
        # 前面的数据只是数组，加上外面的json格式大括号
        # 可读可写，如果不存在则创建，如果有内容则覆盖
        if "上海" not in filename:
            outfile = filename.split('-')[1].split('省')[1].split('市')[0]
        else:
            outfile = filename.split('-')[1].split('城区')[1] 
        jsFile = open("D:\\1_afterschool\\web\code\\6_visualization\\static\\data\\" + outfile + ".json", "w+", encoding='utf-8')
        jsFile.write(js)
        jsFile.close()

        classes = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"]
        for i in classes:
            js = json.dumps(d1[i],sort_keys=True,ensure_ascii=False,indent=4, separators=(',', ':'))
            jsFile = open("D:\\1_afterschool\\web\code\\6_visualization\\static\\data\\" + outfile + "-"+i+".json", "w+", encoding='utf-8')
            jsFile.write(js)
            jsFile.close()
        with open("D:\\1_afterschool\\web\\code\\6_visualization\\static\\data\\count.json", "r",encoding='utf-8') as jsonFile:
            data = json.load(jsonFile)
        for i in range(len(data)):
            if data[i]['country'] == outfile:
                data[i]['infected'] = d1['count']
                print(data[i])

        # 再写入回去
        with open("D:\\1_afterschool\\web\\code\\6_visualization\\static\\data\\count.json",'w',encoding='utf8')as fp:
            json.dump(data,fp,ensure_ascii=False)
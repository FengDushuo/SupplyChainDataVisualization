import pandas as pd
import csv

data = pd.read_excel(r'D:\1_afterschool\web\code\6_visualization\methods\demo.xlsx') # 导入参赛信息
d = data['所在地'].value_counts() #ocean_proximity为属性标签
dict_d = dict(d)
new_dict = dict()
for key in dict_d:
    string_key = key.replace('省','省-')
    string_key = string_key.replace('市','市-')
    string_key = string_key.rstrip("-")
    new_dict[string_key] = dict_d[key]

print(new_dict) 
saveDict=new_dict
fileName=r"D:\1_afterschool\web\code\6_visualization\methods\demo_count.csv"
##保存文件
with open(fileName,"a",newline='',encoding='utf-8') as csv_file:
	writer=csv.writer(csv_file)
	for key in saveDict:
		writer.writerow([key,saveDict[key]])


    



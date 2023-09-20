import pandas as pd


def xlsx_to_csv_pd(excelfilename,csvfilename):
    data_xls = pd.read_excel(excelfilename, index_col=0)
    data_xls.to_csv(csvfilename, encoding='utf-8')


if __name__ == '__main__':
    xlsx_to_csv_pd(r'D:\1_afterschool\web\code\6_visualization\methods\demo.xlsx',r'D:\1_afterschool\web\code\6_visualization\methods\demo.csv')

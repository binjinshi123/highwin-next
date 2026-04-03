const highwinUrls = [
  {
    title: '深度资料-股东状况-十大股东',
    url: '/multidata/deepdata/stock/stockholders/top10'
  },
  {
    title: '深度资料-基础资料',
    url: '/multidata/deepdata/stock/company/introduction'
  },
  {
    title: '深度资料-公司资料-股本结构',
    url: '/multidata/deepdata/stock/company/construction'
  },
  {
    title: '深度资料-公司资料-董监高成员',
    url: '/multidata/deepdata/stock/company/member'
  },
  {
    title: '深度资料-公司资料-董监高持股及薪酬',
    url: '/multidata/deepdata/stock/company/payment'
  },
  {
    title: '深度资料-证券资料-证券简介',
    url: '/multidata/deepdata/stock/securityinfo/briefintroduction'
  },
  {
    title: '深度资料-股东状况-十大流通股东',
    url: '/multidata/deepdata/stock/stockholders/circulatetop10'
  },
  {
    title: '深度资料-股东状况-股东户数',
    url: '/multidata/deepdata/stock/stockholders/holdersnumber'
  },
  {
    title: '深度资料-股东状况-机构持股',
    url: '/multidata/deepdata/stock/stockholders/orgholders'
  },
  {
    title: '深度资料-股东状况-限售解禁',
    url: '/multidata/deepdata/stock/stockholders/lifting'
  },
  {
    title: '深度资料-红利',
    url: '/multidata/deepdata/stock/financing/bonusshare'
  },
  {
    title: '深度资料-融资分配-历史分红统计',
    url: '/multidata/deepdata/stock/financing/hisbonus'
  },
  {
    title: '深度资料-融资分配-历史融资统计',
    url: '/multidata/deepdata/stock/financing/hisfinance'
  },
  {
    title: '深度资料-募集及发行',
    url: '/multidata/deepdata/stock/financing/ipo'
  },
  {
    title: '深度资料-融资分配-配股',
    url: '/multidata/deepdata/stock/financing/rationedshares'
  },
  {
    title: '深度资料-融资分配-增发',
    url: '/multidata/deepdata/stock/financing/addshares'
  },
  {
    title: '深度资料-重大事项-并购重组',
    url: '/multidata/deepdata/stock/importantevent/regroup'
  },
  {
    title: '深度资料-重大事项-关联交易',
    url: '/multidata/deepdata/stock/importantevent/relatedtransaction'
  },
  {
    title: '深度资料-重大事项-吸收合并',
    url: '/multidata/deepdata/stock/importantevent/combine'
  },
  {
    title: '深度资料-重大事项-对外担保',
    url: '/multidata/deepdata/stock/importantevent/guarantyeasyui'
  },
  {
    title: '深度资料-重大事项-公司违规',
    url: '/multidata/deepdata/stock/importantevent/violation'
  },
  {
    title: '深度资料-财务摘要',
    url: '/multidata/deepdata/stock/financialreport/base/financialsummaryeasy'
  },
  {
    title: '深度资料-财务报表-基础报表-资产负债表',
    url: '/multidata/deepdata/stock/financialreport/base/balancesheet'
  },
  {
    title: '深度资料-利润表',
    url: '/multidata/deepdata/stock/financialreport/base/profitstatement'
  },
  {
    title: '深度资料-现金流量表',
    url: '/multidata/deepdata/stock/financialreport/base/cashflow'
  },
  {
    title: '深度资料-财务报表-基础报表-财务摘要（单季度）',
    url: '/multidata/deepdata/stock/financialreport/base/financialsummarysingle'
  },
  {
    title: '深度资料-财务报表-基础报表-利润表（单季度）',
    url: '/multidata/deepdata/stock/financialreport/base/profitstatementsingle'
  },
  {
    title: '深度资料-财务报表-基础报表-现金流量表（单季度）',
    url: '/multidata/deepdata/stock/financialreport/base/cashflowsingle'
  },
  {
    title: '深度资料-财务报表-基础报表-业绩预告',
    url: '/multidata/deepdata/stock/financialreport/base/businessforecast'
  },
  {
    title: '深度资料-财务报表-主营构成-主营构成（按行业或业务）',
    url: '/multidata/deepdata/stock/financialreport/mainstruction/byindustry'
  },
  {
    title: '深度资料-财务报表-主营构成-主营构成（按地区）',
    url: '/multidata/deepdata/stock/financialreport/mainstruction/byarea'
  },
  {
    title: '深度资料-财务报表-主营构成-主营构成（按产品）',
    url: '/multidata/deepdata/stock/financialreport/mainstruction/byproduct'
  },
  {
    title: '深度资料-财务报表-财务附注-税项名义税率',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/nominalrateoftax'
  },
  {
    title: '深度资料-财务报表-财务附注-货币资金',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/monetaryfund'
  },
  {
    title: '深度资料-财务报表-财务附注-交易性金融资产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/transactionalfinancialassets'
  },
  {
    title: '深度资料-财务报表-财务附注-可供出售金融资产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/financialassetsavailableforsale'
  },
  {
    title: '深度资料-财务报表-财务附注-应收账款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/accountsreceivable'
  },
  {
    title: '深度资料-财务报表-财务附注-应收账款特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofaccountsreceivable'
  },
  {
    title: '深度资料-财务报表-财务附注-其他应收款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/otherreceivables'
  },
  {
    title: '深度资料-财务报表-财务附注-其他应收款特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofotherreceivables'
  },
  {
    title: '深度资料-财务报表-财务附注-预付款项',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/prepayments'
  },
  {
    title: '深度资料-财务报表-财务附注-预付款项特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofadvancepayments'
  },
  {
    title: '深度资料-财务报表-财务附注-存货',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/inventory'
  },
  {
    title: '深度资料-财务报表-财务附注-其他流动资产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/othercurrentassets'
  },
  {
    title: '深度资料-财务报表-财务附注-长期股权投资',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/longtermequityinvestment'
  },
  {
    title: '深度资料-财务报表-财务附注-投资性房地产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/investmentrealestate'
  },
  {
    title: '深度资料-财务报表-财务附注-固定资产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/fixedassets'
  },
  {
    title: '深度资料-财务报表-财务附注-无形资产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/intangibleassets'
  },
  {
    title: '深度资料-财务报表-财务附注-开发支出',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/developmentexpenditure'
  },
  {
    title: '深度资料-财务报表-财务附注-长期待摊费用',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/longtermdeferredexpenses'
  },
  {
    title: '深度资料-财务报表-财务附注-资产减值准备',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/impairmentprovision'
  },
  {
    title: '深度资料-财务报表-财务附注-递延所得税资产',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/deferredtaxassets'
  },
  {
    title: '深度资料-财务报表-财务附注-递延所得税负债',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/deferredtaxliability'
  },
  {
    title: '深度资料-财务报表-财务附注-递延所得税',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/deferredincometax'
  },
  {
    title: '深度资料-财务报表-财务附注-商誉',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/goodwill'
  },
  {
    title: '深度资料-财务报表-财务附注-在建工程基本情况',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/projectsunderconstruction'
  },
  {
    title: '深度资料-财务报表-财务附注-重要在建工程项目本期变动情况',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/majorconstructioninprogress'
  },
  {
    title: '深度资料-财务报表-财务附注-短期借款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/shorttermborrowing'
  },
  {
    title: '深度资料-财务报表-财务附注-长期借款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/longtermborrowing'
  },
  {
    title: '深度资料-财务报表-财务附注-应付账款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/accountspayable'
  },
  {
    title: '深度资料-财务报表-财务附注-应付账款特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofaccountspayable'
  },
  {
    title: '深度资料-财务报表-财务附注-其他应付款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/otherpayables'
  },
  {
    title: '深度资料-财务报表-财务附注-其他应付款特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofotherpayables'
  },
  {
    title: '深度资料-财务报表-财务附注-预收账款',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/deferredrevenue'
  },
  {
    title: '深度资料-财务报表-财务附注-预收账款特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofprepaidaccounts'
  },
  {
    title: '深度资料-财务报表-财务附注-应付职工薪酬',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/payrollpayable'
  },
  {
    title: '深度资料-财务报表-财务附注-应交税费',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/payabletaxes'
  },
  {
    title: '深度资料-财务报表-财务附注-应付利息',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/interestpayable'
  },
  {
    title: '深度资料-财务报表-财务附注-应付股利',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/dividendspayable'
  },
  {
    title: '深度资料-财务报表-财务附注-应付债券',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/bondspayable'
  },
  {
    title: '深度资料-财务报表-财务附注-股本',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/equity'
  },
  {
    title: '深度资料-财务报表-财务附注-一年内到期的非流动负债',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/noncurrentliabilitiesduewithinoneyear'
  },
  {
    title: '深度资料-财务报表-财务附注-资本公积',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/capitalreserves'
  },
  {
    title: '深度资料-财务报表-财务附注-盈余公积',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/surplusreserves'
  },
  {
    title: '深度资料-财务报表-财务附注-未分配利润',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/undistributedprofit'
  },
  {
    title: '深度资料-财务报表-财务附注-非经常性损益',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/nonrecurringgainsandlosses'
  },
  {
    title: '深度资料-财务报表-财务附注-营业税金',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/businesstax'
  },
  {
    title: '深度资料-财务报表-财务附注-销售费用',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/costofsales'
  },
  {
    title: '深度资料-财务报表-财务附注-管理费用',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/managementfees'
  },
  {
    title: '深度资料-财务报表-财务附注-财务费用',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/financecharges'
  },
  {
    title: '深度资料-财务报表-财务附注-政府补助',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/governmentsubsidies'
  },
  {
    title: '深度资料-财务报表-财务附注-投资收益',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/returnoninvestment'
  },
  {
    title: '深度资料-财务报表-财务附注-营业外收入',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/nonoperatingincome'
  },
  {
    title: '深度资料-财务报表-财务附注-营业外支出',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/nonoperatingexpenditure'
  },
  {
    title: '深度资料-财务报表-财务附注-应收票据',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/notesreceivable'
  },
  {
    title: '深度资料-财务报表-财务附注-应收票据特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofnotesreceivable'
  },
  {
    title: '深度资料-财务报表-财务附注-应付票据',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/notespayable'
  },
  {
    title: '深度资料-财务报表-财务附注-应付票据特殊披露',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/specialdisclosureofnotespayable'
  },
  {
    title: '深度资料-财务报表-财务附注-前五大客户情况',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/topfivecustomers'
  },
  {
    title: '深度资料-财务报表-财务附注-前五大供应商情况',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/topfivesuppliers'
  },
  {
    title: '深度资料-财务报表-财务附注-资产、负债重大变动情况',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/majorchangesinassetsandliabilities'
  },
  {
    title: '深度资料-财务报表-财务附注-以公允价值计量的资产和负债',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/assetsandliabilitiesatfairvalue'
  },
  {
    title: '深度资料-财务报表-财务附注-支付、收到的其他与经营活动有关的现金',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/cashpaidandreceived'
  },
  {
    title: '深度资料-财务报表-财务附注-重要关联公司主要财务信息',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/mainfinancialinformation'
  },
  {
    title: '深度资料-财务报表-财务附注-子公司联营合营情况',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/subsidiaryjointventure'
  },
  {
    title: '深度资料-财务报表-财务附注-子公司退出明细',
    url: '/multidata/deepdata/stock/financialreport/financialnotes/subsidiaryexitdetails'
  },
  {
    title: '深度资料-财务分析-IPO披露财务指标',
    url: '/multidata/deepdata/stock/financialanalysis/ipopublish'
  },
  {
    title: '深度资料-财务分析-上市公司定期披露财务指标',
    url: '/multidata/deepdata/stock/financialanalysis/timingdisclosure'
  },
  {
    title: '深度资料-财务分析-偿债能力',
    url: '/multidata/deepdata/stock/financialanalysis/debtpayingability'
  },
  {
    title: '深度资料-财务分析-比率结构',
    url: '/multidata/deepdata/stock/financialanalysis/ratiostruct'
  },
  {
    title: '深度资料-财务分析-经营能力',
    url: '/multidata/deepdata/stock/financialanalysis/manageability'
  },
  {
    title: '深度资料-财务分析-盈利能力',
    url: '/multidata/deepdata/stock/financialanalysis/profitability'
  },
  {
    title: '深度资料-财务分析-相对价值指标',
    url: '/multidata/deepdata/stock/financialanalysis/relativevalueindex'
  },
  {
    title: '深度资料-财务分析-现金流分析',
    url: '/multidata/deepdata/stock/financialanalysis/cashflowanalysis'
  },
  {
    title: '深度资料-财务分析-风险水平',
    url: '/multidata/deepdata/stock/financialanalysis/risklevel'
  },
  {
    title: '深度资料-财务分析-发展能力',
    url: '/multidata/deepdata/stock/financialanalysis/developmentability'
  },
  {
    title: '深度资料-财务分析-每股指标',
    url: '/multidata/deepdata/stock/financialanalysis/pershareindex'
  },
  {
    title: '深度资料-财务分析-股利分配',
    url: '/multidata/deepdata/stock/financialanalysis/dividenddistribution'
  },
  {
    title: '深度资料-一致性预测',
    url: '/multidata/deepdata/stock/forecast'
  },
  {
    title: '深度资料-融资融券',
    url: '/multidata/deepdata/stock/dailyMarketData/marginTrading'
  },
  {
    title: '深度资料-新闻公告-公司公告',
    url: '/multidata/deepdata/stock/news/notices'
  },
  {
    title: '深度资料-新闻公告-机构调研',
    url: '/multidata/deepdata/stock/news/research'
  },
  {
    title: '深度资料-公司专利-专利',
    url: '/multidata/deepdata/stock/companypatents/patents'
  },
  {
    title: '深度资料-公司专利-研发投入情况',
    url: '/multidata/deepdata/stock/companypatents/rdinvestments'
  },
  {
    title: '深度资料-股权质押-未到期质押',
    url: '/multidata/deepdata/stock/equityPedge/unexpiredPledge'
  },
  {
    title: '深度资料-股权质押-股权质押明细',
    url: '/multidata/deepdata/stock/equityPedge/detailsEquityPledge'
  },
  {
    title: '深度资料-交易数据-北向资金',
    url: '/multidata/deepdata/stock/dailyMarketData/northOrientation'
  },
  {
    title: '深度资料-交易数据-大宗交易',
    url: '/multidata/deepdata/stock/dailyMarketData/blockTrade'
  },
  {
    title: '深度资料-交易数据-交易异动',
    url: '/multidata/deepdata/stock/dailyMarketData/transactionBusinessDepartment'
  },
  {
    title: '深度资料-评级预测',
    url: '/multidata/deepdata/stock/ratingForecast'
  },
  {
    title: '深度资料-证券资料-窝轮信息',
    url: '/multidata/deepdata/stock/securityinfo/warrantinfo'
  },
  {
    title: '深度资料-证券资料-牛熊证',
    url: '/multidata/deepdata/stock/securityinfo/callablebull'
  },
  {
    title: '深度资料-融资分配-派息明细',
    url: '/multidata/deepdata/stock/stockholders/top10'
  },
  {
    title: '深度资料-融资分配-拆细合并',
    url: '/multidata/deepdata/stock/stockholders/circulatetop10'
  },
  {
    title: '深度资料-融资分配-配股信息',
    url: '/multidata/deepdata/stock/stockholders/holdersnumber'
  },
  {
    title: '深度资料-融资分配-股票回购',
    url: '/multidata/deepdata/stock/stockholders/orgholders'
  },
  {
    title: '深度资料-融资分配-供股权交易',
    url: '/multidata/deepdata/stock/stockholders/lifting'
  },
  {
    title: '深度资料-融资分配-IPO',
    url: '/multidata/deepdata/stock/stockholders/IPO'
  },
  {
    title: '深度资料-新闻公告-回顾展望',
    url: '/multidata/deepdata/stock/news/notices'
  },
  {
    title: '深度资料-财务报表-财务摘要',
    url: '/multidata/deepdata/stock/financialreport/financialsummaryeasy'
  },
  {
    title: '深度资料-财务报表-资产负债表',
    url: '/multidata/deepdata/stock/financialreport/balancesheet'
  },
  {
    title: '深度资料-财务报表-利润表',
    url: '/multidata/deepdata/stock/financialreport/profitstatement'
  },
  {
    title: '深度资料-财务报表-现金流量表',
    url: '/multidata/deepdata/stock/financialreport/cashflow'
  },
  {
    title: '基金深度资料-基础资料',
    url: '/multidata/deepdata/foundation/basic/introduce/information'
  },
  {
    title: '基金深度资料-募集及发行',
    url: '/multidata/deepdata/foundation/basic/introduce/initialrecruitment'
  },
  {
    title: '基金深度资料-基金基本资料-基金介绍-分级基金资料',
    url: '/multidata/deepdata/foundation/basic/introduce/structuredfund'
  },
  {
    title: '基金深度资料-基金基本资料-基金费率',
    url: '/multidata/deepdata/foundation/basic/rate'
  },
  {
    title: '基金深度资料-基金基本资料-基金经理',
    url: '/multidata/deepdata/foundation/basic/manager'
  },
  {
    title: '基金深度资料-基金基本资料-基金管理公司',
    url: '/multidata/deepdata/foundation/basic/managementcompany'
  },
  {
    title: '基金深度资料-基金基本资料-基金托管机构',
    url: '/multidata/deepdata/foundation/basic/trustee'
  },
  {
    title: '基金深度资料-基金规模-基金份额',
    url: '/multidata/deepdata/foundation/size/units'
  },
  {
    title: '基金深度资料-基金规模-ETF基金申购赎回',
    url: '/multidata/deepdata/foundation/size/etfredemption'
  },
  {
    title: '基金深度资料-基金市场表现-每日基金净值与行情',
    url: '/multidata/deepdata/foundation/marketperformance/netvalueandmarketdaily'
  },
  {
    title: '基金深度资料-基金市场表现-阶段基金净值与行情',
    url: '/multidata/deepdata/foundation/marketperformance/netvalueandmarketstage'
  },
  {
    title: '基金深度资料-基金市场表现-定期报告净值表现',
    url: '/multidata/deepdata/foundation/marketperformance/networthperformanceregularreporting'
  },
  {
    title: '基金深度资料-基金业绩分析-动态回撤',
    url: '/multidata/deepdata/foundation/performanceanalysis/dynamicretracement'
  },
  {
    title: '基金深度资料-基金业绩分析-基金评价',
    url: '/multidata/deepdata/foundation/performanceanalysis/evaluation'
  },
  {
    title: '基金深度资料-投资组合分析-资产配置',
    url: '/multidata/deepdata/foundation/portfolioanalysis/assetallocation'
  },
  {
    title: '基金深度资料-投资组合分析-股票投资组合-行业配置',
    url: '/multidata/deepdata/foundation/portfolioanalysis/stockportfolio/configindustry'
  },
  {
    title: '基金深度资料-投资组合分析-股票投资组合-地区配置',
    url: '/multidata/deepdata/foundation/portfolioanalysis/stockportfolio/configregional'
  },
  {
    title: '基金深度资料-投资组合分析-股票投资组合-重仓持股',
    url: '/multidata/deepdata/foundation/portfolioanalysis/stockportfolio/holdingsheavy'
  },
  {
    title: '基金深度资料-投资组合分析-股票投资组合-全部持股',
    url: '/multidata/deepdata/foundation/portfolioanalysis/stockportfolio/holdingsfull'
  },
  {
    title: '基金深度资料-投资组合分析-债券投资组合-券种配置',
    url: '/multidata/deepdata/foundation/portfolioanalysis/bondportfolio/securitiesallocation'
  },
  {
    title: '基金深度资料-投资组合分析-债券投资组合-重仓债券',
    url: '/multidata/deepdata/foundation/portfolioanalysis/bondportfolio/heavilyloadedbonds'
  },
  {
    title: '基金深度资料-投资组合分析-债券投资组合-全部持债',
    url: '/multidata/deepdata/foundation/portfolioanalysis/bondportfolio/fulldebt'
  },
  {
    title: '基金深度资料-投资组合分析-债券投资组合-持有资产支持证券明细',
    url: '/multidata/deepdata/foundation/portfolioanalysis/bondportfolio/detailsofassetbackedsecuritiesheld'
  },
  {
    title: '基金深度资料-投资组合分析-其他投资组合-持有基金明细',
    url: '/multidata/deepdata/foundation/portfolioanalysis/otherportfolios/detailsoffundsheld'
  },
  {
    title: '基金深度资料-投资组合分析-货币基金专项-投资组合剩余期限',
    url: '/multidata/deepdata/foundation/portfolioanalysis/mnetaryfundspecial/remainingtermofportfolio'
  },
  {
    title: '基金深度资料-投资组合分析-货币基金专项-基金净值偏离情况',
    url: '/multidata/deepdata/foundation/portfolioanalysis/mnetaryfundspecial/deviationoffundnetvalue'
  },
  {
    title: '基金深度资料-投资组合分析-专项统计-累计买入价值超净值2%或前20名股票',
    url: '/multidata/deepdata/foundation/portfolioanalysis/specialstatistics/stockspurchase'
  },
  {
    title: '基金深度资料-投资组合分析-专项统计-累计卖出价值超净值2%或前20名股票',
    url: '/multidata/deepdata/foundation/portfolioanalysis/specialstatistics/stocksselling'
  },
  {
    title: '基金深度资料-投资组合分析-专项统计-公司旗下基金共同持仓品种',
    url: '/multidata/deepdata/foundation/portfolioanalysis/specialstatistics/mutualfundpositions'
  },
  {
    title: '基金深度资料-财务摘要',
    url: '/multidata/deepdata/foundation/financialdata/financialsummary'
  },
  {
    title: '基金深度资料-财务数据-单季度财务指标',
    url: '/multidata/deepdata/foundation/financialdata/singlequarterfinancialindicators'
  },
  {
    title: '基金深度资料-财务报表-基础报表-资产负债表',
    url: '/multidata/deepdata/foundation/financialdata/fbalancesheet'
  },
  {
    title: '基金深度资料-利润表',
    url: '/multidata/deepdata/foundation/financialdata/fprofitstatement'
  },
  {
    title: '基金深度资料-财务数据-基金净值变动表',
    url: '/multidata/deepdata/foundation/financialdata/netfundchange'
  },
  {
    title: '基金深度资料-红利',
    url: '/multidata/deepdata/foundation/importantmatters/bonus'
  },
  {
    title: '基金深度资料-重大事项-拆分',
    url: '/multidata/deepdata/foundation/importantmatters/split'
  },
  {
    title: '基金深度资料-持有人结构-持有人户数及结构',
    url: '/multidata/deepdata/foundation/holderstructure/numberandstructure'
  },
  {
    title: '基金深度资料-持有人结构-前十名持有人',
    url: '/multidata/deepdata/foundation/holderstructure/ftop10'
  },
  {
    title: '基金深度资料-相关产品-同类基金',
    url: '/multidata/deepdata/foundation/relatedproducts/similarfund'
  },
  {
    title: '基金深度资料-相关产品-相同管理人',
    url: '/multidata/deepdata/foundation/relatedproducts/samemanager'
  },
  {
    title: '基金深度资料-基金公告',
    url: '/multidata/deepdata/foundation/fundnotice'
  },
  {
    title: '债券深度资料-基础资料',
    url: '/multidata/deepdata/bond/basicinfo'
  },
  {
    title: '债券深度资料-基本条款',
    url: '/multidata/deepdata/bond/basicinfo'
  },
  {
    title: '债券深度资料-募集及发行',
    url: '/multidata/deepdata/bond/basicinfo'
  },
  {
    title: '债券深度资料-债券收益率-中债网收益率',
    url: '/multidata/deepdata/bond/yield/chinabond'
  },
  {
    title: '债券深度资料-债券收益率-货币网收益率',
    url: '/multidata/deepdata/bond/yield/chinamoney'
  },
  {
    title: '债券深度资料-债券估值-上清所估值',
    url: '/multidata/deepdata/bond/valuation/shclearingvaluation'
  },
  {
    title: '债券深度资料-债券估值-货币网估值',
    url: '/multidata/deepdata/bond/valuation/chinamoneyvaluation'
  },
  {
    title: '债券深度资料-债券信息-现金流',
    url: '/multidata/deepdata/bond/information/bcashflow'
  },
  {
    title: '债券深度资料-债券信息-评级历史',
    url: '/multidata/deepdata/bond/information/ratinghistory'
  },
  {
    title: '债券深度资料-债券信息-相同发行人',
    url: '/multidata/deepdata/bond/information/commonissuer'
  },
  {
    title: '债券深度资料-财务摘要',
    url: '/multidata/deepdata/bond/bfinancialdata/bfinancialsummary'
  },
  {
    title: '债券深度资料-财务报表-基础报表-资产负债表',
    url: '/multidata/deepdata/bond/bfinancialdata/bbalancesheet'
  },
  {
    title: '债券深度资料-利润表',
    url: '/multidata/deepdata/bond/bfinancialdata/bprofitstatement'
  },
  {
    title: '债券深度资料-财务信息-现金流量表',
    url: '/multidata/deepdata/bond/bfinancialdata/cashflowstatement'
  },
  {
    title: '指数深度资料-基本信息',
    url: '/multidata/deepdata/index/basicinfo'
  },
  {
    title: '指数深度资料-指数概况-市场表现',
    url: '/multidata/deepdata/index/general/performance'
  },
  {
    title: '指数深度资料-指数概况-样本股速览',
    url: '/multidata/deepdata/index/general/sampledstocks'
  },
  {
    title: '指数深度资料-指数概况-占比情况',
    url: '/multidata/deepdata/index/general/proportion'
  },
  {
    title: '指数深度资料-成分数据-成分及权重',
    url: '/multidata/deepdata/index/componentdata/compositionweight'
  },
  {
    title: '指数深度资料-成分数据-成分表现排名',
    url: '/multidata/deepdata/index/componentdata/componentrank'
  },
  {
    title: '指数深度资料-成分数据-成分变更记录',
    url: '/multidata/deepdata/index/componentdata/changerecord'
  },
  {
    title: '指数深度资料-回报分析-行情统计',
    url: '/multidata/deepdata/index/returnanalysis/marketstatistics'
  },
  {
    title: '指数深度资料-回报分析-市场回报率',
    url: '/multidata/deepdata/index/returnanalysis/returnrate'
  },
  {
    title: '指数深度资料-相关基金-跟踪标的',
    url: '/multidata/deepdata/index/relatedfunds/trackingsymbol'
  },
  {
    title: '指数深度资料-相关基金-业绩基准',
    url: '/multidata/deepdata/index/relatedfunds/performancebenchmark'
  },
  {
    title: '股票专题统计',
    url: '/stockStatistics/marketOverview'
  },
  {
    title: '股票专题统计-市场概况-市场速览',
    url: '/stockStatistics/marketOverview'
  },
  {
    title: '股票专题统计-市场概况-市场规模',
    url: '/stockStatistics/marketStatistics'
  },
  {
    title: '股票专题统计-市场概况-基本资料-上市股票一览',
    url: '/stockStatistics/basicInfo/listedStock'
  },
  {
    title: '股票专题统计-市场概况-基本资料-上市公司资料',
    url: '/stockStatistics/basicInfo/listedCompany'
  },
  {
    title: '股票专题统计-市场概况-基本资料-上市公司规模',
    url: '/stockStatistics/basicInfo/listedCompanySize'
  },
  {
    title: '股票专题统计-行业统计-股本统计',
    url: '/sectorPlate/equityStatistics'
  },
  {
    title: '股票专题统计-行业统计-机构持股',
    url: '/sectorPlate/institutionalHolding'
  },
  {
    title: '股票专题统计-行业统计-交易统计',
    url: '/sectorPlate/tradingStatistics'
  },
  {
    title: '股票专题统计-行业统计-市值比较',
    url: '/sectorPlate/marketvalueComparison'
  },
  {
    title: '股票专题统计-行业统计-市值变化',
    url: '/sectorPlate/marketvalueChanges'
  },
  {
    title: '股票专题统计-行业统计-融资融券',
    url: '/sectorPlate/marginTrading'
  },
  {
    title: '股票专题统计-行业统计-估值分析',
    url: '/sectorPlate/valuationAnalysis'
  },
  {
    title: '股票专题统计-融资融券-两融速递',
    url: '/marginTrading/marginExpress'
  },
  {
    title: '股票专题统计-融资融券-两融市场统计',
    url: '/marginTrading/transactionStatistics'
  },
  {
    title: '股票专题统计-融资融券-两融规模分析',
    url: '/marginTrading/scaleAnalysis'
  },
  {
    title: '股票专题统计-融资融券-个券交易排行榜',
    url: '/marginTrading/couponRanking'
  },
  {
    title: '股票专题统计-融资融券-个券交易统计',
    url: '/marginTrading/couponStatistics'
  },
  {
    title: '股票专题统计-融资融券-担保品市场统计',
    url: '/marginTrading/collateralStatistics'
  },
  {
    title: '股票专题统计-融资融券-担保券数量统计',
    url: '/marginTrading/guaranteeStatistics'
  },
  {
    title: '股票专题统计-融资融券-两融标的券',
    url: '/marginTrading/targetInformation'
  },
  {
    title: '股票专题统计-融资融券-可冲抵保证金券',
    url: '/marginTrading/securityDeposit'
  },
  {
    title: '股票专题统计-南北向资金-南北向资金',
    url: '/northsouthfunds/northsouthfunds'
  },
  {
    title: '股票专题统计-交易统计-成交量额统计',
    url: '/trade/exchangeStatistics'
  },
  {
    title: '股票专题统计-交易统计-综合交易统计',
    url: '/trade/hyStatistics'
  },
  {
    title: '股票专题统计-交易统计-地区交易统计',
    url: '/trade/areaStatistics'
  },
  {
    title: '股票专题统计-转融通-转融资市场交易统计',
    url: '/transferAccommodation/marketTransactionStatistics'
  },
  {
    title: '股票专题统计-转融通-转融券市场交易统计',
    url: '/transferAccommodation/convertibleBondMarketStatistics'
  },
  {
    title: '股票专题统计-转融通-转融券个券交易统计',
    url: '/transferAccommodation/convertibleBondTicketStatistics'
  },
  {
    title: '股票专题统计-转融通-转融通期限费率',
    url: '/transferAccommodation/refinancingTermRate'
  },
  {
    title: '股票专题统计-转融通-转融通标的券',
    url: '/transferAccommodation/securitiesInformation'
  },
  {
    title: '股票专题统计-转融通-转融通可冲抵保证金券',
    url: '/transferAccommodation/marginDeductibleSecurities'
  },
  {
    title: '股票专题统计-盈利预测-个股投资评级-最新买入评级股票',
    url: '/profitForecast/investmentRatings/buyRating'
  },
  {
    title: '股票专题统计-盈利预测-个股投资评级-最新机构首次关注股票',
    url: '/profitForecast/investmentRatings/latestInstitutionsLooking'
  },
  {
    title: '股票专题统计-盈利预测-个股投资评级-最新评级调高股票',
    url: '/profitForecast/investmentRatings/latestUpgradedStock'
  },
  {
    title: '股票专题统计-盈利预测-个股投资评级-最新评级调低股票',
    url: '/profitForecast/investmentRatings/latestDowngradedStock'
  },
  {
    title: '股票专题统计-盈利预测-个股投资评级-综合评级调高股票',
    url: '/profitForecast/investmentRatings/overallRankingRaisedStock'
  },
  {
    title: '股票专题统计-盈利预测-个股投资评级-综合评级调低股票',
    url: '/profitForecast/investmentRatings/overallRankingDowngradedStock'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-最新预测调高公司',
    url: '/profitForecast/performanceForecast/forecastRaise'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-最新预测调低公司',
    url: '/profitForecast/performanceForecast/forecastDown'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-最新机构预测均值',
    url: '/profitForecast/performanceForecast/agencyForecast'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-一致性预测调高',
    url: '/profitForecast/performanceForecast/consistentPredictionRaise'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-一致性预测不断调高',
    url: '/profitForecast/performanceForecast/consistentPredictionUnceasingRaise'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-预测业绩增幅最大',
    url: '/profitForecast/performanceForecast/forecastperFormanceIncreaseBiggest'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-一致性预测调低',
    url: '/profitForecast/performanceForecast/consistentPredictionDown'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-一致性预测不断调低',
    url: '/profitForecast/performanceForecast/consistentPredictionUnceasingDown'
  },
  {
    title: '股票专题统计-盈利预测-个股业绩预测-预测业绩降幅最大',
    url: '/profitForecast/performanceForecast/forecastperFormanceFallBiggest'
  },
  {
    title: '股票专题统计-高送转-高送转',
    url: '/highTurn/highTurnPage'
  },
  {
    title: '股票专题统计-问询监管函-问询监管函',
    url: '/superviseEnquiry/superviseEnquiryPage'
  },
  {
    title: '股票专题统计-定期报告预约披露-定期报告预约披露',
    url: '/reportAppointments/reportAppointmentsPage'
  },
  {
    title: '基金专题统计-基金市场-基金概况',
    url: '/fundStatistics/marketProfile'
  },
  {
    title: '基金专题统计-基金市场-市场统计（协会公布）',
    url: '/fundStatistics/marketStatistics'
  },
  {
    title: '基金专题统计-基金市场-市场规模',
    url: '/fundStatistics/marketSize'
  },
  {
    title: '基金专题统计-基金市场-份额统计-市场汇总',
    url: '/fundStatistics/shareStatistics/marketSummary'
  },
  {
    title: '基金专题统计-基金市场-份额统计-份额明细',
    url: '/fundStatistics/shareStatistics/quotaDetail'
  },
  {
    title: '基金专题统计-基金市场-持有人结构',
    url: '/fundStatistics/holderStructure'
  },
  {
    title: '基金专题统计-基金市场-ETF申赎及明细',
    url: '/fundStatistics/etfDetails'
  },
  {
    title: '基金专题统计-基金市场-费率汇总',
    url: '/fundStatistics/rateSummary'
  },
  {
    title: '板块热度',
    url: '/webHotChart'
  },
  {
    title: '基金日历',
    url: '/fundCalendar'
  },
  {
    title: '宏观日历',
    url: '/ecoCalendar'
  },
  {
    title: '首页涨跌分布图',
    url: '/upDownChart'
  },
  {
    title: '组合管理-组合准备-回归分析',
    url: '/portfolio/portfolioReady/regressionAnalysis'
  },
  {
    title: '组合管理-组合准备-相关性分析',
    url: '/portfolio/portfolioReady/correlationAnalysis'
  },
  {
    title: '组合管理-组合准备-波动率分析',
    url: '/portfolio/portfolioReady/volatility'
  },
  {
    title: '组合管理-组合准备-期间收益',
    url: '/portfolio/portfolioReady/holdingPeriodYield'
  },
  {
    title: '组合管理-组合准备-因子分析-三因子',
    url: '/portfolio/portfolioReady/factorAnalysis/threeFactor'
  },
  {
    title: '组合管理-组合准备-因子分析-四因子',
    url: '/portfolio/portfolioReady/factorAnalysis/fourFactor'
  },
  {
    title: '组合管理-组合准备-因子分析-五因子',
    url: '/portfolio/portfolioReady/factorAnalysis/fiveFactor'
  },
  {
    title: '财经新闻',
    url: '/news/finance'
  },
  {
    title: '新股事件',
    url: '/news/stock'
  },
  {
    title: '股市事件',
    url: '/stockEvent'
  },
  {
    title: '宏观日历',
    url: '/ecoCalendar'
  },
  {
    title: '市场情绪',
    url: '/chance/marketemotion/marketstatistics'
  },
  {
    title: '公告披露-沪深京股票-全部',
    url: '/news/notice'
  },
  {
    title: '公告披露-基金-全部',
    url: '/news/notice?type=2'
  },
  {
    title: '公告披露-债券-全部',
    url: '/news/notice?type=4'
  },
  {
    title: '研报中心-全部研报',
    url: '/news/report?treeid=01&treename='
  },
  {
    title: '研报中心-行业研究',
    url: '/news/report?treeid=2&treename=行业研究'
  },
  {
    title: '研报中心-公司研究',
    url: '/news/report?treeid=1&treename=公司研究'
  },
  {
    title: '研报中心-宏观研究',
    url: '/news/report?treeid=33&treename=宏观研究'
  },
  {
    title: '研报中心-基金研究',
    url: '/news/report?treeid=34&treename=基金研究'
  },
  {
    title: '研报中心-期货研究',
    url: '/news/report?treeid=35&treename=期货研究'
  },
  {
    title: '研报中心-期权研究',
    url: '/news/report?treeid=36&treename=期权研究'
  },
  {
    title: '研报中心-权证市场',
    url: '/news/report?treeid=37&treename=权证市场'
  },
  {
    title: '研报中心-融资融券',
    url: '/news/report?treeid=38&treename=融资融券'
  },
  {
    title: '研报中心-投资策略',
    url: '/news/report?treeid=39&treename=投资策略'
  },
  {
    title: '研报中心-外汇研究',
    url: '/news/report?treeid=40&treename=外汇研究'
  },
  {
    title: '研报中心-债券研究',
    url: '/news/report?treeid=41&treename=债券研究'
  },
  {
    title: '宏观经济',
    url: '/economicDatabase'
  },
  {
    title: '财务纵比',
    url: '/financialAnalysis'
  },
  {
    title: '智能选股',
    url: '/equityScreener?secretId'
  },
  {
    title: '诊股扫雷',
    url: '/mineClearance'
  },
  {
    title: '港股深度资料-公司资料-公司介绍',
    url: '/multidata/deepdata/HKstock/company/introduction'
  },
  {
    title: '港股深度资料-公司资料-股本结构',
    url: '/multidata/deepdata/HKstock/company/construction'
  },
  {
    title: '港股深度资料-公司资料-董监高信息',
    url: '/multidata/deepdata/HKstock/company/member'
  },
  {
    title: '港股深度资料-公司资料-董监高薪酬及持股',
    url: '/multidata/deepdata/HKstock/company/payment'
  },
  {
    title: '港股深度资料-证券资料-证券简介',
    url: '/multidata/deepdata/HKstock/securityinfo/briefintroduction'
  },
  {
    title: '港股深度资料-证券资料-窝轮信息',
    url: '/multidata/deepdata/HKstock/securityinfo/warrantinfo'
  },
  {
    title: '港股深度资料-证券资料-牛熊证',
    url: '/multidata/deepdata/HKstock/securityinfo/callablebull'
  },
  {
    title: '港股深度资料-融资分配-派息明细',
    url: '/multidata/deepdata/HKstock/stockholders/top10'
  },
  {
    title: '港股深度资料-融资分配-拆细合并',
    url: '/multidata/deepdata/HKstock/stockholders/circulatetop10'
  },
  {
    title: '港股深度资料-融资分配-配股信息',
    url: '/multidata/deepdata/HKstock/stockholders/holdersnumber'
  },
  {
    title: '港股深度资料-融资分配-股票回购',
    url: '/multidata/deepdata/HKstock/stockholders/orgholders'
  },
  {
    title: '港股深度资料-融资分配-供股权交易',
    url: '/multidata/deepdata/HKstock/stockholders/lifting'
  },
  {
    title: '港股深度资料-融资分配-IPO',
    url: '/multidata/deepdata/HKstock/stockholders/IPO'
  },
  {
    title: '港股深度资料-重大事项-并购重组',
    url: '/multidata/deepdata/HKstock/importantevent/regroup'
  },
  {
    title: '港股深度资料-财务报表-财务摘要',
    url: '/multidata/deepdata/HKstock/financialreport/financialsummaryeasy'
  },
  {
    title: '港股深度资料-财务报表-资产负债表',
    url: '/multidata/deepdata/HKstock/financialreport/balancesheet'
  },
  {
    title: '港股深度资料-财务报表-利润表',
    url: '/multidata/deepdata/HKstock/financialreport/profitstatement'
  },
  {
    title: '港股深度资料-新闻公告-回顾展望',
    url: '/multidata/deepdata/HKstock/news/notices'
  },
  {
    title: '港股深度资料-财务报表-现金流量表',
    url: '/multidata/deepdata/HKstock/financialreport/cashflow'
  }
]

export const highwinUrlMap = new Map(highwinUrls.map((item) => [item.title, item.url]))

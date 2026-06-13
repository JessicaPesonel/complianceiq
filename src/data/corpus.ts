export interface Entry {
  id: string;
  type: "regulation" | "case";
  title: { zh: string; en: string };
  source: string;
  /** Searchable body (CJK + EN terms). */
  text: string;
  /** Key quotable sentence shown in the answer. */
  excerpt: string;
  risk?: string;
  advice?: string;
  tags: string[];
}

/**
 * Curated, representative corpus for Chinese cross-border-payment compliance.
 * Regulation names are real; enforcement "cases" are illustrative composites
 * (no real entities named) used to demonstrate retrieval + structured answers.
 */
export const corpus: Entry[] = [
  {
    id: "reg-payment-ordinance",
    type: "regulation",
    title: { zh: "非银行支付机构监督管理条例", en: "Regulation on Non-bank Payment Institutions" },
    source: "国务院令第768号（2024）",
    text: "非银行支付机构条例 支付业务 牌照 许可 收单 储值账户运营 网络支付 为收款人提供货币资金转移服务 必须取得支付业务许可证 未经许可不得从事支付业务 跨境电商 收款结算 备付金",
    excerpt: "从事支付业务应当依法取得支付业务许可证；未经批准，任何单位和个人不得从事或者变相从事支付业务。",
    risk: "无证或超范围经营支付业务可能构成非法经营，面临没收违法所得、罚款乃至刑事责任。",
    advice: "为境内商户提供收款结算应自行申请支付业务许可，或全程通过持牌支付机构开展并签订合规协议。",
    tags: ["支付牌照", "收单", "许可"],
  },
  {
    id: "reg-online-payment",
    type: "regulation",
    title: { zh: "非银行支付机构网络支付业务管理办法", en: "Administrative Measures for Online Payment of Non-bank Payment Institutions" },
    source: "中国人民银行公告〔2015〕第43号",
    text: "网络支付业务 实名制 账户分类 I类 II类 III类 限额 交易验证 客户身份识别 风险准备金 支付账户 余额支付",
    excerpt: "支付机构应当对支付账户实行实名制管理，并根据身份核实方式对个人支付账户进行分类与限额管理。",
    risk: "账户实名与限额管理缺失，易被用于洗钱、电信诈骗资金通道，触发监管处罚与账户冻结。",
    advice: "落实账户分类与交易验证，建立可疑交易识别规则，对大额、高频、跨境交易加强核验。",
    tags: ["实名制", "账户分类", "限额"],
  },
  {
    id: "reg-aml-report",
    type: "regulation",
    title: { zh: "金融机构大额交易和可疑交易报告管理办法", en: "Measures on Large-Value & Suspicious Transaction Reporting" },
    source: "中国人民银行令〔2016〕第3号",
    text: "大额交易 可疑交易 报告 STR 反洗钱监测 人民币 外币 单笔或当日累计 5万元 跨境 20万元 资金来源不明 快进快出 资金分层 报告时限",
    excerpt: "金融机构发现或者有合理理由怀疑客户、资金或交易与洗钱等犯罪活动相关的，应当提交可疑交易报告。",
    risk: "应报未报、漏报可疑交易将面临行政处罚，相关责任人可被追责。",
    advice: "建立规则+模型的可疑交易监测体系，保留完整证据链，在规定时限内提交可疑交易报告（STR）。",
    tags: ["反洗钱", "可疑交易", "STR", "大额交易"],
  },
  {
    id: "reg-aml-law",
    type: "regulation",
    title: { zh: "中华人民共和国反洗钱法", en: "Anti-Money Laundering Law of the PRC" },
    source: "全国人大常委会（2024修订）",
    text: "反洗钱法 客户尽职调查 KYC 受益所有人 识别 风险为本 制裁名单筛查 反恐怖融资 记录保存 五年 监管 处罚",
    excerpt: "金融机构应当按照规定建立客户尽职调查制度，识别并核实客户及受益所有人身份。",
    risk: "未开展客户尽职调查或受益所有人识别，属于反洗钱义务违反，面临高额罚款。",
    advice: "落实风险为本的 KYC、受益所有人识别与制裁名单筛查，交易记录至少保存五年。",
    tags: ["反洗钱", "KYC", "受益所有人", "制裁筛查"],
  },
  {
    id: "reg-forex",
    type: "regulation",
    title: { zh: "外汇管理条例", en: "Regulations on Foreign Exchange Administration" },
    source: "国务院令第532号",
    text: "外汇管理 跨境资金 结售汇 真实性 合规性审核 经常项目 资本项目 逃汇 套汇 虚假贸易背景 跨境支付 收付汇",
    excerpt: "经常项目外汇收支应当具有真实、合法的交易基础；银行应当对交易单证的真实性进行合理审查。",
    risk: "以虚假贸易背景办理跨境收付汇可能构成逃汇、非法买卖外汇，面临外汇行政处罚。",
    advice: "保留完整的贸易/服务背景单证，确保资金流与货物/服务流、合同流一致（三流合一）。",
    tags: ["外汇", "跨境", "真实性审核", "逃汇"],
  },
  {
    id: "reg-pipl",
    type: "regulation",
    title: { zh: "个人信息保护法", en: "Personal Information Protection Law (PIPL)" },
    source: "全国人大常委会（2021）",
    text: "个人信息保护法 PIPL 跨境传输 个人信息出境 安全评估 标准合同 单独同意 最小必要 敏感个人信息 支付信息 用户授权",
    excerpt: "向境外提供个人信息应当具备合法基础，并通过安全评估、标准合同或认证等路径之一。",
    risk: "未经合法路径将支付/用户个人信息出境，可能被责令改正、罚款乃至暂停业务。",
    advice: "对个人信息出境开展安全评估或签订标准合同，取得单独同意，遵循最小必要原则。",
    tags: ["数据合规", "PIPL", "跨境数据", "个人信息出境"],
  },
  {
    id: "reg-dsl",
    type: "regulation",
    title: { zh: "数据安全法", en: "Data Security Law" },
    source: "全国人大常委会（2021）",
    text: "数据安全法 数据分类分级 重要数据 数据出境 风险评估 数据处理活动 安全管理制度 金融数据 交易数据",
    excerpt: "开展数据处理活动应当建立健全全流程数据安全管理制度，对数据实行分类分级保护。",
    risk: "重要数据未分级保护或违规出境，可能触发数据安全审查与行政处罚。",
    advice: "建立数据分类分级清单，识别重要数据，对其存储、传输、出境实施额外管控。",
    tags: ["数据合规", "数据安全", "分类分级"],
  },
  {
    id: "reg-reserve",
    type: "regulation",
    title: { zh: "支付机构客户备付金存管办法", en: "Measures on Custody of Client Reserve Funds" },
    source: "中国人民银行令〔2021〕第1号",
    text: "客户备付金 集中存管 不得挪用 不得占用 利息 专用存款账户 备付金集中交存 商户资金 结算周期",
    excerpt: "支付机构接收的客户备付金应当全额集中交存，不得以任何形式挪用、占用客户备付金。",
    risk: "挪用、占用客户备付金属于严重违规，可吊销牌照并追究刑事责任。",
    advice: "备付金全额集中存管、专户管理、账实相符，建立资金到账与结算的对账与审计机制。",
    tags: ["备付金", "资金存管", "挪用"],
  },

  {
    id: "case-unlicensed",
    type: "case",
    title: { zh: "无证经营支付业务被处罚没（代表性案例）", en: "Unlicensed payment operation penalized (representative)" },
    source: "代表性执法案例 · 2023",
    text: "无证经营支付业务 二清 资金二次清算 跨境电商收款 平台为商户归集结算 处罚没合计 非法经营 支付牌照",
    excerpt: "某平台在未取得支付牌照的情况下为境内商户归集并清算资金（俗称“二清”），被认定为非法从事支付业务，处罚没合计逾亿元。",
    advice: "避免“二清”模式：资金应直接进入持牌机构备付金账户，平台不得沉淀、清分商户资金。",
    tags: ["支付牌照", "二清", "非法经营"],
  },
  {
    id: "case-ecom-rectify",
    type: "case",
    title: { zh: "跨境电商资金归集合规整改（代表性案例）", en: "Cross-border e-commerce fund-pooling rectification (representative)" },
    source: "代表性执法案例 · 2022",
    text: "跨境电商 收款 资金归集 整改 接入持牌支付机构 备付金直连 真实贸易背景 收结汇 三流合一",
    excerpt: "某跨境电商平台原自行归集境外收款，经整改后全面接入持牌支付机构，由其完成收结汇与备付金存管。",
    advice: "跨境收款应通过持牌机构完成收结汇，并保存订单、物流、报关等贸易背景单证。",
    tags: ["跨境", "支付牌照", "外汇"],
  },
  {
    id: "case-reserve-misuse",
    type: "case",
    title: { zh: "挪用客户备付金案（代表性案例）", en: "Misuse of client reserve funds (representative)" },
    source: "代表性执法案例 · 2021",
    text: "挪用客户备付金 占用 资金池 流动性 吊销牌照 账实不符 备付金存管 专户",
    excerpt: "某支付机构将客户备付金用于关联方放贷，账实长期不符，最终被吊销支付业务许可证。",
    advice: "备付金专户专用、日终对账，杜绝任何形式的占用、出借或投资。",
    tags: ["备付金", "挪用"],
  },
  {
    id: "case-str-missed",
    type: "case",
    title: { zh: "大额可疑交易未报告被罚（代表性案例）", en: "Failure to report suspicious transactions penalized (representative)" },
    source: "代表性执法案例 · 2023",
    text: "可疑交易 未报告 漏报 大额交易 快进快出 资金分层 反洗钱处罚 监测系统失效 STR",
    excerpt: "某机构监测系统对“快进快出+资金分层”特征预警后未及时提交可疑交易报告，被处以反洗钱罚款。",
    advice: "对模型预警的高风险交易建立闭环处置与报告流程，确保应报尽报、留痕可追溯。",
    tags: ["反洗钱", "可疑交易", "STR"],
  },
  {
    id: "case-data-export",
    type: "case",
    title: { zh: "违规跨境传输个人信息（代表性案例）", en: "Improper cross-border transfer of personal info (representative)" },
    source: "代表性执法案例 · 2023",
    text: "个人信息出境 未经安全评估 未取得单独同意 支付信息 用户数据 跨境传输 PIPL 责令改正 罚款",
    excerpt: "某机构未经安全评估、未取得单独同意，将含支付信息的用户数据传输至境外服务器，被责令改正并罚款。",
    advice: "梳理数据出境场景，完成安全评估/标准合同，取得单独同意，必要时本地化存储。",
    tags: ["数据合规", "PIPL", "跨境数据"],
  },
  {
    id: "case-fake-trade",
    type: "case",
    title: { zh: "虚假贸易背景逃汇（代表性案例）", en: "Evasion of FX via sham trade background (representative)" },
    source: "代表性执法案例 · 2022",
    text: "虚假贸易背景 逃汇 套汇 跨境收付汇 单证不实 三流不一致 外汇处罚 资金出境",
    excerpt: "某企业以无真实交易的贸易合同办理跨境付汇，资金流与货物流不一致，被认定为逃汇并处罚。",
    advice: "确保合同流、资金流、货物/服务流一致，留存可核验的贸易背景材料备查。",
    tags: ["外汇", "逃汇", "跨境"],
  },
];

export const byId = (id: string) => corpus.find((e) => e.id === id);

/** Field used for BM25 indexing — title + body + tags weighted by repetition. */
export const indexText = (e: Entry) =>
  `${e.title.zh} ${e.title.zh} ${e.text} ${e.tags.join(" ")} ${e.tags.join(" ")}`;

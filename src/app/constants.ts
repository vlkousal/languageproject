export const STREAK_FOR_HEALTH: number = 3;
export const MAX_HEALTH: number = 10;

export class VocabSet{

  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}

export class Word {
  question: string;
  phonetic: string;
  correct: string;
  answers: string[];
  constructor(question: string, phonetic: string, correct: string, answers: string[]) {
    this.question = question;
    this.phonetic = phonetic
    this.correct = correct;
    this.answers = answers;
  }
}

export class VocabularySet {

    name: string;
    url: string;
    first_flag: string;
    second_flag: string;

    constructor(name: string, url: string, first_flag: string, second_flag: string) {
        this.name = name;
        this.url = url;
        this.first_flag = first_flag;
        this.second_flag = second_flag;
    }
}


export const hsk3 = "零;líng;zero\n" +
  "一;yī;one\n" +
  "二;èr;two\n" +
  "三;sān;three\n" +
  "四;sì;four\n" +
  "五;wǔ;five\n" +
  "六;liù;six\n" +
  "七;qī;seven\n" +
  "八;bā;eight\n" +
  "九;jiǔ;nine\n" +
  "十;shí;ten\n" +
  "两;liǎng;two\n" +
  "百;bǎi;hundred\n" +
  "千;qiān;thousand\n" +
  "万;wàn;ten thousand\n" +
  "第一;dì-yī;first\n" +
  "半;bàn;half\n" +
  "我;wǒ;I\n" +
  "你;nǐ;you\n" +
  "您;nín;you\n" +
  "他;tā;he\n" +
  "她;tā;she\n" +
  "它;tā;it\n" +
  "我们;wǒmen;we\n" +
  "自己;zìjǐ;oneself\n" +
  "大家;dàjiā;everybody\n" +
  "其他;qítā;other\n" +
  "别人;biéren;other people\n" +
  "这/这儿;zhè/zhèr;this/here\n" +
  "那/那儿;nà/nàr;that/there\n" +
  "哪/哪儿;nǎ/nǎr;which/where\n" +
  "谁;shéi;who\n" +
  "什么;shénme;what\n" +
  "多少;duōshao;how many\n" +
  "几;jǐ;how many\n" +
  "怎么;zěnme;how\n" +
  "怎么样;zěnmeyàng;how about\n" +
  "为什么;wèi shénme;why\n" +
  "现在;xiànzài;now\n" +
  "刚才;gāngcái;just now\n" +
  "今天;jīntiān;today\n" +
  "明天;míngtiān;tomorrow\n" +
  "昨天;zuótiān;yesterday\n" +
  "早上;zǎoshàng;early morning\n" +
  "上午;shàngwǔ;morning\n" +
  "中午;zhōngwǔ;noon\n" +
  "下午;xiàwǔ;afternoon\n" +
  "晚上;wǎnshàng;evening\n" +
  "点;diǎn;o’clock\n" +
  "小时;xiǎoshí;hour\n" +
  "分钟;fēnzhōng;minute\n" +
  "年;nián;year\n" +
  "月;yuè;month\n" +
  "日;rì;day\n" +
  "号;hào;date or number\n" +
  "星期;xīngqī;week\n" +
  "周末;zhōumò;weekend\n" +
  "时候;shíhou;a certain point in time\n" +
  "时间;shíjiān;a period of time\n" +
  "一会儿;yíhuìr;a short while\n" +
  "以前;yǐqián;before or ago\n" +
  "以后;yǐhòu;after or later\n" +
  "最近;zuìjìn;recent time\n" +
  "过去;guòqù;past\n" +
  "去年;qùnián;last year\n" +
  "季节;jìjié;season\n" +
  "春;chūn;spring\n" +
  "夏;xià;summer\n" +
  "秋;qiū;autumn\n" +
  "冬;dōng;winter\n" +
  "节日;jiérì;festival\n" +
  "生日;shēngrì;birthday\n" +
  "人;rén;person\n" +
  "男人;nánrén;man\n" +
  "女人;nǚrén;woman\n" +
  "名字;míngzì;name\n" +
  "妈妈;māma;mom\n" +
  "爸爸;bàba;dad\n" +
  "丈夫;zhàngfu;husband\n" +
  "妻子;qīzi;wife\n" +
  "孩子;háizi;child\n" +
  "儿子;érzi;son\n" +
  "女儿;nǚ’ér;daughter\n" +
  "哥哥;gēge;elder brother\n" +
  "姐姐;jiějie;elder sister\n" +
  "弟弟;dìdi;younger brother\n" +
  "妹妹;mèimei;younger sister\n" +
  "爷爷;yéye;grandpa\n" +
  "奶奶;nǎinai;grandma\n" +
  "叔叔;shūshu;uncle\n" +
  "阿姨;āyí;aunt or maid\n" +
  "朋友;péngyǒu;friend\n" +
  "客人;kèren;guest\n" +
  "邻居;línjū;neighbor\n" +
  "先生;xiānsheng;sir\n" +
  "小姐;xiǎojiě;Miss\n" +
  "老师;lǎoshī;teacher\n" +
  "学生;xuésheng;student\n" +
  "同学;tóngxué;schoolmate\n" +
  "同事;tóngshì;colleague\n" +
  "校长;xiàozhǎng;principal\n" +
  "医生;yīshēng;doctor\n" +
  "司机;sījī;driver\n" +
  "服务员;fúwùyuán;waiter\n" +
  "经理;jīnglǐ;manager\n" +
  "身体;shēntǐ;body\n" +
  "脸;liǎn;face\n" +
  "眼睛;yǎnjīng;eye\n" +
  "耳朵;ěrduo;ear\n" +
  "鼻子;bízi;nose\n" +
  "口;kǒu;mouth\n" +
  "头发;tóufa;hair\n" +
  "腿;tuǐ;leg\n" +
  "脚;jiǎo;foot\n" +
  "声音;shēngyīn;sound or voice\n" +
  "东西;dōngxi;thing\n" +
  "钱;qián;money\n" +
  "水;shuǐ;water\n" +
  "茶;chá;tea\n" +
  "咖啡;kāfēi;coffee\n" +
  "牛奶;niúnǎi;milk\n" +
  "面包;miànbāo;bread\n" +
  "蛋糕;dàngāo;cake\n" +
  "糖;táng;candy\n" +
  "菜;cài;dish\n" +
  "米饭;mǐfàn;rice\n" +
  "面条;miàntiáo;noodle\n" +
  "鸡蛋;jīdàn;egg\n" +
  "鱼;yú;fish\n" +
  "羊肉;yángròu;mutton\n" +
  "菜单;càidān;menu\n" +
  "衣服;yīfu;clothes\n" +
  "衬衫;chènshān;shirt\n" +
  "裤子;kùzi;pants\n" +
  "裙子;qúnzi;skirt\n" +
  "帽子;màozi;hat\n" +
  "鞋;xié;shoe\n" +
  "包;bāo;bag\n" +
  "行李箱;xínglǐxiāng;suitcase\n" +
  "伞;sǎn;umbrella\n" +
  "眼镜;yǎnjìng;glasses\n" +
  "书;shū;book\n" +
  "报纸;bàozhǐ;newspaper\n" +
  "字典;zìdiǎn;dictionary\n" +
  "地图;dìtú;map\n" +
  "票;piào;ticket\n" +
  "信;xìn;letter\n" +
  "照片;zhàopiàn;photo\n" +
  "护照;hùzhào;passport\n" +
  "照相机;zhàoxiàngjī;camera\n" +
  "桌子;zhuōzi;table\n" +
  "椅子;yǐzi;chair\n" +
  "黑板;hēibǎn;blackboard\n" +
  "铅笔;qiānbǐ;pencil\n" +
  "水果;shuǐguǒ;fruit\n" +
  "苹果;píngguǒ;apple\n" +
  "香蕉;xiāngjiāo;banana\n" +
  "西瓜;xīguā;watermelon\n" +
  "葡萄;pútáo;grape\n" +
  "果汁;guǒzhī;juice\n" +
  "啤酒;píjiǔ;beer\n" +
  "草;cǎo;grass\n" +
  "药;yào;medicine\n" +
  "杯子;bēizi;glass\n" +
  "碗;wǎn;bowl\n" +
  "筷子;kuàizi;chopsticks\n" +
  "盘子;pánzi;plate\n" +
  "手表;shǒubiǎo;watch\n" +
  "手机;shǒujī;mobile phone\n" +
  "电视;diànshì;TV\n" +
  "电脑;diànnǎo;computer\n" +
  "电子邮件;diànzǐ yóujiàn;email\n" +
  "冰箱;bīngxiāng;refrigerator\n" +
  "空调;kōngtiáo;air conditioner\n" +
  "灯;dēng;light\n" +
  "电影;diànyǐng;movie\n" +
  "礼物;lǐwù;gift\n" +
  "飞机;fēijī;plane\n" +
  "出租车;chūzūchē;taxi\n" +
  "公共汽车;gōnggòng qìchē;bus\n" +
  "地铁;dìtiě;metro\n" +
  "自行车;zìxíngchē;bike\n" +
  "船;chuán;boat\n" +
  "门;mén;door\n" +
  "电梯;diàntī;elevator\n" +
  "颜色;yánsè;color\n" +
  "动物;dòngwù;animal\n" +
  "猫;māo;cat\n" +
  "狗;gǒu;dog\n" +
  "马;mǎ;horse\n" +
  "熊猫;xióngmāo;panda\n" +
  "鸟;niǎo;bird\n" +
  "树;shù;tree\n" +
  "天气;tiānqì;weather\n" +
  "太阳;tàiyáng;sun\n" +
  "月亮;yuèliang;moon\n" +
  "云;yún;cloud\n" +
  "雪;xuě;snow\n" +
  "字;zì;character\n" +
  "词语;cíyǔ;word\n" +
  "句子;jùzi;sentence\n" +
  "汉语;Hànyǔ;Chinese\n" +
  "普通话;pǔtōnghuà;Mandarin\n" +
  "数学;shùxué;math\n" +
  "课;kè;lesson\n" +
  "班;bān;class\n" +
  "年级;niánjí;grade\n" +
  "作业;zuòyè;homework\n" +
  "考试;kǎoshì;exam\n" +
  "成绩;chéngjì;score\n" +
  "水平;shuǐpíng;level\n" +
  "问题;wèntí;question\n" +
  "题;tí;exam question\n" +
  "意思;yìsi;meaning\n" +
  "事情;shìqing;matter\n" +
  "兴趣;xìngqù;interest\n" +
  "爱好;àihào;hobby\n" +
  "音乐;yīnyuè;music\n" +
  "体育;tǐyù;P.E.\n" +
  "办法;bànfǎ;method\n" +
  "习惯;xíguàn;habit\n" +
  "比赛;bǐsài;match\n" +
  "游戏;yóuxì;game\n" +
  "故事;gùshi;story\n" +
  "关系;guānxì;relation\n" +
  "环境;huánjìng;environment\n" +
  "会议;huìyì;meeting\n" +
  "机会;jīhuì;opportunity\n" +
  "节目;jiémù;program\n" +
  "世界;shìjiè;world\n" +
  "历史;lìshǐ;history\n" +
  "文化;wénhuà;culture\n" +
  "新闻;xīnwén;news\n" +
  "作用;zuòyòng;effect\n" +
  "中国;Zhōngguó;China\n" +
  "北京;Běijīng;Beijing\n" +
  "国家;guójiā;nation\n" +
  "城市;chéngshì;city\n" +
  "地方;dìfāng;place\n" +
  "家;jiā;home\n" +
  "楼;lóu;building\n" +
  "房间;fángjiān;room\n" +
  "厨房;chúfáng;kitchen\n" +
  "洗手间;xǐshǒujiān;washroom\n" +
  "学校;xuéxiào;school\n" +
  "教室;jiàoshì;classroom\n" +
  "图书馆;túshūguǎn;library\n" +
  "公司;gōngsī;company\n" +
  "办公室;bàngōngshì;office\n" +
  "饭馆;fànguǎn;restaurant\n" +
  "宾馆;bīngguǎn;hotel\n" +
  "商店;shāngdiàn;shop\n" +
  "超市;chāoshì;supermarket\n" +
  "公园;gōngyuán;park\n" +
  "花园;huāyuán;garden\n" +
  "银行;yínháng;bank\n" +
  "医院;yīyuàn;hospital\n" +
  "机场;jīchǎng;airport\n" +
  "火车站;huǒchēzhàn;train station\n" +
  "路;lù;road\n" +
  "街道;jiēdào;street\n" +
  "河;hé;river\n" +
  "上;shàng;above\n" +
  "下;xià;below\n" +
  "左边;zuǒbiān;left\n" +
  "右边;yòubiān;right\n" +
  "中间;zhōngjiān;middle\n" +
  "旁边;pángbiān;side\n" +
  "附近;fùjìn;surroundings\n" +
  "前面;qiánmiàn;front\n" +
  "后面;hòumiàn;back\n" +
  "里;lǐ;inside\n" +
  "外;wài;outside\n" +
  "东;dōng;east\n" +
  "南;nán;south\n" +
  "西;xī;west\n" +
  "北方;běifāng;north\n" +
  "个;gè;generic measure word\n" +
  "元;yuán;basic monetary unit of China\n" +
  "块;kuài;basic monetary unit of China\n" +
  "角;jiǎo;1/10 of Chinese Yuan\n" +
  "位;wèi;measure word for people\n" +
  "本;běn;book\n" +
  "岁;suì;year\n" +
  "些;xiē;some\n" +
  "次;cì;time\n" +
  "公斤;gōngjīn;kilo\n" +
  "米;mǐ;meter\n" +
  "件;jiàn;m. for affairs, clothes, furniture\n" +
  "张;zhāng;m. for flat objects\n" +
  "条;tiáo;m. for long objects\n" +
  "辆;liàng;m. for vehicles\n" +
  "把;bǎ;m. for things with a handle\n" +
  "种;zhǒng;type\n" +
  "层;céng;floor\n" +
  "双;shuāng;pair\n" +
  "段;duàn;span of time or distance\n" +
  "刻;kè;quarter (time)\n" +
  "做;zuò;to do\n" +
  "是;shì;to be\n" +
  "姓;xìng;to be surnamed\n" +
  "在;zài;to be in\n" +
  "有;yǒu;to have\n" +
  "住;zhù;to live or to stay\n" +
  "来;lái;to come\n" +
  "去;qù;to go\n" +
  "回;huí;to return\n" +
  "进;jìn;to enter\n" +
  "出;chū;to get out\n" +
  "到;dào;to arrive\n" +
  "想;xiǎng;to think\n" +
  "要;yào;to want\n" +
  "需要;xūyào;to need\n" +
  "吃;chī;to eat\n" +
  "喝;hē;to drink\n" +
  "说话;shuōhuà;to speak\n" +
  "讲;jiǎng;to say\n" +
  "告诉;gàosù;to tell\n" +
  "问;wèn;to ask\n" +
  "回答;huídá;to answer\n" +
  "看;kàn;to watch\n" +
  "看见;kànjiàn;to see\n" +
  "听;tīng;to listen\n" +
  "笑;xiào;to smile\n" +
  "哭;kū;to cry\n" +
  "见面;jiànmiàn;to meet\n" +
  "遇到;yùdào;to encounter\n" +
  "给;gěi;to give\n" +
  "送;sòng;to give as a gift or to deliver\n" +
  "带;dài;to bring\n" +
  "拿;ná;to hold\n" +
  "放;fàng;to put\n" +
  "叫;jiào;to call\n" +
  "买;mǎi;to buy\n" +
  "卖;mài;to sell\n" +
  "穿;chuān;to wear\n" +
  "开;kāi;to drive or to open\n" +
  "关;guān;to close or to shut\n" +
  "坐;zuò;to sit\n" +
  "站;zhàn;to stand\n" +
  "读;dú;to read\n" +
  "写;xiě;to write\n" +
  "画;huà;to draw or to paint\n" +
  "等;děng;to wait\n" +
  "花;huā;to spend\n" +
  "打电话;dǎ diànhuà;to make a phone call\n" +
  "介绍;jièshào;to introduce\n" +
  "认识;rènshi;to know\n" +
  "知道;zhīdao;to know\n" +
  "了解;liǎojiě;to know well\n" +
  "觉得;juédé;to think\n" +
  "认为;rènwéi;to consider\n" +
  "以为;yǐwéi;to think (wrongly)\n" +
  "懂;dǒng;to understand\n" +
  "明白;míngbai;to understand\n" +
  "找;zhǎo;to find\n" +
  "发现;fāxiàn;to discover\n" +
  "记得;jìde;to remember\n" +
  "忘记;wàngjì;to forget\n" +
  "让;ràng;to let\n" +
  "使;shǐ;to make\n" +
  "用;yòng;to use\n" +
  "希望;xīwàng;to hope\n" +
  "帮助;bāngzhù;to help\n" +
  "帮忙;bāngmáng;to help\n" +
  "玩;wán;to play\n" +
  "学习;xuéxí;to learn\n" +
  "教;jiāo;to teach\n" +
  "复习;fùxí;to review\n" +
  "上网;shàngwǎng;to get online\n" +
  "工作;gōngzuò;to work\n" +
  "上班;shàng bān;to go to work\n" +
  "睡觉;shuìjiào;to sleep\n" +
  "起床;qǐ chuáng;to get up\n" +
  "刷牙;shuāyá;to brush teeth\n" +
  "洗澡;xǐzǎo;to bathe\n" +
  "喜欢;xǐhuan;to like\n" +
  "爱;ài;to love\n" +
  "唱歌;chàng gē;to sing\n" +
  "跳舞;tiào wǔ;to dance\n" +
  "旅游;lǚyóu;to travel\n" +
  "运动;yùndòng;to do sports\n" +
  "走;zǒu;to walk\n" +
  "跑步;pǎo bù;to run\n" +
  "游泳;yóu yǒng;to swim\n" +
  "骑;qí;to ride\n" +
  "踢足球;tī zúqiú;to play soccer\n" +
  "打篮球;dǎ lánqiú;to play basketball\n" +
  "爬山;pá shān;to climb mountain\n" +
  "锻炼;duànliàn;to work out\n" +
  "休息;xiūxi;to rest\n" +
  "生病;shēng bìng;to get sick\n" +
  "发烧;fāshāo;to have a fever\n" +
  "感冒;gǎnmào;to have a cold\n" +
  "疼;téng;to ache\n" +
  "洗;xǐ;to wash\n" +
  "开始;kāishǐ;to begin\n" +
  "完;wán;to finish\n" +
  "结束;jiéshù;to end\n" +
  "完成;wánchéng;to complete or accomplish\n" +
  "打算;dǎsuàn;to plan\n" +
  "决定;juédìng;to decide\n" +
  "选择;xuǎnzé;to choose\n" +
  "准备;zhǔnbèi;to prepare\n" +
  "同意;tóngyì;to agree\n" +
  "解决;jiějué;to solve\n" +
  "担心;dānxīn;to worry\n" +
  "生气;shēngqì;to get angry\n" +
  "欢迎;huānyíng;to welcome\n" +
  "搬;bān;to move\n" +
  "还;huán;to return (sth)\n" +
  "接;jiē;to pick up\n" +
  "比较;bǐjiào;to compare\n" +
  "变化;biànhuà;to change\n" +
  "换;huàn;to exchange\n" +
  "借;jiè;to borrow\n" +
  "表示;biǎoshì;to express\n" +
  "要求;yāoqiú;to require\n" +
  "祝;zhù;to wish\n" +
  "注意;zhùyì;to pay attention to\n" +
  "表演;biǎoyǎn;to perform\n" +
  "参加;cānjiā;to attend\n" +
  "迟到;chídào;to be late\n" +
  "出现;chūxiàn;to appear\n" +
  "离开;líkāi;to leave\n" +
  "经过;jīngguò;to pass\n" +
  "练习;liànxí;to practice\n" +
  "提高;tígāo;to improve\n" +
  "检查;jiǎnchá;to check\n" +
  "打扫;dǎsǎo;to clean\n" +
  "相信;xiāngxìn;to believe\n" +
  "放心;fàngxīn;to rest assured\n" +
  "着急;zháojí;to worry\n" +
  "关心;guānxīn;to concern\n" +
  "照顾;zhàogù;to look after\n" +
  "分;fēn;to separate\n" +
  "长;zhǎng;to grow\n" +
  "敢;gǎn;to dare\n" +
  "害怕;hàipà;to fear\n" +
  "小心;xiǎoxīn;to be careful\n" +
  "影响;yǐngxiǎng;to affect\n" +
  "结婚;jiéhūn;to marry\n" +
  "举行;jǔxíng;to hold (event)\n" +
  "会;huì;can (to know how to)\n" +
  "能;néng;can (to be able to)\n" +
  "可以;kěyǐ;can (to be permitted to)\n" +
  "必须;bìxū;must\n" +
  "应该;yīnggāi;should\n" +
  "愿意;yuànyì;to be willing to\n" +
  "下雨;xià yǔ;to rain\n" +
  "刮风;guā fēng; to blow (wind)\n" +
  "好;hǎo;good\n" +
  "坏;huài;bad\n" +
  "差;chà;bad (in quality)\n" +
  "大;dà;big\n" +
  "小;xiǎo;small\n" +
  "多;duō;many\n" +
  "少;shǎo;few\n" +
  "热;rè;hot\n" +
  "冷;lěng;cold\n" +
  "快;kuài;fast\n" +
  "慢;màn;slow\n" +
  "远;yuǎn;far\n" +
  "近;jìn;near\n" +
  "对;duì;right\n" +
  "错;cuò;wrong\n" +
  "长;cháng;long\n" +
  "久;jiǔ;long (in time)\n" +
  "短;duǎn;short\n" +
  "高;gāo;tall or high\n" +
  "矮;ǎi;short (in height)\n" +
  "低;dī;low\n" +
  "胖;pàng;fat\n" +
  "瘦;shòu;thin\n" +
  "新;xīn;new\n" +
  "旧;jiù;old or used\n" +
  "年轻;niánqīng;young\n" +
  "老;lǎo;old (in age)\n" +
  "贵;guì;expensive\n" +
  "便宜;piányi;cheap\n" +
  "黑;hēi;black\n" +
  "白;bái;white\n" +
  "红;hóng;red\n" +
  "黄;huáng;yellow\n" +
  "蓝;lán;blue\n" +
  "绿;lǜ;green\n" +
  "晴;qíng;sunny\n" +
  "阴;yīn;cloudy\n" +
  "好吃;hǎochī;tasty\n" +
  "甜;tián;sweet\n" +
  "新鲜;xīnxiān;fresh\n" +
  "容易;róngyì;easy\n" +
  "简单;jiǎndān;simple\n" +
  "难;nán;difficult\n" +
  "奇怪;qíguài;strange\n" +
  "特别;tèbié;special\n" +
  "重要;zhòngyào;important\n" +
  "有名;yǒumíng;famous\n" +
  "漂亮;piàoliang;pretty\n" +
  "聪明;cōngming;smart\n" +
  "可爱;Kě’ài;cute\n" +
  "高兴;gāoxìng;happy\n" +
  "快乐;kuàilè;happy\n" +
  "难过;nánguò;sad\n" +
  "满意;mǎnyì;satisfied\n" +
  "忙;máng;busy\n" +
  "累;lèi;tired\n" +
  "饿;è;hungry\n" +
  "渴;kě;thirsty\n" +
  "饱;bǎo;full\n" +
  "相同;xiāngtóng;same\n" +
  "一样;yíyàng;same\n" +
  "主要;zhǔyào;main\n" +
  "方便;fāngbiàn;convenient\n" +
  "安静;ānjìng;quiet\n" +
  "干净;gānjìng;clean\n" +
  "清楚;qīngchu;clear\n" +
  "健康;jiànkāng;healthy\n" +
  "舒服;shūfu;comfortable\n" +
  "热情;rèqíng;enthusiastic\n" +
  "认真;rènzhēn;serious or careful\n" +
  "努力;nǔlì;studious or hardworking\n" +
  "很;hěn;very\n" +
  "非常;fēicháng;extremely\n" +
  "极;jí;extremely\n" +
  "太;tài;too…\n" +
  "多么;duōme;how…\n" +
  "都;dōu;both or all\n" +
  "不;bù;not\n" +
  "没;méi;not\n" +
  "每;měi;every\n" +
  "最;zuì;most\n" +
  "真;zhēn;really\n" +
  "也;yě;also\n" +
  "还;hái;still\n" +
  "再;zài;again\n" +
  "又;yòu;again\n" +
  "只;zhǐ;only\n" +
  "就;jiǜ;at once\n" +
  "马上;mǎshàng;immediately\n" +
  "才;cái;just\n" +
  "更;gèng;more\n" +
  "越;yuè;more\n" +
  "别;bié;don’t…\n" +
  "先;xiān;first\n" +
  "已经;yǐjīng;already\n" +
  "几乎;jīhū;almost\n" +
  "一定;yídìng;definitely\n" +
  "一起;yìqǐ;together\n" +
  "一共;yígòng;altogether\n" +
  "可能;kěnéng;maybe\n" +
  "其实;qíshí;actually\n" +
  "突然;tūrán;suddenly\n" +
  "正在;zhèngzài;indicating action in progress\n" +
  "一边;yìbiān;at the same time\n" +
  "终于;zhōngyú;finally\n" +
  "总是;zǒngshì;always\n" +
  "经常;jīngcháng;often\n" +
  "一般;yìbān;generally\n" +
  "一直;yìzhí;constantly\n" +
  "从;cóng;from\n" +
  "向;xiàng;towards\n" +
  "离;lí;away from\n" +
  "比;bǐ;than\n" +
  "跟;gēn;with\n" +
  "被;bèi;by\n" +
  "为;wèi;for (sb/sth)\n" +
  "为了;wèile;for (purpose)\n" +
  "关于;guānyú;about, regarding\n" +
  "像;xiàng;as or like\n" +
  "除了;chúle;besides or except\n" +
  "根据;gēnjù;according to\n" +
  "的;de;possession particle\n" +
  "得;de;structure particle\n" +
  "地;de;structure particle\n" +
  "了;le;aspect particle\n" +
  "着;zhe;aspect particle\n" +
  "过;guò;aspect particle\n" +
  "吗;ma;question particle\n" +
  "呢;ne;question particle\n" +
  "吧;ba;question particle\n" +
  "啊;a;exclamatory particle\n" +
  "和;hé;and\n" +
  "但是;dànshì;but\n" +
  "虽然;suīrán;although\n" +
  "因为;yīnwèi;because\n" +
  "所以;suǒyǐ;so\n" +
  "还是;háishì;or\n" +
  "或者;huòzhě;or\n" +
  "然后;ránhòu;then, afterwards\n" +
  "如果;rúguǒ;if\n" +
  "而且;érqiě;moreover\n" +
  "喂;wèi;hello (on the phone)\n" +
  "谢谢;xièxie;thanks\n" +
  "不客气;bú kèqi;you’re welcome\n" +
  "再见;zàijiàn;goodbye\n" +
  "请;qǐng;please…\n" +
  "对不起;duìbuqǐ;sorry\n" +
  "没关系;méi guānxi;it’s all right\n" +
  "当然;dāngrán;of course\n"

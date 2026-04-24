// 测试数据插入脚本
// 在云函数中运行此代码来插入测试数据

const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 插入测试新闻数据
const insertTestData = async () => {
  try {
    const newsData = [
      {
        title: '人工智能技术助力医疗行业发展',
        content: '随着人工智能技术的快速发展，医疗行业正在迎来革命性的变革。AI技术在疾病诊断、药物研发、医疗影像分析等方面发挥着越来越重要的作用。专家指出，人工智能将成为未来医疗发展的重要驱动力。',
        category: 'tech',
        publishTime: db.serverDate(),
        view_count: 1250
      },
      {
        title: '中国男篮在亚洲杯取得优异成绩',
        content: '在刚刚结束的亚洲杯篮球赛中，中国男篮表现出色，展现了顽强拼搏的精神。球队在比赛中展现了良好的团队合作能力和战术执行力，赢得了观众的喝彩。',
        category: 'sports',
        publishTime: db.serverDate(),
        view_count: 890
      },
      {
        title: '新电影票房突破10亿大关',
        content: '备受期待的电影作品在上映后取得了巨大成功，票房成绩喜人。观众对影片的评价普遍较高，认为其在剧情、演技、制作等方面都达到了很高水准。',
        category: 'entertainment',
        publishTime: db.serverDate(),
        view_count: 2100
      },
      {
        title: '央行发布最新货币政策报告',
        content: '央行今日发布了最新的货币政策执行报告，对当前经济形势进行了分析，并提出了下一步的政策取向。报告显示，将继续实施稳健的货币政策，保持流动性合理充裕。',
        category: 'finance',
        publishTime: db.serverDate(),
        view_count: 1560
      },
      {
        title: '城市垃圾分类工作取得显著成效',
        content: '本市垃圾分类工作推进一年来，取得了显著成效。市民的环保意识明显提高，垃圾分类的准确率不断提升。相关部门表示将继续完善分类体系，推动绿色发展。',
        category: 'society',
        publishTime: db.serverDate(),
        view_count: 780
      }
    ];

    for (const news of newsData) {
      await db.collection('news_list').add({
        data: news
      });
    }

    console.log('测试数据插入成功');
    return { success: true };
  } catch (error) {
    console.error('插入测试数据失败:', error);
    return { success: false, error: error.message };
  }
};

// 导出函数
exports.main = async (event, context) => {
  return await insertTestData();
};
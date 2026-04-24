import {
  DataType,
  MetricType,
  MilvusClient,
  IndexType,
} from "@zilliz/milvus2-sdk-node";
import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

const VECTOR_DIM = 1024;
const COLLECTION_NAME = "ai_diary";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_KEY,
  model: process.env.EMBEDDING_MODEL_NAME,
  configuration: { baseURL: process.env.OPENAI_BASE_URL },
  dimensions: VECTOR_DIM,
});

const client = new MilvusClient({
  address: process.env.MILVUS_ADDRESS,
  token: process.env.MILVUS_TOKEN,
});
// async function main() {
//   console.log("正在连接Milvus...");

//   const checkHealth = await client.checkHealth();
//   if (!checkHealth.isHealthy) {
//     console.error("Milvus连接失败:", checkHealth.reasons);
//     return;
//   }
//   console.log("连接成功， 集群状态正常...");
//   // table  collection
//   const COLLECTION_NAME = "test";
//   const DIMENSION = 4; // 向量维度
//   /*
//     try {
//         await client.createCollection({
//             collection_name: COLLECTION_NAME,
//             dimension: DIMENSION,
//             auto_id: true,
//         });
//         console.log(`Collection ${COLLECTION_NAME} 创建成功...`);
//         await client.createIndex({
//             collection_name: COLLECTION_NAME,
//             field_name:'vector',
//             index_type: IndexType.AUTOINDEX,
//             metric_type: MetricType.COSINE,
//         })
//         console.log(`Index 创建成功...`);
//     } catch(err) {
//         console.log(`Collection ${COLLECTION_NAME} 已存在...`);
//     }*/

//   // const data = [
//   //   {
//   //     vector: [0.1, 0.2, 0.3, 0.4],
//   //     content: "这是第一条数据",
//   //   },
//   //   {
//   //     vector: [0.5, 0.6, 0.7, 0.8],
//   //     content: "这是第二条数据",
//   //   },
//   // ];
//   // const insertRes = await client.insert({
//   //   collection_name: COLLECTION_NAME,
//   //   data,
//   // });
//   // console.log(`插入成功: ${insertRes.insert_cnt} 条数据`);

//   const searchRes1 = await client.search({
//     collection_name: COLLECTION_NAME,
//     data: [[0.1, 0.2, 0.3, 0.4]],
//     limit: 1,
//     output_fields: ["content"],
//   });
//   console.log(`搜索结果：${JSON.stringify(searchRes1)}`);

//   const searchRes2 = await client.search({
//     collection_name: COLLECTION_NAME,
//     data: [[0.1, 0.3, 0.3, 0.4]],
//     limit: 1,
//     output_fields: ["content"],
//   });
//   console.log(`搜索结果：${JSON.stringify(searchRes2)}`);
// }
// main();

// 嵌入模型,将文本转换成向量， 多处调用，封装成函数复用
async function getEmbeddings(text) {
  const result = await embeddings.embedQuery(text);
  return result;
}

async function main() {
  console.log("正在连接Milvus...");
  const checkHealth = await client.checkHealth();
  if (!checkHealth) {
    console.error("Milvus连接失败：", checkHealth.reasons);
    return;
  }
  console.log("连接成功");

  // await client.createCollection({
  //   collection_name: COLLECTION_NAME,
  //   fields: [
  //     {
  //       name: "id",
  //       data_type: DataType.VarChar,
  //       max_length: 50,
  //       is_primary_key: true,
  //     },
  //     { name: "vector", data_type: DataType.FloatVector, dim: VECTOR_DIM },
  //     { name: "content", data_type: DataType.VarChar, max_length: 5000 },
  //     { name: "date", data_type: DataType.VarChar, max_length: 50 },
  //     { name: "mood", data_type: DataType.VarChar, max_length: 50 },
  //     {
  //       name: "tags",
  //       data_type: DataType.Array,
  //       element_type: DataType.VarChar,
  //       max_capacity: 10,
  //       max_length: 50,
  //     },
  //   ],
  // });

  // await client.createIndex({
  //   collection_name: COLLECTION_NAME,
  //   field_name: "vector", // 常用的查询字段 添加索引 快速查询
  //   index_type: IndexType.IVF_FLAT,
  //   metric_type: MetricType.COSINE,
  //   params: {
  //     nlist: VECTOR_DIM,
  //   },
  // });

  await client.loadCollection({
    collection_name: COLLECTION_NAME,
  });
  console.log("\nInserting diary entries...");

  // const diaryContents = [
  //   {
  //     id: "diary_001",
  //     content:
  //       "今天天气很好，去公园散步了，心情愉快。看到了很多花开了，春天真美好。",
  //     date: "2026-01-10",
  //     mood: "happy",
  //     tags: ["生活", "散步"],
  //   },
  //   {
  //     id: "diary_002",
  //     content:
  //       "今天工作很忙，完成了一个重要的项目里程碑。团队合作很愉快，感觉很有成就感。",
  //     date: "2026-01-11",
  //     mood: "excited",
  //     tags: ["工作", "成就"],
  //   },
  //   {
  //     id: "diary_003",
  //     content:
  //       "周末和朋友去爬山，天气很好，心情也很放松。享受大自然的感觉真好。",
  //     date: "2026-01-12",
  //     mood: "relaxed",
  //     tags: ["户外", "朋友"],
  //   },
  //   {
  //     id: "diary_004",
  //     content:
  //       "今天学习了 Milvus 向量数据库，感觉很有意思。向量搜索技术真的很强大。",
  //     date: "2026-01-12",
  //     mood: "curious",
  //     tags: ["学习", "技术"],
  //   },
  //   {
  //     id: "diary_005",
  //     content:
  //       "晚上做了一顿丰盛的晚餐，尝试了新菜谱。家人都说很好吃，很有成就感。",
  //     date: "2026-01-13",
  //     mood: "proud",
  //     tags: ["美食", "家庭"],
  //   },
  // ];

  // console.log("Generating embeddings...");

  // const diaryData = await Promise.all(
  //   diaryContents.map(async (diary) => ({
  //     ...diary,
  //     vector: await getEmbeddings(diary.content),
  //   })),
  // );

  // const insertRes = await client.insert({
  //   collection_name: COLLECTION_NAME,
  //   data: diaryData,
  // });
  // console.log(`嵌入成功：${insertRes.insert_cnt} 条`);

  const query = "我想看看关于户外活动的日记";
  const queryVector = await getEmbeddings(query);
  const searchResult = await client.search({
    collection_name: COLLECTION_NAME,
    vector: queryVector,
    limit: 3,
    metric_type: MetricType.COSINE,
    output_fields: ["id", "content", "date", "mood", "tags"],
  });
  searchResult.results.forEach((result) => {
    console.log(`\n 日记ID: ${result.id}`);
    console.log(`内容: ${result.content}`);
    console.log(`日期: ${result.date}`);
    console.log(`心情: ${result.mood}`);
    console.log(`标签: ${result.tags}`);
  });
  console.log("\n 搜索结果:");
  console.log(`共找到 ${searchResult.results.length} 条相关日记`);
}

main();

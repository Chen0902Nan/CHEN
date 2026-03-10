import 'dotenv/config';
import {
    MilvusClient,
    DataType,
    MetricType,
    IndexType,
} from '@zilliz/milvus2-sdk-node'
import {
    OpenAIEmbeddings
} from '@langchain/openai'


const ADDRESS = process.env.MILVUS_ADDRESS;
const TOKEN = process.env.MILVUS_TOKEN;
const COLLECTION_NAME = 'ebook';
const VECTION_DIM = 1024;

const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.EMBEDDING_MODEL_NAME,
    configuration:{
        baseURL: process.env.OPENAI_BASE_URL,
    },
    dimensions: VECTION_DIM,
})

const client = new MilvusClient({
    address: ADDRESS,
    token: TOKEN,
})

async function getEmbedding(text) {
    const result = await embeddings.embedQuery(text);
    return result;
}

async function main() {
    try {
        console.log('Connection to Milvus...');
        await client.connectPromise;
        try {
            await client.loadCollection({
                colleciton_name: COLLECTION_NAME
            });
            console.log('集合加载成功');
        } catch(err) {
            console.log('集合加载失败')
        }
        const query='段誉会什么武功?'
        const queryVector=await getEmbedding(query);

        // 查询
        const searchResult=await client.search({
            collection_name:COLLECTION_NAME,
            vector:queryVector,
            limit:3,
            metric_type:MetricType.COSINE,
            // 返回的字段
            output_fields:['id','content','book_id','chapter_num','index','book_name']
        });
        console.log(searchResult,'---------');
        
        searchResult.results.forEach((item,index)=>{
            console.log(`\n第${index+1}个结果：Score:${item.score.toFixed(2)}`);
            console.log(`ID:${item.id}`);
            console.log(`Content:${item.content}`);
            console.log(`Book ID:${item.book_id}`);
            console.log(`Chapter Number:${item.chapter_num}`);
            console.log(`Index:${item.index}`);
            console.log(`Name:${item.book_name}`);
            
        })
    } catch(err) {
        console.error('连接Milvus失败：',err.message);
        
    }
}

main();
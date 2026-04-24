import { from} from 'rxjs'
// from 将数组转换成为Observable 对象
const stream=from([1,2,3])
stream.subscribe(v=>console.log(v))

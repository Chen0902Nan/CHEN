package main
import "fmt"

func main(){
 // go关键字 告诉go 运行时 在后台
 // 开启一个新的轻量级(协程) 来执行sayHello函数
 go sayHello()
 fmt.Println("main")
 // 主线程
 // 阻塞主线程 等待协程
 main.Sleep(time,Second)

}

func sayHello(){
 // 耗时任务
 fmt.Println("hello")
}
// 声明模块
package main
// 内置模块 fmt 格式化输出
import "fmt"

// func 声明函数
func main(){
	fmt.Println("Hello Go")
	// 变量的声明
	// Go是强类型语言 var显示声明类型
	// := 推导类型 后续不能再改变类型
	 name :="华华的baby"
	 age :=18
	 if age>=18{
		fmt.Println(age)
	 }

	fmt.Println(name)

	// for i:=0;i<10;i++ {
	// 	fmt.Println(i)
	// }
	// 数组固定长度
	arr:=[3]int[1,2,3]
	
	// 切片 动态数组
	 slice:=[]int{1,2,3}
	 slice=append(slice,4)
	 m:=map[string]int{"a":1,"b":2}
	 fmt.Println(m["a"])

	 // go里面没有class
	 // 结构体
	 type User struct{
		Name string
		Age int
	 }

	 u:=User{Name:"Andrew",Age:18}

	 func updateAge(age *int){
		*age=20
	 }

}
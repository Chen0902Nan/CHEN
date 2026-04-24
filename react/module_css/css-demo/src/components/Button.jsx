// import "./Button.css";
// module.css 是 module 的文件
// css in js jsx js 写html 一样
// react 将 css文件编译成js 对象
// 类名 作为  js 对象的key
// 类名的值 hash 的绝对唯一的名字
import styles from "./Button.module.css";
console.log(styles, "111");

export default function Button() {
  return (
    <>
      {/* <div className="container"> */}
      {/* // <button className="button">My Button</button> */}
      <button className={styles.button}>My Button</button>
      <h1 className={styles.txt}> 你好，世界！</h1>
      {/* </div> */}
    </>
  );
}

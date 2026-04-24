import styles from "./anotherButton.module.css";
console.log(styles, "2222");

export default function AnotherButton() {
  // return <button className="button">My Another Button</button>;
  return <button className={styles.button}>My Another Button</button>;
}

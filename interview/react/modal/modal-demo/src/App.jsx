import Modal from "./components/Modal";
import { useState } from "react";

export default function App() {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ height: "300vh" }}>
      <button onClick={() => setVisible(true)}>打开弹窗</button>
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="这是一个弹窗"
        footer={
          <button
            onClick={() => {
              console.log("close");
            }}
          >
            关闭
          </button>
        }
      >
        <p>这是一个弹窗</p>
      </Modal>
    </div>
  );
}

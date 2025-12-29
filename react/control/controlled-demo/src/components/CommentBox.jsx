import { useRef } from "react";
export default function CommentBox() {
  // 非受控组件
  const textareaRef = useRef(null);
  const handleSubmit = () => {
    const comment = textareaRef.current.value;
    if (!comment) return alert("请输入评论");
    console.log(comment);
  };
  return (
    <div>
      <textarea ref={textareaRef} placeholder="请输入评论..."></textarea>
      <button type="submit" onClick={handleSubmit}>
        提交
      </button>
    </div>
  );
}

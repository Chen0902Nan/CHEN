import React, { useEffect, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

// 全部变量
let modalContainer = null;

// 高阶组件 用于缓存组件的渲染结果
// 只有当props发生变化时才重新渲染，从而避免父组件更新时引发的子组件无效渲染
const Modal = memo(
  ({
    visible, // 父组件传入 控制弹窗显示/隐藏(受控)
    onClose, // 父组件传入 弹窗关闭时回调
    title, // 标题
    footer, // 底部内容区域
    children,
    maskClosable = true, // 是否允许点击遮罩层关闭
    escClosable = true, // 是否允许按ESC键关闭
    maskOpacity = 0.5, // 遮罩层透明度
    width = 500,
    zIndex = 1000,
  }) => {
    useEffect(() => {
      // 首次渲染时创建容器
      if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "react-modal-containder";
        document.body.appendChild(modalContainer);
      }
    }, [visible]);

    const handleEsc = useCallback(
      (e) => {
        if (visible && escClosable && e.key === "Escape") {
          onClose();
        }
      },
      [visible, escClosable, onClose],
    );

    useEffect(() => {
      if (visible) {
        window.addEventListener("keydown", handleEsc);
      }
      return () => window.removeEventListener("keydown", handleEsc);
    }, [visible, handleEsc]);

    useEffect(() => {
      const body = document.body;
      if (visible) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
      return () => {
        body.style.overflow = "";
      };
    }, [visible]);

    const handleMaskClick = (e) => {
      if (maskClosable && e.target === e.currentTarget) {
        onClose();
      }
    };
    const maskStyle = useMemo(
      () => ({
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: `rgba(0,0,0,${maskOpacity})`,
        zIndex: zIndex - 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }),
      [maskOpacity, zIndex],
    );

    const contentStyle = useMemo(
      () => ({
        width: `${width}px`,
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        zIndex,
      }),
      [width, zIndex],
    );

    if (!visible) return null;

    return createPortal(
      <div className="modal-mask" style={maskStyle} onClick={handleMaskClick}>
        <div className="modal-content" style={contentStyle}>
          {title && (
            <div
              className="modal-title"
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              {title}
            </div>
          )}
          {
            <div
              className="modal-body"
              style={{
                padding: "20px",
                minHeight: "80px",
              }}
            >
              {children}
            </div>
          }
          {footer && (
            <div
              className="modal-footer"
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #eee",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>,
      modalContainer,
    );
  },
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  maskClosable: PropTypes.bool,
  maskOpacity: PropTypes.number,
  width: PropTypes.number,
  zIndex: PropTypes.number,
};

const style = document.createElement("style");
style.textContent = `
@keyframes modalShow {
    to {
        transform: scale(1);
        opacity: 1;
    }
}
`;

document.head.appendChild(style);
export default Modal;

import matplotlib.pyplot as plt
import numpy as np

# 数据
names = ['张三', '李四', '王二', '赵五']
python_scores = [95, 75, 86, 88]
c_scores = [86, 93, 76, 98]
java_scores = [63, 66, 96, 76]

# 设置图形大小和样式
plt.figure(figsize=(10, 6))

# 创建柱状图
x = np.arange(len(names))  # x轴位置
width = 0.25  # 柱子宽度

plt.bar(x - width, python_scores, width, label='Python', color='skyblue')
plt.bar(x, c_scores, width, label='C', color='lightgreen')
plt.bar(x + width, java_scores, width, label='Java', color='lightcoral')

# 设置标签和标题
plt.xlabel('姓名')
plt.ylabel('成绩')
plt.title('学生成绩柱状图')
plt.xticks(x, names)
plt.legend()

# 显示数值标签
for i, (p, c, j) in enumerate(zip(python_scores, c_scores, java_scores)):
    plt.text(i - width, p + 1, str(p), ha='center', va='bottom')
    plt.text(i, c + 1, str(c), ha='center', va='bottom')
    plt.text(i + width, j + 1, str(j), ha='center', va='bottom')

# 调整布局并显示
plt.tight_layout()
plt.show()
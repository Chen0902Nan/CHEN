const express = require("express");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid"); //唯一ID

const app = express();

const PORT = 3000;

const userDB = [
  { id: 1, username: "admin", password: "123", role: "admin" },
  { id: 2, username: "user", password: "123", role: "user" },
];

// session 对象集合
const sessionStore = {};
// 使用一个中间件 支持json解析
app.use(express.json());
// 解析请求体
app.use(express.urlencoded({ extended: true }));
// 解析cookie
app.use(cookieParser());
// 静态资源
app.use(express.static("public"));

function sessionMiddleware(req, res, next) {
  const sessionId = req.cookies["sessionId"];
  if (!sessionId) {
    return next();
  }
  const sessionData = sessionStore[sessionId];
  if (sessionData) {
    req.user = sessionData;
  } else {
    res.clearCookie("sessionId");
  }
  next();
}

function authGuard(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return res.status(401).json({
      error: "未授权,请先登录",
      code: "NO_SESSION",
    });
  }
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password, "--------");

  const user = userDB.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ error: "用户名或密码错误" });
  } else {
    // 创建会话，生成sessionId ccokie/session
    const sessionId = uuidv4();
    sessionStore[sessionId] = {
      id: user.id,
      username: user.role,
      loginTime: new Date(),
    };
    // 种下cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true, //预防xss攻击的主要手段 不可以通过js获得 -> document.cookie，可以通过http传送
      maxAge: 1000 * 60 * 60,
      path: "/",
    });

    res.json({
      message: "登陆成功",
      user: sessionStore[sessionId],
    });
  }
});

app.post("/api/logout", (req, res) => {
  const sessionId = req.cookies["sessionId"];
  if (sessionId) {
    delete sessionStore[sessionId];
    res.clearCookie("sessionId");
  }
  res.json({ message: "已退出登录" });
});

app.get("/api/profile", sessionMiddleware, authGuard, (req, res) => {
  res.json({
    message: "这是受保护的个人信息",
    data: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import jwt from "jsonwebtoken"; // 签发token, 验证token
const secret = "bld1234asdfvb"; // 随机 安全
export default [
  {
    // restful 一切皆资源
    // api 前后端分离 后端提供接口资源
    url: "/api/auth/login",
    method: "post",
    timeout: 2000, // 延迟时间
    response: (req, res) => {
      let { name, password } = req.body;
      name = name.trim();
      password = password.trim();
      // console.log(name, password, "////");
      if (name === "" || password === "") {
        return {
          code: 400, // Bad Request
          message: "用户名或密码不能为空",
        };
      }
      if (name !== "admin" || password !== "123456") {
        return {
          code: 401, // unauthorized
          message: "用户名或密码错误",
        };
      }

      const token = jwt.sign(
        {
          user: {
            // json 对象
            id: 1,
            name: "admin",
            avatar:
              "https://p9-passport.byteacctimg.com/img/user-avatar/79af63205468a1d4224c92993d0a3988~60x60.awebp",
            password: "123456",
          },
        },
        // 加盐
        secret,
        {
          // 过期时间 七天
          expiresIn: 86400 * 7, // 有效时间
        },
      );

      // console.log(token, "////////");
      return {
        token,
        user: {
          id: 1,
          name: "admin",
          avatar:
            "https://p9-passport.byteacctimg.com/img/user-avatar/79af63205468a1d4224c92993d0a3988~60x60.awebp",
        },
      };
    },
  },
  {
    url: "api/auth/check",
    method: "GET",
    response: (req, res) => {
      const token = req.headers["authorization"].split(" ")[1];
      // console.log(token);
      try {
        const decode = jwt.verify(token, secret);
        console.log(decode);
        return {
          code: 200,
          user: decode.user,
        };
      } catch (err) {
        return {
          code: 400,
          message: "invalid token",
        };
      }
    },
  },
];

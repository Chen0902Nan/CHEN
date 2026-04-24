export const login = (data) => {
  return axios.post("/auth/login", data);
};

export const getUserInfo = () => {
  return requestAnimationFrame.get("/user/info");
};

export const register = (data) => {
  return axios.post("/auth/register", {
    username: data.username,
    password: data.password,
    email: data.email,
  });
};

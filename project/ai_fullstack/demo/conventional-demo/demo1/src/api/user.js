export const login = (data) => {
  return axios.post("/auth/login", data);
};

export const getUserInfo = () => {
  return requestAnimationFrame.get("/user/info");
};

import axios from "./config";

export const fetchPosts = async (page: number = 1, limit: number = 10) => {
  try {
    const data = await axios.get("/posts", {
      params: {
        page,
        limit,
      },
    });
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return { items: [], total: 0 };
  }
};

// 发表文章
export const createPosts = async () => {
  return axios.post("/posts", {
    title: "121212121212",
    content: "22ssdffccccc",
  });
};

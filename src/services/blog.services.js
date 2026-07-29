import api from "@/lib/api";

const handleRequest = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const blogService = {
  getAllBlogs: (params = {}) =>
    handleRequest(api.get("/blogs", { params })),

  getBlogBySlug: (slug) =>
    handleRequest(api.get(`/blogs/slug/${slug}`)),

  getBlogById: (blogId) =>
    handleRequest(api.get(`/blogs/${blogId}`)),

  createBlog: (formData) =>
    handleRequest(api.post("/blogs/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })),

  updateBlog: (blogId, formData) =>
    handleRequest(api.patch(`/blogs/${blogId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })),

  deleteBlog: (blogId) =>
    handleRequest(api.delete(`/blogs/${blogId}`)),

  getTeacherBlogs: (params = {}) =>
    handleRequest(api.get("/blogs/teacher/my-blogs", { params })),

  toggleBlogFeatured: (blogId) =>
    handleRequest(api.patch(`/blogs/${blogId}/featured`)),

  uploadBlogImage: (formData) =>
    handleRequest(api.post("/blogs/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })),
};

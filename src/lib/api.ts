import axios from "axios";
// import { URLSearchParams } from "url";

const api = axios.create({
  // baseURL: "http://localhost:3001/api",
  baseURL: "https://womenica-api.onrender.com/api",
});

api.interceptors.request.use((config => {
  const token = localStorage.getItem("token");
  if (token ) {

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}));

api.interceptors.response.use(
  response => response,
  error => {
    // Global error handling
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
             localStorage.removeItem("token");
             localStorage.removeItem("user");
             localStorage.removeItem("isAuthenticated");
              window.location.href = "/"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
)

export default api;

// Login Apis
export const loginApi = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// product category APIs


export const productCategoryFetchList = async ({ page = 1, search = "" } = {}) => {
  const response = await api.get(`/product-categories?`, {
    params: {
      page,
      search: search || undefined,
    },
  });
  return response.data;
};

export const productActiveCategoryFetchList = async () => {
  const response = await api.get(`/product-categories/active-categories`);
  return response.data;
};

export const productDeleteCategory = async (id: string) => {
  const response = await api.delete(`/product-categories/delete/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};

export const productCategoryCreate = async (payload: any) => {
  const response = await api.post("/product-categories/add", payload);
  return response.data;
};

export const fetchProductCategory = async (slugOrId: string) => {
  const response = await api.get(`/product-categories/${slugOrId}`);
  return response.data;
};

export const updateProductCategory = async (slugOrId: string, payload: any) => {
  const response = await api.put(`/product-categories/update/${slugOrId}`, payload);
  return response.data;
};




// product Apis

export const fetchProduct = async (SlugOrId: string) => {
  const response = await api.get(`/product/${SlugOrId}`);
  return response.data;
};

export const createProduct = async (payload: any) => {
  const response = await api.post("/products/add", payload);
  return response.data;
};

export const updateProduct = async (SlugOrId: string, payload: any) => {
  const response = await api.put(`/product/update/${SlugOrId}`, payload);
  return response.data;
};

export const fetchProducts = async ({ page = 1, search = "" } = {}) => {
  const response = await api.get(`/products?`, {
    params: {
      page,
      search: search || undefined,
    },
  });
  return response.data;
};



export const deleteProduct = async (payload?: { id?: string; ids?: string[]; deleteAll?: boolean }) => {
  const response = await api.delete(`/product/delete`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload || {}
  });
  return response.data;
};


// blog Category APIs

export const categoryCreate = async (payload: any) => {
  const response = await api.post("/blog-category", payload);
  return response.data;
};

export const categoryFetchList = async ({ page = 1, search = "" } = {}) => {
  const response = await api.get(`/blog-categories?`, {
    params: {
      page,
      search: search || undefined,
    },
  });
  return response.data;
};

export const fetchCategory = async (slugOrId: string) => {
  const response = await api.get(`/blog-category/${slugOrId}`);
  return response.data;
};

export const updateCategory = async (slugOrId: string, payload: any) => {
  const response = await api.put(`/blog-category/${slugOrId}`, payload);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/blog-category/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};
































































export const requestOtp = async (email: string) => {
  const formData = new FormData();
  formData.append("email", email);
  const response = await api.post("/auth/forgot-password", formData);
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("otp", otp);
  const response = await api.post("/auth/verify-reset-otp", formData);
  return response.data;
};

export const resetPassword = async (email: string, otp: string, password: string, password_confirmation: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("otp", otp);
  formData.append("password", password);
  formData.append("password_confirmation", password_confirmation);
  const response = await api.post("/auth/reset-password", formData);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload-image", formData, {
    headers: {
      Accept: "application/json",
    },
  });
  return res.data.imageUrl || res.data.path || res.data.data?.url;
};
export const changePassword = async (payload: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  const response = await api.post("/auth/change-password", {
    current_password: payload.current_password,
    new_password: payload.new_password,
    new_password_confirmation: payload.new_password_confirmation,
  });
  return response.data;
};

// User APIs
export const fetchUsers = async ({ page = 1, search = "" } = {}) => {
  let url = `/users`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await api.get(url);
  return res.data;
};

export const ChangeUserStatus = async ({
  user_id,
  status,
}: {
  user_id: string;
  status: string;
}) => {
  const response = await api.post(`/auth/user/status/${user_id}`, { status });
  return response.data;
};

// Contact & Booking APIs
export const fetchAllContacts = async ({ page = 1, search = "" } = {}) => {
  const res = await api.get("/contacts-list", {
    params: {
      page,
      search
    }
  });
  return res.data;
};

export const fetchAllBookings = async ({ page = 1, search = "" } = {}) => {
  const res = await api.get("/bookings-list", {
    params: {
      page,
      search
    }
  });
  return res.data;
};

export const fetchFeedbacks = async ({ page = 1, search = "" } = {}) => {
  const res = await api.get("/feedback-list", {
    params: {
      page,
      search
    }
  });
  return res.data;
};

export const ChangeFeedbackStatus = async ({
  feedback_id,
  status,
}: {
  feedback_id: string;
  status: string;
}) => {
  const response = await api.post(`/feedback/status/${feedback_id}`, { status });
  return response.data;
};

// Blog APIs
export const fetchDestinations = async ({ page = 1, search = "" } = {}) => {
  const response = await api.get(`/products?`, {
    params: {
      page,
      search: search || undefined,
    },
  });
  return response.data;
};

export const fetchBlogs = async ({ page = 1, search = "" } = {}) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (search) params.append("search", search);
  const response = await api.get(`/blog?${params.toString()}`);
  return response.data;
};

export const fetchBlog = async (slugOrId: string) => {
  const response = await api.get(`/blog/${slugOrId}`);
  return response.data;
};

export const createBlog = async (payload: any) => {
  const response = await api.post("/blog", payload);
  return response.data;
};

export const updateBlog = async (slugOrId: string, payload: any) => {
  const response = await api.put(`/blog/${slugOrId}`, payload);
  return response.data;
};

export const deleteBlog = async (slug: string) => {
  const response = await api.delete(`/blog/${slug}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};

export const fetchBlogCategory = async ({ page = 1, search = "" } = {}) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (search) params.append("search", search);
  const response = await api.get(`/blog-categories?${params.toString()}`);
  return response.data;
};

export const fetchActiveBlogCategory = async () => {
  const response = await api.get(`/blogs/active-categories`);
  return response.data;
};

// Dashboard APIs
export const fetchDashboardStats = async () => {
  const res = await api.get("/dashboard/overview");
  return res.data;
};

export const fetchUserGraph = async () => {
  const res = await api.get("/dashboard/users-graph");
  return res.data;
};

export const fetchBookingsGraph = async () => {
  const res = await api.get("/dashboard/bookings-graph");
  return res.data;
};

// Order APIs
export const fetchScheduleList = async (filters?: { type?: string; command?: string }) => {
  const response = await api.get("/schedule-list", {
    params: filters || {},
  });
  return response.data;
};

export const createScheduleRequest = async (payload: any) => {
  const response = await api.post("/schedule/create", payload);
  return response.data;
};

export const updateOrderItemsPacking = async (orderId: string, payload: any) => {
  const response = await api.put(`/orders/${orderId}/packing`, payload);
  return response.data;
};

// Amazon Scrap API
export const amazonScrapToCsv = async (payload: {
  url: string;
  [key: string]: any;
}) => {
  const response = await api.post("/amazon/scrap-to-csv", payload);
  return response.data;
};


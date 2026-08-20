const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "kostody_token";

const apiFetch = async (path, opts = {}) => {
  const { method = "GET", body, headers = {}, ...rest } = opts;

  const token = localStorage.getItem(TOKEN_KEY);
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders = { ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let finalBody = body;
  if (body !== undefined && body !== null && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = typeof body === "string" ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: finalBody,
      ...rest,
    });
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error. Please check your connection.", {
      cause: error,
    });
  }

  if (!response.ok) {
    let message = response.statusText || "Request failed";
    const data = await response.json().catch(() => null);
    if (data && data.message) message = data.message;
    const error = new Error(message);
    error.status = response.status;
    console.error("API Error:", error);
    throw error;
  }

  if (response.status === 204) return null;
  return response.json().catch(() => null);
};

const lockJob = async (jobData, shopId, customerId, enteredPin) =>
  apiFetch("/jobs/lock", {
    method: "POST",
    body: {
      ...jobData,
      shopId,
      customerId,
      accessoriesRetained: jobData.accessoriesRetained
        ? jobData.accessoriesRetained.split(",").map((item) => item.trim())
        : [],
      quotedPrice: Number(jobData.quotedPrice),
      upfrontPayment: Number(jobData.upfrontPayment),
      quoteValidityDays: Number(jobData.quoteValidity),
      enteredPin,
      referralId: jobData.referralId,
    },
  });

const createPendingJob = async (jobData, shopId) =>
  apiFetch("/jobs/share", {
    method: "POST",
    body: {
      ...jobData,
      shopId,
      accessoriesRetained: jobData.accessoriesRetained
        ? jobData.accessoriesRetained.split(",").map((i) => i.trim())
        : [],
      quotedPrice: Number(jobData.quotedPrice),
      upfrontPayment: Number(jobData.upfrontPayment),
      quoteValidityDays: Number(jobData.quoteValidity),
    },
  });

const checkCustomer = async (phone) =>
  apiFetch("/customers/check", {
    method: "POST",
    body: { phone },
  });

const getJobsByShop = async (shopId, filter = "", search = "") => {
  const params = new URLSearchParams();
  if (filter) params.append("filter", filter);
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/jobs/shop/${shopId}${query}`);
};

const getJobsById = async (jobId) => apiFetch(`/jobs/${jobId}`);

const loginShop = async (authData) => {
  const { email, password } = authData;
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

const registerShop = async (shopData, authData) => {
  const { shopName, engineerName, shopPhone, specialty, shopAddress } =
    shopData;
  const { email, password } = authData;
  return apiFetch("/auth/register", {
    method: "POST",
    body: {
      shopName,
      engineerName,
      phone: shopPhone,
      email,
      password,
      specialty,
      address: shopAddress,
    },
  });
};

const updateJobStatus = async (jobId, newStatus) =>
  apiFetch(`/jobs/${jobId}/status`, {
    method: "PUT",
    body: { status: newStatus },
  });

const addPayment = async (jobId, amount, method = "Cash") =>
  apiFetch(`/jobs/${jobId}/payments`, {
    method: "POST",
    body: { amount: Number(amount), method },
  });

const processPayment = async (
  jobId,
  enteredPin,
  finalPaymentAmount,
  method = "Cash",
) =>
  apiFetch(`/jobs/${jobId}/collect`, {
    method: "POST",
    body: { enteredPin, finalPaymentAmount, method },
  });

const requoteJob = async (jobId, enteredPin, newPrice, validityDays) =>
  apiFetch(`/jobs/${jobId}/requote`, {
    method: "POST",
    body: { enteredPin, newPrice, validityDays },
  });

const updateJob = async (jobId, jobData) =>
  apiFetch(`/jobs/${jobId}`, {
    method: "PUT",
    body: {
      ...jobData,
      accessoriesRetained: jobData.accessoriesRetained
        ? jobData.accessoriesRetained.split(",").map((item) => item.trim())
        : [],
      quotedPrice: Number(jobData.quotedPrice),
      upfrontPayment: Number(jobData.upfrontPayment),
      quoteValidityDays: Number(jobData.quoteValidity),
    },
  });

const getJobHistory = async (shopId, search = "", status = "Completed") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/jobs/history/${shopId}${query}`);
};

const getShopCustomers = async (shopId, search = "") =>
  apiFetch(`/customers/${shopId}?search=${encodeURIComponent(search)}`);

const getShopProfile = async (shopId) => apiFetch(`/shops/${shopId}`);

const updateShopProfile = async (shopId, profileData) =>
  apiFetch(`/shops/${shopId}`, { method: "PUT", body: profileData });

const getShopAnalytics = async (shopId) => apiFetch(`/analytics/${shopId}`);

const getShopNotifications = async (shopId) =>
  apiFetch(`/notifications/${shopId}`);

const getCustomerNotifications = async (customerId) =>
  apiFetch(`/notifications/customer/${customerId}`);

const acceptTransfer = async (jobId, enteredPin) =>
  apiFetch(`/jobs/${jobId}/accept-transfer`, {
    method: "POST",
    body: { enteredPin },
  });

const checkReferralJob = async (referralId) => {
  const data = await apiFetch(
    `/jobs/check-referral?q=${encodeURIComponent(referralId)}`,
  );
  return data.results[0] || null;
};

const searchJobs = async (query) => {
  const data = await apiFetch(
    `/jobs/check-referral?q=${encodeURIComponent(query)}`,
  );
  return data.results;
};

const uploadPhotos = async (jobId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("photos", file);
  });
  return apiFetch(`/jobs/${jobId}/photos`, { method: "POST", body: formData });
};

const cancelJob = async (jobId, enteredPin = null) =>
  apiFetch(`/jobs/${jobId}/cancel`, {
    method: "POST",
    body: { enteredPin },
  });

const changePin = async (customerId, oldPin, newPin) =>
  apiFetch(`/customers/${customerId}/pin`, {
    method: "PUT",
    body: { oldPin, newPin },
  });

const requestOtp = async (phone) =>
  apiFetch("/customers/request-otp", {
    method: "POST",
    body: { phone },
  });

const resetPin = async (phone, otp, newPin) =>
  apiFetch("/customers/reset-pin", {
    method: "POST",
    body: { phone, otp, newPin },
  });

const getShopStats = async (shopId, period = "month") =>
  apiFetch(`/analytics/${shopId}?period=${encodeURIComponent(period)}`);

const loginCustomer = async (phone, pin) =>
  apiFetch("/auth/customers/login", {
    method: "POST",
    body: { phone, pin },
  });

const getCustomerJobs = async (customerId, search = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/customers/${customerId}/jobs${query}`);
};

const confirmJob = async (jobId, enteredPin) =>
  apiFetch(`/jobs/${jobId}/confirm`, {
    method: "POST",
    body: { enteredPin },
  });

const createCustomer = async (phone, name, pin) =>
  apiFetch("/customers", {
    method: "POST",
    body: { phone, name, pin },
  });

const updateCustomerProfile = async (customerId, profileData) =>
  apiFetch(`/customers/${customerId}`, { method: "PUT", body: profileData });

export {
  lockJob,
  createPendingJob,
  checkCustomer,
  getJobsByShop,
  getJobsById,
  loginShop,
  registerShop,
  addPayment,
  updateJobStatus,
  processPayment,
  requoteJob,
  updateJob,
  getJobHistory,
  getShopCustomers,
  getShopProfile,
  updateShopProfile,
  getShopAnalytics,
  getShopNotifications,
  getCustomerNotifications,
  acceptTransfer,
  checkReferralJob,
  searchJobs,
  uploadPhotos,
  cancelJob,
  changePin,
  requestOtp,
  resetPin,
  getShopStats,
  loginCustomer,
  getCustomerJobs,
  confirmJob,
  createCustomer,
  updateCustomerProfile,
};

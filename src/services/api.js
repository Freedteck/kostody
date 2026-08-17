const API_URL = "http://localhost:5000/api";

const lockJob = async (jobData, shopId, customerId, enteredPin) => {
  try {
    const response = await fetch(`${API_URL}/jobs/lock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const createPendingJob = async (jobData, shopId) => {
  const response = await fetch(`${API_URL}/jobs/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...jobData,
      shopId,
      accessoriesRetained: jobData.accessoriesRetained
        ? jobData.accessoriesRetained.split(",").map((i) => i.trim())
        : [],
      quotedPrice: Number(jobData.quotedPrice),
      upfrontPayment: Number(jobData.upfrontPayment),
      quoteValidityDays: Number(jobData.quoteValidity),
    }),
  });
  if (!response.ok) throw new Error("Failed to share job");
  return response.json();
};

const checkCustomer = async (phone) => {
  try {
    const response = await fetch(`${API_URL}/customers/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
      }),
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getJobsByShop = async (shopId, filter = "", search = "") => {
  try {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (search) params.append("search", search);

    const url = `${API_URL}/jobs/shop/${shopId}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getJobsById = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`);
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const loginShop = async (authData) => {
  const { email, password } = authData;
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const registerShop = async (shopData, authData) => {
  const { shopName, engineerName, shopPhone, specialty, shopAddress } =
    shopData;
  const { email, password } = authData;
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopName,
        engineerName,
        phone: shopPhone,
        email,
        password,
        specialty,
        address: shopAddress,
      }),
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const updateJobStatus = async (jobId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error("Failed to update status");

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const addPayment = async (jobId, amount, method = "Cash") => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), method }),
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const processPayment = async (
  jobId,
  enteredPin,
  finalPaymentAmount,
  method = "Cash",
) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/collect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enteredPin,
        finalPaymentAmount,
        method,
      }),
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const requoteJob = async (jobId, enteredPin, newPrice, validityDays) => {
  const response = await fetch(`${API_URL}/jobs/${jobId}/requote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enteredPin, newPrice, validityDays }),
  });
  if (!response.ok) {
    const message = await response.json();
    throw new Error(message.message);
  }
  return response.json();
};

const updateJob = async (jobId, jobData) => {
  const response = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...jobData,
      accessoriesRetained: jobData.accessoriesRetained
        ? jobData.accessoriesRetained.split(",").map((item) => item.trim())
        : [],
      quotedPrice: Number(jobData.quotedPrice),
      upfrontPayment: Number(jobData.upfrontPayment),
      quoteValidityDays: Number(jobData.quoteValidity),
    }),
  });
  if (!response.ok) {
    const message = await response.json();
    throw new Error(message.message);
  }
  return response.json();
};

const getJobHistory = async (shopId, search = "", status = "Completed") => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const url = `${API_URL}/jobs/history/${shopId}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getShopCustomers = async (shopId, search = "") => {
  const response = await fetch(
    `${API_URL}/customers/${shopId}?search=${search}`,
  );
  if (!response.ok) throw new Error("Failed to fetch customers");
  return response.json();
};

const getShopProfile = async (shopId) => {
  try {
    const response = await fetch(`${API_URL}/shops/${shopId}`);
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const updateShopProfile = async (shopId, profileData) => {
  try {
    const response = await fetch(`${API_URL}/shops/${shopId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getShopAnalytics = async (shopId) => {
  try {
    const response = await fetch(`${API_URL}/analytics/${shopId}`);
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getShopNotifications = async (shopId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${shopId}`);
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const acceptTransfer = async (jobId, enteredPin) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/accept-transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enteredPin }),
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const checkReferralJob = async (referralId) => {
  try {
    const response = await fetch(
      `${API_URL}/jobs/check-referral?q=${encodeURIComponent(referralId)}`,
    );
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data.results[0] || null;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const searchJobs = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/jobs/check-referral?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const uploadPhotos = async (jobId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos", file);
    });

    const response = await fetch(`${API_URL}/jobs/${jobId}/photos`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const cancelJob = async (jobId, enteredPin = null) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enteredPin }),
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const changePin = async (customerId, oldPin, newPin) => {
  try {
    const response = await fetch(`${API_URL}/customers/${customerId}/pin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPin, newPin }),
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const requestOtp = async (phone) => {
  try {
    const response = await fetch(`${API_URL}/customers/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const resetPin = async (phone, otp, newPin) => {
  try {
    const response = await fetch(`${API_URL}/customers/reset-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, newPin }),
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getShopStats = async (shopId, period = "month") => {
  try {
    const response = await fetch(
      `${API_URL}/analytics/${shopId}?period=${period}`,
    );
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

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
  acceptTransfer,
  checkReferralJob,
  searchJobs,
  uploadPhotos,
  cancelJob,
  changePin,
  requestOtp,
  resetPin,
  getShopStats,
};

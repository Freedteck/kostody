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
      throw new Error("Failed to check user");
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
      throw new Error("Failed to get Jobs");
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
      throw new Error("Failed to get Jobs");
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
      throw new Error("Login failed");
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
      throw new Error("Register failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const updateJobStatus = async (jobId, newStatus) => {
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

export const addPayment = async (jobId, amount, method = "Cash") => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), method }),
    });

    if (!response.ok) throw new Error("Failed to log payment");

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export {
  lockJob,
  checkCustomer,
  getJobsByShop,
  getJobsById,
  loginShop,
  registerShop,
};

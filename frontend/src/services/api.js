const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    console.log("API:", `${API_URL}${endpoint}`);

    console.log("Status:", response.status);

    console.log("Response:", data);

    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error);

    throw error;
  }
};

export const createCodOrder = (payload) => {
  return request("/orders/cod", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createManualPaymentOrder = (payload) => {
  return request("/orders/manual-payment", {
    method: "POST",

    body: JSON.stringify(payload),
  });
};

export const getOrder = (orderId) => {
  return request(`/orders/${orderId}`);
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const request = async (endpoint, options = {}) => {
  const { headers, ...restOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,

    headers: {
      "Content-Type": "application/json",

      ...headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const createCodOrder = (payload) => {
  return request("/orders/cod", {
    method: "POST",

    body: JSON.stringify(payload),
  });
};

export const getOrder = (orderId) => {
  return request(`/orders/${orderId}`);
};

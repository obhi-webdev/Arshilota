const axios = require("axios");

const isLive = () => {
  return process.env.SSLC_IS_LIVE === "true";
};

const getInitiationUrl = () => {
  return isLive()
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox-gw.sslcommerz.com/gwprocess/v4/api.php";
};

const getValidationUrl = () => {
  return isLive()
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
};

const initiateSslPayment = async (payload) => {
  const formData = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await axios.post(
    getInitiationUrl(),

    formData.toString(),

    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      timeout: 30000,
    },
  );

  return response.data;
};

const validateSslPayment = async (validationId) => {
  const response = await axios.get(
    getValidationUrl(),

    {
      params: {
        val_id: validationId,

        store_id: process.env.SSLC_STORE_ID,

        store_passwd: process.env.SSLC_STORE_PASSWORD,

        format: "json",

        v: 1,
      },

      timeout: 30000,
    },
  );

  return response.data;
};

module.exports = {
  initiateSslPayment,
  validateSslPayment,
};

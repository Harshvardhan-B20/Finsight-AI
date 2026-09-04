const API_BASE_URL = "https://finsight-ai-6082.onrender.com/api";

// ========================================
// REGISTER USER
// ========================================
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      console.error("Register API returned non-JSON:", text);

      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Register API error:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to FinSight AI backend."
      );
    }

    throw error;
  }
};

// ========================================
// LOGIN USER
// ========================================
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      }),
    });

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      console.error("Login API returned non-JSON:", text);

      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.token) {
      throw new Error(
        "Login succeeded but authentication token was not received."
      );
    }

    if (!data.user) {
      throw new Error(
        "Login succeeded but user information was not received."
      );
    }

    return data;
  } catch (error) {
    console.error("Login API error:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to FinSight AI backend."
      );
    }

    throw error;
  }
};

// ========================================
// GET CURRENT USER
// ========================================
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      console.error("Current user API returned non-JSON:", text);

      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    return data;
  } catch (error) {
    console.error("Current user API error:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to FinSight AI backend."
      );
    }

    throw error;
  }
};
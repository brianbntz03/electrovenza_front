let isRedirecting = false;

export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("jwt_token");

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && !isRedirecting) {
    isRedirecting = true;
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    localStorage.removeItem("vendedor_id");
    localStorage.removeItem("vendedor_nombre");
    window.location.href = "/gestion/";
    return response;
  }

  return response;
}

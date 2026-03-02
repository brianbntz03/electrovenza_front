let isRedirecting = false;

export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("jwt_token");

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Solo agregar Content-Type si no es FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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

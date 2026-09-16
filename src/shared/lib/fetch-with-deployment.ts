const deploymentId =
  typeof __VERCEL_DEPLOYMENT_ID__ === "string" ? __VERCEL_DEPLOYMENT_ID__ : "";

export const fetchWithDeployment = (input: string, init: RequestInit = {}) => {
  if (!deploymentId) {
    return fetch(input, init);
  }

  const headers = new Headers(init.headers ?? {});

  // Pin API requests to the deployment that served the current client bundle to avoid version skew
  headers.set("x-deployment-id", deploymentId);

  return fetch(input, {
    ...init,
    headers,
  });
};

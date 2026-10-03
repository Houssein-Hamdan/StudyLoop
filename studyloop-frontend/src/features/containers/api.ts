import { apiClient } from "../../lib/api/client";

export type CreateContainerPayload = {
  name: string;
  description?: string;
};

export type UpdateContainerPayload = {
  name?: string;
  description?: string;
};

export async function getContainers() {
  const response = await apiClient.get("/containers");

  return response.data.containers;
}

export async function getContainer(containerId: string) {
  const response = await apiClient.get(`/containers/${containerId}`);

  return response.data.container ?? response.data;
}

export async function createContainer(payload: CreateContainerPayload) {
  const response = await apiClient.post("/containers", payload);

  return response.data;
}

export async function updateContainer(
  containerId: string,
  payload: UpdateContainerPayload,
) {
  const response = await apiClient.put(`/containers/${containerId}`, payload);

  return response.data;
}

export async function deleteContainer(containerId: string) {
  const response = await apiClient.delete(`/containers/${containerId}`);

  return response.data;
}

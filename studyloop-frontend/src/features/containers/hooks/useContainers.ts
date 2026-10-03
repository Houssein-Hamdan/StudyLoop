import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createContainer,
  deleteContainer,
  getContainer,
  getContainers,
  updateContainer,
  type CreateContainerPayload,
  type UpdateContainerPayload,
} from "../api";

export const containerKeys = {
  all: ["containers"] as const,

  detail: (containerId: string) => ["containers", containerId] as const,
};

export function useContainers() {
  return useQuery({
    queryKey: containerKeys.all,
    queryFn: getContainers,
    staleTime: 0,
  });
}

export function useContainer(containerId: string) {
  return useQuery({
    queryKey: containerKeys.detail(containerId),
    queryFn: () => getContainer(containerId),
    enabled: Boolean(containerId),
  });
}

export function useCreateContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContainerPayload) => createContainer(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: containerKeys.all,
      });
    },
  });
}

export function useUpdateContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      containerId,
      payload,
    }: {
      containerId: string;
      payload: UpdateContainerPayload;
    }) => updateContainer(containerId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: containerKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: containerKeys.detail(variables.containerId),
      });
    },
  });
}

export function useDeleteContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (containerId: string) => deleteContainer(containerId),

    onSuccess: (_, containerId) => {
      queryClient.invalidateQueries({
        queryKey: containerKeys.all,
      });

      queryClient.removeQueries({
        queryKey: containerKeys.detail(containerId),
      });
    },
  });
}

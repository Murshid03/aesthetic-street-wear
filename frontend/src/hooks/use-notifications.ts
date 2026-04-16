import api from "@/lib/api";
import { Notification } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useNotifications() {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get("/notifications");
            return data;
        },
        enabled: isAuthenticated,
        refetchInterval: 30000, // every 30s
    });

    const markRead = useMutation({
        mutationFn: async (id: string) => {
            await api.put(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const clearAll = useMutation({
        mutationFn: async () => {
            await api.delete("/notifications");
        },
        onSuccess: () => {
            queryClient.setQueryData(["notifications"], []);
        },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        notifications,
        isLoading,
        unreadCount,
        markRead: markRead.mutate,
        clearAll: clearAll.mutate,
    };
}

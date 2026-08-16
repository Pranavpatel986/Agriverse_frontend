"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { BellIcon, CheckCheckIcon, MessageSquareIcon, FileCheckIcon, FileXIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks/use-notifications";
import type { AppNotification } from "../types/notification.types";

function notificationHref(notification: AppNotification): string | null {
  const slug = notification.payload.articleSlug;
  return slug ? `/article/${slug}` : null;
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "comment_reply":
      return <MessageSquareIcon className="text-canopy-700 size-4" />;
    case "moderation_status":
      return <FileCheckIcon className="text-canopy-700 size-4" />;
    default:
      return <FileXIcon className="text-muted-foreground size-4" />;
  }
}

function notificationText(notification: AppNotification): string {
  const { type, payload } = notification;
  if (type === "comment_reply") {
    return `${payload.replierName ?? "Someone"} replied to your comment${
      payload.articleTitle ? ` on "${payload.articleTitle}"` : ""
    }`;
  }
  if (type === "moderation_status") {
    const verdict = payload.decision === "approve" ? "published" : "sent back to draft";
    return `Your article "${payload.articleTitle ?? ""}" was ${verdict}${
      payload.feedback ? `: "${payload.feedback}"` : ""
    }`;
  }
  return "New notification";
}

export function NotificationBell() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <BellIcon className="size-5" />
          {unreadCount > 0 && (
            <span className="bg-clay-600 absolute top-1 right-1 flex size-2 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="text-muted-foreground p-4 text-center text-sm">Loading…</p>
          ) : !data || data.content.length === 0 ? (
            <p className="text-muted-foreground p-6 text-center text-sm">
              You&apos;re all caught up.
            </p>
          ) : (
            data.content.map((notification) => {
              const href = notificationHref(notification);
              const handleClick = () => {
                if (!notification.isRead) markRead.mutate(notification.id);
              };
              const content = (
                <div
                  className={cn(
                    "hover:bg-muted/50 flex gap-3 px-3 py-2.5 text-sm",
                    !notification.isRead && "bg-canopy-50",
                  )}
                >
                  <span className="mt-0.5 shrink-0">
                    <NotificationIcon type={notification.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2">{notificationText(notification)}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatDistanceToNowStrict(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="bg-clay-600 mt-1.5 size-1.5 shrink-0 rounded-full" />
                  )}
                </div>
              );

              return href ? (
                <Link key={notification.id} href={href} className="block" onClick={handleClick}>
                  {content}
                </Link>
              ) : (
                <button
                  key={notification.id}
                  type="button"
                  className="block w-full text-left"
                  onClick={handleClick}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

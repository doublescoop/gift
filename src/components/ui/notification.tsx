"use client";

import { cn } from "@/lib/utils";

// @TODO - Replace the notifications sample data array with real-time data, pop off the last data when the new one is added

// Types
export interface NotificationItem {
  fromAddress: string;
  toAddress: string;
  giftName: string;
  value: string;
  icon: string;
  color: string;
  time: string;
}

// Sample Data
export const notifications: NotificationItem[] = [
  {
    fromAddress: "memeking.base.eth",
    toAddress: "dogelover.base.eth",
    giftName: "Ultimate Doge Pack",
    value: "$420.69",
    time: "2m ago",
    icon: "🎁",
    color: "#FF3D71",
  },
  {
    fromAddress: "pepeking.base.eth",
    toAddress: "p3p3.base.eth",
    giftName: "Pepe's Treasure Chest",
    value: "$69.42",
    time: "5m ago",
    icon: "🐸",
    color: "#00C9A7",
  },
  {
    fromAddress: "cryptodad.base.eth",
    toAddress: "defikid.base.eth",
    giftName: "Meme Starter Pack",
    value: "$123.45",
    time: "8m ago",
    icon: "🚀",
    color: "#FFB800",
  },
  {
    fromAddress: "anonii.base.eth",
    toAddress: "caveman.base.eth",
    giftName: "WAGMI Bundle",
    value: "$777.77",
    time: "12m ago",
    icon: "💎",
    color: "#1E86FF",
  },
  {
    fromAddress: "daddy.base.eth",
    toAddress: "babes.base.eth",
    giftName: "Expensive Stuffs",
    value: "$11300.69",
    time: "13m ago",
    icon: "🎁",
    color: "#FF3D71",
  },
];

// Extended notifications array
export const extendedNotifications = Array.from(
  { length: 3 }, 
  () => notifications
).flat();

// Component
export const Notification = ({ fromAddress, toAddress, giftName, value, icon, color, time }: NotificationItem) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[800px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-base truncate">
              <span className="font-bold text-primary-red">{fromAddress}</span> is giving{" "}
              <span className="font-medium">{giftName}</span>
            
            </span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
          <span className="font-bold text-primary-red">{toAddress}</span>
            <span className="text-xs text-gray-500 ml-2">worth {value}</span>
          </p>
        </div>
      </div>
    </figure>
  );
};

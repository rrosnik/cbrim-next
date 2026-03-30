"use client";

import React from "react";
import { MyScene } from "@/modules/livecoding/ui/components/scene";

export const LiveCodingView = () => {
  return (
    <div className="flex-1 flex h-full">
      <MyScene />
    </div>
  );
};

import { createAvatar } from "@dicebear/core";
import { initials, botttsNeutral } from "@dicebear/collection";

import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNetrual" | "initials";
}

export const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({
  seed,
  variant,
  className,
}) => {
  let avatar;

  if (variant === "botttsNetrual") {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
  return <div>generated-avatar</div>;
};

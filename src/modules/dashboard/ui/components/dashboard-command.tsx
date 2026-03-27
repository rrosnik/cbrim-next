import React, { Dispatch, SetStateAction } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandShortcut,
  CommandList,
  CommandItem,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { firstSection } from "./dashboard-sidebar";
import { useRouter } from "next/navigation";

type DashBoardCommandProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DashboardCommand: React.FC<DashBoardCommandProps> = ({
  open,
  setOpen,
}) => {
  const router = useRouter();
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {firstSection.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                <item.icon />
                <span>{item.label}</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandResponsiveDialog>
  );
};

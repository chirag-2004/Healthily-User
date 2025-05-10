import React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const CategoryList = () => {
  return (
    <div className="hidden md:block h-screen mt-5 mx-5 flex-col">
      <Command>
        <CommandInput placeholder="Search by Location..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Noida</CommandItem>
            <CommandItem>Pune</CommandItem>
            <CommandItem>Mumbai</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default CategoryList;

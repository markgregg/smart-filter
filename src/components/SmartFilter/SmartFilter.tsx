import React from "react";
import { SmartFilterProps } from "@/types"
import { FilterBar } from "../FilterBar";
import { StateProvider } from "../StateProvider/StateProvider";

export const SmartFilter = React.memo((props: SmartFilterProps) => {
  return (
    <StateProvider props={props}>
      <FilterBar />
    </StateProvider>
  );
})
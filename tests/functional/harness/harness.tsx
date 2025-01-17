import { SmartFilterProps } from "@/types";
import { render } from '@testing-library/react';


export const createHarness = <Props extends SmartFilterProps>(Comp: React.ComponentType<Props>, props: Props) => {

  const result = render(<Comp {...props} />)

  return {

  }
}
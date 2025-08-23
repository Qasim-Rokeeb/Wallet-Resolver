
import * as React from "react";
import { SVGProps } from "react";

export const LedgerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="#FF5733"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5 7.5h-9v2h9v-2zm-9 3h9v2h-9v-2zm0 3h5v2h-5v-2z"
      fill="#fff"
    />
  </svg>
);

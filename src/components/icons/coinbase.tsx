
import * as React from "react";
import { SVGProps } from "react";

export const CoinbaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="#0052FF"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"
    />
    <path fill="#fff" d="M12 7.5h.01v9H12c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5z" />
    <path
      fill="#fff"
      d="M12 7.5c2.49 0 4.5 2.01 4.5 4.5S14.49 16.5 12 16.5v-9zM7.5 12c0 2.49 2.01 4.5 4.5 4.5v-9c-2.49 0-4.5 2.01-4.5 4.5z"
    />
    <path
      fill="#0052FF"
      d="M12 12c1.38 0 2.5-1.12 2.5-2.5S13.38 7 12 7s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z"
    />
    <rect x={10.75} y={10.75} width={2.5} height={2.5} rx={1.25} fill="#fff" />
  </svg>
);

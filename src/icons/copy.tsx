import * as React from "react";
const Copy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="2" y="2" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
export default Copy; 
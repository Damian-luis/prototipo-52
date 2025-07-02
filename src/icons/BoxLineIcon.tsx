import * as React from "react";
const BoxLineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
export default BoxLineIcon; 
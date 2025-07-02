import * as React from "react";
const Table = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="7" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export default Table; 
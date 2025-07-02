import * as React from "react";
const Lock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="6" y="10" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="10" y="14" width="4" height="4" rx="2" fill="currentColor"/>
    <path d="M8 10V7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
export default Lock; 
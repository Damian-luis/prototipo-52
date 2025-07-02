import * as React from "react";
const Download = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 3V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 13L12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="3" y="21" width="18" height="2" rx="1" fill="currentColor"/>
  </svg>
);
export default Download; 
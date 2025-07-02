import * as React from "react";
const Info = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="11" y="7" width="2" height="2" fill="currentColor"/>
    <rect x="11" y="11" width="2" height="6" fill="currentColor"/>
  </svg>
);
export default Info; 
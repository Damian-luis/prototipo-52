import * as React from "react";
const EyeClose = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 12C2 12 5.5 7 12 7C18.5 7 22 12 22 12C22 12 18.5 17 12 17C5.5 17 2 12 2 12Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export default EyeClose; 
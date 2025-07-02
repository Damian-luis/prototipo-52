import * as React from "react";
const PlugIn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="7" y="7" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 2V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 17V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export default PlugIn; 
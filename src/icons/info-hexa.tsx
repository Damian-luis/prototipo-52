import * as React from "react";
const InfoHexa = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);
export default InfoHexa; 
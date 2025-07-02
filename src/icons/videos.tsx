import * as React from "react";
const Videos = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <polygon points="10,9 16,12 10,15" fill="currentColor"/>
  </svg>
);
export default Videos; 
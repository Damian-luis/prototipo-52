import * as React from "react";
const Group = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="7" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="2" y="15" width="20" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
export default Group; 
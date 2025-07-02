import * as React from "react";
const UserLine = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="16" width="16" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
export default UserLine; 
import * as React from "react";

const MoreDot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="4" cy="10" r="2" fill="currentColor" />
    <circle cx="10" cy="10" r="2" fill="currentColor" />
    <circle cx="16" cy="10" r="2" fill="currentColor" />
  </svg>
);

export default MoreDot; 
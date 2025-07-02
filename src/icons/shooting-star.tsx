import * as React from "react";
const ShootingStar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 12L12 2M2 12L22 12M2 12L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export default ShootingStar; 
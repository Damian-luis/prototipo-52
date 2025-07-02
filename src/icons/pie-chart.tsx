import * as React from "react";
const PieChart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 2A10 10 0 0 1 22 12H12V2Z" fill="currentColor"/>
  </svg>
);
export default PieChart; 
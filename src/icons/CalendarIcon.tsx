import * as React from "react";
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="5" width="14" height="12" rx="2" fill="currentColor"/>
    <path d="M7 2v2M13 2v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
export default CalendarIcon; 
import * as React from "react";
const MailLine = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 5L12 13L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export default MailLine; 
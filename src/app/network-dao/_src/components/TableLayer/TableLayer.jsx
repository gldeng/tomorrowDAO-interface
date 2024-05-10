import React from "react";
// import useMobile from "../../hooks/useMobile";

import "./TableLayer.styles.css";

export default function TableLayer({ children, className = '', ...props }) {
  const isMobile = false;
  return (
    <div
      className={`table-layer ${  isMobile ? "mobile " : ""  }${className}`}
      {...props}
    >
      <div className="table-layer-block" />
      {children}
      <div className="table-layer-block" />
    </div>
  );
}

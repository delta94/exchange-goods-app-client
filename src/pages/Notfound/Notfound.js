import React from "react";

import "./Notfound.css";
import NotfoundImg from "../../public/images/notfound.png";

export default function() {
  return (
    <div
      className="page-notfound"
      style={{ backgroundImage: `url(${NotfoundImg})` }}
    />
  );
}
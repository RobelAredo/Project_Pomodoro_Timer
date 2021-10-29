import React from "react";

function Paused ({paused}) {
  if (paused) return <h2>PAUSED</h2>
  return null;
}

export default Paused;
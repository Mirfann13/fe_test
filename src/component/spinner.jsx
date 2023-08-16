import React from "react";
import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <BeatLoader css={override} color={"#faae2b"} loading={true} size={15} />
    </div>
  );
}

export default Spinner;

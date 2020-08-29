import React from "react";
import styled from "styled-components";

import PlanForm from "../containers/PlanForm";
import RouteList from "../containers/RouteList";

const StyledPane = styled.div`
  width: 400px;
  height: 100%;
  padding: 10px;
  flex-shrink: 0;
  border-right: 1px solid #999;
`;

const Pane: React.FunctionComponent = () => {
  return (
    <StyledPane>
      <div className="content">
        <h1 className="title">Cycle Maps</h1>
      </div>
      <PlanForm />
      <RouteList />
    </StyledPane>
  );
};

export default Pane;

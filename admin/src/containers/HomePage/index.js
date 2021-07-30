import React, { memo } from "react";

import { Block, Container } from "./components";
import { Calendar } from "../../components/CustomCalendar/Calendar";

const HomePage = ({ global: { plugins }, history: { push } }) => {
  return (
    <>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1>Bienvenue sur la gestion du planning de réception</h1>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);

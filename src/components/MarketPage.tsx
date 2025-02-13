import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { selectUserState } from '../data/state';
import { useAppSelector } from '../app/hooks';
import "./style.scss";

export const MarketPage = () => {
  const userState = useAppSelector(selectUserState);
  return (
    <MDBContainer className="mt-5">
      <MDBRow>
          {
          userState!.player!.data.inventory.map((nuggetId) => {
            return (
              <MDBCol md="12" key={nuggetId}>
                <MDBCard>
                  <MDBCardHeader>
                    <div className="d-flex">
                      <h5>
                       nuggetTitle
                      </h5>
                    </div>
                  </MDBCardHeader>
                  <MDBCardBody>
                       nuggetInfo
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })
              }
      </MDBRow>
    </MDBContainer>
  );
};

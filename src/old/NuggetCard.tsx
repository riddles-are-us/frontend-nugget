import { selectUserState } from "../data/state";
import { Nugget } from "../data/model";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
} from "mdb-react-ui-kit";
import { setFocus } from "./p_ui";
import { useAppSelector, useAppDispatch } from "../app/hooks";

function decodeAttributes(attrStr: string) {
  let c = BigInt(attrStr);
  let attrs = [];
  for (let i = 0; i < 8; i++) {
    attrs.push(Number(c & 0xffn));
    c >>= 8n;
  }
  return attrs;
}

function Attributes(params: { attrs: string; nbplus: number }) {
  const attrs = decodeAttributes(params.attrs);
  const stuff = [];
  if (params.nbplus > 0) {
    stuff.push(<span>(</span>);
  }
  for (let i = 0; i < params.nbplus; i++) {
    let symbol = attrs[i] == 0 ? "?" : attrs[i].toString();
    stuff.push(<span>{symbol}</span>);
    if (i < params.nbplus - 1) {
      stuff.push(<span>+</span>);
    }
  }
  if (params.nbplus > 0) {
    stuff.push(<span>)</span>);
  }
  for (let i = params.nbplus; i < 8; i++) {
    let symbol = attrs[i] == 0 ? "?" : attrs[i].toString();
    stuff.push(<span>*{symbol}</span>);
  }
  return (
    <>
      {stuff.map((att) => {
        return att;
      })}
    </>
  );
}

export function NuggetCard(params: { nugget: Nugget; index?: number }) {
  const dispatch = useAppDispatch();

  function setFocusNugget(nugget: Nugget, index: number | null = null) {
    dispatch(
      setFocus({
        nugget: nugget,
        index: index,
      })
    );
  }

  return (
    <MDBCard>
      <MDBCardHeader>
        <div className="d-flex">
          <h5>NuggetID: {params.nugget.id} </h5>
        </div>
      </MDBCardHeader>
      <MDBCardBody>
        <p>Recycle Price: {params.nugget.sysprice}</p>
        <p>
          <Attributes
            attrs={params.nugget.attributes}
            nbplus={params.nugget.feature}
          />
        </p>
        <p>cycle: {params.nugget.cycle}</p>
        <p>feature: {params.nugget.feature}</p>
        <p>Bid: {params.nugget.bid ? params.nugget.bid?.bidprice : "NA"}</p>
        <MDBBtn onClick={() => setFocusNugget(params.nugget, params.index)}>
          more
        </MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
}

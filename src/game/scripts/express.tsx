import axios from "axios";
import { fullUrl } from "./request";
import { Bid, NuggetData } from "../../data/model";
import { useAppDispatch } from "../../app/hooks";
import {
  setAuctionNuggets,
  setLotNuggets,
  setNugget,
  setNuggets,
  setSellingNuggets,
} from "../../data/nuggets";

const instance = axios.create({
  baseURL: fullUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

function decodeNuggets(raws: any): NuggetData[] {
  const commodityList: NuggetData[] = raws.map(
    ({
      attributes,
      cycle,
      feature,
      id,
      marketid,
      sysprice,
    }: {
      attributes: number;
      cycle: number;
      feature: number;
      id: number;
      marketid: number;
      sysprice: number;
    }) => ({
      id: Number(id),
      marketid: marketid,
      attributes: Number(attributes),
      feature: Number(feature),
      cycle: Number(cycle),
      sysprice: Number(sysprice ?? 0),
      askprice: 0,
      bid: null,
    })
  );

  console.log("decode", commodityList);
  return commodityList;
}

function decodeMarkets(raws: any): NuggetData[] {
  const commodityList: NuggetData[] = raws.map(
    ({
      askprice,
      marketid,
      bidder,
      object,
    }: {
      askprice: number;
      marketid: number;
      bidder: Bid;
      object: {
        attributes: number;
        cycle: number;
        feature: number;
        id: number;
        marketid: number;
        sysprice: number;
      };
    }) => ({
      id: Number(object.id),
      marketid: Number(marketid),
      attributes: Number(object.attributes),
      feature: Number(object.feature),
      cycle: Number(object.cycle),
      sysprice: Number(object.sysprice ?? 0),
      askprice: Number(askprice ?? 0),
      bid: bidder,
    })
  );

  console.log("decode", commodityList);
  return commodityList;
}

async function getNuggets(): Promise<NuggetData[]> {
  const res = await getRequest("/data/nuggets");
  const raws = res.data;
  console.log("getNuggets", raws);
  return decodeNuggets(raws);
}

async function getNugget(index: number): Promise<NuggetData> {
  const res = await getRequest(`/data/nugget/${index}`);
  const raws = res.data;
  console.log("getNugget ", index, " ", raws);
  return decodeNuggets(raws)[0];
}

async function getAuctionNuggets(): Promise<NuggetData[]> {
  const res = await getRequest("/data/markets");
  const raws = res.data;
  console.log("getAuctionNuggets", raws);
  return decodeMarkets(raws);
}

async function getLotNuggets(
  pid1: string,
  pid2: string
): Promise<NuggetData[]> {
  const res = await getRequest(`/data/bid/${pid1}/${pid2}`);
  const raws = res.data;
  console.log("getLotNuggets", raws);
  return decodeMarkets(raws);
}

async function getSellingNuggets(
  pid1: string,
  pid2: string
): Promise<NuggetData[]> {
  const res = await getRequest(`/data/sell/${pid1}/${pid2}`);
  const raws = res.data;
  console.log("sellign raw", raws);
  return decodeMarkets(raws);
}

export const updateNuggetAsync = async (dispatch: any, index: number) => {
  const ret = await getNugget(index);
  dispatch(setNugget(ret));
};

export const updateNuggetsAsync = async (dispatch: any) => {
  const ret = await getNuggets();
  dispatch(setNuggets(ret));
};

export const updateAuctionNuggetsAsync = async (dispatch: any) => {
  const ret = await getAuctionNuggets();
  dispatch(setAuctionNuggets(ret));
};

export const updateLotNuggetsAsync = async (
  dispatch: any,
  pid1: string,
  pid2: string
) => {
  const ret = await getLotNuggets(pid1, pid2);
  dispatch(setLotNuggets(ret));
};

export const updateSellingNuggetsAsync = async (
  dispatch: any,
  pid1: string,
  pid2: string
) => {
  const ret = await getSellingNuggets(pid1, pid2);
  dispatch(setSellingNuggets(ret));
};

async function getRequest(path: string) {
  try {
    const response = await instance.get(path);
    if (response.status === 200 || response.status === 201) {
      const jsonResponse = response.data;
      return jsonResponse;
    } else {
      throw "Post error at " + path + " : " + response.status;
    }
  } catch (error) {
    throw "Unknown error at " + path + " : " + error;
  }
}

async function postRequest(path: string, formData: FormData) {
  try {
    const response = await instance.post(path, formData);
    if (response.status === 20 || response.status === 2010) {
      const jsonResponse = response.data;
      return jsonResponse;
    } else {
      throw "Post error at " + path + " : " + response.status;
    }
  } catch (error) {
    throw "Unknown error at " + path + " : " + error;
  }
}

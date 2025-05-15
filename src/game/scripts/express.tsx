import axios from "axios";
import { fullUrl } from "./request";
import { NuggetData } from "../../data/model";
import { useAppDispatch } from "../../app/hooks";
import {
  setAuctionNuggets,
  setLotNuggets,
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
  const decodeCard = (
    marketid: number,
    object: { duration: number; attributes: number }
  ) => {
    const value = BigInt(object.attributes);
    const attributes = [];
    for (let i = 0; i < 8; i++) {
      const shift = BigInt(i * 8);
      const byte = Number((value >> shift) & 0xffn);
      const signed = byte >= 128 ? byte - 256 : byte;
      attributes.push(signed);
    }
    console.log(attributes);
    return {
      duration: object.duration,
      attributes: attributes,
      marketid,
    };
  };
  const commodityList: NuggetData[] = raws.map(
    ({
      marketid,
      askprice,
      object,
      bidder,
    }: {
      marketid: number;
      askprice: number;
      object: { duration: number; attributes: number };
      bidder: { bidprice: number; bidder: string[] };
    }) => ({
      id: Number(marketid),
      askPrice: Number(askprice ?? 0),
      object: decodeCard(Number(marketid), object),
      bidPrice: Number(bidder?.bidprice ?? 0),
      bidders: bidder?.bidder ?? [],
    })
  );

  console.log("decode", commodityList);
  return commodityList;
}

async function getNuggets(): Promise<NuggetData[]> {
  const res = await getRequest("/data/nuggets");
  const raws = res.data;
  console.log("raw", raws);
  return decodeNuggets(raws);
}

async function getNugget(index: number): Promise<NuggetData[]> {
  const res = await getRequest(`/data/nugget/${index}`);
  const raws = res.data;
  console.log("nugget raw", raws);
  return decodeNuggets(raws);
}

async function getAuctionNuggets(): Promise<NuggetData[]> {
  const res = await getRequest("/data/markets");
  const raws = res.data;
  console.log("market raw", raws);
  return decodeNuggets(raws);
}

async function getLotNuggets(
  pid1: string,
  pid2: string
): Promise<NuggetData[]> {
  const res = await getRequest(`/data/bid/${pid1}/${pid2}`);
  const raws = res.data;
  console.log("lot raw", raws);
  return decodeNuggets(raws);
}

async function getSellingNuggets(
  pid1: string,
  pid2: string
): Promise<NuggetData[]> {
  const res = await getRequest(`/data/sell/${pid1}/${pid2}`);
  const raws = res.data;
  console.log("sellign raw", raws);
  return decodeNuggets(raws);
}

export const updateNuggetAsync = async (dispatch: any, index: number) => {
  const ret = await getNugget(index);
  dispatch(setSellingNuggets(ret));
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

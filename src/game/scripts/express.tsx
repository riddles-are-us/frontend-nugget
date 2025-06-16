import axios from "axios";
import { fullUrl } from "./request";
import {
  Bid,
  NuggetData,
  NuggetPageData,
  NuggetTabData,
} from "../../data/model";
import { useAppDispatch } from "../../app/hooks";
import { setNugget } from "../../data/nuggets";

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
      feature,
      id,
      marketid,
      sysprice,
    }: {
      attributes: number;
      feature: number;
      id: number;
      marketid: number;
      sysprice: number;
    }) => ({
      id: Number(id),
      marketid: marketid,
      attributes: Number(attributes),
      feature: Number(feature),
      sysprice: Number(sysprice ?? 0),
      askprice: 0,
      bid: null,
      lastUpdate: 0,
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
      settleinfo,
    }: {
      askprice: number;
      marketid: number;
      bidder: Bid;
      object: {
        attributes: number;
        feature: number;
        id: number;
        marketid: number;
        sysprice: number;
      };
      settleinfo: number;
    }) => ({
      id: Number(object.id),
      marketid: Number(marketid),
      attributes: Number(object.attributes),
      feature: Number(object.feature),
      sysprice: Number(object.sysprice ?? 0),
      askprice: Number(askprice ?? 0),
      bid: bidder,
      lastUpdate: (Number(settleinfo) - 1) >> 16,
    })
  );

  console.log("decode", commodityList);
  return commodityList;
}

export const updateNuggetAsync = async (index: number) => {
  const res = await getRequest(`/data/nugget/${index}`);
  const raws = res.data;
  console.log("getNugget ", index, " ", raws);
  return decodeNuggets(raws)[0];
};

export const getNuggetsAsync = async (ids: number[]): Promise<NuggetData[]> => {
  const queryString = ids.map((id) => `ids=${id}`).join("&");
  const res = await getRequest(`/data/nuggets?${queryString}`);
  const raws = res.data;
  console.log("getNuggets", raws);
  return decodeNuggets(raws);
};

export const getSellingNuggetsAsync = async (
  skip: number,
  limit: number,
  pid1: string,
  pid2: string
): Promise<NuggetTabData> => {
  const res = await getRequest(
    `/data/sell/${pid1}/${pid2}?skip=${skip}&limit=${limit}`
  );
  const raws = res.data;
  console.log("getSelling", raws);
  return { nuggets: decodeMarkets(raws), nuggetCount: res.count };
};

export const getAuctionNuggetsAsync = async (
  skip: number,
  limit: number
): Promise<NuggetTabData> => {
  const res = await getRequest(`/data/markets?skip=${skip}&limit=${limit}`);
  const raws = res.data;
  console.log("getAuction", res, skip, limit);
  return { nuggets: decodeMarkets(raws), nuggetCount: res.count };
};

export const getLotNuggetsAsync = async (
  skip: number,
  limit: number,
  pid1: string,
  pid2: string
): Promise<NuggetTabData> => {
  const res = await getRequest(
    `/data/bid/${pid1}/${pid2}?skip=${skip}&limit=${limit}`
  );
  const raws = res.data;
  console.log("getLot", raws);
  return { nuggets: decodeMarkets(raws), nuggetCount: res.count };
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

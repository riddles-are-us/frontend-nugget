import { createAsyncThunk } from '@reduxjs/toolkit';
import { AccountSlice } from 'zkwasm-minirollup-browser';
import { createCommand, createWithdrawCommand, ZKWasmAppRpc } from 'zkwasm-minirollup-rpc';

// Get the current URL components
const currentLocation = window.location;
const protocol = currentLocation.protocol; // e.g., 'http:' or 'https:'
const hostname = currentLocation.hostname; // e.g., 'sinka' or 'localhost'

// We assume the rpc is at port 3000
export const fullUrl = "https://rpc.space-nugget.zkwasm.ai";
const rpc = new ZKWasmAppRpc(fullUrl);

async function queryConfigI() {
  try {
    const state = await rpc.queryConfig();
    return state;
  } catch (error) {
    throw new Error("QueryStateError " + error);
  }
}

async function queryStateI(prikey: string) {
  try {
    const data: any = await rpc.queryState(prikey);
    return JSON.parse(data.data);
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 500) {
        throw new Error("QueryStateError");
      } else {
        throw new Error("UnknownError");
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw Error("No response was received from the server, please check your network connection.");
    } else {
      throw Error("UnknownError");
    }
  }
}


export const getConfig = createAsyncThunk(
  'client/getConfig',
  async () => {
    const res: any = await queryConfigI();
    const data = JSON.parse(res.data);
    return data;
  }
)

export const SERVER_TICK_TO_SECOND = 5;

interface UserState<P, S> {
  player: P | null,
  state: S,
}

interface SendTransactionParams {
    cmd: Array<bigint>;
    prikey: string;
}

interface QueryStateParams {
    prikey: string;
}


export const sendTransaction = createAsyncThunk(
  'client/sendTransaction',
  async (params: {cmd: BigUint64Array, prikey: string }, { rejectWithValue }) => {
    try {
      const { cmd, prikey } = params;
      const state: any = await rpc.sendTransaction(cmd, prikey);
      console.log("(Data-Transaction)", state);
      return state;
    } catch (err: any) {
      // todo: handle error, unknown error is not meaningful
      return rejectWithValue(err.message || "UnknownError");
    }
  }
);

export const sendExtrinsicTransaction = createAsyncThunk(
  'client/sendExtrinsicTransaction',
  async (params: {cmd: BigUint64Array, prikey: string }, { rejectWithValue }) => {
    try {
      const { cmd, prikey } = params;
      const state: any = await rpc.sendExtrinsic(cmd, prikey);
      console.log("(Data-Transaction)", state);
      return state;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);


export const queryState = createAsyncThunk(
  'client/queryState',
  async (key: string, { rejectWithValue }) => {
    try {
      const state: any = await queryStateI(key);
      console.log("(Data-QueryState)", state);
      return state;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const queryInitialState = createAsyncThunk(
  'client/queryInitialState',
  async (key: string, { rejectWithValue }) => {
    try {
      const state: any = await queryStateI(key);
      console.log("(Data-QueryState)", state);
      return state;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);


async function queryData(url: string) {
  try {
    const data: any = await rpc.queryData(url)
    return data.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 500) {
        throw new Error("QueryStateError");
      } else {
        throw new Error("UnknownError");
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new Error("No response was received from the server, please check your network connection.");
    } else {
      throw new Error("UnknownError");
    }
  }
}

const CMD_WITHDRAW = 2n;

const EXPLORE_NUGGET = 4n;
const SELL_NUGGET = 5n;
const BID_NUGGET = 6n;
const CREATE_NUGGET = 7n;
const RECYCLE_NUGGET = 8n;
const LIST_NUGGET = 9n;

export function getExploreNuggetTransactionCommandArray(
  nonce: number,
  index: number,
): BigUint64Array {
  const command = createCommand(
    BigInt(nonce),
    EXPLORE_NUGGET,
    [BigInt(index)]
  );
  return command;
}

export function getSellNuggetTransactionCommandArray(
  nonce: number,
  index: number,
): BigUint64Array {
  const command = createCommand(
    BigInt(nonce),
    SELL_NUGGET,
    [BigInt(index)]
  );
  return command;
}

export function getBidNuggetTransactionCommandArray(
  nonce: number,
  index: number,
  amount: number,
): BigUint64Array {
  const command = createCommand(
    BigInt(nonce),
    BID_NUGGET,
    [BigInt(index), BigInt(amount)]
  );
  return command;
}

export function getCreateNuggetTransactionCommandArray(
  nonce: number,
): BigUint64Array {
  const command = createCommand(
    BigInt(nonce),
    CREATE_NUGGET,
    []
  );
  return command;
}

export function getRecycleNuggetTransactionCommandArray(
  nonce: number,
  index: number,
): BigUint64Array {
  const command = createCommand(
    BigInt(nonce),
    RECYCLE_NUGGET,
    [BigInt(index)]
  );
  return command;
}

export function getListNuggetTransactionCommandArray(
  nonce: number,
  index: number,
  amount: number,
): BigUint64Array {
  const command = createCommand(
    BigInt(nonce),
    LIST_NUGGET,
    [BigInt(index), BigInt(amount)]
  );
  return command;
}

export function getWithdrawTransactionCommandArray(
  nonce: number,
  amount: bigint,
  account: AccountSlice.L1AccountInfo
): BigUint64Array {
console.log("address", account)
const address = account!.address.slice(2);
  const command = createWithdrawCommand(
    BigInt(nonce),
    CMD_WITHDRAW,
    address,
    0n,
    amount
  );
  return command;
}
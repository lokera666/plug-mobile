import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { formatAssets } from '@/utils/assets';

import {
  DEFAULT_ASSETS,
  DEFAULT_TRANSACTION,
  mapTransaction,
  recursiveParseBigint,
  TRANSACTION_STATUS,
} from '../utils';

const DEFAULT_STATE = {
  assets: DEFAULT_ASSETS,
  assetsError: false,
  assetsLoading: false,
  contacts: [],
  transaction: DEFAULT_TRANSACTION,
  transactions: [],
  transactionsError: false,
  transactionsLoading: false,
  selectedNFT: {},
  collections: [],
  collectionsError: false,
  usingBiometrics: false,
  biometricsAvailable: false,
  scrollOnProfile: false,
  scrollOnNFTs: false,
};

export const sendToken = createAsyncThunk(
  'keyring/sendToken',
  async (params, { getState, dispatch }) => {
    try {
      const { to, amount, canisterId, opts, icpPrice } = params;
      const state = getState();
      const { height, transactionId } = await state.keyring.instance?.send(
        to,
        amount,
        canisterId,
        opts
      );
      if (transactionId || height) {
        dispatch(setAssetsLoading(true));
        dispatch(setTransactionsLoading(true));
        dispatch(getAssets({ refresh: true, icpPrice }));
        dispatch(getTransactions({ icpPrice }));
      }
      return {
        response: {
          height: parseInt(height?.toString?.(), 10),
          transactionId: parseInt(transactionId?.toString?.(), 10),
        },
        status: TRANSACTION_STATUS.success,
      };
    } catch (e) {
      console.log('sendToken', e);
      return {
        error: e.message,
        status: TRANSACTION_STATUS.error,
      };
    }
  }
);

export const burnXtc = createAsyncThunk(
  'keyring/burnXtc',
  async (params, { getState }) => {
    try {
      const state = getState();
      const response = await state.keyring.instance?.burnXTC(params);
      return {
        response: recursiveParseBigint(response),
        status: TRANSACTION_STATUS.success,
      };
    } catch (e) {
      console.log('burnXtc', e);
      return {
        error: e.message,
        status: TRANSACTION_STATUS.error,
      };
    }
  }
);

export const setAssetsAndTransactions = createAsyncThunk(
  'keyring/setAssetsAndTransactions',
  async (params, { dispatch }) => {
    const { transactions, assets } = params;
    dispatch(setAssetsAndLoading({ assets }));
    dispatch(setTransactions(transactions || []));
    dispatch(setTransactionsLoading(false));
  }
);

export const setAssetsAndLoading = createAsyncThunk(
  'keyring/setAssetsAndTransactions',
  async (params, { dispatch }) => {
    const { assets } = params;
    const formattedAssets = formatAssets(assets);
    dispatch(
      setAssets(formattedAssets?.length > 0 ? formattedAssets : DEFAULT_ASSETS)
    );
    dispatch(setAssetsLoading(false));
  }
);

export const getAssets = createAsyncThunk(
  'keyring/getAssets',
  async (params, { getState, dispatch }) => {
    console.log('private get assets');
    return privateGetAssets(params, getState(), dispatch);
  }
);

export const privateGetAssets = async (params, state, dispatch) => {
  try {
    dispatch(setAssetsError(false));
    const { refresh, icpPrice } = params;
    const { instance } = state.keyring;
    const response = await instance?.getState();
    const { wallets, currentWalletId } = response || {};
    let assets = wallets?.[currentWalletId]?.assets || [];
    if (
      !assets.length ||
      assets?.every(asset => parseFloat(asset.amount) <= 0) ||
      refresh
    ) {
      assets = await instance?.getBalance();
    } else {
      instance?.getBalance();
    }
    return { assets, icpPrice };
  } catch (e) {
    console.log('getAssets', e);
    dispatch(setAssetsError(true));
  }
};

export const getNFTs = createAsyncThunk(
  'keyring/getNFTs',
  async (params, { getState, dispatch }) => {
    return privateGetNFTs(params, getState(), dispatch);
  }
);

export const privateGetNFTs = async (refresh, state, dispatch) => {
  try {
    dispatch(setCollectionsError(false));
    const { instance } = state.keyring;
    const response = await instance?.getState();
    const { currentWalletId } = response || {};
    let collections = [];
    collections = await instance.getNFTs(currentWalletId, refresh);
    return (collections || [])?.map(collection =>
      recursiveParseBigint(collection)
    );
  } catch (e) {
    console.log('getNFTs', e);
    dispatch(setCollectionsError(true));
  }
};

export const getTransactions = createAsyncThunk(
  'keyring/getTransactions',
  async (params, { getState, dispatch }) => {
    return privateGetTransactions(params, getState(), dispatch);
  }
);

export const privateGetTransactions = async (params, state, dispatch) => {
  try {
    dispatch(setTransactionsError(false));
    const { icpPrice } = params;
    const response = await state.keyring.instance?.getTransactions();
    const parsedTrx =
      response?.transactions?.map(mapTransaction(icpPrice, state)) || [];

    dispatch(setTransactionsLoading(false));
    return parsedTrx;
  } catch (e) {
    console.log('getTransactions', e);
    dispatch(setTransactionsError(true));
    return {
      error: e.message,
    };
  }
};

export const transferNFT = createAsyncThunk(
  'keyring/transferNFT',
  async (params, { getState, dispatch }) => {
    try {
      const { to, nft, icpPrice } = params;

      const state = getState();
      const response = await state.keyring.instance?.transferNFT({
        to,
        token: nft,
      });
      if (response) {
        await privateGetNFTs(true, state, dispatch);
        dispatch(setTransactionsLoading(true));
        dispatch(getTransactions({ icpPrice }));
      }

      return {
        response: recursiveParseBigint(response),
        nft,
        status: TRANSACTION_STATUS.success,
      };
    } catch (e) {
      console.log('transferNFT', e);
      console.trace(e.stack);
      return {
        error: e.message,
        status: TRANSACTION_STATUS.error,
      };
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: DEFAULT_STATE,
  reducers: {
    setUsingBiometrics: (state, action) => {
      state.usingBiometrics = action.payload;
    },
    setBiometricsAvailable: (state, action) => {
      state.biometricsAvailable = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    addContact: (state, action) => {
      state.contacts.push(action.payload);
    },
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter(
        contact => contact.id !== action.payload.id
      );
    },
    setAssetsLoading: (state, action) => {
      state.assetsLoading = action.payload;
    },
    setAssets: (state, action) => {
      state.assets = action.payload;
    },
    setScrollOnProfile: (state, action) => {
      state.scrollOnProfile = action.payload;
    },
    setScrollOnNFTs: (state, action) => {
      state.scrollOnNFTs = action.payload;
    },
    setAssetsError: (state, action) => {
      state.assetsError = action.payload;
    },
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setTransactionsError: (state, action) => {
      state.transactionsError = action.payload;
    },
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
    setCollectionsError: (state, action) => {
      state.collectionsError = action.payload;
    },
    removeNFT: (state, action) => {
      const collections = state.collections.map(col => ({
        ...col,
        tokens: col.tokens.filter(token => token.id !== action.payload?.id),
      }));
      state.collections = collections.filter(col => col.tokens.length);
    },
    setTransactionsLoading: (state, action) => {
      state.transactionsLoading = action.payload;
    },
    resetUserState: state => {
      state = DEFAULT_STATE;
    },
  },
  extraReducers: {
    [sendToken.fulfilled]: (state, action) => {
      state.transaction = action.payload;
    },
    [burnXtc.fulfilled]: (state, action) => {
      state.transaction = action.payload;
    },
    [getAssets.fulfilled]: (state, action) => {
      const formattedAssets = formatAssets(action.payload || []);
      state.assets =
        formattedAssets?.length > 0 ? formattedAssets : DEFAULT_ASSETS;
      state.assetsLoading = false;
    },
    [getNFTs.fulfilled]: (state, action) => {
      state.collections = action.payload;
    },
    [getTransactions.fulfilled]: (state, action) => {
      if (!action.payload.error) {
        state.transactions = action.payload;
        state.transactionsLoading = false;
      }
    },
    [transferNFT.fulfilled]: (state, action) => {
      const { nft, status, error } = action.payload;

      if (!error) {
        const collections = state.collections.map(col => ({
          ...col,
          tokens: col.tokens.filter(token => token.id !== nft.id),
        }));
        state.collections = collections.filter(col => col.tokens.length);
        state.selectedNFT = {};
      }
      state.transaction = {
        status,
      };
    },
  },
});

export const {
  setScrollOnNFTs,
  setScrollOnProfile,
  setTransactionsError,
  setCollectionsError,
  setAssetsError,
  setUsingBiometrics,
  setBiometricsAvailable,
  setContacts,
  addContact,
  removeContact,
  setAssetsLoading,
  setAssets,
  setTransactions,
  setTransaction,
  setCollections,
  removeNFT,
  setTransactionsLoading,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;

// src/features/offers/offerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addOffer,
  getOffersByShop,
  deleteOffer,
  updateOffer,
  getAllOffers,
} from "../../api/offers";

/* =====================================================
   THUNKS
===================================================== */

export const fetchAllOffers = createAsyncThunk(
  "offers/fetchAllOffers",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllOffers();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch offers");
    }
  }
);

export const fetchOffers = createAsyncThunk(
  "offers/fetchOffers",
  async (shopId, { rejectWithValue }) => {
    try {
      return await getOffersByShop(shopId);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch shop offers");
    }
  }
);

export const createOffer = createAsyncThunk(
  "offers/createOffer",
  async (data, { rejectWithValue }) => {
    try {
      return await addOffer(data);
    } catch (err) {
      return rejectWithValue(err.message || "Offer creation failed");
    }
  }
);

export const removeOffer = createAsyncThunk(
  "offers/removeOffer",
  async (id, { rejectWithValue }) => {
    try {
      await deleteOffer(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Offer deletion failed");
    }
  }
);

export const editOffer = createAsyncThunk(
  "offers/editOffer",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateOffer(id, updates);
    } catch (err) {
      return rejectWithValue(err.message || "Offer update failed");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const slice = createSlice({
  name: "offers",

  initialState: {
    list: [],
    offersByShop: {},

    fetchStatus: "idle",
    createStatus: "idle",
    updateStatus: "idle",
    deleteStatus: "idle",

    error: null,
    editingOffer: null,
  },

  reducers: {
    setEditingOffer(state, action) {
      state.editingOffer = action.payload;
    },
    clearOfferError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH ALL ================= */
      .addCase(fetchAllOffers.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.fetchStatus = "idle";

        const offers = action.payload ?? [];
        state.list = offers;

        // rebuild grouping
        state.offersByShop = offers.reduce((acc, offer) => {
          if (!offer.shopId) return acc;

          if (!acc[offer.shopId]) {
            acc[offer.shopId] = [];
          }

          acc[offer.shopId].push(offer);
          return acc;
        }, {});
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })

      /* ================= FETCH BY SHOP ================= */
      .addCase(fetchOffers.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.fetchStatus = "idle";
        state.list = action.payload ?? [];
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createOffer.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.createStatus = "idle";

        const offer = action.payload;

        if (!state.list.some((o) => o.id === offer.id)) {
          state.list.unshift(offer);
        }

        if (offer.shopId) {
          if (!state.offersByShop[offer.shopId]) {
            state.offersByShop[offer.shopId] = [];
          }

          state.offersByShop[offer.shopId].unshift(offer);
        }
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(removeOffer.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(removeOffer.fulfilled, (state, action) => {
        state.deleteStatus = "idle";
        const id = action.payload;

        state.list = state.list.filter((o) => o.id !== id);

        Object.keys(state.offersByShop).forEach((shopId) => {
          state.offersByShop[shopId] =
            state.offersByShop[shopId].filter(
              (o) => o.id !== id
            );
        });
      })
      .addCase(removeOffer.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(editOffer.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(editOffer.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        const updated = action.payload;

        state.list = state.list.map((o) =>
          o.id === updated.id ? { ...o, ...updated } : o
        );

        Object.keys(state.offersByShop).forEach((shopId) => {
          state.offersByShop[shopId] =
            state.offersByShop[shopId].map((o) =>
              o.id === updated.id ? { ...o, ...updated } : o
            );
        });

        state.editingOffer = null;
      })
      .addCase(editOffer.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectAllOffers = (state) => state.offers.list;

export const selectOffersByShop =
  (shopId) => (state) =>
    state.offers.offersByShop[shopId] ?? [];

export const selectOfferFetchStatus = (state) =>
  state.offers.fetchStatus;

export const selectOfferCreateStatus = (state) =>
  state.offers.createStatus;

export const selectOfferUpdateStatus = (state) =>
  state.offers.updateStatus;

export const selectOfferDeleteStatus = (state) =>
  state.offers.deleteStatus;

export const selectOfferError = (state) =>
  state.offers.error;

/* =====================================================
   EXPORT
===================================================== */

export const { setEditingOffer, clearOfferError } =
  slice.actions;

export default slice.reducer;
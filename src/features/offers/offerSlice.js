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

/* ---------------- FETCH ALL OFFERS ---------------- */
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

/* ---------------- FETCH BY SHOP ---------------- */
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

/* ---------------- CREATE OFFER ---------------- */
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

/* ---------------- DELETE OFFER ---------------- */
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

/* ---------------- UPDATE OFFER ---------------- */
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
    status: "idle", // idle | loading | creating | updating | deleting | failed
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
    /* ================= FETCH ALL ================= */
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.status = "idle";
        const offers = action.payload || [];

        state.list = offers;

        // Rebuild grouped offers
        state.offersByShop = offers.reduce((acc, offer) => {
          if (!offer.shopId) return acc;
          if (!acc[offer.shopId]) acc[offer.shopId] = [];
          acc[offer.shopId].push(offer);
          return acc;
        }, {});
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= FETCH BY SHOP ================= */
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.status = "idle";
        state.list = action.payload || [];
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= CREATE ================= */
    builder
      .addCase(createOffer.pending, (state) => {
        state.status = "creating";
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.status = "idle";
        const offer = action.payload;

        // Prevent duplicates
        if (!state.list.find((o) => o.id === offer.id)) {
          state.list.unshift(offer);
        }

        if (offer.shopId) {
          if (!state.offersByShop[offer.shopId]) {
            state.offersByShop[offer.shopId] = [];
          }

          const exists = state.offersByShop[offer.shopId].find(
            (o) => o.id === offer.id
          );

          if (!exists) {
            state.offersByShop[offer.shopId].push(offer);
          }
        }
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= DELETE ================= */
    builder
      .addCase(removeOffer.pending, (state) => {
        state.status = "deleting";
      })
      .addCase(removeOffer.fulfilled, (state, action) => {
        state.status = "idle";
        const id = action.payload;

        state.list = state.list.filter((o) => o.id !== id);

        Object.keys(state.offersByShop).forEach((shopId) => {
          state.offersByShop[shopId] = state.offersByShop[shopId].filter(
            (o) => o.id !== id
          );
        });
      })
      .addCase(removeOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= UPDATE ================= */
    builder
      .addCase(editOffer.pending, (state) => {
        state.status = "updating";
      })
      .addCase(editOffer.fulfilled, (state, action) => {
        state.status = "idle";
        const updated = action.payload;

        state.list = state.list.map((o) =>
          o.id === updated.id ? { ...o, ...updated } : o
        );

        if (updated.shopId && state.offersByShop[updated.shopId]) {
          state.offersByShop[updated.shopId] =
            state.offersByShop[updated.shopId].map((o) =>
              o.id === updated.id ? { ...o, ...updated } : o
            );
        }

        state.editingOffer = null;
      })
      .addCase(editOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS (PRODUCTION READY)
===================================================== */

export const selectAllOffers = (state) => state.offers.list;

export const selectOffersByShop = (shopId) => (state) =>
  state.offers.offersByShop[shopId] || [];

export const selectOfferStatus = (state) => state.offers.status;

export const selectOfferError = (state) => state.offers.error;

/* =====================================================
   EXPORT
===================================================== */

export const { setEditingOffer, clearOfferError } = slice.actions;
export default slice.reducer;
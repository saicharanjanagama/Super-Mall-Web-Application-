// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, firestore } from "../../api/firebase";
import logger from "../../services/logger";
import { loadCart, syncCart } from "../cart/cartSlice";

/* =====================================================
   REGISTER USER
===================================================== */

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, profile = {}, role = "user" }, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = cred.user.uid;

      const userDoc = {
        email,
        role,
        profile,
        createdAt: serverTimestamp(),
        verified: false,
      };

      await setDoc(doc(firestore, "users", uid), userDoc);

      await sendEmailVerification(cred.user);

      return { uid, ...userDoc };
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

/* =====================================================
   LOGIN USER + CART MERGE
===================================================== */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { dispatch, getState, rejectWithValue }) => {
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const fbUser = cred.user;
      const uid = fbUser.uid;

      const ref = doc(firestore, "users", uid);
      let snap = await getDoc(ref);

      // If user doc missing → create fallback
      if (!snap.exists()) {
        const fallbackDoc = {
          email,
          role: "user",
          profile: { name: "" },
          createdAt: serverTimestamp(),
          verified: fbUser.emailVerified,
        };

        await setDoc(ref, fallbackDoc);
        snap = await getDoc(ref);
      }

      const userDoc = snap.data();

      /* ---------------- CART MERGE ---------------- */

      const cloudCart = await dispatch(loadCart(uid)).unwrap();
      const localCart = getState().cart.items;

      const mergedMap = {};

      [...cloudCart, ...localCart].forEach((item) => {
        if (!mergedMap[item.id]) {
          mergedMap[item.id] = { ...item };
        } else {
          mergedMap[item.id].qty =
            (mergedMap[item.id].qty || 1) +
            (item.qty || 1);
        }
      });

      const merged = Object.values(mergedMap);

      await dispatch(syncCart({ userId: uid, items: merged }));

      await logger.info("UserLoggedIn", { uid, email });

      return {
        uid,
        email,
        ...userDoc,
        verified: fbUser.emailVerified,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

/* =====================================================
   LOGOUT
===================================================== */

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    await signOut(auth);
    return true;
  }
);

/* =====================================================
   PASSWORD RESET
===================================================== */

export const sendPasswordReset = createAsyncThunk(
  "auth/sendPasswordReset",
  async ({ email }, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      return rejectWithValue(err.message || "Reset failed");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    registerStatus: "idle",
    loginStatus: "idle",
    resetStatus: "idle",
    error: null,
    initialized: false,
  },

  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.initialized = true;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* REGISTER */
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload;
      });

    /* LOGIN */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
      });

    /* LOGOUT */
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });

    /* RESET */
    builder
      .addCase(sendPasswordReset.pending, (state) => {
        state.resetStatus = "loading";
      })
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.resetStatus = "succeeded";
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.resetStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
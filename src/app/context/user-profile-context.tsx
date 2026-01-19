"use client";

import {
  createContext,
  useMemo,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

import { useRouter } from "next/navigation";
import { firebase } from "@/services/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFirebaseId, setFirebaseToken, setUserProfile } from "@/store/features/user_details/userDetailsSlice";
import { getUserDataByFireBase } from "@/dialogs/invoice_config/services";
import { cookies } from "next/headers";


/* ---------------- Types ---------------- */

interface LoginPayload {
  email: string;
  password: string;
}

interface UserProfile {
  _id: string;
  name?: string;
  email?: string;
}


interface UserProfileContextType {

  loading: boolean;
  login: (
    data: LoginPayload
  ) => Promise<any>;
  logout: () => Promise<void>;
}

/* ---------------- Context ---------------- */

const UserProfileContext =
  createContext<UserProfileContextType | null>(
    null
  );

/* ---------------- Hook ---------------- */

export const useUserProfileContext =
  (): UserProfileContextType => {
    const context =
      useContext(UserProfileContext);

    if (!context) {
      throw new Error(
        "useUserProfileContext must be used inside UserProfileProvider"
      );
    }

    return context;
  };

/* ---------------- Provider ---------------- */

export function UserProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const auth = getAuth(firebase);
  const router = useRouter();

  const dispatch  = useAppDispatch()
const {userProfile,
firebaseId,
firebaseToken} = useAppSelector((state) => state?.userDetails);
  
 
  const [loading, setLoading] =
    useState<boolean>(true);

  /* ---------------- API ---------------- */

  const getData = async (
    api: string,
    token: string
  ): Promise<UserProfile> => {
   
    
    return {} as UserProfile; // replace
  };

  const updateUser = async (
    payload: any,
    token: string,
    data: any
  ) => {
    console.log("token value is: ",token);
    
    return { success: true };
  };

  /* ---------------- Helpers ---------------- */

  async function getUser(
    firebaseUserId: string,
    token: string
  ) {
    return await getData(
      `user?firebaseId=${firebaseUserId}`,
      token
    );
  }

  async function setFetchedUser() {
    if (!firebaseToken || !firebaseId) return;

    try {
      const user =
        await getUserDataByFireBase(
          firebaseId,
          firebaseToken
        );
   console.log("fetched user: ",user);
      if (!user) return;
      dispatch(setUserProfile(user));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- Auth ---------------- */

  async function logout() {
    if (!firebaseToken) return;

    await updateUser(
      { userId: userProfile?._id },
      firebaseToken,
      { loggedIn: false }
    );

    await signOut(auth);

    dispatch(setFirebaseId(undefined));
    dispatch(setFirebaseToken(undefined));
    setUserProfile(null);

    router.replace("/login");
  }

  async function login(
    loginData: LoginPayload
  ) {
    try {
      await setPersistence(
        auth,
        browserLocalPersistence
      );

      const { email, password } =
        loginData;

      if (!email || !password) {
        return {
          success: false,
        };
      }

      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        console.log("result: ",result);
        

      const token =
        await result.user.getIdToken();
      await updateUser(
        { firebaseId: result.user.uid },
        token,
        { loggedIn: true }
      );
    

      const profile =
        await getUser(
          result.user.uid,
          token
        );

      dispatch(setFirebaseToken(token));
      dispatch(setUserProfile(profile));

      return {
        success: true,
        profile,
      };
    } catch (error: any) {
      return {
        success: false,
        code: error.code,
      };
    }
  }

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user: User | null) => {
          if (!user) {
            setLoading(false);
            return;
          }

          const token =
            await user.getIdToken();

          dispatch(setFirebaseId(user.uid));
          dispatch(setFirebaseToken(token));
        }
      );

    console.log("userProfile vl: ",userProfile);
    
      

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFetchedUser();
  }, [firebaseToken]);

  /* ---------------- Value ---------------- */

  const contextValue =
    useMemo<UserProfileContextType>(
      () => ({
        userProfile,
        setUserProfile,
        firebaseId,
        firebaseToken,
        loading,
        login,
        logout,
      }),
      [
        userProfile,
        firebaseId,
        firebaseToken,
        loading,
      ]
    );

    console.log("userProfile: ",userProfile);
    

  return (
    <UserProfileContext.Provider
      value={contextValue}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

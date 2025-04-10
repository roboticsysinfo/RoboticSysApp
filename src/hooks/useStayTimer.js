// hooks/useStayTimer.js
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { rewardDailyPoints } from "../redux/slices/redeemProductSlice";

const useStayTimer = (enabled) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!enabled) return; // ⛔ do nothing if user not logged in

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        dispatch(rewardDailyPoints());
      }, 5 * 60 * 1000); // 5 min
    };

    const stopTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        stopTimer();
      } else if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        startTimer();
      }

      appState.current = nextAppState;
    };

    AppState.addEventListener("change", handleAppStateChange);
    startTimer();

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
      stopTimer();
    };
  }, [dispatch, enabled]);
};


export default useStayTimer;

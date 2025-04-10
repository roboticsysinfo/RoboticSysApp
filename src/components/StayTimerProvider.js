// src/components/StayTimerProvider.js
import React from "react";
import useStayTimer from "../hooks/useStayTimer";
import { useSelector } from "react-redux";

const StayTimerProvider = () => {
  const farmer = useSelector((state) => state.auth.farmer);

  useStayTimer(!!farmer); // pass true only if farmer is logged in

  return null;
};

export default StayTimerProvider;

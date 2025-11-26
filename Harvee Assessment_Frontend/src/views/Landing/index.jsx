import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Welcome() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (token) {
      navigate("/profile");
    } else {
      navigate("/auth/signin");
    }
  }, [token, navigate]);

  return null;
}

export default Welcome;

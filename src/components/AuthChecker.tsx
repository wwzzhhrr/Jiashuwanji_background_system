import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime; // 是否还在有效期
};

const AuthChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.removeItem("token"); // 清除过期 Token
      navigate("/login"); // 跳转到登录页面
    }
  }, []);

  return null; // 组件不渲染 UI
};

export default AuthChecker;
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;

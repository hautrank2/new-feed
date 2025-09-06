type AuthLayoutProps = {
  children: any;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;

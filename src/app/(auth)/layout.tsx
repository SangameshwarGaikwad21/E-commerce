export default function AuthLayout({ children }:any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
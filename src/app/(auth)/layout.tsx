export default function AuthLayout({ children }:any) {
  return (
    <div className="bg-white">
      <div className="">
        {children}
      </div>
    </div>
  );
}
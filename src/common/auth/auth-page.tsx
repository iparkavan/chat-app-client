export const AuthPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2">
      <div className="hidden lg:block bg-[#18181b]">
        {/* Place your Image */}
      </div>
      {children}
    </div>
  );
};

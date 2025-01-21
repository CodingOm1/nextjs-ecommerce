
export const metadata = {
    title: "Create new Account - ShipBoy",
    description: "Get back to your ShipBoy account"
}


export default function LoginLayout({ children }) {
    return (
      <div className="bg-green-200 h-screen flex items-center justify-center">
        <div className="w-[460px] bg-white shadow-lg rounded-lg">
          <div className="flex  items-center justify-center py-3 border-b">
            <img src="/logo.png" className="w-24" alt="ShipBoy Logo" />
            <h2 className="text-3xl mt-3 font-[Norican] font-bold">
              Ship<span className="text-green-700">Boy</span>
            </h2>
          </div>
          <main className="p-4">{children}</main>
     
        </div>
      </div>
    );
  }
  
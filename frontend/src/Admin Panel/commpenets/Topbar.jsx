const Topbar = ({ title }) => (
  <div className="w-full h-16 bg-white shadow-md px-6 flex items-center justify-between">
    <h1 className="text-xl font-semibold">{title}</h1>
    <button
      onClick={() => {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }}
      className="text-red-600 hover:text-red-800"
    >
      Logout
    </button>
  </div>
);
export default Topbar;

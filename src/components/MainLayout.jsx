import Sidebar from "./Sidebar";

const MainLayout = ({ children, isSidebarVisible }) => {
  return (
    <div className="flex">
      {isSidebarVisible && <Sidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MainLayout;

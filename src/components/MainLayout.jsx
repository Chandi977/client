import Sidebar from "./Sidebar";

const MainLayout = ({ children, isSidebarVisible, onToggleSidebar }) => {
  return (
    <div className="flex flex-1 overflow-hidden relative">
      <Sidebar isOpen={isSidebarVisible} />
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggleSidebar}
        ></div>
      )}
      <main className="flex-1 overflow-y-auto z-10 w-full">{children}</main>
    </div>
  );
};

export default MainLayout;

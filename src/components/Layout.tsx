import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Settings, Youtube, LogOut, Video, Menu, X, Facebook } from 'lucide-react';
import { clsx } from 'clsx';
import { fbAccessToken, finalConnect, getYoutubeConsentUrl } from '../Common/Apis/ApiService';
import { useAlert } from '../Common/Toasts/AlertProvider';
import { useSuccess } from '../Common/Toasts/SuccessProvider';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm",
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100"
      )
    }
  >
    <Icon className="w-5 h-5" />
    {label}
  </NavLink>
);

const SidebarItemButton = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={
      clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm",
        "text-slate-600 hover:bg-slate-100"
      )
    }
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { alert } = useAlert()
  const { success } = useSuccess()
  const [loading, setLoading] = useState(false);

  const responseFacebook = async (response) => {
    try {
      if (!response.accessToken) {
        alert("Facebook login cancelled");
        return;
      }

      setLoading(true);

      const fbUserToken = response.accessToken;

      // 🔁 Your backend call (same as RN)
      const fbResponse = await fbAccessToken({
        short_token: fbUserToken,
      });

      if (fbResponse.status) {
        const res = await finalConnect({
          long_live_token: fbResponse.data.access_token,
        });

        if (res.status) {
          success("Facebook Account Connected!");
        } else {
          alert(res.message);
        }
      } else {
        alert(fbResponse.message);
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const connectYoutube = async () => {

    const res = await getYoutubeConsentUrl();

    if (res.status) {

      const popup = window.open(
        res.data.url,
        "youtube-consent",
        "width=500,height=600"
      );

      console.log(popup, 'popuppopup--popup')

      // Listen when popup closes
      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer);
          success("YouTube connected successfully");
        }
      }, 1000);
    } else {
      alert("Failed to connect YouTube");
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-40 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            TubeFlow
          </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 p-1 hover:bg-slate-100 rounded-md">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 md:h-auto p-4 md:p-6 border-b border-slate-100 flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              TubeFlow
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-500 hover:bg-slate-100 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-4">
            Menu
          </div>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/token-expiry" icon={LayoutDashboard} label="Token Expiry" />
          <SidebarItem to="/scheduled-videos" icon={LayoutDashboard} label="Scheduled Videos" />
          <SidebarItem to="/upload" icon={UploadCloud} label="Upload Video" />

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-8">
            System
          </div>
          <SidebarItemButton onClick={connectYoutube} icon={Youtube} label="Connect Youtube" />

          <FacebookLogin
            appId="1170807994760016"
            autoLoad={false}
            fields="name,email,picture"
            scope="
          public_profile,
          email,
          pages_show_list,
          pages_manage_posts,
          pages_read_engagement,
          instagram_basic,
          instagram_content_publish,
          business_management
        "
            callback={responseFacebook}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={loading}
              // style={{ backgroundColor: "#3b5998", color: "white" }}
              >
                <SidebarItemButton  icon={Facebook} label="Connect Facebook" />
                {/* {loading ? "Connecting..." : "Connect Facebook"} */}
              </button>
            )}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative w-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
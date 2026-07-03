import Profile from "@/assets/images/profile.jpeg";
import Logo from "@/assets/images/hero.png";
import { PiCaretUpDown, PiSidebar } from "react-icons/pi";

export function SidebarHeader() {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between border-b border-muted-foreground/25 pb-4">
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Web Logo" className="size-10" />
          <span className="font-semibold">EmploManage</span>
        </div>
        <PiSidebar size={20} className="text-muted-foreground cursor-pointer" />
      </div>
      <div className="flex items-center justify-between bg-muted-foreground/10 p-2 mt-4 rounded-xl hover:bg-muted/60 active:bg-muted transition-all duration-200 cursor-pointer group select-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={Profile}
              alt="Profile"
              className="size-9 rounded-full object-cover ring-2 ring-muted/20 group-hover:scale-102 transition-transform duration-200"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold tracking-tight truncate leading-tight">
              Nayla Qanita Alifia
            </h4>
            <span className="block text-[11px] text-muted-foreground truncate mt-0.5">
              nylqnt@gmail.com
            </span>
          </div>
        </div>
        <PiCaretUpDown className="text-muted-foreground/60 size-4 flex-shrink-0 ml-2" />
      </div>
    </div>
  );
}

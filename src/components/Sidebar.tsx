import { siteConfig } from "@/config/site";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { NavIcon, TIconsAvailable } from "./ui/Icons";
import { cn } from "@/lib/utils";

import { ProfileBtn } from "./ui";
import { ID } from "appwrite";

export default function Sidebar() {
  return (
    <aside className="py-10 h-[calc(100vh-4rem)]  border-r hidden  md:sticky md:block  left-0 bottom-0 top-16 ">
      <div className="flex flex-col justify-between h-full -mr-2 pr-6">
        <nav className="flex flex-col gap-3 ">
          {siteConfig.mainNav.map(({ href, title, iconKey }, i) => (
            <Link key={i} className="" href={href}>
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "flex justify-start w-52  items-center hover:text-cyan-500 gap-3"
                )}
              >
                <NavIcon
                  classNames="h-5 w-5 hover:outline-blue-600"
                  iconKey={iconKey as TIconsAvailable}
                />
                <span className="">{title}</span>
              </div>
            </Link>
          ))}
        </nav>
        <ProfileBtn  className="h-11  w-52 "/>
      </div>
    </aside>
  );
}

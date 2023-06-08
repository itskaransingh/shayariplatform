import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "./ui/Button";
import { Icons } from "./ui/Icons";
import { ThemeToggle } from "./theme/ThemeToggle";
import { ProfileBtn } from "./ui";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container xl:px-1 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className=" items-center space-x-2 flex">
          <Icons.logo className="h-6 w-6" />
          <span className="  font-bold inline-block">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-block"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle hideOnSmallScreens  />
            <ProfileBtn inHeader/>
          </nav>
        </div>
      </div>
    </header>
  );
}

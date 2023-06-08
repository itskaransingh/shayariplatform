

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
      iconKey: "home",
    },
    {
      title: "Explore",
      href: "/explore",
      iconKey: "hashtag",
    },
    {
      title :"Library",
      href: "/library",
      iconKey: "library",
    },
    {
      title: "Create",
      href: `/posts/create`,
      iconKey: "plusCircle",
    }
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
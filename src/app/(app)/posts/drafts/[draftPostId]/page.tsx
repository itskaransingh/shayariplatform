import { PostForm } from "@/components/posts";
import { Separator } from "@/components/ui";

export default function DraftPost() {
     return (
        <div className="flex flex-col gap-6 h-full w-full items-start">
        <h1 className="text-3xl font-semibold text-start tracking-tight ">
          {" "}
          New Post
        </h1>
        <Separator />
        <PostForm />
      </div>
     )
}
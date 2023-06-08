import PostCard from "@/components/posts/PostCard";
import appwriteApi from "@/lib/appwrite"

export default async function Home() {
  let posts;
  try{
    posts= await appwriteApi.getPosts()
    console.log(posts)
  } catch(e){
    console.log(e)
  }

  return (
    <>
    <div className="flex flex-col gap-5">
      {
        posts?.documents.map((post)=>(
           <PostCard key={post.$id} post={post}/>
        ))
      }
    </div>
    </>
  )
}

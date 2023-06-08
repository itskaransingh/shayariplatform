import { PostEditor } from "@/components/posts";
import appwriteApi from "@/lib/appwrite";

export default async function DraftPost({params}:{
   params: {draftPostId: string}
}) {
  const { draftPostId } = params

  let post ;
  try{
    post = await appwriteApi.getPost(draftPostId)
  } catch(error){
    console.log({error});
    post = null;
  }
    
  if(!post) {
    return <div>Post not found</div>
  }

  return <PostEditor  post={{
     content: post.content,
     title: post.title,
     type: post.type,
     published: post.published
  }}/>;
}

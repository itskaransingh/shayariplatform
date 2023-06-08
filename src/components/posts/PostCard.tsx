import edjsParser from "editorjs-parser";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Models } from "appwrite";

type Props = {
  post: Models.Document
};

const PostCard =  ({ post }: Props) => {
  const title = post.title
  const content = JSON.parse(post.content);
  const parser = new edjsParser();

  const html = parser.parse(content);

  console.log(html);
  return( 
  <Card className="w-[500px]">
  <CardHeader>
    <CardTitle>{title}</CardTitle>
   </CardHeader> 
  <CardContent className="" dangerouslySetInnerHTML={{__html:html}}/>
  </Card>
  )
};

export default PostCard;

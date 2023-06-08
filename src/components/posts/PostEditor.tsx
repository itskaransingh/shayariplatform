"use client";

import { postTypes } from "@/config/constants";
import { PostFormSchema, TPostFormSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "../ui";
import { Button } from "../ui/Button";
import TextareaAutosize from "react-textarea-autosize";
import EditorJS from "@editorjs/editorjs";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup";
import { useCallback, useRef, useState, useEffect } from "react";
import {  useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import appwriteApi from "@/lib/appwrite";
import { toastErrorHandler } from "@/lib/errorHandling";
import { useGlobalContext } from "@/contexts/GlobalContext";

interface EditorProps {
  post?: {
    content: string;
    title: string;
    type: typeof postTypes;
    published: boolean;
  };
}

export default function PostEditor({ post }: EditorProps) {
  const ref = useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [contentError, setContentError] = useState(false);

  const form = useForm<TPostFormSchema>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: post?.title || "",
      type: post?.type as  any,
    }
  });

const {account} = useGlobalContext()  

  // console.log(form.watch(""));

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    // const Quote = (await import("@editorjs/quote")).default;
    // const Underline = (await import("@editorjs/underline")).default;

    const body = post || { content: "" };

    let content;

    try {
      content = JSON.parse(body.content);
    } catch (error) {
      content = body.content;
    }

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },

        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: content,
        tools: {
          header: Header,
        },
      });
      console.log({ editor, ref });
    }
  }, [post]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const onSubmit = async (data: TPostFormSchema) => {
    setIsSaving(true);

    const blocks = await ref.current?.save();

    if (!blocks || blocks.blocks.length < 2) {
      setContentError(true);
      return toast({
        description: "Your content must have at least 2 lines.",
      });
    }

    console.log(blocks);

    const contentInString = JSON.stringify(blocks);

    console.log({ content: contentInString, ogcontent: blocks, ...data });

    if(!account?.$id){
     return router.replace("/login")
    }

    let createdPost;

    try {
      createdPost = await appwriteApi.createPost({
        content: contentInString,
        ...data,
        
        userId: account?.$id as string,
      });

      console.log({ createdPost });

      setIsSaving(false);

      router.refresh();

      return toast({
        description: "Your post has been saved.",
      });
    } catch (error) {
      console.log({ error });
      toastErrorHandler(error);
      return setIsSaving(false);
    }
  };

  useEffect(() => {
    if (contentError) {
      setTimeout(() => setContentError(false), 5000);
    }
  }, [contentError]);

  return (
    // <div className="">
    <Form {...form}>
      <form
        action=""
        className="flex flex-col  gap-6 h-full w-full items-start"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className=" flex items-center w-full justify-between">
          <h1 className="text-3xl font-semibold text-start tracking-tight ">
            {" "}
            New Post
          </h1>
          <div className="flex space-x-3 ">
            <Button type="submit" variant={"outline"}>
              Save To Draft
            </Button>
            <Button type="submit">Publish</Button>
          </div>
        </div>
        <Separator />
        <div className=" w-full space-y-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className=" flex-grow space-y-1">
                <FormLabel>What you are writing</FormLabel>
                <FormDescription>
                  This will help us to categorize your posts
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap    gap-5 pt-2"
                >
                  {postTypes.map((postType, i) => (
                    <FormItem key={i}>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem
                            value={postType}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="text-center p-2 capitalize rounded-md border-2 border-muted  cursor-pointer  hover:border-accent">
                          {postType}
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="  ">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <TextareaAutosize
                    autoFocus
                    id="title"
                    {...field}
                    placeholder="Post title"
                    className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className={contentError ? "text-destructive" : ""}>
            <FormLabel>Content</FormLabel>
            <FormDescription>
              <p className="text-sm text-gray-500">
                Use{" "}
                <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                  Tab
                </kbd>{" "}
                to open the command menu.
              </p>
            </FormDescription>

            <div className="grid w-full md:border-x py-4">
              <div className="prose prose-stone  mx-auto w-full dark:prose-invert">
                <div id="editor" className="min-h-[200px]" />
              </div>
            </div>
          </FormItem>
        </div>
      </form>
    </Form>
    // </div>
  );
}

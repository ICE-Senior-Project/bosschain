"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Banner } from "@/components/banner";
import ReactJson from "react-json-view";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRoleContext } from "@/context/roleContext";
import { SupabaseResponse } from "@/models/requestModels";
import { BucketService } from "@/lib/supabase/BucketRequests";
import Form, { FormProps } from "react-bootstrap/Form";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import VideoForm from "./_components/video-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Trash } from "lucide-react";

const LessonIdPage = () => {
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [lesson, setLesson] = useState<SupabaseResponse<Array<any>>>();
  const [token, setToken] = useState<string>("");
  const [imageUrlList, setImageUrlList] = useState<Array<String>>([]);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image

  useEffect(() => {
    const initializePage = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "supabase" });
          setToken(token || "");
          const lessonId = window.location.pathname.split("/").pop() || "";
          const lessonData = await EnrollmentService.getLessonById({
            userId,
            lessonId,
            token,
          });
          setLesson(lessonData);
          console.log(lessonData.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
        setIsLoading(false);
      }
    };
    initializePage();
  }, [isSignedIn, user]);

  const lessonId = window.location.pathname.split("/").pop() || "";
  const pathParts = window.location.pathname.split("/");
  const courseIdIndex = pathParts.indexOf("courses") + 1;
  const courseId = pathParts[courseIdIndex];

  const modulePathParts = window.location.pathname.split("/");
  const moduleIndex = modulePathParts.indexOf("modules");
  const moduleId = modulePathParts[moduleIndex + 1];

  // Callback function to handle title update

  const handleTitleUpdate = (updatedTitle: string) => {
    setLesson((prevLesson: SupabaseResponse<any[]> | undefined) => ({
      ...prevLesson!,
      data: [{ ...(prevLesson?.data?.[0] ?? {}), title: updatedTitle }],
    }));
  };

  const handleDescriptionUpdate = (updatedDescription: string) => {
    setLesson((prevLesson: SupabaseResponse<any[]> | undefined) => ({
      ...prevLesson!,
      data: [
        { ...(prevLesson?.data?.[0] ?? {}), description: updatedDescription },
      ],
    }));
  };

  const onPublishUpdate = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const newPublishStatus = !lesson?.data?.[0]?.is_published; // Invert the current publish status

      const data = await EnrollmentService.updateLessonPublishStatus({
        lessonId: Number(lessonId),
        userId,
        is_published: newPublishStatus,
        token,
      });

      if (data.error) {
        console.error(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log(
          "Lesson is now",
          newPublishStatus ? "published" : "unpublished",
        );
        toast.success(
          `Lesson is now ${newPublishStatus ? "published" : "unpublished"}`,
        );
        const lessonData = await EnrollmentService.getLessonById({
          userId,
          lessonId,
          token,
        });
        setLesson(lessonData);
      }
    } catch (error) {
      console.error("[updateLessonPublishStatus ERROR]: ", error);
      toast.error("Something went wrong while updating the publish status");
    }
  };

  const onDeleteLesson = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = await EnrollmentService.deleteLesson({
        lessonId: Number(lessonId),
        userId,
        token,
      });

      if (data.error) {
        console.error(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Lesson is now deleted");
        toast.success("Lesson is now deleted");
        window.location.href = `/teacher/courses/${courseId}/modules/${moduleId}`;
      }
    } catch (error) {
      console.error("[deleteLesson ERROR]: ", error);
      toast.error("Something went wrong while deleting the lesson");
    }
  };

  if (isLoading) {
    // Render skeleton loading UI while data is being fetched
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-screen-md p-8 bg-white rounded shadow-md">
          {/* Main content area */}
          <div className="animate-pulse">
            {/* Placeholder for main content */}
            <div className="h-12 mb-6 bg-gray-200 rounded"></div>
            <div className="h-8 mb-4 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!lesson?.data?.[0]?.is_published && (
        <Banner label="This lesson is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6 mt-6 flex flex-col md:flex-row">
        {" "}
        {/* Add mt-6 and flex classes */}
        <div className="md:w-1/2 md:pr-6">
          {" "}
          {/* Adjust width and padding for medium screens */}
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your lesson</h2>
            <Button
              onClick={onPublishUpdate}
              disabled={false}
              variant="outline"
              size="sm"
            >
              {lesson?.data?.[0]?.is_published ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDeleteLesson}>
              <Button size="sm" disabled={false}>
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmModal>
          </div>
          <TitleForm
            initialData={{ title: lesson?.data?.[0]?.title || "" }}
            lessonId={lessonId || ""}
            token={token}
            userId={userId}
            onTitleUpdate={handleTitleUpdate} // Pass the callback function
          />
          <DescriptionForm
            initialData={{
              description: lesson?.data?.[0]?.description || "",
            }}
            lessonId={lessonId || ""}
            token={token}
            userId={userId}
            onDescriptionUpdate={handleDescriptionUpdate} // Pass the callback function
          />
          <VideoForm userId={userId} courseId={courseId} />
        </div>
      </div>
    </div>
  );
};

export default LessonIdPage;

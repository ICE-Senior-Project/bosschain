import { supabaseClient } from "./supabaseClient";
import {
  UserAuth,
  SupabaseResponse,
  FullCourseDetail,
  EnrollCourseRequest,
  CreateModuleRequest,
  CreateLessonRequest,
} from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

// get courses enrolled by a particular user
const getCourse = async ({
  userId,
  token,
}: UserAuth): Promise<
  SupabaseResponse<Array<Database["public"]["Tables"]["course"]["Row"] | null>>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("enrollment")
    .select(`course (*)`)
    .eq("user_id", userId);
  if (error) {
    console.log("[getCourese ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data.map((entry) => entry.course),
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

// get courses enrolled by a particular user joined with module and lesson
const getFullCourse = async ({
  userId,
  token,
}: UserAuth): Promise<SupabaseResponse<Array<FullCourseDetail | null>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("enrollment")
    .select(`course (*, module (*, lesson(*)))`)
    .eq("user_id", userId);
  if (error) {
    console.log("[getFullCourese ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data.map((entry) => entry.course),
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const enrollByCourseId = async ({
  userId,
  token,
  courseId,
}: EnrollCourseRequest): Promise<
  SupabaseResponse<Array<Database["public"]["Tables"]["enrollment"]["Row"]>>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("enrollment")
    .insert({ user_id: userId, course_id: courseId })
    .select();
  if (error) {
    console.log("[enrollByCourseId ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getCourseById = async ({
  userId,
  courseId,
  token,
}: UserAuth & { courseId: string }): Promise<
  SupabaseResponse<
    Array<{
      course_id: number;
      created_at: string;
      description: string | null;
      instructor_id: string | null;
      title: string | null;
      is_published: boolean | null;
    } | null>
  >
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("course")
    .select(`*`)
    .eq("instructor_id", userId)
    .eq("course_id", courseId);
  if (error) {
    console.log("[getCourseById ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getModuleById = async ({
  userId,
  moduleId,
  token,
}: UserAuth & { moduleId: string }): Promise<SupabaseResponse<Array<any>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("module")
    .select(`*`)
    .eq("module_id", moduleId);
  if (error) {
    console.log("[getModuleById ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getLessonById = async ({
  userId,
  lessonId,
  token,
}: UserAuth & { lessonId: string }): Promise<SupabaseResponse<Array<any>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("lesson")
    .select(`*`)
    .eq("lesson_id", lessonId);
  if (error) {
    console.log("[getLessonById ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getModuleByCourseId = async ({
  userId,
  courseId,
  token,
}: UserAuth & { courseId: string }): Promise<SupabaseResponse<Array<any>>> => {
  console.log(token);
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("module")
    .select(`*`)
    .eq("course_id", courseId);
  if (error) {
    console.log("[getModuleByCourseId ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getLessonByModuleId = async ({
  userId,
  moduleId,
  token,
}: UserAuth & { moduleId: string }): Promise<SupabaseResponse<Array<any>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("lesson")
    .select(`*`)
    .eq("module_id", moduleId);
  if (error) {
    console.log("[getLessonByModuleId ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getAllTeacherCourse = async ({
  userId,
  token,
}: UserAuth): Promise<
  SupabaseResponse<
    Array<{
      course_id: number;
      created_at: string;
      description: string | null;
      instructor_id: string | null;
      title: string | null;
      is_published: boolean | null;
    } | null>
  >
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("course")
    .select(`*`)
    .eq("instructor_id", userId);
  if (error) {
    console.log("[getAllTeacherCourse ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const updateCourseTitle = async ({
  courseId,
  title,
  token,
  userId, // Add userId to the function parameters
}: {
  courseId: number;
  title: string;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ title }) // Update the title
    .eq("course_id", courseId) // Match the course ID
    .eq("instructor_id", userId) // Ensure the course belongs to the user
    .single(); // Only update a single row

  if (courseError) {
    console.log("[updateCourseTitle ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }

  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

const updateModuleTitle = async ({
  moduleId,
  title,
  token,
  userId, // Add userId to the function parameters
}: {
  moduleId: number;
  title: string;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: moduleData,
    error: moduleError,
    status: moduleStatus,
    statusText: moduleStatusText,
  } = await supabase
    .from("module")
    .update({ title }) // Update the title
    .eq("module_id", moduleId) // Match the course ID
    .single(); // Only update a single row

  if (moduleError) {
    console.log("[updateCourseTitle ERROR]: ", moduleError);
    return {
      data: null,
      statusCode: moduleStatus,
      statusMessage: moduleStatusText,
      error: moduleError.message,
    };
  }

  return {
    data: moduleData,
    statusCode: moduleStatus,
    statusMessage: moduleStatusText,
    error: null,
  };
};

const updateLessonTitle = async ({
  lessonId,
  title,
  token,
  userId, // Add userId to the function parameters
}: {
  lessonId: number;
  title: string;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: lessonData,
    error: lessonError,
    status: lessonStatus,
    statusText: lessonStatusText,
  } = await supabase
    .from("lesson")
    .update({ title }) // Update the title
    .eq("lesson_id", lessonId) // Match the course ID
    .single(); // Only update a single row

  if (lessonError) {
    console.log("[updateLessonTitle ERROR]: ", lessonError);
    return {
      data: null,
      statusCode: lessonStatus,
      statusMessage: lessonStatusText,
      error: lessonError.message,
    };
  }

  return {
    data: lessonData,
    statusCode: lessonStatus,
    statusMessage: lessonStatusText,
    error: null,
  };
};

const updateCourseDescription = async ({
  courseId,
  description,
  token,
  userId,
}: {
  courseId: number;
  description: string;
  token: string;
  userId: string;
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ description }) // Update the description
    .eq("course_id", courseId)
    .eq("instructor_id", userId)
    .single();

  if (courseError) {
    console.log("[updateCourseDescription ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }

  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

const updateModuleDescription = async ({
  moduleId,
  description,
  token,
  userId,
}: {
  moduleId: number;
  description: string;
  token: string;
  userId: string;
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: moduleData,
    error: moduleError,
    status: moduleStatus,
    statusText: moduleStatusText,
  } = await supabase
    .from("module")
    .update({ description }) // Update the description
    .eq("module_id", moduleId)
    .single();

  if (moduleError) {
    console.log("[updateCourseDescription ERROR]: ", moduleError);
    return {
      data: null,
      statusCode: moduleStatus,
      statusMessage: moduleStatusText,
      error: moduleError.message,
    };
  }

  return {
    data: moduleData,
    statusCode: moduleStatus,
    statusMessage: moduleStatusText,
    error: null,
  };
};

const updateLessonDescription = async ({
  lessonId,
  description,
  token,
  userId,
}: {
  lessonId: number;
  description: string;
  token: string;
  userId: string;
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: lessonData,
    error: lessonError,
    status: lessonStatus,
    statusText: lessonStatusText,
  } = await supabase
    .from("lesson")
    .update({ description }) // Update the description
    .eq("lesson_id", lessonId)
    .single();

  if (lessonError) {
    console.log("[updateLessonDescription ERROR]: ", lessonError);
    return {
      data: null,
      statusCode: lessonStatus,
      statusMessage: lessonStatusText,
      error: lessonError.message,
    };
  }

  return {
    data: lessonData,
    statusCode: lessonStatus,
    statusMessage: lessonStatusText,
    error: null,
  };
};

const updateCourseCategory = async ({
  courseId,
  category,
  token,
  userId,
}: {
  courseId: number;
  category: string;
  token: string;
  userId: string;
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ category }) // Update the category
    .eq("course_id", courseId)
    .eq("instructor_id", userId)
    .single();

  if (courseError) {
    console.log("[updateCourseCategory ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }

  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

const createModule = async ({
  userId,
  token,
  title,
  description,
  courseId,
}: CreateModuleRequest): Promise<SupabaseResponse<Array<any>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("module")
    .insert({
      title,
      description: description,
      course_id: courseId,
    })
    .select();
  if (error) {
    console.log("[createModule ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const createLesson = async ({
  userId,
  token,
  title,
  description,
  moduleId,
}: CreateLessonRequest): Promise<SupabaseResponse<Array<any>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("lesson")
    .insert({
      title,
      description: description,
      module_id: moduleId,
    })
    .select();
  if (error) {
    console.log("[createLesson ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const updateCoursePublishStatus = async ({
  courseId,
  is_published,
  token,
  userId, // Add userId to the function parameters
}: {
  courseId: number;
  is_published: boolean;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ is_published })
    .eq("course_id", courseId) // Match the course ID
    .eq("instructor_id", userId) // Ensure the course belongs to the user
    .single(); // Only update a single row

  if (courseError) {
    console.log("[updateCoursePublishStatus ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }
  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

const updateModulePublishStatus = async ({
  moduleId,
  is_published,
  token,
  userId, // Add userId to the function parameters
}: {
  moduleId: number;
  is_published: boolean;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: moduleData,
    error: moduleError,
    status: moduleStatus,
    statusText: moduleStatusText,
  } = await supabase
    .from("module")
    .update({ is_published }) // Update the title
    .eq("module_id", moduleId) // Match the course ID
    .single(); // Only update a single row

  if (moduleError) {
    console.log("[updateModulePublishStatus ERROR]: ", moduleError);
    return {
      data: null,
      statusCode: moduleStatus,
      statusMessage: moduleStatusText,
      error: moduleError.message,
    };
  }
  return {
    data: moduleData,
    statusCode: moduleStatus,
    statusMessage: moduleStatusText,
    error: null,
  };
};

const updateLessonPublishStatus = async ({
  lessonId,
  is_published,
  token,
  userId, // Add userId to the function parameters
}: {
  lessonId: number;
  is_published: boolean;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: lessonData,
    error: lessonError,
    status: lessonStatus,
    statusText: lessonStatusText,
  } = await supabase
    .from("lesson")
    .update({ is_published }) // Update the title
    .eq("lesson_id", lessonId) // Match the course ID
    .single(); // Only update a single row

  if (lessonError) {
    console.log("[updateLessonPublishStatus ERROR]: ", lessonError);
    return {
      data: null,
      statusCode: lessonStatus,
      statusMessage: lessonStatusText,
      error: lessonError.message,
    };
  }
  return {
    data: lessonData,
    statusCode: lessonStatus,
    statusMessage: lessonStatusText,
    error: null,
  };
};

const deleteCourse = async ({
  courseId,
  token,
  userId, // Add userId to the function parameters
}: {
  courseId: number;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };

  const supabase = await supabaseClient(token);
  const {
    data: deleteCourseData,
    error: deleteCourseError,
    status: deleteCourseStatus,
    statusText: deleteCourseStatusText,
  } = await supabase.from("course").delete().eq("course_id", courseId); // Match the course ID

  if (deleteCourseError) {
    console.log("[deleteCourse ERROR]: ", deleteCourseError);
    return {
      data: null,
      statusCode: deleteCourseStatus,
      statusMessage: deleteCourseStatusText,
      error: deleteCourseError.message,
    };
  }
  return {
    data: deleteCourseData,
    statusCode: deleteCourseStatus,
    statusMessage: deleteCourseStatusText,
    error: null,
  };
};

const deleteModule = async ({
  moduleId,
  token,
  userId, // Add userId to the function parameters
}: {
  moduleId: number;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };

  const supabase = await supabaseClient(token);
  const {
    data: deleteModuleData,
    error: deleteModuleError,
    status: deleteModuleStatus,
    statusText: deleteModuleStatusText,
  } = await supabase.from("module").delete().eq("module_id", moduleId); // Match the course ID

  if (deleteModuleError) {
    console.log("[deleteModule ERROR]: ", deleteModuleError);
    return {
      data: null,
      statusCode: deleteModuleStatus,
      statusMessage: deleteModuleStatusText,
      error: deleteModuleError.message,
    };
  }
  return {
    data: deleteModuleData,
    statusCode: deleteModuleStatus,
    statusMessage: deleteModuleStatusText,
    error: null,
  };
};

const deleteLesson = async ({
  lessonId,
  token,
  userId, // Add userId to the function parameters
}: {
  lessonId: number;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };

  const supabase = await supabaseClient(token);
  const {
    data: deleteLessonData,
    error: deleteLessonError,
    status: deleteLessonStatus,
    statusText: deleteLessonStatusText,
  } = await supabase.from("lesson").delete().eq("lesson_id", lessonId); // Match the course ID

  if (deleteLessonError) {
    console.log("[deleteLesson ERROR]: ", deleteLessonError);
    return {
      data: null,
      statusCode: deleteLessonStatus,
      statusMessage: deleteLessonStatusText,
      error: deleteLessonError.message,
    };
  }
  return {
    data: deleteLessonData,
    statusCode: deleteLessonStatus,
    statusMessage: deleteLessonStatusText,
    error: null,
  };
};

const updateCourseLastUpdateAt = async ({
  courseId,
  last_updated_at,
  token,
  userId, // Add userId to the function parameters
}: {
  courseId: number;
  last_updated_at: string;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<any> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ last_updated_at }) // Update the title
    .eq("course_id", courseId) // Match the course ID
    .eq("instructor_id", userId) // Ensure the course belongs to the user
    .single(); // Only update a single row

  if (courseError) {
    console.log("[updateCourseLastUpdateAt ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }
  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

export const EnrollmentService = {
  getCourse,
  getFullCourse,
  enrollByCourseId,
  getCourseById,
  getModuleByCourseId,
  getAllTeacherCourse,
  updateCourseTitle,
  updateCourseDescription,
  updateCourseCategory,
  createModule,
  getModuleById,
  updateModuleTitle,
  updateModuleDescription,
  getLessonByModuleId,
  createLesson,
  updateLessonTitle,
  updateLessonDescription,
  getLessonById,
  updateCoursePublishStatus,
  updateModulePublishStatus,
  updateLessonPublishStatus,
  deleteCourse,
  deleteModule,
  deleteLesson,
  updateCourseLastUpdateAt,
};

import { apiRequest } from "../config/api.js";

// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await apiRequest("/courses", {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get course details by ID
export const getCourseById = async (courseId) => {
  try {
    const response = await apiRequest(`/courses/${courseId}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const response = await apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Enroll in courses
export const enrollInCourses = async (courseCodes) => {
  try {
    const response = await apiRequest("/courses/enroll", {
      method: "POST",
      body: JSON.stringify({ course_codes: courseCodes }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user's enrolled courses
export const getMyCourses = async () => {
  try {
    const response = await apiRequest("/courses/my-courses", {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

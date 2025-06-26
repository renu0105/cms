import axios from "axios";

interface Project {
  // Define the properties of a project, for example:
  id?: number | string;
  title: string;
  description?: string;
  adminId?: number | string;
  techStacks?: string[];
  createdAt?: string;
  img?: string; // Added to match usage in updateProject
  // Add other fields as needed
  url?: String;
  color?: String;
}

export const getProject = async () => {
  try {
    const res = await axios.get("/api/projects");

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "failed to fetch projects",
      };
    }
  }
  return { error: "failed to fetch projects" };
};

export const getProjectById = async (id: number | string) => {
  try {
    const res = await axios.get(`/api/projects?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch book",
      };
    }
    return { error: "Failed to fetch book" };
  }
};

export const addProject = async (project: Project) => {
  try {
    const res = await axios.post("/api/projects", { project });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add book",
      };
    }
    return { error: "Failed to add book" };
  }
};

export const updateProject = async (project: Project) => {
  try {
    const res = await axios.put(`/api/projects?id=${project.id}`, {
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.img, // or project.image, depending on your frontend
      url: project.url,
      color: project.color,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update book",
      };
    }
    return { error: "Failed to update book" };
  }
};

export const deleteProject = async (id: number | string) => {
  try {
    const res = await axios.delete(`/api/projects?id=${id}`, {
      method: "DELETE",
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete book",
      };
    }
    return { error: "Failed to delete book" };
  }
};

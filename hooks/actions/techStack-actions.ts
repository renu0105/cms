import axios from "axios";

interface TechStack {
  id: number | string;
  name: string;
  color?: string;
  projectId?: string;
}

export const addTechStack = async (techStack: TechStack) => {
  try {
    const res = await axios.post("/api/techStacks", techStack);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "failed to  add techStack ",
      };
    }
  }
  return { error: "failed to fetch projects" };
};

export const getTechStack = async () => {
  try {
    const res = await axios.get("/api/techStacks");
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "failed to fetch techStack",
      };
    }
  }
  return { error: "failed to fetch projects" };
};

export const getTechStackById = async (id: Number | string) => {
  try {
    const res = await axios.get(`/api/techStacks?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "failed to fetch techStacks",
      };
    }
  }
  return { error: "failed to fetch projects" };
};

export const updateTechStack = async (techStack: TechStack) => {
  try {
    const res = await axios.put(`/api/techStacks?id=${techStack.id}`, {
      id: techStack.id,
      name: techStack.name,
      color: techStack.color,
      projectId: techStack.projectId,
    });
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

export const deleteTechStack = async (id: Number | string) => {
  try {
    const res = await axios.delete(`/api/techStacks?id=${id}`, {
      method: "DELETE",
    });
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

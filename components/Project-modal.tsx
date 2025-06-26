import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  addProject,
  deleteProject,
  updateProject,
} from "@/hooks/actions/project-actions";
import { Project } from "@/lib/generated/prisma";
import { Textarea } from "./ui/textarea";

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   url: string;
//   image: string;
// }

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "Create" | "Edit";
  project?: Project | null;
  onSuccess?: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  mode,
  project,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: project?.id || "",
    title: project?.title || "",
    description: project?.description || " ",
    url: project?.url || "",
    image: project?.img || "",
    color: project?.color || "",
  });

  const isEdit = mode === "Edit";

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: project?.id || "",
        title: project?.title || "",
        description: project?.description || "",
        url: project?.url || "",
        image: project?.img || "",
        color: project?.color || "",
      });
    }
  }, [isOpen, project]);

  const validateForm = () => {
    if (!formData.title) {
      toast("Title is required");
      return;
    }
    if (!formData.description) {
      toast("Description is required");
      return;
    }
  };
  const handleUpdate = async () => {
    validateForm();
    if (!project) return;

    setIsLoading(true);
    try {
      const res = await updateProject(project.id, { ...formData });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Project updated successfully");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create Project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    validateForm();
    setIsLoading(true);

    try {
      const response = await addProject({ ...formData });
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Project created successfully");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create Project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      const res = await deleteProject(project.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Project successfully deleted");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = () => {
    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit your project details" : "Create New Project"}
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="title">Title*</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />

        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />

        <DialogFooter>
          {isEdit && (
            <Button
              variant={"destructive"}
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete Project
            </Button>
          )}

          <Button variant={"outline"} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isLoading
              ? "Processing"
              : isEdit
              ? "Save Changes"
              : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ProjectModal;

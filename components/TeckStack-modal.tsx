"use client";
import { TechStack } from "@/lib/generated/prisma";
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
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  addTechStack,
  deleteTechStack,
  updateTechStack,
} from "@/hooks/actions/techStack-actions";

interface TechStackModalProp {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  techStack?: TechStack | null;
  onSuccess: (techStack: TechStack) => void;
}

const TechStackModal: React.FC<TechStackModalProp> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  techStack,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: techStack?.name || "",
        color: techStack?.color || "",
      });
    }
  }, [isOpen, setFormData]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Skill is required");
      return false;
    }
    return;
  };

  const handleUpdate = async () => {
    validateForm();
    if (!techStack) return;
    setIsLoading(true);
    try {
      const response = await updateTechStack({
        id: techStack.id,
        name: formData.name,
        color: formData.color,
      });
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Successfully updated");
        onSuccess?.(response);
        onClose();
      }
      toast.success("successfully updated");
      onSuccess?.(response);
      onClose();
    } catch (error) {
      toast.error("Failed to update TechStack");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreate = async () => {
    validateForm();
    setIsLoading(true);
    try {
      const response = await addTechStack({
        id: "",
        name: formData.name,
        color: formData.color,
      });
      console.log(response);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Successfully created");
        onSuccess?.(response);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to create TechStack");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!techStack) return;
    if (!confirm("Are you sure")) return;
    setIsLoading(true);
    try {
      const response = await deleteTechStack(techStack.id);
      if (response.error) {
        toast.error(response.error);
      }
      toast.success("Successfully delete TechStack");
      onSuccess?.(response);
      onClose();
    } catch (error) {
      toast.error("Failed to create Project");
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

  const isEdit = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "EDIT" : "CREATE"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit your techStack" : "Add Your TechStack"}
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="name">Skill *</Label>
        <Input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          {isEdit && (
            <Button variant="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button onClick={handleSubmit} variant="destructive">
            {isLoading ? "Processing" : isEdit ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TechStackModal;

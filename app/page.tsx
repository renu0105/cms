"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Search, SquarePen } from "lucide-react";
import ProjectModal from "@/components/Project-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getProject, updateProject } from "@/hooks/actions/project-actions";
import { Project } from "@/lib/generated/prisma";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CmsHomePage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn, router]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [modalMode, setModalMode] = useState<"Create" | "Edit" | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await getProject();
      console.log(res);
      if ("error" in res) {
        setError(res.error);
      } else {
        setProjects(res);
      }
    } catch {
      setError("Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleModalSuccess = (updatedProject: Project) => {
    if (modalMode === "Edit") {
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.id === updatedProject.id ? updatedProject : proj
        )
      );
    } else {
      setProjects((prevProjects) => [...prevProjects, updatedProject]);
    }
    setModalMode(null);
    setSelectedProject(null);
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setModalMode("Create");
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setModalMode("Edit");
  };

  const handleModalClose = () => {
    setModalMode(null);
    setSelectedProject(null);
  };

  const handleSearch = () => {
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <span className="text-gray-500 text-lg">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-500">
                We couldn&apos;t load the projects at this time.
                <br />
                Please try again later.
              </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container m-10 my-28">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="font-bold text-3xl my-2">
              Content Management System
            </CardTitle>
            <p>CMS manage content easily and efficiently.</p>
          </div>

          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col text-white">
          <div className="flex items-center space-x-1 mb-4">
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Search Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {(searchTerm ? filteredProjects : projects).map((project, index) => (
            <div
              key={index}
              className="mb-4 flex lg:flex-row flex-col gap-4 items-center lg:h-64 h-full rounded-2xl border p-4"
              style={{
                backgroundColor: project.color ? project.color : "white",
              }}
            >
              <img
                src={project.img}
                alt={project.title}
                width={300}
                height={300}
                className="object-center rounded-lg h-56 w-84"
              />
              <div className="w-full space-y-2">
                <h1 className="font-semibold text-2xl">{project.title}</h1>
                <p>{project.description}</p>
              </div>
              <Button
                onClick={() => handleEdit(project)}
                className="bg-black text-white p-2 w-10 h-10 rounded-lg"
              >
                <SquarePen />
              </Button>
            </div>
          ))}

          {/* Filtered Projects Message */}
          {filteredProjects.length === 0 &&
            projects.length > 0 &&
            searchTerm && (
              <div className="text-center text-gray-400 mt-6">
                No projects found matching your search.
              </div>
            )}

          {/* No Projects Message */}
          {projects.length === 0 && (
            <div className="text-center text-gray-400 mt-6">
              No projects available. Click on Add Project.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <ProjectModal
        isOpen={modalMode !== null}
        onClose={handleModalClose}
        mode={modalMode === "Edit" ? "Edit" : "Create"}
        project={modalMode === "Edit" ? selectedProject : null}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

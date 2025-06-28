"use client";
import TechStackModal from "@/components/TeckStack-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTechStack } from "@/hooks/actions/techStack-actions";
import { TechStack } from "@/lib/generated/prisma";
import { Loader, Search, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

const TechStacks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const [selectedTechSTack, setSelectedTechSTack] = useState<TechStack | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);

  const fetchTechStack = async () => {
    setIsLoading(true);
    try {
      const res = await getTechStack();
      console.log("res", res);
      if (res.error) {
        setError(res.error);
      } else {
        setTechStacks(res);
      }
    } catch {
      setError("Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechStack();
  }, []);

  const handleEdit = (techStack: TechStack) => {
    setSelectedTechSTack(techStack);
    setModalMode("edit");
  };

  const handleAdd = () => {
    setSelectedTechSTack(null);
    setModalMode("create");
  };

  const handleModalSuccess = (updatedTechStack: TechStack) => {
    if (modalMode === "edit") {
      setTechStacks((prevTechStacks) =>
        prevTechStacks.map((techStack) =>
          techStack.id === updatedTechStack.id ? updatedTechStack : techStack
        )
      );
    } else {
      setTechStacks((prevTechStacks) => [updatedTechStack, ...prevTechStacks]);
    }
    setModalMode(null);
    setSelectedTechSTack(null);
  };

  const handleModalClose = () => {
    setSelectedTechSTack(null);
    setModalMode(null);
  };

  const filteredTechStacks = searchTerm
    ? techStacks.filter((tech) =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : techStacks;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Something went wrong</h1>
        <p>Please Try Again Later</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="mt-10 h-screen my-28 ">
        <CardHeader className="text-black">
          <CardTitle className="text-2xl">Tech-Stack</CardTitle>
          <div className=" flex justify-between my-4">
            <div className="flex">
              <Button onClick={() => filteredTechStacks}>
                <Search />
              </Button>
              <Input
                type="text"
                placeholder="Search Skills"
                className="w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="w-44" onClick={handleAdd}>
              Add Skills
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-4 grid-cols-2 gap-5">
          {filteredTechStacks.map((tech: TechStack) => (
            <div
              key={tech.id}
              className="bg-amber-500 border-2 w-64 p-3 mx-auto h-fit rounded-xl text-center text-xl text-white font-bold flex justify-between"
            >
              {tech.name}
              <Button
                className="bg-white text-amber-500"
                onClick={() => handleEdit(tech)}
              >
                <SquarePen />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <TechStackModal
        isOpen={modalMode !== null}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        mode={modalMode === "edit" ? "edit" : "create"}
        techStack={modalMode === "edit" ? selectedTechSTack : null}
      />
    </div>
  );
};
export default TechStacks;

"use client";
import TechStackModal from "@/components/TeckStack-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTechStack } from "@/hooks/actions/techStack-actions";
import { TechStack } from "@/lib/generated/prisma";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Search, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TechStacks = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn, router]);

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
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <span className="text-gray-500 text-lg">Loading techStacks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-500">
                We couldn&apos;t load the techStack at this time.
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
    <div>
      <Card className="mt-10 min-h-screen my-28  mx-10">
        <CardHeader className="text-black">
          <CardTitle className="text-3xl font-bold ">Tech-Stack</CardTitle>
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
        <CardContent className="grid lg:grid-cols-3 grid-cols-2 gap-5">
          {filteredTechStacks.map((tech: TechStack) => (
            <div
              key={tech.id}
              className="border-2 lg:w-96 w-64 p-5 mx-auto h-fit rounded-xl text-center text-xl text-white font-bold flex justify-between"
              style={{ backgroundColor: tech.color ? tech.color : "pink" }}
            >
              {tech.name}
              <Button
                style={{ color: tech.color ? tech.color : "orange" }}
                className="bg-white"
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

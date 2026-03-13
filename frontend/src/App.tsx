import { useState, useMemo, useEffect } from "react";
import { Plus, Search, FilterX, BookOpen, Clock, User, Library, GithubIcon, Pencil, Trash2, Database, Globe, Brain, Network, Cpu, Trash } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectForm } from "@/components/ProjectForm";
import { api } from "@/lib/data";
import type { Project, Supervisor, Subject } from "@/lib/data";

const subjectIcons: Record<string, any> = {
  "Database Systems": Database,
  "Web Development": Globe,
  "Artificial Intelligence": Brain,
  "Computer Networks": Network,
  "Software Engineering": Cpu,
};

const getSubjectIcon = (subject: string) => {
  const Icon = subjectIcons[subject] || Library;
  return <Icon className="h-3.5 w-3.5" />;
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [supervisorFilter, setSupervisorFilter] = useState<string>("All");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");

  // UI states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    Promise.all([
      api.getSupervisors(),
      api.getSubjects(),
    ]).then(async ([supervisorsData, subjectsData]) => {
      setSupervisors(supervisorsData);
      setSubjects(subjectsData);
      const projectsData = await api.getProjects(supervisorsData, subjectsData);
      setProjects(projectsData);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const handleCreateProject = async (payload: { name: string; deadline: string; doctor_id: string; subject_id: string }) => {
    try {
      const created = await api.addProject(payload, supervisors, subjects);
      setProjects(prev => [created, ...prev]);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleUpdateProject = async (payload: { name: string; deadline: string; doctor_id: string; subject_id: string }) => {
    if (!editingProject) return;
    try {
      const updated = await api.updateProject(editingProject.id, payload, supervisors, subjects);
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
      setEditingProject(null);
      toast.success("Project updated successfully!");
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = (id: string) => {
    toast("Are you sure you want to delete this project?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            toast.success("Project deleted");
          } catch (error) {
            toast.error("Failed to delete project");
          }
        },
      },
    });
  };

  const handleDeleteAll = () => {
    if (projects.length === 0) {
      toast.info("No projects to delete");
      return;
    }

    toast("Are you sure you want to delete ALL projects?", {
      action: {
        label: "Delete All",
        onClick: async () => {
          try {
            await api.deleteAllProjects();
            setProjects([]);
            toast.success("All projects deleted");
          } catch (error) {
            toast.error("Failed to delete all projects");
          }
        },
      },
    });
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingProject(null);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSupervisor = supervisorFilter === "All" || project.supervisor === supervisorFilter;
      const matchesSubject = subjectFilter === "All" || project.subject === subjectFilter;
      return matchesSearch && matchesSupervisor && matchesSubject;
    });
  }, [projects, searchQuery, supervisorFilter, subjectFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSupervisorFilter("All");
    setSubjectFilter("All");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-without-bg.png" className="hidden lg:block w-45" alt="Brand logo" />
          </div>
          <nav className="flex items-center mx-auto lg:mx-0 gap-3">
            <Button className="bg-destructive hover:bg-destructive/60 gap-2 text-white" onClick={handleDeleteAll}>
              <Trash className="h-4 w-4" /> Delete All
            </Button>
            <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="gap-4 mb-8">
            <div className="flex items-center justify-center text-center flex-col">
              <img src="/logo-without-bg.png" className="w-60 lg:hidden block" alt="Gradimy Logo" />
              <h2 className="text-4xl font-bold tracking-tight text-primary">Projects Dashboard</h2>
              <p className="text-muted-foreground mt-1 font-medium">Manage and track university graduation projects.</p>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex flex-col justify-between lg:flex-row gap-4">
                <div className="lg:w-[30%] relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-3">
                  <Select value={supervisorFilter} onValueChange={setSupervisorFilter}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Supervisors</SelectItem>
                      {supervisors.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Subjects</SelectItem>
                      {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(searchQuery || supervisorFilter !== "All" || subjectFilter !== "All") && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-secondary-foreground gap-2">
                    <FilterX className="h-4 w-4" /> Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-card px-4 rounded-lg border border-border shadow-sm">
            <Plus className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold text-primary">Getting Started</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto font-medium">
              You haven't created any graduation projects yet. Click the button below to add your first project and start tracking!
            </p>
            <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="mt-8 px-4 md:px-8 py-6 text-md md:text-lg">
              <Plus className="h-5 w-5 mr-2" /> Create Your First Project
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-lg border border-border shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              We couldn't find any projects matching your current filters. Try adjusting your search or clearing the filters.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Card key={project.id} className="flex flex-col hover:shadow-md hover:scale-102 hover:-translate-y-3 transition-all bg-card overflow-hidden">
                <CardHeader className="py-3 border-b border-border bg-background/50">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
                      {project.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    {getSubjectIcon(project.subject)}
                    {project.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <User className="h-4 w-4 text-primary" />
                      <span>{project.supervisor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Edit / Delete actions */}
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => openEditForm(project)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10">
          <a className="flex hover:text-primary/80 gap-3 mx-auto w-fit" target="_blank" href="https://github.com/abdullahMohamed13/Gradimy">
            <GithubIcon />
            <span>Github Repo</span>
          </a>
        </div>
      </main>

      <ProjectForm
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject}
        supervisors={supervisors}
        subjects={subjects}
      />
      <Toaster position="top-right" expand={true} richColors />
    </div>
  );
}

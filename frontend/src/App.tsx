import { useState, useMemo, useEffect } from "react";
import { Plus, Search, FilterX, BookOpen, Clock, User, Library, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectForm } from "@/components/ProjectForm";
import { SUPERVISORS, SUBJECTS, api } from "@/lib/data";
import type { Project, ProjectStatus } from "@/lib/data";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [supervisorFilter, setSupervisorFilter] = useState<string>("All");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");
  
  // UI states
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Initial data fetch
    api.getProjects().then(data => {
      setProjects(data);
      setIsLoading(false);
    });
  }, []);

  const handleCreateProject = async (newProjectData: Omit<Project, 'id'>) => {
    const createdProject = await api.addProject(newProjectData);
    setProjects(prev => [createdProject, ...prev]);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      const matchesSupervisor = supervisorFilter === "All" || project.supervisor === supervisorFilter;
      const matchesSubject = subjectFilter === "All" || project.subject === subjectFilter;
      
      return matchesSearch && matchesStatus && matchesSupervisor && matchesSubject;
    });
  }, [projects, searchQuery, statusFilter, supervisorFilter, subjectFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setSupervisorFilter("All");
    setSubjectFilter("All");
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Complete': return <Badge className="bg-emerald-600 hover:bg-emerald-700">Complete</Badge>;
      case 'In Progress': return <Badge className="bg-blue-600 hover:bg-blue-700">In Progress</Badge>;
      case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/public/logo-without-bg.png" className="w-45" alt="Brand logo" />
            {/* <h1 className="text-xl font-bold text-primary">Gradimy</h1> */}
          </div>
          <nav>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">Projects Dashboard</h2>
              <p className="text-muted-foreground mt-1 font-medium">Manage and track university graduation projects.</p>
            </div>
          </div>
          
          {/* Filters Section */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex flex-col justify-between lg:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col lg:flex-row items-center gap-3 ">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Complete">Complete</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={supervisorFilter} onValueChange={setSupervisorFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Supervisors</SelectItem>
                      {SUPERVISORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Subjects</SelectItem>
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(searchQuery || statusFilter !== "All" || supervisorFilter !== "All" || subjectFilter !== "All") && (
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
              <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow bg-card overflow-hidden">
                <CardHeader className="py-3 border-b border-border bg-background/50">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
                      {project.name}
                    </CardTitle>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    <Library className="h-3.5 w-3.5" />
                    {project.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 py-4">
                  <p className="text-sm text-secondary-foreground line-clamp-3 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <User className="h-4 w-4 text-primary" />
                      <span>{project.supervisor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
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
        onOpenChange={setIsFormOpen} 
        onSubmit={handleCreateProject}
      />
    </div>
  );
}

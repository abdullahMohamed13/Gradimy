export type ProjectStatus = 'Complete' | 'In Progress' | 'Overdue';

export const BASE_URL = "https://gradimy.onrender.com";
// export const BASE_URL = "http://localhost:8000/api";

export interface Supervisor {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  deadline: string; // MM-DD-YYYY
  doctor_id: string;
  subject_id: string;
  supervisor: string;
  subject: string;
}

/** Resolve supervisor and subject names from their ID lists */
function resolveProject(
  raw: Record<string, string>,
  supervisors: Supervisor[],
  subjects: Subject[]
): Project {
  const doctorId = String(raw.doctor_id ?? "");
  const subjectId = String(raw.subject_id ?? "");
  return {
    id: String(raw.id ?? ""),
    name: raw.name ?? "",
    deadline: raw.deadline ?? "",
    doctor_id: doctorId,
    subject_id: subjectId,
    supervisor: supervisors.find(s => s.id === doctorId)?.name ?? doctorId,
    subject: subjects.find(s => s.id === subjectId)?.name ?? subjectId,
  };
}

export const api = {
  /** GET /get_supervisors.php */
  getSupervisors: async (): Promise<Supervisor[]> => {
    const res = await fetch(`${BASE_URL}/get_supervisors.php`);
    if (!res.ok) throw new Error(`Failed to fetch supervisors: ${res.status}`);
    const data: { id: string; name: string }[] = await res.json();
    return data.map(s => ({ id: String(s.id), name: s.name }));
  },

  /** GET /get_subjects.php */
  getSubjects: async (): Promise<Subject[]> => {
    const res = await fetch(`${BASE_URL}/get_subjects.php`);
    if (!res.ok) throw new Error(`Failed to fetch subjects: ${res.status}`);
    const data: { id: string; name: string }[] = await res.json();
    return data.map(s => ({ id: String(s.id), name: s.name }));
  },

  /** GET /get_projects.php */
  getProjects: async (supervisors: Supervisor[], subjects: Subject[]): Promise<Project[]> => {
    const res = await fetch(`${BASE_URL}/get_projects.php`);
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
    const data: Record<string, string>[] = await res.json();
    return data.map(raw => resolveProject(raw, supervisors, subjects));
  },

  /** POST /add_projects.php, this sends { name, deadline, doctor_id, subject_id } */
  addProject: async (
    payload: { name: string; deadline: string; doctor_id: string; subject_id: string },
    supervisors: Supervisor[],
    subjects: Subject[]
  ): Promise<Project> => {
    console.log("Adding project:", payload);
    const res = await fetch(`${BASE_URL}/add_projects.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Add project failed:", errorText);
      throw new Error(`Failed to add project: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Add project response:", data);

    if (data.error) {
      throw new Error(data.error);
    }

    const projects = await api.getProjects(supervisors, subjects);
    return projects.sort((a, b) => Number(b.id) - Number(a.id))[0];
  },

  /** PUT /update_project.php, this sends { id, name, deadline, doctor_id, subject_id } */
  updateProject: async (
    id: string,
    payload: { name: string; deadline: string; doctor_id: string; subject_id: string },
    supervisors: Supervisor[],
    subjects: Subject[]
  ): Promise<Project> => {
    console.log("Updating project:", id, payload);
    const res = await fetch(`${BASE_URL}/update_project.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Update project failed:", errorText);
      throw new Error(`Failed to update project: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Update project response:", data);

    if (data.error) {
      throw new Error(data.error);
    }

    const projects = await api.getProjects(supervisors, subjects);
    return projects.find(p => p.id === id)!;
  },

  /** DELETE /delete_project.php, this sends { id } */
  deleteProject: async (id: string): Promise<void> => {
    console.log("Deleting project:", id);
    const res = await fetch(`${BASE_URL}/delete_project.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete project failed:", errorText);
      throw new Error(`Failed to delete project: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Delete project response:", data);

    if (data.error) {
      throw new Error(data.error);
    }
  },

  deleteAllProjects: async (): Promise<void> => {
    console.log("Deleting all projects...");
    const res = await fetch(`${BASE_URL}/get_projects.php`);
    if (!res.ok) throw new Error("Failed to fetch projects for deletion");
    const projects: { id: string }[] = await res.json();
    
    await Promise.all(projects.map(p => api.deleteProject(p.id)));
  },
};

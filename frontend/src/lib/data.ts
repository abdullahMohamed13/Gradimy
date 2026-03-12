export type ProjectStatus = 'Complete' | 'In Progress' | 'Overdue';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  deadline: string; // ISO date string or YYYY-MM-DD
  supervisor: string;
  subject: string;
}

export const SUPERVISORS = [
  'Dr. Alan Turing',
  'Dr. Grace Hopper',
  'Prof. John von Neumann',
  'Dr. Margaret Hamilton',
  'Prof. Tim Berners-Lee',
];

export const SUBJECTS = [
  'Software Engineering',
  'Artificial Intelligence',
  'Data Science',
  'Cybersecurity',
  'Human-Computer Interaction',
  'Cloud Computing',
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Gradimy Web Platform',
    description: 'A CRUD platform to manage university graduation projects efficiently.',
    status: 'In Progress',
    deadline: '2026-05-15',
    supervisor: 'Dr. Grace Hopper',
    subject: 'Software Engineering',
  },
  {
    id: '2',
    name: 'AI Grading System',
    description: 'Automated grading for introductory programming courses using LLMs.',
    status: 'Complete',
    deadline: '2026-01-20',
    supervisor: 'Dr. Alan Turing',
    subject: 'Artificial Intelligence',
  },
  {
    id: '3',
    name: 'Campus Network Security Audit',
    description: 'Comprehensive analysis of the university wireless network vulnerabilities.',
    status: 'Overdue',
    deadline: '2026-03-01',
    supervisor: 'Prof. John von Neumann',
    subject: 'Cybersecurity',
  },
  {
    id: '4',
    name: 'Student Sentiment Analysis',
    description: 'Analyzing feedback from student surveys to improve campus life.',
    status: 'In Progress',
    deadline: '2026-06-10',
    supervisor: 'Dr. Margaret Hamilton',
    subject: 'Data Science',
  },
  {
    id: '5',
    name: 'Accessible Learning Portal',
    description: 'Improving accessibility of course materials for students with disabilities.',
    status: 'In Progress',
    deadline: '2026-04-22',
    supervisor: 'Prof. Tim Berners-Lee',
    subject: 'Human-Computer Interaction',
  },
];

// Mock API functions for future PHP integration
export const api = {
  getProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PROJECTS]), 500));
  },
  addProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    return new Promise((resolve) => {
      const newProject = { ...project, id: Math.random().toString(36).substr(2, 9) };
      setTimeout(() => resolve(newProject), 500);
    });
  },
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_PROJECTS.findIndex(p => p.id === id);
        if (index > -1) {
          const updated = { ...MOCK_PROJECTS[index], ...updates };
          resolve(updated);
        } else {
          reject(new Error('Project not found'));
        }
      }, 500);
    });
  },
  deleteProject: async (_id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
};

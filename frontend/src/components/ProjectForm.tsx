import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project, Supervisor, Subject } from "@/lib/data";

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { name: string; deadline: string; doctor_id: string; subject_id: string }) => void;
  initialData?: Project | null;
  supervisors: Supervisor[];
  subjects: Subject[];
}

export function ProjectForm({ open, onOpenChange, onSubmit, initialData, supervisors, subjects }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name);
      setDeadline(initialData.deadline);
      setDoctorId(initialData.doctor_id);
      setSubjectId(initialData.subject_id);
    } else if (!open) {
      setName("");
      setDeadline("");
      setDoctorId("");
      setSubjectId("");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !deadline || !doctorId || !subjectId) return;
    onSubmit({ name, deadline, doctor_id: doctorId, subject_id: subjectId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g. AI Grading System"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supervisor */}
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger id="supervisor" className="w-full">
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger id="subject" className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Save Changes" : "Create Project"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

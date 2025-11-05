import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { jobFormSchema, JobFormData } from "@/schemas/jobSchema";
import { useCreateJob, useUpdateJob } from "@/hooks/useJobs";
import { Job, EMPLOYMENT_TYPE_LABELS, JOB_STATUS_LABELS } from "@/types/job";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
}

export function JobFormDialog({ open, onOpenChange, job }: JobFormDialogProps) {
  const [skillInput, setSkillInput] = useState("");
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      employmentType: "FULL_TIME",
      requiredSkills: [],
      salaryMin: 0,
      salaryMax: 0,
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
        requiredSkills: job.requiredSkills || [],
        salaryMin: job.salaryMin || 0,
        salaryMax: job.salaryMax || 0,
        status: job.status,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        location: "",
        employmentType: "FULL_TIME",
        requiredSkills: [],
        salaryMin: 0,
        salaryMax: 0,
        status: "DRAFT",
      });
    }
  }, [job, form]);

  const onSubmit = async (data: JobFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      employmentType: data.employmentType,
      requiredSkills: data.requiredSkills,
      salaryMin: data.salaryMin || undefined,
      salaryMax: data.salaryMax || undefined,
    };

    if (job) {
      updateJob.mutate({ id: job.id, ...payload }, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    } else {
      createJob.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !form.getValues("requiredSkills").includes(trimmedSkill)) {
      const currentSkills = form.getValues("requiredSkills");
      form.setValue("requiredSkills", [...currentSkills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("requiredSkills");
    form.setValue("requiredSkills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Post New Job"}</DialogTitle>
          <DialogDescription>
            {job ? "Update job details below" : "Fill in the details to create a new job posting"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Full Stack Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed job description..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover z-50">
                        {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiredSkills"
              render={() => (
                <FormItem>
                  <FormLabel>Required Skills *</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill and press Enter"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button type="button" onClick={handleAddSkill} variant="secondary">
                        Add
                      </Button>
                    </div>
                    {form.getValues("requiredSkills").length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.getValues("requiredSkills").map((skill) => (
                          <Badge key={skill} variant="secondary" className="pl-3 pr-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 hover:bg-muted rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="80000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover z-50">
                      {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createJob.isPending || updateJob.isPending}>
                {(createJob.isPending || updateJob.isPending) ? "Saving..." : job ? "Update Job" : "Post Job"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

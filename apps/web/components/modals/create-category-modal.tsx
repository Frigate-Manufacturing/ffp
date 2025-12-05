"use client";

import { useState } from "react";
import { FolderOpen, RefreshCw } from "lucide-react";
import { z } from "zod";
import SteppedModal from "../ui/modal/SteppedModal";
import { FormField, Input, Textarea } from "../ui/form-field";
import Step from "../ui/modal/step";
import { notify } from "@/lib/toast";
import { apiClient } from "@/lib/api";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const STEPS = [{ id: 1, title: "Details" }];

export default function CreateCategoryModal({ isOpen, onClose, onSuccess }: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
  });
  const [slugEdited, setSlugEdited] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const result = categorySchema.safeParse(formData);

      if (!result.success) {
        const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CategoryFormData;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleFieldChange = (name: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNameChange = (value: string) => {
    handleFieldChange("name", value);
    if (!slugEdited) {
      handleFieldChange("slug", generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    handleFieldChange("slug", value);
  };

  const regenerateSlug = () => {
    handleFieldChange("slug", generateSlug(formData.name));
    setSlugEdited(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post("/materials/category", formData);
      if (response.status === 201) {
        onSuccess();
        notify.success("Category created successfully");
        onClose();
      } else {
        notify.error("Error creating category");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error creating category");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });
    setErrors({});
    setSlugEdited(false);
    onClose();
  };

  return (
    <SteppedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Category"
      subtitle="Add a new material category"
      icon={<FolderOpen size={20} className="text-white dark:text-neutral-900" />}
      steps={STEPS}
      onSubmit={handleSubmit}
      onValidateStep={validateStep}
      submitLabel="Create Category"
    >
      {({ currentStep }) => (
        <Step step={1} currentStep={currentStep}>
          <div className="space-y-5">
            <FormField label="Name" error={errors.name} required hint="Display name for the category">
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Metals"
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Slug" error={errors.slug} required hint="URL-friendly identifier (auto-generated from name)">
              <div className="flex gap-2">
                <Input
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g., metals"
                  error={!!errors.slug}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={regenerateSlug}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  title="Regenerate from name"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </FormField>

            <FormField label="Description" hint="Additional details about the category">
              <Textarea
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Enter category description..."
                rows={3}
              />
            </FormField>
          </div>
        </Step>
      )}
    </SteppedModal>
  );
}

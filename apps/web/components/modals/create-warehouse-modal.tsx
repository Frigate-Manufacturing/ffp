"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { z } from "zod";
import SteppedModal from "../ui/modal/SteppedModal";
import { FormField, Input, Textarea } from "../ui/form-field";
import Step from "../ui/modal/step";
import { notify } from "@/lib/toast";
import { apiClient } from "@/lib/api";

const warehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  total_capacity: z.number().min(0, "Total capacity must be a number"),
  used_capacity: z.number().min(0, "Used capacity must be a number"),
  unit: z.string().default("kg"),
  address: z.string().optional(),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface WarehouseModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const STEPS = [{ id: 1, title: "Details" }];

const INITIAL_FORM_VALUE = {
  name: "",
  total_capacity: 0,
  used_capacity: 0,
  address: "",
  unit: "kg",
};

export default function CreateWarehouseModal({
  isOpen,
  onClose,
  onSuccess,
}: WarehouseModalProps) {
  const [formData, setFormData] = useState<WarehouseFormData>(INITIAL_FORM_VALUE);

  const [errors, setErrors] = useState<
    Partial<Record<keyof WarehouseFormData, string>>
  >({});

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const result = warehouseSchema.safeParse(formData);
      if (!result.success) {
        const newErrors: Partial<Record<keyof WarehouseFormData, string>> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof WarehouseFormData;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleFieldChange = (name: keyof WarehouseFormData, value: string) => {
    const parsedValue =
      name === "total_capacity" || name === "used_capacity"
        ? Number(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post("/supplier/warehouses", formData);
      if (response.status === 201) {
        onSuccess();
        notify.success("Warehouse created successfully");
        onClose();
      } else {
        notify.error("Error creating warehouse");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error creating warehouse");
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_VALUE);
    setErrors({});
    onClose();
  };

  return (
    <SteppedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Warehouse"
      subtitle="Add a new warehouse with capacity details"
      icon={
        <FolderOpen size={20} className="text-white dark:text-neutral-900" />
      }
      steps={STEPS}
      onSubmit={handleSubmit}
      onValidateStep={validateStep}
      submitLabel="Create Warehouse"
    >
      {({ currentStep }) => (
        <Step step={1} currentStep={currentStep}>
          <div className="space-y-5">
            <FormField
              label="Warehouse Name"
              error={errors.name}
              required
              hint="Enter a clear display name for the warehouse"
            >
              <Input
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g., Chennai Central Warehouse"
                error={!!errors.name}
              />
            </FormField>

            <FormField
              label="Total Capacity"
              error={errors.total_capacity}
              required
              hint="Maximum storage capacity available"
            >
              <Input
                type="number"
                value={formData.total_capacity}
                onChange={(e) =>
                  handleFieldChange("total_capacity", e.target.value)
                }
                placeholder="e.g., 50000"
                error={!!errors.total_capacity}
              />
            </FormField>

            <FormField
              label="Used Capacity"
              error={errors.used_capacity}
              required
              hint="Current occupied capacity"
            >
              <Input
                type="number"
                value={formData.used_capacity}
                onChange={(e) =>
                  handleFieldChange("used_capacity", e.target.value)
                }
                placeholder="e.g., 12000"
                error={!!errors.used_capacity}
              />
            </FormField>

             <FormField
              label="Unit of Measurement"
              error={errors.unit}
              required
              hint="Enter the unit for capacity (e.g., kg, tons)"
            >
              <Input
                value={formData.unit}
                onChange={(e) => handleFieldChange("unit", e.target.value)}
                placeholder="(e.g., kg, tons)"
                error={!!errors.unit}
                disabled
              />
            </FormField>

            <FormField
              label="Address"
              hint="Location or description of the warehouse"
            >
              <Textarea
                value={formData.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                placeholder="Enter full address or landmark details"
                rows={3}
              />
            </FormField>
          </div>
        </Step>
      )}
    </SteppedModal>
  );
}

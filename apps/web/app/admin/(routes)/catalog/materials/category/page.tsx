"use client";

import CreateCategoryModal from "@/components/modals/create-category-modal";
import { Button } from "@/components/ui/button";
import { Column, DataTable } from "@/components/ui/data-table";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/toast";
import { IGroupCategories } from "@/types";
import { ChevronRight, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getCategories() {
      try {
        setIsCategoriesLoading(true);
        const response = await apiClient.get("/materials/category");
        if (response.status === 200) {
          setCategories(response.data.categories ?? []);
        } else {
          notify.error("Error while fetching categories");
        }
      } catch (error) {
        console.error(error);
        notify.error("Error while fetching categories");
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    getCategories();
  }, [refresh]);

  const columns: Column<IGroupCategories>[] = [
    {
      key: "name",
      header: "Category",
      headerClassName:
        "py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900",
      cellClassName:
        "whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900",
      render: (row: IGroupCategories) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-medium">{row.name}</span>
        </div>
      ),
    },

    {
      key: "slug",
      header: "Slug",
      headerClassName:
        "py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900",
      cellClassName:
        "whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900",
      render: (row: IGroupCategories) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-medium">{row.slug}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      headerClassName:
        "py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900",
      cellClassName:
        "whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900",
      render: (row: IGroupCategories) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-medium">{row.description}</span>
        </div>
      ),
    },
  ];
  
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-gray-500">
        <Link
          href="/admin/catalog/materials"
          className="hover:text-primary transition-colors"
        >
          Materials
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Categories</span>
      </nav>

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Inspect material pricing, regional multipliers, and availability
            controls.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Button
            onClick={() => setIsCreateCategoryModalOpen(true)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Category
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(m) => m.name}
        emptyMessage="No Categories found"
        isLoading={isCategoriesLoading}
      />

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSuccess={() => setRefresh(true)}
      />
    </div>
  );
};

export default Page;

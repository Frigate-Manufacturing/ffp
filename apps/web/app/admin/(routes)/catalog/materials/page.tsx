'use client'

import { useEffect, useState, useMemo } from 'react'
import { PlusIcon, FunnelIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import CreateMatrialModal from '@/components/modals/create-material-modal'
import { notify } from '@/lib/toast'
import { apiClient } from '@/lib/api'
import { IGroupedMaterial } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/src/components/ui/sheet'
import { ChartBarStacked, Eye, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

type MaterialCategory = {
  id: string
  name: string
  slug: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

type Filters = {
  search: string
  status: string
  category: string
}

export default function MaterialsPage() {
  const [isCreateMaterialModalOpen, setIsCreateMaterialModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [materials, setMaterials] = useState<IGroupedMaterial[]>([])
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(true)
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [materialRefresh, setMaterialRefresh] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    category: '',
  })
  const router = useRouter();

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setIsMaterialsLoading(true)
        const [mRes, cRes] = await Promise.all([
          apiClient.get('/materials'),
          apiClient.get('/materials/category'),
        ])
        setMaterials(mRes.data.materials)
        setCategories(cRes.data.categories)
      } catch (error) {
        console.error(error)
        notify.error("Error while fetching materials")
      } finally {
        setIsMaterialsLoading(false)
      }
    }
    fetchMaterials()
  }, [materialRefresh])

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          material.name?.toLowerCase().includes(searchLower) ||
          material.code?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (filters.status !== 'all') {
        if (material.status !== filters.status) return false
      }
      if (filters.category) {
        if (material.material_categories?.code !== filters.category) return false
      }
      return true
    })
  }, [materials, filters])

  const activeFilterCount = [
    filters.search,
    filters.status !== 'all' ? filters.status : '',
    filters.category,
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({ search: '', status: 'all', category: '' })
  }

  const columns: Column<IGroupedMaterial>[] = [
    {
      key: 'name',
      header: 'Material',
      headerClassName: 'py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900',
      cellClassName: 'whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900',
      render: (material) => (
        <div className="space-y-1">
          <span className="text-primary">
            {material.name}
          </span>
          <div className="text-xs text-gray-500">{material.code}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (material) => (
        <>
          {material.material_categories?.name ?? '—'}
        </>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      headerClassName: 'relative py-3.5 pl-3 pr-6 text-right text-sm font-semibold text-gray-900',
      cellClassName: 'whitespace-nowrap py-4 pl-3 pr-6 text-right',
      render: (material) => (
        <span
          className={`inline-flex items-center rounded-full capitalize px-2.5 py-1 text-xs font-semibold ${material.status === 'active'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-gray-200 text-gray-600'
            }`}
        >
          {material.status}
        </span>
      ),
    },
    {
      key: 'stock_prices',
      header: 'Stock Prices',
      cellClassName: 'py-2',
      render: (material) => {
        const { stock_prices } = material;
        const currency = material.currency || 'USD';
        const unit = material.unit || 'kg';

        return (
          <div className="inline-grid grid-cols-3 gap-px bg-gray-200 rounded mx-auto w-full overflow-hidden text-xs">
            <div className="bg-white px-2 py-1 text-center">
              <div className="text-gray-400 text-[10px] uppercase">Block</div>
              <div className="font-medium text-gray-900">
                {stock_prices.block?.price != null ? stock_prices.block.price.toFixed(2) : '—'}
              </div>
            </div>
            <div className="bg-white px-2 py-1 text-center">
              <div className="text-gray-400 text-[10px] uppercase">Bar</div>
              <div className="font-medium text-gray-900">
                {stock_prices.bar?.price != null ? stock_prices.bar.price.toFixed(2) : '—'}
              </div>
            </div>
            <div className="bg-white px-2 py-1 text-center">
              <div className="text-gray-400 text-[10px] uppercase">Plate</div>
              <div className="font-medium text-gray-900">
                {stock_prices.plate?.price != null ? stock_prices.plate.price.toFixed(2) : '—'}
              </div>
            </div>
            <div className="col-span-3 bg-gray-50 px-2 py-0.5 text-center text-[10px] text-gray-500">
              {currency}/{unit}
            </div>
          </div>
        );
      },
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      render: (material) =>
        new Date(material.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
          <p className="mt-2 text-sm text-gray-700">
            Inspect material pricing, regional multipliers, and availability controls.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/catalog/materials/category")}
            className="inline-flex items-center gap-2"
          >
            <ChartBarStacked  className="h-4 w-4" />
            Manage Categories
          </Button>
          <Button
            onClick={() => setIsCreateMaterialModalOpen(true)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Filter Sidebar */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="w-[320px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filter Materials</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="filter-search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                id="filter-search"
                type="search"
                placeholder="Search by code or name"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="filter-status"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="filter-category"
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name} ({category.slug})
                  </option>
                ))}
              </select>
            </div>

          </div>
          <SheetFooter className="mt-8">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <DataTable
        columns={columns}
        data={filteredMaterials}
        keyExtractor={(m) => m.code}
        isLoading={isMaterialsLoading}
        selectable
        emptyMessage={
          activeFilterCount > 0
            ? 'No materials match the selected filters.'
            : 'No materials found. Add your first material to get started.'
        }
        actions={[
          {
            label: 'View',
            icon: <Eye className="h-4 w-4" />,
            onClick: (material) => {
              // Use the first available stock type's ID for navigation
              const firstId = material.stock_prices.block?.id || material.stock_prices.bar?.id || material.stock_prices.plate?.id;
              if (firstId) window.location.href = `/admin/catalog/materials/${firstId}`;
            },
          },
          {
            label: 'Delete',
            onClick: (material) => console.log('Delete', material.code),
            icon: <Trash className="h-4 w-4" />,
            className: 'text-red-600 focus:text-red-600',
          },
        ]}
      />

      <CreateMatrialModal
        isOpen={isCreateMaterialModalOpen}
        onClose={() => setIsCreateMaterialModalOpen(false)}
        onSuccess={() => setMaterialRefresh(true)}
      />
    </div>
  )
}

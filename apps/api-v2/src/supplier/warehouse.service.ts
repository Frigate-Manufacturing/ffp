import { SupabaseService } from 'src/supabase/supabase.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StockMaterial, CurrencyType, Tables } from 'libs/constants';

@Injectable()
export class WarehouseService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async addStockToWarehouse(
    organizationId: string,
    materialId: string,
    warehouseId: string,
    quantity: number,
    unit: string,
    price: number,
    currency: CurrencyType,
    maxStock: number,
  ) {
    const client = this.supabaseService.getClient();

    // 1. Get warehouse info
    const { data: warehouse, error: warehouseError } = await client
      .from(Tables.Warehouses)
      .select('total_capacity, used_capacity')
      .eq('id', warehouseId)
      .eq('organization_id', organizationId)
      .single();

    if (warehouseError || !warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    if (warehouse.used_capacity + quantity > warehouse.total_capacity) {
      throw new BadRequestException('Not enough warehouse capacity');
    }

    // 2. Upsert supplier material
    const { error: upsertError } = await client
      .from(Tables.SupplierMaterials)
      .upsert(
        {
          supplier_id: organizationId,
          material_id: materialId,
          warehouse_id: warehouseId,
          current_stock: quantity,
          stock_unit: unit,
          supplier_price: price,
          currency,
          max_stock: maxStock,
        },
        {
          onConflict: 'supplier_id,material_id,warehouse_id',
        },
      );

    if (upsertError) {
      console.error('Upsert failed:', upsertError);
      throw new InternalServerErrorException('Failed to update material stock');
    }

    // 3. Update warehouse used capacity
    const { error: capacityError } = await client
      .from(Tables.Warehouses)
      .update({
        used_capacity: warehouse.used_capacity + quantity,
      })
      .eq('id', warehouseId);

    if (capacityError) {
      console.error('Capacity update failed:', capacityError);
      throw new InternalServerErrorException(
        'Failed to update warehouse capacity',
      );
    }

    return { success: true };
  }

  async removeStockFromWarehouse(
    organizationId: string,
    materialId: string,
    warehouseId: string,
    quantity: number,
  ) {
    const client = this.supabaseService.getClient();

    const { data: stock } = await client
      .from(Tables.SupplierMaterials)
      .select('stock_quantity')
      .eq('supplier_id', organizationId)
      .eq('material_id', materialId)
      .eq('warehouse_id', warehouseId)
      .single();

    if (!stock) throw new NotFoundException('Stock entry not found');
    if (stock.stock_quantity < quantity)
      throw new BadRequestException('Insufficient stock quantity');

    const transactionSQL = `
      BEGIN;

      UPDATE ${Tables.SupplierMaterials}
      SET stock_quantity = stock_quantity - ${quantity}
      WHERE supplier_id = '${organizationId}' AND material_id = '${materialId}' AND warehouse_id = '${warehouseId}';

      UPDATE ${Tables.Warehouses}
      SET used_capacity = used_capacity - ${quantity}
      WHERE id = '${warehouseId}';

      COMMIT;
    `;

    const { error } = await client.rpc('execute_sql', { sql: transactionSQL });
    if (error) {
      console.error('Remove stock error:', error);
      throw new InternalServerErrorException(
        'Failed to remove stock from warehouse',
      );
    }

    return { success: true };
  }
}

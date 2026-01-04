export class DashboardStatsDto {
  activeQuotes: number;
  openOrders: number;
  totalSpent: string;
  avgLeadTime: string;
}

export class RecentQuoteDto {
  id: string;
  rfq_code: string;
  description: string;
  status: string;
  final_price: number;
  created_at: string;
  parts_count: number;
}

export class RecentOrderDto {
  id: string;
  order_code: string;
  description: string;
  status: string;
  total_amount: number;
  created_at: string;
  progress: number;
}

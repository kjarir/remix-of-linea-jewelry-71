import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface AnalyticsData {
  ordersByMonth: { month: string; orders: number; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    ordersByMonth: [],
    topProducts: [],
    ordersByStatus: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch orders with items (handle if table doesn't exist)
      let orders: any[] = [];
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, total_cents, status, created_at");
        
        if (ordersError && ordersError.code !== '42P01') {
          throw ordersError;
        }
        
        orders = ordersData || [];
        
        // Fetch order items separately if orders exist
        if (orders.length > 0) {
          const orderIds = orders.map(o => o.id);
          const { data: itemsData } = await supabase
            .from("order_items")
            .select("order_id, product_id, quantity, price_cents")
            .in("order_id", orderIds);
          
          // Attach items to orders
          const itemsMap = new Map();
          (itemsData || []).forEach((item: any) => {
            if (!itemsMap.has(item.order_id)) {
              itemsMap.set(item.order_id, []);
            }
            itemsMap.get(item.order_id).push(item);
          });
          
          orders = orders.map(order => ({
            ...order,
            order_items: itemsMap.get(order.id) || [],
          }));
        }
      } catch (e: any) {
        // If orders table doesn't exist, just use empty array
        if (e.code === '42P01') {
          orders = [];
        } else {
          throw e;
        }
      }

      // Process orders by month
      const ordersByMonthMap = new Map<string, { orders: number; revenue: number }>();
      orders?.forEach((order) => {
        const month = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        const existing = ordersByMonthMap.get(month) || { orders: 0, revenue: 0 };
        ordersByMonthMap.set(month, {
          orders: existing.orders + 1,
          revenue: existing.revenue + (order.total_cents || 0) / 100,
        });
      });

      const ordersByMonth = Array.from(ordersByMonthMap.entries())
        .map(([month, stats]) => ({ month, ...stats }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      // Process top products
      const productSalesMap = new Map<string, { name: string; sales: number; revenue: number }>();
      orders?.forEach((order) => {
        if (order.order_items) {
          order.order_items.forEach((item: any) => {
            const productId = item.product_id;
            const existing = productSalesMap.get(productId) || { name: `Product ${productId.slice(0, 8)}`, sales: 0, revenue: 0 };
            productSalesMap.set(productId, {
              name: existing.name,
              sales: existing.sales + (item.quantity || 0),
              revenue: existing.revenue + ((item.price_cents || 0) * (item.quantity || 0)) / 100,
            });
          });
        }
      });

      // Fetch product names
      const productIds = Array.from(productSalesMap.keys());
      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("id, name")
          .in("id", productIds);

        products?.forEach((product) => {
          const existing = productSalesMap.get(product.id);
          if (existing) {
            productSalesMap.set(product.id, { ...existing, name: product.name });
          }
        });
      }

      const topProducts = Array.from(productSalesMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Process orders by status
      const statusMap = new Map<string, number>();
      orders?.forEach((order) => {
        const status = order.status || "unknown";
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      const ordersByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));

      setData({
        ordersByMonth,
        topProducts,
        ordersByStatus,
      });
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
      </div>

      {/* Orders and Revenue Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Orders & Revenue Over Time</CardTitle>
          <CardDescription>Monthly orders and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          {data.ordersByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  name="Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Revenue</CardTitle>
          <CardDescription>Best performing products</CardDescription>
        </CardHeader>
        <CardContent>
          {data.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Orders by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
          <CardDescription>Distribution of order statuses</CardDescription>
        </CardHeader>
        <CardContent>
          {data.ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

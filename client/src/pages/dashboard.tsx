import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import useSWR from "swr";
import ja from "@/lib/i18n";
import { Building2, Users, GalleryVerticalEnd, DollarSign } from "lucide-react";

interface Metrics {
  accounts: number;
  contacts: number;
  opportunities: number;
  totalValue: number;
}

export default function Dashboard() {
  const { data: metrics } = useSWR<Metrics>("/api/metrics");

  const salesData = [
    { name: "Q1", amount: 4000000 },
    { name: "Q2", amount: 3000000 },
    { name: "Q3", amount: 2000000 },
    { name: "Q4", amount: 2780000 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{ja.navigation.dashboard}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ja.dashboard.totalAccounts}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.accounts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ja.dashboard.totalContacts}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.contacts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ja.dashboard.totalOpportunities}
            </CardTitle>
            <GalleryVerticalEnd className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.opportunities || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ja.dashboard.totalValue}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{((metrics?.totalValue || 0) / 10000).toLocaleString()}万
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>四半期売上推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  label={({ value }) => `¥${(value / 10000).toLocaleString()}万`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

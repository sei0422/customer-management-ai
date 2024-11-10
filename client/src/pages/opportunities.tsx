import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Opportunity } from "db/schema";
import useSWR, { mutate } from "swr";
import ja from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Opportunities() {
  const { data: opportunities } = useSWR<Opportunity[]>("/api/opportunities");
  const [open, setOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<Opportunity>();

  const onSubmit = async (data: Opportunity) => {
    const res = await fetch(`/api/opportunities${editingOpportunity ? `/${editingOpportunity.id}` : ""}`, {
      method: editingOpportunity ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      mutate("/api/opportunities");
      setOpen(false);
      reset();
      toast({
        title: ja.common.success,
      });
    }
  };

  const onDelete = async (id: number) => {
    const res = await fetch(`/api/opportunities/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      mutate("/api/opportunities");
      toast({
        title: ja.common.success,
      });
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: ja.opportunities.name,
    },
    {
      accessorKey: "stage",
      header: ja.opportunities.stage,
    },
    {
      accessorKey: "amount",
      header: ja.opportunities.amount,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return `¥${(amount / 10000).toLocaleString()}万`;
      },
    },
    {
      accessorKey: "probability",
      header: ja.opportunities.probability,
      cell: ({ row }) => {
        const probability = row.getValue("probability") as number;
        return `${probability}%`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const opportunity = row.original as Opportunity;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingOpportunity(opportunity);
                  setOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {ja.common.edit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(opportunity.id)}>
                <Trash className="mr-2 h-4 w-4" />
                {ja.common.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{ja.navigation.opportunities}</h1>

      <DataTable
        columns={columns}
        data={opportunities || []}
        onAdd={() => {
          setEditingOpportunity(null);
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOpportunity ? ja.common.edit : ja.common.add}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  {...register("name")}
                  placeholder={ja.opportunities.name}
                  defaultValue={editingOpportunity?.name}
                />
              </div>
              <div>
                <Input
                  {...register("stage")}
                  placeholder={ja.opportunities.stage}
                  defaultValue={editingOpportunity?.stage}
                />
              </div>
              <div>
                <Input
                  type="number"
                  {...register("amount")}
                  placeholder={ja.opportunities.amount}
                  defaultValue={editingOpportunity?.amount}
                />
              </div>
              <div>
                <Input
                  type="number"
                  {...register("probability")}
                  placeholder={ja.opportunities.probability}
                  defaultValue={editingOpportunity?.probability}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">{ja.common.save}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

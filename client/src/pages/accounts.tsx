import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Account } from "db/schema";
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

export default function Accounts() {
  const { data: accounts } = useSWR<Account[]>("/api/accounts");
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<Account>();

  const onSubmit = async (data: Account) => {
    const res = await fetch(`/api/accounts${editingAccount ? `/${editingAccount.id}` : ""}`, {
      method: editingAccount ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      mutate("/api/accounts");
      setOpen(false);
      reset();
      toast({
        title: ja.common.success,
      });
    }
  };

  const onDelete = async (id: number) => {
    const res = await fetch(`/api/accounts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      mutate("/api/accounts");
      toast({
        title: ja.common.success,
      });
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: ja.accounts.name,
    },
    {
      accessorKey: "type",
      header: ja.accounts.type,
    },
    {
      accessorKey: "industry",
      header: ja.accounts.industry,
    },
    {
      accessorKey: "phone",
      header: ja.accounts.phone,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const account = row.original as Account;
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
                  setEditingAccount(account);
                  setOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {ja.common.edit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(account.id)}>
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
      <h1 className="text-3xl font-bold">{ja.navigation.accounts}</h1>

      <DataTable
        columns={columns}
        data={accounts || []}
        onAdd={() => {
          setEditingAccount(null);
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? ja.common.edit : ja.common.add}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  {...register("name")}
                  placeholder={ja.accounts.name}
                  defaultValue={editingAccount?.name}
                />
              </div>
              <div>
                <Input
                  {...register("type")}
                  placeholder={ja.accounts.type}
                  defaultValue={editingAccount?.type}
                />
              </div>
              <div>
                <Input
                  {...register("industry")}
                  placeholder={ja.accounts.industry}
                  defaultValue={editingAccount?.industry}
                />
              </div>
              <div>
                <Input
                  {...register("phone")}
                  placeholder={ja.accounts.phone}
                  defaultValue={editingAccount?.phone}
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

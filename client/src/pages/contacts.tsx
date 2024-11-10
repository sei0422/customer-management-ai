import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Contact } from "db/schema";
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

export default function Contacts() {
  const { data: contacts } = useSWR<Contact[]>("/api/contacts");
  const [open, setOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<Contact>();

  const onSubmit = async (data: Contact) => {
    const res = await fetch(`/api/contacts${editingContact ? `/${editingContact.id}` : ""}`, {
      method: editingContact ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      mutate("/api/contacts");
      setOpen(false);
      reset();
      toast({
        title: ja.common.success,
      });
    }
  };

  const onDelete = async (id: number) => {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      mutate("/api/contacts");
      toast({
        title: ja.common.success,
      });
    }
  };

  const columns = [
    {
      accessorKey: "firstName",
      header: ja.contacts.firstName,
    },
    {
      accessorKey: "lastName",
      header: ja.contacts.lastName,
    },
    {
      accessorKey: "email",
      header: ja.contacts.email,
    },
    {
      accessorKey: "phone",
      header: ja.contacts.phone,
    },
    {
      accessorKey: "title",
      header: ja.contacts.title,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original as Contact;
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
                  setEditingContact(contact);
                  setOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {ja.common.edit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(contact.id)}>
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
      <h1 className="text-3xl font-bold">{ja.navigation.contacts}</h1>

      <DataTable
        columns={columns}
        data={contacts || []}
        onAdd={() => {
          setEditingContact(null);
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? ja.common.edit : ja.common.add}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  {...register("firstName")}
                  placeholder={ja.contacts.firstName}
                  defaultValue={editingContact?.firstName}
                />
              </div>
              <div>
                <Input
                  {...register("lastName")}
                  placeholder={ja.contacts.lastName}
                  defaultValue={editingContact?.lastName}
                />
              </div>
              <div>
                <Input
                  {...register("email")}
                  placeholder={ja.contacts.email}
                  defaultValue={editingContact?.email}
                />
              </div>
              <div>
                <Input
                  {...register("phone")}
                  placeholder={ja.contacts.phone}
                  defaultValue={editingContact?.phone}
                />
              </div>
              <div>
                <Input
                  {...register("title")}
                  placeholder={ja.contacts.title}
                  defaultValue={editingContact?.title}
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

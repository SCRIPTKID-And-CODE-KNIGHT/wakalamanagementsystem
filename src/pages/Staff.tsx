import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaff, useOffices, useTransactions, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@/hooks/use-data";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffPage() {
  const { data: staffList, isLoading } = useStaff();
  const { data: offices } = useOffices();
  const { data: transactions } = useTransactions();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", office_id: "", role: "Staff" });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", phone: "", email: "", office_id: offices?.[0]?.id ?? "", role: "Staff" });
    setDialogOpen(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, phone: s.phone ?? "", email: s.email ?? "", office_id: s.office_id, role: s.role });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.office_id) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    try {
      if (editingId) {
        await updateStaff.mutateAsync({ id: editingId, ...form });
        toast({ title: "Staff updated" });
      } else {
        await createStaff.mutateAsync(form);
        toast({ title: "Staff added" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff.mutateAsync(id);
      toast({ title: "Staff removed" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const getOfficeName = (officeId: string) => offices?.find(o => o.id === officeId)?.name ?? "Unknown";

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage staff across offices</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList?.map(s => {
                const txCount = transactions?.filter(t => t.staff_id === s.id).length ?? 0;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{getOfficeName(s.office_id)}</TableCell>
                    <TableCell>
                      <Badge variant={s.role === "Manager" ? "default" : "secondary"} className={s.role === "Manager" ? "bg-primary" : ""}>
                        {s.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.phone}</TableCell>
                    <TableCell className="text-right">{txCount}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "default" : "secondary"} className={s.status === "active" ? "bg-secondary text-secondary-foreground" : ""}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Staff" : "Add Staff"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Amina Hassan" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+255..." />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@wakala.co.tz" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Office</Label>
                <Select value={form.office_id} onValueChange={v => setForm(f => ({ ...f, office_id: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {offices?.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createStaff.isPending || updateStaff.isPending}>
              {editingId ? "Save" : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { staff as initialStaff, offices, transactions, getOfficeName } from "@/data/mockData";
import { Staff as StaffType } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffType[]>(initialStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StaffType | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", officeId: "", role: "Staff" as "Manager" | "Staff" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", phone: "", email: "", officeId: offices[0]?.id ?? "", role: "Staff" });
    setDialogOpen(true);
  };

  const openEdit = (s: StaffType) => {
    setEditing(s);
    setForm({ name: s.name, phone: s.phone, email: s.email, officeId: s.officeId, role: s.role });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.officeId) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    if (editing) {
      setStaffList(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
      toast({ title: "Staff updated" });
    } else {
      const newStaff: StaffType = {
        id: `stf-${Date.now()}`,
        ...form,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStaffList(prev => [...prev, newStaff]);
      toast({ title: "Staff added" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
    toast({ title: "Staff removed" });
  };

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
              {staffList.map(s => {
                const txCount = transactions.filter(t => t.staffId === s.id).length;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{getOfficeName(s.officeId)}</TableCell>
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
            <DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle>
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
                <Select value={form.officeId} onValueChange={v => setForm(f => ({ ...f, officeId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {offices.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v as "Manager" | "Staff" }))}>
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
            <Button onClick={handleSave}>{editing ? "Save" : "Add Staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

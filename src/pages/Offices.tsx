import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { offices as initialOffices, floatBalances, staff, formatTZS } from "@/data/mockData";
import { Office } from "@/types";
import { Plus, Pencil, Trash2, Building2, MapPin, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Offices() {
  const [officeList, setOfficeList] = useState<Office[]>(initialOffices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Office | null>(null);
  const [form, setForm] = useState({ name: "", location: "", status: "active" as "active" | "inactive" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", location: "", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (office: Office) => {
    setEditing(office);
    setForm({ name: office.name, location: office.location, status: office.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.location) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (editing) {
      setOfficeList(prev => prev.map(o => o.id === editing.id ? { ...o, ...form } : o));
      toast({ title: "Office updated" });
    } else {
      const newOffice: Office = {
        id: `off-${Date.now()}`,
        name: form.name,
        location: form.location,
        status: form.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setOfficeList(prev => [...prev, newOffice]);
      toast({ title: "Office created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setOfficeList(prev => prev.filter(o => o.id !== id));
    toast({ title: "Office deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offices</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your Wakala office locations</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Office
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {officeList.map(office => {
          const officeFloat = floatBalances.filter(f => f.officeId === office.id).reduce((s, f) => s + f.balance, 0);
          const officeStaff = staff.filter(s => s.officeId === office.id).length;
          return (
            <Card key={office.id} className="relative group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl stat-card-blue p-2.5">
                      <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{office.name}</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {office.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant={office.status === "active" ? "default" : "secondary"} className={office.status === "active" ? "bg-secondary text-secondary-foreground" : ""}>
                    {office.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Total Float</p>
                    <p className="text-sm font-semibold mt-0.5">{formatTZS(officeFloat)}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" /> Staff
                    </div>
                    <p className="text-sm font-semibold mt-0.5">{officeStaff}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(office)}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(office.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Office" : "Add Office"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Office Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kariakoo Branch" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Kariakoo, Dar es Salaam" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v as "active" | "inactive" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Office"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

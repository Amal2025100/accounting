'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Search } from 'lucide-react';
import type { Employee, Shift } from '@/types';

export default function Employees() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    employee_code: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'Active' as 'Active' | 'Inactive' | 'On Leave',
  });

  /* =======================
     LOAD DATA
  ======================== */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [emps, sh] = await Promise.all([
          api.employees.getAll(),
          api.shifts.getAll(),
        ]);
        setEmployees(emps || []);
        setShifts(sh || []);
      } catch (e) {
        toast({
          title: 'Error',
          description: 'Failed to load employees',
          variant: 'destructive',
        });
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [user]);

  /* =======================
     GUARDS
  ======================== */
  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-10 text-red-400 text-xl">
        Login required
      </div>
    );
  }

  if (loadingData) {
    return <div className="p-10 text-white">Loading employees...</div>;
  }

  /* =======================
     HELPERS
  ======================== */
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_code.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === 'Active'
      ? 'bg-green-500'
      : s === 'On Leave'
      ? 'bg-yellow-500 text-black'
      : 'bg-red-500';

  /* =======================
     ACTIONS
  ======================== */
  const openAdd = () => {
    setEditing(null);
    setForm({
      employee_code: `EMP-${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      hire_date: new Date().toISOString().split('T')[0],
      salary: 0,
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({
      employee_code: emp.employee_code,
      name: emp.name,
      email: emp.email || '',
      phone: emp.phone || '',
      position: emp.position || '',
      department: emp.department || '',
      hire_date: emp.hire_date.split(' ')[0],
      salary: emp.salary || 0,
      status: emp.status,
    });
    setOpenDialog(true);
  };

  const saveEmployee = async () => {
    if (!form.name || !form.employee_code) {
      toast({
        title: 'Validation',
        description: 'Code and name are required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.employees.update(editing.id, {
          ...form,
          hire_date: `${form.hire_date} 00:00:00`,
        });
      } else {
        await api.employees.create({
          user_id: user.id,
          employee_code: form.employee_code,
          name: form.name,
          email: form.email,
          phone: form.phone,
          position: form.position,
          department: form.department,
          hire_date: `${form.hire_date} 00:00:00`,
          salary: form.salary,
          status: form.status,

          // ✅ REQUIRED BY TYPE
          role: 'Employee',
          created_at: new Date()
            .toISOString()
            .replace('T', ' ')
            .split('.')[0],
        });
      }

      toast({ title: 'Success', description: 'Employee saved' });
      setOpenDialog(false);
      setEmployees(await api.employees.getAll());
    } catch {
      toast({
        title: 'Error',
        description: 'Save failed',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     RENDER
  ======================== */
  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employees</h1>

        {/* ✅ BUTTON FIXED */}
        <Button onClick={openAdd} className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] flex gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <Search className="text-[#A1A1AA]" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
        />
      </div>

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#2A2A2A] hover:bg-[#1A1A1A]">
                <TableHead className="text-[#A1A1AA]">Code</TableHead>
                <TableHead className="text-[#A1A1AA]">Name</TableHead>
                <TableHead className="text-[#A1A1AA]">Salary</TableHead>
                <TableHead className="text-[#A1A1AA]">Status</TableHead>
                <TableHead className="text-[#A1A1AA]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(emp => (
                <TableRow key={emp.id} className="border-[#2A2A2A] hover:bg-[#0A0A0A]">
                  <TableCell className="text-white font-medium">{emp.employee_code}</TableCell>
                  <TableCell className="text-white">{emp.name}</TableCell>
                  <TableCell className="text-white">${emp.salary}</TableCell>
                  <TableCell>
                    <Badge className={statusColor(emp.status)}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(emp)}
                      className="text-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* =======================
          DIALOG
      ======================== */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing ? 'Edit Employee' : 'Add Employee'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#A1A1AA]">Code</Label>
              <Input 
                value={form.employee_code} 
                disabled 
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div>
              <Label className="text-[#A1A1AA]">Name *</Label>
              <Input
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div>
              <Label className="text-[#A1A1AA]">Email</Label>
              <Input
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div>
              <Label className="text-[#A1A1AA]">Salary</Label>
              <Input
                type="number"
                value={form.salary}
                onChange={e =>
                  setForm({
                    ...form,
                    salary: Number(e.target.value),
                  })
                }
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div>
              <Label className="text-[#A1A1AA]">Status</Label>
              <Select
                value={form.status}
                onValueChange={v =>
                  setForm({ ...form, status: v as any })
                }
              >
                <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                  <SelectItem value="Active" className="text-white">Active</SelectItem>
                  <SelectItem value="On Leave" className="text-white">On Leave</SelectItem>
                  <SelectItem value="Inactive" className="text-white">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-white">
              Cancel
            </Button>
            <Button onClick={saveEmployee} disabled={saving} className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]">
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { SystemLogTable } from "../components/SystemLogTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminSystemHistory = () => {
  const [filters, setFilters] = useState({
    actionType: "",
    targetType: "",
    userEmail: "",
  });

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">System Audit Logs</h2>

      <div className="flex gap-4">
        <Input 
          placeholder="Filter by user email..." 
          className="max-w-sm"
          value={filters.userEmail}
          onChange={(e) => setFilters(prev => ({ ...prev, userEmail: e.target.value }))}
        />
        <Select onValueChange={(val) => setFilters(prev => ({ ...prev, actionType: val === "ALL" ? "" : val }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Methods</SelectItem>
            <SelectItem value="POST">POST (Create)</SelectItem>
            <SelectItem value="PATCH">PATCH (Update)</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SystemLogTable filters={filters} />
    </div>
  );
};
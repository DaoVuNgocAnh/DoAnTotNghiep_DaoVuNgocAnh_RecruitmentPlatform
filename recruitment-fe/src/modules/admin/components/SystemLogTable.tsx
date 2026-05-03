import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSystemLogs } from '../api/systemLogApi';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SystemLogTableProps {
  filters: {
    actionType: string;
    targetType: string;
    userEmail: string;
  };
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'POST': return 'bg-yellow-500';
    case 'PATCH': return 'bg-blue-500';
    case 'DELETE': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const SystemLogTable = ({ filters }: SystemLogTableProps) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['system-logs', filters, page],
    queryFn: () => getSystemLogs({ ...filters, page, limit }),
  });

  if (isLoading) return <div className="p-4">Loading logs...</div>;

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const parseAction = (action: string) => {
    // Handle "METHOD:URL" or "METHOD URL"
    const separator = action.includes(':') ? ':' : ' ';
    const [method, ...urlParts] = action.split(separator);
    return { method, url: urlParts.join(separator) };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of recent system actions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((log: any) => {
              const { method, url } = parseAction(log.actionType);
              return (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user?.email || 'Guest'}</TableCell>
                  <TableCell>
                    <Badge className={`${getMethodColor(method)} text-white`}>{method}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{url}</TableCell>
                  <TableCell>
                    {log.targetType ? `${log.targetType} (${log.targetId})` : '-'}
                  </TableCell>
                  <TableCell>{new Date(log.actionDate).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


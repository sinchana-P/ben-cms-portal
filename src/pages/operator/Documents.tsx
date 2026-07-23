import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { UploadCloud, FileText, Download } from "lucide-react";

const DOCS = [
  { name: "Health Insurance Policy 2026.pdf", type: "Insurance", size: "240 KB", uploaded: "2026-01-12" },
  { name: "Business License.pdf", type: "License", size: "180 KB", uploaded: "2025-11-03" },
  { name: "Courthouse Café Lease Agreement.pdf", type: "Contract", size: "1.1 MB", uploaded: "2024-08-20" },
  { name: "August Bank Statement.pdf", type: "Financial", size: "320 KB", uploaded: "2026-08-05" },
];

export default function Documents() {
  return (
    <div>
      <PageHeader
        title="My documents"
        description="Upload and manage supporting documents. Files are virus-scanned, versioned, and stored securely."
        actions={<Button><UploadCloud className="h-4 w-4" /> Upload document</Button>}
      />
      <div className="mb-5 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-sm text-muted-foreground">
        <UploadCloud className="h-8 w-8" />
        <span>Drag files here or click to upload — PDF, JPG, PNG up to 25 MB</span>
      </div>
      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Size</TableHead><TableHead>Uploaded</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {DOCS.map((d) => (
                <TableRow key={d.name}>
                  <TableCell><span className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-muted-foreground" /> {d.name}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.size}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.uploaded}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm"><Download className="h-4 w-4" /> Download</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserResponse, api } from "@/lib/api";
import { useAssignWorkOrder } from "@/hooks/useWorkOrders";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VendorAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId: string | null;
  workOrderTitle: string;
}

export function VendorAssignDialog({ open, onOpenChange, workOrderId, workOrderTitle }: VendorAssignDialogProps) {
  const [vendors, setVendors] = useState<UserResponse[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [loadingVendors, setLoadingVendors] = useState(false);
  const assignWorkOrder = useAssignWorkOrder();

  useEffect(() => {
    if (open) {
      fetchVendors();
      setSelectedVendorId("");
    }
  }, [open]);

  const fetchVendors = async () => {
    setLoadingVendors(true);
    try {
      const data = await api.getVendors();
      setVendors(data);
    } catch (error) {
      toast.error("Failed to load vendors");
      console.error(error);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleAssign = () => {
    if (!workOrderId || !selectedVendorId) {
      toast.error("Please select a vendor");
      return;
    }

    assignWorkOrder.mutate(
      { id: workOrderId, vendorId: selectedVendorId },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedVendorId("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Assign Vendor</DialogTitle>
          <DialogDescription>
            Select a vendor to assign to: {workOrderTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Select value={selectedVendorId} onValueChange={setSelectedVendorId} disabled={loadingVendors}>
              <SelectTrigger id="vendor" className="bg-background">
                <SelectValue placeholder={loadingVendors ? "Loading vendors..." : "Select a vendor"} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.email} - {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedVendorId || assignWorkOrder.isPending}>
            {assignWorkOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Vendor"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

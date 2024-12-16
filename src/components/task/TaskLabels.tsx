import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TaskLabel {
  id: number;
  name: string;
  color: string;
}

interface TaskLabelsProps {
  taskId: string;
  selectedLabels: number[];
  onLabelsChange: (labelIds: number[]) => void;
}

export function TaskLabels({ taskId, selectedLabels, onLabelsChange }: TaskLabelsProps) {
  const [newLabelName, setNewLabelName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: labels = [] } = useQuery({
    queryKey: ["taskLabels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_labels")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("task_labels")
        .insert([{ name: newLabelName }])
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
      setNewLabelName("");
      setIsAdding(false);
      
      toast({
        title: "Label created",
        description: "New label has been added successfully.",
      });
    } catch (error) {
      console.error("Error creating label:", error);
      toast({
        title: "Error",
        description: "Failed to create label. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleLabel = async (labelId: number) => {
    const isSelected = selectedLabels.includes(labelId);
    const newSelectedLabels = isSelected
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
    
    try {
      if (isSelected) {
        await supabase
          .from("task_label_assignments")
          .delete()
          .eq("task_id", taskId)
          .eq("label_id", labelId);
      } else {
        await supabase
          .from("task_label_assignments")
          .insert([{ task_id: taskId, label_id: labelId }]);
      }
      
      onLabelsChange(newSelectedLabels);
    } catch (error) {
      console.error("Error toggling label:", error);
      toast({
        title: "Error",
        description: "Failed to update labels. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {labels.map((label: TaskLabel) => (
          <Badge
            key={label.id}
            variant={selectedLabels.includes(label.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleLabel(label.id)}
          >
            {label.name}
          </Badge>
        ))}
      </div>
      
      {isAdding ? (
        <div className="flex items-center gap-2">
          <Input
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Enter label name"
            className="flex-1"
          />
          <Button size="sm" onClick={handleCreateLabel}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setIsAdding(true)}
        >
          Add Label
        </Button>
      )}
    </div>
  );
}
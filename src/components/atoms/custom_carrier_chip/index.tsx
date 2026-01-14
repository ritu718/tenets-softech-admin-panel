import { Chip, Tooltip, Zoom } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface CustomCarrierChipProps {
  carrier: { id: number | string; name: string };
  isActive: boolean;
  onSelect: (id: number | string) => void;
  onEdit: (carrier: any) => void;
  onDelete: (id: number | string) => void;
}

export default function CustomCarrierChip({
  carrier,
  isActive,
  onSelect,
  onEdit,
  onDelete
}: CustomCarrierChipProps) {
  return (
    
      <Chip
        label={carrier.name}
        onClick={() => onSelect(carrier.id)}
        onDelete={() => {}}
        deleteIcon={
          <div style={{ display: "flex", gap: 8 }}>
            <Tooltip title="Edit Carrier" arrow>
              <EditIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(carrier);
                }}
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </Tooltip>

            <Tooltip title="Delete Carrier" arrow>
              <DeleteOutlineIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(carrier.id);
                }}
                style={{ cursor: "pointer", transition: "transform 0.2s, color 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ff1744";
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive ? "#fff" : "#555";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </Tooltip>
          </div>
        }
        sx={{
          px: 1.5,
          minWidth: 120,
          height: 40,
          fontWeight: 600,
          borderRadius: "20px",
          cursor: "pointer",
          bgcolor: isActive ? "#1976d2" : "#f5f5f5",
          color: isActive ? "#fff" : "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: isActive ? "#1565c0" : "#e0e0e0"
          },
          ".MuiChip-deleteIcon": {
            display: "flex",
            gap: 1,
            alignItems: "center"
          },
          "@media (max-width:600px)": {
            fontSize: 12,
            height: 36,
            px: 1
          }
        }}
      />
  
  );
}

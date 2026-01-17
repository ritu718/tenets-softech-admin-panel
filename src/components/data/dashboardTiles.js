
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";


export const dashboardTiles = (router) => [
  {
    title: "Invoice Hub",
    description: "Rechnungsprüfung und Projektübersicht",
    icon: <ReceiptLongIcon fontSize="large" color="primary" />,
    onClick: () => router.push("/invoice-hub"),
    visibleFor: ["basic", "pro", "enterprise"], // oder "admin", falls du willst
  },
  {
    title: "Shipper -Tender- Hub",
    description: "Rechnungsprüfung und Projektübersicht",
    icon: <ReceiptLongIcon fontSize="large" color="primary" />,
    onClick: () => {router.push("/shipper-tender-hub");
    }, // <== muss genau so sein!
    visibleFor: ["basic", "pro", "enterprise", "admin"],
  },
  {
    title: "Analysen Hub",
    description: "Rechnungsprüfung und Projektübersicht",
    icon: <ReceiptLongIcon fontSize="large" color="primary" />,
    onClick: () =>null,
    visibleFor: ["basic", "pro", "enterprise"], // oder "admin", falls du willst
  },
  {
    title: "Order Hub",
    description: "Rechnungsprüfung und Projektübersicht",
    icon: <ReceiptLongIcon fontSize="large" color="primary" />,
    onClick: () => null,
    visibleFor: ["basic", "pro", "enterprise"], // oder "admin", falls du willst
  },
  
];
import { Box, Typography, Card, CardContent } from "@mui/material";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {Number(value).toFixed(2)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {trend > 0 ? (
                <ArrowUpRight size={20} color="#4CAF50" />
              ) : (
                <ArrowDownRight size={20} color="#f44336" />
              )}
              <Typography
                variant="body2"
                color={trend > 0 ? "success.main" : "error.main"}
              >
                {Math.abs(trend)}% from last month
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
            }}
          >
            <Icon size={24} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;

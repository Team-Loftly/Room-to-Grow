import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function VisualInsight({
	title,
	chartLabel,
	chartData,
	chartWidth = 450,
}) {
	const xAxisLabels = Object.keys(chartData);
	const seriesData = Object.values(chartData);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				{title}
			</Typography>
			<BarChart
				xAxis={[{ scaleType: "band", data: xAxisLabels }]}
				series={[
					{
						data: seriesData,
						label: chartLabel,
					},
				]}
				width={chartWidth}
				height={200}
				margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
			/>
		</Box>
	);
}

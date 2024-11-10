import { ResponsivePie } from '@nivo/pie';

export default function CustomPieChart({ data }) {
    // Custom theme for the pie chart
    const theme = {
      fontSize: 14,
      textColor: '#64748b', // Slate-500 for better readability
      labels: {
        text: {
          fontSize: 13,
          fontWeight: 600,
          fill: '#475569' // Slate-600 for labels
        }
      },
      legends: {
        text: {
          fontSize: 12,
          fill: '#64748b' // Slate-500 for legend text
        }
      }
    };
  
    // Custom colors for different status
    const customColors = {
      'Backlog': '#f97316', // Orange-500 for backlog
      'Doing': '#3b82f6',   // Blue-500 for doing
      'Done': '#22c55e'     // Green-500 for done
    };
  
    return (
      <div className="h-[400px] w-full p-4">
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
          innerRadius={0.6}
          padAngle={0.5}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          colors={({ id }) => customColors[id]}
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#64748b"
          arcLinkLabelsThickness={2}
          arcLinkLabelsDiagonalLength={12}
          arcLinkLabelsStraightLength={12}
          arcLinkLabelsColor={{ from: 'color', modifiers: [['darker', 1]] }}
          enableArcLabels={true}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="white"
          arcLabelsRadiusOffset={0.6}
          theme={theme}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 12,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#64748b',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#334155' // Slate-700 on hover
                  }
                }
              ]
            }
          ]}
          motionConfig="gentle"
          transitionMode="middleAngle"
        />
      </div>
    );
  };
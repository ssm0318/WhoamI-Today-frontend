// Generate a random hex color code
export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFD166', // Yellow
  '#6A0572', // Purple
  '#FF8C42', // Orange
  '#45B7D1', // Sky Blue
  '#98D8AA', // Mint
  '#FF69B4', // Hot Pink
  '#9370DB', // Medium Purple
  '#20B2AA', // Light Sea Green
  '#FF7F50', // Coral
  '#00CED1', // Dark Turquoise
  '#FF1493', // Deep Pink
  '#32CD32', // Lime Green
  '#BA55D3', // Medium Orchid
  '#FF4500', // Orange Red
  '#00FA9A', // Medium Spring Green
  '#9932CC', // Dark Orchid
  '#FF8C00', // Dark Orange
  '#00FF7F', // Spring Green
  '#8B008B', // Dark Magenta
  '#FFA07A', // Light Salmon
  '#48D1CC', // Medium Turquoise
  '#C71585', // Medium Violet Red
  '#7B68EE', // Medium Slate Blue
  '#66CDAA', // Medium Aquamarine
  '#DB7093', // Pale Violet Red
  '#4169E1', // Royal Blue
  '#CD5C5C', // Indian Red
  '#40E0D0', // Turquoise
  '#8A2BE2', // Blue Violet
  '#FA8072', // Salmon
  '#7FFF00', // Chartreuse
  '#9400D3', // Dark Violet
  '#FF6347', // Tomato
  '#DA70D6', // Orchid
  '#F08080', // Light Coral
  '#8FBC8F', // Dark Sea Green
  '#F4A460', // Sandy Brown
  '#98FB98', // Pale Green
  '#D8BFD8', // Thistle
  '#DEB887', // Burlywood
  '#FF69B4', // Hot Pink
];

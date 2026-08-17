import "./BoxVisualizer.css";

const BoxVisualizer = ({ box }) => {
  const { width, height, depth, thickness, includeDragHandles } = box;
  const color = "#3498db";

  // Calculate scale factor to fit the box within the SVG
  const maxDimension = Math.max(width, height, depth);
  const scaleFactor = 200 / maxDimension;

  // Scale dimensions for display
  const scaledWidth = width * scaleFactor;
  const scaledHeight = height * scaleFactor;
  const scaledDepth = depth * scaleFactor;
  const scaledThickness = thickness * scaleFactor;

  // Calculate center point
  const centerX = 200;
  const centerY = 200;

  // Isometric angles (30 degrees)
  const cos30 = Math.cos(Math.PI / 6);
  const sin30 = Math.sin(Math.PI / 6);

  // Calculate corners in 3D space
  // Apply 90° clockwise rotation around Y axis: (x,y,z) becomes (z,y,-x)
  const corners3D = [
    // Bottom face corners (counter-clockwise when viewed from below)
    [-scaledDepth / 2, -scaledHeight / 2, scaledWidth / 2], // front-left-bottom (was right-front)
    [scaledDepth / 2, -scaledHeight / 2, scaledWidth / 2], // back-left-bottom (was right-back)
    [scaledDepth / 2, -scaledHeight / 2, -scaledWidth / 2], // back-right-bottom (was left-back)
    [-scaledDepth / 2, -scaledHeight / 2, -scaledWidth / 2], // front-right-bottom (was left-front)

    // Top face corners (counter-clockwise when viewed from above)
    [-scaledDepth / 2, scaledHeight / 2, scaledWidth / 2], // front-left-top (was right-front)
    [scaledDepth / 2, scaledHeight / 2, scaledWidth / 2], // back-left-top (was right-back)
    [scaledDepth / 2, scaledHeight / 2, -scaledWidth / 2], // back-right-top (was left-back)
    [-scaledDepth / 2, scaledHeight / 2, -scaledWidth / 2], // front-right-top (was left-front)
  ];

  // Convert 3D points to 2D isometric projection
  const projectTo2D = (point3D) => {
    const [x, y, z] = point3D;
    const x2D = centerX + (x * cos30 - z * cos30);
    const y2D = centerY - (y + x * sin30 + z * sin30); // Adjusted to match coordinate system
    return [x2D, y2D];
  };

  const corners2D = corners3D.map(projectTo2D);

  // Define the faces of the box using the 2D projected points
  const faces = [
    {
      // Bottom face (negative y in 3D space)
      points: [corners2D[0], corners2D[1], corners2D[2], corners2D[3]],
      className: "box-face box-face--bottom",
      name: "Bottom",
    },
    {
      // Front face (negative z in 3D space) - now faces negative x
      points: [corners2D[0], corners2D[3], corners2D[7], corners2D[4]],
      // fill: color, // Removed
      className: "box-face box-face--front",
      name: "Front",
    },
    {
      // Left face (now faces positive z)
      points: [corners2D[0], corners2D[1], corners2D[5], corners2D[4]],
      className: "box-face box-face--left",
      name: "Left",
    },
    {
      // Back face (positive z in 3D space) - now faces positive x
      points: [corners2D[1], corners2D[2], corners2D[6], corners2D[5]],
      className: "box-face box-face--back",
      name: "Back",
    },
    {
      // Right face (now faces negative z)
      points: [corners2D[2], corners2D[3], corners2D[7], corners2D[6]],
      className: "box-face box-face--right",
      name: "Right",
    },
    {
      // Top face (positive y in 3D space)
      points: [corners2D[4], corners2D[5], corners2D[6], corners2D[7]],
      className: "box-face box-face--top",
      name: "Top",
    },
  ];

  // Determine the rendering order for faces (back to front)
  const renderOrder = [3, 0, 2, 4, 1, 5]; // back, bottom, left, right, front, top

  // Calculate drag handle (hand hole) shapes for left and right sides
  const createDragHandles = () => {
    if (!includeDragHandles) return null;

    // Only show handles if depth is at least 150mm
    if (depth < 150) return null;

    // Fixed handle width of 100mm, scaled to match the box
    const fixedHandleWidth = 100 * scaleFactor;
    const handleHeight = scaledHeight * 0.15;

    // Position handles near the top of the box
    const handleYOffset = scaledHeight * 0.25;

    // Create handle points, accounting for thickness
    const createHandlePoints = (isRight) => {
      const zPos = isRight ? scaledWidth / 2 : -scaledWidth / 2;

      return [
        projectTo2D([
          fixedHandleWidth / 2,
          handleYOffset - handleHeight / 2,
          zPos,
        ]),
        projectTo2D([
          -fixedHandleWidth / 2,
          handleYOffset - handleHeight / 2,
          zPos,
        ]),
        projectTo2D([
          -fixedHandleWidth / 2,
          handleYOffset + handleHeight / 2,
          zPos,
        ]),
        projectTo2D([
          fixedHandleWidth / 2,
          handleYOffset + handleHeight / 2,
          zPos,
        ]),
      ];
    };

    const leftHandlePoints = createHandlePoints(false);
    const rightHandlePoints = createHandlePoints(true);

    // Create inner cutout points for thickness visualization
    const createInnerHandlePoints = (isRight) => {
      if (thickness <= 1) return null;

      const zPos = isRight
        ? scaledWidth / 2 - scaledThickness
        : -scaledWidth / 2 + scaledThickness;

      return [
        projectTo2D([
          fixedHandleWidth / 2 - scaledThickness,
          handleYOffset - handleHeight / 2 + scaledThickness,
          zPos,
        ]),
        projectTo2D([
          -fixedHandleWidth / 2 + scaledThickness,
          handleYOffset - handleHeight / 2 + scaledThickness,
          zPos,
        ]),
        projectTo2D([
          -fixedHandleWidth / 2 + scaledThickness,
          handleYOffset + handleHeight / 2 - scaledThickness,
          zPos,
        ]),
        projectTo2D([
          fixedHandleWidth / 2 - scaledThickness,
          handleYOffset + handleHeight / 2 - scaledThickness,
          zPos,
        ]),
      ];
    };

    const leftInnerPoints =
      thickness > 1 ? createInnerHandlePoints(false) : null;
    const rightInnerPoints =
      thickness > 1 ? createInnerHandlePoints(true) : null;

    return (
      <g className="drag-handles" data-testid="drag-handles">
        {/* Outer cutouts */}
        <polygon
          points={leftHandlePoints.map((point) => point.join(",")).join(" ")}
          className="drag-handle drag-handle--left"
        />
        <polygon
          points={rightHandlePoints.map((point) => point.join(",")).join(" ")}
          className="drag-handle drag-handle--right"
        />

        {/* Inner cutouts for thickness */}
        {thickness > 1 && (
          <>
            <polygon
              points={leftInnerPoints.map((point) => point.join(",")).join(" ")}
              className="drag-handle-inner drag-handle-inner--left"
              stroke={color} // Changed from adjustColorBrightness
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <polygon
              points={rightInnerPoints
                .map((point) => point.join(","))
                .join(" ")}
              className="drag-handle-inner drag-handle-inner--right"
              stroke={color} // Changed from adjustColorBrightness
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Thickness connectors for cutout corners */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={`left-handle-thickness-${i}`}
                x1={leftHandlePoints[i][0]}
                y1={leftHandlePoints[i][1]}
                x2={leftInnerPoints[i][0]}
                y2={leftInnerPoints[i][1]}
                className="thickness-line"
              />
            ))}

            {[0, 1, 2, 3].map((i) => (
              <line
                key={`right-handle-thickness-${i}`}
                x1={rightHandlePoints[i][0]}
                y1={rightHandlePoints[i][1]}
                x2={rightInnerPoints[i][0]}
                y2={rightInnerPoints[i][1]}
                className="thickness-line"
              />
            ))}
          </>
        )}
      </g>
    );
  };

  // Create inner corners for the thickness
  const innerCorners3D = [
    // Bottom face corners (counter-clockwise when viewed from below)
    [
      -(scaledDepth / 2 - scaledThickness),
      -(scaledHeight / 2 - scaledThickness),
      scaledWidth / 2 - scaledThickness,
    ],
    [
      scaledDepth / 2 - scaledThickness,
      -(scaledHeight / 2 - scaledThickness),
      scaledWidth / 2 - scaledThickness,
    ],
    [
      scaledDepth / 2 - scaledThickness,
      -(scaledHeight / 2 - scaledThickness),
      -(scaledWidth / 2 - scaledThickness),
    ],
    [
      -(scaledDepth / 2 - scaledThickness),
      -(scaledHeight / 2 - scaledThickness),
      -(scaledWidth / 2 - scaledThickness),
    ],

    // Top face corners (counter-clockwise when viewed from above)
    [
      -(scaledDepth / 2 - scaledThickness),
      scaledHeight / 2 - scaledThickness,
      scaledWidth / 2 - scaledThickness,
    ],
    [
      scaledDepth / 2 - scaledThickness,
      scaledHeight / 2 - scaledThickness,
      scaledWidth / 2 - scaledThickness,
    ],
    [
      scaledDepth / 2 - scaledThickness,
      scaledHeight / 2 - scaledThickness,
      -(scaledWidth / 2 - scaledThickness),
    ],
    [
      -(scaledDepth / 2 - scaledThickness),
      scaledHeight / 2 - scaledThickness,
      -(scaledWidth / 2 - scaledThickness),
    ],
  ];

  const innerCorners2D = innerCorners3D.map(projectTo2D);

  // Create inner faces to represent thickness
  const renderThickness = () => {
    if (thickness <= 1) return null; // Don't render if thickness is minimal

    // Define inner visible faces for thickness visualization
    const innerFaces = [
      {
        // Top inner face
        points: [
          innerCorners2D[4],
          innerCorners2D[5],
          innerCorners2D[6],
          innerCorners2D[7],
        ],
        className: "box-inner box-inner--top",
      },
      {
        // Front inner face
        points: [
          innerCorners2D[0],
          innerCorners2D[3],
          innerCorners2D[7],
          innerCorners2D[4],
        ],
        className: "box-inner box-inner--front",
      },
      {
        // Right inner face
        points: [
          innerCorners2D[3],
          innerCorners2D[2],
          innerCorners2D[6],
          innerCorners2D[7],
        ],
        className: "box-inner box-inner--right",
      },
    ];

    // Function to draw a thickness line between corresponding corners
    const createThicknessLine = (outerIndex, innerIndex) => (
      <line
        x1={corners2D[outerIndex][0]}
        y1={corners2D[outerIndex][1]}
        x2={innerCorners2D[innerIndex][0]}
        y2={innerCorners2D[innerIndex][1]}
        className="thickness-line"
      />
    );

    return (
      <g className="box-thickness">
        {/* Draw inner faces */}
        {innerFaces.map((face, index) => (
          <polygon
            key={`inner-face-${index}`}
            points={face.points.map((point) => point.join(",")).join(" ")}
            fill="none"
            stroke={color} // Changed from adjustColorBrightness
            strokeWidth="1"
            strokeDasharray="2,2"
            className={face.className}
          />
        ))}
        {/* Draw thickness lines for visible corners */}
        {createThicknessLine(0, 0)} {/* Front-Left-Bottom */}
        {createThicknessLine(3, 3)} {/* Front-Right-Bottom */}
        {createThicknessLine(4, 4)} {/* Front-Left-Top */}
        {createThicknessLine(7, 7)} {/* Front-Right-Top */}
      </g>
    );
  };

  return (
    <div className="box-visualizer">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render all faces in the correct order */}
        {renderOrder.map((faceIndex, index) => {
          const face = faces[faceIndex];
          return (
            <polygon
              key={index}
              points={face.points.map((point) => point.join(",")).join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className={face.className}
            />
          );
        })}

        {/* Add edge lines for better visual clarity */}
        <g className="box-edges">
          {/* Bottom face edges */}
          <line
            x1={corners2D[0][0]}
            y1={corners2D[0][1]}
            x2={corners2D[1][0]}
            y2={corners2D[1][1]}
          />
          <line
            x1={corners2D[1][0]}
            y1={corners2D[1][1]}
            x2={corners2D[2][0]}
            y2={corners2D[2][1]}
          />
          <line
            x1={corners2D[2][0]}
            y1={corners2D[2][1]}
            x2={corners2D[3][0]}
            y2={corners2D[3][1]}
          />
          <line
            x1={corners2D[3][0]}
            y1={corners2D[3][1]}
            x2={corners2D[0][0]}
            y2={corners2D[0][1]}
          />

          {/* Vertical edges */}
          <line
            x1={corners2D[0][0]}
            y1={corners2D[0][1]}
            x2={corners2D[4][0]}
            y2={corners2D[4][1]}
          />
          <line
            x1={corners2D[1][0]}
            y1={corners2D[1][1]}
            x2={corners2D[5][0]}
            y2={corners2D[5][1]}
          />
          <line
            x1={corners2D[2][0]}
            y1={corners2D[2][1]}
            x2={corners2D[6][0]}
            y2={corners2D[6][1]}
          />
          <line
            x1={corners2D[3][0]}
            y1={corners2D[3][1]}
            x2={corners2D[7][0]}
            y2={corners2D[7][1]}
          />

          {/* Top face edges - already exist in the current code */}
          <line
            x1={corners2D[4][0]}
            y1={corners2D[4][1]}
            x2={corners2D[5][0]}
            y2={corners2D[5][1]}
          />
          <line
            x1={corners2D[5][0]}
            y1={corners2D[5][1]}
            x2={corners2D[6][0]}
            y2={corners2D[6][1]}
          />
          <line
            x1={corners2D[6][0]}
            y1={corners2D[6][1]}
            x2={corners2D[7][0]}
            y2={corners2D[7][1]}
          />
          <line
            x1={corners2D[7][0]}
            y1={corners2D[7][1]}
            x2={corners2D[4][0]}
            y2={corners2D[4][1]}
          />
        </g>

        {/* Order matters - add thickness visualization before drag handles */}
        {renderThickness()}

        {/* Add drag handles (hand holes) if enabled */}
        {createDragHandles()}
      </svg>
    </div>
  );
};

export default BoxVisualizer;

# Level Editor Design Document

## Overview

A drag-and-drop level editor for creating traffic junction configurations. The editor will be used by game authors to design levels that players will later configure with traffic lights and simulate.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     Level Editor                             │
├─────────────────────────────────────┬───────────────────────┤
│                                     │                       │
│                                     │   Toolbox Panel       │
│                                     │   (Right Side)        │
│         Canvas Area                 │                       │
│         (Left Side - Main)          │   ┌───────────────┐   │
│                                     │   │ Road Pieces   │   │
│   - Grid-based placement            │   │ - Straight    │   │
│   - Snap to grid                    │   │ - Curved      │   │
│   - Visual feedback                 │   │ - Junction    │   │
│                                     │   └───────────────┘   │
│                                     │                       │
│                                     │   ┌───────────────┐   │
│                                     │   │ Traffic Lights│   │
│                                     │   │ - Placeholder │   │
│                                     │   │ - Can rotate  │   │
│                                     │   └───────────────┘   │
│                                     │                       │
│                                     │   ┌───────────────┐   │
│                                     │   │ Actions       │   │
│                                     │   │ - Save        │   │
│                                     │   │ - Clear       │   │
│                                     │   │ - Test        │   │
│                                     │   └───────────────┘   │
└─────────────────────────────────────┴───────────────────────┘
```

## Core Components

### 1. Grid System

**Purpose**: Provides structure for snapping and alignment

**Design**:
- Fixed grid size (e.g., 64x64 pixels per cell)
- Visible or invisible grid lines (toggleable)
- All pieces snap to grid coordinates
- Grid coordinates stored as `{ x: number, y: number }` (grid units, not pixels)

**Rationale**: Grid-based system ensures pieces align correctly and simplifies collision detection.

### 2. Editor Pieces

#### 2.1 Road Pieces

**Types**:
1. **Straight Road**
   - Orientation: 0°, 90°, 180°, 270° (N, E, S, W)
   - Length: 1 grid unit
   - Connection points: 2 (start, end)

2. **Curved Road**
   - Orientation: 4 rotations (NE, SE, SW, NW turns)
   - 90-degree curve
   - Connection points: 2 (start, end)

3. **Junction** (Future - not in MVP)
   - Cross junction (4-way)
   - T-junction (3-way)
   - Connection points: 3 or 4

**Data Structure**:
```typescript
interface RoadPiece {
  id: string;              // Unique identifier
  type: 'straight' | 'curved' | 'junction';
  gridX: number;           // Grid X coordinate
  gridY: number;           // Grid Y coordinate
  rotation: 0 | 90 | 180 | 270;  // Degrees
  connectionPoints: ConnectionPoint[];
}

interface ConnectionPoint {
  localX: number;          // Relative to piece origin
  localY: number;
  direction: 0 | 90 | 180 | 270;  // Direction facing outward
}
```

#### 2.2 Traffic Light Pieces

**Properties**:
- Positioned on grid
- Rotation: 0°, 90°, 180°, 270° (which direction it faces)
- Visual representation as placeholder (box with arrow)
- Associated with a road piece (optional - for validation)

**Data Structure**:
```typescript
interface TrafficLightPiece {
  id: string;
  gridX: number;
  gridY: number;
  rotation: 0 | 90 | 180 | 270;
  type: 'basic';           // Extensible for future light types
}
```

### 3. Toolbox Panel (Right Side)

**Sections**:

1. **Road Pieces Section**
   - Displays available road types as draggable icons
   - Icons show visual representation
   - Grouped by category

2. **Traffic Light Section**
   - Displays available traffic light types
   - Visual representation with rotation indicator

3. **Actions Section**
   - Save button (exports to JSON)
   - Clear button (clears canvas)
   - Test button (loads level in simulator mode)

**Interaction**:
- Click and drag piece from toolbox
- Drag over canvas
- Visual preview shows where piece will snap
- Release to place
- ESC key to cancel drag

### 4. Canvas Area (Left Side)

**Responsibilities**:
- Render grid (optional visual)
- Render placed pieces
- Handle drag-and-drop interactions
- Show placement preview
- Handle piece selection
- Handle piece deletion

**Interaction States**:
1. **Idle**: No interaction
2. **Dragging from Toolbox**: Preview piece follows cursor, snaps to grid
3. **Piece Selected**: Highlight selected piece, show delete/rotate options
4. **Dragging Existing Piece**: Move piece to new location

### 5. Piece Management

**Operations**:
- **Add**: Drag from toolbox to canvas
- **Move**: Click and drag existing piece
- **Rotate**: Select piece, press R or click rotate button
- **Delete**: Select piece, press Delete or click delete button
- **Select**: Click on piece

**State Management**:
```typescript
interface EditorState {
  roadPieces: RoadPiece[];
  trafficLightPieces: TrafficLightPiece[];
  selectedPieceId: string | null;
  dragState: DragState | null;
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface DragState {
  pieceType: 'road' | 'trafficLight';
  pieceData: RoadPiece | TrafficLightPiece;
  isDraggingFromToolbox: boolean;
  currentGridX: number;
  currentGridY: number;
}
```

## Rendering System

### Coordinate Conversion

```typescript
// Grid to pixel coordinates
function gridToPixel(gridX: number, gridY: number, gridSize: number) {
  return {
    x: gridX * gridSize,
    y: gridY * gridSize
  };
}

// Pixel to grid coordinates (with snapping)
function pixelToGrid(pixelX: number, pixelY: number, gridSize: number) {
  return {
    gridX: Math.floor(pixelX / gridSize),
    gridY: Math.floor(pixelY / gridSize)
  };
}
```

### Rendering Order

1. Grid (if visible)
2. Road pieces (bottom layer)
3. Traffic light pieces (top layer)
4. Selected piece highlight
5. Drag preview (semi-transparent)

### Visual Feedback

- **Hover**: Highlight piece under cursor
- **Selected**: Blue outline around piece
- **Drag Preview**: Semi-transparent piece following cursor
- **Snap Feedback**: Preview snaps to grid in real-time
- **Invalid Placement**: Red tint if placement is invalid (collision)

## Collision Detection

**Rules**:
1. Road pieces cannot overlap
2. Traffic lights can be placed anywhere (for now)
3. Future: Traffic lights should be adjacent to roads

**Implementation**:
```typescript
function checkCollision(
  newPiece: RoadPiece,
  existingPieces: RoadPiece[]
): boolean {
  return existingPieces.some(existing =>
    existing.gridX === newPiece.gridX &&
    existing.gridY === newPiece.gridY
  );
}
```

## Data Persistence

### JSON Format

```json
{
  "levelNumber": 1,
  "gridSize": 64,
  "roadPieces": [
    {
      "id": "road-1",
      "type": "straight",
      "gridX": 5,
      "gridY": 5,
      "rotation": 0,
      "connectionPoints": [
        { "localX": 0, "localY": 0, "direction": 0 },
        { "localX": 0, "localY": 1, "direction": 180 }
      ]
    }
  ],
  "trafficLightPieces": [
    {
      "id": "light-1",
      "gridX": 5,
      "gridY": 4,
      "rotation": 180,
      "type": "basic"
    }
  ],
  "metadata": {
    "createdAt": "2024-02-10T10:00:00Z",
    "version": "1.0"
  }
}
```

### Save/Load Operations

```typescript
class LevelSerializer {
  static save(editorState: EditorState): string {
    // Convert to JSON
  }

  static load(json: string): EditorState {
    // Parse and validate JSON
  }
}
```

## Asset Requirements

### Road Piece Sprites

1. **Straight Road**
   - Top view of road segment
   - Clear lane markings
   - 64x64 pixels (or grid size)

2. **Curved Road**
   - 90-degree turn
   - Smooth curve
   - 64x64 pixels

### Traffic Light Sprites

1. **Placeholder**
   - Box with directional arrow
   - Clear rotation indicator
   - 32x32 pixels (smaller than grid)

## Implementation Phases

### Phase 1: Basic Grid and Canvas (MVP)
- Grid system
- Canvas rendering
- Basic coordinate conversion
- Grid visualization

### Phase 2: Toolbox and Drag-Drop
- Toolbox panel layout
- Drag from toolbox to canvas
- Snap to grid
- Basic piece rendering (placeholder rectangles)

### Phase 3: Piece Management
- Select pieces
- Delete pieces
- Rotate pieces
- Move pieces

### Phase 4: Road Pieces
- Straight road implementation
- Curved road implementation
- Proper sprites/rendering
- Collision detection

### Phase 5: Traffic Lights
- Traffic light placement
- Rotation handling
- Visual representation

### Phase 6: Save/Load
- JSON serialization
- Save to file
- Load from file
- Validation

### Phase 7: Polish
- Visual improvements
- Keyboard shortcuts
- Undo/redo
- Connection validation (roads connect properly)

## Module Structure

```
src/renderer/
├── editor/
│   ├── EditorState.ts          # State management
│   ├── EditorCanvas.ts         # Canvas rendering and interaction
│   ├── EditorToolbox.ts        # Toolbox panel
│   ├── GridSystem.ts           # Grid calculations
│   ├── PieceRenderer.ts        # Piece rendering logic
│   ├── DragDropHandler.ts      # Drag and drop logic
│   ├── CollisionDetector.ts    # Collision detection
│   ├── LevelSerializer.ts      # JSON save/load
│   └── pieces/
│       ├── RoadPiece.ts        # Road piece definitions
│       └── TrafficLightPiece.ts # Traffic light definitions
```

## Open Questions

1. **Grid Size**: What's the optimal grid size? 64px? 32px?
2. **Connection Validation**: Should we validate that roads connect properly? Or allow free placement?
3. **Canvas Size**: Fixed size? Scrollable? Zoom in/out?
4. **Multi-lane Roads**: Do we need roads with different lane counts?
5. **Asset Creation**: Who creates the sprites? Placeholder graphics OK for now?

## Future Enhancements

1. **Undo/Redo**: Command pattern for all operations
2. **Copy/Paste**: Duplicate sections of the level
3. **Templates**: Pre-made junction configurations
4. **Validation**: Ensure level is playable (roads connect, traffic lights make sense)
5. **Zoom/Pan**: Navigate large levels
6. **Layers**: Separate layers for roads, lights, decorations
7. **Connection Snapping**: Automatically align pieces when connections are near
8. **Road Types**: Highway, residential, etc.
9. **Decorations**: Trees, buildings, etc.

## Technical Considerations

### Performance
- Render only visible pieces (if canvas becomes scrollable)
- Cache rendered pieces
- Use canvas layers for static vs dynamic content

### Accessibility
- Keyboard-only operation support
- Clear visual feedback for all actions
- Undo/redo support

### Maintainability
- Modular design - each component independent
- Clear separation of concerns
- Type-safe with TypeScript
- Well-documented interfaces

### Testing
- Unit tests for grid calculations
- Unit tests for collision detection
- Unit tests for serialization
- Manual testing for drag-drop interactions

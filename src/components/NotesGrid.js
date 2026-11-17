import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import NoteCard from './NoteCard';

const GAP = 8;
const MOVE_DURATION = 200;

// Calcula a posição de cada cartão no estilo "masonry" do Keep:
// as notas se alternam entre as colunas e cada coluna empilha seus cartões
function computeLayout(order, heights, width, columns) {
  const colWidth = (width - GAP * (columns - 1)) / columns;
  const colY = Array(columns).fill(0);
  const positions = {};
  order.forEach((note, i) => {
    const col = i % columns;
    const height = heights[note.id] ?? 0;
    positions[note.id] = { x: col * (colWidth + GAP), y: colY[col], width: colWidth, height };
    colY[col] += height + GAP;
  });
  return { positions, height: Math.max(0, ...colY.map((y) => y - GAP)) };
}

const contains = (p, x, y) => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height;

function GridItem({ note, position, dragging, animate, sortable, handlers }) {
  const left = useSharedValue(position.x);
  const top = useSharedValue(position.y);
  const start = useRef({ x: 0, y: 0 });

  // Desliza até a nova posição (exceto enquanto segue o dedo)
  useEffect(() => {
    if (dragging) return;
    left.value = animate ? withTiming(position.x, { duration: MOVE_DURATION }) : position.x;
    top.value = animate ? withTiming(position.y, { duration: MOVE_DURATION }) : position.y;
  }, [position.x, position.y, dragging, animate]);

  const animatedStyle = useAnimatedStyle(() => ({ left: left.value, top: top.value }));

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((_e, success) => success && handlers.onPress(note));

  // No modo "Personalizado", segurar e arrastar troca o cartão de lugar;
  // segurar sem mover abre o menu da nota
  const hold = sortable
    ? Gesture.Pan()
        .runOnJS(true)
        .activateAfterLongPress(300)
        .onStart(() => {
          start.current = { x: left.value, y: top.value };
          handlers.onDragStart(note.id);
        })
        .onUpdate((e) => {
          left.value = start.current.x + e.translationX;
          top.value = start.current.y + e.translationY;
          handlers.onDragMove(note.id, left.value + e.x, top.value + e.y);
        })
        .onEnd((e) => {
          const moved = Math.hypot(e.translationX, e.translationY) > 10;
          handlers.onDragEnd(note, moved);
        })
    : Gesture.LongPress()
        .runOnJS(true)
        .onStart(() => handlers.onLongPress?.(note));

  return (
    <GestureDetector gesture={Gesture.Exclusive(hold, tap)}>
      <Animated.View
        onLayout={(e) => handlers.onHeight(note.id, e.nativeEvent.layout.height)}
        style={[
          { position: 'absolute', width: position.width },
          dragging && { zIndex: 10, elevation: 8, transform: [{ scale: 1.03 }] },
          animatedStyle,
        ]}
      >
        <NoteCard note={note} />
      </Animated.View>
    </GestureDetector>
  );
}

export default function NotesGrid({
  notes, columns = 2, sortable = false, onPress, onLongPress, onReorder, onDragChange,
}) {
  const [order, setOrder] = useState(notes);
  const [heights, setHeights] = useState({});
  const [width, setWidth] = useState(0);
  const [draggingId, setDraggingId] = useState(null);
  const hoverId = useRef(null);
  const changed = useRef(false);

  // Segue a lista recebida, exceto no meio de um arraste
  useEffect(() => {
    if (!draggingId) setOrder(notes);
  }, [notes, draggingId]);

  const { positions, height } = computeLayout(order, heights, width, columns);

  // Só anima depois que todos os cartões foram medidos pela primeira vez
  const measured = order.every((n) => heights[n.id] != null);
  const ready = useRef(false);
  if (measured && width > 0) ready.current = true;

  // Refs para os gestos sempre enxergarem o estado mais recente
  const latest = useRef();
  latest.current = { positions, order, onPress, onLongPress, onReorder, onDragChange };

  const handlers = useRef({
    onPress: (note) => latest.current.onPress(note),
    onLongPress: (note) => latest.current.onLongPress?.(note),
    onHeight: (id, h) => setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h })),
    onDragStart: (id) => {
      hoverId.current = null;
      changed.current = false;
      setDraggingId(id);
      latest.current.onDragChange?.(true);
    },
    onDragMove: (id, x, y) => {
      const { positions, order } = latest.current;
      const target = order.find((n) => n.id !== id && contains(positions[n.id], x, y))?.id ?? null;
      if (target === hoverId.current) return;
      hoverId.current = target;
      if (!target) return;
      changed.current = true;
      setOrder((prev) => {
        const next = prev.filter((n) => n.id !== id);
        next.splice(prev.findIndex((n) => n.id === target), 0, prev.find((n) => n.id === id));
        return next;
      });
    },
    onDragEnd: (note, moved) => {
      const { order, onReorder, onLongPress, onDragChange } = latest.current;
      if (changed.current) onReorder?.(order.map((n) => n.id));
      else if (!moved) onLongPress?.(note);
      setDraggingId(null);
      onDragChange?.(false);
    },
  }).current;

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height, opacity: ready.current ? 1 : 0 }}
    >
      {width > 0 &&
        order.map((note) => (
          <GridItem
            key={note.id}
            note={note}
            position={positions[note.id]}
            dragging={draggingId === note.id}
            animate={ready.current}
            sortable={sortable}
            handlers={handlers}
          />
        ))}
    </View>
  );
}

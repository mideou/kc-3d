import React, { useRef, useMemo, useCallback, ReactNode } from 'react';
import { View, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture, GestureTouchEvent, TouchData } from 'react-native-gesture-handler';

/**
 * Minimal interface for the RNGH "Manual" gesture's state manager.
 * Kept local (rather than imported) since its exact export path/name has
 * moved across react-native-gesture-handler versions - only the three
 * methods we actually call are needed here.
 */
interface GestureStateManager {
  begin: () => void;
  activate: () => void;
  end: () => void;
  fail: () => void;
}

/** Synthetic pointer event shape - the subset of a browser PointerEvent
 * that three-stdlib's OrbitControls.js actually reads. */
interface SyntheticPointerEvent {
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel';
  pointerId: number;
  pointerType: 'touch';
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

type PointerEventListener = (evt: SyntheticPointerEvent) => void;

/**
 * Minimal EventTarget-like object that three-stdlib's OrbitControls can
 * call .connect() on. Implements exactly the surface OrbitControls.js
 * touches: addEventListener/removeEventListener/dispatchEvent, an
 * ownerDocument (OrbitControls adds pointermove/pointerup listeners there),
 * releasePointerCapture (no-op on RN), and clientWidth/clientHeight (used to
 * scale rotate/pan speed - kept in sync via onLayout below).
 */
export interface OrbitDomElement {
  style: Record<string, unknown>;
  clientWidth: number;
  clientHeight: number;
  ownerDocument: OrbitDomElement;
  addEventListener: (type: string, cb: PointerEventListener) => void;
  removeEventListener: (type: string, cb: PointerEventListener) => void;
  dispatchEvent: (evt: SyntheticPointerEvent) => boolean;
  releasePointerCapture: (pointerId?: number) => void;
  setPointerCapture: (pointerId?: number) => void;
  getBoundingClientRect: () => { left: number; top: number; width: number; height: number };
}

function createPointerTarget(): OrbitDomElement {
  const listeners: Record<string, PointerEventListener[]> = {};
  const target: OrbitDomElement = {
    style: {},
    clientWidth: 0,
    clientHeight: 0,
    ownerDocument: null as unknown as OrbitDomElement,
    addEventListener(type, cb) {
      (listeners[type] = listeners[type] || []).push(cb);
    },
    removeEventListener(type, cb) {
      listeners[type] = (listeners[type] || []).filter((l) => l !== cb);
    },
    dispatchEvent(evt) {
      // slice() so a listener removing itself mid-dispatch (dispose) is safe
      (listeners[evt.type] || []).slice().forEach((cb) => cb(evt));
      return true;
    },
    releasePointerCapture() {},
    setPointerCapture() {},
    getBoundingClientRect() {
      return { left: 0, top: 0, width: target.clientWidth, height: target.clientHeight };
    },
  };
  target.ownerDocument = target;
  return target;
}

export interface OrbitTouchSurfaceProps {
  /** Render-prop child receiving the shared domElement to pass to
   * <OrbitControls domElement={...} />. Typed as HTMLElement (rather than
   * our internal OrbitDomElement) purely so it satisfies drei's
   * OrbitControlsProps['domElement'] type at the call site - it's still the
   * same plain object underneath, not a real DOM element. Also accepts
   * plain ReactNode if you don't need the domElement in that subtree. */
  children: ReactNode | ((domElement: HTMLElement) => ReactNode);
  style?: StyleProp<ViewStyle>;
  /** Default true. Set to false to temporarily stop forwarding touches
   * (e.g. while a UI overlay/modal should own the gesture) without
   * unmounting the surface or losing OrbitControls' internal state. */
  enabled?: boolean;
}

/**
 * Wrap your <Canvas> with this. It captures raw multi-touch data at the
 * native View level and forwards one real pointerdown/pointermove/
 * pointerup/pointercancel event per finger - matching browser semantics -
 * to the shared domElement, which you pass to
 * <OrbitControls domElement={...} />.
 *
 * Usage:
 *
 *   <OrbitTouchSurface>
 *     {(domElement) => (
 *       <Canvas>
 *         <OrbitControls domElement={domElement} enableDamping />
 *         ...scene...
 *       </Canvas>
 *     )}
 *   </OrbitTouchSurface>
 *
 * Requires your app root to be wrapped in <GestureHandlerRootView>.
 */
export function OrbitTouchSurface({ children, style, enabled = true }: OrbitTouchSurfaceProps) {
  const domElementRef = useRef<OrbitDomElement | null>(null);
  if (!domElementRef.current) {
    domElementRef.current = createPointerTarget();
  }
  const domElement = domElementRef.current;

  const send = useCallback(
    (type: SyntheticPointerEvent['type'], t: TouchData) => {
      domElement.dispatchEvent({
        type,
        pointerId: t.id,
        pointerType: 'touch',
        pageX: t.x,
        pageY: t.y,
        clientX: t.x,
        clientY: t.y,
      });
    },
    [domElement]
  );

  // --------------------------------
  // Coalesced move dispatch: native touch ticks write into this ref
  // (cheap), a rAF loop flushes the latest position per pointer into
  // OrbitControls at most once per rendered frame.
  // --------------------------------

  const pendingMoves = useRef<Map<number, TouchData>>(new Map());
  const rafId = useRef<number | null>(null);

  const flushMoves = useCallback(() => {
    if (pendingMoves.current.size > 0) {
      pendingMoves.current.forEach((t) => send('pointermove', t));
      pendingMoves.current.clear();
    }
    rafId.current = requestAnimationFrame(flushMoves);
  }, [send]);

  const startFlushLoop = useCallback(() => {
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(flushMoves);
    }
  }, [flushMoves]);

  const stopFlushLoop = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    pendingMoves.current.clear();
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Manual()
        .onTouchesDown((e: GestureTouchEvent, manager: GestureStateManager) => {
          if (e.numberOfTouches === e.changedTouches.length) {
            manager.begin();
            manager.activate();
            startFlushLoop();
          }
          e.changedTouches.forEach((t) => send('pointerdown', t));
        })
        .onTouchesMove((e: GestureTouchEvent) => {
          // Cheap: just record latest position per finger, don't dispatch yet
          e.changedTouches.forEach((t) => pendingMoves.current.set(t.id, t));
        })
        .onTouchesUp((e: GestureTouchEvent, manager: GestureStateManager) => {
          e.changedTouches.forEach((t) => send('pointerup', t));
          if (e.numberOfTouches === 0) {
            manager.end();
            stopFlushLoop();
          }
        })
        .onTouchesCancelled((e: GestureTouchEvent, manager: GestureStateManager) => {
          e.changedTouches.forEach((t) => send('pointercancel', t));
          if (e.numberOfTouches === 0) {
            manager.fail();
            stopFlushLoop();
          }
        })
        .runOnJS(true)
        .shouldCancelWhenOutside(false)
        .enabled(enabled),
    [send, enabled, startFlushLoop, stopFlushLoop]
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      domElement.clientWidth = e.nativeEvent.layout.width;
      domElement.clientHeight = e.nativeEvent.layout.height;
    },
    [domElement]
  );

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false} style={[{ flex: 1 }, style]} onLayout={handleLayout}>
        {typeof children === 'function'
          ? children(domElement as unknown as HTMLElement)
          : children}
      </View>
    </GestureDetector>
  );
}
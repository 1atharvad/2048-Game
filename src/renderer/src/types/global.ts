declare global {
  interface Window {
    gsap: {
      fromTo: (targets: GSAPCore.TweenTarget, fromVars: GSAPCore.TweenVars, toVars: GSAPCore.TweenVars) => GSAPCore.Tween,
      set: (targets: GSAPCore.TweenTarget, vars: GSAPCore.TweenVars) => GSAPCore.Tween,
      timeline: (vars?: GSAPCore.TimelineVars) => GSAPCore.Timeline,
      to: (targets: GSAPCore.TweenTarget, vars: GSAPCore.TweenVars) => GSAPCore.Tween,
    };
    Observer: Observer;
  }
}

declare interface Observer {
  create: (vars: GSAPObserver.ObserverVars) => Observer;
}

declare namespace GSAPCore {
  type Callback = (...args: any[]) => any | null;
  type CallbackType = 'onComplete' | 'onInterrupt' | 'onRepeat' | 'onReverseComplete' | 'onStart' | 'onUpdate';
  type TimelineChild = string | Animation | Callback | Array<string | Animation | Callback>;
  type Position = number | string;
  type TweenTarget = string | object | null;
  type DOMTarget = Element | string | null | Window | ArrayLike<Element | string | Window | null>;
  type TickerCallback = (time: number, deltaTime: number, frame: number, elapsed: number) => void | null;
  type Labels = Record<string, number>;

  interface AnimationVars extends CallbackVars {
    [key: string]: any;
    data?: any;
    id?: string | number;
    paused?: boolean;
  }

  interface TimelineVars extends AnimationVars {
    delay?: number;
  }

  interface TweenVars extends AnimationVars {
    delay?: number | string;
    duration?: number | string;
  }

  interface CallbackVars {
    onComplete?: Callback;
    onReverseComplete?: Callback;
  }

  class Ticker {
    add(callback: TickerCallback, once?: boolean, prioritize?: boolean): Callback;
    lagSmoothing(threshold: number | boolean, adjustedLag?: number): void;
  }

  class Animation {
    kill(): this;
    pause(atTime?: number | string, suppressEvents?: boolean): this;
    play(from?: number | string | null, suppressEvents?: boolean): this;
    reverse(from?: number | string, suppressEvents?: boolean): this;
    progress(value: number, suppressEvents?: boolean): this;
    progress(): number;
    resume(from?: number | string, suppressEvents?: boolean): this;
    then(onFulfilled?: (result: Omit<this, 'then'>) => any): Promise<this>;
    eventCallback(type: CallbackType, callback: Callback | null, params?: any[], scope?: object): this;
    duration(value: number): this;
    duration(): number;
  }

  class Tween extends Animation {
    kill(target?: object, propertiesList?: string): this;
  }

  class Timeline extends Animation {
    labels: Labels;

    add(child: TimelineChild, position?: Position): this;
    fromTo(targets: TweenTarget, fromVars: TweenVars, toVars: TweenVars, position?: Position): this;
    from(targets: TweenTarget, fromVars: TweenVars, position?: Position): this;
    to(targets: TweenTarget, toVars: TweenVars, position?: Position): this;
    set(targets: TweenTarget, vars: TweenVars): this;
  }
}

declare namespace GSAPObserver {
  type ObserverCallback = (self: Observer) => any;

  interface ObserverVars {
    id?: string;
    onDown?: ObserverCallback;
    onUp?: ObserverCallback;
    onLeft?: ObserverCallback;
    onRight?: ObserverCallback;
    preventDefault?: boolean;
    target?: string | HTMLElement;
    tolerance?: number;
    type?: string;
  }
}

export type GSAPTimeline = GSAPCore.Timeline;
export type GSAPTween = GSAPCore.Tween;
const gsap = window.gsap;
const _Observer = window.Observer;

export {gsap, _Observer as Observer};

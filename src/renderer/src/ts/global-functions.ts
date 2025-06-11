import {Selector, Event} from './constants';

export class GlobalFunctions {
  bodyEl: HTMLBodyElement;
  csrfToken: string;
  footerEl: HTMLElement;
  headerEl: HTMLElement;

  constructor() {
    this.bodyEl = document.querySelector<HTMLBodyElement>(`${Selector.BODY}`)!;
    this.headerEl = document.querySelector<HTMLElement>(`.${Selector.HEADER}`)!;
    this.footerEl = document.querySelector<HTMLElement>(`.${Selector.FOOTER}`)!;
    this.csrfToken = this.getCSRFToken();
  }

  /**
   * Gets the value of specific CSS property of the HTML element.
   * @param element The HTML element to retrieve the property from
   * @param property The name of the CSS property.
   */
  getCSSProperty(element: HTMLElement, property: string) {
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  /**
   * Gets the value of specific CSS variable declared for the HTML element.
   * @param element The HTML element to retrieve the variable from
   * @param variable The name of the CSS variable
   */
  getCSSVariable(element: HTMLElement, variable: string) {
    return window.getComputedStyle(element).getPropertyValue(`--${variable}`)
      .split(',').map(value => parseFloat(value));
  }

  /**
   * Determines if the current device supports touchscreen capabilities.
   * @return True if the device is a touchscreen, otherwise false.
   */
  isTouchDevice(): boolean {
    return navigator.maxTouchPoints > 0;
  }

  /**
   * Rounds the value to a certain decimal point.
   * @param value The number to be rounded
   * @param decimal The number of decimal places to round to
   */
  round(value: number, decimal: number): number {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }

  /**
   * Returns a random integer between the specified minimum (inclusive) and
   * maximum (exclusive).
   *
   * @param _min - The minimum integer value (inclusive).
   * @param _max - The maximum integer value (exclusive).
   * @return A random integer >= _min and < _max.
   */
  getRandomNum(_min: number, _max: number) {
    return _min + Math.floor(Math.random() * (_max - _min))
  }

  /**
   * Gets the 2D translation values (the last two elements of the matrix) from
   * the CSS transform matrix of an HTML element.
   * @param element The HTML element from which to get the transform matrix.
   * @returns An array of two numbers representing the translation values (x
   *     and y) from the transform matrix.
   */
  getTransformMatrix(element: HTMLElement) {
    return this.getCSSProperty(element, `${Event.TRANSFORM}`)
      .split('(')[1]
      .split(')')[0]
      .split(',')
      .slice(-2)
      .map(x => parseFloat(x));
  }

  /**
   * Get the Django CSRF token from the site's cookies.
   * @return The CSRF token as a string, or null if the token is not found.
   */
  getCSRFToken() {
    const cookieSplit = document.cookie.split('csrftoken=');
    return cookieSplit.length === 2 ? cookieSplit.pop()?.split(';')[0] || '' : '';
  }

  /**
   * Throttle function
   * Limits the execution of `func` to at most once every `limit` milliseconds.
   * Useful for rate-limiting high-frequency events like scroll or resize.
   *
   * @param func - The function to be throttled
   * @param limit - Minimum time (in ms) between function executions
   * @return A throttled version of the input function
   */
  throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle = false;
  
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function
   * Delays the execution of `func` until after `delay` milliseconds have passed
   * since the last time the debounced function was invoked.
   * Useful for optimizing rapid user input events like keystrokes or window resize.
   *
   * @param func - The function to debounce
   * @param delay - Time (in ms) to wait after the last invocation before calling `func`
   * @return A debounced version of the input function
   */
  debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {func(...args)}, delay);
    };
  }
}

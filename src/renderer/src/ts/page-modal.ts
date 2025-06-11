import {type GSAPTimeline, gsap} from '../types/global';
import {Breakpoint, CSSProperty, Event, Selector} from './constants';
import {GlobalFunctions} from './global-functions';

export class PageModal extends GlobalFunctions {
  allBtns: HTMLElement[] | undefined;
  closeBtn: HTMLElement | undefined;
  funcOnModalClose: Function;
  funcOnModalOpen: Function;
  modalBtn: HTMLElement;
  modalEl: HTMLElement;
  modalWrapper: HTMLElement;
  timeline: GSAPTimeline | undefined;
  viewportHeight: number;
  viewportWidth: number;

  constructor(
    modalWrapper: HTMLElement,
    funcOnModalOpen: Function,
    funcOnModalClose: Function
  ) {
    super();
    this.modalWrapper = modalWrapper;
    this.funcOnModalOpen = funcOnModalOpen;
    this.funcOnModalClose = funcOnModalClose;
    this.modalBtn = modalWrapper.querySelector<HTMLElement>(
        `.${Selector.MODAL_BTN}`)!;
    this.modalEl = this.getModalEl(modalWrapper);

    if (this.modalEl instanceof HTMLElement) {
      this.allBtns = Array.from(this.modalEl.querySelectorAll<HTMLElement>(
          `.${Selector.JS_BUTTON}`));
      this.closeBtn = this.modalEl.querySelector<HTMLElement>(
          `.${Selector.CLOSE_BTN}`)!;
      this.timeline = this.createTimeline();
      this.eventsOnBtnCLick();
      this.eventsOnResize();
    }
    this.viewportHeight = document.documentElement.clientHeight;
    this.viewportWidth = document.documentElement.clientWidth;
  }

  /**
   * Get the element of the modal for the button, if it is present in the modal
   * wrapper or else gets the modal of the specific id.
   * @param modalWrapper The wrapper element where the button to open the modal
   *     is present.
   * @return The modal element corresponding to the modal button.
   */
  getModalEl(modalWrapper: HTMLElement) {
    let modalEl = modalWrapper.querySelector<HTMLElement>(
        `.${Selector.PAGE_MODAL}`);

    if (!modalEl) {
      const modalId = this.modalBtn.dataset.modalId;

      const pageModalEls = Array.from(document.querySelectorAll<HTMLElement>(
          `.${Selector.PAGE_MODAL}`));
      modalEl = pageModalEls.find((el) => el.dataset.id === modalId)!;
    }
    return modalEl;
  }

  /**
   * Creates the animation timeline for animating the opening and closing of
   * the modal.
   * @return The object of the timeline which can manipulated to play, pause,
   *     or reverse as per requirement.
   */
  createTimeline() {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const isDesktopView = viewportWidth >= Breakpoint.TABLET &&
        viewportHeight >= Breakpoint.MOBILE_LANDSCAPE;
    const animationDuration = isDesktopView ? 0.5 : 1;
    const opacity = this.getCSSVariable(this.modalEl,
        `${CSSProperty.OPACITY}`);
    const translateX = this.getCSSVariable(this.modalEl,
        `${CSSProperty.TRANSLATE_X}`);
    const translateY = this.getCSSVariable(this.modalEl,
        `${CSSProperty.TRANSLATE_Y}`);
    const scale = this.getCSSVariable(this.modalEl, `${CSSProperty.SCALE}`);
    const timeline = gsap.timeline({
      paused: true,
      ease: 'power1.out'
    });
    timeline.fromTo(this.bodyEl, {'--bg-opacity': 0},
        {'--bg-opacity': 0.4, duration: animationDuration}, 0);

    timeline.fromTo(this.modalEl,
        {
          autoAlpha: opacity[0],
          scale: scale[0],
          xPercent: translateX[0],
          yPercent: translateY[0]
        },
        {
          autoAlpha: opacity[1],
          scale: scale[1],
          xPercent: translateX[1],
          yPercent: translateY[1],
          duration: animationDuration
        }, 0);

    return timeline;
  }

  /**
   * Kills the modal animation timeline when there are changes to the initial
   * and final points of the animations while resizing, and removes all the
   * rules set by the timeline of the previous animation. Also, closes the
   * modal if opened.
   */
  killTimeline() {
    const viewportHeight = document.documentElement.clientHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const killTimeline = (viewportWidth >= Breakpoint.TABLET &&
        this.viewportWidth < Breakpoint.TABLET) ||
        (viewportWidth < Breakpoint.TABLET &&
            this.viewportWidth >= Breakpoint.TABLET) ||
        (viewportHeight >= Breakpoint.MOBILE_LANDSCAPE &&
            this.viewportHeight < Breakpoint.MOBILE_LANDSCAPE) ||
        (viewportHeight < Breakpoint.MOBILE_LANDSCAPE &&
            this.viewportHeight >= Breakpoint.MOBILE_LANDSCAPE);

    if (this.timeline && killTimeline) this.timeline.kill();
    this.modalClose(true);

    if (this.timeline && killTimeline) {
      gsap.set([this.modalEl, this.bodyEl], {clearProps: 'all'});
      this.timeline = undefined;
    }
  }

  /**
   * Executes the function to open a specific model, while also triggering the
   * animation for the model's opening and updating the ARIA labels when the
   * model is open.
   */
  modalOpen() {
    this.funcOnModalOpen();
    this.modalEl.classList.add(`${Selector.MODAL_OPEN}`);
    this.modalEl.classList.remove(`${Selector.HIDE_MODAL}`);
    this.modalEl.setAttribute(`${Event.ARIA_HIDDEN}`, 'false');
    this.bodyEl.classList.add(`${Selector.SCROLL_HIDDEN}`);
    if (this.timeline) this.timeline.play();
  }

  /**
   * Executes the function to close a specific model, while also triggering the
   * animation for the model's closing and updating the ARIA labels when the
   * model is closed.
   */
  modalClose(immediate: boolean) {
    this.funcOnModalClose();
    this.modalEl.classList.remove(`${Selector.MODAL_OPEN}`);
    this.modalEl.setAttribute(`${Event.ARIA_HIDDEN}`, 'true');

    if (this.timeline) {
      this.timeline.eventCallback(Event.ON_REVERSE_COMPLETE, () => {
        this.modalEl.scroll(0, 0);
        this.modalEl.classList.add(`${Selector.HIDE_MODAL}`);
        this.bodyEl.classList.remove(`${Selector.SCROLL_HIDDEN}`);
      });

      if (!immediate) this.timeline.reverse();
      else this.timeline.pause().progress(0);
    }
  }

  /**
   * Manages events related to page modal button clicks, including opening,
   * closing, and other modal interactions.
   */
  eventsOnBtnCLick() {
    this.modalBtn.addEventListener(Event.CLICK, this.modalOpen.bind(this));
    this.closeBtn?.addEventListener(Event.CLICK,
        this.modalClose.bind(this, false));
    this.allBtns?.map(btn => {
      btn.addEventListener(Event.CLICK,
          this.modalClose.bind(this, btn.dataset.immediateClose === 'true'));
    });
  }

  /**
   * Executes essential functions when the window is resized, such as
   * terminating the existing timeline, creating a new one based on the
   * updated window and component dimensions, etc.
   */
  eventsOnResize() {
    window.addEventListener(Event.RESIZE, () => {
      if (this.viewportHeight === document.documentElement.clientHeight &&
          this.viewportWidth === document.documentElement.clientWidth) {
        return;
      }

      this.killTimeline();
      
      if (!this.timeline) this.timeline = this.createTimeline();
      this.viewportHeight = document.documentElement.clientHeight;
      this.viewportWidth = document.documentElement.clientWidth;
    });
  }
}

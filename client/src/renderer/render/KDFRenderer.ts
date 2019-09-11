/** @format */

import { RenderMode } from "./index";
import { convertToPixels } from "../helpers/units";

/**
 * @TODO
 * The following 6 constants will need to be retrieved dynamically from the
 * Redux store once styles have been added. For now, they can be hard coded
 * here.
 */
const PAGE_HEIGHT = "170mm";
const PAGE_WIDTH = "140mm";

// Clockwise from the top
const PAGE_MARGIN_TOP = "1cm";
const PAGE_MARGIN_RIGHT = "1cm";
const PAGE_MARGIN_BOTTOM = "1cm";
const PAGE_MARGIN_LEFT = "1cm";

/**
 * A renderer for KDF nodes.
 *
 * @description
 * The renderer has a number of major responsibilities, which it must complete
 * within a timely manner to prevent the user experiencing any input lag. These
 * responsibilities can be loosly defined as the following:
 *
 *  1. Determine when to wrap content to another page.
 *  2. Use a scratch render to predict the size of a node.
 *  3. Use caching to skip the above step whenever possible.
 *  4. Know when to invalidate a node's cache.
 *  5. Handle the possible render modes.
 *
 * @example
 * const renderer = new KDFRenderer(nodes, pageStyles);
 */
export default class KDFRenderer {
  private options: { renderMode: RenderMode };
  private pages: Array<Array<object>>;
  private currentPage: Array<object>;
  private workingHeight: number;
  private workingWidth: number;
  private currentHeight: number;

  /**
   * Constructs a new KDF Renderer.
   *
   * @param nodes An array of KDF nodes to render.
   * @param pageStyles Page styles object.
   * @param options Optional renderer configuration.
   *
   * @example
   * new KDFRenderer(nodes, pageStyles, {
   *   mode: RenderMode.CONTENT,
   * })
   */
  constructor(
    private nodes: Array<object>,
    pageStyles: {
      width: string;
      height: string;
      marginTop: string;
      marginRight: string;
      marginBottom: string;
      marginLeft: string;
    },
    options: {} = {},
  ) {
    // Renderer options.
    this.options = {
      renderMode: RenderMode.CONTENT,
      ...options,
    };

    // A stack of pages, where each page is also a stack.
    this.pages = [];

    // A stack of rendered nodes in the current page.
    this.currentPage = [];

    // Calculate available working height and width
    this.workingHeight =
      convertToPixels(pageStyles.height) -
      convertToPixels(pageStyles.marginTop) -
      convertToPixels(pageStyles.marginBottom);
    this.workingWidth =
      convertToPixels(pageStyles.width) -
      convertToPixels(pageStyles.marginLeft) -
      convertToPixels(pageStyles.marginRight);

    this.currentHeight = this.workingHeight;
  }
}

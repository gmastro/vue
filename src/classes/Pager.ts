import type { Options, PaginationOptions, PagerOptions, PagerNodes } from "@/interfaces/options"
import { uriGenerator } from "@/functions/helpers"
import { Paginate } from "@/classes/Paginate"
import type { RouteLocationRaw } from "vue-router";

export const pagerDefaultOptions: PagerOptions = {
    url                 : "",
    query               : {
        page                : "page",
        items               : "items",
    },
    items               : 5n,
    direction           : "both",
    show                : {
        firstLast           : true,
        previousNext        : true,
    },
    buttons             : {
        first               : "&lt;&lt;",
        previous            : "&lt;",
        next                : "&gt;",
        last                : "&gt;&gt;",
        page                : "...",
    }
};

/**
 * Pager
 *
 * Creates those nodes required for displaying pagination selections.
 * It will not generate the template, instead it will provide a list of available buttons and whether those buttons
 * are active or not
 *
 * @version 0.0.1
 */
export class Pager
{
    /**
     * Nodes Property
     */
    private nodes: PagerNodes[] = [];

    /**
     * Temporary Nodes Property
     *
     * Temporary container for the nodes
     *
     * @access  private
     * @var     PagerNodes[] tmpNodes
     */
    private tmpNodes: PagerNodes[] = [];

    /**
     * Constructor
     *
     * @param   paginate Paginate hard dependency
     * @param   options Set of options to display pager buttons
     */
    constructor(
        public readonly paginate: Paginate,
        public readonly options:PaginationOptions | PagerOptions | Options = {}
    ) {
        this.options = {...pagerDefaultOptions, ...options};
    };

    /**
     * Pagination Url
     *
     * Creates the link for the given node.
     *
     * @param   value Value which will be added to the given path replacing current page
     * @return  string
     */
    private url = (value: string | number | bigint | null): string =>
        uriGenerator(this.options.url, value !== null ? {[this.options.query.page]: value} : {});

    /**
     * Pager Node Object
     *
     * Gathers all required data to struct a node
     *
     * @param   text Message or an identifier related to the given node
     * @param   link Uri location to redirect when activating this node
     * @param   active Enable or disable the node
     * @return  PagerNodes
     */
    private toNode = (text: bigint | string, link: string | RouteLocationRaw, active: boolean = true): PagerNodes =>
        ({
            text    : text.toLocaleString(),
            link    : link,
            active  : active
        });

    /**
     * Wrapper Buttons
     *
     * Adds all those wrapper nodes pointing to previous/next and/or first/last
     *
     * @param   name Name of the wrapper
     * @param   value Next or previous node value
     * @param   boundary Min or Max value for the given node
     * @param   show If this wrapper is displayed
     * @return  void
     */
    private wrapper = (name: string, value: bigint, active: boolean, show: boolean = false): void => {
        if(show === false) {
            return;
        }

        this.nodes.push(this.toNode(this.options.buttons[name], this.url(value), active));
    };

    /**
     * Before Current Page
     *
     * Verifies if a node will be added before current page node.
     * Nodes will be added only and if current page is a N+ number greater than 1
     *
     * @param   index Counter for all those nodes added, it shouldn't exceed given limit via options
     * @param   node Node numeric value. The same value will be used as the identifier name for the given node
     * @return  BigInt[]
     */
    private before = (index: bigint, node: bigint): bigint[] => {
        if (this.options.direction == "after") {
            return [index, node];
        }

        if (node > this.paginate.PAGE && index <= this.options.items) {
            ++index
            --node
            this.tmpNodes.unshift(this.toNode(node, this.url(node)));
        }

        return [index, node];
    }

    /**
     * After Current Page
     *
     * Verifies if a node will be added after current page node.
     * Nodes will be added only and if current page is a N+ number greater than 1 and has not yet reaced last page
     *
     * @access  private
     * @param   index Counter for all those nodes added, it shouldn't exceed given limit via options
     * @param   node Node numeric value. The same value will be used as the identifier name for the given node
     * @return  BigInt[]
     */
    private after = (index: bigint, node: bigint): bigint[] => {
        if (this.options.direction == "before") {
            return [index, node];
        }

        if (this.paginate.pageLast > node && index <= this.options.items) {
            ++index;
            ++node;
            this.tmpNodes.push(this.toNode(node, this.url(node)));
        }

        return [index, node];
    }

    /**
     * Generate Nodes
     *
     * Add before and after current page nodes.
     *
     * @access  private
     * @return  void
     */
    private generate = (): void => {
        if(this.options.items <= 0) {
            return;
        }

        this.tmpNodes.push(this.toNode(this.paginate.pageCurrent, this.url(this.paginate.pageCurrent), false));

        for(
            let i: bigint = this.paginate.PAGE, index: bigint = this.paginate.PAGE, forward: bigint = this.paginate.pageCurrent, back: bigint = this.paginate.pageCurrent;
            i < this.options.items;
            [index, forward] = this.after(index, forward), [index, back] = this.before(index, back), i = index > i ? index : i+this.paginate.PAGE
        );
    };

    /**
     * Create Pager Nodes
     *
     * It will add wrapper and numeric nodes.
     *
     * @access  public
     * @return  Pager
     */
    public run = (): Pager => {
        if(this.paginate.total !== 0) {
            const hasPrevious: boolean = !(this.paginate.pagePrevious == null);
            const hasNext: boolean = !(this.paginate.pageNext == null);
            this.wrapper('first', this.paginate.pageFirst, hasPrevious, this.options.show.firstLast);
            this.wrapper(
                'previous',
                this.paginate.pagePrevious ?? this.paginate.pageFirst,
                hasPrevious,
                this.options.show.previousNext
            );
            this.generate();
            this.nodes = [...this.nodes, ...this.tmpNodes];
            this.wrapper(
                'next',
                this.paginate.pageNext ?? this.paginate.pageLast,
                hasNext,
                this.options.show.previousNext
            );
            this.wrapper('last', this.paginate.pageLast, hasNext, this.options.show.firstLast);
        }

        return this;
    };

    /**
     * Nodes Getter
     *
     * Will return wrapper and generated nodes
     *
     * @access  public
     * @return  PagerNodes[]
     */
    public getContent = (): PagerNodes[] => this.nodes;
}

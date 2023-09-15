import { useRoute, type LocationQuery } from 'vue-router';
import { has } from '@/functions/helpers';

export interface Options {
    [_:string]  : string | boolean | number | bigint | object
};

export interface BoundariesOptions extends Options {
    firstLast   : boolean,
    previousNext: boolean,
};

export interface UrlOptions extends Options {
    uriQueryPageName    : string,
    uriQueryItemsName   : string
}

export type PagerOptions = {
    url?        : string,
    items       : bigint,
    direction   : "both" | "before" | "after",
    show        : BoundariesOptions,
    buttons     : {
        [_:string]  : string | number | bigint,
        first       : string | "<<" | "&lt;&lt;",
        previous    : string | "<" | "&lt;",
        next        : string | ">" | "&gt;",
        last        : string | ">>" | "&gt;&gt;",
        page        : string | number | bigint | "...",
    }
};

export type PagerNodes = {
    text: string,
    link: string,
    active: boolean,
};

export const boundaries: BoundariesOptions = {
    firstLast   : true,
    previousNext: true,
};

export const paging: PagerOptions = {
    items       : 5n,
    direction   : "both",
    show        : boundaries,
    buttons     : {
        first       : "&lt;&lt;",
        previous    : "&lt;",
        next        : "&gt;",
        last        : "&gt;&gt;",
        page        : "...",
    }
};

/**
 * 
 */
export class Paginate
{
    /**
     * URI Query Parameters Property
     *
     * This is not asynchronous, it returns actual results from the router
     *
     * @access  private
     * @readonly
     * @var     LocationQuery query
     * @todo    Replace this in case there is an asynchornous request
     */
    private readonly query: LocationQuery = useRoute().query;

    /**
     * Data Length Property
     *
     * Batch tuples size
     *
     * @access  public
     * @readonly
     * @var     number dataLength
     */
    public readonly dataLength!: number;

    /**
     * Items Property
     *
     * Holds processed ready for display chunks of the original data
     *
     * @access  public
     * @readonly
     * @var     any[] items
     */
    public readonly items: any[] = [];

    /**
     * Items Per Page Property
     *
     * How many items will be displayed per page, usable for creating the chunks in {@see this.items}
     *
     * @access  private
     * @var     bigint _itemsPerPage
     */
    private _itemsPerPage: bigint = 20n;

    /**
     * Items Per Page Setter
     *
     * Accessor for setting required items per page using uri query input
     *
     * @access  private
     * @param   bigint ipp Items per page
     */
    private set itemsPerPage(ipp: bigint) {
        this._itemsPerPage = ipp < 1n ? this._itemsPerPage : ipp;
    };

    /**
     * Items Per Page Getter
     *
     * Accessor for getting items per page
     *
     * @access  public
     * @return  bigint
     */
    public get itemsPerPage(): bigint {
        return this._itemsPerPage;
    };

    /**
     * Pages Property
     *
     * Calculated pages right after the original data is chunked.
     *
     * @access  public
     * @readonly
     * @var     bigint pages
     */
    public readonly pages: bigint = 0n;

    /**
     * First Page Property
     *
     * First page numeric value
     *
     * @access  public
     * @readonly
     * @var     bigint pageFirst
     */
    public readonly pageFirst: bigint = 1n;

    /**
     * Current Page Property
     *
     * Current page numeric value
     *
     * @access  private
     * @var     bigint _pageCurrent
     */
    private _pageCurrent: bigint = 1n;

    /**
     * Previous Page Property
     *
     * Previous page numeric value
     *
     * @access  private
     * @var     bigint _pagePrevious
     */
    private _pagePrevious: bigint | null = null;

    /**
     * Next Page Property
     *
     * Next page numeric value
     *
     * @access  private
     * @var     bigint _pageNext
     */
    private _pageNext: bigint | null = null;

    /**
     * Page Current Setter
     *
     * Accessor for setting current page
     *
     * @access  private
     * @param   bigint pc Current page value
     */
    private set pageCurrent(pc: bigint) {
        this._pageCurrent = pc > this.pages ? this.pages : (pc === 0n ? 1n : pc);
        this._pagePrevious = this.pageCurrent === 1n ? null : this.pageCurrent - 1n;
        this._pageNext = this.pageCurrent === this.pageLast ? null : this.pageCurrent + 1n;
    };

    /**
     * Page Current Getter
     *
     * Accessor for getting current page
     *
     * @access  public
     * @return  bigint
     */
    public get pageCurrent(): bigint {
        return this._pageCurrent;
    };

    /**
     * Page Prev Getter
     *
     * Accessor for getting current page
     *
     * @access  public
     * @return  bigint | null
     */
    public get pagePrevious(): bigint | null {
        return this._pagePrevious;
    };

    /**
     * Page Prev Getter
     *
     * Accessor for getting current page
     *
     * @access  public
     * @return  bigint | null
     */
    public get pageNext(): bigint | null {
        return this._pageNext;
    };

    /**
     * Last Page Property
     *
     * Last page numeric value
     *
     * @access  public
     * @readonly
     * @var     bigint _pageLast
     */
    private _pageLast: bigint = 1n;

    /**
     * Last Page Setter
     *
     * Accessor for setting last page
     *
     * @access  private
     * @param   bigint pl Last page value
     */
    private set pageLast(pl: bigint) {
        this._pageLast = pl;
    }

    /**
     * Last Page getter
     *
     * Accessor for getting last page
     *
     * @access  public
     * @return  bigint
     */
    public get pageLast(): bigint {
        return this._pageLast;
    }

    /**
     * Paginate Constructor
     *
     * Performs all the calculations needed to chunk the data and display the table contents
     *
     * @param   object data Initial unprocessed list of tuples used for the table and generating paginator nodes
     * @param   any[] options Set of instructions from the query - to what will be displayed
     */
    constructor(
        public readonly data: any[],
        public readonly options: UrlOptions = {
            uriQueryPageName    : "page",
            uriQueryItemsName   : "items"
        }
    ) {
        this.dataLength = data.length;
        this.options = {...this.options, ...options};

        this.itemsPerPage = this.queryParamToBigInt(this.options.uriQueryItemsName);

        this.pages = BigInt(Math.ceil(this.dataLength/Number(this.itemsPerPage)));
        this.pageLast = this.pages;
        this.pageCurrent = this.queryParamToBigInt(this.options.uriQueryPageName);
        this.dataToItems();
    }

    /**
     * Query Param To BigInt
     *
     * Casts parameter in case that exists to string
     *
     * @access  private
     * @param   string q Name of query attribute
     * @return  bigint
     */
    private queryParamToBigInt = (q : string) : bigint => {
        const v: string = this.query[q]?.toString() || "";
        return /^\d+$/.test(v) ? BigInt(v): 0n
    };

    /**
     * Chunk Data
     *
     * Will create chunks of the original data as pages
     *
     * @access  private
     * @param   string q Name of query attribute
     * @return  void
     */
    private dataToItems = (): void => {
        const ipp: number = Number(this.itemsPerPage);
        let i: number,
            j: number = ipp;

        for(i = 0, j; i < this.dataLength; this.items.push(this.data.slice(i, j)), i += ipp, j += ipp);
    };

    /**
     * Content Getter
     *
     * Returns the items
     */
    public getContent = (): any[] => this.items?.[Number(this.pageCurrent - 1n)] ?? [];

    /**
     * Range Getter
     *
     * Numeric range of chunked items
     */
    public getRange = (): {items: bigint, from: bigint, to: bigint, total: bigint} => {
        const total = BigInt(this.dataLength);

        if (total === 0n) {
            return {
                items   : this.itemsPerPage,
                from    : 0n,
                to      : 0n,
                total   : 0n
            };
        }

        const from: bigint = (this.pageCurrent - 1n) * this.itemsPerPage;
        const to: bigint = from + this.itemsPerPage;
        return {
            items   : this.itemsPerPage,
            from    : from,
            to      : to > total ? total : to,
            total   : total,
        };
    }
}

/**
 * Pagination Nodes
 *
 * Gets all those boundaries and active pages and returns a list of nodes containing display information.
 *
 * @version 0.0.1
 */
export class Pager
{
    private nodes: PagerNodes[] = [];

    private indexedNodes: PagerNodes[] = [];

    constructor(public readonly pages: Paginate, public readonly options:PagerOptions = paging) {
        this.pages = pages;
        this.options = {...this.options, ...options};

        if(has('url', Object.keys(this.options)) === false || this.pages.getContent().length === 0) {
            return;
        }

        this.wrapper('first', this.options.show.firstLast, this.pages.pageFirst, this.pages.pagePrevious);
        this.wrapper('previous', this.options.show.previousNext, this.pages.pageFirst, this.pages.pagePrevious);
        this.generate();
        this.nodes = [...this.nodes, ...this.indexedNodes];
        this.wrapper('next', this.options.show.previousNext, this.pages.pageLast, this.pages.pageNext);
        this.wrapper('last', this.options.show.firstLast, this.pages.pageLast, this.pages.pageNext);
    };

    private url = (value: string | number | bigint | null): string => {
        const query = (value === null)
            ? useRoute().query
            : {...useRoute().query, ...{[this.pages.options.uriQueryPageName]: value}};

        return useRoute().path + '?' + Object.keys(query).map((k:string) => `${k}=${query[k]}`).join('&');
    }

    private wrapper = (name: string, show: boolean = false, boundary: bigint, value: bigint | null = 1n): void => {
        if(show === false) {
            return;
        }

        this.nodes.push({
            text    : this.options.buttons[name].toLocaleString(),
            link    : this.url(value ?? boundary),
            active  : !(value == null)
        });
    };

    private before = (index: bigint, node: bigint): bigint[] => {
        if (this.options.direction == "after") {
            return [index, node];
        }

        if (node > 1n && index <= this.options.items) {
            ++index
            --node
            this.indexedNodes.unshift({
                text:   node.toLocaleString(),
                link:   this.url(node),
                active: true,
            });
        }

        return [index, node];
    }

    private after = (index: bigint, node: bigint): bigint[] => {
        if (this.options.direction == "before") {
            return [index, node];
        }

        if (this.pages.pageLast > node && index <= this.options.items) {
            ++index;
            ++node;
            this.indexedNodes.push({
                text:   node.toLocaleString(),
                link:   this.url(node),
                active: true,
            });
        }

        return [index, node];
    }

    private generate = (): void => {
        if(this.options.items <= 0) {
            return;
        }

        this.indexedNodes.push({
            text:   this.pages.pageCurrent.toLocaleString(),
            link:   this.url(this.pages.pageCurrent),
            active: false,
        });

        for(
            let i: bigint = 1n, index: bigint = 1n, forward: bigint = this.pages.pageCurrent, back: bigint = this.pages.pageCurrent;
            i < this.options.items;
            [index, forward] = this.after(index, forward), [index, back] = this.before(index, back), i = index > i ? index : i+1n
        );
    };

    public getContent = (): PagerNodes[] => this.nodes;
}

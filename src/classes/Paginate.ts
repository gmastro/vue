import type { LocationQuery } from 'vue-router';
import type { PaginationOptions, PaginateOptions, Options, PaginateRanges } from "@/interfaces/options";

/**
 * Collects a flattened array of the very same data structure and chunks it into pages
 */
export class Paginate
{
    /**
     * Page Entity Property
     *
     * A single page as a physical entity. Always 1
     *
     * @access  public
     * @readonly
     * @var     bigint PAGE
     */
    public readonly PAGE: bigint = 1n;

    /**
     * Item Entity Property
     *
     * A single item as a physical entity. Always 1 as long as there is data
     *
     * @access  public
     * @readonly
     * @var     bigint ITEM
     */
    public readonly ITEM: bigint = 1n;

    /**
     * Data Length Property
     *
     * Batch tuples size
     *
     * @access  public
     * @readonly
     * @var     number total
     */
    public readonly total!: number;

    /**
     * Pages Property
     *
     * Holds processed ready for display chunks of the original data
     *
     * @access  public
     * @readonly
     * @var     any[] pages
     */
    public readonly pages: any[] = [];

    /**
     * Items Per Page Property
     *
     * How many items will be displayed per page, usable for creating the chunks in items
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
        this._itemsPerPage = ipp < this.PAGE ? this._itemsPerPage : ipp;
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
     * First Page Property
     *
     * First page numeric value
     *
     * @access  public
     * @readonly
     * @var     bigint pageFirst
     */
    public readonly pageFirst: bigint = 0n;

    /**
     * Current Page Property
     *
     * Current page numeric value
     *
     * @access  private
     * @var     bigint _pageCurrent
     */
    private _pageCurrent: bigint = 0n;

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
        const current: bigint = pc < this.PAGE ? this.PAGE : pc;
        this._pageCurrent = current > this.pageLast ? this.pageLast : current;
        this._pagePrevious = this.pageCurrent <= this.PAGE ? null : this.pageCurrent - this.PAGE;
        this._pageNext = this.pageCurrent >= this.pageLast ? null : this.pageCurrent + this.PAGE;
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
    private _pageLast: bigint = 0n;

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
     * @param   data list of tuples to paginate
     * @param   options Set of instructions from the query - to what will be displayed
     */
    constructor(public readonly options: PaginationOptions | PaginateOptions | Options) {
        this.total = this.options.data.length;
        this.pageFirst = BigInt(this.total !== 0);
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
    private queryParamToBigInt = (query: LocationQuery, q : string) : bigint => {
        const v: string = query[q]?.toString() || "";
        return /^\d+$/.test(v) ? BigInt(v): 0n
    };

    /**
     * Paginate data
     *
     * It will chunk data based on items per page. Also will calculated maximum size and current page
     *
     * @access  public
     * @param   query Query containing current page. This is optional
     * @return  void
     */
    public run = (query: LocationQuery): void => {
        if (this.total === 0) {
            return;
        }

        this.itemsPerPage = this.queryParamToBigInt(query, this.options.query.items);
        this.pageLast = BigInt(Math.ceil(this.total/Number(this.itemsPerPage)));
        this.pageCurrent = this.queryParamToBigInt(query, this.options.query.page);

        const ipp: number = Number(this.itemsPerPage);
        let i: number,
            j: number = ipp;

        for(i = 0, j; i < this.total; this.pages.push(this.options.data.slice(i, j)), i += ipp, j += ipp);
    }

    /**
     * Content Getter
     *
     * Returns chunked items
     *
     * @access  public
     * @return  any[]
     */
    public getContent = (): any[] => this.pages?.[Number(this.pageCurrent - this.PAGE)] ?? [];

    /**
     * Range Getter
     *
     * Numeric range of chunked items
     *
     * @access  public
     * @return  PagerRanges
     */
    public ranges = (): PaginateRanges => {
        const total = BigInt(this.total);

        if (total === 0n) {
            return {
                items   : this.itemsPerPage,
                from    : 0n,
                to      : 0n,
                total   : 0n
            };
        }

        const from: bigint = (this.pageCurrent - this.PAGE) * this.itemsPerPage;
        const to: bigint = from + this.itemsPerPage;
        return {
            items   : this.itemsPerPage,
            from    : from + this.ITEM,
            to      : to > total ? total : to,
            total   : total,
        };
    }
}

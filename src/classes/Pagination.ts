import type { LocationQuery } from 'vue-router';
import type { Options, PaginateRanges, PaginationOptions } from "@/interfaces/options";
import { Paginate } from "@/classes/Paginate";
import { Pager } from "@/classes/Pager";

export type PaginationType = {
    paginate: Paginate,
    pager   : Pager
};

/**
 * Pagination Class
 *
 * This class combines pagination and pager classes.
 * More or less is used as a pseudo-facade, pseudo-proxy class, pseudo-prototype. It has not yet been decided.
 */
export class Pagination
{
    /**
     * Out Property
     *
     * Holds the content from the classes and their results used to provide the content.
     *
     * @access  private
     * @var     out
     */
    private out!: PaginationType;

    /**
     * 
     * @param   options Set of options either 
     */
    constructor(public readonly options: PaginationOptions | Options) {}

    /**
     * Concatenate to output
     *
     * Shallow merge of objects
     *
     * @access  private
     * @param   o Object to merge, replace current output
     * @return  void
     */
    private concat = (o: object): void => {this.out = {...this.out, ...o}}

    /**
     * Execute
     *
     * It will paginate the content, provide the limits and calculate all those links that will trigger all pagination
     * buttons.
     *
     * @param   query Uri query provided via useRoute class.
     * @return  void
     */
    public run = (query: LocationQuery): void => {
        let paginate: Paginate = new Paginate(this.options);

        paginate.run(query);
        this.concat({paginate: paginate, pager: (new Pager(paginate, this.options)).run()});
    }

    /**
     * Paginate Object
     *
     * Returns a paginate object right after all performed calculations
     *
     * @access  public
     * @return  Paginate
     */
    public paginate = (): Paginate => this.out.paginate;

    /**
     * Pager Object
     *
     * Returns a pager object right after all performed calculations.
     * This object in order to return results is tightly coupled to paginate object.
     *
     * @access  public
     * @return  Pager
     */
    public pager = (): Pager => this.out.pager;
}

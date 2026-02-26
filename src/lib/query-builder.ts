/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostgrestError } from "@supabase/supabase-js";
export default class QueryBuilder<T = any> {
  private query: any;
  constructor(query: any) {
    this.query = query;
  }

  filter(
    condition: boolean,
    column: string,
    value: any,
    operator:
      | "eq"
      | "neq"
      | "gt"
      | "lt"
      | "gte"
      | "lte"
      | "like"
      | "ilike"
      | "in" = "eq",
  ) {
    if (condition) {
      switch (operator) {
        case "in":
          this.query = this.query.in(column, value);
          break;
        default:
          this.query = this.query[operator](column, value);
      }
    }
    return this;
  }

  search(columns: string[], searchQuery: string) {
    if (searchQuery) {
      const orQuery = columns
        .map((col) => `${col}.ilike.%${searchQuery}%`)
        .join(",");
      this.query = this.query.or(orQuery);
    }
    return this;
  }

  sort(column: string, ascending: boolean = true) {
    this.query = this.query.order(column, { ascending });
    return this;
  }

  paginate(page: number = 1, limit: number = 20) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    this.range(start, end);
    return this;
  }

  range(start: number, end: number) {
    this.query = this.query.range(start, end);
    return this;
  }

  async build(): Promise<{
    data: T[];
    count: number;
    error: PostgrestError | null;
    success: boolean;
  }> {
    const { data, error, count } = await this.query;

    if (error) {
      console.error("Query Execution Error:", error);
      return { data: [], count: 0, error, success: false };
    }

    return {
      data: data as T[],
      count: count || 0,
      error: null,
      success: true,
    };
  }
}

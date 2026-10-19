export type ActionResult<TData = undefined, TCode extends string = string> =
	| { success: true; data: TData }
	| { success: false; code: TCode; message?: string };

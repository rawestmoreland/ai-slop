/**
 * Narrow a caught PocketBase ClientResponseError to a specific field validation code.
 *
 * ClientResponseError.data is a getter returning this.response, which is the full
 * response body: { data: { [field]: { code, message } }, message, status }.
 * Field errors live at error.data.data[field], not error.data[field].
 */
export function isPocketBaseFieldError(
  err: unknown,
  field: string,
  code: string,
): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const response = (err as Record<string, unknown>)['data'];
  if (typeof response !== 'object' || response === null) return false;
  const fieldErrors = (response as Record<string, unknown>)['data'];
  if (typeof fieldErrors !== 'object' || fieldErrors === null) return false;
  const fieldErr = (fieldErrors as Record<string, unknown>)[field];
  if (typeof fieldErr !== 'object' || fieldErr === null) return false;
  return (fieldErr as Record<string, unknown>)['code'] === code;
}

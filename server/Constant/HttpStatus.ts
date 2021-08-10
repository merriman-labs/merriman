export enum HttpStatus {
  /**
   * The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource. The new resource is effectively created before this response is sent back and the new resource is returned in the body of the message, its location being either the URL of the request, or the content of the Location header.
   */
  Created = 201,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409
}

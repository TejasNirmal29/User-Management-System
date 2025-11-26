import MESSAGES from "@constants/message.mts";
import HttpResponse from "@utils/response.mts"  
import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

// Middleware to validate request payloads based on validators
const validate = (req: Request, res: Response, next: NextFunction): void => {
  // Extract validation errors from the request
  const errors = validationResult(req)

  // Check if there are any validation errors
  if (!errors.isEmpty()) {
    // Respond with all validation errors
    return HttpResponse.badRequest(
      res,
      MESSAGES.ERROR.VALIDATION_FAILED,
      errors.array()[0]
    )
  }

  // Proceed to the next middleware or route handler
  next()
}

export default validate

export const ERROR_CODES = {
  "INVALID_USER_ID": {
    "statusCode": 400,
    "message": "userId / friendId / toUserId is malformed"
  },
  "INVALID_SECTION_ID": {
    "statusCode": 400,
    "message": "sectionId is malformed"
  },
  "INVALID_ACTION": {
    "statusCode": 400,
    "message": "action field has an unrecognised value"
  },
  "INVALID_MODE": {
    "statusCode": 400,
    "message": "mode field has an unrecognised value"
  },
  "INVALID_FORMAT": {
    "statusCode": 400,
    "message": "Uploaded media is not a supported format"
  },
  "INVALID_ASPECT_RATIO": {
    "statusCode": 400,
    "message": "Uploaded image does not meet required ratio"
  },
  "FILE_TOO_LARGE": {
    "statusCode": 400,
    "message": "Uploaded file exceeds the size limit"
  },
  "FIELD_TOO_LONG": {
    "statusCode": 400,
    "message": "A text field exceeds its character limit"
  },
  "AUTHOR_REQUIRED": {
    "statusCode": 400,
    "message": "Non-anonymous request is missing author"
  },
  "AUTHOR_MISMATCH": {
    "statusCode": 403,
    "message": "Author does not match authenticated caller"
  },
  "FORBIDDEN": {
    "statusCode": 403,
    "message": "Caller lacks permission for this action"
  },
  "CANNOT_ADD_YOURSELF": {
    "statusCode": 403,
    "message": "Cannot send a friend request to yourself"
  },
  "CANNOT_VOTE_SELF": {
    "statusCode": 403,
    "message": "Cannot vote for your own image"
  },
  "VOTING_CLOSED": {
    "statusCode": 403,
    "message": "The voting window is not currently active"
  },
  "USER_NOT_FOUND": {
    "statusCode": 404,
    "message": "No user with the given ID exists"
  },
  "SECTION_NOT_FOUND": {
    "statusCode": 404,
    "message": "No section with the given ID exists"
  },
  "REQUEST_NOT_FOUND": {
    "statusCode": 404,
    "message": "No friend request with the given ID exists"
  },
  "IMAGE_NOT_FOUND": {
    "statusCode": 404,
    "message": "Target user has not submitted an image"
  },
  "NOT_FRIENDS": {
    "statusCode": 404,
    "message": "The two users are not currently friends"
  },
  "NO_FINAL_IMAGE": {
    "statusCode": 404,
    "message": "No winning image has been finalised yet"
  },
  "REQUEST_ALREADY_SENT": {
    "statusCode": 409,
    "message": "A pending request already exists"
  },
  "ALREADY_FRIENDS": {
    "statusCode": 409,
    "message": "The two users are already friends"
  },
  "REQUEST_NOT_PENDING": {
    "statusCode": 409,
    "message": "Request has already been accepted or rejected"
  },
  "ALREADY_VOTED": {
    "statusCode": 409,
    "message": "Caller has already voted"
  },
  "SEND_FAILED": {
    "statusCode": 500,
    "message": "Signature delivery failed"
  },
  "UPLOAD_FAILED": {
    "statusCode": 500,
    "message": "File storage failed"
  },
  "VOTE_FAILED": {
    "statusCode": 500,
    "message": "Vote recording failed"
  }
}
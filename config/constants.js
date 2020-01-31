const constant = {
  ROOT_PATH: "/var/www/html/cssr/", //APP_PATH
  EMAIL_PATH: "/var/www/html/cssr/config/", // EMAIL PATH
  BASEURL: "http://192.168.1.56/cssr/", //IP_ADDRESS
  WEBSITE: "http://192.168.1.56:4225/",
  APIURL: "http://192.168.1.56:4225/",
  WEBSITE_PATH: "http://13.64.112.49:4225/",
  // CHATURL: "http://192.168.1.35:8085/",
  // RESETPASSWORD:"http://192.168.1.34:3636/",

  // ---- BASEURL
  LOGO: "http://192.168.1.56/cssr/images/logo.svg",
  APP_PATH: '/var/www/html/cl/',
  IMAGE_PATH: '/var/www/html/cl/',

  LIMIT: '30',
  RADIUS: '5000',

  TOKEN_VALUE: '123456@Rdf',

  /**
   * ************************* Permission of features access. ***********************
   */
  CREATE_AESTHETICIAN: 2,
  VIEW_AESTHETICIAN: 4,
  UPDATE_AESTHETICIAN: 8,
  DELETE_AESTHETICIAN: 16,
  CREATE_PROVIDER: 32,
  VIEW_PROVIDER: 64,
  UPDATE_PROVIDER: 128,
  DELETE_PROVIDER: 256,
  CREATE_NEWS: 512,
  VIEW_NEWS: 1024,
  UPDATE_NEWS: 2048,
  DELETE_NEWS: 4096,
  CREATE_FEED: 8192,
  VIEW_FEED: 16384,
  UPDATE_FEED: 32768,
  DELETE_FEED: 65536,
  CREATE_EVENT: 131072,
  VIEW_EVENT: 262144,
  UPDATE_EVENT: 524288,
  DELETE_EVENT: 1048576,
  SUBADMINS: 2097152,

	/**
   * *************************** HTTP Status Code. ***********************************
   */
	ValidationStatusCode: 400,
	UnauthorizedStatusCode:401,
	ConflictStatusCode: 409,
	SuccessStatusCode: 200,
	ErrorStatusCode: 500,
	NotFoundStatusCode: 400 ,//204,//404 not in header, // not use for not recored.
  RecordNotFoundStatusCode: 400,

	/**
   * *******************************. Validations. ******************************************
   */
  EmailValidation:'Email is required.',
  AlreadyExists: "This email already exists.",
  FirstNameValidation: "First name is required.",
  LastNameValidation: "Last name is required.",
  PASSWORD_VALIDATION: "Password is required.",
  UserTypeValidation: "User type is required.",
  PhoneValidation: "Phone number is required.",
  AddressValidation: 'Address is required.',
  ID_VALIDATION : 'Id is required.',
  NameValidation: "Name is required.",
  MessageValidation: "Message is required.",
  TitleValidation: "Title is required.",
  NewId: "News id is required.",
  TESTIMONIAL_ADD_SUCCESS: "testimonial addedd successfully.",
  PARTNER_ADD_SUCCESS: "partner added successfully",
  SECURITY_QUESTION_VALIDATION: "Security question answer is required.",
  RESET_PASSWORD_TOKEN_VALIDATION: "Reset password token is required.",
  STATUS_VALIDATION: "Status is required.",
  COUNTRY_CODE_VALIDATION: "Country code is required.",
  SUBJECT_VALIDATION: "Subject is required.",
  TYPE_VALIDATION: "Type is required.",
  PERMIT_VALIDATION: "Permission is required.",
  ACTIVITY_VALIDATION: "Activity name is required.",
  DESCRIPTION_VALIDATION: "Description is required.",
  PUBLISH_DATE_VALIDATION: "Publish date is required.",
  CATEGORY_VALIDATION: "Category is required.",
  NEWS_LINK_VALIDATION: "News link is required.",
  CONTENT_VALIDATION: "Content is required.",
  LOCATION_VALIDATION: "Location is required.",
  START_DATE_VALIDATION: "Start date is required.",
  END_DATE_VALIDATION: "End date is required.",
  SCHEDULE_TYPE_VALIDATION: "Schedule type is required.",
  BOOKING_LINK_VALIDATION: "Booking link is required.",
  WEBSITE_VALIDATION: "Website is required.",
  IMAGE_VALIDATION: "Image name is required.",
  
	/**
   * ****************************************. Messages. *******************************************
   */
  LOGIN_SUCCESSFULL: "You are login successfully.",
  REGISTERD: 'You are registered successfully.',
  Updated: "Profile updated Successfully.",
  PostAddeddSuccessfully: "Post added successfully",
  CommentAddeddSuccessfully: "Comment addedd successfully.",
  RecordNotFound:'Record not found.',
  INVALID_USER: 'Invalid email or password.',
  ForgotMail: "If this email is registered with us, You will receive an email containing the password reset instructions.",
  INACTIVE_USER: 'Your account has been inactivated by admin. Please contact our support team.',
  TOKEN_VALIDATION: "Token is required.",
  CURRENT_PASSWORD_VALIDATION:"Current Password is required.",
  PASSWORD_NOT_MATCH: "Invalid current password.",
  EmailNotRegistered: "This email not registered with us.",
  SomethingWentWrong: "Something went wrong.",
	ADDUSER:'User added successfully',
  SiteUpdated : "Site detail updated successfully.",
  SiteAdd:"Site add successfully.",
  ProfileUpdated:'User profile updated successfully.',
  NEWSADD:'News added successfully.',
  EDITNEWS:'News updated successfully.',
  APPINFO:'App info updated successfully.',
  PAGECONTENT:'Page content updated succcessfully.',
  FAQ:'Faq updated successfully.',
  Added: "Added successfully.",
  Sent:"Invitation sent successfully.",
  ForgotMail: "If this email is registered with us, You will receive an email containing the password reset instructions.",
  UpdateAlready: "This site has been already updated.",
  AddMemeber: "Members added successfully.",
  NotificationId: "Notification id is requered.",
  Deleted: "Record deleted successfully.",
  Favourite: "Favourite Successfully.",
  UnFavorite: "Un favourite Successfully.",
  NotificationNot: "You don't have any notification yet.",
  AlreadyStarted: "This site has been already started.",
  Success: "Success",
  EMAIL_NOT_REGISTER: "This email is not registered with us.",
  RESET_PASSWORD_SUCCESS: "Password has been reset Successfully.",
  RESET_PASSWORD_LINK_EXPIRED: "Reset password link has been expired.",
  STATUS_ON_CHANGE: "Status STATUS successful.",
  SUB_ADMIN_REGISTER_SUCCESS: "Sub admin has been registered successfully, user will receive an email containing the login credentials.",
  SUB_ADMIN_EDIT_SUCCESS: "Sub admin profile has been updated successfully.",
  EMAIL_SENT: "Email has been sent successfully.",
  DELETE_MESSAGE: "TEXT has been deleted successfully.",
  ACCESS_DENIED: "Access denied",
  NEWS_ADD_SUCCESS: "News has been saved successfully.",
  EVENT_ADD_SUCCESS: "Event has been saved successfully.",
  NEWS_UPDATE: "News has been updated successfully.",
  CONTENT_ADD_SUCCESS:"Content has been updated successfully.",
  FEED_ADD_SUCCESS: "Feed has been saved successfully.",
  FEED_UPDATE: "Feed has been updated successfully.",
  EVENT_UPDATE: "Event has been updated successfully.",
  SLIDER_ADD_SUCCESS:"Slider has been updated successfully.",
  AESTHETICIAN_REGISTER_SUCCESS: "Aesthetician has been registered successfully, user will receive an email containing the login credentials.",
  AESTHETICIAN_EDIT_SUCCESS: "Aesthetician profile has been updated successfully.",
  PROVIDER_REGISTER_SUCCESS: "Provider has been registered successfully, user will receive an email containing the login credentials.",
  PROVIDER_EDIT_SUCCESS: "Provider profile has been updated successfully.",
  QUESTION_ADD_SUCCESS: "Question has been added successfully.",
  QUESTION_UPDATE: "Question has been updated successfully.",
  SOCIAL_PRODUCT_ADD_SUCCESS: "Social product has been saved successfully.",
  SOCIAL_PRODUCT_EDIT_SUCCESS: "Social product has been updated successfully.",
};
// export module pool to be used in other files
module.exports = Object.freeze(constant);
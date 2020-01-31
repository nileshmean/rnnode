// Permission middleware file.
var constants = require("./../config/constants")

permissionMiddleware = (req, res, next) => {
	var response = {};
	var userPermission = req.headers.permission ? req.headers.permission : "";
	var activity = req.headers.activity ? req.headers.activity : "";
	var allow = false;

	if (userPermission == "") {
		response.status = 400;
		response.message = constants.PERMIT_VALIDATION;
		return res.json(response);
	}

	if (activity == "") {
		response.status = 400;
		response.message = constants.ACTIVITY_VALIDATION;
		return res.json(response);
	}

	switch(activity) {
		case "CREATE_AESTHETICIAN":
			if ((userPermission & constants.CREATE_AESTHETICIAN) === constants.CREATE_AESTHETICIAN) { allow = true; }
			break;
		case "VIEW_AESTHETICIAN":
			if ((userPermission & constants.VIEW_AESTHETICIAN) === constants.VIEW_AESTHETICIAN) { allow = true; }
			break;
		case "UPDATE_AESTHETICIAN":
			if ((userPermission & constants.UPDATE_AESTHETICIAN) === constants.UPDATE_AESTHETICIAN) { allow = true; }
			break;
		case "DELETE_AESTHETICIAN":
			if ((userPermission & constants.DELETE_AESTHETICIAN) === constants.DELETE_AESTHETICIAN) { allow = true; }
			break;
		case "CREATE_PROVIDER":
			if ((userPermission & constants.CREATE_PROVIDER) === constants.CREATE_PROVIDER) { allow = true; }
			break;
		case "VIEW_PROVIDER":
			if ((userPermission & constants.VIEW_PROVIDER) === constants.VIEW_PROVIDER) { allow = true; }
			break;
		case "UPDATE_PROVIDER":
			if ((userPermission & constants.UPDATE_PROVIDER) === constants.UPDATE_PROVIDER) { allow = true; }
			break;
		case "DELETE_PROVIDER":
			if ((userPermission & constants.DELETE_PROVIDER) === constants.DELETE_PROVIDER) { allow = true; }
			break;
		case "CREATE_NEWS":
			if ((userPermission & constants.CREATE_NEWS) === constants.CREATE_NEWS) { allow = true; }
			break;
		case "VIEW_NEWS":
			if ((userPermission & constants.VIEW_NEWS) === constants.VIEW_NEWS) { allow = true; }
			break;
		case "UPDATE_NEWS":
			if ((userPermission & constants.UPDATE_NEWS) === constants.UPDATE_NEWS) { allow = true; }
			break;
		case "DELETE_NEWS":
			if ((userPermission & constants.DELETE_NEWS) === constants.DELETE_NEWS) { allow = true; }
			break;
		case "CREATE_FEED":
			if ((userPermission & constants.CREATE_FEED) === constants.CREATE_FEED) { allow = true; }
			break;
		case "VIEW_FEED":
			if ((userPermission & constants.VIEW_FEED) === constants.VIEW_FEED) { allow = true; }
			break;
		case "UPDATE_FEED":
			if ((userPermission & constants.UPDATE_FEED) === constants.UPDATE_FEED) { allow = true; }
			break;
		case "DELETE_FEED":
			if ((userPermission & constants.DELETE_FEED) === constants.DELETE_FEED) { allow = true; }
			break;
		case "CREATE_EVENT":
			if ((userPermission & constants.CREATE_EVENT) === constants.CREATE_EVENT) { allow = true; }
			break;
		case "VIEW_EVENT":
			if ((userPermission & constants.VIEW_EVENT) === constants.VIEW_EVENT) { allow = true; }
			break;
		case "UPDATE_EVENT":
			if ((userPermission & constants.UPDATE_EVENT) === constants.UPDATE_EVENT) { allow = true; }
			break;
		case "DELETE_EVENT":
			if ((userPermission & constants.DELETE_EVENT) === constants.DELETE_EVENT) { allow = true; }
			break;
		case "SUBADMINS":
			if ((userPermission & constants.SUBADMINS) === constants.SUBADMINS) { allow = true; }
			break;
	}
	
	if (allow) next();
	else {
		response.status = 403;
		response.message = constants.ACCESS_DENIED;
		return res.json(response);
	}
};
module.exports = permissionMiddleware;
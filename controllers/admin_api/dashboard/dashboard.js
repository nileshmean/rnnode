// Dashboard data.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

DashboardData = (req, res) => {
	var response = {};
	var data = {};
	var promises = [];
	var start_date = req.query.start_date ? req.query.start_date : "";
	var end_date = req.query.end_date ? req.query.end_date : "";

	var query1 = "SELECT COUNT(*) AS total_aestheticians FROM users WHERE type = 'aesthetician' AND deleted_at IS NULL";
	var query2 = "SELECT COUNT(*) AS total_providers FROM users WHERE type = 'provider' AND deleted_at IS NULL";
	var query3 = "SELECT COUNT(*) AS total_event FROM event WHERE deleted_at IS NULL";
	var query4 = "SELECT COUNT(*) AS total_feeds FROM feeds WHERE deleted_at IS NULL";
	var query5 = "SELECT COUNT(*) AS total_news FROM news WHERE deleted_at IS NULL";

	var data6 = { start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59" };
	var query6 = "SELECT date(created_at) AS registration_date, SUM(IF(type = 'aesthetician', 1, 0)) AS total_aestheticians, SUM(IF(type = 'provider', 1, 0)) AS total_providers FROM users WHERE deleted_at IS NULL";

	if (start_date != "") {
		query6 += " AND date(created_at) >= :start_date";
	}

	if (end_date != "") {
		query6 += " AND date(created_at) <= :end_date";
	}

	query6 += " GROUP BY date(created_at) ORDER BY date(created_at) DESC LIMIT 0, 10";

	promises.push(
		dbConnection.query(query1, { type: dbConnection.QueryTypes.SELECT })
		.then(result => { data.total_aestheticians = result[0].total_aestheticians }),

		dbConnection.query(query2, { type: dbConnection.QueryTypes.SELECT })
		.then(result => { data.total_providers = result[0].total_providers }),

		dbConnection.query(query3, { type: dbConnection.QueryTypes.SELECT })
		.then(result => { data.total_event = result[0].total_event }),

		dbConnection.query(query4, { type: dbConnection.QueryTypes.SELECT })
		.then(result => { data.total_feeds = result[0].total_feeds }),

		dbConnection.query(query5, { type: dbConnection.QueryTypes.SELECT })
		.then(result => { data.total_news = result[0].total_news }),

		dbConnection.query(query6, { replacements: data6, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			// data.chart_data = result
			const rawData = [];
			result.forEach(element => {
				rawData.push({registration_date: moment(element.registration_date).format("DD-MM-YYYY"), total_aestheticians: element.total_aestheticians, total_providers: element.total_providers});
			});
			data.chart_data = rawData
		}),
	);

	Promise.all(promises)
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = "Dashboard data.";
		response.result = data;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into dashboard.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
};
module.exports = DashboardData;
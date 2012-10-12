
/*
 * GET users listing.
 */
exports.users = function(req, res) {
	res.render('users', { title: 'Express' });
};

exports.member = function(req, res) {
	res.render('members', { title: 'Express' });
};
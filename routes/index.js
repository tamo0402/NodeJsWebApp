
/*
 * POST home page.
 */
exports.index = function(req, res) {
	// POSTデータから名前を取得してviewに登録。
    res.render('index', { userName: req.body.name });
};
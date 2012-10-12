/**
 * Module dependencies.
 */

// 必要なモジュール。
var express = require('express')
  , routes  = require('./routes')
  , http    = require('http')
  , path    = require('path')
  , OAuth   = require('oauth').OAuth;

// 初期設定。
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function(){
  app.use(express.errorHandler());
});


// GETで来た時の処理。
app.get('/', function(req, res) {
	res.send("this 404 page");
});

// POSTで来た時の処理。
app.post('/', function(req, res) {
	res.send(req.body.name);
});


// サーバー作成。
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


// socket.ioの処理。
// あとで






// OAuthの処理。
var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    "UFDgls0uEgFGEefKcGRww",
    "ClSGapDl4DKSUQKGVKPLh58vl5LaMKKF7N6eE2Xy2E",
    "1.0",
    "http://thematalk.com:3000/auth/twitter/callback",
    "HMAC-SHA1"
);

//auth/twitterにアクセスするとTwitterアプリケーション認証画面に遷移します。
app.get('/auth/twitter', function(req, res) {
    oa.getOAuthRequestToken(
        function(error, oauth_token, oauth_token_secret, results) {
            if (error) {
                console.log(error);
                res.send("yeah no. didn't work.");
            } else {
                req.session.oauth = {};
                req.session.oauth.token = oauth_token;
                console.log('oauth.token: ' + req.session.oauth.token);
                req.session.oauth.token_secret = oauth_token_secret;
                console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
                res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);
            }
        }
    );
});

// twitterログインコールバック処理。
app.get('/auth/twitter/callback', function(req, res, next) {
    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth = req.session.oauth;
        oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier,
            function(error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                console.log(error);
                res.redirect('http://thematalk.com');
            } else {
                req.session.oauth.access_token = oauth_access_token;
                req.session.oauth.access_token_secret = oauth_access_token_secret;
                console.log(results);
                res.send(results.screen_name);
                //res.render('index', { userName : results.screen_name });
            }
        });
    } else {
        next(new Error("you're not supposed to be here."));
    }
});



module.exports = function (app) {
    return {
        index: function (req, res) {
            var params = { email: req.params.email };
            res.render('chat/index', params);
        }
    };
};
const controller = require('app/http/controllers/controller');

class courseController extends controller {
    index(req , res) {
        res.render('admin/index');
    }

    uploadImage(req, res) {
        let image = req.file;
        res.json({

        });


    }

}

module.exports = new courseController();
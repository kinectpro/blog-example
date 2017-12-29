var config = require('../../config/config');
var Post = require('./post.model.js');
 

exports.createPost = function(req, res) {

    var post = new Post();

    post.title = req.body.title;
    post.description = req.body.description;
    post.owner = req.user._id;
    post.tags = req.body.tags || [];
    post.likes = 0;
    post.dislikes = 0;
    post.published = true;
    post.user = req.user.name;

    post.save(function(err, doc) {

        if (err)
            res.status(404).end();

        res.send(doc);
    });
};



exports.updatePost = function(req, res) {

    Post.findById(req.body._id, function(err, post) {

        if (err)
            res.status(404).end();

        if (req.body.owner === req.user._id) {

            post.title = req.body.title;
            post.description = req.body.description;
            post.published = req.body.published;
            post.tags = req.body.tags || [];

            post.save(function(err, doc) {
                if (err)
                    res.status(404).end();

                return res.send(doc);
            });

        } else {
            res.status(404).end();
        }
    });
}

exports.publishPost = function(req, res) {

    Post.findById(req.body._id, function(err, post) {

        if (err)
            res.status(404).end();

 
        if ( JSON.stringify(post.owner) === JSON.stringify(req.user._id)) {
      
            if (req.body.published === true){
                post.published = true;
            }

            if (req.body.published === false){
                post.published = false;
            }

            post.save(function(err) {
                if (err)
                    res.status(404).end();

                return res.end();
            });

        } else {
            res.status(404).end();
        }
    });
}

exports.deletePost = function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
 
        if (err)
            res.status(404).end();

        if (post.owner.toString() === req.user._id) {
      
             Post.findOneAndRemove({
                _id: req.params.post_id
            }, function(err, post) {
                if (err)
                    res.status(404).end();
          
                res.end()
            });

        } else {
            res.status(404).end();
        }
    });

}

exports.getAllPosts = function(req, res) {
    Post.find({
            "published": true
        })
        .exec(function(err, post) {
            if (err) {
                res.end();
            }
            res.json(post);
        });

}
    

exports.getPostBySlug = function(req, res) {
 
    var params = req.params;
    var slug = params.year + "/" + params.month + "/" + params.day + "/" + params.slug;

    Post.find({
            "slug": slug
        })

        .exec(function(err, post) {
            if (err) {
                res.send(err);
            }

            res.json(post);
        });
}


exports.like = function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {

        if (err)
            res.send(err).end();

        if(post) {
            post.likes = post.likes + 1;
            post.save(function (err, doc) {
                if (err)
                    res.status(404).end();
                return res.send(doc);
            });
        } else {
            res.send(404).end();
        }
    });
};

exports.dislike = function(req, res) {

    Post.findById(req.params.post_id, function(err, post) {

        if (err)
            res.send(err).end();

        if(post) {
            post.dislikes = post.dislikes + 1;
            post.save(function (err, doc) {
                if (err)
                    res.status(404).end();
                return res.send(doc);
            });
        } else {
            res.send(404).end();
        }
    });

};
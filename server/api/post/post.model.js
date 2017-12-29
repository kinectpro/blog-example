var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var PostSchema = new Schema({

    title: String,
    description: String,
    slug: String,
    tags: [String],
    likes: Number,
    dislikes: Number,
    date: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'Owner' },
    published: { type: Boolean, default: true },
    user: String

});


PostSchema.pre('save', function(next) {
    this.slug = slugify(this.title, this.date);
    next();
});



function slugify(text, date) {

    var randomnumber = Math.floor((Math.random() * 900) + 100).toString();
    var formatted = moment(date).format('YYYY[/]MM[/]DD[/]');

    return (formatted + text.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '')) // Trim - from end of text
        + randomnumber;
}



module.exports = Post = mongoose.model('Post', PostSchema);

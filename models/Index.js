const Usuario = require('./Usuario');
const Post = require('./Post');
const Image = require('./Image');
const Comment = require('./Comment');


Usuario.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(Usuario, { foreignKey: 'user_id' });

Post.hasMany(Image, { foreignKey: 'post_id' });
Image.belongsTo(Post, { foreignKey: 'post_id' });


Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

Usuario.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(Usuario, { foreignKey: 'user_id' });

module.exports = {
    Usuario,
    Post,
    Image,
    Comment 
};